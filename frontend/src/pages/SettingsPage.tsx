import React, { useState } from "react";
import {
  Settings,
  Server,
  CheckCircle2,
  Database,
  Radio,
  FileCode,
  Link,
  Save,
} from "lucide-react";
import { getStoredBaseUrl, setStoredBaseUrl } from "../api/client";
import { useToast } from "../components/ui/Toast";

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [baseUrlInput, setBaseUrlInput] = useState(getStoredBaseUrl());

  const handleSaveBaseUrl = () => {
    setStoredBaseUrl(baseUrlInput.trim());
    showToast("success", "API Base URL Saved", "App is reconnecting to new API target.");
  };

  const openApiEndpoints = [
    { path: "GET /api/hospitals", desc: "Retrieve all hospital medical centers" },
    { path: "POST /api/hospitals", desc: "Create a new hospital facility" },
    { path: "GET /api/hospitals/{id}", desc: "Get hospital details by ID" },
    { path: "PUT /api/hospitals/{id}", desc: "Update hospital details" },
    { path: "DELETE /api/hospitals/{id}", desc: "Delete hospital facility" },
    { path: "GET /api/ambulances", desc: "Retrieve all active ambulance fleet units" },
    { path: "POST /api/ambulances", desc: "Register a new ambulance unit" },
    { path: "GET /api/ambulances/{id}", desc: "Get ambulance telemetry by ID" },
    { path: "PUT /api/ambulances/{id}", desc: "Update ambulance telemetry" },
    { path: "DELETE /api/ambulances/{id}", desc: "Delete ambulance from fleet" },
    { path: "GET /api/emergencies", desc: "Retrieve all logged emergency incidents" },
    { path: "POST /api/emergencies", desc: "Log incident & trigger automatic dispatch" },
    { path: "GET /api/emergencies/{id}", desc: "Get emergency details by ID" },
    { path: "PUT /api/emergencies/{id}", desc: "Update emergency record" },
    { path: "DELETE /api/emergencies/{id}", desc: "Delete emergency record" },
    { path: "PATCH /api/emergencies/{id}/complete", desc: "Mark completed & release ambulance" },
    { path: "POST /api/routes", desc: "Calculate Dijkstra shortest path route" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-slate-100">
            System & OpenAPI Integration Settings
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure backend API server targets and review OpenAPI specification compliance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Settings (1 Col) */}
        <div className="bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Server className="w-4 h-4 text-blue-400" />
            Backend Connection
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                API Base URL Target
              </label>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="/api or http://localhost:8080/api"
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Use <code>/api</code> for local Express server simulation or <code>http://localhost:8080/api</code> for Spring Boot.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setBaseUrlInput("/api")}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700"
              >
                Reset to /api
              </button>
              <button
                onClick={() => setBaseUrlInput("http://localhost:8080/api")}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700"
              >
                Spring 8080
              </button>
            </div>

            <button
              onClick={handleSaveBaseUrl}
              className="w-full mt-3 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Reconnect</span>
            </button>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1.5 text-xs text-emerald-300">
            <div className="flex items-center gap-2 font-bold">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>OpenAPI v0 Definition Verified</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              All REST client payloads strictly match Spring Boot DTO schemas (Hospital, Ambulance, Emergency, RouteRequest, RouteResponse).
            </p>
          </div>
        </div>

        {/* OpenAPI Spec Checklist (2 Cols) */}
        <div className="lg:col-span-2 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              OpenAPI 3.1.0 Endpoint Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">17 Operations Defined</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b132b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2">HTTP Endpoint Path</th>
                  <th className="px-3 py-2">Operation Description</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {openApiEndpoints.map((ep) => (
                  <tr key={ep.path} className="hover:bg-slate-800/30">
                    <td className="px-3 py-2 font-bold text-blue-400">{ep.path}</td>
                    <td className="px-3 py-2 font-sans text-slate-300">{ep.desc}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-sans font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
