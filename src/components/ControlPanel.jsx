import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiggyBank, Calendar, Sliders, TrendingDown, Minus, TrendingUp,
  Landmark, BarChart3, Building2, Globe, Layers, User,
} from 'lucide-react';
import {
  derivePatrimony, deriveDistribution, formatBRL,
} from '../lib/engine.js';
import InfoTooltip from './InfoTooltip.jsx';
import { TT } from '../lib/tooltips.js';

const PREMISES = [
  { id: 'historica',    label: 'Histórica',    icon: TrendingUp,   hint: '100% retornos médios' },
  { id: 'conservadora', label: 'Conservadora', icon: Minus,        hint: '70% retornos médios' },
  { id: 'pessimista',   label: 'Pessimista',   icon: TrendingDown, hint: '50% retornos médios' },
];

const PREMISE_DESCRIPTIONS = {
  historica: {
    title: 'HISTÓRICA',
    body: 'Projetamos o futuro usando exatamente os retornos médios reais dos últimos 10 anos. Sem desconto, sem otimismo. É o que aconteceu de fato no mundo entre 2016 e 2025.',
    example: 'Exemplo: o S&P 500 em real rendeu 19% ao ano nesse período. A premissa histórica projeta os próximos anos com esses mesmos 19% ao ano.',
  },
  conservadora: {
    title: 'CONSERVADORA',
    body: 'Aplicamos um corte de 30% sobre todos os retornos históricos. Assume que os próximos anos serão piores que a década passada. É o cenário "vamos descontar o otimismo".',
    example: 'No exemplo: 19% × 0,7 = 13,3% ao ano para o S&P em real. Mesmo com esse corte, o gap permanece relevante.',
  },
  pessimista: {
    title: 'PESSIMISTA',
    body: 'Cortamos pela metade. Assume que os próximos anos terão metade do retorno histórico — cenário de stress severo, equivalente a uma década perdida.',
    example: 'No exemplo: 19% × 0,5 = 9,5% ao ano. É o teste de resistência da tese: mesmo no pior caso plausível, posicionamento institucional ainda gera gap relevante contra a inação.',
  },
};

const DIST_ITEMS = [
  { key: 'rfBR',       label: 'Renda Fixa BR',          hint: 'CDB, LCI, LCA, Tesouro',  color: '#94A3B8', icon: Landmark,   tt: 'rfBR'       },
  { key: 'rvBR',       label: 'Renda Variável BR',      hint: 'Ações, FIIs, fundos',     color: '#06B6D4', icon: BarChart3,  tt: 'rvBR'       },
  { key: 'imoveis',    label: 'Imóveis BR',             hint: 'FIIs imobiliários reais', color: '#FBBF24', icon: Building2,  tt: 'imoveis'    },
  { key: 'dolarizado', label: 'Dolarizado / Exterior',  hint: 'BDRs, ETFs, exterior',    color: '#00D67D', icon: Globe,      tt: 'dolarizado' },
  { key: 'outros',     label: 'Outros',                 hint: 'Cripto, alternativos',    color: '#8B5CF6', icon: Layers,     tt: 'outros'     },
];

function formatNumberInput(v) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(v || 0);
}

function CurrencyInput({ icon: Icon, label, value, onChange, hint, accent = 'emerald', size = 'md', tooltip }) {
  const [str, setStr] = useState(formatNumberInput(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setStr(formatNumberInput(value));
  }, [value, focused]);

  function handleChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    setStr(formatNumberInput(num));
    onChange(num);
  }

  function handleBlur() {
    setFocused(false);
    setStr(formatNumberInput(value));
  }

  const accentBg   = { emerald: 'bg-emerald/10', cyan: 'bg-cyan/10', violet: 'bg-violet/10', amber: 'bg-amber/10' }[accent];
  const accentText = { emerald: 'text-emerald',  cyan: 'text-cyan',  violet: 'text-violet',  amber: 'text-amber'  }[accent];
  const fontSize   = size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div>
      {label && (
        <label className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
          {Icon && (
            <span className={`w-6 h-6 rounded-md ${accentBg} flex items-center justify-center`}>
              <Icon className={`w-3.5 h-3.5 ${accentText}`} />
            </span>
          )}
          {label}
          {tooltip && (
            <InfoTooltip title={tooltip.title} content={tooltip.content} position="bottom" />
          )}
        </label>
      )}
      <div className="input-base flex items-baseline gap-3 px-4 py-3">
        <span className="text-txt-3 text-sm font-mono font-medium">R$</span>
        <input
          type="text"
          inputMode="numeric"
          value={str}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className={`bg-transparent flex-1 outline-none text-txt-1 number ${fontSize} font-semibold tracking-tight w-full`}
        />
      </div>
      {hint && <div className="text-[10px] text-txt-4 mt-1.5 ml-8">{hint}</div>}
    </div>
  );
}

function CompactCurrencyRow({ item, value, onChange }) {
  const [str, setStr] = useState(formatNumberInput(value));
  const [focused, setFocused] = useState(false);
  const Icon = item.icon;

  useEffect(() => {
    if (!focused) setStr(formatNumberInput(value));
  }, [value, focused]);

  function handleChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    setStr(formatNumberInput(num));
    onChange(num);
  }

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center input-base px-3 py-2.5">
      <span
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-txt-1 leading-tight">
          <span>{item.label}</span>
          {item.tt && TT[item.tt] && (
            <InfoTooltip title={TT[item.tt].title} content={TT[item.tt].content} position="right" />
          )}
        </div>
        <div className="text-[10px] text-txt-4 leading-tight mt-0.5">{item.hint}</div>
      </div>
      <div className="flex items-baseline gap-2 min-w-[140px] justify-end">
        <span className="text-[10px] text-txt-4 font-mono">R$</span>
        <input
          type="text"
          inputMode="numeric"
          value={str}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setStr(formatNumberInput(value)); }}
          className="bg-transparent outline-none text-txt-1 number text-base font-semibold tracking-tight text-right w-[120px]"
        />
      </div>
    </div>
  );
}

function StackedDistributionBar({ distribution }) {
  return (
    <div className="flex h-2 rounded-full overflow-hidden border border-border bg-input">
      {DIST_ITEMS.map((it) => {
        const w = (distribution[it.key] || 0) * 100;
        if (w < 0.5) return null;
        return (
          <div
            key={it.key}
            className="transition-all duration-300"
            style={{ width: `${w}%`, background: it.color }}
            title={`${it.label}: ${w.toFixed(0)}%`}
          />
        );
      })}
    </div>
  );
}

function HorizonSlider({ value, onChange }) {
  const pct = ((value - 1) / 19) * 100;
  return (
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-txt-3 font-semibold">
          <span className="w-6 h-6 rounded-md bg-amber/10 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-amber" />
          </span>
          Horizonte
        </span>
        <span className="font-mono">
          <span className="text-2xl text-txt-1 font-bold tracking-tight">{value}</span>
          <span className="text-sm text-txt-3 ml-1">anos</span>
        </span>
      </label>
      <input
        type="range"
        min={1}
        max={20}
        step={1}
        value={value}
        style={{ '--val': `${pct}%` }}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
      <div className="flex justify-between mt-1.5 text-[10px] text-txt-4 font-mono">
        <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span>
      </div>
    </div>
  );
}

function PremiseSelect({ value, onChange }) {
  const desc = PREMISE_DESCRIPTIONS[value] ?? PREMISE_DESCRIPTIONS.historica;
  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
        Premissa de retorno
      </label>
      <div className="grid grid-cols-3 gap-2">
        {PREMISES.map((o) => {
          const Icon = o.icon;
          const active = value === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onChange(o.id)}
              title={o.hint}
              className={
                'relative px-2 py-3 text-[12px] rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ' +
                (active
                  ? 'bg-emerald/10 border-emerald text-emerald shadow-glow'
                  : 'bg-input border-border text-txt-3 hover:border-border-strong hover:text-txt-1')
              }
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold">{o.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3 rounded-xl border border-border bg-input/60 px-3.5 py-3"
      >
        <div className="text-[10px] tracking-[0.18em] text-emerald font-bold mb-1.5">
          {desc.title}
        </div>
        <p className="text-[11.5px] text-txt-2 leading-relaxed">
          {desc.body}
        </p>
        <p className="text-[11px] text-txt-3 italic leading-relaxed mt-2">
          {desc.example}
        </p>
      </motion.div>
    </div>
  );
}

function AgeInput({ value, onChange }) {
  const [str, setStr] = useState(value == null ? '' : String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setStr(value == null ? '' : String(value));
  }, [value, focused]);

  function handleChange(e) {
    // Aceita digitação livre — apenas filtra não-dígitos e limita a 2 chars
    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
    setStr(raw);
    if (raw === '') {
      onChange(null);
    } else {
      // Não clampa durante a digitação — passa o valor cru para permitir começar com 1, 2, etc.
      onChange(parseInt(raw, 10));
    }
  }

  function handleBlur() {
    setFocused(false);
    if (str === '') { onChange(null); return; }
    // Clampa apenas ao perder foco
    const n = Math.max(18, Math.min(99, parseInt(str, 10) || 18));
    setStr(String(n));
    onChange(n);
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
        <span className="w-6 h-6 rounded-md bg-violet/10 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-violet" />
        </span>
        Idade do lead
        <span className="text-[9px] tracking-normal text-txt-4 font-normal lowercase">(opcional)</span>
        <InfoTooltip title={TT.age.title} content={TT.age.content} position="bottom" />
      </label>
      <div className="input-base flex items-baseline gap-3 px-4 py-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={str}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder="—"
          className="bg-transparent flex-1 outline-none text-txt-1 number text-2xl font-semibold tracking-tight w-full"
        />
        <span className="text-txt-3 text-sm font-medium">anos</span>
      </div>
      {value != null && value >= 18 && (
        <div className="text-[10px] text-txt-4 mt-1.5 ml-8">
          Aceita 18-99 anos
        </div>
      )}
    </div>
  );
}

export default function ControlPanel({ inputs, setInputs, patrimony, distribution }) {
  function setDistValue(key, val) {
    setInputs((p) => ({
      ...p,
      distributionValues: { ...p.distributionValues, [key]: val },
    }));
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-base/85 border-b border-border"
    >
      <div className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* COLUNA 1 — Aporte + Idade */}
          <div className="lg:col-span-3 space-y-4">
            <CurrencyInput
              icon={PiggyBank}
              label="Aporte mensal"
              value={inputs.monthlyContribution}
              onChange={(v) => setInputs((p) => ({ ...p, monthlyContribution: v }))}
              hint={`${formatBRL(inputs.monthlyContribution * 12, true)} por ano`}
              accent="cyan"
              tooltip={TT.monthlyContribution}
            />
            <AgeInput
              value={inputs.leadAge}
              onChange={(v) => setInputs((p) => ({ ...p, leadAge: v }))}
            />
          </div>

          {/* COLUNA 2 (CENTRAL) — Patrimônio derivado + 5 inputs por classe + barra */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-gradient-card p-5 mb-3">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-txt-3 font-semibold">
                  <span className="w-6 h-6 rounded-md bg-emerald/10 flex items-center justify-center">
                    <Sliders className="w-3.5 h-3.5 text-emerald" />
                  </span>
                  Patrimônio total
                </div>
                <div className="text-[10px] text-txt-4 font-mono">soma derivada</div>
              </div>
              <div className="font-mono font-extrabold text-txt-1 tracking-tight" style={{ fontSize: 40, lineHeight: 1 }}>
                {formatBRL(patrimony, false)}
              </div>
            </div>

            <div className="space-y-2">
              {DIST_ITEMS.map((it) => (
                <CompactCurrencyRow
                  key={it.key}
                  item={it}
                  value={inputs.distributionValues[it.key] || 0}
                  onChange={(v) => setDistValue(it.key, v)}
                />
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2 text-[10px] text-txt-4 font-mono">
                <span>Distribuição (proporção)</span>
                <span>
                  {DIST_ITEMS.map((it, i) => (
                    <span key={it.key} style={{ color: it.color }}>
                      {((distribution[it.key] || 0) * 100).toFixed(0)}%
                      {i < DIST_ITEMS.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </span>
              </div>
              <StackedDistributionBar distribution={distribution} />
            </div>
          </div>

          {/* COLUNA 3 — Horizonte + Premissa */}
          <div className="lg:col-span-3 space-y-5">
            <HorizonSlider
              value={inputs.horizon}
              onChange={(v) => setInputs((p) => ({ ...p, horizon: v }))}
            />
            <PremiseSelect
              value={inputs.premise}
              onChange={(v) => setInputs((p) => ({ ...p, premise: v }))}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
