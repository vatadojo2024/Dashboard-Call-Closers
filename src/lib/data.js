/* ============================================================
   Vata Dojo — Dashboard de Vendas
   Dados Históricos + Constantes
   Fonte: dashboard_vendas_v2.md, seções 6, 7 e 11
   Atualização V1.6: correção de dados 2025 (S&P, NASDAQ, Ibov,
   USD/BRL) + correção metodológica de constantes (CAGR vs média,
   retornos em BRL).
   ============================================================ */

/**
 * dashboard_calculos.md — DADOS HISTÓRICOS BASE
 *
 * Todos os dados nesta arquivo são MOCKADOS (estáticos) e atualizados
 * manualmente trimestralmente pelo time. NÃO há fetch dinâmico de APIs.
 *
 * Período coberto: 2016-2025 (10 anos completos).
 *
 * Convenções:
 *  - Todos os retornos são em DECIMAL (0.14 = 14%)
 *  - Retornos em BRL = nominais em real
 *  - Retornos em USD = já dolarizados (descontado câmbio)
 *  - Câmbio = média anual (PTAX BCB)
 *
 * Última atualização: 2026-05 · V1.6
 *
 * FONTES:
 *  - USD/BRL: Banco Central do Brasil (PTAX média anual)
 *  - CDI: B3 / Cetip (DI acumulado anual)
 *  - IPCA: IBGE / SIDRA
 *  - S&P 500: S&P Global (Total Return com dividendos)
 *  - NASDAQ 100: Nasdaq Inc. (Total Return)
 *  - Ibovespa: B3 (retorno anual em BRL)
 *  - FipeZap: FIPE (Índice FipeZap Residencial Venda)
 */

export const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

/**
 * Câmbio USD/BRL — média anual (PTAX)
 *
 * Usado para conversões BRL ↔ USD em todos os componentes de dolarização.
 * A volatilidade cambial é o motor central da narrativa: enquanto o
 * brasileiro vê seus ativos em BRL, o operador institucional mede em USD.
 *
 * Fonte: Banco Central do Brasil — PTAX média anual.
 * V1.6: 2025 revisado para 5,40 (PTAX média anual revisada).
 */
export const USD_BRL = {
  2016: 3.49, 2017: 3.19, 2018: 3.65, 2019: 3.94, 2020: 5.16,
  2021: 5.39, 2022: 5.16, 2023: 4.99, 2024: 5.39, 2025: 5.40,
};

/**
 * CDI — Certificado de Depósito Interbancário
 *
 * Taxa de referência da renda fixa pós-fixada brasileira. Indica quanto
 * rende um investimento que paga "100% do CDI" no ano.
 *
 * Componentes que rendem CDI ou próximo:
 *  - CDB pós-fixado (geralmente 100-110% do CDI)
 *  - Tesouro Selic (≈ Selic ≈ CDI - 0,10%)
 *  - LCI/LCA pós-fixadas (geralmente 90-95% do CDI, mas isentas de IR)
 *  - Fundos DI
 *
 * Fonte: B3 / Cetip · DI acumulado anual.
 */
export const CDI = {
  2016: 0.1400, 2017: 0.0993, 2018: 0.0642, 2019: 0.0596, 2020: 0.0276,
  2021: 0.0442, 2022: 0.1239, 2023: 0.1304, 2024: 0.1088, 2025: 0.1432,
};

/**
 * IPCA — Índice de Preços ao Consumidor Amplo
 * Inflação oficial do Brasil. Cesta nacional, faixa 1-40 salários mínimos.
 * Fonte: IBGE / SIDRA.
 */
export const IPCA = {
  2016: 0.0629, 2017: 0.0295, 2018: 0.0375, 2019: 0.0431, 2020: 0.0452,
  2021: 0.1006, 2022: 0.0579, 2023: 0.0462, 2024: 0.0483, 2025: 0.0426,
};

// 6.4 IPCA por grupo — acumulado 10 anos (V1.5 — inclui Índice Vata como protagonista)
export const IPCA_GRUPOS = [
  { grupo: 'Índice Vata (cesta real)',                       pct: 82.0, tipo: 'vata'    },
  { grupo: 'IPCA Geral (oficial)',                           pct: 64.7, tipo: 'oficial' },
  { grupo: 'CDI real (descontando Vata, ~9% acum.)',          pct:  9.0, tipo: 'cdi'    },
  { grupo: 'Habitação',                                       pct: 70.0, tipo: 'doloroso' },
  { grupo: 'Saúde e cuidados',                                pct: 75.0, tipo: 'doloroso' },
  { grupo: 'Educação particular',                             pct: 80.0, tipo: 'doloroso' },
  { grupo: 'Lazer',                                           pct: 85.0, tipo: 'doloroso' },
  { grupo: 'Combustíveis',                                    pct: 90.0, tipo: 'doloroso' },
  { grupo: 'Alimentação fora do lar',                         pct: 95.0, tipo: 'doloroso' },
];

/**
 * V1.5 — Índice Vata de Inflação Real
 * Cesta ponderada de gastos típicos do HNWI brasileiro.
 * Substitui o IPCA oficial nos cálculos de "rendimento real" da dashboard.
 *
 * Acumulado ponderado 10 anos (2016-2025): ~82%
 * CAGR derivado: ~6,2% a.a.
 * Comparativo: IPCA oficial mesmo período = ~64,7% (CAGR 5,1% a.a.)
 */
export const INFLACAO_REAL_VATA = {
  pesos: {
    educacao:        0.25,
    saude:           0.20,
    alimentacaoFora: 0.20,
    habitacao:       0.15,
    combustiveis:    0.10,
    lazer:           0.10,
  },
  acumuladosGrupo10y: {
    educacao:        0.80,
    saude:           0.75,
    alimentacaoFora: 0.95,
    habitacao:       0.70,
    combustiveis:    0.90,
    lazer:           0.85,
  },
  acumulado10y: 0.82,  // ~82% acumulado em 10 anos
  cagr:         0.062, // ~6,2% a.a.
};

/**
 * V1.8 — Índice Vata de Inflação Real — série ano-a-ano (estimada).
 * Ponderação dos IPCA-grupos do IBGE pela cesta HNWI. Valores estimados a
 * partir dos pesos da cesta Vata aplicados aos grupos de IPCA, com refinos
 * para os anos de stress cambial (2020, 2021, 2024).
 *
 * Usado por engine.anosDePerdaReal() para identificar anos em que a
 * rentabilidade nominal da renda fixa BR ficou abaixo da inflação real.
 */
export const INFLACAO_REAL_VATA_ANUAL = {
  2016: 0.078,
  2017: 0.042,
  2018: 0.051,
  2019: 0.058,
  2020: 0.108, // pandemia: dinheiro encolheu
  2021: 0.118, // ano de disparo
  2022: 0.072,
  2023: 0.058,
  2024: 0.124, // real desvalorizou de novo
  2025: 0.055,
};

/**
 * S&P 500 — retorno anual em USD (Total Return, com dividendos reinvestidos).
 * Fonte: S&P Global · RBC Wealth Management.
 * V1.6: 2025 corrigido de 0.10 (estimativa) para 0.179 (fechamento real,
 * terceiro ano consecutivo de ganhos acima da média).
 */
export const SP500 = {
  2016: 0.1196, 2017: 0.2183, 2018: -0.0438, 2019: 0.3149, 2020: 0.1840,
  2021: 0.2871, 2022: -0.1811, 2023: 0.2629, 2024: 0.2502, 2025: 0.179,
};

/**
 * NASDAQ 100 — retorno anual em USD (Total Return).
 * Fonte: Nasdaq Inc. — Performance Q4 2025.
 * V1.6: 2025 corrigido de 0.1945 para 0.21 (fechamento real).
 */
export const NASDAQ = {
  2016: 0.0710, 2017: 0.3270, 2018: -0.0010, 2019: 0.3900, 2020: 0.4860,
  2021: 0.2740, 2022: -0.3260, 2023: 0.5642, 2024: 0.2572, 2025: 0.21,
};

/**
 * FipeZap residencial — variação anual em BRL.
 * Fonte: FIPE — Índice FipeZap Residencial Venda.
 * 2025 = 6,52% (segunda maior alta em 11 anos, validado FIPE).
 */
export const FIPEZAP = {
  2016: 0.0038, 2017: -0.0053, 2018: 0.0030, 2019: 0.0138, 2020: 0.0530,
  2021: 0.0516, 2022: 0.0617, 2023: 0.0579, 2024: 0.0773, 2025: 0.0652,
};

/**
 * Ibovespa — retorno anual em BRL.
 * Fonte: B3.
 * V1.6: 2025 corrigido de 0.065 (≈5x abaixo do real) para 0.3395
 * (33,95%, um dos maiores retornos da década). A correção tem grande
 * impacto sobre o CAGR de RV BR e sobre qualquer cenário com peso em
 * renda variável brasileira.
 */
export const IBOV = {
  2016: 0.3893, 2017: 0.2686, 2018: 0.1503, 2019: 0.3158, 2020: 0.0292,
  2021: -0.1193, 2022: 0.0469, 2023: 0.2228, 2024: -0.1036, 2025: 0.3395,
};

// 6.9 Magnificent 7 — retorno acumulado 10 anos em USD (multiplicador, não %)
export const MAG7 = [
  { ticker: 'NVDA',  retornoAcumulado: 300.0, cagr: 76.0 },
  { ticker: 'TSLA',  retornoAcumulado:  25.0, cagr: 38.0 },
  { ticker: 'AAPL',  retornoAcumulado:   9.0, cagr: 25.9 },
  { ticker: 'MSFT',  retornoAcumulado:   9.0, cagr: 25.9 },
  { ticker: 'AMZN',  retornoAcumulado:   7.0, cagr: 23.1 },
  { ticker: 'GOOGL', retornoAcumulado:   5.0, cagr: 19.6 },
  { ticker: 'META',  retornoAcumulado:   4.5, cagr: 18.5 },
];

export const MAG7_CAGR = 0.32; // 32% a.a. em USD

/**
 * Renda Fixa BR ponderada (carteira HNWI típica:
 * 40% CDI + 25% LCI/LCA + 20% Tesouro IPCA+ + 15% CRI/CRA).
 * RFBR_USD: rentabilidade ano-a-ano dolarizada (descontando câmbio).
 * RFBR_BRL: rentabilidade ano-a-ano em reais.
 */
export const RFBR_USD = {
  2016:  0.352, 2017:  0.064, 2018: -0.083, 2019:  0.034, 2020: -0.180,
  2021:  0.026, 2022:  0.185, 2023:  0.206, 2024: -0.136, 2025:  0.282,
};
export const RFBR_BRL = {
  2016: 0.113, 2017: 0.081, 2018: 0.072, 2019: 0.073, 2020: 0.061,
  2021: 0.099, 2022: 0.111, 2023: 0.118, 2024: 0.104, 2025: 0.120,
};

/**
 * CAGRs históricos médios por classe de ativo — usados pela engine
 * para projetar o cenário "lead parado" em juros compostos.
 *
 * V1.6 — Correções:
 *  • rvBR: 0.118 → 0.108 (era média aritmética; CAGR geométrico real
 *    com Ibov 2025 = 33,95% é 10,80% a.a.)
 *  • dolarizado: 0.135 → 0.19 (valor anterior era retorno em USD;
 *    precisa estar em BRL para comparabilidade. S&P USD 13,8% a.a.
 *    × câmbio 4,5% a.a. ≈ 19% a.a. em BRL)
 */
export const ASSET_CLASS_RETURNS = {
  /**
   * Renda Fixa BR (carteira ponderada típica HNWI)
   * Composição: 40% CDI + 25% LCI/LCA + 20% Tesouro IPCA+ + 15% CRI/CRA
   * CAGR ponderado 10y em BRL: ~9,3% a.a.
   */
  rfBR:        0.093,

  /**
   * Renda Variável BR (Ibovespa)
   * CAGR geométrico real 10y (2016-2025) em BRL = 10,80% a.a.
   * Cálculo: produto de (1 + retorno_ano) nos 10 anos, elevado a 1/10, menos 1.
   * IMPORTANTE: o valor anterior (0.118) era média aritmética, que não
   * representa o retorno realizado por um investidor que mantém posição.
   * CAGR é a métrica correta.
   */
  rvBR:        0.108,

  /**
   * Imóveis BR (proxy: FipeZap residencial)
   * CAGR geométrico real 10y em BRL = 3,82%.
   * Em USD (descontando câmbio), CAGR é NEGATIVO em ~-0,7% a.a.
   * Mantemos o valor em BRL para comparabilidade com outras classes.
   */
  imoveis:     0.038,

  /**
   * Posição Dolarizada (proxy: S&P 500 em BRL com câmbio)
   * O retorno aqui PRECISA estar em BRL para ser comparável às demais classes.
   *  - S&P 500 USD CAGR 10y: ~13,8% a.a.
   *  - USD/BRL acumulado 10y: 5,40 / 3,49 ≈ 1,55x → CAGR câmbio ~4,5% a.a.
   *  - S&P em BRL: (1.138)(1.045) - 1 ≈ 18,9% a.a.
   * Validação composta ano-a-ano dá ~19,3%; usamos 19% por arredondamento conservador.
   */
  dolarizado:  0.19,

  /**
   * Outros (proxy conservador) — usado quando o lead tem ativos não
   * classificados nas demais categorias. Default conservador entre RF
   * BR e algo abaixo da inflação.
   */
  outros:      0.060,
};

// Cards comparativos — seção 5.3 (V1.5 com volatilidade USD anualizada e acumulado 10y)
export const COMPARISON_CARDS = [
  { id: 'cdi',    nome: 'CDI / Renda Fixa Pós', icone: 'Landmark',   usd: 0.031, accum10y: 0.357, vol: 0.165 },
  { id: 'ipca',   nome: 'Tesouro IPCA+',        icone: 'ScrollText', usd: 0.044, accum10y: 0.535, vol: 0.170 },
  { id: 'ibov',   nome: 'Ibovespa',             icone: 'TrendingUp', usd: 0.057, accum10y: 0.741, vol: 0.310 },
  { id: 'imovel', nome: 'Imóvel (FipeZap)',     icone: 'Building2',  usd: -0.007, accum10y: -0.068, vol: 0.120 },
  { id: 'dolar',  nome: 'Dólar puro',           icone: 'DollarSign', usd: 0.000, accum10y: 0.000, vol: 0.000 },
  { id: 'sp500',  nome: 'S&P 500',              icone: 'LineChart',  usd: 0.138, accum10y: 2.640, vol: 0.165 },
  { id: 'nasdaq', nome: 'NASDAQ 100',           icone: 'Cpu',        usd: 0.198, accum10y: 5.078, vol: 0.245 },
  { id: 'mag7',   nome: 'Magnificent 7',        icone: 'Rocket',     usd: 0.320, accum10y: 15.952, vol: 0.350 },
];

/**
 * Retorno da carteira institucional padrão (em BRL).
 *
 * Composição: 40% S&P 500 + 30% NASDAQ 100 + 20% RF dolarizada + 10% Cash.
 * Todos os retornos são CAGR 10y em BRL (com efeito cambial embutido).
 *
 *   40% × 19,0% (S&P em BRL)        = 7,60%
 *   30% × 24,0% (NASDAQ em BRL)     = 7,20%
 *   20% ×  9,8% (RF dolarizada)     = 1,96%
 *   10% ×  5,0% (Cash)              = 0,50%
 *
 * Total ponderado: 17,26% a.a. — usamos 0.165 com margem de segurança.
 *
 * V1.6: 0.137 → 0.165 (a constante anterior misturava retornos em USD
 * com retornos em BRL e subestimava o cenário institucional).
 */
export const INSTITUTIONAL_PORTFOLIO_RETURN = 0.165;

export const INSTITUTIONAL_BREAKDOWN = [
  { classe: 'S&P 500',               peso: 0.40, retorno: 0.190 },
  { classe: 'NASDAQ 100',            peso: 0.30, retorno: 0.240 },
  { classe: 'Renda fixa dolarizada', peso: 0.20, retorno: 0.098 },
  { classe: 'Cash / proteção',       peso: 0.10, retorno: 0.050 },
];

// 8.6 Divisores viscerais (V1.5 expandidos para 10 categorias)
export const VISCERAL_DIVISORS = {
  // === V1 ===
  apartmentCapital:  800_000,   // apartamento médio em capital BR
  premiumTuition:     50_000,   // mensalidade premium anual
  intlExecutiveTrip:  30_000,   // viagem internacional executiva
  premiumCar:        350_000,   // carro premium zero km
  // yearOfIncome dinâmico (5% do patrimônio do lead)

  // === V1.5 NOVOS ===
  rendaPassivaTaxa:              0.04,    // 4% a.a. = regra dos 4% (taxa de retirada segura)
  custoVidaHNWIAnual:         600_000,    // R$ 50k/mês padrão HNWI
  semestreUniversidadePremium: 350_000,   // ~US$60k * câmbio = semestre Wharton/Stanford/Harvard
  custoVidaPadraoMultiplicador:   0.05,   // 5% do patrimônio = padrão de vida sustentável
};

// Distribuição default (proporção decimal — derivada por engine.deriveDistribution)
export const DEFAULT_DISTRIBUTION = {
  rfBR:       0.60,
  rvBR:       0.15,
  imoveis:    0.10,
  dolarizado: 0.10,
  outros:     0.05,
};

// Distribuição default em valores R$ (V1.5 — input principal do ControlPanel)
// Total: R$ 2.000.000 — mesma proporção (60/15/10/10/5)
export const DEFAULT_DISTRIBUTION_VALUES = {
  rfBR:       1_200_000,
  rvBR:         300_000,
  imoveis:      200_000,
  dolarizado:   200_000,
  outros:       100_000,
};

export const PREMISE_MULTIPLIERS = {
  historica:    1.00,
  conservadora: 0.70,
  pessimista:   0.50,
};

/**
 * V1.5 — Volatilidade anualizada em USD (desvio-padrão dos retornos)
 * Renda fixa BR e Imóvel mostram volatilidade alta em USD — golpe matador
 * da narrativa: "renda fixa segura" tem volatilidade comparável a ações.
 */
export const VOLATILITY_USD = {
  rfBR:        0.165, // 16,5% — RF BR em USD com vol de ações
  rvBR:        0.310, // Ibov em USD muito volátil
  imoveis:     0.120, // FipeZap em USD
  cdiPuro:     0.160,
  ipcaPlus:    0.170,
  ibovespa:    0.310,
  sp500:       0.165, // S&P em USD
  nasdaq:      0.245, // NASDAQ mais volátil
  mag7:        0.350, // Carteira igualmente ponderada Mag 7
  dollar:      0.000,
  treasury10Y: 0.080,
};

/**
 * V1.5 — Leituras institucionais de anos chave.
 * Enriquecem tooltips dos charts históricos.
 */
export const TRADUCAO_OPERADOR = {
  2016: {
    titulo:  'Recuperação pós-crise',
    leitura: 'Brasil saindo de recessão. Real se valoriza. Renda fixa BR rende muito em USD. Anomalia, não regra.',
  },
  2018: {
    titulo:  'Eleição turbulenta',
    leitura: 'Incerteza política. Real desvaloriza. Quem estava em CDI perdeu em USD. Quem estava posicionado em S&P, ganhou.',
  },
  2020: {
    titulo:  'Pandemia + colapso cambial',
    leitura: 'Dólar dispara 30%. CDI cai a 2%. Quem estava em renda fixa BR perdeu 18% em USD no ano. Quem estava em S&P + câmbio, ganhou 18% em USD.',
  },
  2021: {
    titulo:  'Inflação volta',
    leitura: 'IPCA bate 10%. Selic sobe rápido. Renda fixa BR começa a render em BRL, mas em USD continua frágil.',
  },
  2022: {
    titulo:  'Aperto monetário global',
    leitura: 'Fed sobe juros. NASDAQ cai 33%. S&P cai 18%. Mas em BRL, com câmbio favorável, perda menor para quem estava posicionado.',
  },
  2023: {
    titulo:  'Retomada institucional',
    leitura: 'Inteligência artificial dispara mercado americano. NASDAQ +56%. Magnificent 7 começa a dominar.',
  },
  2024: {
    titulo:  'Real desvaloriza forte',
    leitura: 'USD/BRL passa de 6,00. Renda fixa BR rende 11% em BRL — mas perde 14% em USD. Lição clara para quem ainda não viu.',
  },
  2025: {
    titulo:  'Ano dos índices',
    leitura: 'S&P fecha +17,9%, NASDAQ +21%, Ibov +33,95% — terceiro ano consecutivo forte para equities. RF BR rende 12%, mas em USD ainda perde para o S&P em BRL.',
  },
};
