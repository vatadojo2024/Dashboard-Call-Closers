import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * V1.6 — Tooltip explicativo pedagógico reutilizável.
 *
 * Ícone (i) discreto que abre um popover ao hover ou click.
 * ESC e click fora fecham.
 *
 * Props:
 *  - title?: string                  título do popover
 *  - content: string | JSX           conteúdo (texto ou JSX)
 *  - position?: 'top'|'bottom'|'left'|'right'  default 'top'
 *  - size?: 'sm' | 'md'              tamanho do ícone
 *  - variant?: 'subtle' | 'prominent'
 */
export default function InfoTooltip({
  title,
  content,
  position = 'top',
  size = 'sm',
  variant = 'subtle',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);

  const iconSize = size === 'sm' ? 14 : 16;
  const iconColor =
    variant === 'subtle'
      ? 'text-txt-4 hover:text-txt-1'
      : 'text-emerald hover:text-emerald-300';

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  const positionClasses = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  const motionInitial =
    position === 'top'    ? { opacity: 0, y: 4 } :
    position === 'bottom' ? { opacity: 0, y: -4 } :
    position === 'left'   ? { opacity: 0, x: 4 } :
                            { opacity: 0, x: -4 };

  return (
    <span
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative inline-flex items-center ${className}`}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`inline-flex items-center justify-center rounded-full transition-colors ${iconColor}`}
        aria-label={title || 'Mais informações'}
        aria-expanded={open}
      >
        <Info size={iconSize} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={motionInitial}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={motionInitial}
            transition={{ duration: 0.14 }}
            className={`absolute z-50 ${positionClasses} w-[min(384px,90vw)]`}
          >
            <div
              className="rounded-lg border border-border-strong bg-input/95 backdrop-blur-md
                         shadow-xl px-4 py-3 text-[12.5px] text-txt-2 leading-relaxed text-left
                         font-normal"
              style={{ fontFamily: 'Inter' }}
            >
              {title && (
                <div className="font-bold text-txt-1 mb-2 text-[10.5px] uppercase tracking-[0.14em]">
                  {title}
                </div>
              )}
              {typeof content === 'string' ? (
                <div className="whitespace-pre-line">{content}</div>
              ) : (
                content
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
