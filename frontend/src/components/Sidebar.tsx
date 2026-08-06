import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, X, Crown } from "lucide-react";
import { useAuthStore } from "../store/userStore";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const logout = useAuthStore((state) => state.logout);
  const links = [
    { name: "Dashboard", path: "/home/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/home/products", icon: Package },
    { name: "Orders", path: "/home/orders", icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-64 bg-slate-950 p-6
          flex flex-col justify-between border-r border-slate-800/80
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/20 font-bold ring-1 ring-white/10">
                <Crown className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <h1 className="text-white font-extrabold tracking-tight text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">ShopSphere</h1>
                <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider">Admin Control</p>
              </div>
            </div>

            <button
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout (bottom) */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full px-3.5 py-3 rounded-xl text-sm font-semibold
          text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </aside>
    </>
  );
}

