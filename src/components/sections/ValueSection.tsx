import { Briefcase, Zap, MessageSquare, Calendar, Shield } from "lucide-react";

const VALUES = [
  {
    icon: Shield,
    title: "5 free tests",
    description: "Start immediately — no credit card required. Full access to 5 complete assessments.",
    color: "text-[#4f46e5]",
    bg: "bg-[#eef2ff]",
  },
  {
    icon: Zap,
    title: "€4/month Pro",
    description: "Unlock unlimited tests, AI-generated content and detailed analytics for the price of a coffee.",
    color: "text-[#7c3aed]",
    bg: "bg-[#f5f3ff]",
  },
  {
    icon: Briefcase,
    title: "Profession-specific",
    description: "Tests are tailored to your sector and career — not generic one-size-fits-all content.",
    color: "text-[#2563eb]",
    bg: "bg-[#eff6ff]",
  },
  {
    icon: MessageSquare,
    title: "Personal feedback",
    description: "Detailed question-by-question explanations show exactly where to improve and why.",
    color: "text-[#10b981]",
    bg: "bg-[#f0fdf4]",
  },
  {
    icon: Calendar,
    title: "Daily preparation",
    description: "A structured daily plan keeps you on track and builds habits — like Duolingo, for professionals.",
    color: "text-[#f59e0b]",
    bg: "bg-[#fffbeb]",
  },
];

export function ValueSection() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-4">
            Everything you need to get hired
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Built around how professionals actually prepare — consistent, focused, and data-driven.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className={`card card-interactive p-6 flex flex-col gap-4 animate-fade-up delay-${(i + 1) * 100}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${v.bg}`}>
                  <Icon size={22} className={v.color} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[#0D1B2E] text-base mb-1.5">{v.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{v.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
