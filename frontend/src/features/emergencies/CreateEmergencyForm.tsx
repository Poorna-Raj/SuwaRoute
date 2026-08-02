import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Siren, Phone, MapPin, AlertTriangle, User } from "lucide-react";
import { useCreateEmergency } from "../../hooks/useEmergencies";
import { useToast } from "../../components/ui/Toast";

const emergencySchema = z.object({
  callerName: z.string().min(2, "Caller name must be at least 2 characters"),
  callerNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  latitude: z.number({ message: "Latitude is required" }).min(-90).max(90),
  longitude: z.number({ message: "Longitude is required" }).min(-180).max(180),
  nearestNodeId: z.number().optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

type EmergencyFormData = z.infer<typeof emergencySchema>;

interface CreateEmergencyFormProps {
  onSuccess?: () => void;
  defaultCoords?: { lat: number; lng: number };
}

export const CreateEmergencyForm: React.FC<CreateEmergencyFormProps> = ({
  onSuccess,
  defaultCoords,
}) => {
  const { showToast } = useToast();
  const createEmergency = useCreateEmergency();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      callerName: "",
      callerNumber: "",
      latitude: defaultCoords?.lat || 6.9150,
      longitude: defaultCoords?.lng || 79.8700,
      severity: "HIGH",
      nearestNodeId: 305,
    },
  });

  const onSubmit = (data: EmergencyFormData) => {
    createEmergency.mutate(data, {
      onSuccess: (res) => {
        showToast(
          "success",
          "Emergency Logged & Dispatched",
          res.message || "Dispatch system successfully assigned nearest ambulance."
        );
        if (onSuccess) onSuccess();
      },
      onError: (err: any) => {
        showToast(
          "error",
          "Dispatch Failed",
          err.response?.data?.message || "Failed to log emergency."
        );
      },
    });
  };

  // Preset location quick selection helpers
  const handlePresetSelect = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Caller Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Caller Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              {...register("callerName")}
              placeholder="e.g. Kamal Perera"
              className="w-full bg-[#0b132b] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.callerName && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.callerName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Caller Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              {...register("callerNumber")}
              placeholder="e.g. +94 77 123 4567"
              className="w-full bg-[#0b132b] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.callerNumber && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.callerNumber.message}</p>
          )}
        </div>
      </div>

      {/* Severity Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
          Incident Severity Level
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((sev) => (
            <label
              key={sev}
              className="cursor-pointer border border-slate-700 rounded-lg p-2 text-center transition-all has-[:checked]:border-rose-500 has-[:checked]:bg-rose-950/40 has-[:checked]:text-rose-300"
            >
              <input
                type="radio"
                value={sev}
                {...register("severity")}
                className="sr-only"
              />
              <span className="text-xs font-bold block">{sev}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Incident Latitude
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="number"
              step="any"
              {...register("latitude", { valueAsNumber: true })}
              className="w-full bg-[#0b132b] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.latitude && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Incident Longitude
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="number"
              step="any"
              {...register("longitude", { valueAsNumber: true })}
              className="w-full bg-[#0b132b] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          {errors.longitude && (
            <p className="text-[11px] text-rose-400 mt-1">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      {/* Quick Location Presets */}
      <div>
        <span className="text-[11px] text-slate-400 font-medium mr-2">Quick Presets:</span>
        <div className="inline-flex flex-wrap gap-1.5 mt-1">
          <button
            type="button"
            onClick={() => handlePresetSelect(6.9271, 79.8612)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
          >
            Colombo Fort
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(6.8782, 79.9165)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
          >
            Nugegoda
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect(6.8906, 79.8780)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
          >
            Bambalapitiya
          </button>
        </div>
      </div>

      {/* Auto Dispatch Note */}
      <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-lg flex items-start gap-2.5 text-xs text-blue-200">
        <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Submitting will trigger Dijkstra&apos;s graph routing engine to assign the nearest <strong>AVAILABLE</strong> ambulance unit and hospital with <strong>ICU capacity</strong>.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={createEmergency.isPending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/50 transition-all disabled:opacity-50"
        >
          {createEmergency.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Routing & Dispatching...</span>
            </>
          ) : (
            <>
              <Siren className="w-4 h-4" />
              <span>DISPATCH NEAREST AMBULANCE</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
