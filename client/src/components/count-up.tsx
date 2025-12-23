import { useEffect, useState, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2000,
  delay = 0,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (end - startValue) * easeOut;
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hasStarted, end, duration, delay]);

  const formattedValue = `${prefix}${count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {formattedValue}
    </span>
  );
}
