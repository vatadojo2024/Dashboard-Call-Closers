import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, LabelList,
} from 'recharts';
import { ShieldAlert } from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import { MAG7 } from '../lib/data.js';

export default function Magnificent7Chart() {
  const data = [
    ...MAG7.map((m) => ({
      name: m.ticker,
      value: m.retornoAcumulado * 100,
      cagr: m.cagr,
      kind: 'mag7',
    })),
    { name: 'RF BR (USD)', value: 77, cagr: 5.9, kind: 'ref' },
  ];

  return (
    <ChartCard
      title="Magnificent 7 — onde o capital institucional esteve"
      subtitle="Retorno acumulado em 10 anos, em USD · linha de referência: Renda Fixa BR em USD"
      footer={
        <p className="text-[14px] text-txt-2 italic leading-relaxed max-w-3xl">
          "Não é coincidência que essas sejam as empresas mais valiosas do planeta. Não é sorte. É posicionamento. E posicionamento se aprende."
        </p>
      }
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 90, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k%' : v + '%')}
              scale="log"
              domain={[10, 50000]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 13, fill: '#FFFFFF', fontWeight: 600 }}
              width={120}
            />
            <Tooltip
              formatter={(v, n, p) => [
                v.toLocaleString('pt-BR') + '%  (CAGR ~' + p.payload.cagr + '% a.a.)',
                'Retorno acum.',
              ]}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.kind === 'mag7' ? '#00D67D' : '#F87171'} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill="#E2E8F0"
                fontSize={11}
                fontFamily="JetBrains Mono"
                formatter={(v) => v.toLocaleString('pt-BR') + '%'}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 rounded-xl p-4 bg-amber/5 border border-amber/30 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-amber font-bold mb-1">
            Disclaimer obrigatório
          </div>
          <p className="text-[12px] text-txt-2 leading-relaxed">
            Rentabilidade passada não é garantia de rentabilidade futura. Esta visualização tem caráter
            exclusivamente ilustrativo e didático. Não constitui recomendação de compra de ativos
            específicos.
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
