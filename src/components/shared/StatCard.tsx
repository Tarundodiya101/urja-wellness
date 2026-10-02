import React, { useEffect, useRef, useState } from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const colorMap = {
  green:  {
    bg:     'from-green-400 to-emerald-500',
    shadow: 'shadow-green-200',
    ring:   'ring-green-100',
    text:   'text-green-600',
    light:  'bg-green-50',
  },
  blue:   {
    bg:     'from-blue-400 to-indigo-500',
    shadow: 'shadow-blue-200',
    ring:   'ring-blue-100',
    text:   'text-blue-600',
    light:  'bg-blue-50',
  },
  orange: {
    bg:     'from-orange-400 to-amber-500',
    shadow: 'shadow-orange-200',
    ring:   'ring-orange-100',
    text:   'text-orange-600',
    light:  'bg-orange-50',
  },
  red:    {
    bg:     'from-red-400 to-rose-500',
    shadow: 'shadow-red-200',
    ring:   'ring-red-100',
    text:   'text-red-600',
    light:  'bg-red-50',
  },
  purple: {
    bg:     'from-purple-400 to-violet-500',
    shadow: 'shadow-purple-200',
    ring:   'ring-purple-100',
    text:   'text-purple-600',
    light:  'bg-purple-50',
  },
};

/* Animate number from 0 → target */
function useCountUp(target, duration = 1000) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const parsed = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    if (isNaN(parsed)) { setDisplay(target); return; }

    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.floor(eased * parsed));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}

/**
 * StatCard
 * @param {string}  title
 * @param {string|number} value
 * @param {string}  subtitle
 * @param {React.ReactNode} icon
 * @param {'green'|'blue'|'orange'|'red'|'purple'} color
 * @param {{value: number|string, positive: boolean}} [trend]
 */
export default function StatCard({ title, value, subtitle, icon, color = 'green', trend }) {
  const colors = colorMap[color] || colorMap.green;

  // Detect if value has a prefix/suffix (e.g. '₹ 1,23,456' or '95%')
  const rawNum = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  const prefix = String(value).match(/^[^0-9]*/)?.[0] || '';
  const suffix = String(value).match(/[^0-9]*$/)?.[0] || '';
  const isNumeric = !isNaN(rawNum);

  const animated = useCountUp(isNumeric ? rawNum : 0);
  const displayValue = isNumeric
    ? `${prefix}${animated.toLocaleString('en-IN')}${suffix}`
    : value;

  return (
    <div
      className={`
        group relative bg-white rounded-2xl p-5 border border-slate-100
        shadow-md hover:shadow-xl transition-all duration-300
        hover:-translate-y-1 cursor-default overflow-hidden
        ${colors.ring} hover:ring-2
      `}
    >
      {/* Background decorative blob */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-extrabold text-slate-800 tabular-nums leading-none">
            {displayValue}
          </p>
        </div>

        {/* Icon circle */}
        <div
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl
            bg-gradient-to-br ${colors.bg} text-white
            shadow-lg ${colors.shadow}
            group-hover:scale-110 transition-transform duration-300
          `}
        >
          {icon && React.cloneElement(icon, { size: 22 })}
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-xs text-slate-500 leading-snug">{subtitle}</p>
        )}

        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {trend.positive ? (
              <FiTrendingUp size={12} />
            ) : (
              <FiTrendingDown size={12} />
            )}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
