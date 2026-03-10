import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const MODE_COLORS = {
  normal:   'bg-accent-500',
  simple:   'bg-emerald-500',
  calcul:   'bg-amber-500',
  revision: 'bg-rose-500',
};

export default function ChatList({
  sessions,
  activeSessionId,
  onSelect,
  onDelete,
}) {
  if (!sessions || sessions.length === 0) {
    return (
      <p className="text-[0.72rem] text-white/20 px-3 py-2 italic">
        Aucune conversation récente
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      <AnimatePresence initial={false}>
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const dotColor = MODE_COLORS[session.mode] || 'bg-white/20';

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.18 }}
              className="group relative"
            >
              <button
                onClick={() => onSelect(session.id)}
                className={`
                  w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8rem] transition-all duration-150 pr-8
                  ${isActive
                    ? 'bg-white/[0.07] text-white'
                    : 'text-white/45 hover:text-white/70 hover:bg-white/[0.03]'}
                `}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                <span className="truncate leading-snug">{session.title}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/25 hover:text-rose-400 transition-all duration-150 p-1 rounded"
              >
                <Trash2 size={11} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
