import { motion } from 'framer-motion';
import { Eraser, Download, Menu, Sparkles } from 'lucide-react';

const MODE_META = {
  normal:   { label: 'Normal',            color: 'text-accent-300   bg-accent-900/50  border-accent-700/30' },
  simple:   { label: 'Explication simple', color: 'text-emerald-400  bg-emerald-900/40 border-emerald-700/30' },
  calcul:   { label: 'Calcul économique', color: 'text-amber-400    bg-amber-900/40   border-amber-700/30' },
  revision: { label: 'Révision Bac',      color: 'text-rose-400     bg-rose-900/40    border-rose-700/30' },
};

export default function Header({
  mode,
  onClearChat,
  onExportChat,
  onToggleSidebar,
  isMobile,
  hasMessages,
}) {
  const meta = MODE_META[mode] || MODE_META.normal;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-white/[0.05] bg-[#0d0d0f]/80 backdrop-blur-xl">
      {/* Mobile toggle */}
      {isMobile && (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onToggleSidebar}
          className="text-white/40 hover:text-white/70 p-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
        >
          <Menu size={18} />
        </motion.button>
      )}

      {/* Title section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[0.875rem] font-semibold text-white/80 truncate">
            Économie Générale — Bac Maroc
          </h2>
          {/* Mode badge */}
          <span className={`inline-flex items-center gap-1 text-[0.68rem] px-2 py-0.5 rounded-full border font-medium ${meta.color}`}>
            <Sparkles size={9} />
            {meta.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {hasMessages && (
          <>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onExportChat}
              title="Exporter la conversation"
              className="text-white/35 hover:text-white/65 p-1.5 rounded-lg hover:bg-white/[0.05] transition-all text-[0.72rem] flex items-center gap-1"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Exporter</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onClearChat}
              title="Effacer la conversation"
              className="text-white/35 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-900/20 transition-all text-[0.72rem] flex items-center gap-1"
            >
              <Eraser size={15} />
              <span className="hidden sm:inline">Effacer</span>
            </motion.button>
          </>
        )}
      </div>
    </header>
  );
}
