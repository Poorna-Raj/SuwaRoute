import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ToastProvider } from "../ui/Toast";
import { Modal } from "../ui/Modal";
import { CreateEmergencyForm } from "../../features/emergencies/CreateEmergencyForm";

export const Layout: React.FC = () => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#0b132b] text-slate-100 overflow-hidden font-sans">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar onOpenCreateEmergency={() => setIsEmergencyModalOpen(true)} />

          <main className="flex-1 overflow-y-auto p-6 bg-[#0b132b]">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Quick Emergency Dispatch Modal */}
        <Modal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          title="Emergency Dispatch System"
          subtitle="Graph-based automated nearest ambulance & hospital dispatch"
          maxWidth="xl"
        >
          <CreateEmergencyForm onSuccess={() => setIsEmergencyModalOpen(false)} />
        </Modal>
      </div>
    </ToastProvider>
  );
};
