import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { callFireworksAPI } from './lib/api.js';
import {
  loadSessions,
  saveSessions,
  upsertSession,
  deleteSession,
  generateTitle,
  generateId,
  createSession,
} from './lib/storage.js';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Session management
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = loadSessions();
    return saved.length > 0 ? saved[0].id : null;
  });

  // Chat state
  const [messages, setMessages] = useState(() => {
    const saved = loadSessions();
    if (saved.length > 0) return saved[0].messages || [];
    return [];
  });
  const [mode, setMode] = useState(() => {
    const saved = loadSessions();
    if (saved.length > 0) return saved[0].mode || 'normal';
    return 'normal';
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Active session ref to avoid stale closure issues
  const activeSessionRef = useRef(activeSessionId);
  activeSessionRef.current = activeSessionId;

  // Persist changes
  const persistSession = useCallback((sessionId, msgs, sessionMode, title) => {
    const session = {
      id: sessionId,
      title: title || generateTitle(msgs.find(m => m.role === 'user')?.content || 'Nouvelle conversation'),
      messages: msgs,
      mode: sessionMode,
      updatedAt: new Date().toISOString(),
    };
    upsertSession(session);
    setSessions(loadSessions());
  }, []);

  // Switch to a session
  const handleSelectSession = useCallback((sessionId) => {
    const allSessions = loadSessions();
    const session = allSessions.find(s => s.id === sessionId);
    if (!session) return;
    setActiveSessionId(sessionId);
    setMessages(session.messages || []);
    setMode(session.mode || 'normal');
    setInput('');
    setIsLoading(false);
    setIsTyping(false);
  }, []);

  // New chat
  const handleNewChat = useCallback(() => {
    const session = createSession();
    upsertSession(session);
    setSessions(loadSessions());
    setActiveSessionId(session.id);
    setMessages([]);
    setMode('normal');
    setInput('');
    setIsLoading(false);
    setIsTyping(false);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  // Delete session
  const handleDeleteSession = useCallback((sessionId) => {
    deleteSession(sessionId);
    const remaining = loadSessions();
    setSessions(remaining);
    if (activeSessionRef.current === sessionId) {
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
        setMode('normal');
      }
    }
  }, [handleSelectSession]);

  // Send message
  const handleSend = useCallback(async (overrideInput) => {
    const text = (overrideInput ?? input).trim();
    if (!text || isLoading) return;

    // Ensure we have an active session
    let sessionId = activeSessionRef.current;
    if (!sessionId) {
      const newSession = createSession();
      upsertSession(newSession);
      sessionId = newSession.id;
      setActiveSessionId(sessionId);
      setSessions(loadSessions());
    }

    const userMsg = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // Persist immediately with user message
    const titleFromFirst = newMessages.find(m => m.role === 'user')?.content;
    persistSession(sessionId, newMessages, mode, generateTitle(titleFromFirst || 'Chat'));

    // Prepare conversation history for API (exclude error messages)
    const apiMessages = newMessages
      .filter(m => !m.isError)
      .map(({ role, content }) => ({ role, content }));

    try {
      const reply = await callFireworksAPI(apiMessages, mode);

      if (activeSessionRef.current !== sessionId) return; // session changed mid-flight

      const assistantMsg = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      persistSession(sessionId, finalMessages, mode, generateTitle(titleFromFirst || 'Chat'));
    } catch (err) {
      if (activeSessionRef.current !== sessionId) return;

      const errorMsg = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Erreur** : ${err.message || 'Une erreur est survenue. Vérifiez votre clé API et votre connexion.'}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };

      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      persistSession(sessionId, finalMessages, mode, generateTitle(titleFromFirst || 'Chat'));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [input, messages, mode, isLoading, persistSession]);

  // Suggestion click
  const handleSuggestion = useCallback((prompt) => {
    handleSend(prompt);
  }, [handleSend]);

  // Regenerate last answer
  const handleRegenerate = useCallback(() => {
    // Remove the last assistant message and resend
    const lastUserIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;
    const idx = messages.length - 1 - lastUserIndex;
    const trimmedMessages = messages.slice(0, idx + 1);
    const lastUserContent = messages[idx].content;
    setMessages(trimmedMessages);
    // Directly call API
    setTimeout(() => {
      setInput(lastUserContent);
      // Trigger send programmatically
      handleSendDirect(lastUserContent, trimmedMessages);
    }, 50);
  }, [messages]);

  // Direct send helper for regenerate
  const handleSendDirect = useCallback(async (text, existingMessages) => {
    if (!text || isLoading) return;

    let sessionId = activeSessionRef.current;
    if (!sessionId) return;

    setIsLoading(true);
    setIsTyping(true);
    setInput('');

    const apiMessages = existingMessages
      .filter(m => !m.isError)
      .map(({ role, content }) => ({ role, content }));

    try {
      const reply = await callFireworksAPI(apiMessages, mode);
      if (activeSessionRef.current !== sessionId) return;

      const assistantMsg = {
        id: generateId(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...existingMessages, assistantMsg];
      setMessages(finalMessages);
      persistSession(sessionId, finalMessages, mode, generateTitle(text));
    } catch (err) {
      if (activeSessionRef.current !== sessionId) return;
      const errorMsg = {
        id: generateId(),
        role: 'assistant',
        content: `❌ **Erreur** : ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      const finalMessages = [...existingMessages, errorMsg];
      setMessages(finalMessages);
      persistSession(sessionId, finalMessages, mode, generateTitle(text));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isLoading, mode, persistSession]);

  // Clear current chat
  const handleClearChat = useCallback(() => {
    if (!activeSessionRef.current) return;
    setMessages([]);
    persistSession(activeSessionRef.current, [], mode, 'Conversation effacée');
  }, [mode, persistSession]);

  // Export chat as TXT
  const handleExportChat = useCallback(() => {
    const lines = messages.map(m => {
      const role = m.role === 'user' ? 'Vous' : 'EcoBac AI';
      const time = new Date(m.timestamp).toLocaleString('fr-FR');
      return `[${time}] ${role}:\n${m.content}\n`;
    });
    const text = lines.join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecobac-conversation-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  // Mode change persists to current session
  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    if (activeSessionRef.current) {
      persistSession(activeSessionRef.current, messages, newMode);
    }
  }, [messages, persistSession]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0d0f]">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          mode={mode}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          isMobile={isMobile}
          hasMessages={messages.length > 0}
        />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          input={input}
          onInputChange={setInput}
          onSend={() => handleSend()}
          onSuggestion={handleSuggestion}
          onRegenerate={handleRegenerate}
          mode={mode}
          onModeChange={handleModeChange}
        />
      </div>
    </div>
  );
}
