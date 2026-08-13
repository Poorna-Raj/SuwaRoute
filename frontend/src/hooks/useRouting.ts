import { useMutation } from "@tanstack/react-query";
import { routeService } from "../api/services";
import { RouteRequest } from "../types";

export const useCalculateRoute = () => {
  return useMutation({
    mutationFn: (data: RouteRequest) => routeService.calculateRoute(data),
  });
};
