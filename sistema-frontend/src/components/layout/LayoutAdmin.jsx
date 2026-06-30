import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

function LayoutAdmin() {
  return (
    <div className="flex min-h-screen">
      <SideBar />

      <main className="flex-1 ml-[260px] min-h-screen flex flex-col px-4">
        <TopBar />

        <div className="px-8 py-6 space-y-6  max-w-[1440px] flex-1">
          <Outlet />
        </div>

        <footer className="p-lg text-center text-label-md text-outline">
          © 2026 LogiFlow Fleet Management Systems. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default LayoutAdmin;