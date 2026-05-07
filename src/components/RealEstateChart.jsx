import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Building2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import OperatorTooltip from './OperatorTooltip.jsx';
import { buildImovelTrajectory, formatBRL, formatUSD } from '../lib/engine.js';

export default function RealEstateChart() {
  const initial = 100_000;
  const traj = useMemo(() => buildImovelTrajectory(initial), []);
  const data = traj.brl.map((p, i) => ({
    year: String(p.year),
    brl: p.value,
    usd: traj.usd[i].value,
  }));

  return (
    <ChartCard
      title="Imóvel: o ativo mais querido do brasileiro"
      subtitle="Índice FipeZap residencial · R$ 100.000 iniciais"
      footer={
        <p className="text-[13px] text-txt-3 italic leading-relaxed">
          "Pedra é bonita no extrato. Não compra mais o que comprava."
        </p>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="brl"
                orientation="left"
                tick={{ fontSize: 11, fill: '#10B981' }}
                tickFormatter={(v) => formatBRL(v, true)}
                width={70}
              />
              <YAxis
                yAxisId="usd"
                orientation="right"
                tick={{ fontSize: 11, fill: '#F87171' }}
                tickFormatter={(v) => formatUSD(v, true)}
                width={70}
              />
              <Tooltip content={<OperatorTooltip formatter={(v, n) => (n === 'Em BRL' ? formatBRL(v) : formatUSD(v))} />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} iconType="circle" iconSize={8} />
              <Line
                yAxisId="brl" type="monotone" dataKey="brl" name="Em BRL"
                stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="usd" type="monotone" dataKey="usd" name="Em USD"
                stroke="#F87171" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-input border border-border p-6 self-center">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-txt-3 mb-4 font-semibold">
            <Building2 className="w-4 h-4 text-amber" />
            "Meu apartamento valorizou."
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-txt-2 text-sm">Em BRL</span>
              <span className="flex items-center gap-1 text-emerald-2 font-mono text-2xl font-bold tabular-nums">
                <ArrowUpRight className="w-5 h-5" />
                +45%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-txt-2 text-sm">Em USD</span>
              <span className="flex items-center gap-1 text-rose font-mono text-2xl font-bold tabular-nums">
                <ArrowDownRight className="w-5 h-5" />
                −10%
              </span>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-border text-[13px] text-txt-2 leading-relaxed">
            Em poder de compra global,
            <br />
            <span className="text-rose font-semibold">você perdeu.</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
