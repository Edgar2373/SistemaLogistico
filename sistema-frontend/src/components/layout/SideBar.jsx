import { Link, useLocation } from "react-router-dom";

// Items del menú de navegación del sidebar
const menuItems = [
  { label: "Dashboard", icon: "dashboard", path: "/admin" },
  { label: "Usuarios", icon: "group", path: "/usuarios" },
  { label: "Pedidos", icon: "shopping_cart", path: "/pedidos" },
  { label: "Clientes", icon: "groups", path: "/clientes" },
  { label: "Productos", icon: "inventory_2", path: "/productos" },
  { label: "Repartidores", icon: "sports_motorsports", path: "/repartidores" },
  { label: "Vehículos", icon: "local_shipping", path: "/vehiculos" },
  { label: "Rutas", icon: "route", path: "/rutas" },
  { label: "Categorías", icon: "category", path: "/categorias" },
  { label: "Boletas", icon: "receipt", path: "/boletas" },
  { label: "Pagos", icon: "payments", path: "/pagos" },
];

function SideBar({ sidebarOpen, onClose}) {
  const location = useLocation();

  return (
     <aside
      className={`fixed left-0 top-0 h-full w-[260px] flex flex-col bg-inverse-surface border-r border-outline-variant z-50 transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo + botón cerrar móvil */}
      <div className="p-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-on-primary">LogiFlow</h1>
          <p className="text-sm font-medium text-outline-variant uppercase tracking-widest mt-1">Fleet Management</p>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-on-primary hover:bg-surface-variant rounded-full p-1"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>



      {/* Navegación principal */}
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
                      : "text-outline-variant hover:bg-surface-variant hover:text-on-surface-variant"
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

      {/* Footer del sidebar */}
      <div className="mt-auto border-t border-outline-variant/20 p-4">
        <a className="flex items-center gap-3 text-outline-variant hover:text-on-primary px-4 py-3 transition-colors" href="#">
          <span className="material-symbols-outlined">help</span>
          <span className="font-medium text-sm">Help Center</span>
        </a>
        <button
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="flex items-center gap-3 text-outline-variant hover:text-on-primary px-4 py-3 transition-colors w-full"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default SideBar;