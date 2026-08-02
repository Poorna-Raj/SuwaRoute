import React, { useState, useEffect } from "react";
import {
  Siren,
  Clock,
  Radio,
  PlusCircle,
  Database,
} from "lucide-react";
import { getStoredBaseUrl } from "../../api/client";

interface NavbarProps {
  onOpenCreateEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateEmergency }) => {
  const [time, setTime] = useState<string>("");
  const baseUrl = getStoredBaseUrl();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-[#0b132b] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-md">
      {/* System Status Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
            System Online
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Endpoint:</span>
          <code className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {baseUrl}
          </code>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Realtime Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-medium text-slate-300 bg-[#151e38] px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{time || "00:00:00 AM"}</span>
        </div>

        {/* Emergency Dispatch Button */}
        <button
          onClick={onOpenCreateEmergency}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-lg shadow-rose-950/50 border border-rose-500/30 transition-all duration-200 active:scale-95"
        >
          <Siren className="w-4 h-4 animate-bounce" />
          <span>NEW EMERGENCY</span>
          <PlusCircle className="w-3.5 h-3.5 ml-1 opacity-80" />
        </button>
      </div>
    </header>
  );
};
