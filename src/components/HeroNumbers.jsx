import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Target, AlertTriangle, Pin } from 'lucide-react';
import { brlToUsd, formatBRL, formatUSD } from '../lib/engine.js';
import InfoTooltip from './InfoTooltip.jsx';
import { TT } from '../lib/tooltips.js';

function MiniValue({ label, value, color }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12px] text-txt-3 uppercase tracking-[0.14em] font-medium">{label}</span>
      <span className="font-mono text-2xl font-bold tabular-nums" style={{ color }}>
        <CountUp
          start={0}
          end={value}
          duration={1.5}
          separator="."
          decimal=","
          decimals={0}
          prefix="R$ "
          preserveValue
        />
      </span>
    </div>
  );
}

export default function HeroNumbers({ inputs, gap, fixedScenario }) {
  const horizon = inputs.horizon;
  const gapBRL = gap.gapAbsolute;
  const gapUSD = brlToUsd(gapBRL, 2025);
  const gapPercent = gap.gapPercentage;

  const totalMonths = horizon * 12;
  const totalDays   = horizon * 365;
  const totalHours  = totalDays * 24;

  const gapPerMonth = gapBRL / totalMonths;
  const gapPerDay   = gapBRL / totalDays;
  const gapPerHour  = gapBRL / totalHours;

  // Label superior com idade
  const yearsLabel = inputs.leadAge != null
    ? `EM ${horizon} ANOS · QUANDO VOCÊ TIVER ${inputs.leadAge + horizon} ANOS`
    : `EM ${horizon} ANOS`;

  // Cenário fixado (Adição 7.4)
  const hasFixed = !!fixedScenario;
  const fixedGapBRL = fixedScenario?.gap?.gapAbsolute ?? null;

  return (
    <section className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-rose relative overflow-hidden animate-pulse-gap-soft"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(239,68,68,0.08), transparent 60%), linear-gradient(165deg, rgba(248,113,113,0.06), rgba(248,113,113,0.02)), #1A2030',
        }}
      >
        {/* Decoração de fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              'radial-gradient(circle at 90% 90%, rgba(239,68,68,0.12), transparent 50%)',
          }}
        />

        <div className="relative p-6 md:p-8 lg:p-10">
          <div className="text-center">
            <div className="text-[12px] tracking-[0.32em] text-rose font-bold mb-8 font-mono">
              {yearsLabel}
            </div>

            {/* Cards de cenário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-2xl bg-input border border-border p-6"
              >
                <div className="text-[11px] tracking-[0.18em] uppercase text-txt-3 font-bold mb-3">
                  VOCÊ TERÁ
                </div>
                <div className="font-mono text-mega font-extrabold text-txt-2 tabular-nums leading-none">
                  <CountUp
                    start={0}
                    end={gap.finalLead}
                    duration={2.0}
                    separator="."
                    decimals={0}
                    prefix="R$ "
                    preserveValue
                  />
                </div>
                <div className="font-mono text-xl text-txt-3 mt-2 tabular-nums">
                  <CountUp
                    start={0}
                    end={brlToUsd(gap.finalLead, 2025)}
                    duration={2.0}
                    separator=","
                    decimals={0}
                    prefix="US$ "
                    preserveValue
                  />
                </div>
                <div className="text-[12px] text-txt-3 mt-3 italic">parado</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="rounded-2xl border border-emerald/40 p-6 shadow-glow"
                style={{
                  background:
                    'linear-gradient(165deg, rgba(0,214,125,0.10), rgba(0,214,125,0.02))',
                }}
              >
                <div className="text-[11px] tracking-[0.18em] uppercase text-emerald font-bold mb-3">
                  VOCÊ PODERIA TER
                </div>
                <div className="font-mono text-mega font-extrabold text-emerald tabular-nums leading-none">
                  <CountUp
                    start={0}
                    end={gap.finalInstitutional}
                    duration={2.0}
                    separator="."
                    decimals={0}
                    prefix="R$ "
                    preserveValue
                  />
                </div>
                <div className="font-mono text-xl text-emerald/75 mt-2 tabular-nums">
                  <CountUp
                    start={0}
                    end={brlToUsd(gap.finalInstitutional, 2025)}
                    duration={2.0}
                    separator=","
                    decimals={0}
                    prefix="US$ "
                    preserveValue
                  />
                </div>
                <div className="text-[12px] text-emerald/85 mt-3 italic">posicionado como operador</div>
              </motion.div>
            </div>

            {/* Linha divisória + GAP */}
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose/40 max-w-[300px]" />
              <Target className="w-5 h-5 text-rose" />
              <span className="text-[14px] tracking-[0.32em] text-rose font-bold font-mono inline-flex items-center gap-2">
                GAP
                <span className="text-rose/70"><InfoTooltip title={TT.gap.title} content={TT.gap.content} position="bottom" variant="prominent" /></span>
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose/40 max-w-[300px]" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mb-1"
            >
              <div className="font-mono font-extrabold tabular-nums text-rose leading-none break-all" style={{ fontSize: 'clamp(56px, 10vw, 110px)', letterSpacing: '-0.04em' }}>
                <CountUp
                  start={0}
                  end={gapBRL}
                  duration={2.5}
                  separator="."
                  decimals={0}
                  prefix="R$ "
                  preserveValue
                />
              </div>
            </motion.div>

            <div className="font-mono text-3xl text-rose/80 mt-3 tabular-nums">
              <CountUp
                start={0}
                end={gapUSD}
                duration={2.5}
                separator=","
                decimals={0}
                prefix="US$ "
                preserveValue
              />
            </div>
            <div className="text-base text-rose mt-2 font-semibold">
              +<CountUp end={gapPercent} duration={2.5} decimals={0} preserveValue />% acima do cenário atual
            </div>

            {/* Comparação com cenário fixado */}
            {hasFixed && (
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-violet/10 border border-violet/40 text-violet text-sm">
                <Pin className="w-4 h-4" />
                Cenário fixado · Gap salvo: <span className="font-mono font-bold">{formatBRL(fixedGapBRL, true)}</span>
                <span className="text-txt-3">·</span>
                <span className="font-mono font-bold">
                  {gapBRL > fixedGapBRL ? '+' : ''}{formatBRL(gapBRL - fixedGapBRL, true)} vs atual
                </span>
              </div>
            )}

            {/* Decomposição temporal */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <MiniValue label="por mês"  value={gapPerMonth} color="#F87171" />
              <MiniValue label="por dia"  value={gapPerDay}   color="#F87171" />
              <MiniValue label="por hora" value={gapPerHour}  color="#F87171" />
            </div>

            {/* Tagline crimson */}
            <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-crimson/95 text-white font-bold text-base tracking-[0.20em] uppercase shadow-glow-rose">
              <AlertTriangle className="w-4 h-4" />
              Esse é o custo de não fazer nada
            </div>

            <p className="mt-6 text-base text-txt-3 italic max-w-2xl mx-auto leading-relaxed">
              Cada hora que você passa sem decidir, <span className="text-rose font-mono font-semibold not-italic">{formatBRL(gapPerHour, false)}</span> saindo do seu patrimônio futuro.
            </p>

            <p className="mt-2 text-sm text-txt-4">
              Os próximos minutos vão te mostrar de onde vem isso.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
