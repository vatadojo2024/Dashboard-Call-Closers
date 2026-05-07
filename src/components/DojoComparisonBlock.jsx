import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, BarChart3, Ruler } from 'lucide-react';
import CountUp from 'react-countup';
import InfoTooltip from './InfoTooltip.jsx';
import { calculateProgramComparison, formatBRL } from '../lib/engine.js';
import { USD_BRL } from '../lib/data.js';

const DOJO_TT = {
  studyDepth: {
    title: 'Profundidade do estudo',
    content:
`O nível em que o lead se aprofunda no estudo do modelo institucional apresentado no programa.

• 100% — estudo total: lead absorve toda a profundidade do modelo, da macroeconomia ao posicionamento tático.
• 70% — estudo realista: lead absorve o essencial e contextualiza à própria realidade. Padrão para quem entra com seriedade.
• 30% — estudo mínimo: lead estuda só o básico do modelo.

Default: 70%. Move o slider durante a apresentação para contextualizar com a postura do lead.

Importante: este percentual representa apenas o nível de estudo educacional, não tem qualquer vínculo com resultado financeiro futuro.`,
  },
  projectedGap: {
    title: 'Gap projetado entre os cenários',
    content:
`A diferença numérica entre os dois cenários comparados na projeção principal:

• Cenário atual: distribuição declarada do lead.
• Cenário institucional: composição comparativa (40% S&P + 30% NASDAQ + 20% RF dolarizada + 10% cash).

Esta diferença é escalada pela profundidade de estudo do modelo, representando a porção do gap que dialoga com o nível de educação institucional considerado.

Não é uma promessa de captura. Não é projeção de resultado do programa. É apenas a magnitude da diferença numérica entre os dois cenários simulados.`,
  },
  proportion: {
    title: 'Proporção do programa',
    content:
`Duas leituras comparativas que ajudam a contextualizar o tamanho do custo do programa:

• Em relação ao gap: que percentual do gap projetado o custo do programa representa.
• Em relação ao patrimônio: que percentual do patrimônio atual do lead o custo do programa representa.

Estas são apenas razões matemáticas entre dois números informados. Não representam projeção de retorno, garantia de captura do gap, ou qualquer vínculo entre o custo do programa e resultado financeiro futuro.`,
  },
  ruler: {
    title: 'Régua visual',
    content:
`Representação gráfica das duas magnitudes lado a lado:

• A barra superior (preenchimento total) representa o gap projetado entre os cenários comparados.
• A barra inferior representa o custo do programa, na mesma escala.

A função desta visualização é puramente comparativa: enxergar a relação de tamanho entre os dois números sem precisar calcular percentuais mentalmente.`,
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

function StudyDepthSlider({ value, onChange }) {
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
        "Quanto do modelo institucional você efetivamente estuda."
      </p>
    </div>
  );
}

function ComparisonRuler({ projectedGap, programCost, gapBarWidth, programBarWidth }) {
  return (
    <div className="space-y-2.5">
      {/* Barra do gap */}
      <div className="flex items-center gap-3">
        <span className="w-28 md:w-32 text-[12px] text-txt-2 flex-shrink-0">Gap projetado</span>
        <div className="flex-1 relative h-5 bg-input/80 border border-border rounded-md overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${gapBarWidth}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full"
            style={{ background: 'linear-gradient(90deg, rgba(0,214,125,0.40), rgba(0,214,125,0.85))' }}
          />
        </div>
        <span className="font-mono text-[12.5px] text-txt-1 font-semibold w-28 md:w-32 text-right tabular-nums">
          {formatBRL(projectedGap, true)}
        </span>
      </div>

      {/* Barra do programa */}
      <div className="flex items-center gap-3">
        <span className="w-28 md:w-32 text-[12px] text-txt-2 flex-shrink-0">Programa</span>
        <div className="flex-1 relative h-5 bg-input/80 border border-border rounded-md overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${programBarWidth}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            className="h-full bg-emerald-300"
            style={{ background: '#6EE7B7', minWidth: programCost > 0 ? '2px' : 0 }}
          />
        </div>
        <span className="font-mono text-[12.5px] text-txt-1 font-semibold w-28 md:w-32 text-right tabular-nums">
          {programCost > 0 ? formatBRL(programCost, true) : '—'}
        </span>
      </div>
    </div>
  );
}

export default function DojoComparisonBlock({ gap, patrimony, isOpen, setIsOpen }) {
  const [programCost, setProgramCost] = useState(0);
  const [studyDepth, setStudyDepth] = useState(0.70);

  const programComparison = useMemo(
    () => calculateProgramComparison(
      gap,
      { programCost, studyDepth },
      patrimony,
      USD_BRL[2025]
    ),
    [gap, programCost, studyDepth, patrimony]
  );

  const hasCost = programCost > 0;

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
            {isOpen ? 'Fechar' : 'Leitura comparativa de magnitudes'}
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

              {/* ZONA 1 — Header */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10, duration: 0.4 }}
                className="relative space-y-1"
              >
                <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.20em] text-txt-3">
                  LEITURA COMPARATIVA
                </h3>
                <p className="text-[12px] text-txt-3">
                  Magnitude do programa em relação aos cenários
                </p>
              </motion.div>

              {/* ZONA 2 — Inputs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
                    Custo do programa
                  </label>
                  <CurrencyInput
                    value={programCost}
                    onChange={setProgramCost}
                    placeholder="0"
                  />
                  <p className="text-[11px] text-txt-4 mt-2">
                    Digite o valor do tier que está apresentando.
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
                    Profundidade do estudo
                    <InfoTooltip title={DOJO_TT.studyDepth.title} content={DOJO_TT.studyDepth.content} position="bottom" />
                  </label>
                  <StudyDepthSlider value={studyDepth} onChange={setStudyDepth} />
                </div>
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 3 — Gap projetado entre os cenários (número herói) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] md:text-[11px] uppercase tracking-[0.20em] text-txt-3 font-bold mb-3">
                  GAP PROJETADO ENTRE OS CENÁRIOS
                  <InfoTooltip title={DOJO_TT.projectedGap.title} content={DOJO_TT.projectedGap.content} position="bottom" />
                </div>

                <div
                  className="font-mono font-extrabold tabular-nums text-emerald leading-none break-all"
                  style={{
                    fontSize: 'clamp(36px, 5.5vw, 56px)',
                    letterSpacing: '-0.03em',
                    textShadow: '0 0 40px rgba(0,214,125,0.30)',
                  }}
                >
                  <CountUp
                    end={programComparison.projectedGap}
                    duration={2.0}
                    separator="."
                    decimals={0}
                    prefix="R$ "
                    preserveValue
                  />
                </div>

                <div className="font-mono text-base md:text-lg text-emerald/70 tabular-nums mt-2">
                  <CountUp
                    end={programComparison.projectedGapUSD}
                    duration={2.0}
                    separator=","
                    decimals={0}
                    prefix="US$ "
                    preserveValue
                  />
                </div>
                <div className="text-[11px] text-txt-3 mt-2">
                  diferença comparada entre cenário atual e cenário institucional
                </div>
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 4 — Proporção do programa */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.5 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-txt-3 font-bold mb-3">
                  <BarChart3 className="w-3 h-3 text-emerald" />
                  PROPORÇÃO DO PROGRAMA
                  <InfoTooltip title={DOJO_TT.proportion.title} content={DOJO_TT.proportion.content} position="bottom" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-input/60 border border-emerald/25 px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-txt-3 font-semibold mb-2">
                      EM RELAÇÃO AO GAP
                    </div>
                    <div className="font-mono text-3xl md:text-4xl font-extrabold text-emerald tabular-nums leading-none">
                      {programComparison.programAsPercentOfGap !== null ? (
                        <CountUp
                          end={programComparison.programAsPercentOfGap}
                          duration={1.5}
                          decimals={1}
                          suffix="%"
                          preserveValue
                        />
                      ) : (
                        <span className="text-txt-3">—</span>
                      )}
                    </div>
                    <div className="text-[12px] text-txt-3 mt-2">do gap projetado</div>
                  </div>

                  <div className="rounded-xl bg-input/60 border border-emerald/25 px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-txt-3 font-semibold mb-2">
                      EM RELAÇÃO AO PATRIMÔNIO
                    </div>
                    <div className="font-mono text-3xl md:text-4xl font-extrabold text-emerald tabular-nums leading-none">
                      {programComparison.programAsPercentOfPatrimony !== null ? (
                        <CountUp
                          end={programComparison.programAsPercentOfPatrimony}
                          duration={1.5}
                          decimals={1}
                          suffix="%"
                          preserveValue
                        />
                      ) : (
                        <span className="text-txt-3">—</span>
                      )}
                    </div>
                    <div className="text-[12px] text-txt-3 mt-2">do seu patrimônio atual</div>
                  </div>
                </div>

                {!hasCost && (
                  <div className="text-[12px] text-emerald/80 italic mt-3">
                    Insira o custo do programa para visualizar a proporção.
                  </div>
                )}
              </motion.div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

              {/* ZONA 5 — Régua visual */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-txt-3 font-bold mb-3">
                  <Ruler className="w-3 h-3 text-emerald" />
                  RÉGUA VISUAL
                  <InfoTooltip title={DOJO_TT.ruler.title} content={DOJO_TT.ruler.content} position="top" />
                </div>
                <ComparisonRuler
                  projectedGap={programComparison.projectedGap}
                  programCost={programCost}
                  gapBarWidth={programComparison.gapBarWidth}
                  programBarWidth={programComparison.programBarWidth}
                />
              </motion.div>

              {/* ZONA 6 — Tagline final + Disclaimer */}
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
                  <span className="text-emerald-300">É a magnitude do que você acabou de ver.</span>
                </div>
              </motion.div>

              <p className="relative text-[11px] text-txt-3 italic leading-relaxed pt-2 max-w-3xl mx-auto text-center">
                Os números apresentados neste bloco são leituras comparativas entre magnitudes
                informadas (custo do programa, gap simulado e patrimônio declarado). Não constituem
                projeção de retorno, promessa de ganho, ou qualquer vínculo entre o programa
                educacional e resultados financeiros futuros do lead. O Vata Dojo é uma empresa de
                educação financeira; não atua como instituição financeira, corretora ou consultoria
                de investimentos. Rentabilidade passada não é garantia de rentabilidade futura.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
