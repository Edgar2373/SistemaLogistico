/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidos } from "../../services/pedidoService";

function PanelRepartidor() {
  const [pedidos, setPedidos] = useState([]);
  const nombre = localStorage.getItem("nombre") || "Repartidor";

  const cargar = async () => { try { setPedidos(await getPedidos()); } catch (e) { console.error(e); } };

  useEffect(() => { cargar(); }, []);

  const coloresEstado = {
    PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]",
    EN_RUTA: "bg-[#1976D2]/10 text-[#1976D2]",
    ENTREGADO: "bg-[#43A047]/10 text-[#43A047]",
    CANCELADO: "bg-[#E53935]/10 text-[#E53935]",
  };

  const totalPedidos = pedidos.length;
  const enRuta = pedidos.filter(p => p.estadoPedido?.nombreEstado === "EN_RUTA").length;
  const entregados = pedidos.filter(p => p.estadoPedido?.nombreEstado === "ENTREGADO").length;
  const pendientes = pedidos.filter(p => p.estadoPedido?.nombreEstado === "PENDIENTE").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-inverse-surface text-on-primary p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">local_shipping</span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">LogiFlow</h1>
              <p className="text-sm text-outline-variant">Panel del Repartidor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block">Hola, <strong>{nombre}</strong></span>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary">
              <span className="material-symbols-outlined">logout</span>
              <span className="hidden sm:inline text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-fixed text-primary rounded-full flex items-center justify-center"><span className="material-symbols-outlined">inventory_2</span></div>
            <div><p className="text-xs text-outline">Total</p><p className="text-2xl font-bold">{totalPedidos}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2]/10 text-[#1976D2] rounded-full flex items-center justify-center"><span className="material-symbols-outlined">local_shipping</span></div>
            <div><p className="text-xs text-outline">En Ruta</p><p className="text-2xl font-bold">{enRuta}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#43A047]/10 text-[#43A047] rounded-full flex items-center justify-center"><span className="material-symbols-outlined">check_circle</span></div>
            <div><p className="text-xs text-outline">Entregados</p><p className="text-2xl font-bold">{entregados}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFA000]/10 text-[#FFA000] rounded-full flex items-center justify-center"><span className="material-symbols-outlined">pending</span></div>
            <div><p className="text-xs text-outline">Pendientes</p><p className="text-2xl font-bold">{pendientes}</p></div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h2 className="font-bold text-xl text-on-surface">Mis Pedidos Asignados</h2>
          </div>
          <div className="divide-y divide-outline-variant/40">
            {pedidos.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-outline">inbox</span>
                <p className="mt-2">No tienes pedidos asignados actualmente.</p>
              </div>
            ) : (
              pedidos.map(p => (
                <div key={p.idPedido} className="p-4 hover:bg-surface-container-lowest transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">Pedido #{p.idPedido}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${coloresEstado[p.estadoPedido?.nombreEstado] || "bg-gray-100 text-gray-600"}`}>{p.estadoPedido?.nombreEstado || "-"}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1">
                        <span className="material-symbols-outlined text-sm align-middle">location_on</span> {p.direccionEntrega}
                      </p>
                      <p className="text-xs text-outline mt-1">Cliente: #{p.cliente?.idCliente || "-"} | Salida: {p.horaSalida} | Entrega: {p.horaEntrega}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">S/ {p.costoEnvio}</p>
                      <p className="text-xs text-outline">{p.tiempoEstimadoEntrega} min est.</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PanelRepartidor;
