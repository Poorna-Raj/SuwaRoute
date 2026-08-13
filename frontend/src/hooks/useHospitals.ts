import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hospitalService } from "../api/services";
import { Hospital } from "../types";

export const QUERY_KEYS = {
  hospitals: ["hospitals"] as const,
  hospital: (id: string) => ["hospitals", id] as const,
};

export const useHospitals = () => {
  return useQuery({
    queryKey: QUERY_KEYS.hospitals,
    queryFn: async () => {
      const res = await hospitalService.getAll();
      return res.data || [];
    },
    refetchInterval: 10000, // Poll every 10s for live hospital status
  });
};

export const useHospital = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.hospital(id),
    queryFn: async () => {
      const res = await hospitalService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hospital: Omit<Hospital, "hospitalId"> & { hospitalId?: string }) =>
      hospitalService.create(hospital),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hospitals });
    },
  });
};

export const useUpdateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hospital }: { id: string; hospital: Hospital }) =>
      hospitalService.update(id, hospital),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hospitals });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hospital(variables.id) });
    },
  });
};

export const useDeleteHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hospitalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hospitals });
    },
  });
};
