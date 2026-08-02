import React from "react";
import { AmbulanceStatus, EmergencySeverity, EmergencyStatus } from "../../types";

interface BadgeProps {
  type: "ambulance" | "emergencyStatus" | "severity" | "generic";
  value: AmbulanceStatus | EmergencyStatus | EmergencySeverity | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = "" }) => {
  let styleClasses = "bg-slate-800 text-slate-300 border-slate-700";

  if (type === "ambulance") {
    switch (value as AmbulanceStatus) {
      case "AVAILABLE":
        styleClasses = "bg-emerald-950/80 text-emerald-400 border-emerald-500/30";
        break;
      case "BUSY":
        styleClasses = "bg-amber-950/80 text-amber-400 border-amber-500/30";
        break;
      case "OFFLINE":
        styleClasses = "bg-slate-800/80 text-slate-400 border-slate-600/30";
        break;
    }
  } else if (type === "emergencyStatus") {
    switch (value as EmergencyStatus) {
      case "PENDING":
        styleClasses = "bg-amber-950/80 text-amber-400 border-amber-500/40 animate-pulse";
        break;
      case "DISPATCHED":
        styleClasses = "bg-blue-950/80 text-blue-400 border-blue-500/40";
        break;
      case "IN_PROGRESS":
        styleClasses = "bg-purple-950/80 text-purple-400 border-purple-500/40";
        break;
      case "COMPLETED":
        styleClasses = "bg-emerald-950/80 text-emerald-400 border-emerald-500/40";
        break;
      case "CANCELLED":
        styleClasses = "bg-rose-950/80 text-rose-400 border-rose-500/40";
        break;
    }
  } else if (type === "severity") {
    switch (value as EmergencySeverity) {
      case "CRITICAL":
        styleClasses = "bg-rose-950 text-rose-300 border-rose-500/50 font-bold animate-pulse";
        break;
      case "HIGH":
        styleClasses = "bg-orange-950 text-orange-300 border-orange-500/50 font-semibold";
        break;
      case "MEDIUM":
        styleClasses = "bg-amber-950 text-amber-300 border-amber-500/40";
        break;
      case "LOW":
        styleClasses = "bg-sky-950 text-sky-300 border-sky-500/40";
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide whitespace-nowrap shadow-sm ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {value}
    </span>
  );
};
