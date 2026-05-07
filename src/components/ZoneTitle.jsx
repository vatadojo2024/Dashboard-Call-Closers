import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function ZoneTitle({ num, label, title, subtitle, quote, accent = 'emerald', compact = false }) {
  const accentMap = {
    emerald: { dot: 'bg-emerald', text: 'text-emerald', bar: 'border-emerald/40' },
    cyan:    { dot: 'bg-cyan',    text: 'text-cyan',    bar: 'border-cyan/40'    },
    rose:    { dot: 'bg-rose',    text: 'text-rose',    bar: 'border-rose/40'    },
  };
  const a = accentMap[accent] ?? accentMap.emerald;
  const padCls = compact ? 'pt-12 pb-5' : 'pt-20 pb-8';
  const titleCls = compact ? 'text-3xl' : 'text-4xl';
  const subCls = compact ? 'text-[15px] mt-1.5' : 'text-base mt-2';
  const quoteCls = compact ? 'mt-4 text-[14px]' : 'mt-6 text-[15px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={`max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 ${padCls}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
        <span className={`text-[11px] tracking-[0.28em] ${a.text} font-mono font-bold`}>
          ZONA {num} · {label}
        </span>
      </div>
      <h2 className={`${titleCls} font-bold text-txt-1 tracking-tight`}>{title}</h2>
      {subtitle && <div className={`${subCls} text-txt-3 max-w-3xl leading-relaxed`}>{subtitle}</div>}
      {quote && (
        <blockquote className={`${quoteCls} max-w-3xl text-txt-2 italic border-l-2 ${a.bar} pl-5 leading-relaxed flex gap-3`}>
          <Quote className={`w-4 h-4 ${a.text} flex-shrink-0 mt-1`} />
          <span>{quote}</span>
        </blockquote>
      )}
    </motion.div>
  );
}
