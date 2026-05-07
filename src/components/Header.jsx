import { motion } from 'framer-motion';
import { Activity, BarChart3, Pin, X, Download, Loader2 } from 'lucide-react';

export default function Header({
  currencyView, setCurrencyView,
  fixedScenario, onFixScenario, onClearScenario,
  exporting, onExportPDF,
}) {
  const opts = [
    { id: 'BRL',          label: 'BRL'         },
    { id: 'USD',          label: 'USD'         },
    { id: 'side-by-side', label: 'Lado a Lado' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-base/80 border-b border-border">
      <div className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-glow">
              <span className="text-base font-extrabold" style={{ color: '#0B0F1A' }}>V</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald ring-2 ring-base animate-pulse" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm tracking-[0.32em] text-txt-1 font-bold">VATA DOJO</span>
              <span className="badge bg-emerald/15 text-emerald border border-emerald/30">
                <Activity className="w-3 h-3" /> Ao vivo
              </span>
            </div>
            <div className="text-[11px] text-txt-3 mt-0.5 flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" />
              Dashboard de Vendas · Call 2 · Prognóstico
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Botão fixar / limpar cenário */}
          {fixedScenario ? (
            <button
              onClick={onClearScenario}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-violet bg-violet/10 text-violet hover:bg-violet/20 transition-all"
            >
              <Pin className="w-3.5 h-3.5" />
              Cenário fixado
              <X className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>
          ) : (
            <button
              onClick={onFixScenario}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-border text-txt-2 hover:border-violet/60 hover:text-violet transition-all"
            >
              <Pin className="w-3.5 h-3.5" />
              Fixar cenário
            </button>
          )}

          {/* Botão exportar PDF */}
          <button
            onClick={onExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-border text-txt-2 hover:border-cyan/60 hover:text-cyan transition-all disabled:opacity-60 disabled:cursor-wait"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {exporting ? 'Gerando...' : 'PDF'}
          </button>

          {/* Toggle moeda */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-input border border-border">
            {opts.map((o) => (
              <button
                key={o.id}
                onClick={() => setCurrencyView(o.id)}
                className={
                  'relative px-5 py-2 text-xs rounded-full font-semibold transition-all ' +
                  (currencyView === o.id ? 'text-base' : 'text-txt-3 hover:text-txt-1')
                }
                style={currencyView === o.id ? { color: '#0B0F1A' } : {}}
              >
                {currencyView === o.id && (
                  <motion.div
                    layoutId="currencyTab"
                    className="absolute inset-0 bg-gradient-to-r from-emerald to-emerald-2 rounded-full shadow-glow"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
