import { apiClient } from "./client";
import {
  Hospital,
  Ambulance,
  Emergency,
  RouteRequest,
  RouteResponse,
  ApiResponse,
} from "../types";

export const hospitalService = {
  getAll: async (): Promise<ApiResponse<Hospital[]>> => {
    const res = await apiClient.get<ApiResponse<Hospital[]>>("/hospitals");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Hospital>> => {
    const res = await apiClient.get<ApiResponse<Hospital>>(`/hospitals/${id}`);
    return res.data;
  },

  create: async (data: Omit<Hospital, "hospitalId"> & { hospitalId?: string }): Promise<ApiResponse<Hospital>> => {
    const res = await apiClient.post<ApiResponse<Hospital>>("/hospitals", data);
    return res.data;
  },

  update: async (id: string, data: Hospital): Promise<ApiResponse<Hospital>> => {
    const res = await apiClient.put<ApiResponse<Hospital>>(`/hospitals/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    const res = await apiClient.delete<ApiResponse<object>>(`/hospitals/${id}`);
    return res.data;
  },
};

export const ambulanceService = {
  getAll: async (): Promise<ApiResponse<Ambulance[]>> => {
    const res = await apiClient.get<ApiResponse<Ambulance[]>>("/ambulances");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Ambulance>> => {
    const res = await apiClient.get<ApiResponse<Ambulance>>(`/ambulances/${id}`);
    return res.data;
  },

  create: async (data: Omit<Ambulance, "ambulanceId"> & { ambulanceId?: string }): Promise<ApiResponse<Ambulance>> => {
    const res = await apiClient.post<ApiResponse<Ambulance>>("/ambulances", data);
    return res.data;
  },

  update: async (id: string, data: Ambulance): Promise<ApiResponse<Ambulance>> => {
    const res = await apiClient.put<ApiResponse<Ambulance>>(`/ambulances/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    const res = await apiClient.delete<ApiResponse<object>>(`/ambulances/${id}`);
    return res.data;
  },
};

export const emergencyService = {
  getAll: async (): Promise<ApiResponse<Emergency[]>> => {
    const res = await apiClient.get<ApiResponse<Emergency[]>>("/emergencies");
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Emergency>> => {
    const res = await apiClient.get<ApiResponse<Emergency>>(`/emergencies/${id}`);
    return res.data;
  },

  create: async (data: Omit<Emergency, "emergencyId" | "status" | "createdAt"> & { emergencyId?: string }): Promise<ApiResponse<Emergency>> => {
    const res = await apiClient.post<ApiResponse<Emergency>>("/emergencies", data);
    return res.data;
  },

  update: async (id: string, data: Emergency): Promise<ApiResponse<Emergency>> => {
    const res = await apiClient.put<ApiResponse<Emergency>>(`/emergencies/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    const res = await apiClient.delete<ApiResponse<object>>(`/emergencies/${id}`);
    return res.data;
  },

  complete: async (id: string): Promise<ApiResponse<Emergency>> => {
    const res = await apiClient.patch<ApiResponse<Emergency>>(`/emergencies/${id}/complete`);
    return res.data;
  },
};

export const routeService = {
  calculateRoute: async (data: RouteRequest): Promise<RouteResponse> => {
    const res = await apiClient.post<RouteResponse>("/routes", data);
    return res.data;
  },
};
