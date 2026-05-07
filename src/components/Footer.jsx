import { Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24 py-10 bg-base/60">
      <div className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-3">
          <Info className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
          <span className="text-[10px] tracking-[0.22em] uppercase text-amber font-bold">
            Disclaimer
          </span>
        </div>
        <p className="text-[12px] text-txt-3 leading-relaxed max-w-4xl">
          Os dados apresentados são baseados em médias históricas dos últimos 10 anos e em conversões cambiais médias anuais.
          <strong className="text-txt-1"> Rentabilidade passada não é garantia de rentabilidade futura.</strong>{' '}
          As projeções constituem cenários ilustrativos para fins didáticos e não configuram recomendação de investimento, oferta de
          valor mobiliário, promessa de rentabilidade ou aconselhamento financeiro personalizado. Vata Dojo é uma empresa de educação
          financeira e não atua como instituição financeira, corretora de valores ou consultoria de investimentos.
        </p>
        <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-[11px] text-txt-4 font-mono flex-wrap gap-3">
          <span>VATA DOJO · Dashboard de Vendas V1</span>
          <span className="flex items-center gap-2 flex-wrap">
            Atalhos:
            <kbd>1</kbd>
            <kbd>2</kbd>
            <kbd>3</kbd>
            <span className="text-txt-4 mx-1">zonas</span>
            <kbd>F</kbd>
            <span className="text-txt-4 mx-1">fullscreen</span>
            <kbd>R</kbd>
            <span className="text-txt-4 mx-1">reset</span>
            <kbd>D</kbd>
            <span className="text-txt-4 mx-1">Dojo</span>
            <kbd>Ctrl+P</kbd>
            <span className="text-txt-4">PDF</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
