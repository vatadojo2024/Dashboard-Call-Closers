import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ChartCard from './ChartCard.jsx';
import OperatorTooltip from './OperatorTooltip.jsx';
import {
  buildLeadHistoricalBRL, buildRfBRinUSD, buildHistoricalTrajectory,
  buildMag7HistoricalBRL, convertSP500toBRLAnual, makeYearMap,
  formatBRL, formatUSD,
} from '../lib/engine.js';
import { YEARS, USD_BRL } from '../lib/data.js';

const COLORS = {
  lead:   '#94A3B8',
  rfBR:   '#F87171',
  sp500:  '#06B6D4',
  mag7:   '#00D67D',
};

function CurrencyAxisLabel({ currency }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="badge bg-input border border-border text-txt-3">
        Eixo Y · {currency}
      </span>
    </div>
  );
}

function ChartView({ data, currency }) {
  const fmt = currency === 'USD' ? formatUSD : formatBRL;
  const k = currency === 'USD' ? 'USD' : 'BRL';
  return (
    <div>
      <CurrencyAxisLabel currency={currency} />
      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v, true)} width={70} />
            <Tooltip content={<OperatorTooltip formatter={(v) => fmt(v)} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone" dataKey={`lead${k}`} name="Sua trajetória"
              stroke={COLORS.lead} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
            />
            <Line
              type="monotone" dataKey={`rf${k}`} name="Renda Fixa BR"
              stroke={COLORS.rfBR} strokeWidth={2} dot={false} activeDot={{ r: 5 }}
              strokeDasharray="5 4"
            />
            <Line
              type="monotone" dataKey={`sp500${k}`} name="S&P 500"
              stroke={COLORS.sp500} strokeWidth={2} dot={false} activeDot={{ r: 5 }}
            />
            <Line
              type="monotone" dataKey={`mag7${k}`} name="Magnificent 7"
              stroke={COLORS.mag7} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function TimelineChart({ currencyView, patrimony, distribution }) {
  const data = useMemo(() => {
    const initial = patrimony || 0;
    const lead   = buildLeadHistoricalBRL(initial, distribution);
    const rfUsd  = buildRfBRinUSD(initial);
    const sp500  = buildHistoricalTrajectory(initial, makeYearMap(YEARS, (y) => convertSP500toBRLAnual(y)));
    const mag7   = buildMag7HistoricalBRL(initial);

    return lead.map((p, i) => {
      const year = p.year;
      const rate = year < YEARS[0] ? 3.96 : USD_BRL[year];
      return {
        year: String(year),
        leadBRL:  lead[i].value,
        leadUSD:  lead[i].value / rate,
        rfBRL:    rfUsd[i].valueBRL,
        rfUSD:    rfUsd[i].value,
        sp500BRL: sp500[i].value,
        sp500USD: sp500[i].value / rate,
        mag7BRL:  mag7[i].value,
        mag7USD:  mag7[i].value / rate,
      };
    });
  }, [patrimony, distribution]);

  return (
    <ChartCard
      title="Onde seu dinheiro estaria há 10 anos atrás"
      subtitle="Patrimônio inicial aplicado em diferentes posicionamentos · 2016 → 2025"
    >
      {currencyView === 'side-by-side' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ChartView data={data} currency="BRL" />
          <ChartView data={data} currency="USD" />
        </div>
      ) : (
        <ChartView data={data} currency={currencyView} />
      )}
    </ChartCard>
  );
}
