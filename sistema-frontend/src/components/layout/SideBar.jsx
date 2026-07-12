import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Usuarios", path: "/usuarios", icon: "👥" },
  { label: "Clientes", path: "/clientes", icon: "👤" },
  { label: "Categorías", path: "/categorias", icon: "📂" },
  { label: "Productos", path: "/productos", icon: "📦" },
  { label: "Pedidos", path: "/pedidos", icon: "📋" },
  { label: "Pagos", path: "/pagos", icon: "💳" },
  { label: "Boletas", path: "/boletas", icon: "🧾" },
  { label: "Estados Pedido", path: "/estados-pedido", icon: "🏷️" },
  { label: "Repartidores", path: "/repartidores", icon: "🚚" },
  { label: "Vehículos", path: "/vehiculos", icon: "🚛" },
  //{ label: "Asig. Repartidor-Veh.", path: "/asignacion-repartidor-vehiculo", icon: "🔗" },
  { label: "Rutas", path: "/rutas", icon: "🛣️" },
];

function SideBar({ sidebarOpen, onClose }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-[260px] flex flex-col bg-black border-r border-outline-variant z-50 transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-3 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-on-primary">LogiFlow</h1>
          <p className="text-sm font-medium text-outline-variant uppercase tracking-widest mt-1">Distribution</p>
        </div>
        <button onClick={onClose} className="md:hidden text-on-primary hover:bg-surface-variant rounded-full p-1">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto mt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 ${
                    isActive
                      ? "bg-primary-container text-on-primary-container border-l-4 border-primary"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 p-4">
        <button
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="flex items-center gap-3 text-outline-variant hover:text-on-primary px-4 py-3 transition-colors w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
