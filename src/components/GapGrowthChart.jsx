import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatBRL } from '../lib/engine.js';

/**
 * Mini bar chart genérico mostrando o crescimento de uma trajetória ano a ano.
 * Usado em todos os 3 ScenarioCards (lead / institucional / gap).
 *
 * Props:
 *   trajectory: array de valores indexados por ano (0..N)
 *   horizon:    número total de anos
 *   color:      cor base (hex)
 *   label:      texto do header (default 'Crescimento ano a ano')
 *   tagline:    legenda italic embaixo (opcional)
 */
export default function GapGrowthChart({
  trajectory,
  horizon,
  color = '#F87171',
  label = 'Crescimento ano a ano',
  tagline,
}) {
  const data = useMemo(() => {
    if (!trajectory || trajectory.length === 0) return [];
    const yearsToShow = horizon <= 5
      ? Array.from({ length: horizon }, (_, i) => i + 1)
      : [1, Math.ceil(horizon * 0.3), Math.ceil(horizon * 0.5), Math.ceil(horizon * 0.7), horizon];
    const unique = [...new Set(yearsToShow)].filter((y) => y >= 1 && y <= horizon);
    return unique.map((y) => ({
      year:  y,
      value: Math.max(0, trajectory[y] || 0),
    }));
  }, [trajectory, horizon]);

  if (data.length === 0) return null;
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-1.5">
      <div className="text-[10px] tracking-[0.18em] uppercase text-txt-3 font-bold mb-2.5">
        {label}
      </div>
      {data.map((d, i) => {
        const w = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
        const isLast = i === data.length - 1;
        return (
          <motion.div
            key={d.year}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="grid grid-cols-[44px_1fr_auto] gap-2.5 items-center text-[11px]"
          >
            <span className="font-mono text-txt-3">A{d.year}</span>
            <div className="h-2.5 rounded-full bg-input overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${w}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.15, duration: 0.55, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: isLast
                    ? `linear-gradient(90deg, ${color}88, ${color})`
                    : `linear-gradient(90deg, ${color}44, ${color}88)`,
                  boxShadow: isLast ? `0 0 10px ${color}55` : 'none',
                }}
              />
            </div>
            <span
              className={`font-mono tabular-nums ${isLast ? 'font-bold' : 'text-txt-2'}`}
              style={isLast ? { color } : {}}
            >
              {formatBRL(d.value, true)}
            </span>
          </motion.div>
        );
      })}
      {tagline && (
        <p className="text-[10px] text-txt-4 italic mt-2 leading-snug">{tagline}</p>
      )}
    </div>
  );
}
