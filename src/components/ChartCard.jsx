import { motion } from 'framer-motion';

export default function ChartCard({
  title,
  subtitle,
  badge,
  children,
  variant = 'base',
  footer,
  rightAction,
}) {
  const cls = variant === 'glow' ? 'card-glow' : variant === 'rose' ? 'card-rose' : 'card-base';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className={`${cls} p-7`}
    >
      {badge && <div className="mb-2">{badge}</div>}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-txt-1 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-txt-3 mt-1.5 leading-relaxed">{subtitle}</p>}
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </div>
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-5 pt-5 border-t border-border">{footer}</div>}
    </motion.div>
  );
}
