import { MapPin } from 'lucide-react';
import { TRADUCAO_OPERADOR } from '../lib/data.js';

/**
 * Custom Recharts tooltip que enriquece tooltips dos charts históricos
 * com a "tradução do operador" para anos chave (2018, 2020, 2022, 2024).
 *
 * Uso: <Tooltip content={<OperatorTooltip formatter={fn} />} />
 */
export default function OperatorTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  const yearNum = parseInt(label, 10);
  const traducao = TRADUCAO_OPERADOR[yearNum];

  return (
    <div
      className="rounded-xl border border-border-strong bg-input/95 backdrop-blur-md shadow-soft px-4 py-3"
      style={{ maxWidth: traducao ? 360 : 280, fontFamily: 'Inter' }}
    >
      <div className="text-[11px] tracking-[0.18em] uppercase text-txt-3 font-semibold mb-2">
        {label}
      </div>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name + item.dataKey} className="flex items-center justify-between gap-4 text-[12px]">
            <span className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-txt-2">{item.name}</span>
            </span>
            <span className="font-mono tabular-nums text-txt-1 font-semibold">
              {formatter ? formatter(item.value, item.name, item) : item.value}
            </span>
          </div>
        ))}
      </div>

      {traducao && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-emerald font-bold mb-1.5">
            <MapPin className="w-3 h-3" /> {traducao.titulo}
          </div>
          <div className="text-[12px] text-txt-2 leading-relaxed">
            {traducao.leitura}
          </div>
        </div>
      )}
    </div>
  );
}
