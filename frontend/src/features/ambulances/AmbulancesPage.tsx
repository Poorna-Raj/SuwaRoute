import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  Search,
  Gauge,
  MapPin,
  Loader2,
  Filter,
} from "lucide-react";
import {
  useAmbulances,
  useCreateAmbulance,
  useUpdateAmbulance,
  useDeleteAmbulance,
} from "../../hooks/useAmbulances";
import { Ambulance, AmbulanceStatus } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";

// Zod Schema for Ambulance
const ambulanceSchema = z.object({
  ambulanceId: z.string().min(2, "Ambulance ID is required"),
  status: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]),
  currentNode: z.number({ message: "Node number required" }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().min(0, "Speed must be 0 or higher"),
  currentEmergencyId: z.string().optional(),
});

type AmbulanceFormData = z.infer<typeof ambulanceSchema>;

export const AmbulancesPage: React.FC = () => {
  const { showToast } = useToast();
  const { data: ambulances, isLoading, isError, refetch } = useAmbulances();

  const createAmbulance = useCreateAmbulance();
  const updateAmbulance = useUpdateAmbulance();
  const deleteAmbulance = useDeleteAmbulance();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);
  const [deletingAmbulanceId, setDeletingAmbulanceId] = useState<string | null>(null);

  // Forms
  const createForm = useForm<AmbulanceFormData>({
    resolver: zodResolver(ambulanceSchema),
    defaultValues: {
      ambulanceId: `AMB-0${(ambulances?.length || 0) + 1}`,
      status: "AVAILABLE",
      currentNode: 210,
      latitude: 6.9200,
      longitude: 79.8650,
      speed: 55,
      currentEmergencyId: "",
    },
  });

  const editForm = useForm<AmbulanceFormData>({
    resolver: zodResolver(ambulanceSchema),
  });

  const handleOpenEdit = (amb: Ambulance) => {
    setEditingAmbulance(amb);
    editForm.reset({
      ambulanceId: amb.ambulanceId,
      status: amb.status,
      currentNode: amb.currentNode,
      latitude: amb.latitude,
      longitude: amb.longitude,
      speed: amb.speed,
      currentEmergencyId: amb.currentEmergencyId || "",
    });
  };

  const handleCreateSubmit = (data: AmbulanceFormData) => {
    createAmbulance.mutate(data, {
      onSuccess: () => {
        showToast("success", "Unit Added", `Ambulance ${data.ambulanceId} registered in fleet.`);
        setIsCreateModalOpen(false);
        createForm.reset();
      },
      onError: (err: any) => {
        showToast("error", "Error", err.response?.data?.message || "Failed to add ambulance.");
      },
    });
  };

  const handleEditSubmit = (data: AmbulanceFormData) => {
    if (!editingAmbulance) return;
    updateAmbulance.mutate(
      { id: editingAmbulance.ambulanceId, ambulance: data as Ambulance },
      {
        onSuccess: () => {
          showToast("success", "Unit Updated", `Ambulance ${data.ambulanceId} telemetry saved.`);
          setEditingAmbulance(null);
        },
        onError: (err: any) => {
          showToast("error", "Error", err.response?.data?.message || "Failed to update ambulance.");
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingAmbulanceId) return;
    deleteAmbulance.mutate(deletingAmbulanceId, {
      onSuccess: () => {
        showToast("success", "Unit Deleted", `Ambulance ${deletingAmbulanceId} removed from system.`);
        setDeletingAmbulanceId(null);
      },
      onError: (err: any) => {
        showToast("error", "Error", err.response?.data?.message || "Failed to delete ambulance.");
      },
    });
  };

  // Filtered ambulances list
  const filteredAmbulances = ambulances?.filter((a) => {
    const matchesSearch =
      a.ambulanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.currentEmergencyId && a.currentEmergencyId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Ambulance Fleet Management</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS coordinates, speed telemetry, and node assignment tracking
          </p>
        </div>

        <button
          onClick={() => {
            createForm.setValue("ambulanceId", `AMB-0${(ambulances?.length || 0) + 1}`);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTER AMBULANCE</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search unit ID or emergency..."
            className="w-full bg-[#0b132b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b132b] border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="BUSY">BUSY</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Ambulances Table */}
      <div className="bg-[#151e38] border border-slate-800 rounded-2xl p-6 shadow-xl">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : !filteredAmbulances || filteredAmbulances.length === 0 ? (
          <EmptyState
            title="No Ambulances Found"
            description="No ambulance units match your filter criteria or registered fleet."
            actionLabel="Register Ambulance"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b132b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Ambulance ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Node ID</th>
                  <th className="px-4 py-3">Coordinates (Lat, Lng)</th>
                  <th className="px-4 py-3">Speed</th>
                  <th className="px-4 py-3">Active Dispatch</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredAmbulances.map((amb) => (
                  <tr key={amb.ambulanceId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-100 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{amb.ambulanceId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge type="ambulance" value={amb.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      Node #{amb.currentNode}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        {amb.latitude.toFixed(4)}, {amb.longitude.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="inline-flex items-center gap-1 text-slate-200">
                        <Gauge className="w-3 h-3 text-amber-400" />
                        {amb.speed} km/h
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {amb.currentEmergencyId ? (
                        <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                          {amb.currentEmergencyId}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(amb)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Unit Telemetry"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingAmbulanceId(amb.ambulanceId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Unit"
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

      {/* Create Ambulance Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Ambulance Unit"
        subtitle="Add a new response vehicle to the active dispatch network"
      >
        <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Ambulance ID
            </label>
            <input
              {...createForm.register("ambulanceId")}
              className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
            />
            {createForm.formState.errors.ambulanceId && (
              <p className="text-[11px] text-rose-400 mt-1">
                {createForm.formState.errors.ambulanceId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Status
              </label>
              <select
                {...createForm.register("status")}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BUSY">BUSY</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Current Graph Node
              </label>
              <input
                type="number"
                {...createForm.register("currentNode", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...createForm.register("latitude", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...createForm.register("longitude", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Current Speed (km/h)
            </label>
            <input
              type="number"
              {...createForm.register("speed", { valueAsNumber: true })}
              className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAmbulance.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md"
            >
              {createAmbulance.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Ambulance</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Ambulance Modal */}
      <Modal
        isOpen={!!editingAmbulance}
        onClose={() => setEditingAmbulance(null)}
        title={`Update Telemetry: ${editingAmbulance?.ambulanceId}`}
      >
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Status
              </label>
              <select
                {...editForm.register("status")}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="BUSY">BUSY</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Speed (km/h)
              </label>
              <input
                type="number"
                {...editForm.register("speed", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...editForm.register("latitude", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...editForm.register("longitude", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Graph Node ID
              </label>
              <input
                type="number"
                {...editForm.register("currentNode", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Emergency ID
              </label>
              <input
                {...editForm.register("currentEmergencyId")}
                placeholder="Optional"
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingAmbulance(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateAmbulance.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
            >
              {updateAmbulance.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingAmbulanceId}
        onClose={() => setDeletingAmbulanceId(null)}
        onConfirm={handleDeleteConfirm}
        title="Decommission Ambulance Unit"
        message={`Are you sure you want to delete ${deletingAmbulanceId} from the fleet roster? This action cannot be undone.`}
        isLoading={deleteAmbulance.isPending}
      />
    </div>
  );
};
