"use client";

import { useRef } from "react";
import { BarChart3, Brain, MessageSquare, Users, Smile, ArrowRight } from "lucide-react";
import Link from "next/link";

const CARDS = [
  {
    icon: BarChart3,
    title: "Numerical Reasoning",
    desc: "Charts, tables, percentages and data interpretation",
    color: "from-[#4f46e5] to-[#6366f1]",
    bg: "from-[#eef2ff] to-[#e0e7ff]",
    iconColor: "text-[#4f46e5]",
    tag: "Most popular",
    score: 78,
  },
  {
    icon: Brain,
    title: "Logical Reasoning",
    desc: "Pattern recognition, sequences and deductive logic",
    color: "from-[#7c3aed] to-[#8b5cf6]",
    bg: "from-[#f5f3ff] to-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
    tag: "High demand",
    score: 65,
  },
  {
    icon: MessageSquare,
    title: "Verbal Reasoning",
    desc: "Text comprehension, inference and critical reading",
    color: "from-[#2563eb] to-[#3b82f6]",
    bg: "from-[#eff6ff] to-[#dbeafe]",
    iconColor: "text-[#2563eb]",
    tag: "Finance & law",
    score: 82,
  },
  {
    icon: Users,
    title: "Situational Judgement",
    desc: "Workplace scenarios and professional decision-making",
    color: "from-[#0891b2] to-[#06b6d4]",
    bg: "from-[#ecfeff] to-[#cffafe]",
    iconColor: "text-[#0891b2]",
    tag: "HR & management",
    score: 71,
  },
  {
    icon: Smile,
    title: "Personality Assessment",
    desc: "Work style, values and behavioural tendencies",
    color: "from-[#059669] to-[#10b981]",
    bg: "from-[#ecfdf5] to-[#d1fae5]",
    iconColor: "text-[#059669]",
    tag: "All sectors",
    score: 90,
  },
];

function TiltCard({ card, index }: { card: (typeof CARDS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 14;
    const rotX = -((y - cy) / cy) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    el.style.boxShadow = "0 20px 40px -8px rgba(79,70,229,0.18), 0 8px 16px -4px rgba(13,27,46,0.12)";
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    el.style.boxShadow = "";
  }

  const Icon = card.icon;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="flex-shrink-0 w-60 rounded-2xl bg-white border border-[#e2e8f0] shadow-md p-5 cursor-default select-none"
      style={{
        transition: "transform 0.12s ease-out, box-shadow 0.2s ease",
        transformStyle: "preserve-3d",
        animationDelay: `${index * 0.12}s`,
      }}
    >
      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] mb-3">
        {card.tag}
      </span>

      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center mb-3`}>
        <Icon size={20} className={card.iconColor} />
      </div>

      <h3 className="font-display font-semibold text-[#0D1B2E] text-sm mb-1">{card.title}</h3>
      <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">{card.desc}</p>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
            style={{ width: `${card.score}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[#475569]">{card.score}%</span>
      </div>
      <p className="text-[10px] text-[#94a3b8] mt-1">avg. user score</p>
    </div>
  );
}

export function TestCarouselSection() {
  return (
    <section className="py-20 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-2">
              Every test type, covered
            </h2>
            <p className="text-[#64748b]">Hover the cards to explore — then start practicing.</p>
          </div>
          <Link
            href="/tests"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2E] text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Browse all tests
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          paddingLeft: "max(1rem, calc((100vw - 80rem) / 2 + 1rem))",
          paddingRight: "2rem",
          scrollSnapType: "x mandatory",
        }}
      >
        {CARDS.map((card, i) => (
          <div key={card.title} style={{ scrollSnapAlign: "start" }}>
            <TiltCard card={card} index={i} />
          </div>
        ))}

        <div className="flex-shrink-0 w-56 rounded-2xl border-2 border-dashed border-[#e2e8f0] flex flex-col items-center justify-center gap-2 p-5 text-center">
          <p className="font-display font-semibold text-[#94a3b8] text-sm">More coming</p>
          <p className="text-xs text-[#cbd5e1]">New types added monthly</p>
          <Link href="/tests" className="text-xs font-semibold text-[#4f46e5] hover:underline mt-1">
            See all →
          </Link>
        </div>
      </div>
    </section>
  );
}
