import { motion } from 'framer-motion';
import { SUGGESTIONS } from '../data/suggestions.js';
import { APP_NAME, APP_SUBTITLE } from '../config/fireworks.js';
import { BookOpen, Zap, Brain } from 'lucide-react';

const FEATURES = [
  { icon: Brain, text: 'Réponses pédagogiques structurées' },
  { icon: BookOpen, text: 'Concepts, calculs et révisions Bac' },
  { icon: Zap, text: 'Adapté au programme marocain' },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function EmptyState({ onSuggestion }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center h-full px-4 py-10 max-w-2xl mx-auto w-full text-center"
    >
      {/* Logo mark */}
      <motion.div variants={item} className="mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-800 flex items-center justify-center shadow-2xl shadow-accent-900/60 mx-auto mb-4">
          <span className="text-2xl font-bold text-white">E</span>
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Bienvenue sur <span className="gradient-text">{APP_NAME}</span>
        </h2>
        <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
          {APP_SUBTITLE}
        </p>
      </motion.div>

      {/* Features */}
      <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mb-8">
        {FEATURES.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1.5 text-[0.75rem] text-white/30 bg-white/[0.03] border border-white/[0.05] px-3 py-1.5 rounded-full"
          >
            <Icon size={12} className="text-accent-400 shrink-0" />
            {text}
          </div>
        ))}
      </motion.div>

      {/* Suggestion cards */}
      <motion.div variants={item}>
        <p className="text-[0.72rem] font-semibold uppercase tracking-widest text-white/20 mb-3">
          Suggestions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.045)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestion(s.prompt)}
              className="flex items-start gap-3 text-left px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 group"
            >
              <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
              <div className="min-w-0">
                <p className="text-[0.78rem] font-medium text-white/70 group-hover:text-white/90 transition-colors leading-snug">
                  {s.prompt}
                </p>
                <p className="text-[0.68rem] text-white/25 mt-0.5">{s.category}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
