import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Building2,
  AlertOctagon,
  CheckCircle2,
  Check,
  Siren,
  ArrowRight,
  Activity,
  Bed,
} from "lucide-react";
import { useAmbulances } from "../../hooks/useAmbulances";
import { useHospitals } from "../../hooks/useHospitals";
import { useEmergencies, useCompleteEmergency } from "../../hooks/useEmergencies";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Badge";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmergencyMap } from "../../components/map/EmergencyMap";
import { useToast } from "../../components/ui/Toast";

export const DashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const { data: ambulances, isLoading: loadingAmb, isError: errAmb, refetch: refetchAmb } = useAmbulances();
  const { data: hospitals, isLoading: loadingHosp, isError: errHosp, refetch: refetchHosp } = useHospitals();
  const { data: emergencies, isLoading: loadingEmg, isError: errEmg, refetch: refetchEmg } = useEmergencies();

  const completeEmergency = useCompleteEmergency();

  // Compute live aggregated statistics
  const stats = useMemo(() => {
    const totalAmb = ambulances?.length || 0;
    const availAmb = ambulances?.filter((a) => a.status === "AVAILABLE").length || 0;
    const busyAmb = ambulances?.filter((a) => a.status === "BUSY").length || 0;

    const totalHosp = hospitals?.length || 0;
    const icuBeds = hospitals?.reduce((sum, h) => sum + (h.availableIcuBeds || 0), 0) || 0;

    const activeEmg = emergencies?.filter((e) => e.status !== "COMPLETED" && e.status !== "CANCELLED").length || 0;
    const completedEmg = emergencies?.filter((e) => e.status === "COMPLETED").length || 0;

    return { totalAmb, availAmb, busyAmb, totalHosp, icuBeds, activeEmg, completedEmg };
  }, [ambulances, hospitals, emergencies]);

  const handleCompleteEmergency = (id: string) => {
    completeEmergency.mutate(id, {
      onSuccess: (res) => {
        showToast("success", "Emergency Completed", res.message || `Emergency ${id} completed successfully.`);
      },
      onError: (err: any) => {
        showToast("error", "Error", err.response?.data?.message || "Failed to mark emergency as completed.");
      },
    });
  };

  const isLoading = loadingAmb || loadingHosp || loadingEmg;
  const isError = errAmb || errHosp || errEmg;

  if (isError) {
    return (
      <ErrorState
        title="Command Center Disconnected"
        message="Unable to establish communication with the Spring Boot dispatch service."
        onRetry={() => {
          refetchAmb();
          refetchHosp();
          refetchEmg();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-100">
              Emergency Command Center Overview
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time graph-based fleet monitoring, hospital ICU telemetry, and automated unit dispatch
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/map"
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Full Dispatch Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Available Ambulances"
          value={stats.availAmb}
          subtitle={`Out of ${stats.totalAmb} active units`}
          icon={Truck}
          variant="green"
        />
        <StatCard
          title="Busy Ambulances"
          value={stats.busyAmb}
          subtitle="On active dispatch"
          icon={Siren}
          variant="orange"
        />
        <StatCard
          title="Active Emergencies"
          value={stats.activeEmg}
          subtitle="Requiring response"
          icon={AlertOctagon}
          variant="red"
        />
        <StatCard
          title="Hospitals Online"
          value={stats.totalHosp}
          subtitle="Integrated facilities"
          icon={Building2}
          variant="blue"
        />
        <StatCard
          title="Available ICU Beds"
          value={stats.icuBeds}
          subtitle="Total regional capacity"
          icon={Bed}
          variant="purple"
        />
      </div>

      {/* Split View: Live Map & Dispatch Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Interactive Map Preview (2 cols) */}
        <div className="lg:col-span-2 bg-[#151e38] border border-slate-800/80 p-5 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Fleet & Incident Radar
            </h3>
            <span className="text-xs text-slate-400">OpenStreetMap Graph Overlay</span>
          </div>
          <EmergencyMap
            hospitals={hospitals}
            ambulances={ambulances}
            emergencies={emergencies}
            height="h-[380px]"
            showLegend={true}
          />
        </div>

        {/* Live Incident Status Summary */}
        <div className="bg-[#151e38] border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200">Dispatch Metrics</h3>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                OpenAPI Spec v0
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 bg-[#0b132b] rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Completed Incidents</p>
                  <p className="text-xl font-bold text-emerald-400 mt-0.5">{stats.completedEmg}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
              </div>

              <div className="p-3.5 bg-[#0b132b] rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Fleet Availability Ratio</p>
                  <p className="text-xl font-bold text-blue-400 mt-0.5">
                    {stats.totalAmb > 0 ? Math.round((stats.availAmb / stats.totalAmb) * 100) : 0}%
                  </p>
                </div>
                <Truck className="w-6 h-6 text-blue-400/80" />
              </div>

              <div className="p-3.5 bg-[#0b132b] rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Algorithmic Router</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Automatically calculates shortest path using <strong>Dijkstra&apos;s Min Heap Priority Queue</strong> algorithm.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/emergencies"
              className="w-full py-2.5 text-xs font-bold text-center text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/30 rounded-xl transition-colors block"
            >
              View All Emergencies →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Emergencies Table */}
      <div className="bg-[#151e38] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Siren className="w-5 h-5 text-rose-500" />
              Recent Emergency Incidents
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated dispatch status and assigned regional response units
            </p>
          </div>
          <Link
            to="/emergencies"
            className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Emergency Management</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : !emergencies || emergencies.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No emergency incidents recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b132b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Emergency ID</th>
                  <th className="px-4 py-3">Caller</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Unit</th>
                  <th className="px-4 py-3">Assigned Hospital</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {emergencies.slice(0, 6).map((emg) => (
                  <tr key={emg.emergencyId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-100">
                      {emg.emergencyId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      {emg.callerName}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {emg.callerNumber}
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="severity" value={emg.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="emergencyStatus" value={emg.status} />
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {emg.assignedAmbulanceId ? (
                        <span className="text-emerald-400 font-semibold">
                          {emg.assignedAmbulanceId}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {emg.assignedHospitalId ? (
                        <span className="text-blue-400 font-semibold">
                          {emg.assignedHospitalId}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {emg.status !== "COMPLETED" && emg.status !== "CANCELLED" ? (
                        <button
                          onClick={() => handleCompleteEmergency(emg.emergencyId)}
                          disabled={completeEmergency.isPending}
                          className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition-colors"
                          title="Complete Incident & Release Ambulance"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
