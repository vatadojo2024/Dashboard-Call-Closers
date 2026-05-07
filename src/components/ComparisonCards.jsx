import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Landmark, ScrollText, TrendingUp, Building2, DollarSign,
  LineChart as LCIcon, Cpu, Rocket, Trophy, AlertTriangle, ShieldAlert,
} from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import { COMPARISON_CARDS } from '../lib/data.js';
import { formatPercent } from '../lib/engine.js';
import InfoTooltip from './InfoTooltip.jsx';
import { TT } from '../lib/tooltips.js';

const ICON_MAP = {
  Landmark, ScrollText, TrendingUp, Building2,
  DollarSign, LineChart: LCIcon, Cpu, Rocket,
};

function rankClassName(idx, total) {
  if (idx === 0)            return 'border-emerald shadow-glow';
  if (idx < 3)              return 'border-emerald/45';
  if (idx >= total - 3)     return 'border-rose/45';
  return 'border-border';
}

function badgeForRank(idx, total) {
  if (idx === 0)
    return (
      <span className="badge bg-emerald/15 text-emerald border border-emerald/30">
        <Trophy className="w-3 h-3" /> #1
      </span>
    );
  if (idx >= total - 1)
    return (
      <span className="badge bg-rose/15 text-rose border border-rose/30">
        <AlertTriangle className="w-3 h-3" /> #{idx + 1}
      </span>
    );
  return (
    <span className="badge bg-input border border-border text-txt-3">
      #{idx + 1}
    </span>
  );
}

const HIGH_VOL_THRESHOLD = 0.15;

export default function ComparisonCards() {
  const sorted = useMemo(
    () => [...COMPARISON_CARDS].sort((a, b) => b.usd - a.usd),
    []
  );

  return (
    <ChartCard
      title="Ranking comparativo de classes — sempre em USD"
      subtitle="A régua institucional. CAGR em USD acumulado 10 anos · volatilidade anualizada · ranking do melhor para o pior"
      rightAction={
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-txt-3">
          <span className="inline-flex items-center gap-1.5">CAGR <InfoTooltip title={TT.cagr.title} content={TT.cagr.content} position="bottom" /></span>
          <span className="inline-flex items-center gap-1.5">Vol USD <InfoTooltip title={TT.volUSD.title} content={TT.volUSD.content} position="bottom" /></span>
        </div>
      }
      footer={
        <p className="text-[12px] text-txt-3 italic leading-relaxed">
          "Renda fixa BR aparece na metade-baixa do ranking USD — com volatilidade comparável a ações.
          Em moeda forte, sua 'renda fixa segura' não é segura nem renta."
        </p>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sorted.map((c, idx) => {
          const Icon = ICON_MAP[c.icone] ?? Landmark;
          const isHighVol = c.vol >= HIGH_VOL_THRESHOLD;
          const isRfBR = c.id === 'cdi';
          const isImovel = c.id === 'imovel';
          const showWarn = (isRfBR || isImovel) && isHighVol;
          const cagrColor = c.usd >= 0 ? '#10B981' : '#F87171';
          const cagrSign = c.usd >= 0 ? '+' : '';
          return (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={
                'rounded-2xl p-5 bg-gradient-card border-2 transition-all ' +
                rankClassName(idx, sorted.length)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-input border border-border flex items-center justify-center">
                  <Icon className="w-5 h-5 text-txt-2" />
                </div>
                {badgeForRank(idx, sorted.length)}
              </div>

              <div className="text-[13px] font-semibold text-txt-1 mb-3 leading-tight min-h-[34px]">
                {c.nome}
              </div>

              {/* CAGR USD — número herói */}
              <div
                className="font-mono font-extrabold tabular-nums leading-none mb-1"
                style={{ color: cagrColor, fontSize: 32 }}
              >
                {cagrSign}{(c.usd * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] text-txt-3 mb-3">a.a. em USD</div>

              {/* Acumulado */}
              <div className="text-[12px] text-txt-2 mb-1.5 font-mono">
                {c.accum10y >= 0 ? '+' : ''}{(c.accum10y * 100).toFixed(0)}%
                <span className="text-txt-4 ml-1.5 text-[11px]">acumulado 10y</span>
              </div>

              {/* Volatilidade */}
              <div
                className={
                  'text-[11px] flex items-center gap-1.5 mt-2 pt-2 border-t border-border ' +
                  (showWarn ? 'text-amber font-medium' : 'text-txt-3')
                }
              >
                {showWarn && <ShieldAlert className="w-3 h-3 flex-shrink-0" />}
                Volatilidade: <span className="font-mono">{(c.vol * 100).toFixed(1)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ChartCard>
  );
}
