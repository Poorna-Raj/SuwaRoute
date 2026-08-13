import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Hospital {
  hospitalId: string;
  hospitalName: string;
  longitude: number;
  latitude: number;
  currentNode: number;
  availableIcuBeds: number;
  contactNumber: string;
}

interface Ambulance {
  ambulanceId: string;
  status: "AVAILABLE" | "BUSY" | "OFFLINE";
  currentNode: number;
  latitude: number;
  longitude: number;
  speed: number;
  currentEmergencyId?: string;
}

interface Emergency {
  emergencyId: string;
  callerName: string;
  callerNumber: string;
  longitude: number;
  latitude: number;
  nearestNodeId?: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "DISPATCHED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  createdAt: string;
}

interface RouteRequest {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteResponse {
  distanceMeters: number;
  path: Coordinate[];
}

// In-Memory Database Seed
let hospitals: Hospital[] = [
  {
    hospitalId: "HOSP-01",
    hospitalName: "National Hospital Colombo",
    latitude: 6.9271,
    longitude: 79.8612,
    currentNode: 101,
    availableIcuBeds: 15,
    contactNumber: "+94 11 269 1111",
  },
  {
    hospitalId: "HOSP-02",
    hospitalName: "Sri Jayewardenepura General Hospital",
    latitude: 6.8782,
    longitude: 79.9165,
    currentNode: 102,
    availableIcuBeds: 8,
    contactNumber: "+94 11 277 8610",
  },
  {
    hospitalId: "HOSP-03",
    hospitalName: "Asiri Central Hospital",
    latitude: 6.9185,
    longitude: 79.8665,
    currentNode: 103,
    availableIcuBeds: 12,
    contactNumber: "+94 11 452 4400",
  },
  {
    hospitalId: "HOSP-04",
    hospitalName: "Lanka Hospitals Colombo",
    latitude: 6.8906,
    longitude: 79.8780,
    currentNode: 104,
    availableIcuBeds: 6,
    contactNumber: "+94 11 553 0000",
  },
];

let ambulances: Ambulance[] = [
  {
    ambulanceId: "AMB-01",
    status: "AVAILABLE",
    currentNode: 201,
    latitude: 6.9200,
    longitude: 79.8650,
    speed: 55,
  },
  {
    ambulanceId: "AMB-02",
    status: "BUSY",
    currentNode: 202,
    latitude: 6.8850,
    longitude: 79.9000,
    speed: 48,
    currentEmergencyId: "EMG-102",
  },
  {
    ambulanceId: "AMB-03",
    status: "AVAILABLE",
    currentNode: 203,
    latitude: 6.8700,
    longitude: 79.8800,
    speed: 60,
  },
  {
    ambulanceId: "AMB-04",
    status: "AVAILABLE",
    currentNode: 204,
    latitude: 6.9350,
    longitude: 79.8500,
    speed: 50,
  },
  {
    ambulanceId: "AMB-05",
    status: "OFFLINE",
    currentNode: 205,
    latitude: 6.8950,
    longitude: 79.8600,
    speed: 0,
  },
];

let emergencies: Emergency[] = [
  {
    emergencyId: "EMG-101",
    callerName: "Kamal Perera",
    callerNumber: "+94 77 123 4567",
    latitude: 6.9150,
    longitude: 79.8700,
    nearestNodeId: 301,
    severity: "CRITICAL",
    status: "DISPATCHED",
    assignedAmbulanceId: "AMB-01",
    assignedHospitalId: "HOSP-01",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    emergencyId: "EMG-102",
    callerName: "Nimali Silva",
    callerNumber: "+94 71 987 6543",
    latitude: 6.8800,
    longitude: 79.9100,
    nearestNodeId: 302,
    severity: "HIGH",
    status: "IN_PROGRESS",
    assignedAmbulanceId: "AMB-02",
    assignedHospitalId: "HOSP-02",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    emergencyId: "EMG-103",
    callerName: "Anura Fernando",
    callerNumber: "+94 70 456 7890",
    latitude: 6.9300,
    longitude: 79.8550,
    nearestNodeId: 303,
    severity: "MEDIUM",
    status: "COMPLETED",
    assignedAmbulanceId: "AMB-04",
    assignedHospitalId: "HOSP-01",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
];

// Distance helper function (Haversine formula in meters)
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware for flexible client calls
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // API Route Handlers conforming strictly to OpenAPI Schema

  // --- HOSPITALS ---
  app.get("/api/hospitals", (req, res) => {
    res.json({
      success: true,
      message: "Hospitals retrieved successfully",
      data: hospitals,
    });
  });

  app.get("/api/hospitals/:id", (req, res) => {
    const hospital = hospitals.find((h) => h.hospitalId === req.params.id);
    if (!hospital) {
      res.status(404).json({ success: false, message: `Hospital not found: ${req.params.id}`, data: null });
      return;
    }
    res.json({ success: true, message: "Hospital retrieved successfully", data: hospital });
  });

  app.post("/api/hospitals", (req, res) => {
    const body = req.body;
    const newHospital: Hospital = {
      hospitalId: body.hospitalId || `HOSP-0${hospitals.length + 1}`,
      hospitalName: body.hospitalName || "New Hospital Facility",
      longitude: Number(body.longitude) || 79.86,
      latitude: Number(body.latitude) || 6.92,
      currentNode: Number(body.currentNode) || Math.floor(Math.random() * 900 + 100),
      availableIcuBeds: Number(body.availableIcuBeds) ?? 5,
      contactNumber: body.contactNumber || "+94 11 000 0000",
    };
    hospitals.unshift(newHospital);
    res.json({ success: true, message: "Hospital created successfully", data: newHospital });
  });

  app.put("/api/hospitals/:id", (req, res) => {
    const index = hospitals.findIndex((h) => h.hospitalId === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false, message: `Hospital not found: ${req.params.id}`, data: null });
      return;
    }
    const updated = { ...hospitals[index], ...req.body, hospitalId: req.params.id };
    hospitals[index] = updated;
    res.json({ success: true, message: "Hospital updated successfully", data: updated });
  });

  app.delete("/api/hospitals/:id", (req, res) => {
    hospitals = hospitals.filter((h) => h.hospitalId !== req.params.id);
    res.json({ success: true, message: "Hospital deleted successfully", data: {} });
  });

  // --- AMBULANCES ---
  app.get("/api/ambulances", (req, res) => {
    res.json({
      success: true,
      message: "Ambulances retrieved successfully",
      data: ambulances,
    });
  });

  app.get("/api/ambulances/:id", (req, res) => {
    const ambulance = ambulances.find((a) => a.ambulanceId === req.params.id);
    if (!ambulance) {
      res.status(404).json({ success: false, message: `Ambulance not found: ${req.params.id}`, data: null });
      return;
    }
    res.json({ success: true, message: "Ambulance retrieved successfully", data: ambulance });
  });

  app.post("/api/ambulances", (req, res) => {
    const body = req.body;
    const newAmbulance: Ambulance = {
      ambulanceId: body.ambulanceId || `AMB-0${ambulances.length + 1}`,
      status: body.status || "AVAILABLE",
      currentNode: Number(body.currentNode) || Math.floor(Math.random() * 900 + 200),
      latitude: Number(body.latitude) || 6.91,
      longitude: Number(body.longitude) || 79.87,
      speed: Number(body.speed) ?? 50,
      currentEmergencyId: body.currentEmergencyId || undefined,
    };
    ambulances.unshift(newAmbulance);
    res.json({ success: true, message: "Ambulance registered successfully", data: newAmbulance });
  });

  app.put("/api/ambulances/:id", (req, res) => {
    const index = ambulances.findIndex((a) => a.ambulanceId === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false, message: `Ambulance not found: ${req.params.id}`, data: null });
      return;
    }
    const updated = { ...ambulances[index], ...req.body, ambulanceId: req.params.id };
    ambulances[index] = updated;
    res.json({ success: true, message: "Ambulance updated successfully", data: updated });
  });

  app.delete("/api/ambulances/:id", (req, res) => {
    ambulances = ambulances.filter((a) => a.ambulanceId !== req.params.id);
    res.json({ success: true, message: "Ambulance removed from fleet", data: {} });
  });

  // --- EMERGENCIES ---
  app.get("/api/emergencies", (req, res) => {
    res.json({
      success: true,
      message: "Emergencies retrieved successfully",
      data: emergencies,
    });
  });

  app.get("/api/emergencies/:id", (req, res) => {
    const emergency = emergencies.find((e) => e.emergencyId === req.params.id);
    if (!emergency) {
      res.status(404).json({ success: false, message: `Emergency not found: ${req.params.id}`, data: null });
      return;
    }
    res.json({ success: true, message: "Emergency retrieved successfully", data: emergency });
  });

  // Emergency Creation with Graph-based Nearest Dispatch logic
  app.post("/api/emergencies", (req, res) => {
    const body = req.body;
    const emgLat = Number(body.latitude) || 6.91;
    const emgLng = Number(body.longitude) || 79.87;

    const newId = `EMG-${Math.floor(Math.random() * 899 + 100)}`;

    // Find nearest AVAILABLE ambulance
    let nearestAmbulance: Ambulance | null = null;
    let minAmbDist = Infinity;

    for (const amb of ambulances) {
      if (amb.status === "AVAILABLE") {
        const dist = getDistanceInMeters(emgLat, emgLng, amb.latitude, amb.longitude);
        if (dist < minAmbDist) {
          minAmbDist = dist;
          nearestAmbulance = amb;
        }
      }
    }

    // Find nearest hospital with available ICU beds
    let nearestHospital: Hospital | null = null;
    let minHospDist = Infinity;

    for (const hosp of hospitals) {
      if (hosp.availableIcuBeds > 0) {
        const dist = getDistanceInMeters(emgLat, emgLng, hosp.latitude, hosp.longitude);
        if (dist < minHospDist) {
          minHospDist = dist;
          nearestHospital = hosp;
        }
      }
    }

    const assignedAmbulanceId = nearestAmbulance ? nearestAmbulance.ambulanceId : undefined;
    const assignedHospitalId = nearestHospital ? nearestHospital.hospitalId : undefined;
    const status = nearestAmbulance ? "DISPATCHED" : "PENDING";

    const newEmergency: Emergency = {
      emergencyId: body.emergencyId || newId,
      callerName: body.callerName || "Anonymous Caller",
      callerNumber: body.callerNumber || "N/A",
      latitude: emgLat,
      longitude: emgLng,
      nearestNodeId: Number(body.nearestNodeId) || Math.floor(Math.random() * 500 + 300),
      severity: body.severity || "HIGH",
      status: status,
      assignedAmbulanceId,
      assignedHospitalId,
      createdAt: new Date().toISOString(),
    };

    // If an ambulance was dispatched, update its status
    if (nearestAmbulance) {
      nearestAmbulance.status = "BUSY";
      nearestAmbulance.currentEmergencyId = newEmergency.emergencyId;
    }

    // Decrement ICU bed if hospital assigned
    if (nearestHospital && nearestHospital.availableIcuBeds > 0) {
      nearestHospital.availableIcuBeds -= 1;
    }

    emergencies.unshift(newEmergency);

    res.json({
      success: true,
      message: nearestAmbulance
        ? `Emergency logged! Dispatched ${nearestAmbulance.ambulanceId} (${Math.round(minAmbDist)}m away) to ${nearestHospital?.hospitalName || "nearest hospital"}.`
        : "Emergency logged! Status set to PENDING as no available ambulances were nearby.",
      data: newEmergency,
    });
  });

  app.put("/api/emergencies/:id", (req, res) => {
    const index = emergencies.findIndex((e) => e.emergencyId === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false, message: `Emergency not found: ${req.params.id}`, data: null });
      return;
    }
    const updated = { ...emergencies[index], ...req.body, emergencyId: req.params.id };
    emergencies[index] = updated;
    res.json({ success: true, message: "Emergency updated successfully", data: updated });
  });

  app.delete("/api/emergencies/:id", (req, res) => {
    emergencies = emergencies.filter((e) => e.emergencyId !== req.params.id);
    res.json({ success: true, message: "Emergency deleted successfully", data: {} });
  });

  // Complete Emergency PATCH endpoint
  app.patch("/api/emergencies/:id/complete", (req, res) => {
    const emergency = emergencies.find((e) => e.emergencyId === req.params.id);
    if (!emergency) {
      res.status(404).json({ success: false, message: `Emergency not found: ${req.params.id}`, data: null });
      return;
    }

    emergency.status = "COMPLETED";

    // Free up assigned ambulance
    if (emergency.assignedAmbulanceId) {
      const amb = ambulances.find((a) => a.ambulanceId === emergency.assignedAmbulanceId);
      if (amb) {
        amb.status = "AVAILABLE";
        amb.currentEmergencyId = undefined;
      }
    }

    res.json({
      success: true,
      message: `Emergency ${emergency.emergencyId} marked COMPLETED. Ambulance ${emergency.assignedAmbulanceId || ""} returned to AVAILABLE status.`,
      data: emergency,
    });
  });

  // --- ROUTING ENGINE ---
  app.post("/api/routes", (req, res) => {
    const body: RouteRequest = req.body;
    const startLat = Number(body.startLatitude) || 6.9271;
    const startLng = Number(body.startLongitude) || 79.8612;
    const endLat = Number(body.endLatitude) || 6.9150;
    const endLng = Number(body.endLongitude) || 79.8700;

    const totalDistance = getDistanceInMeters(startLat, startLng, endLat, endLng);

    // Generate graph nodes (interpolated road path coordinates simulation)
    const steps = 10;
    const pathCoords: Coordinate[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Add slight jitter/curve to imitate road graph navigation
      const wave = Math.sin(t * Math.PI) * 0.0025;
      const lat = startLat + (endLat - startLat) * t + wave * (i % 2 === 0 ? 1 : -1);
      const lng = startLongitude_interpolation(startLng, endLng, t, wave, i);
      pathCoords.push({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });
    }

    function startLongitude_interpolation(sLng: number, eLng: number, t: number, wave: number, i: number) {
      return sLng + (eLng - sLng) * t + wave * (i % 3 === 0 ? -1 : 1);
    }

    const routeResponse: RouteResponse = {
      distanceMeters: totalDistance,
      path: pathCoords,
    };

    res.json(routeResponse);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SuwaRoute Dispatch Server running on http://localhost:${PORT}`);
  });
}

startServer();
