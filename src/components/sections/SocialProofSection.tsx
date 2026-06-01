"use client";

import { useEffect, useRef, useState } from "react";
import { Star, MessageSquarePlus, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const STATS = [
  { icon: CheckCircle, value: 12400, suffix: "+", label: "Tests completed", color: "text-[#4f46e5]", bg: "bg-[#eef2ff]" },
  { icon: TrendingUp,  value: 87,    suffix: "%",  label: "Avg. score improvement", color: "text-[#10b981]", bg: "bg-[#f0fdf4]" },
  { icon: Users,       value: 3200,  suffix: "+",  label: "Active learners", color: "text-[#7c3aed]", bg: "bg-[#f5f3ff]" },
  { icon: Clock,       value: 15,    suffix: " min", label: "Avg. session length", color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
];

function useCountUp(target: number, duration = 1400, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return count;
}

function StatCard({ stat, started }: { stat: (typeof STATS)[0]; started: boolean }) {
  const count = useCountUp(stat.value, 1500, started);
  const Icon = stat.icon;
  const formatted = count >= 1000 ? count.toLocaleString("en") : count;

  return (
    <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm text-center">
      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
        <Icon size={20} className={stat.color} />
      </div>
      <div>
        <p className={`font-display font-extrabold text-3xl ${stat.color}`}>
          {formatted}{stat.suffix}
        </p>
        <p className="text-sm text-[#64748b] mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
}

export function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-3">
            Real results, real practice
          </h2>
          <p className="text-[#64748b]">Numbers that speak for themselves — and grow every day.</p>
        </div>

        {/* Animated stat counters */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} started={started} />
          ))}
        </div>

        {/* CTA — be the first to review */}
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] flex items-center justify-center">
            <MessageSquarePlus size={26} className="text-[#4f46e5]" />
          </div>
          <div className="text-center max-w-sm">
            <p className="font-display font-semibold text-[#0D1B2E] text-lg mb-2">Be the first to review</p>
            <p className="text-sm text-[#64748b]">
              Start practicing today and share your results. Real reviews from real users — nothing made up.
            </p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-[#e2e8f0] fill-[#e2e8f0]" />
            ))}
          </div>
          <Link
            href="/onboarding"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start practicing for free
          </Link>
        </div>
      </div>
    </section>
  );
}
