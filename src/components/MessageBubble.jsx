import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, User, Bot, CheckCheck, AlertCircle } from 'lucide-react';
import TypingIndicator from './TypingIndicator.jsx';

/**
 * Render plain text as lightweight HTML-like structure.
 * Handles bold (**text**), section headers (lines ending with ':'),
 * bullet points, and emoji section markers.
 */
function renderMessageContent(text) {
  const lines = text.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      result.push(<br key={`br-${i}`} />);
    } else if (trimmed.startsWith('## ')) {
      result.push(
        <h2 key={`h2-${i}`} className="text-[0.95em] font-semibold text-white/90 mt-3 mb-1.5 flex items-center gap-1.5">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      result.push(
        <h1 key={`h1-${i}`} className="text-[1em] font-bold text-white/95 mt-3 mb-1.5">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('### ')) {
      result.push(
        <h3 key={`h3-${i}`} className="text-[0.875em] font-semibold text-accent-300 mt-2.5 mb-1">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      // Collect consecutive list items
      const items = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('• '))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="my-2 space-y-1 pl-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[0.9em] text-white/75">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-400/70 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
        num++;
      }
      result.push(
        <ol key={`ol-${i}`} className="my-2 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[0.9em] text-white/75">
              <span className="text-accent-400 font-mono text-[0.8em] mt-0.5 shrink-0">{idx + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (trimmed.startsWith('> ')) {
      result.push(
        <blockquote key={`bq-${i}`} className="border-l-2 border-accent-500/50 pl-3 my-2 text-white/60 italic text-[0.9em]">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed === '---' || trimmed === '***') {
      result.push(<hr key={`hr-${i}`} className="border-white/[0.07] my-3" />);
    } else {
      // Regular paragraph
      result.push(
        <p key={`p-${i}`} className="text-[0.9em] text-white/80 leading-[1.8]">
          {renderInline(trimmed)}
        </p>
      );
    }
    i++;
  }

  return result;
}

/**
 * Render inline markdown: **bold**, *italic*, `code`
 */
function renderInline(text) {
  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|📐|🔢|✅|📊|📌|💡|⚠️|🎯|📈|📉)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const m = match[0];
    if (m.startsWith('**') && m.endsWith('**')) {
      parts.push(<strong key={match.index} className="text-white font-semibold">{m.slice(2, -2)}</strong>);
    } else if (m.startsWith('*') && m.endsWith('*')) {
      parts.push(<em key={match.index} className="text-white/70 italic">{m.slice(1, -1)}</em>);
    } else if (m.startsWith('`') && m.endsWith('`')) {
      parts.push(
        <code key={match.index} className="font-mono text-[0.85em] bg-white/[0.07] border border-white/10 rounded px-1.5 py-0.5 text-blue-300">
          {m.slice(1, -1)}
        </code>
      );
    } else {
      parts.push(m);
    }
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

export default function MessageBubble({ message, onCopy, onRegenerate, isLast, isLoading }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.isError;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`flex gap-3 px-2 sm:px-4 py-2 group ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 ${isError ? 'bg-rose-900/60 border border-rose-700/40' : 'bg-gradient-to-br from-accent-500 to-accent-700 shadow-md shadow-accent-900/40'}`}>
          {isError ? <AlertCircle size={13} className="text-rose-300" /> : <Bot size={13} className="text-white" />}
        </div>
      )}

      {/* Content */}
      <div className={`max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`
            relative rounded-2xl px-4 py-3 text-sm
            ${isUser
              ? 'bg-accent-600/25 border border-accent-500/20 text-white/90 rounded-br-sm'
              : isError
                ? 'bg-rose-950/40 border border-rose-800/30 text-rose-300 rounded-bl-sm'
                : 'bg-white/[0.04] border border-white/[0.06] text-white/85 rounded-bl-sm'
            }
          `}
        >
          {isLoading && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="message-content space-y-0.5">
              {renderMessageContent(message.content || '')}
            </div>
          )}
        </div>

        {/* Time + actions row */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[0.62rem] text-white/20">
            {formatTime(message.timestamp)}
          </span>

          {!isLoading && !isUser && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleCopy}
                title="Copier"
                className="text-white/25 hover:text-white/60 p-1 rounded transition-colors"
              >
                {copied ? <CheckCheck size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Régénérer"
                  className="text-white/25 hover:text-white/60 p-1 rounded transition-colors"
                >
                  <RefreshCw size={11} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5 bg-white/[0.07] border border-white/[0.08]">
          <User size={13} className="text-white/60" />
        </div>
      )}
    </motion.div>
  );
}
