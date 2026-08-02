import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Route,
  Navigation,
  MapPin,
  Play,
  Loader2,
  Zap,
  Building2,
  Truck,
  Siren,
  CheckCircle2,
} from "lucide-react";
import { useCalculateRoute } from "../../hooks/useRouting";
import { useHospitals } from "../../hooks/useHospitals";
import { useAmbulances } from "../../hooks/useAmbulances";
import { useEmergencies } from "../../hooks/useEmergencies";
import { RouteResponse, Coordinate } from "../../types";
import { EmergencyMap } from "../../components/map/EmergencyMap";
import { useToast } from "../../components/ui/Toast";

const routeSchema = z.object({
  startLatitude: z.number({ message: "Start Latitude is required" }).min(-90).max(90),
  startLongitude: z.number({ message: "Start Longitude is required" }).min(-180).max(180),
  endLatitude: z.number({ message: "End Latitude is required" }).min(-90).max(90),
  endLongitude: z.number({ message: "End Longitude is required" }).min(-180).max(180),
});

type RouteFormData = z.infer<typeof routeSchema>;

export const RoutingPage: React.FC = () => {
  const { showToast } = useToast();
  const calculateRoute = useCalculateRoute();

  const { data: hospitals } = useHospitals();
  const { data: ambulances } = useAmbulances();
  const { data: emergencies } = useEmergencies();

  const [routeData, setRouteData] = useState<RouteResponse | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      startLatitude: 6.9200, // Ambulance 01 default
      startLongitude: 79.8650,
      endLatitude: 6.9150, // Emergency default
      endLongitude: 79.8700,
    },
  });

  const watchStartLat = watch("startLatitude");
  const watchStartLng = watch("startLongitude");
  const watchEndLat = watch("endLatitude");
  const watchEndLng = watch("endLongitude");

  const onSubmit = (data: RouteFormData) => {
    calculateRoute.mutate(data, {
      onSuccess: (res) => {
        setRouteData(res);
        showToast(
          "success",
          "Route Calculated",
          `Calculated Dijkstra path: ${(res.distanceMeters / 1000).toFixed(2)} km across ${res.path.length} road graph nodes.`
        );
      },
      onError: (err: any) => {
        showToast(
          "error",
          "Routing Error",
          err.response?.data?.message || "Failed to calculate road graph route."
        );
      },
    });
  };

  // Preset location quick picks
  const handleSelectStart = (lat: number, lng: number) => {
    setValue("startLatitude", lat);
    setValue("startLongitude", lng);
  };

  const handleSelectEnd = (lat: number, lng: number) => {
    setValue("endLatitude", lat);
    setValue("endLongitude", lng);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <Route className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Graph-Based Road Network Routing Engine
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          OpenStreetMap graph navigation powered by Dijkstra&apos;s shortest path algorithm and Min-Heap Priority Queues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Controls & Inputs (1 Col) */}
        <div className="bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              Route Origin & Destination
            </h3>
            <span className="text-[10px] bg-blue-950 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-800">
              POST /api/routes
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* START COORDINATES */}
            <div className="p-3 bg-[#0b132b] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Origin (Start)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Latitude / Longitude</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register("startLatitude", { valueAsNumber: true })}
                    className="w-full bg-[#151e38] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="Start Lat"
                  />
                  {errors.startLatitude && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.startLatitude.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register("startLongitude", { valueAsNumber: true })}
                    className="w-full bg-[#151e38] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="Start Lng"
                  />
                  {errors.startLongitude && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.startLongitude.message}</p>
                  )}
                </div>
              </div>

              {/* Quick Select Origin from Fleet */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Quick Pick Origin:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ambulances?.slice(0, 3).map((amb) => (
                    <button
                      key={amb.ambulanceId}
                      type="button"
                      onClick={() => handleSelectStart(amb.latitude, amb.longitude)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1"
                    >
                      <Truck className="w-2.5 h-2.5" />
                      {amb.ambulanceId}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* END COORDINATES */}
            <div className="p-3 bg-[#0b132b] rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Destination (End)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Latitude / Longitude</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register("endLatitude", { valueAsNumber: true })}
                    className="w-full bg-[#151e38] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                    placeholder="End Lat"
                  />
                  {errors.endLatitude && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.endLatitude.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register("endLongitude", { valueAsNumber: true })}
                    className="w-full bg-[#151e38] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
                    placeholder="End Lng"
                  />
                  {errors.endLongitude && (
                    <p className="text-[10px] text-rose-400 mt-0.5">{errors.endLongitude.message}</p>
                  )}
                </div>
              </div>

              {/* Quick Select Destination from Hospitals or Emergencies */}
              <div className="pt-1 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Quick Pick Destination:</span>
                <div className="flex flex-wrap gap-1">
                  {hospitals?.slice(0, 2).map((hosp) => (
                    <button
                      key={hosp.hospitalId}
                      type="button"
                      onClick={() => handleSelectEnd(hosp.latitude, hosp.longitude)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1"
                    >
                      <Building2 className="w-2.5 h-2.5" />
                      {hosp.hospitalId}
                    </button>
                  ))}
                  {emergencies?.slice(0, 2).map((emg) => (
                    <button
                      key={emg.emergencyId}
                      type="button"
                      onClick={() => handleSelectEnd(emg.latitude, emg.longitude)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-rose-400 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1"
                    >
                      <Siren className="w-2.5 h-2.5" />
                      {emg.emergencyId}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={calculateRoute.isPending}
              className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-950/40 border border-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              {calculateRoute.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Dijkstra Path...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>CALCULATE GRAPH ROUTE</span>
                </>
              )}
            </button>
          </form>

          {/* Route Metrics Calculation Output */}
          {routeData && (
            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 border-b border-blue-800/60 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dijkstra Algorithm Output</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Distance</span>
                  <p className="text-lg font-bold text-slate-100 font-mono">
                    {(routeData.distanceMeters / 1000).toFixed(2)} km
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    ({routeData.distanceMeters.toLocaleString()} meters)
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Graph Path</span>
                  <p className="text-lg font-bold text-amber-400 font-mono">
                    {routeData.path.length} Waypoints
                  </p>
                  <p className="text-[10px] text-slate-400">Road Geometry Nodes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Visualization (2 Cols) */}
        <div className="lg:col-span-2 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Graph Route Visualization
            </h3>
            {routeData && (
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Path Polyline Active ({routeData.path.length} nodes plotted)
              </span>
            )}
          </div>

          <EmergencyMap
            hospitals={hospitals}
            ambulances={ambulances}
            emergencies={emergencies}
            routePath={routeData?.path || []}
            center={
              watchStartLat && watchStartLng
                ? [watchStartLat, watchStartLng]
                : [6.9271, 79.8612]
            }
            height="h-[480px]"
          />

          {/* Step-by-Step Node Navigation List */}
          {routeData && routeData.path.length > 0 && (
            <div className="bg-[#0b132b] border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span>Dijkstra Step-by-Step Node Sequence ({routeData.path.length} Graph Waypoints)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Total: {(routeData.distanceMeters / 1000).toFixed(2)} km
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-1 text-xs font-mono">
                {routeData.path.map((node, idx) => {
                  const isStart = idx === 0;
                  const isEnd = idx === routeData.path.length - 1;

                  return (
                    <div
                      key={`route-node-${idx}`}
                      className={`flex items-center justify-between p-2 rounded-lg border ${
                        isStart
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                          : isEnd
                          ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
                          : "bg-[#151e38] border-slate-800 text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>
                          {isStart
                            ? "Origin Start Node"
                            : isEnd
                            ? "Destination Node"
                            : `Waypoint Node #${idx + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span>
                          Lat: {node.latitude.toFixed(5)}, Lng: {node.longitude.toFixed(5)}
                        </span>
                        {isStart && (
                          <span className="text-[10px] font-bold bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">
                            START
                          </span>
                        )}
                        {isEnd && (
                          <span className="text-[10px] font-bold bg-rose-900/60 text-rose-300 px-1.5 py-0.5 rounded">
                            END
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
