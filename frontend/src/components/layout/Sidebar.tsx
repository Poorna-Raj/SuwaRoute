import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Building2,
  AlertOctagon,
  Route,
  MapPin,
  Settings,
  Activity,
  HeartPulse,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Ambulances", path: "/ambulances", icon: Truck },
    { name: "Hospitals", path: "/hospitals", icon: Building2 },
    { name: "Emergencies", path: "/emergencies", icon: AlertOctagon, badge: "Live" },
    { name: "Routing Engine", path: "/routing", icon: Route },
    { name: "Live Map", path: "/map", icon: MapPin },
    { name: "Settings & APIs", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0b132b] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 shrink-0">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-1">
            Suwa<span className="text-rose-500">Route</span>
          </h1>
          <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
            Emergency Dispatch
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full animate-pulse">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Graph Engine Status Footer */}
      <div className="p-4 m-3 bg-[#151e38] border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>Dijkstra Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          OpenStreetMap Graph & Priority Queue Active
        </p>
      </div>
    </aside>
  );
};
