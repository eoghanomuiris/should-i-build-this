import type { Indicator } from "@/types/evaluation";

const INDICATOR_CONFIG: Record<
  Indicator,
  { label: string; dotClass: string; pillClass: string }
> = {
  green: {
    label: "Favorable",
    dotClass: "bg-emerald-500",
    pillClass: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  amber: {
    label: "Mixed",
    dotClass: "bg-amber-500",
    pillClass: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  red: {
    label: "Unfavorable",
    dotClass: "bg-red-500",
    pillClass: "bg-red-50 text-red-700 ring-red-600/20",
  },
};

type StatusIndicatorProps = {
  status: Indicator;
  showLabel?: boolean;
};

export function StatusIndicator({
  status,
  showLabel = true,
}: StatusIndicatorProps) {
  const config = INDICATOR_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.pillClass}`}
      aria-label={config.label}
    >
      <span
        className={`h-2 w-2 rounded-full ${config.dotClass}`}
        aria-hidden="true"
      />
      {showLabel && config.label}
    </span>
  );
}
