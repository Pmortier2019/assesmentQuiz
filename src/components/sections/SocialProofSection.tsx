import { Star } from "lucide-react";
import { TESTIMONIALS, STATS } from "@/lib/mock-data";

export function SocialProofSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-extrabold text-3xl sm:text-4xl gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-[#64748b] font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0D1B2E] mb-3">
            Trusted by job seekers everywhere
          </h2>
          <p className="text-[#64748b]">What our users say after practicing with Mortier Asses</p>
        </div>

        {/* Testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={`card p-5 flex flex-col gap-4 animate-fade-up delay-${(i + 1) * 100}`}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[#475569] leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#f1f5f9]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0D1B2E]">{t.name}</p>
                  <p className="text-xs text-[#94a3b8]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
