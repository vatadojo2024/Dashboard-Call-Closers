import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import HeroNumbers from './components/HeroNumbers.jsx';
import ZoneTitle from './components/ZoneTitle.jsx';
import TimelineChart from './components/TimelineChart.jsx';
import ComparisonCards from './components/ComparisonCards.jsx';
import InflationChart from './components/InflationChart.jsx';
import FixedIncomeBRChart from './components/FixedIncomeBRChart.jsx';
import RealEstateChart from './components/RealEstateChart.jsx';
import Magnificent7Chart from './components/Magnificent7Chart.jsx';
import ProjectionChart from './components/ProjectionChart.jsx';
import ScenarioCards from './components/ScenarioCards.jsx';
import VisceralEquivalents from './components/VisceralEquivalents.jsx';
import DojoInvestmentBlock from './components/DojoInvestmentBlock.jsx';
import Footer from './components/Footer.jsx';
import { calculateGap, derivePatrimony, deriveDistribution } from './lib/engine.js';
import { DEFAULT_DISTRIBUTION_VALUES } from './lib/data.js';
import { exportDashboardToPDF } from './lib/pdfExport.js';

const DEFAULT_INPUTS = {
  distributionValues:  { ...DEFAULT_DISTRIBUTION_VALUES },
  monthlyContribution: 20_000,
  horizon:             10,
  premise:             'historica',
  currencyView:        'side-by-side',
  leadAge:             null,
};

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [fixedScenario, setFixedScenario] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [dojoOpen, setDojoOpen] = useState(false);

  const patrimony = useMemo(
    () => derivePatrimony(inputs.distributionValues),
    [inputs.distributionValues]
  );
  const distribution = useMemo(
    () => deriveDistribution(inputs.distributionValues),
    [inputs.distributionValues]
  );

  const gap = useMemo(
    () =>
      calculateGap({
        patrimony,
        distribution,
        monthlyContribution: inputs.monthlyContribution,
        horizon:             inputs.horizon,
        premise:             inputs.premise,
      }),
    [patrimony, distribution, inputs.monthlyContribution, inputs.horizon, inputs.premise]
  );

  const setCurrencyView = (cv) => setInputs((p) => ({ ...p, currencyView: cv }));

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDashboardToPDF('dashboard-root');
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleFixScenario = () => {
    setFixedScenario({
      inputs:      { ...inputs, distributionValues: { ...inputs.distributionValues } },
      gap:         { ...gap },
      patrimony,
      distribution: { ...distribution },
      timestamp:   new Date().toISOString(),
    });
  };

  const handleClearScenario = () => setFixedScenario(null);

  useEffect(() => {
    function onKey(e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === '1') document.getElementById('zone-1')?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === '2') document.getElementById('zone-2')?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === '3') document.getElementById('zone-3')?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === 'r' || e.key === 'R') setInputs(DEFAULT_INPUTS);
      if (e.key === 'd' || e.key === 'D') {
        setDojoOpen((o) => {
          const next = !o;
          if (next) {
            setTimeout(() => {
              document.getElementById('dojo-block')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }
          return next;
        });
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handleExport();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div id="dashboard-root" className="min-h-screen text-txt-1">
      <Header
        currencyView={inputs.currencyView}
        setCurrencyView={setCurrencyView}
        fixedScenario={fixedScenario}
        onFixScenario={handleFixScenario}
        onClearScenario={handleClearScenario}
        exporting={exporting}
        onExportPDF={handleExport}
      />
      <div id="zone-1">
        <ControlPanel
          inputs={inputs}
          setInputs={setInputs}
          patrimony={patrimony}
          distribution={distribution}
        />

        <HeroNumbers
          inputs={inputs}
          gap={gap}
          patrimony={patrimony}
          fixedScenario={fixedScenario}
        />
      </div>

      <main>
        <section id="zone-2" className="zone-compact">
          <ZoneTitle
            num={2}
            label="DIAGNÓSTICO HISTÓRICO"
            title="Custo de inação — o que aconteceu nos últimos 10 anos"
            subtitle="O que aconteceu com o seu dinheiro quando você tira o véu do real e olha em moeda forte."
            quote="Renda fixa brasileira é apenas renda fixa em real. Quando você dolariza, vira uma perda fixa silenciosa."
            accent="rose"
            compact
          />
          <div className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 space-y-4">
            <TimelineChart
              inputs={inputs}
              currencyView={inputs.currencyView}
              patrimony={patrimony}
              distribution={distribution}
            />
            <ComparisonCards />
            <InflationChart />
            <FixedIncomeBRChart />
            <RealEstateChart />
            <Magnificent7Chart />
          </div>
        </section>

        <section id="zone-3">
          <ZoneTitle
            num={3}
            label="PROJEÇÃO FUTURA"
            title="Custo de oportunidade — o que vai acontecer daqui pra frente"
            subtitle="Mantendo a trajetória atual vs. posicionado como operador. Recálculo em tempo real."
            quote="Não é o que aconteceu. É o que vai acontecer."
            accent="emerald"
          />
          <div className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8">
            <ProjectionChart
              inputs={inputs}
              gap={gap}
              currencyView={inputs.currencyView}
              fixedScenario={fixedScenario}
              patrimony={patrimony}
            />
            <ScenarioCards gap={gap} inputs={inputs} patrimony={patrimony} />
            <VisceralEquivalents gap={gap} inputs={inputs} patrimony={patrimony} />
          </div>
        </section>

        <section id="dojo-block">
          <DojoInvestmentBlock
            gap={gap}
            horizon={inputs.horizon}
            isOpen={dojoOpen}
            setIsOpen={setDojoOpen}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
