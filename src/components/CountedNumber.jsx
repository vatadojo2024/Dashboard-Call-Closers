import CountUp from 'react-countup';

/**
 * Wrapper sobre react-countup com defaults consistentes.
 * - Usa pt-BR (separador de milhar = ".", decimal = ",")
 * - preserveValue=true para evitar re-animação ao recalcular
 * - duration default: 2.5s para heroes, 1.5s para subnumbers
 */
export default function CountedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2.5,
  className = '',
}) {
  return (
    <span className={className}>
      <CountUp
        start={0}
        end={value || 0}
        duration={duration}
        separator="."
        decimal=","
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        preserveValue
      />
    </span>
  );
}
