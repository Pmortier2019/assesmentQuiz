import { ClipboardList } from "lucide-react";
import { ASSESSMENT_TYPE_ICONS, cn } from "@/lib/utils";
import { normalizeAssessmentType } from "@/lib/api";
import type { AssessmentType } from "@/lib/types";

interface AssessmentTypeIconProps {
  type: string | null | undefined;
  size?: number;
  className?: string;
}

/**
 * Renders the lucide icon for an assessment type. Falls back to a neutral
 * clipboard icon for unknown/empty types. Monochrome by default (brand navy);
 * pass `className` to override the colour where a tile needs it.
 */
export function AssessmentTypeIcon({ type, size = 20, className }: AssessmentTypeIconProps) {
  const key = (type ? normalizeAssessmentType(type) : "") as AssessmentType;
  const Icon = ASSESSMENT_TYPE_ICONS[key] ?? ClipboardList;
  return <Icon size={size} className={cn("text-[#0D1B2E]", className)} aria-hidden="true" />;
}
