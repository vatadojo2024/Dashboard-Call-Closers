import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Building2, Briefcase, GraduationCap, Plane, Car, Heart,
  Banknote, Sunset, School, Coins, Sailboat,
} from 'lucide-react';
import { visceralEquivalents, formatNumber } from '../lib/engine.js';

const ICON_MAP = {
  Building2, Briefcase, GraduationCap, Plane, Car,
  Banknote, Sunset, School, Coins, Sailboat,
};

function ItemCard({ item, index }) {
  const Icon = ICON_MAP[item.icon] ?? Building2;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-5 p-5 rounded-2xl bg-input border border-border hover:border-border-strong transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose/10 border border-rose/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-rose" />
      </div>
      <div className="flex-1 min-w-0">
        {item.isCurrency ? (
          <div className="font-mono text-3xl font-extrabold text-txt-1 tabular-nums leading-none">
            <CountUp
              start={0}
              end={item.value}
              duration={1.8}
              separator="."
              decimals={0}
              prefix="R$ "
              preserveValue
            />
          </div>
        ) : (
          <div className="font-mono text-4xl font-extrabold text-txt-1 tabular-nums leading-none">
            <CountUp
              start={0}
              end={item.value}
              duration={1.8}
              separator="."
              preserveValue
            />
          </div>
        )}
        <div className="text-[14px] text-txt-3 mt-1.5 leading-snug">{item.label}</div>
      </div>
    </motion.div>
  );
}

export default function VisceralEquivalents({ gap, patrimony }) {
  const items = useMemo(
    () => visceralEquivalents(gap.gapAbsolute, patrimony),
    [gap.gapAbsolute, patrimony]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-base p-8 mt-6 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 90% 20%, rgba(248,113,113,0.08), transparent 50%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-rose" />
          <span className="text-[11px] tracking-[0.22em] uppercase text-rose font-bold">
            Tradução visceral
          </span>
        </div>
        <h3 className="text-2xl font-bold text-txt-1 mt-2 mb-6">
          Essa diferença representa, em termos reais
        </h3>

        {items.length === 0 ? (
          <div className="text-txt-3 italic">
            Ajuste os inputs no painel para visualizar equivalentes do gap.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((it, i) => <ItemCard key={it.id} item={it} index={i} />)}
          </div>
        )}

        <div className="mt-6 text-[13px] text-txt-3 italic leading-relaxed max-w-2xl">
          "Não é número abstrato. É a diferença entre sua filha estudar fora e estudar aqui. Entre você se aposentar aos 50 ou aos 65."
        </div>
      </div>
    </motion.div>
  );
}
