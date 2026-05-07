/* ============================================================
   Vata Dojo — Engine de cálculo + formatadores
   Fonte: dashboard_vendas_v2.md, seções 7, 8, 11.4 e 11.5
   ============================================================ */

import {
  YEARS, USD_BRL, RFBR_BRL, RFBR_USD, IBOV, FIPEZAP, SP500, MAG7_CAGR,
  CDI, ASSET_CLASS_RETURNS, INSTITUTIONAL_PORTFOLIO_RETURN,
  PREMISE_MULTIPLIERS, VISCERAL_DIVISORS, INFLACAO_REAL_VATA,
} from './data.js';

// ---------- V1.5 Inflação ----------
/** CAGR do Índice Vata de Inflação Real (~6,2% a.a.) */
export const INFLACAO_REAL_CAGR = INFLACAO_REAL_VATA.cagr;

/** CAGR do IPCA oficial 10 anos (~5,12% a.a.) */
export const IPCA_CAGR = 0.0512;

/**
 * Aplica desconto de inflação real Vata sobre uma taxa nominal.
 * Retorna a taxa real ajustada pela cesta do HNWI.
 */
export function realRateInflacaoVata(nominalRate) {
  return ((1 + nominalRate) / (1 + INFLACAO_REAL_CAGR)) - 1;
}

/**
 * Aplica desconto de IPCA oficial. Mantida para comparações.
 */
export function realRateIpca(nominalRate) {
  return ((1 + nominalRate) / (1 + IPCA_CAGR)) - 1;
}

/**
 * Desvio-padrão anualizado de uma série de retornos.
 */
export function calculateVolatility(returnsArray) {
  const n = returnsArray.length;
  if (n === 0) return 0;
  const mean = returnsArray.reduce((a, b) => a + b, 0) / n;
  const variance = returnsArray.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

// ---------- V1.5 Helpers derivados de distributionValues ----------

/** Patrimônio total derivado da soma dos valores por classe. */
export function derivePatrimony(distributionValues) {
  return Object.values(distributionValues).reduce((acc, v) => acc + (Number(v) || 0), 0);
}

/** Distribuição em proporção decimal derivada dos valores. */
export function deriveDistribution(distributionValues) {
  const total = derivePatrimony(distributionValues);
  if (total === 0) {
    return { rfBR: 0, rvBR: 0, imoveis: 0, dolarizado: 0, outros: 0 };
  }
  return {
    rfBR:       distributionValues.rfBR       / total,
    rvBR:       distributionValues.rvBR       / total,
    imoveis:    distributionValues.imoveis    / total,
    dolarizado: distributionValues.dolarizado / total,
    outros:     distributionValues.outros     / total,
  };
}

// ---------- 8.2 Retorno ponderado do portfólio do lead ----------
export function leadPortfolioReturn(distribution) {
  return (
    distribution.rfBR       * ASSET_CLASS_RETURNS.rfBR +
    distribution.rvBR       * ASSET_CLASS_RETURNS.rvBR +
    distribution.imoveis    * ASSET_CLASS_RETURNS.imoveis +
    distribution.dolarizado * ASSET_CLASS_RETURNS.dolarizado +
    distribution.outros     * ASSET_CLASS_RETURNS.outros
  );
}

// ---------- 8.3 Aplicação da premissa ----------
export function applyPremise(rate, premise) {
  return rate * (PREMISE_MULTIPLIERS[premise] ?? 1.0);
}

// ---------- 8.1 Juros compostos com aporte mensal ----------
export function calculatePatrimonyOverTime(P, A, r, N) {
  const monthlyRate = r / 12;
  const result = [];
  for (let year = 0; year <= N; year++) {
    const m = year * 12;
    const compoundedPrincipal = P * Math.pow(1 + monthlyRate, m);
    const compoundedContributions = monthlyRate > 0
      ? A * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate)
      : A * m;
    result.push(compoundedPrincipal + compoundedContributions);
  }
  return result;
}

// ---------- 8.4 Cálculo do gap completo ----------
export function calculateGap(inputs) {
  const leadRate = applyPremise(leadPortfolioReturn(inputs.distribution), inputs.premise);
  const institutionalRate = applyPremise(INSTITUTIONAL_PORTFOLIO_RETURN, inputs.premise);

  const leadTrajectory = calculatePatrimonyOverTime(
    inputs.patrimony, inputs.monthlyContribution, leadRate, inputs.horizon
  );
  const institutionalTrajectory = calculatePatrimonyOverTime(
    inputs.patrimony, inputs.monthlyContribution, institutionalRate, inputs.horizon
  );

  const finalLead          = leadTrajectory[leadTrajectory.length - 1];
  const finalInstitutional = institutionalTrajectory[institutionalTrajectory.length - 1];
  const gapAbsolute        = finalInstitutional - finalLead;
  const gapPercentage      = ((finalInstitutional - finalLead) / finalLead) * 100;

  return {
    leadTrajectory,
    institutionalTrajectory,
    finalLead,
    finalInstitutional,
    gapAbsolute,
    gapPercentage,
    leadRate,
    institutionalRate,
  };
}

// ---------- Trajetórias retroativas (Zona 2) ----------
export function buildHistoricalTrajectory(initialBRL, annualReturnsByYear) {
  const out = [{ year: YEARS[0] - 1, value: initialBRL }];
  let v = initialBRL;
  for (const y of YEARS) {
    const r = annualReturnsByYear[y] ?? 0;
    v = v * (1 + r);
    out.push({ year: y, value: v });
  }
  return out;
}

export function buildLeadHistoricalBRL(initialBRL, distribution) {
  const out = [{ year: YEARS[0] - 1, value: initialBRL }];
  let v = initialBRL;
  for (const y of YEARS) {
    const r =
      distribution.rfBR       * (RFBR_BRL[y] ?? 0) +
      distribution.rvBR       * (IBOV[y] ?? 0) +
      distribution.imoveis    * (FIPEZAP[y] ?? 0) +
      distribution.dolarizado * convertSP500toBRLAnual(y) +
      distribution.outros     * (CDI[y] ?? 0);
    v = v * (1 + r);
    out.push({ year: y, value: v });
  }
  return out;
}

export function convertSP500toBRLAnual(year) {
  const idx = YEARS.indexOf(year);
  if (idx < 0) return 0;
  const usdInicio = idx === 0 ? 3.96 : USD_BRL[YEARS[idx - 1]];
  const usdFim    = USD_BRL[year];
  const rUsd = SP500[year] ?? 0;
  return (1 + rUsd) * (usdFim / usdInicio) - 1;
}

export function buildMag7HistoricalBRL(initialBRL) {
  const out = [{ year: YEARS[0] - 1, value: initialBRL }];
  let v = initialBRL;
  for (let i = 0; i < YEARS.length; i++) {
    const y = YEARS[i];
    const usdInicio = i === 0 ? 3.96 : USD_BRL[YEARS[i - 1]];
    const usdFim    = USD_BRL[y];
    const rUsd      = MAG7_CAGR;
    const rBRL      = (1 + rUsd) * (usdFim / usdInicio) - 1;
    v = v * (1 + rBRL);
    out.push({ year: y, value: v });
  }
  return out;
}

export function buildRfBRinUSD(initialBRL) {
  let valBRL = initialBRL;
  const out = [{ year: YEARS[0] - 1, value: initialBRL / 3.96, valueBRL: initialBRL }];
  for (let i = 0; i < YEARS.length; i++) {
    const y = YEARS[i];
    valBRL = valBRL * (1 + (RFBR_BRL[y] ?? 0));
    out.push({ year: y, value: valBRL / USD_BRL[y], valueBRL: valBRL });
  }
  return out;
}

export function buildImovelTrajectory(initialBRL) {
  let valBRL = initialBRL;
  const outBRL = [{ year: YEARS[0] - 1, value: initialBRL }];
  const outUSD = [{ year: YEARS[0] - 1, value: initialBRL / 3.96 }];
  for (let i = 0; i < YEARS.length; i++) {
    const y = YEARS[i];
    valBRL = valBRL * (1 + (FIPEZAP[y] ?? 0));
    outBRL.push({ year: y, value: valBRL });
    outUSD.push({ year: y, value: valBRL / USD_BRL[y] });
  }
  return { brl: outBRL, usd: outUSD };
}

// ---------- 8.6 Tradução visceral (V1.5 — 10 categorias) ----------
export function visceralEquivalents(gapBRL, leadPatrimony) {
  if (!gapBRL || gapBRL <= 0) return [];

  const yearOfIncome = Math.max(leadPatrimony * 0.05, 50_000);
  const passiveMonthly = (gapBRL * VISCERAL_DIVISORS.rendaPassivaTaxa) / 12;

  const allEquivalents = [
    // === V1 ===
    {
      id: 'apartments',
      label: 'apartamentos médios em capital',
      icon: 'Building2',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.apartmentCapital),
    },
    {
      id: 'yearsOfIncome',
      label: 'anos da sua renda atual estimada',
      icon: 'Briefcase',
      value: Math.floor(gapBRL / yearOfIncome),
    },
    {
      id: 'tuitions',
      label: 'anos de mensalidade premium',
      icon: 'GraduationCap',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.premiumTuition),
    },
    {
      id: 'trips',
      label: 'viagens internacionais executivas',
      icon: 'Plane',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.intlExecutiveTrip),
    },
    {
      id: 'cars',
      label: 'carros premium zero km',
      icon: 'Car',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.premiumCar),
    },

    // === V1.5 NOVOS ===
    {
      id: 'passiveIncome',
      label: 'de renda passiva mensal vitalícia',
      icon: 'Banknote',
      value: Math.floor(passiveMonthly),
      isCurrency: true,
    },
    {
      id: 'earlyRetirement',
      label: 'anos de aposentadoria antecipada',
      icon: 'Sunset',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.custoVidaHNWIAnual),
    },
    {
      id: 'foreignEducation',
      label: 'semestres em Wharton, Stanford ou Harvard',
      icon: 'School',
      value: Math.floor(gapBRL / VISCERAL_DIVISORS.semestreUniversidadePremium),
    },
    {
      id: 'lifetimeAllowance',
      label: 'de mesada vitalícia para você nunca mais trabalhar',
      icon: 'Coins',
      value: Math.floor(passiveMonthly),
      isCurrency: true,
    },
    {
      id: 'lifestyleYears',
      label: 'anos vivendo do patrimônio mantendo seu padrão',
      icon: 'Sailboat',
      value: leadPatrimony > 0
        ? Math.floor(gapBRL / (leadPatrimony * VISCERAL_DIVISORS.custoVidaPadraoMultiplicador))
        : 0,
    },
  ];

  // Filtrar válidos
  const validEquivalents = allEquivalents.filter((eq) => {
    if (eq.isCurrency) return eq.value >= 1000; // ao menos R$ 1.000/mês
    return eq.value >= 1 && eq.value <= 9999;
  });

  // Priorizar por tamanho do gap
  const isLargeGap = gapBRL > 5_000_000;
  const priorityOrder = isLargeGap
    ? ['passiveIncome', 'earlyRetirement', 'lifestyleYears', 'foreignEducation', 'apartments',
       'lifetimeAllowance', 'yearsOfIncome', 'cars', 'tuitions', 'trips']
    : ['tuitions', 'trips', 'cars', 'apartments', 'yearsOfIncome',
       'passiveIncome', 'lifetimeAllowance', 'lifestyleYears', 'earlyRetirement', 'foreignEducation'];

  // Dedup IDs já vistos (passiveIncome e lifetimeAllowance têm o mesmo valor)
  const seen = new Set();
  return priorityOrder
    .map((id) => validEquivalents.find((eq) => eq.id === id))
    .filter((eq) => {
      if (!eq) return false;
      // evita duplicar mesma métrica numérica (passive + lifetime)
      const key = eq.isCurrency ? `currency-${eq.value}` : `count-${eq.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
}

// ---------- Formatadores ----------
export function brlToUsd(amountBRL, year) {
  const rate = USD_BRL[year] ?? USD_BRL[2025];
  return amountBRL / rate;
}

export function formatBRL(amount, compact = false) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(amount);
}

export function formatUSD(amount, compact = false) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(amount);
}

export function formatPercent(value, decimals = 1) {
  const pct = value * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(decimals)}%`;
}

export function formatNumber(n) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n);
}

// ---------- Distribuição: redistribui mantendo soma = 1 ----------
export function rebalanceDistribution(distribution, changedKey, newValue) {
  const safeNew = Math.max(0, Math.min(1, newValue));
  const others = Object.keys(distribution).filter(k => k !== changedKey);
  const sumOthers = others.reduce((s, k) => s + distribution[k], 0);
  const remaining = 1 - safeNew;

  const next = { ...distribution, [changedKey]: safeNew };
  if (sumOthers <= 0.0001) {
    const equal = remaining / others.length;
    others.forEach(k => { next[k] = equal; });
  } else {
    others.forEach(k => {
      next[k] = (distribution[k] / sumOthers) * remaining;
    });
  }

  const total = Object.values(next).reduce((s, v) => s + v, 0);
  if (total > 0) Object.keys(next).forEach(k => { next[k] = next[k] / total; });
  return next;
}

export function makeYearMap(years, fn) {
  const m = {};
  years.forEach(y => { m[y] = fn(y); });
  return m;
}
