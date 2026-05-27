import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Sparkles, TrendingDown } from 'lucide-react';
import ChartCard from './ChartCard.jsx';
import OperatorTooltip from './OperatorTooltip.jsx';
import {
  calcularSubtracaoRendaFixa,
  calcularSubtracaoInstitucional,
  anosDePerdaReal,
  buildPurchasingPowerSeries,
  formatBRL,
} from '../lib/engine.js';
import { INSTITUTIONAL_PORTFOLIO_RETURN } from '../lib/data.js';

const REF_VALUE = 1_000_000;

function SubtractionCard({ label, sublabel, value, sign, color, hero, heroAccent, negative }) {
  const cardCls = [
    'subtraction-card',
    hero ? 'subtraction-card-hero' : '',
    hero && heroAccent === 'institutional' ? 'subtraction-card-hero-institutional' : '',
    negative ? 'subtraction-negative' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardCls}>
      <div className="subtraction-label">
        {label}
        {sublabel && <span className="subtraction-sublabel">{sublabel}</span>}
      </div>
      <div
        className={hero ? 'subtraction-value-hero' : 'subtraction-value'}
        style={{ color }}
      >
        {sign}{' '}
        <CountUp
          start={0}
          end={Math.abs(value)}
          duration={1.8}
          separator="."
          decimals={0}
          prefix="R$ "
          preserveValue
        />
      </div>
    </div>
  );
}

function SubtractionBlock({
  title, ganho, perda, saldo, ganhoLabel, perdaLabel, traducao, variant, isNegativo,
}) {
  const isInst = variant === 'institutional';
  const blockCls = `subtraction-block ${isInst ? 'subtraction-block-institutional' : ''}`.trim();
  const titleCls = `subtraction-title ${isInst ? 'subtraction-title-institutional' : ''}`.trim();

  const saldoColor = isNegativo
    ? '#EF4444'
    : isInst
      ? '#00D67D'
      : saldo < ganho * 0.5
        ? '#FBBF24'
        : '#00D67D';

  const ganhoColor = isInst ? '#00D67D' : '#10B981';
  const perdaColor = '#F87171';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={blockCls}
    >
      <div className={titleCls}>{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SubtractionCard
          label={ganhoLabel}
          sublabel="em juros"
          value={ganho}
          sign="+"
          color={ganhoColor}
        />
        <SubtractionCard
          label={perdaLabel}
          sublabel="poder de compra"
          value={perda}
          sign="−"
          color={perdaColor}
        />
        <SubtractionCard
          label="SALDO REAL"
          sublabel="em 10 anos"
          value={saldo}
          sign={saldo >= 0 ? '+' : '−'}
          color={saldoColor}
          hero
          heroAccent={isInst ? 'institutional' : 'default'}
          negative={isNegativo}
        />
      </div>
      {traducao && (
        <div className="subtraction-translation" dangerouslySetInnerHTML={{ __html: traducao }} />
      )}
    </motion.div>
  );
}

function PurchasingPowerChart({ valorInicial }) {
  const data = useMemo(
    () => buildPurchasingPowerSeries(valorInicial, INSTITUTIONAL_PORTFOLIO_RETURN, 2016, 2025),
    [valorInicial]
  );

  return (
    <div className="mt-2">
      <div className="text-[10px] tracking-[0.18em] uppercase text-txt-3 mb-2 font-semibold">
        Poder de compra ao longo do tempo
        <span className="text-txt-4 normal-case tracking-normal font-normal ml-2">
          · valores nominais com linha de break-even da inflação real Vata
        </span>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatBRL(v, true)}
              width={75}
            />
            <Tooltip content={<OperatorTooltip formatter={(v) => formatBRL(v)} />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="institucional"
              name="Posicionado como operador"
              stroke="#00D67D"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="rfBR"
              name="Renda Fixa BR"
              stroke="#94A3B8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="breakEven"
              name="Break-even da inflação real"
              stroke="#F87171"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function NegativeYearsBlock({ anos }) {
  if (!anos.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="negative-years-block"
    >
      <div className="negative-years-title flex items-center gap-2">
        <TrendingDown className="w-3.5 h-3.5 text-rose" />
        Anos em que você pagou para deixar parado
      </div>
      {anos.map((a, i) => (
        <motion.div
          key={a.ano}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.35 }}
          className="negative-year-row"
        >
          <span className="negative-year-label">{a.ano}</span>
          <span className="negative-year-value">▼ {a.perda.toFixed(1)}%</span>
          <span className="negative-year-context">{a.contexto}</span>
        </motion.div>
      ))}
      <div className="negative-years-footer">
        Em {anos.length} dos últimos 10 anos, sua renda fixa "segura" te deixou
        mais pobre em poder de compra real.
      </div>
    </motion.div>
  );
}

export default function FixedIncomeBRChart({ patrimony, distribution }) {
  const valorRendaFixa = useMemo(() => {
    const leadRF = (patrimony ?? 0) * (distribution?.rfBR ?? 0);
    return leadRF > 0 ? leadRF : REF_VALUE;
  }, [patrimony, distribution]);

  const usandoReferencia = valorRendaFixa === REF_VALUE
    && !((patrimony ?? 0) * (distribution?.rfBR ?? 0) > 0);

  const subtracaoRF = useMemo(
    () => calcularSubtracaoRendaFixa(valorRendaFixa, 2016, 2025),
    [valorRendaFixa]
  );
  const subtracaoInst = useMemo(
    () => calcularSubtracaoInstitucional(valorRendaFixa, INSTITUTIONAL_PORTFOLIO_RETURN, 2016, 2025),
    [valorRendaFixa]
  );
  const anosNegativos = useMemo(() => anosDePerdaReal(), []);

  const reposicao = Math.round(subtracaoRF.proporcaoReposicao);
  const sobra = Math.round(subtracaoRF.proporcaoSobra);

  const traducaoRF = subtracaoRF.isNegativo
    ? `Você "ganhou" <strong>${formatBRL(subtracaoRF.ganhoNominal, true)}</strong>, mas a inflação real comeu <strong>${formatBRL(subtracaoRF.perdaPoderCompra, true)}</strong>. Você terminou <strong>${formatBRL(Math.abs(subtracaoRF.saldoReal), true)} mais pobre</strong> em poder de compra.`
    : `De cada <strong>R$ 100</strong> que você "ganhou", <strong>R$ ${reposicao}</strong> foram apenas repondo o que a inflação real comeu. Sobrou <strong>R$ ${sobra}</strong>.`;

  const multiploSaldo = subtracaoRF.saldoReal > 0
    ? Math.round(subtracaoInst.saldoReal / subtracaoRF.saldoReal)
    : null;

  const traducaoInst = multiploSaldo != null
    ? `Saldo real institucional: <strong>${multiploSaldo}× maior</strong> que o seu. Mesma inflação. Mesma década. Posicionamento diferente.`
    : `O posicionamento institucional gera saldo real positivo enquanto a renda fixa fica abaixo da inflação real.`;

  const badge = (
    <span className="badge bg-emerald/15 text-emerald border border-emerald/30">
      <Sparkles className="w-3 h-3" />
      Ponto central da narrativa
    </span>
  );

  const subtitle = usandoReferencia
    ? 'Aplicando R$ 1.000.000 em uma carteira ponderada típica (40% CDI + 25% LCI/LCA + 20% IPCA+5,5% + 15% CRI/CRA) entre 2016 e 2025 · valor de referência'
    : `Aplicando a fatia de renda fixa BR do seu patrimônio (${formatBRL(valorRendaFixa, true)}) entre 2016 e 2025`;

  return (
    <ChartCard
      title="Sua renda fixa: o que ela realmente fez pelo seu poder de compra"
      subtitle={subtitle}
      variant="glow"
      badge={badge}
      footer={
        <p className="text-[14px] text-txt-2 italic leading-relaxed max-w-3xl">
          "Renda fixa não é segura. É lenta. E lentidão, com a inflação real correndo, é perda disfarçada de ganho."
        </p>
      }
    >
      <SubtractionBlock
        title="Sua renda fixa nos últimos 10 anos"
        variant="lead"
        ganhoLabel="VOCÊ GANHOU"
        perdaLabel="VOCÊ PERDEU"
        ganho={subtracaoRF.ganhoNominal}
        perda={subtracaoRF.perdaPoderCompra}
        saldo={subtracaoRF.saldoReal}
        isNegativo={subtracaoRF.isNegativo}
        traducao={traducaoRF}
      />

      <SubtractionBlock
        title="Se estivesse posicionado como operador"
        variant="institutional"
        ganhoLabel="TERIA GANHO"
        perdaLabel="PERDA P/ INFLAÇÃO"
        ganho={subtracaoInst.ganhoNominal}
        perda={subtracaoInst.perdaPoderCompra}
        saldo={subtracaoInst.saldoReal}
        isNegativo={subtracaoInst.isNegativo}
        traducao={traducaoInst}
      />

      <PurchasingPowerChart valorInicial={valorRendaFixa} />

      <NegativeYearsBlock anos={anosNegativos} />
    </ChartCard>
  );
}
