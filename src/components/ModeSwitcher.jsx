import { motion } from 'framer-motion';
import { MODES } from '../data/suggestions.js';

const COLOR_MAP = {
  accent:  { active: 'border-accent-500/60  bg-accent-600/15  text-accent-300',  dot: 'bg-accent-500'  },
  emerald: { active: 'border-emerald-500/60 bg-emerald-600/15 text-emerald-300', dot: 'bg-emerald-500' },
  amber:   { active: 'border-amber-500/60   bg-amber-600/15   text-amber-300',   dot: 'bg-amber-500'   },
  rose:    { active: 'border-rose-500/60    bg-rose-600/15    text-rose-300',     dot: 'bg-rose-500'   },
};

export default function ModeSwitcher({ mode, onModeChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {MODES.map((m) => {
        const colors = COLOR_MAP[m.color] || COLOR_MAP.accent;
        const isActive = mode === m.id;
        return (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onModeChange(m.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[0.78rem] font-medium transition-all duration-200
              ${isActive
                ? colors.active + ' shadow-sm'
                : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.12] hover:bg-white/[0.04]'
              }
            `}
          >
            {isActive && (
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
            )}
            <span>{m.icon}</span>
            {m.label}
          </motion.button>
        );
      })}
    </div>
  );
}
