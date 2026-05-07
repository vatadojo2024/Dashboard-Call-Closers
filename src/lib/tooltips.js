/* ============================================================
   V1.6 — Conteúdo dos tooltips pedagógicos.
   Tom Vata: direto, ex-operador, sem academicismo.
   ============================================================ */

export const TT = {
  premise: {
    title: 'Premissa de retorno',
    content:
`Define quão otimista ou conservadora é a projeção. Aplicamos um multiplicador sobre os retornos médios históricos:

• HISTÓRICA (100%): retornos médios reais dos últimos 10 anos. S&P em BRL rendeu 19% a.a. → projetamos 19% a.a.
• CONSERVADORA (70%): assume que os próximos 10 anos serão 30% piores. S&P em BRL: 13,3% a.a.
• PESSIMISTA (50%): metade do retorno histórico. Cenário de stress severo. S&P: 9,5% a.a.

Use HISTÓRICA na apresentação base. CONSERVADORA quando o lead questionar "e se o futuro for diferente?". PESSIMISTA é a demonstração de que mesmo no pior cenário o gap permanece.`,
  },

  rfBR: {
    title: 'Renda Fixa BR',
    content:
`Tudo que rende em real, com baixa volatilidade aparente.

Inclui: CDB pós-fixado, LCI / LCA (isentas de IR), Tesouro Selic, Tesouro IPCA+, CRI / CRA, fundos DI / Renda Fixa, debêntures.

Não inclui: poupança, fundos multimercado.

Como projetamos: carteira ponderada típica de HNWI brasileiro (40% CDI + 25% LCI/LCA + 20% IPCA+ + 15% CRI/CRA), CAGR histórico de 9,3% a.a. em BRL.`,
  },

  rvBR: {
    title: 'Renda Variável BR',
    content:
`Posições em ações brasileiras e ativos correlacionados.

Inclui: ações da B3 (PETR4, VALE3, ITUB4, etc.), fundos de ações, ETFs nacionais (BOVA11), Fundos Imobiliários (FIIs), long & short.

Como projetamos: CAGR do Ibovespa em BRL nos últimos 10 anos = 10,8% a.a. Em USD, esse mesmo Ibov rendeu apenas 5,7% a.a. — abaixo do S&P 500 com volatilidade muito maior.`,
  },

  imoveis: {
    title: 'Imóveis BR',
    content:
`Patrimônio físico em pedra dentro do Brasil.

Inclui: apartamentos e casas (próprios ou para renda), salas comerciais, galpões logísticos, terrenos.

Como projetamos: CAGR do Índice FipeZap Residencial nos últimos 10 anos = 3,8% a.a. em BRL.

A virada: em USD (descontando câmbio), esse mesmo imóvel teve CAGR NEGATIVO de ~-0,7% a.a. O lead que comprou imóvel "para preservar patrimônio" perdeu poder de compra global em 10 anos.`,
  },

  dolarizado: {
    title: 'Dolarizado / Exterior',
    content:
`Posições em dólar ou em ativos internacionais.

Inclui: conta em corretora americana (Interactive Brokers), ações americanas (AAPL, MSFT, NVDA), ETFs internacionais (IVV, QQQ, VOO), BDRs no Brasil, fundos cambiais, Treasuries, imóveis fora do Brasil.

Como projetamos: S&P 500 em BRL como proxy, CAGR de 19% a.a. nos últimos 10 anos (combinando o retorno do índice em USD com a desvalorização do real). É a régua institucional.`,
  },

  outros: {
    title: 'Outros',
    content:
`Categoria coringa para ativos que não se encaixam nas demais.

Inclui: cripto (Bitcoin, Ether), ouro físico ou ETFs de ouro, empresas próprias / participações, empréstimos a juros, coleções (arte, vinho, carros antigos).

Como projetamos: retorno conservador de 6% a.a. — abaixo da renda fixa BR. Razão: categoria tão heterogênea que assumir mais seria especular. Se o lead tem alocação grande aqui, vale investigar caso a caso.`,
  },

  age: {
    title: 'Idade do lead (opcional)',
    content:
`Quando preenchida, a dashboard personaliza:

• O eixo X do gráfico de projeção mostra a idade do lead em cada ponto (ao invés de "ano 5", mostra "55 anos").
• O HeroNumbers ganha linha extra: "EM 10 ANOS · QUANDO VOCÊ TIVER 55 ANOS".
• Marcadores especiais aparecem se o lead cruzar idades importantes (60, 65, 70 anos) dentro do horizonte.

Em branco, a dashboard funciona normalmente sem personalização etária.`,
  },

  monthlyContribution: {
    title: 'Aporte mensal',
    content:
`Quanto o lead consegue investir todo mês a partir de hoje.

Como entra no cálculo:
• Capitalização mensal com juros compostos.
• Cada aporte rende a partir do mês em que é feito.
• Fórmula: A · ((1 + r/12)^m − 1) / (r/12)

Importante: assumimos aporte constante em valor nominal — não corrigimos pela inflação. É conservador: na prática, o lead provavelmente aumentaria conforme a renda crescer.`,
  },

  gap: {
    title: 'O que é esse gap',
    content:
`É a diferença entre dois cenários para o mesmo lead:

CENÁRIO ATUAL (parado): sua distribuição de patrimônio + aportes mensais, projetados pelos retornos médios históricos de cada classe ao longo do horizonte.

CENÁRIO INSTITUCIONAL: o mesmo patrimônio + os mesmos aportes, alocados conforme a carteira institucional padrão (40% S&P + 30% NASDAQ + 20% RF dolarizada + 10% cash). CAGR histórico em BRL: 16,5% a.a.

GAP = Institucional − Atual.

Não é "o que você está perdendo agora". É "o que você vai deixar de ter no futuro se mantiver o mesmo posicionamento". Custo de oportunidade.

A decomposição em valor por mês/dia/hora é literalmente a diferença dividida pelo período. Cada hora sem decisão, esse valor sai do patrimônio futuro.`,
  },

  cagr: {
    title: 'CAGR (Compound Annual Growth Rate)',
    content:
`Taxa de crescimento anual composta.

Diferente da média aritmética dos retornos anuais, o CAGR representa o retorno único anual que, capitalizado, leva do valor inicial ao final em N anos.

Exemplo: ativo rende +50% no ano 1 e -33% no ano 2.
• Média aritmética: (+50% −33%) / 2 = +8,5% a.a. (FALSO)
• CAGR real: 0% (volta ao mesmo valor)

CAGR é a métrica correta para comparar performance entre ativos.`,
  },

  volUSD: {
    title: 'Volatilidade em USD',
    content:
`Desvio-padrão dos retornos anuais quando dolarizados.

Mede o quanto o ativo oscila em moeda forte. Quanto maior, mais imprevisível em poder de compra global.

A surpresa: a "renda fixa brasileira" tem volatilidade em USD de ~17% a.a. — comparável à volatilidade do S&P 500. Em real parece estável; em dólar oscila como ações.

Por isso a renda fixa BR aparece com warning de volatilidade alta: quando você sai do real, ela deixa de ser "renda fixa".`,
  },

  vata: {
    title: 'Índice Vata de inflação real',
    content:
`Cesta ponderada de gastos reais que o HNWI brasileiro paga.

Composição:
• Educação particular        25%
• Saúde e cuidados           20%
• Alimentação fora do lar    20%
• Habitação (cond, IPTU)     15%
• Combustíveis e transporte  10%
• Lazer e cultura            10%

Cada categoria usa a variação real do IPCA-grupo correspondente do IBGE — não é número inventado.

Acumulado 10y: ~82% (vs ~64,7% do IPCA oficial)
CAGR: ~6,2% a.a. (vs ~5,1% do IPCA oficial)

Diferença: o HNWI sente cerca de 17 pontos percentuais a MAIS de inflação em 10 anos do que o índice oficial mostra. Sua renda fixa está vencendo o IPCA oficial e perdendo para a inflação real do seu bolso.`,
  },

  rfBRrealBRL: {
    title: 'Rentabilidade real em BRL',
    content:
`Quanto sua renda fixa BR cresceu além da inflação que você paga.

Fórmula: (1 + nominal) / (1 + inflação) − 1

• Nominal acumulado 10y: +147%
• Descontando Vata (cesta real do HNWI): +35%
• Descontando IPCA oficial: +49%

Por que usamos Vata e não IPCA: o IPCA oficial mistura cesta de toda a população (1 a 40 salários mínimos). Educação particular e alimentação fora pesam mais para o HNWI. O Índice Vata reflete a inflação que o seu lead efetivamente sente.`,
  },

  rfBRusd: {
    title: 'Rentabilidade em dólar',
    content:
`Como sua renda fixa BR se comporta quando convertida ano-a-ano para USD.

Fórmula por ano:
Rent_USD(t) = (1 + Rent_BRL(t)) × USD_inicio(t) / USD_fim(t) − 1

Exemplo 2020:
• CDI rendeu +6,1%
• USD/BRL foi de 4,02 → 5,20
• Rent USD: (1.061) × (4.02/5.20) − 1 = -18,0%

Em 2020, quem estava em renda fixa BR PERDEU 18% em USD, mesmo "rendendo" 6,1% em real. Não é exceção — é regra cíclica.

CAGR 10y em USD: ~5,9% a.a. com volatilidade de 17% a.a.`,
  },

  projection: {
    title: 'Como projetamos o futuro',
    content:
`Juros compostos com aporte mensal:

valor(t) = P · (1 + r/12)^(12t) + A · ((1 + r/12)^(12t) − 1) / (r/12)

Onde:
• P = patrimônio inicial
• A = aporte mensal
• r = retorno anual ponderado (do lead ou da carteira institucional)
• t = anos a projetar

Capitalização mensal porque os aportes são mensais. Retornos anuais são divididos por 12 para virar taxa mensal equivalente.

Premissas:
• Aportes constantes em valor nominal (sem correção pela inflação).
• Retornos médios da janela 2016-2025 aplicados linearmente.
• Sem rebalanceamento intermediário.
• Sem custos de IR / corretagem / spread (dashboard didática).

Para projeções com ressalvas, alterar a Premissa de Retorno para Conservadora ou Pessimista.`,
  },

  institutional: {
    title: 'Carteira institucional padrão',
    content:
`A composição que serve de referência para o cenário "posicionado como operador":

• 40% S&P 500            → ações americanas large cap diversificadas
• 30% NASDAQ 100         → tecnologia e crescimento
• 20% Renda fixa USD     → Treasuries / bonds americanos
• 10% Cash / proteção    → dólar líquido para oportunidades

CAGR histórico ponderado em BRL: 16,5% a.a.

Por que essa alocação:
• 70% em equities americanas — onde o capital institucional global está posicionado.
• Renda fixa em moeda forte para proteção (não em real).
• Cash dolarizado para flexibilidade tática.
• Zero exposição a Brasil — não é dogma, é matemática: nos últimos 10 anos, em USD, o Brasil destruiu valor.

Não é recomendação de investimento. É o benchmark de comparação que materializa o gap.`,
  },

  visceralGeneral: {
    title: 'Como traduzimos o gap em coisas reais',
    content:
`Pegamos o gap em R$ e dividimos por valores médios concretos:

• Apartamento em capital: R$ 800.000
• Mensalidade premium: R$ 50.000/ano
• Viagem internacional executiva: R$ 30.000
• Carro premium: R$ 350.000
• Semestre Wharton/Stanford/Harvard: R$ 350.000 (~US$ 60k × câmbio)
• Custo de vida HNWI anual: R$ 600.000 (R$ 50k/mês)

Os equivalentes se ajustam ao tamanho do gap:
• Pequeno (<R$ 5M): foca em itens concretos (mensalidades, viagens).
• Grande (>R$ 5M): foca em itens estruturais (renda passiva, aposentadoria).

Não é exato — é calibrado para que o lead sinta a magnitude. "R$ 20 milhões" é abstrato; "25 apartamentos" não é.`,
  },

  passiveIncome: {
    title: 'Renda passiva — regra dos 4%',
    content:
`Quanto o lead poderia retirar todo mês, vitaliciamente, sem zerar o patrimônio.

Fórmula: gap × 4% / 12 (taxa de retirada anual segura).

A "regra dos 4%" vem do Trinity Study (1998), que analisou 50 anos de dados americanos. Conclusão: uma carteira diversificada suporta retirada de 4% ao ano corrigida pela inflação por 30+ anos sem se esgotar em ~95% dos cenários históricos.

Aplicada ao gap, mostra a "mesada vitalícia" que o lead está deixando de ter ao não posicionar. Não é número único distante — é renda mensal que ele nunca vai receber.`,
  },
};
