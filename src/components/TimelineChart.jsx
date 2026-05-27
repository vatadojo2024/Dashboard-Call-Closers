import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ChartCard from './ChartCard.jsx';
import OperatorTooltip from './OperatorTooltip.jsx';
import {
  buildLeadHistoricalBRL, buildMag7HistoricalBRL,
  buildHistoricalTrajectory, convertSP500toBRLAnual, makeYearMap,
  calcularPerdaPoderCompra, calcularCustoOportunidade,
  inflacaoRealAcumulada,
  formatBRL,
} from '../lib/engine.js';
import { YEARS, RFBR_BRL } from '../lib/data.js';

const COLORS = {
  lead:   '#94A3B8',
  rfBR:   '#F87171',
  sp500:  '#06B6D4',
  mag7:   '#00D67D',
};

const REF_VALUE = 1_000_000;

function ImpactCard({ kicker, headline, valor, percentual, sign, sublabel, hero, neutral }) {
  const colorAbs = neutral ? '#FBBF24' : '#EF4444';
  const colorPct = neutral ? 'rgba(251, 191, 36, 0.85)' : 'rgba(239, 68, 68, 0.85)';

  const cardCls = [
    'rounded-xl p-6 flex flex-col gap-2 transition-all',
    hero
      ? 'border-2 border-rose/60 bg-rose/[0.07] shadow-[0_0_45px_-15px_rgba(239,68,68,0.55)]'
      : neutral
        ? 'border border-amber/30 bg-amber/[0.04]'
        : 'border border-rose/25 bg-rose/[0.03]',
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={cardCls}
    >
      <div className="text-[11px] tracking-[0.18em] uppercase text-txt-3 font-bold leading-tight">
        {kicker}
      </div>
      <div className="text-[13px] text-txt-2 leading-snug">{headline}</div>

      <div
        className="font-mono font-extrabold tabular-nums leading-none mt-3"
        style={{ fontSize: 40, color: colorAbs }}
      >
        {sign}{' '}
        <CountUp
          start={0}
          end={Math.abs(valor)}
          duration={2.0}
          separator="."
          decimals={0}
          prefix="R$ "
          preserveValue
        />
      </div>

      <div
        className="font-mono font-extrabold tabular-nums leading-none mt-1"
        style={{ fontSize: 28, color: colorPct }}
      >
        {sign}{' '}
        <CountUp
          start={0}
          end={Math.abs(percentual)}
          duration={2.0}
          decimals={1}
          suffix="%"
          preserveValue
        />
      </div>

      <div className="text-[12px] text-txt-3 mt-2 leading-snug">
        {sublabel}
      </div>
    </motion.div>
  );
}

function CostOfInactionBlock({ patrimony, distribution }) {
  const perda = useMemo(
    () => calcularPerdaPoderCompra(patrimony, distribution, 2016, 2025),
    [patrimony, distribution]
  );
  const custo = useMemo(
    () => calcularCustoOportunidade(patrimony, distribution, undefined, 2016, 2025),
    [patrimony, distribution]
  );

  // Card 1 — quando o lead venceu a inflação real, vira "quanto cresceu" (amber)
  const card1Neutral = perda.isPositivo;
  const card1Kicker = card1Neutral
    ? 'PODER DE COMPRA · ÚLTIMOS 10 ANOS'
    : 'PERDA DE PODER DE COMPRA';
  const card1Headline = card1Neutral
    ? 'Quanto seu poder de compra cresceu nos últimos 10 anos'
    : 'Quanto você perdeu nos últimos 10 anos';
  const card1Sign = perda.valor >= 0 ? '+' : '−';

  return (
    <div className="mb-6">
      <div className="text-[12px] tracking-[0.18em] uppercase text-rose font-bold mb-4">
        Custo de inação — últimos 10 anos
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImpactCard
          kicker={card1Kicker}
          headline={card1Headline}
          valor={perda.valor}
          percentual={perda.percentual}
          sign={card1Sign}
          sublabel="em poder de compra real (Índice Vata)"
          neutral={card1Neutral}
        />

        <ImpactCard
          kicker="CUSTO DE OPORTUNIDADE"
          headline="Quanto você deixou de fazer nos últimos 10 anos"
          valor={custo.valor}
          percentual={custo.percentual}
          sign="−"
          sublabel="vs cenário institucional"
          hero
        />
      </div>
    </div>
  );
}

function ChartView({ data }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="badge bg-input border border-border text-txt-3">
          Eixo Y · R$ (poder de compra em reais de 2016)
        </span>
      </div>
      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatBRL(v, true)} width={75} />
            <Tooltip content={<OperatorTooltip formatter={(v) => formatBRL(v)} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone" dataKey="lead" name="Sua trajetória"
              stroke={COLORS.lead} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
            />
            <Line
              type="monotone" dataKey="rf" name="Renda Fixa BR"
              stroke={COLORS.rfBR} strokeWidth={2} dot={false} activeDot={{ r: 5 }}
              strokeDasharray="5 4"
            />
            <Line
              type="monotone" dataKey="sp500" name="S&P 500"
              stroke={COLORS.sp500} strokeWidth={2} dot={false} activeDot={{ r: 5 }}
            />
            <Line
              type="monotone" dataKey="mag7" name="Magnificent 7"
              stroke={COLORS.mag7} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function buildRfBRTrajectory(initial) {
  const out = [{ year: YEARS[0] - 1, value: initial }];
  let v = initial;
  for (const y of YEARS) {
    v = v * (1 + (RFBR_BRL[y] ?? 0));
    out.push({ year: y, value: v });
  }
  return out;
}

export default function TimelineChart({ patrimony, distribution }) {
  const initial = (patrimony && patrimony > 0) ? patrimony : REF_VALUE;
  const safeDist = distribution && Object.values(distribution).reduce((a, b) => a + b, 0) > 0
    ? distribution
    : { rfBR: 0.6, rvBR: 0.15, imoveis: 0.10, dolarizado: 0.10, outros: 0.05 };

  const data = useMemo(() => {
    const lead  = buildLeadHistoricalBRL(initial, safeDist);
    const rf    = buildRfBRTrajectory(initial);
    const sp500 = buildHistoricalTrajectory(initial, makeYearMap(YEARS, (y) => convertSP500toBRLAnual(y)));
    const mag7  = buildMag7HistoricalBRL(initial);

    return lead.map((p, i) => {
      const year = p.year;
      // Deflaciona pelo Índice Vata acumulado do ano-base (2015 = YEARS[0]-1) até o ano corrente
      const inflAcum = inflacaoRealAcumulada(YEARS[0] - 1, year);
      const deflator = 1 + inflAcum;
      return {
        year: String(year),
        lead:  lead[i].value  / deflator,
        rf:    rf[i].value    / deflator,
        sp500: sp500[i].value / deflator,
        mag7:  mag7[i].value  / deflator,
      };
    });
  }, [initial, safeDist]);

  return (
    <ChartCard
      title="Onde seu dinheiro estaria há 10 anos atrás"
      subtitle="Patrimônio inicial aplicado em diferentes posicionamentos · 2016 → 2025 · em poder de compra real (Índice Vata)"
    >
      <CostOfInactionBlock patrimony={initial} distribution={safeDist} />
      <ChartView data={data} />
    </ChartCard>
  );
}
