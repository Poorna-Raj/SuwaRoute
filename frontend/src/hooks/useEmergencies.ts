import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emergencyService } from "../api/services";
import { Emergency } from "../types";

export const QUERY_KEYS = {
  emergencies: ["emergencies"] as const,
  emergency: (id: string) => ["emergencies", id] as const,
};

export const useEmergencies = () => {
  return useQuery({
    queryKey: QUERY_KEYS.emergencies,
    queryFn: async () => {
      const res = await emergencyService.getAll();
      return res.data || [];
    },
    refetchInterval: 5000, // Live poll dispatch center every 5s
  });
};

export const useEmergency = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.emergency(id),
    queryFn: async () => {
      const res = await emergencyService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Emergency, "emergencyId" | "status" | "createdAt"> & { emergencyId?: string }) =>
      emergencyService.create(data),
    onSuccess: () => {
      // Refresh emergencies, ambulances, and hospitals immediately
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emergencies });
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};

export const useUpdateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, emergency }: { id: string; emergency: Emergency }) =>
      emergencyService.update(id, emergency),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emergencies });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emergency(variables.id) });
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};

export const useDeleteEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emergencyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emergencies });
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};

export const useCompleteEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emergencyService.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.emergencies });
      queryClient.invalidateQueries({ queryKey: ["ambulances"] });
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
};
