import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, StopCircle } from 'lucide-react';
import ModeSwitcher from './ModeSwitcher.jsx';

export default function Composer({ value, onChange, onSend, isLoading, mode, onModeChange }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="sticky bottom-0 z-10 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/95 to-transparent pt-4 pb-4 px-3 sm:px-5">
      {/* Mode switcher */}
      <div className="max-w-2xl mx-auto mb-2.5">
        <ModeSwitcher mode={mode} onModeChange={onModeChange} />
      </div>

      {/* Composer box */}
      <div className="max-w-2xl mx-auto">
        <div className={`
          relative flex flex-col gap-2 rounded-2xl border bg-[#14141a] transition-all duration-200
          ${isLoading ? 'border-accent-600/30' : 'border-white/[0.08] hover:border-white/[0.13] focus-within:border-accent-500/40 focus-within:shadow-lg focus-within:shadow-accent-900/20'}
        `}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            placeholder="Pose une question sur l'économie générale..."
            className="
              w-full px-4 pt-3.5 pb-2 bg-transparent text-[0.9rem] text-white/85
              placeholder:text-white/25 focus:outline-none resize-none
              disabled:opacity-50 disabled:cursor-not-allowed
              leading-relaxed max-h-[200px] overflow-y-auto
            "
          />

          <div className="flex items-center justify-between px-3 pb-2.5">
            <p className="text-[0.67rem] text-white/20 hidden sm:block max-w-xs truncate">
              Exemples : inflation, chômage, marché, monnaie, agrégats, calculs…
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[0.62rem] text-white/18 hidden sm:block">
                {isLoading ? 'Génération…' : '⏎ Envoyer · ⇧⏎ Saut de ligne'}
              </span>
              <motion.button
                whileHover={canSend || isLoading ? { scale: 1.05 } : {}}
                whileTap={canSend || isLoading ? { scale: 0.94 } : {}}
                onClick={onSend}
                disabled={!canSend && !isLoading}
                title={isLoading ? 'En cours…' : 'Envoyer'}
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200
                  ${canSend
                    ? 'bg-accent-600 hover:bg-accent-500 text-white shadow-md shadow-accent-900/50'
                    : isLoading
                      ? 'bg-accent-800/40 text-accent-400 cursor-not-allowed'
                      : 'bg-white/[0.05] text-white/20 cursor-not-allowed'
                  }
                `}
              >
                {isLoading
                  ? <StopCircle size={14} className="animate-pulse" />
                  : <Send size={14} />
                }
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[0.62rem] text-white/15 mt-2">
          EcoBac AI peut faire des erreurs. Vérifiez les informations importantes.
        </p>
      </div>
    </div>
  );
}
