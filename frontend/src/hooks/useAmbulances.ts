import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ambulanceService } from "../api/services";
import { Ambulance } from "../types";

export const QUERY_KEYS = {
  ambulances: ["ambulances"] as const,
  ambulance: (id: string) => ["ambulances", id] as const,
};

export const useAmbulances = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ambulances,
    queryFn: async () => {
      const res = await ambulanceService.getAll();
      return res.data || [];
    },
    refetchInterval: 5000, // Live poll ambulance fleet every 5s
  });
};

export const useAmbulance = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ambulance(id),
    queryFn: async () => {
      const res = await ambulanceService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ambulance: Omit<Ambulance, "ambulanceId"> & { ambulanceId?: string }) =>
      ambulanceService.create(ambulance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ambulances });
    },
  });
};

export const useUpdateAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ambulance }: { id: string; ambulance: Ambulance }) =>
      ambulanceService.update(id, ambulance),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ambulances });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ambulance(variables.id) });
    },
  });
};

export const useDeleteAmbulance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ambulanceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ambulances });
    },
  });
};
