import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  TrendingDown, Trophy, Target, Sparkles,
  Banknote, Activity, Calendar, BarChart3,
} from 'lucide-react';
import { formatBRL } from '../lib/engine.js';
import { USD_BRL } from '../lib/data.js';
import GapGrowthChart from './GapGrowthChart.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import { TT } from '../lib/tooltips.js';

const PASSIVE_RATE = 0.04; // regra dos 4% a.a.

function CountedBRL({ value, color }) {
  return (
    <span
      className="font-mono font-extrabold leading-none tracking-tight tabular-nums"
      style={{ color, fontSize: 38 }}
    >
      <CountUp
        start={0}
        end={value}
        duration={2.0}
        separator="."
        decimals={0}
        prefix="R$ "
        preserveValue
      />
    </span>
  );
}

function CountedUSD({ value, color }) {
  return (
    <span className="font-mono text-lg tabular-nums" style={{ color, opacity: 0.7 }}>
      <CountUp
        start={0}
        end={value}
        duration={2.0}
        separator=","
        decimals={0}
        prefix="US$ "
        preserveValue
      />
    </span>
  );
}

function StatRow({ icon: Icon, label, value, color, valueClass = 'text-txt-1' }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="flex items-center gap-2 text-txt-3">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color }} />}
        {label}
      </span>
      <span
        className={`font-mono font-semibold tabular-nums ${valueClass}`}
        style={color && valueClass === 'text-txt-1' ? {} : color ? { color } : {}}
      >
        {value}
      </span>
    </div>
  );
}

function TemporalRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-txt-3 lowercase">{label}</span>
      <span className="font-mono font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

/**
 * Card padronizado com 5 seções idênticas:
 *  1. Header (label + ícone)
 *  2. Número principal (BRL 38px + USD)
 *  3. Stats: Rendimento médio · Renda passiva (4%) · vs cenário atual
 *  4. Decomposição/Ganho temporal: por mês · por dia · por hora
 *  5. Crescimento ano a ano (mini chart)
 */
function ScenarioCard({
  icon: Icon, label, sublabel, color, accent, pulse,
  // Valor principal
  brl, usd,
  // Stats padronizados
  rate,                      // taxa decimal (rendimento médio a.a.)
  passiveBRL,                // renda passiva mensal (já calculada)
  vsAtualLabel, vsAtualValue, vsAtualColor,
  // Decomposição
  temporalLabel,
  temporalValues,            // { perMonth, perDay, perHour }
  temporalColor,
  // Growth chart
  growthTrajectory,
  growthHorizon,
  growthColor,
  growthLabel,
  headerTooltip,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={accent + (pulse ? ' animate-pulse-gap' : '')}
    >
      <div className="p-7 flex flex-col h-full">
        {/* 1. Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-txt-3 font-bold mb-1 flex items-center gap-1.5">
              <span>{label}</span>
              {headerTooltip && (
                <InfoTooltip title={headerTooltip.title} content={headerTooltip.content} position="bottom" />
              )}
            </div>
            <div className="text-[12px] text-txt-4">{sublabel}</div>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}50` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>

        {/* 2. Número principal */}
        <CountedBRL value={brl} color={color} />
        <div className="mt-2.5">
          <CountedUSD value={usd} color={color} />
        </div>

        {/* 3. Stats padronizados */}
        <div className="mt-5 pt-5 border-t border-border space-y-2.5">
          <StatRow
            icon={Activity}
            label="Rendimento médio"
            value={rate != null ? `${(rate * 100).toFixed(1)}% a.a.` : '—'}
            color={color}
          />
          <StatRow
            icon={Banknote}
            label="Renda passiva (4%)"
            value={`${formatBRL(passiveBRL, true)}/mês`}
            color={color}
          />
          <StatRow
            icon={Sparkles}
            label="vs. cenário atual"
            value={vsAtualValue}
            color={vsAtualColor}
            valueClass={vsAtualColor === '#00D67D' ? 'text-emerald font-bold'
              : vsAtualColor === '#F87171' ? 'text-rose font-bold'
              : 'text-txt-3'}
          />
        </div>

        {/* 4. Decomposição/Ganho temporal */}
        <div className="mt-5 pt-5 border-t border-border space-y-2">
          <div className="text-[10px] tracking-[0.18em] uppercase text-txt-4 font-bold mb-2 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" style={{ color }} />
            {temporalLabel}
          </div>
          <TemporalRow label="por mês"  value={formatBRL(temporalValues.perMonth, true)} color={temporalColor} />
          <TemporalRow label="por dia"  value={formatBRL(temporalValues.perDay,   true)} color={temporalColor} />
          <TemporalRow label="por hora" value={formatBRL(temporalValues.perHour,  true)} color={temporalColor} />
        </div>

        {/* 5. Crescimento ano a ano */}
        <div className="mt-5 pt-5 border-t border-border">
          <GapGrowthChart
            trajectory={growthTrajectory}
            horizon={growthHorizon}
            color={growthColor}
            label={growthLabel}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ScenarioCards({ gap, inputs, patrimony }) {
  const usd = USD_BRL[2025];
  const horizon = inputs.horizon;

  const totalMonths = horizon * 12;
  const totalDays   = horizon * 365;
  const totalHours  = totalDays * 24;

  // Trajetória do GAP ano a ano (= institucional - lead em cada ponto)
  const gapTrajectory = useMemo(() => {
    if (!gap?.leadTrajectory || !gap?.institutionalTrajectory) return [];
    return gap.leadTrajectory.map((leadVal, i) =>
      Math.max(0, gap.institutionalTrajectory[i] - leadVal)
    );
  }, [gap]);

  // Card 1 — MANTENDO: acúmulo total ao longo do horizonte
  const leadAccumulated = gap.finalLead - patrimony;
  const leadTemporal = {
    perMonth: leadAccumulated / totalMonths,
    perDay:   leadAccumulated / totalDays,
    perHour:  leadAccumulated / totalHours,
  };

  // Card 2 — POSICIONADO: ganho extra (gap) por período
  const gapBRL = gap.gapAbsolute;
  const extraTemporal = {
    perMonth: gapBRL / totalMonths,
    perDay:   gapBRL / totalDays,
    perHour:  gapBRL / totalHours,
  };

  // Card 3 — DIFERENÇA: decomposição do gap (mesmos números do card 2)
  const gapTemporal = extraTemporal;

  // Renda passiva (4% a.a. / 12)
  const passiveLead  = (gap.finalLead          * PASSIVE_RATE) / 12;
  const passiveInst  = (gap.finalInstitutional * PASSIVE_RATE) / 12;
  const passiveGap   = (gap.gapAbsolute        * PASSIVE_RATE) / 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 items-stretch">
      {/* CARD 1 — MANTENDO SUA TRAJETÓRIA */}
      <ScenarioCard
        icon={TrendingDown}
        label="MANTENDO SUA TRAJETÓRIA"
        sublabel="Cenário atual"
        color="#94A3B8"
        accent="card-base"
        brl={gap.finalLead}
        usd={gap.finalLead / usd}
        rate={gap.leadRate}
        passiveBRL={passiveLead}
        vsAtualLabel="vs. cenário atual"
        vsAtualValue="cenário base"
        vsAtualColor="#94A3B8"
        temporalLabel="Acúmulo por período"
        temporalValues={leadTemporal}
        temporalColor="#94A3B8"
        growthTrajectory={gap.leadTrajectory}
        growthHorizon={horizon}
        growthColor="#94A3B8"
        growthLabel="Patrimônio ano a ano"
      />

      {/* CARD 2 — POSICIONADO COMO OPERADOR */}
      <ScenarioCard
        icon={Trophy}
        label="POSICIONADO COMO OPERADOR"
        sublabel="Cenário institucional"
        headerTooltip={TT.institutional}
        color="#00D67D"
        accent="card-glow"
        brl={gap.finalInstitutional}
        usd={gap.finalInstitutional / usd}
        rate={gap.institutionalRate}
        passiveBRL={passiveInst}
        vsAtualLabel="vs. cenário atual"
        vsAtualValue={`+${gap.gapPercentage.toFixed(0)}%`}
        vsAtualColor="#00D67D"
        temporalLabel="Ganho extra por período"
        temporalValues={extraTemporal}
        temporalColor="#00D67D"
        growthTrajectory={gap.institutionalTrajectory}
        growthHorizon={horizon}
        growthColor="#00D67D"
        growthLabel="Patrimônio ano a ano"
      />

      {/* CARD 3 — DIFERENÇA */}
      <ScenarioCard
        icon={Target}
        label="DIFERENÇA"
        sublabel="O gap"
        color="#F87171"
        accent="card-rose"
        pulse
        brl={gap.gapAbsolute}
        usd={gap.gapAbsolute / usd}
        rate={gap.institutionalRate - gap.leadRate}
        passiveBRL={passiveGap}
        vsAtualLabel="vs. cenário atual"
        vsAtualValue={`+${gap.gapPercentage.toFixed(0)}%`}
        vsAtualColor="#F87171"
        temporalLabel="Decomposição do gap"
        temporalValues={gapTemporal}
        temporalColor="#F87171"
        growthTrajectory={gapTrajectory}
        growthHorizon={horizon}
        growthColor="#F87171"
        growthLabel="Crescimento do gap ano a ano"
      />
    </div>
  );
}
