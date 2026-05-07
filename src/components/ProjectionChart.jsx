import { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot,
  ComposedChart,
} from 'recharts';
import { Pin } from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import { formatBRL, formatUSD } from '../lib/engine.js';
import { USD_BRL } from '../lib/data.js';

const RETIREMENT_MARKERS = [60, 65, 70];

function buildAxisLabel(yearIdx, leadAge) {
  if (leadAge != null) return `${leadAge + yearIdx} anos`;
  return `Ano ${yearIdx}`;
}

function ProjView({ data, currency, horizon, leadAge, fixedScenario }) {
  const fmt = currency === 'USD' ? formatUSD : formatBRL;
  const leadKey = currency === 'USD' ? 'leadUSD' : 'leadBRL';
  const instKey = currency === 'USD' ? 'instUSD' : 'instBRL';
  const fixedLeadKey = currency === 'USD' ? 'fixedLeadUSD' : 'fixedLeadBRL';
  const fixedInstKey = currency === 'USD' ? 'fixedInstUSD' : 'fixedInstBRL';
  const idGrad  = `gradInst${currency}`;
  const idGradL = `gradLead${currency}`;

  const hasFixed = !!fixedScenario;

  // Marcadores de aposentadoria (apenas se idade preenchida)
  const retirementMarkers = useMemo(() => {
    if (leadAge == null) return [];
    return RETIREMENT_MARKERS
      .map((age) => ({ age, yearIdx: age - leadAge }))
      .filter((m) => m.yearIdx > 0 && m.yearIdx <= horizon);
  }, [leadAge, horizon]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="badge bg-input border border-border text-txt-3">
          Projeção · {currency} · {horizon} anos
        </span>
        {hasFixed && (
          <span className="badge bg-violet/10 border border-violet/40 text-violet">
            <Pin className="w-3 h-3" /> Comparando 2 cenários
          </span>
        )}
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={idGrad} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#00D67D" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#00D67D" stopOpacity={0.00} />
              </linearGradient>
              <linearGradient id={idGradL} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#94A3B8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.00} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, true)} width={80} />
            <Tooltip
              formatter={(v) => fmt(v)}
              labelFormatter={(label) => leadAge != null ? `Você teria ${label}` : label}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} iconType="circle" iconSize={8} />

            <Area
              type="monotone" dataKey={instKey} name="Posicionado como operador"
              stroke="#00D67D" strokeWidth={3} fill={`url(#${idGrad})`}
            />
            <Area
              type="monotone" dataKey={leadKey} name="Mantendo trajetória atual"
              stroke="#94A3B8" strokeWidth={2.5} fill={`url(#${idGradL})`}
            />

            {/* Curvas do cenário fixado (tracejadas) */}
            {hasFixed && (
              <>
                <Line
                  type="monotone" dataKey={fixedInstKey} name="Institucional · fixado"
                  stroke="#00D67D" strokeWidth={2} strokeDasharray="6 4" dot={false}
                />
                <Line
                  type="monotone" dataKey={fixedLeadKey} name="Atual · fixado"
                  stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="6 4" dot={false}
                />
              </>
            )}

            {/* Marcadores de aposentadoria */}
            {retirementMarkers.map((m) => (
              <ReferenceLine
                key={m.age}
                x={`${m.age} anos`}
                stroke="#FBBF24"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                label={{
                  value: m.age === 65 ? `${m.age}a · aposentadoria` : `${m.age}a`,
                  position: 'top',
                  fill: '#FBBF24',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ComparisonSidecard({ fixedScenario, currentInputs, currentGap, currentPatrimony }) {
  if (!fixedScenario) return null;
  const f = fixedScenario;
  const fInputs = f.inputs;
  const diff = currentGap.gapAbsolute - f.gap.gapAbsolute;
  return (
    <div className="rounded-2xl bg-input border-2 border-violet/40 p-5 mt-4">
      <div className="text-[11px] tracking-[0.18em] uppercase text-violet font-bold mb-3 flex items-center gap-2">
        <Pin className="w-3.5 h-3.5" />
        Comparação de cenários
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[12px]">
        <div>
          <div className="text-txt-3 mb-1.5 font-semibold text-[10px] tracking-wider uppercase">Cenário fixado</div>
          <div className="space-y-1">
            <Row label="Patrimônio" value={formatBRL(f.patrimony, true)} />
            <Row label="Aporte"     value={`${formatBRL(fInputs.monthlyContribution, true)}/mês`} />
            <Row label="Horizonte"  value={`${fInputs.horizon} anos`} />
            <Row label="Premissa"   value={fInputs.premise} />
            <Row label="Gap"        value={formatBRL(f.gap.gapAbsolute, true)} highlight />
          </div>
        </div>
        <div>
          <div className="text-txt-3 mb-1.5 font-semibold text-[10px] tracking-wider uppercase">Cenário atual</div>
          <div className="space-y-1">
            <Row label="Patrimônio" value={formatBRL(currentPatrimony, true)} />
            <Row label="Aporte"     value={`${formatBRL(currentInputs.monthlyContribution, true)}/mês`} />
            <Row label="Horizonte"  value={`${currentInputs.horizon} anos`} />
            <Row label="Premissa"   value={currentInputs.premise} />
            <Row label="Gap"        value={formatBRL(currentGap.gapAbsolute, true)} highlight />
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-txt-3 font-semibold">
          Diferença no gap
        </span>
        <span
          className={'font-mono font-bold text-xl tabular-nums ' + (diff >= 0 ? 'text-emerald' : 'text-rose')}
        >
          {diff >= 0 ? '+' : ''}{formatBRL(diff, true)}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-txt-4 capitalize">{label}</span>
      <span className={'font-mono tabular-nums ' + (highlight ? 'text-rose font-bold' : 'text-txt-1 font-medium')}>{value}</span>
    </div>
  );
}

export default function ProjectionChart({ inputs, gap, currencyView, fixedScenario, patrimony }) {
  const data = useMemo(() => {
    const out = [];
    const usdRate = USD_BRL[2025];
    const horizon = inputs.horizon;
    const fixed = fixedScenario;
    const fixedHorizon = fixed?.inputs?.horizon ?? 0;

    for (let y = 0; y <= horizon; y++) {
      const lead = gap.leadTrajectory[y];
      const inst = gap.institutionalTrajectory[y];
      const point = {
        label:   buildAxisLabel(y, inputs.leadAge),
        leadBRL: lead,
        instBRL: inst,
        leadUSD: lead / usdRate,
        instUSD: inst / usdRate,
      };
      if (fixed && y <= fixedHorizon) {
        point.fixedLeadBRL = fixed.gap.leadTrajectory[y];
        point.fixedInstBRL = fixed.gap.institutionalTrajectory[y];
        point.fixedLeadUSD = fixed.gap.leadTrajectory[y] / usdRate;
        point.fixedInstUSD = fixed.gap.institutionalTrajectory[y] / usdRate;
      }
      out.push(point);
    }
    return out;
  }, [inputs.horizon, inputs.leadAge, gap, fixedScenario]);

  return (
    <ChartCard
      title={`O que vai acontecer com seu patrimônio nos próximos ${inputs.horizon} anos`}
      subtitle={
        inputs.leadAge != null
          ? `Eixo X = sua idade · você tem ${inputs.leadAge} anos hoje · em ${inputs.horizon} anos terá ${inputs.leadAge + inputs.horizon}`
          : 'A área entre as duas curvas é o GAP · recálculo em tempo real conforme você ajusta os inputs'
      }
    >
      {currencyView === 'side-by-side' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ProjView data={data} currency="BRL" horizon={inputs.horizon} leadAge={inputs.leadAge} fixedScenario={fixedScenario} />
          <ProjView data={data} currency="USD" horizon={inputs.horizon} leadAge={inputs.leadAge} fixedScenario={fixedScenario} />
        </div>
      ) : (
        <ProjView data={data} currency={currencyView} horizon={inputs.horizon} leadAge={inputs.leadAge} fixedScenario={fixedScenario} />
      )}

      {fixedScenario && (
        <ComparisonSidecard
          fixedScenario={fixedScenario}
          currentInputs={inputs}
          currentGap={gap}
          currentPatrimony={patrimony}
        />
      )}
    </ChartCard>
  );
}
