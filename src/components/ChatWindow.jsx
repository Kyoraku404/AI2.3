import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageBubble from './MessageBubble.jsx';
import EmptyState from './EmptyState.jsx';
import Composer from './Composer.jsx';

export default function ChatWindow({
  messages,
  isLoading,
  isTyping,
  input,
  onInputChange,
  onSend,
  onSuggestion,
  onRegenerate,
  mode,
  onModeChange,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Scrollable message area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto min-h-0 pb-2">
        {!hasMessages ? (
          <EmptyState onSuggestion={onSuggestion} />
        ) : (
          <div className="max-w-2xl mx-auto w-full py-4 space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLast={idx === messages.length - 1}
                  onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? onRegenerate : null}
                  isLoading={false}
                />
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-3 px-2 sm:px-4 py-2 justify-start"
                >
                  <div className="w-7 h-7 rounded-lg shrink-0 mt-0.5 bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-md shadow-accent-900/40">
                    <span className="text-white text-[0.7rem] font-bold">E</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="typing-dot w-2 h-2 rounded-full bg-accent-400"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <Composer
        value={input}
        onChange={onInputChange}
        onSend={onSend}
        isLoading={isLoading}
        mode={mode}
        onModeChange={onModeChange}
      />
    </div>
  );
}
