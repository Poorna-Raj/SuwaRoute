import React, { useState } from "react";
import {
  Siren,
  Plus,
  CheckCircle,
  Trash2,
  Search,
  Phone,
  User,
  MapPin,
  Clock,
  Filter,
} from "lucide-react";
import {
  useEmergencies,
  useDeleteEmergency,
  useCompleteEmergency,
} from "../../hooks/useEmergencies";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { CreateEmergencyForm } from "./CreateEmergencyForm";
import { useToast } from "../../components/ui/Toast";

export const EmergenciesPage: React.FC = () => {
  const { showToast } = useToast();
  const { data: emergencies, isLoading, isError, refetch } = useEmergencies();

  const deleteEmergency = useDeleteEmergency();
  const completeEmergency = useCompleteEmergency();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingEmergencyId, setDeletingEmergencyId] = useState<string | null>(null);

  const handleComplete = (id: string) => {
    completeEmergency.mutate(id, {
      onSuccess: (res) => {
        showToast("success", "Emergency Completed", res.message || `Emergency ${id} resolved.`);
      },
      onError: (err: any) => {
        showToast("error", "Completion Failed", err.response?.data?.message || "Error completing emergency.");
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingEmergencyId) return;
    deleteEmergency.mutate(deletingEmergencyId, {
      onSuccess: () => {
        showToast("success", "Emergency Deleted", `Record ${deletingEmergencyId} removed.`);
        setDeletingEmergencyId(null);
      },
      onError: (err: any) => {
        showToast("error", "Delete Failed", err.response?.data?.message || "Error deleting record.");
      },
    });
  };

  const filteredEmergencies = emergencies?.filter((e) => {
    const matchesSearch =
      e.emergencyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.callerNumber.includes(searchTerm) ||
      (e.assignedAmbulanceId && e.assignedAmbulanceId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesSeverity = severityFilter === "ALL" || e.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Siren className="w-6 h-6 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-100">
              Emergency Dispatch Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Graph-based intelligent emergency dispatch, nearest unit routing, and resolution logging
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-lg shadow-rose-950/50 border border-rose-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>LOG NEW EMERGENCY</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search caller, ID, phone, unit..."
            className="w-full bg-[#0b132b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0b132b] border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#0b132b] border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergencies Table */}
      <div className="bg-[#151e38] border border-slate-800 rounded-2xl p-6 shadow-xl">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : !filteredEmergencies || filteredEmergencies.length === 0 ? (
          <EmptyState
            title="No Emergency Records"
            description="No emergency incidents match your search or filter parameters."
            actionLabel="Create Emergency"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b132b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Emergency ID</th>
                  <th className="px-4 py-3">Caller Info</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Dispatch Status</th>
                  <th className="px-4 py-3">Assigned Unit</th>
                  <th className="px-4 py-3">Assigned Hospital</th>
                  <th className="px-4 py-3">Incident Location</th>
                  <th className="px-4 py-3">Reported At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredEmergencies.map((emg) => (
                  <tr key={emg.emergencyId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-rose-400 flex items-center gap-2">
                      <Siren className="w-4 h-4 shrink-0" />
                      <span>{emg.emergencyId}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emg.callerName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{emg.callerNumber}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge type="severity" value={emg.severity} />
                    </td>

                    <td className="px-4 py-3">
                      <Badge type="emergencyStatus" value={emg.status} />
                    </td>

                    <td className="px-4 py-3 font-mono">
                      {emg.assignedAmbulanceId ? (
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          {emg.assignedAmbulanceId}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal">Pending Dispatch</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono">
                      {emg.assignedHospitalId ? (
                        <span className="text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                          {emg.assignedHospitalId}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {emg.latitude.toFixed(4)}, {emg.longitude.toFixed(4)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {emg.createdAt
                          ? new Date(emg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just Now"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {emg.status !== "COMPLETED" && emg.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleComplete(emg.emergencyId)}
                            disabled={completeEmergency.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition-colors"
                            title="Complete Incident"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingEmergencyId(emg.emergencyId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Emergency Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Emergency Dispatch Call Intake"
        subtitle="Registers emergency incident and executes graph-based dispatch"
        maxWidth="xl"
      >
        <CreateEmergencyForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingEmergencyId}
        onClose={() => setDeletingEmergencyId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Emergency Record"
        message={`Are you sure you want to delete emergency incident record ${deletingEmergencyId}?`}
        isLoading={deleteEmergency.isPending}
      />
    </div>
  );
};
