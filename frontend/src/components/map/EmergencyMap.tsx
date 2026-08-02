import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Hospital, Ambulance, Emergency, Coordinate } from "../../types";

// Custom Leaflet Icons using DivIcon for custom styling & badge indicators
const createHospitalIcon = (name: string) =>
  L.divIcon({
    className: "custom-map-icon",
    html: `<div class="relative group cursor-pointer">
      <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-slate-100 ring-2 ring-blue-500/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
      </div>
      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700 shadow-md">
        ${name}
      </div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const createAmbulanceIcon = (ambId: string, status: string) => {
  const isAvailable = status === "AVAILABLE";
  const isBusy = status === "BUSY";
  const bg = isAvailable ? "bg-emerald-500 ring-emerald-500/50" : isBusy ? "bg-amber-500 ring-amber-500/50" : "bg-slate-600 ring-slate-500/30";

  return L.divIcon({
    className: "custom-map-icon",
    html: `<div class="relative group cursor-pointer">
      <div class="w-8 h-8 rounded-full ${bg} text-white flex items-center justify-center shadow-lg border-2 border-slate-100 ring-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.3-.7l-2.43-2.42a1 1 0 0 0-.7-.3H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
      </div>
      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700 shadow-md">
        ${ambId}
      </div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createEmergencyIcon = (emgId: string, severity: string) => {
  const isCritical = severity === "CRITICAL";
  const bg = isCritical ? "bg-rose-600 ring-rose-500/60 animate-emergency-pulse" : "bg-orange-500 ring-orange-500/50";

  return L.divIcon({
    className: "custom-map-icon",
    html: `<div class="relative group cursor-pointer">
      <div class="w-9 h-9 rounded-xl ${bg} text-white flex items-center justify-center shadow-xl border-2 border-slate-100 ring-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.93 10.93 2.83-2.83"/><path d="M2 18h4"/><path d="M20 18h2"/><path d="m19.07 10.93-2.83-2.83"/><path d="M12 10a5 5 0 0 0-5 5v3h10v-3a5 5 0 0 0-5-5z"/></svg>
      </div>
      <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-950/90 text-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/50 shadow-md">
        ${emgId} (${severity})
      </div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Component to handle auto-recentering
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Component to capture map clicks for coordinate selection
const MapClickHandler: React.FC<{ onMapClick?: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

interface EmergencyMapProps {
  hospitals?: Hospital[];
  ambulances?: Ambulance[];
  emergencies?: Emergency[];
  routePath?: Coordinate[];
  secondaryRoutePath?: Coordinate[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  showLegend?: boolean;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  hospitals = [],
  ambulances = [],
  emergencies = [],
  routePath = [],
  secondaryRoutePath = [],
  center = [6.9271, 79.8612], // Default Colombo coordinates
  zoom = 13,
  onMapClick,
  height = "h-[500px]",
  showLegend = true,
}) => {
  // Convert route coordinates to Leaflet LatLngExpression array
  const polylineCoords: [number, number][] = routePath.map((c) => [c.latitude, c.longitude]);
  const secondaryCoords: [number, number][] = secondaryRoutePath.map((c) => [c.latitude, c.longitude]);

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-800 shadow-xl`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <MapRecenter center={center} zoom={zoom} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Dark Mode Leaflet TileLayer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Primary Route Polyline (Leg 1: e.g. Ambulance to Emergency) */}
        {polylineCoords.length > 0 && (
          <>
            <Polyline
              positions={polylineCoords}
              pathOptions={{ color: "#3a86ff", weight: 6, opacity: 0.8 }}
            />
            <Polyline
              positions={polylineCoords}
              pathOptions={{ color: "#60a5fa", weight: 3, opacity: 1, dashArray: "6, 8" }}
            />

            {/* Waypoint Nodes along Primary Route */}
            {routePath.map((node, index) => {
              const isStart = index === 0;
              const isEnd = index === routePath.length - 1;
              const color = isStart ? "#10b981" : isEnd ? "#f43f5e" : "#3b82f6";

              return (
                <CircleMarker
                  key={`node-pri-${index}`}
                  center={[node.latitude, node.longitude]}
                  radius={isStart || isEnd ? 7 : 4}
                  pathOptions={{
                    color: "#ffffff",
                    fillColor: color,
                    fillOpacity: 1,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs text-slate-100 font-mono">
                      <p className="font-bold text-blue-400">
                        {isStart ? "🚩 Origin (Node 1)" : isEnd ? "🏁 Destination (Node " + routePath.length + ")" : `WayPoint Node #${index + 1}`}
                      </p>
                      <p className="text-[10px] text-slate-300">
                        Lat: {node.latitude.toFixed(5)} | Lng: {node.longitude.toFixed(5)}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </>
        )}

        {/* Secondary Route Polyline (Leg 2: e.g. Emergency to Hospital) */}
        {secondaryCoords.length > 0 && (
          <>
            <Polyline
              positions={secondaryCoords}
              pathOptions={{ color: "#a855f7", weight: 6, opacity: 0.8 }}
            />
            <Polyline
              positions={secondaryCoords}
              pathOptions={{ color: "#c084fc", weight: 3, opacity: 1, dashArray: "6, 8" }}
            />

            {/* Waypoint Nodes along Secondary Route */}
            {secondaryRoutePath.map((node, index) => {
              const isStart = index === 0;
              const isEnd = index === secondaryRoutePath.length - 1;

              return (
                <CircleMarker
                  key={`node-sec-${index}`}
                  center={[node.latitude, node.longitude]}
                  radius={isStart || isEnd ? 7 : 4}
                  pathOptions={{
                    color: "#ffffff",
                    fillColor: "#a855f7",
                    fillOpacity: 1,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs text-slate-100 font-mono">
                      <p className="font-bold text-purple-400">
                        Leg 2 - Hospital Route Node #{index + 1}
                      </p>
                      <p className="text-[10px] text-slate-300">
                        Lat: {node.latitude.toFixed(5)} | Lng: {node.longitude.toFixed(5)}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </>
        )}

        {/* Render Hospitals */}
        {hospitals.map((hosp) => (
          <Marker
            key={hosp.hospitalId}
            position={[hosp.latitude, hosp.longitude]}
            icon={createHospitalIcon(hosp.hospitalName.split(" ")[0])}
          >
            <Popup>
              <div className="p-1 space-y-1.5 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="text-xs font-bold text-blue-400">{hosp.hospitalId}</span>
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    ICU Beds: {hosp.availableIcuBeds}
                  </span>
                </div>
                <h4 className="text-xs font-semibold">{hosp.hospitalName}</h4>
                <p className="text-[11px] text-slate-300">Contact: {hosp.contactNumber}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Location: {hosp.latitude.toFixed(4)}, {hosp.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Ambulances */}
        {ambulances.map((amb) => (
          <Marker
            key={amb.ambulanceId}
            position={[amb.latitude, amb.longitude]}
            icon={createAmbulanceIcon(amb.ambulanceId, amb.status)}
          >
            <Popup>
              <div className="p-1 space-y-1.5 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="text-xs font-bold text-emerald-400">{amb.ambulanceId}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      amb.status === "AVAILABLE"
                        ? "bg-emerald-950 text-emerald-400"
                        : amb.status === "BUSY"
                        ? "bg-amber-950 text-amber-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Speed: {amb.speed} km/h</p>
                <p className="text-[11px] text-slate-300">Node ID: {amb.currentNode}</p>
                {amb.currentEmergencyId && (
                  <p className="text-[11px] text-rose-400 font-semibold">
                    Assigned: {amb.currentEmergencyId}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Emergencies */}
        {emergencies.map((emg) => (
          <Marker
            key={emg.emergencyId}
            position={[emg.latitude, emg.longitude]}
            icon={createEmergencyIcon(emg.emergencyId, emg.severity)}
          >
            <Popup>
              <div className="p-1 space-y-1.5 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="text-xs font-bold text-rose-400">{emg.emergencyId}</span>
                  <span className="text-[10px] font-bold bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded">
                    {emg.severity}
                  </span>
                </div>
                <h4 className="text-xs font-semibold">Caller: {emg.callerName}</h4>
                <p className="text-[11px] text-slate-300">Phone: {emg.callerNumber}</p>
                <p className="text-[11px] text-slate-300">
                  Status: <strong className="text-amber-400">{emg.status}</strong>
                </p>
                {emg.assignedAmbulanceId && (
                  <p className="text-[11px] text-emerald-400">
                    Unit: {emg.assignedAmbulanceId}
                  </p>
                )}
                {emg.assignedHospitalId && (
                  <p className="text-[11px] text-blue-400">
                    Hospital: {emg.assignedHospitalId}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Interactive Map Legend Overlay */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#151e38]/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-2 pointer-events-auto">
          <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[10px] border-b border-slate-700/60 pb-1">
            Map Legend
          </h5>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 border border-slate-200" />
              <span className="text-slate-300">Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-200" />
              <span className="text-slate-300">Unit Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-slate-200" />
              <span className="text-slate-300">Unit Busy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-rose-600 border border-slate-200 animate-pulse" />
              <span className="text-slate-300">Emergency Incident</span>
            </div>
            {(polylineCoords.length > 0 || secondaryCoords.length > 0) && (
              <>
                <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-700/60">
                  <span className="w-4 h-1 bg-blue-500 rounded" />
                  <span className="text-blue-300 font-semibold">Primary Route & Node Dots</span>
                </div>
                {secondaryCoords.length > 0 && (
                  <div className="flex items-center gap-2 col-span-2">
                    <span className="w-4 h-1 bg-purple-500 rounded" />
                    <span className="text-purple-300 font-semibold">Leg 2 (Hospital Route)</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

