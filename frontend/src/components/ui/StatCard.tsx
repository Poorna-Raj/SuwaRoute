import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "blue" | "green" | "orange" | "red" | "purple" | "neutral";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  trend,
}) => {
  const variantStyles = {
    blue: {
      border: "border-blue-500/20 hover:border-blue-500/40",
      bgIcon: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      glow: "shadow-blue-950/20",
    },
    green: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      bgIcon: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      glow: "shadow-emerald-950/20",
    },
    orange: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      bgIcon: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      glow: "shadow-amber-950/20",
    },
    red: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      bgIcon: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      glow: "shadow-rose-950/20",
    },
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/40",
      bgIcon: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      glow: "shadow-purple-950/20",
    },
    neutral: {
      border: "border-slate-700/40 hover:border-slate-600/60",
      bgIcon: "bg-slate-800 text-slate-300 border-slate-700",
      glow: "shadow-slate-950/20",
    },
  }[variant];

  return (
    <div
      className={`relative bg-[#151e38] border rounded-xl p-5 shadow-lg transition-all duration-200 ${variantStyles.border} ${variantStyles.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-100">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-normal">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-xl border shrink-0 ${variantStyles.bgIcon}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
