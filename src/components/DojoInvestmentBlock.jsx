import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, Clock, Calendar, Target, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import InfoTooltip from './InfoTooltip.jsx';
import { calculateDojoUnlock, formatBRL } from '../lib/engine.js';
import { USD_BRL } from '../lib/data.js';

const DOJO_TT = {
  application: {
    title: 'Aplicação do conhecimento',
    content:
`Quanto do que o lead aprende no Dojo, ele efetivamente aplica no posicionamento do próprio capital.

• 100% — aplicação total: lead executa todo o modelo institucional (composição, rebalanceamento, disciplina cambial).
• 70% — aplicação realista: lead executa o essencial e adapta o resto. Média de quem entra com seriedade.
• 30% — aplicação mínima: lead aplica só o básico, o que já chega pra mover o ponteiro.

Default: 70%. Move o slider durante a apresentação para responder à postura do lead. Lead cético? Move pra 50%. Lead engajado? Move pra 100% e mostra o teto.`,
  },
  unlocked: {
    title: 'O que é o gap destravado',
    content:
`É a porção do gap total que se destrava pela aplicação do conhecimento institucional do Dojo.

Cálculo: Gap total × % de aplicação.
Exemplo: gap de R$ 7M, aplicação 70% → R$ 4,9M destravados.

O Dojo não promete rentabilidade. Entrega capacidade. A combinação de capacidade entregue + aplicação pelo lead resulta no gap destravado.`,
  },
  proportion: {
    title: 'A proporção que importa',
    content:
`Para cada R$ 1 investido no programa, quantos reais de gap são destravados pela aplicação do conhecimento.

Não é retorno de investimento no sentido financeiro. É a proporção entre o custo de acesso ao modelo e o valor do gap que esse modelo permite capturar.

Payback: quantos dias de operação ajustada equivalem ao custo do programa. Se R$ 1.342 são destravados por dia e o programa custa R$ 70k, o programa "se paga" em 52 dias.`,
  },
  period: {
    title: 'Destravamento por período',
    content:
`A mesma decomposição temporal que aparece no gap principal, agora aplicada ao gap destravado pela aplicação.

Por que importa: enquadra o tamanho do destravamento em escalas visualizáveis. R$ 4,9 milhões é abstrato. R$ 56 destravados por hora é palpável — e maior que o custo de muita coisa que o lead gasta sem pensar duas vezes.`,
  },
};

function formatNumberInput(v) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(v || 0);
}

function CurrencyInput({ value, onChange, placeholder }) {
  const [str, setStr] = useState(value ? formatNumberInput(value) : '');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setStr(value ? formatNumberInput(value) : '');
  }, [value, focused]);

  function handleChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    setStr(raw === '' ? '' : formatNumberInput(num));
    onChange(num);
  }

  return (
    <div className="input-base flex items-baseline gap-2.5 px-3 py-2.5 border-emerald/30 focus-within:border-emerald/60">
      <span className="text-txt-3 text-[12px] font-mono font-medium">R$</span>
      <input
        type="text"
        inputMode="numeric"
        value={str}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); setStr(value ? formatNumberInput(value) : ''); }}
        className="bg-transparent flex-1 outline-none text-txt-1 number text-lg font-semibold tracking-tight w-full placeholder:text-txt-4/60"
      />
    </div>
  );
}

function ApplicationSlider({ value, onChange }) {
  const pct = ((value * 100 - 30) / 70) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] tracking-[0.18em] uppercase text-txt-3 font-mono">
          30% — 100%
        </span>
        <span className="font-mono text-emerald text-base font-semibold tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min={30}
        max={100}
        step={5}
        value={Math.round(value * 100)}
        style={{ '--val': `${pct}%` }}
        onChange={(e) => onChange(parseInt(e.target.value, 10) / 100)}
      />
      <div className="flex justify-between mt-1.5 text-[10px] text-txt-4 font-mono">
        <span>30%</span><span>50%</span><span>70%</span><span>85%</span><span>100%</span>
      </div>
      <p className="text-[11px] text-txt-3 italic mt-2 leading-relaxed">
        "Quanto do que você aprende, você aplica."
      </p>
    </div>
  );
}

function PeriodValue({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-input/70 border border-emerald/15 px-3 py-2 flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-[11px] text-txt-3 lowercase">
        {Icon && <Icon className="w-3 h-3 text-emerald/80" />}
        {label}
      </span>
      <span className="font-mono font-semibold tabular-nums text-txt-1 text-[13px]">
        <CountUp end={value} duration={1.5} separator="." decimals={0} prefix="R$ " preserveValue />
      </span>
    </div>
  );
}

export default function DojoInvestmentBlock({ gap, horizon, isOpen, setIsOpen }) {
  const [programInvestment, setProgramInvestment] = useState(0);
  const [applicationPercent, setApplicationPercent] = useState(0.70);

  const dojoUnlock = useMemo(
    () => calculateDojoUnlock(
      gap,
      { programInvestment, applicationPercent },
      horizon,
      USD_BRL[2025]
    ),
    [gap, programInvestment, applicationPercent, horizon]
  );

  const hasInvestment = programInvestment > 0;
  const gapAbs = gap?.gapAbsolute ?? 0;

  return (
    <section className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 mt-12 mb-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-5 py-3 rounded-xl
                   bg-gradient-to-r from-emerald/5 via-input to-input
                   border border-emerald/25 hover:border-emerald/50
                   transition-all duration-200 group"
        style={{
          boxShadow: isOpen
            ? '0 0 60px -20px rgba(0,214,125,0.30)'
            : '0 0 30px -22px rgba(0,214,125,0.18)',
        }}
        aria-expanded={isOpen}
      >
        <span className={`w-7 h-7 rounded-lg bg-emerald/15 border border-emerald/40 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-3.5 h-3.5 text-emerald" />
        </span>
        <div className="flex-1 text-left">
          <div className="text-[13px] font-semibold text-txt-1 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald" />
            Investimento no Vata Dojo
          </div>
          <div className="text-[11px] text-txt-3 mt-0.5">
            {isOpen ? 'Fechar' : 'Calcular destravamento do gap'}
          </div>
        </div>
        <kbd className="hidden md:inline-flex text-[10px] text-txt-4 font-mono px-2 py-1 border border-border rounded">D</kbd>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="dojo-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-3 rounded-2xl border border-emerald/30 bg-base/85
                         px-5 md:px-7 py-6 space-y-6 relative overflow-hidden"
              style={{ boxShadow: '0 0 80px -28px rgba(0,214,125,0.30)' }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background:
                    'radial-gradient(circle at 20% 0%, rgba(0,214,125,0.08), transparent 55%), radial-gradient(circle at 90% 100%, rgba(0,214,125,0.06), transparent 55%)',
                }}
              />

              {/* ZONA 1 — Header pergunta */}
              <motion.h3
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10, duration: 0.4 }}
                className="relative text-[11px] md:text-[12px] font-bold uppercase tracking-[0.20em] text-txt-3"
              >
                E SE VOCÊ DESTRAVAR TUDO ISSO?
              </motion.h3>

              {/* ZONA 2 — Inputs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
                    Investimento no programa
                  </label>
                  <CurrencyInput
                    value={programInvestment}
                    onChange={setProgramInvestment}
                    placeholder="0"
                  />
                  <p className="text-[11px] text-txt-4 mt-2">
                    Digite o valor do tier que está apresentando.
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
                    Aplicação do conhecimento
                    <InfoTooltip title={DOJO_TT.application.title} content={DOJO_TT.application.content} position="bottom" />
                  </label>
                  <ApplicationSlider value={applicationPercent} onChange={setApplicationPercent} />
                </div>
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 3 — Gap destravado (número herói) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] md:text-[11px] uppercase tracking-[0.20em] text-txt-3 font-bold mb-3">
                  <Sparkles className="w-3 h-3 text-emerald" />
                  GAP DESTRAVADO
                  <InfoTooltip title={DOJO_TT.unlocked.title} content={DOJO_TT.unlocked.content} position="bottom" />
                </div>

                <motion.div
                  animate={{ scale: [1, 1.004, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="font-mono font-extrabold tabular-nums text-emerald leading-none break-all"
                  style={{
                    fontSize: 'clamp(36px, 5.5vw, 56px)',
                    letterSpacing: '-0.03em',
                    textShadow: '0 0 40px rgba(0,214,125,0.30)',
                  }}
                >
                  <CountUp
                    end={dojoUnlock.unlockedGap}
                    duration={2.0}
                    separator="."
                    decimals={0}
                    prefix="R$ "
                    preserveValue
                  />
                </motion.div>

                <div className="font-mono text-base md:text-lg text-emerald/70 tabular-nums mt-2">
                  <CountUp
                    end={dojoUnlock.unlockedGapUSD}
                    duration={2.0}
                    separator=","
                    decimals={0}
                    prefix="US$ "
                    preserveValue
                  />
                </div>
                <div className="text-[11px] text-txt-3 font-mono mt-2">
                  {Math.round(applicationPercent * 100)}% × {formatBRL(gapAbs, true)}
                </div>
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 4 — Proporção (2 cards) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-txt-3 font-bold mb-3">
                  PROPORÇÃO ENTRE INVESTIMENTO E ACESSO
                  <InfoTooltip title={DOJO_TT.proportion.title} content={DOJO_TT.proportion.content} position="bottom" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-input/60 border border-emerald/25 px-4 py-3.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-txt-3 font-semibold mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-emerald" /> Para cada R$ 1 investido
                    </div>
                    <div className="font-mono text-xl md:text-2xl font-extrabold text-txt-1 tabular-nums leading-none">
                      {hasInvestment ? (
                        <>
                          R$ <CountUp end={dojoUnlock.roiMultiple} duration={1.6} decimals={0} preserveValue />
                          <span className="text-emerald"> destravados</span>
                        </>
                      ) : (
                        <span className="text-txt-3">R$ — destravados</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-input/60 border border-emerald/25 px-4 py-3.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-txt-3 font-semibold mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald" /> Payback do programa
                    </div>
                    <div className="font-mono text-xl md:text-2xl font-extrabold text-txt-1 tabular-nums leading-none">
                      {hasInvestment && dojoUnlock.paybackDays != null ? (
                        <>
                          <CountUp end={dojoUnlock.paybackDays} duration={1.6} decimals={1} preserveValue /> <span className="text-emerald">dias</span>
                        </>
                      ) : (
                        <span className="text-txt-3">— dias</span>
                      )}
                    </div>
                    <div className="text-[11px] text-txt-3 mt-1.5">de operação ajustada</div>
                  </div>
                </div>

                {!hasInvestment && (
                  <div className="text-[12px] text-emerald/80 italic mt-3 text-center md:text-left">
                    Digite o valor do programa acima para ver a proporção.
                  </div>
                )}
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 5 — Decomposição por período */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-txt-3 font-bold mb-3">
                  <Calendar className="w-3 h-3 text-emerald" />
                  DESTRAVAMENTO POR PERÍODO
                  <InfoTooltip title={DOJO_TT.period.title} content={DOJO_TT.period.content} position="top" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <PeriodValue label="por ano"  value={dojoUnlock.unlockedPerYear}  />
                  <PeriodValue label="por mês"  value={dojoUnlock.unlockedPerMonth} />
                  <PeriodValue label="por dia"  value={dojoUnlock.unlockedPerDay}   />
                  <PeriodValue label="por hora" value={dojoUnlock.unlockedPerHour}  />
                </div>
              </motion.div>

              {/* ZONA 6 — Tagline final */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative flex justify-center pt-2"
              >
                <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-2.5 rounded-full
                                bg-emerald/12 border border-emerald/45 text-center
                                text-[11px] md:text-[12px] font-bold uppercase
                                tracking-[0.16em] text-emerald shadow-glow">
                  Não é o custo do programa.
                  <span className="text-emerald-300">É o custo de não fazer parte dele.</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
