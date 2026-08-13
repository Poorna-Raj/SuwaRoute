import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Phone,
  Bed,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  useHospitals,
  useCreateHospital,
  useUpdateHospital,
  useDeleteHospital,
} from "../../hooks/useHospitals";
import { Hospital } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";

// Zod Schema for Hospital
const hospitalSchema = z.object({
  hospitalId: z.string().min(2, "Hospital ID is required"),
  hospitalName: z.string().min(2, "Hospital Name is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  currentNode: z.number({ message: "Node number required" }),
  availableIcuBeds: z.number().min(0, "ICU beds cannot be negative"),
  contactNumber: z.string().min(5, "Contact number is required"),
});

type HospitalFormData = z.infer<typeof hospitalSchema>;

export const HospitalsPage: React.FC = () => {
  const { showToast } = useToast();
  const { data: hospitals, isLoading, isError, refetch } = useHospitals();

  const createHospital = useCreateHospital();
  const updateHospital = useUpdateHospital();
  const deleteHospital = useDeleteHospital();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [deletingHospitalId, setDeletingHospitalId] = useState<string | null>(null);

  const createForm = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      hospitalId: `HOSP-0${(hospitals?.length || 0) + 1}`,
      hospitalName: "",
      latitude: 6.9271,
      longitude: 79.8612,
      currentNode: 105,
      availableIcuBeds: 10,
      contactNumber: "+94 11 ",
    },
  });

  const editForm = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
  });

  const handleOpenEdit = (hosp: Hospital) => {
    setEditingHospital(hosp);
    editForm.reset({
      hospitalId: hosp.hospitalId,
      hospitalName: hosp.hospitalName,
      latitude: hosp.latitude,
      longitude: hosp.longitude,
      currentNode: hosp.currentNode,
      availableIcuBeds: hosp.availableIcuBeds,
      contactNumber: hosp.contactNumber,
    });
  };

  const handleCreateSubmit = (data: HospitalFormData) => {
    createHospital.mutate(data, {
      onSuccess: () => {
        showToast("success", "Facility Added", `${data.hospitalName} integrated into system.`);
        setIsCreateModalOpen(false);
        createForm.reset();
      },
      onError: (err: any) => {
        showToast("error", "Error", err.response?.data?.message || "Failed to add hospital.");
      },
    });
  };

  const handleEditSubmit = (data: HospitalFormData) => {
    if (!editingHospital) return;
    updateHospital.mutate(
      { id: editingHospital.hospitalId, hospital: data as Hospital },
      {
        onSuccess: () => {
          showToast("success", "Facility Updated", `${data.hospitalName} details saved.`);
          setEditingHospital(null);
        },
        onError: (err: any) => {
          showToast("error", "Error", err.response?.data?.message || "Failed to update hospital.");
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingHospitalId) return;
    deleteHospital.mutate(deletingHospitalId, {
      onSuccess: () => {
        showToast("success", "Facility Removed", `Hospital ${deletingHospitalId} removed.`);
        setDeletingHospitalId(null);
      },
      onError: (err: any) => {
        showToast("error", "Error", err.response?.data?.message || "Failed to delete hospital.");
      },
    });
  };

  const filteredHospitals = hospitals?.filter(
    (h) =>
      h.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.hospitalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.contactNumber.includes(searchTerm)
  );

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-100">Hospital Medical Centers</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ICU bed capacity tracking, contact dispatch numbers, and graph node mapping
          </p>
        </div>

        <button
          onClick={() => {
            createForm.setValue("hospitalId", `HOSP-0${(hospitals?.length || 0) + 1}`);
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-950/40 border border-blue-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ADD HOSPITAL</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between bg-[#151e38] border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospital name, ID, or phone..."
            className="w-full bg-[#0b132b] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="bg-[#151e38] border border-slate-800 rounded-2xl p-6 shadow-xl">
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : !filteredHospitals || filteredHospitals.length === 0 ? (
          <EmptyState
            title="No Hospitals Registered"
            description="No hospital facilities match your search criteria."
            actionLabel="Add Hospital Facility"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0b132b] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Hospital ID</th>
                  <th className="px-4 py-3">Hospital Name</th>
                  <th className="px-4 py-3">ICU Bed Capacity</th>
                  <th className="px-4 py-3">Contact Number</th>
                  <th className="px-4 py-3">Graph Node</th>
                  <th className="px-4 py-3">Location Coordinates</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredHospitals.map((hosp) => (
                  <tr key={hosp.hospitalId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">
                      {hosp.hospitalId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{hosp.hospitalName}</span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                          hosp.availableIcuBeds > 5
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                            : hosp.availableIcuBeds > 0
                            ? "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                            : "bg-rose-950/80 text-rose-400 border border-rose-500/30 animate-pulse"
                        }`}
                      >
                        <Bed className="w-3.5 h-3.5" />
                        {hosp.availableIcuBeds} Beds Available
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {hosp.contactNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      Node #{hosp.currentNode}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        {hosp.latitude.toFixed(4)}, {hosp.longitude.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(hosp)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Facility"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingHospitalId(hosp.hospitalId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Facility"
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

      {/* Create Hospital Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Hospital Facility"
        subtitle="Integrate new emergency medical facility into dispatch graph"
      >
        <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Hospital ID
              </label>
              <input
                {...createForm.register("hospitalId")}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Hospital Name
              </label>
              <input
                {...createForm.register("hospitalName")}
                placeholder="e.g. Asiri Surgical Hospital"
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Available ICU Beds
              </label>
              <input
                type="number"
                {...createForm.register("availableIcuBeds", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Contact Phone Number
              </label>
              <input
                {...createForm.register("contactNumber")}
                placeholder="+94 11 000 0000"
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Graph Node
              </label>
              <input
                type="number"
                {...createForm.register("currentNode", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

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
              disabled={createHospital.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
            >
              {createHospital.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Hospital</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Hospital Modal */}
      <Modal
        isOpen={!!editingHospital}
        onClose={() => setEditingHospital(null)}
        title={`Edit Facility: ${editingHospital?.hospitalName}`}
      >
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Hospital Name
              </label>
              <input
                {...editForm.register("hospitalName")}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Available ICU Beds
              </label>
              <input
                type="number"
                {...editForm.register("availableIcuBeds", { valueAsNumber: true })}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Contact Number
              </label>
              <input
                {...editForm.register("contactNumber")}
                className="w-full bg-[#0b132b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Graph Node
              </label>
              <input
                type="number"
                {...editForm.register("currentNode", { valueAsNumber: true })}
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

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingHospital(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateHospital.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md"
            >
              {updateHospital.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingHospitalId}
        onClose={() => setDeletingHospitalId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Hospital Facility"
        message={`Are you sure you want to remove hospital ${deletingHospitalId}? Emergency dispatches will no longer route to this facility.`}
        isLoading={deleteHospital.isPending}
      />
    </div>
  );
};
