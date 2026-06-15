import { MapPin, Clock, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PreparationPath } from "@/lib/types";

interface Props {
  path: PreparationPath;
}

const STEP_COLORS = [
  "bg-[#2D7BFF] text-white",
  "bg-[#1D63E6] text-white",
  "bg-[#0891b2] text-white",
  "bg-[#059669] text-white",
];

export function PreparationPathCard({ path }: Props) {
  return (
    <div className="card p-6 bg-gradient-to-br from-[#0D1B2E] to-[#1e3a5f] text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#2D7BFF]/40 flex items-center justify-center">
                <MapPin size={13} className="text-[#93BBFF]" />
              </div>
              <span className="text-xs font-semibold text-[#93BBFF] uppercase tracking-wider">Your Preparation Path</span>
            </div>
            <h3 className="font-display font-bold text-lg text-white leading-tight">
              {path.targetRole
                ? `${path.targetRole} Roadmap`
                : "Your Personalised Plan"}
            </h3>
            {(path.targetIndustry || path.targetCompany) && (
              <p className="text-xs text-white/60 mt-1">
                {[path.targetIndustry, path.targetCompany].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
            <Clock size={11} className="text-white/70" />
            <span className="text-xs font-semibold text-white/80">{path.estimatedPreparationDays} days</span>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-2 mb-5">
          {path.recommendedOrder.slice(0, 4).map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-lg ${STEP_COLORS[i]} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                {i + 1}
              </div>
              <span className="text-sm text-white/90 font-medium">{step}</span>
              {i < path.recommendedOrder.slice(0, 4).length - 1 && (
                <div className="absolute left-[27px] w-px h-2 bg-white/10" />
              )}
            </div>
          ))}
        </div>

        {/* Focus areas */}
        {path.focusAreas.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Key focus areas</p>
            <div className="flex flex-wrap gap-1.5">
              {path.focusAreas.map((area) => (
                <span key={area} className="flex items-center gap-1 text-xs font-medium text-white/80 bg-white/10 px-2.5 py-1 rounded-full">
                  <Zap size={9} className="text-[#93BBFF]" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/tests"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-sm font-semibold text-white"
        >
          Start first assessment
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
