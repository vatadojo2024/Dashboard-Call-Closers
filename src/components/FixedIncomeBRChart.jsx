import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Sparkles, AlertTriangle } from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import OperatorTooltip from './OperatorTooltip.jsx';
import { buildRfBRinUSD, formatBRL, formatUSD } from '../lib/engine.js';

function SideStat({ title, main, sub, color, warn }) {
  return (
    <div
      className="rounded-2xl p-5 border border-border bg-input"
      style={{ borderTop: `2px solid ${color}` }}
    >
      <div className="text-[10px] tracking-[0.18em] uppercase text-txt-4 mb-2 font-semibold">
        {title}
      </div>
      <div className="text-[28px] font-mono font-bold tabular-nums leading-none" style={{ color }}>
        {main}
      </div>
      <div className="text-[12px] text-txt-3 font-mono mt-1">{sub}</div>
      {warn && (
        <div className="text-[11px] text-amber mt-3 flex items-center gap-1.5 leading-tight">
          <AlertTriangle className="w-3 h-3" /> {warn}
        </div>
      )}
    </div>
  );
}

export default function FixedIncomeBRChart() {
  const initial = 100_000;
  const data = useMemo(() => {
    const traj = buildRfBRinUSD(initial);
    return traj.map((p) => ({ year: String(p.year), brl: p.valueBRL, usd: p.value }));
  }, []);

  const badge = (
    <span className="badge bg-emerald/15 text-emerald border border-emerald/30">
      <Sparkles className="w-3 h-3" />
      Ponto central da narrativa
    </span>
  );

  return (
    <ChartCard
      title="Sua renda fixa brasileira: como ela se comporta quando você sai do real"
      subtitle="Carteira ponderada típica: 40% CDI + 25% LCI/LCA + 20% IPCA+5,5% + 15% CRI/CRA · R$ 100.000 iniciais"
      variant="glow"
      badge={badge}
      footer={
        <p className="text-[14px] text-txt-2 italic leading-relaxed max-w-3xl">
          "Sua renda fixa rendeu menos de 6% ao ano em dólar. O S&P, sentado parado, fez quase 14%. Em moeda forte. É essa a régua que o operador institucional usa."
        </p>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[340px]">
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
              <Tooltip
                content={
                  <OperatorTooltip
                    formatter={(v, n) => (n === 'Em BRL' ? formatBRL(v) : formatUSD(v))}
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                yAxisId="brl"
                type="monotone"
                dataKey="brl"
                name="Em BRL"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="usd"
                type="monotone"
                dataKey="usd"
                name="Em USD"
                stroke="#F87171"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <SideStat title="BRL nominal"                            main="+147%" sub="9,5% a.a." color="#10B981" />
          <SideStat title="BRL real (− Índice Vata)"               main="+35%"  sub="3,1% a.a." color="#94A3B8" warn="Vs +49% pelo IPCA oficial" />
          <SideStat title="USD"                                    main="+77%"  sub="5,9% a.a." color="#F87171" warn="Volatilidade ~17% ao ano" />
        </div>
      </div>
    </ChartCard>
  );
}
