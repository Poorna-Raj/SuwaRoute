import React, { useState } from "react";
import {
  MapPin,
  Building2,
  Truck,
  Siren,
  Filter,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useHospitals } from "../../hooks/useHospitals";
import { useAmbulances } from "../../hooks/useAmbulances";
import { useEmergencies } from "../../hooks/useEmergencies";
import { EmergencyMap } from "../../components/map/EmergencyMap";
import { Modal } from "../../components/ui/Modal";
import { CreateEmergencyForm } from "../emergencies/CreateEmergencyForm";

export const MapPage: React.FC = () => {
  const { data: hospitals, refetch: refetchHosp } = useHospitals();
  const { data: ambulances, refetch: refetchAmb } = useAmbulances();
  const { data: emergencies, refetch: refetchEmg } = useEmergencies();

  const [showHospitals, setShowHospitals] = useState(true);
  const [showAmbulances, setShowAmbulances] = useState(true);
  const [showEmergencies, setShowEmergencies] = useState(true);

  // Quick dispatch modal triggered by clicking on map
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setClickedCoords({ lat, lng });
  };

  const handleRefreshAll = () => {
    refetchHosp();
    refetchAmb();
    refetchEmg();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-100">
              Regional Live Emergency Radar & Interactive Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of active ambulances, hospital ICU capacity, and incoming emergency call locations
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRefreshAll}
            className="p-2 text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            title="Refresh Map Markers"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Visibility Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151e38] border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Toggle Layer Visibility:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
              showHospitals
                ? "bg-blue-950 text-blue-300 border-blue-500/50 shadow-md"
                : "bg-slate-800/40 text-slate-500 border-slate-700 opacity-60"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals?.length || 0})</span>
          </button>

          <button
            onClick={() => setShowAmbulances(!showAmbulances)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
              showAmbulances
                ? "bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-md"
                : "bg-slate-800/40 text-slate-500 border-slate-700 opacity-60"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Ambulances ({ambulances?.length || 0})</span>
          </button>

          <button
            onClick={() => setShowEmergencies(!showEmergencies)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
              showEmergencies
                ? "bg-rose-950 text-rose-300 border-rose-500/50 shadow-md"
                : "bg-slate-800/40 text-slate-500 border-slate-700 opacity-60"
            }`}
          >
            <Siren className="w-3.5 h-3.5" />
            <span>Emergencies ({emergencies?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-[#151e38] border border-slate-800 p-4 rounded-2xl shadow-xl relative">
        <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>Tip: Click anywhere on the map to trigger an immediate emergency dispatch at that exact location.</span>
        </p>

        <EmergencyMap
          hospitals={showHospitals ? hospitals : []}
          ambulances={showAmbulances ? ambulances : []}
          emergencies={showEmergencies ? emergencies : []}
          onMapClick={handleMapClick}
          height="h-[620px]"
          showLegend={true}
        />
      </div>

      {/* Dispatch Emergency Modal triggered via Map Click */}
      <Modal
        isOpen={!!clickedCoords}
        onClose={() => setClickedCoords(null)}
        title="Dispatch Emergency at Selected Map Coordinate"
        subtitle={`Lat: ${clickedCoords?.lat.toFixed(5)}, Lng: ${clickedCoords?.lng.toFixed(5)}`}
        maxWidth="xl"
      >
        {clickedCoords && (
          <CreateEmergencyForm
            defaultCoords={clickedCoords}
            onSuccess={() => setClickedCoords(null)}
          />
        )}
      </Modal>
    </div>
  );
};
