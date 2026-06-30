import { Link } from "react-router-dom";

// Lista de accesos directos
const accesos = [
  { label: "Módulo de Pedidos", icon: "shopping_cart", path: "/pedidos" },
  { label: "Gestión de Clientes", icon: "groups", path: "/clientes" },
  { label: "Control de Repartidores", icon: "sports_motorsports", path: "/repartidores" },
];

function QuickAccess() {
  return (
    <div className="space-y-lg px-6 py-4">
      <h4 className="font-bold text-xl text-on-surface">Accesos Directos</h4>
      <div className="grid grid-cols-1 gap-4">
        {accesos.map((acceso) => (
          <Link
            key={acceso.path}
            to={acceso.path}
            className="flex items-center justify-between p-2 bg-surface-container-high rounded-xl hover:bg-primary hover:text-on-primary transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-white/20 group-hover:text-white">
                {acceso.icon}
              </span>
              <span className="font-label-md">{acceso.label}</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-white">chevron_right</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickAccess;