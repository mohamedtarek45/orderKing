import { useState } from "react";
import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export default function HomeLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} />

      {/* CONTENT */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setOpen((p) => !p)}>
            <Menu />
          </button>
          <h1 className="font-semibold">Dashboard</h1>
        </div>

        <main className="p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
