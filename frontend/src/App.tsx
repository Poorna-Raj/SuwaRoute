import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { AmbulancesPage } from "./features/ambulances/AmbulancesPage";
import { HospitalsPage } from "./features/hospitals/HospitalsPage";
import { EmergenciesPage } from "./features/emergencies/EmergenciesPage";
import { RoutingPage } from "./features/routing/RoutingPage";
import { MapPage } from "./features/map/MapPage";
import { SettingsPage } from "./pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="ambulances" element={<AmbulancesPage />} />
            <Route path="hospitals" element={<HospitalsPage />} />
            <Route path="emergencies" element={<EmergenciesPage />} />
            <Route path="routing" element={<RoutingPage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
