import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell, LabelList,
} from 'recharts';
import ChartCard from './ChartCard.jsx';
import { IPCA_GRUPOS } from '../lib/data.js';
import InfoTooltip from './InfoTooltip.jsx';
import { TT } from '../lib/tooltips.js';

function colorFor(tipo) {
  if (tipo === 'vata')    return '#EF4444'; // crimson saturado — protagonista
  if (tipo === 'oficial') return '#94A3B8';
  if (tipo === 'cdi')     return '#10B981';
  return '#F87171';
}

function strokeFor(tipo) {
  return tipo === 'vata' ? '#FCA5A5' : 'transparent';
}

export default function InflationChart() {
  const data = IPCA_GRUPOS.map((g) => ({ name: g.grupo, value: g.pct, tipo: g.tipo }));

  return (
    <ChartCard
      title="Inflação que o governo conta vs. inflação que você paga"
      subtitle="Índice Vata = cesta real do HNWI (educação + saúde + alimentação + habitação + combustíveis + lazer)"
      rightAction={<InfoTooltip title={TT.vata.title} content={TT.vata.content} position="bottom" size="md" />}
      footer={
        <p className="text-[13px] text-txt-2 italic leading-relaxed max-w-3xl">
          "O governo te entrega 65%. A inflação que você efetivamente paga é 82%. Se sua renda fixa rendeu
          9% real acima do IPCA, ela rendeu apenas 1% real acima da sua inflação verdadeira."
        </p>
      }
    >
      <div className="h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 32, right: 60, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v + '%'}
              domain={[0, 105]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#E2E8F0' }}
              width={235}
            />
            <Tooltip formatter={(v) => v.toFixed(1) + '%'} />
            <ReferenceLine
              x={64.7}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'IPCA Oficial 64,7%',
                position: 'insideTopRight',
                fill: '#94A3B8',
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
                offset: 12,
              }}
            />
            <ReferenceLine
              x={82}
              stroke="#EF4444"
              strokeDasharray="2 4"
              strokeWidth={2}
              label={{
                value: 'Índice Vata 82%',
                position: 'top',
                fill: '#EF4444',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                offset: 14,
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={colorFor(d.tipo)}
                  stroke={strokeFor(d.tipo)}
                  strokeWidth={d.tipo === 'vata' ? 1 : 0}
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill="#E2E8F0"
                fontSize={11}
                fontFamily="JetBrains Mono"
                formatter={(v) => v.toFixed(0) + '%'}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-5 mt-4 text-[11px] text-txt-3 font-mono flex-wrap">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444] border border-[#FCA5A5]" /> Índice Vata (cesta real)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#94A3B8]" /> IPCA Oficial
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> CDI real (descontando Vata)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#F87171]" /> Inflação real do bolso
        </span>
      </div>
    </ChartCard>
  );
}
