export interface Hospital {
  hospitalId: string;
  hospitalName: string;
  longitude: number;
  latitude: number;
  currentNode: number;
  availableIcuBeds: number;
  contactNumber: string;
}

export type AmbulanceStatus = "AVAILABLE" | "BUSY" | "OFFLINE";

export interface Ambulance {
  ambulanceId: string;
  status: AmbulanceStatus;
  currentNode: number;
  latitude: number;
  longitude: number;
  speed: number;
  currentEmergencyId?: string;
}

export type EmergencySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EmergencyStatus = "PENDING" | "DISPATCHED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Emergency {
  emergencyId: string;
  callerName: string;
  callerNumber: string;
  longitude: number;
  latitude: number;
  nearestNodeId?: number;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  createdAt?: string;
}

export interface RouteRequest {
  startLatitude: number;
  startLongitude: number;
  endLatitude: number;
  endLongitude: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  distanceMeters: number;
  path: Coordinate[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SystemStats {
  totalAmbulances: number;
  availableAmbulances: number;
  busyAmbulances: number;
  offlineAmbulances: number;
  totalHospitals: number;
  availableIcuBeds: number;
  totalEmergencies: number;
  activeEmergencies: number;
  completedEmergencies: number;
}
