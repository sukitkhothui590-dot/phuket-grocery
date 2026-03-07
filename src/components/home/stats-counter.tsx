"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Users, MapPin, Award } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: 10000,
    suffix: "+",
    label: "รายการสินค้า",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "ลูกค้าที่ไว้วางใจ",
  },
  {
    icon: MapPin,
    value: 10,
    suffix: "+",
    label: "ปีที่ให้บริการ",
  },
  {
    icon: Award,
    value: 100,
    suffix: "%",
    label: "สินค้าคุณภาพ",
  },
];

function AnimatedNumber({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-white lg:text-4xl">
      {value.toLocaleString()}
      {suffix}
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-slate-800">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <stat.icon className="h-7 w-7 text-[#01A1AF]" />
            </div>
            <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            <p className="text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
