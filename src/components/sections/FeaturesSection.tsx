import { BarChart3, Brain, Briefcase, Layers, Repeat2, Smartphone } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "5 assessment types",
    description: "Numerical, logical, verbal reasoning, situational judgement, and personality tests — all in one place.",
  },
  {
    icon: Briefcase,
    title: "Profession-tailored tests",
    description: "Tests are built around your sector and role — so every question is relevant to the job you want.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    description: "Track your improvement over time, identify weak areas, and see exactly how your scores change.",
  },
  {
    icon: Brain,
    title: "Instant explanations",
    description: "Every question includes a clear explanation — not just what's right, but why, so it sticks.",
  },
  {
    icon: Repeat2,
    title: "Daily streaks",
    description: "Build a consistent practice habit with streak tracking — small steps lead to big improvements.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    description: "Practice anywhere — on the bus, in a coffee shop, or wherever you have a spare 15 minutes.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-4">
            Built for serious candidates
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Every feature is designed to maximize your assessment score — not just keep you busy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card card-interactive p-6 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f46e5]/10 to-[#7c3aed]/10 flex items-center justify-center mb-4 group-hover:from-[#4f46e5]/20 group-hover:to-[#7c3aed]/20 transition-all">
                  <Icon size={20} className="text-[#4f46e5]" />
                </div>
                <h3 className="font-display font-semibold text-[#0D1B2E] text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
