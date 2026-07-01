import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

function LayoutAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideBar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay móvil — cierra sidebar al tocar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col px-4">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="px-4 md:px-8 py-6 space-y-6 max-w-[1440px] flex-1">
          <Outlet />
        </div>

        <footer className="p-6 text-center text-sm font-medium text-outline">
          © 2026 LogiFlow Fleet Management Systems. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}

export default LayoutAdmin;