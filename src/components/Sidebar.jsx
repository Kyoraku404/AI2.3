import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, MessageSquare, BookOpen, Calculator,
  GraduationCap, HelpCircle, ChevronLeft, ChevronRight,
  Wifi, Circle, Trash2
} from 'lucide-react';
import { MODES } from '../data/suggestions.js';
import { APP_NAME, APP_SUBTITLE, FIREWORKS_MODEL } from '../config/fireworks.js';

const NAV_SECTIONS = [
  { id: 'concepts', icon: BookOpen, label: 'Concepts' },
  { id: 'calculs', icon: Calculator, label: 'Calculs' },
  { id: 'revision', icon: GraduationCap, label: 'Révision Bac' },
  { id: 'faq', icon: HelpCircle, label: 'Questions fréquentes' },
];

const MODE_COLORS = {
  normal: 'bg-accent-600',
  simple: 'bg-emerald-500',
  calcul: 'bg-amber-500',
  revision: 'bg-rose-500',
};

export default function Sidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
}) {
  const modelShort = FIREWORKS_MODEL.split('/').pop()?.slice(0, 12) || 'model';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence initial={false}>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            key="sidebar"
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : {}}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className={`
              flex flex-col
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-72' : 'relative w-72 shrink-0'}
              bg-[#0f0f13] border-r border-white/[0.05]
              overflow-hidden
            `}
          >
            {/* Top: Logo + title */}
            <div className="px-4 pt-5 pb-3">
              <div className="flex items-center gap-3 mb-1">
                {/* Logo mark */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-900/50 shrink-0">
                  <span className="text-base font-bold text-white leading-none">E</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-[0.95rem] font-semibold text-white tracking-tight truncate">
                    {APP_NAME}
                  </h1>
                  <p className="text-[0.65rem] text-white/30 truncate mt-0.5 leading-tight">
                    Bac Économie · Maroc
                  </p>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto text-white/30 hover:text-white/60 transition-colors p-1 rounded-lg"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* New chat button */}
            <div className="px-3 pb-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewChat}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-accent-600/20 hover:bg-accent-600/30 border border-accent-500/20 text-accent-300 hover:text-accent-200 text-sm font-medium transition-all duration-200 group"
              >
                <PlusCircle size={16} className="shrink-0 group-hover:rotate-90 transition-transform duration-300" />
                Nouvelle conversation
              </motion.button>
            </div>

            {/* Section shortcuts */}
            <div className="px-3 mb-1">
              <p className="text-[0.65rem] font-semibold text-white/25 uppercase tracking-widest px-1 mb-1.5">
                Raccourcis
              </p>
              <div className="space-y-0.5">
                {NAV_SECTIONS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] text-[0.8rem] transition-all duration-150"
                  >
                    <Icon size={14} className="shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-white/[0.04] my-2" />

            {/* Recent conversations */}
            <div className="flex-1 overflow-y-auto px-3 min-h-0">
              {sessions.length > 0 && (
                <p className="text-[0.65rem] font-semibold text-white/25 uppercase tracking-widest px-1 mb-1.5">
                  Récents
                </p>
              )}
              <div className="space-y-0.5 pb-2">
                <AnimatePresence initial={false}>
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="group relative"
                    >
                      <button
                        onClick={() => {
                          onSelectSession(session.id);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className={`
                          w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg text-[0.8rem] transition-all duration-150
                          ${activeSessionId === session.id
                            ? 'bg-white/[0.07] text-white'
                            : 'text-white/45 hover:text-white/70 hover:bg-white/[0.03]'}
                        `}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${MODE_COLORS[session.mode] || 'bg-white/20'}`} />
                        <span className="truncate leading-snug">{session.title}</span>
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/25 hover:text-rose-400 transition-all duration-150 p-1 rounded"
                      >
                        <Trash2 size={11} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 text-[0.7rem] text-white/25 mb-1">
                <Wifi size={11} />
                <span className="truncate font-mono">{modelShort}</span>
                <span className="ml-auto flex items-center gap-1">
                  <Circle size={6} className="fill-emerald-400 text-emerald-400" />
                  Connecté
                </span>
              </div>
              <p className="text-[0.62rem] text-white/15 font-medium">
                Local Demo · {APP_NAME} v1.0
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
