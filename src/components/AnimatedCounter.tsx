import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  secondarySuffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  secondarySuffix = '',
}) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth cubic easeOut curve
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeOutProgress * end;

      setCount(currentVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
      {secondarySuffix && <span className="text-xs text-amber-400 font-mono ml-0.5">{secondarySuffix}</span>}
    </span>
  );
};
