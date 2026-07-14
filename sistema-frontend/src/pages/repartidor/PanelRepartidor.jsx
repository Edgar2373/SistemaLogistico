/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidosPorRepartidor, actualizarPedido } from "../../services/pedidoService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function PanelRepartidor() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const nombre = localStorage.getItem("nombre") || "Repartidor";
  const repartidorId = localStorage.getItem("repartidorId");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const e = await getEstadosPedido();
        setEstados(e);
      } catch (err) {
        console.error(err);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!repartidorId) {
      setLoading(false);
      return;
    }
    const cargarPedidos = async () => {
      try {
        const p = await getPedidosPorRepartidor(repartidorId);
        setPedidos(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarPedidos();
  }, [repartidorId]);

  const cambiarEstado = async (pedido, nuevoEstado) => {
    try {
      setActualizando(pedido.idPedido);
      await actualizarPedido(pedido.idPedido, {
        ...pedido,
        cliente: { idCliente: pedido.cliente?.idCliente },
        usuario: { idUsuario: pedido.usuario?.idUsuario },
        repartidor: { idRepartidor: pedido.repartidor?.idRepartidor },
        ruta: { idRuta: pedido.ruta?.idRuta },
        estadoPedido: { idEstado: estados.find(e => e.nombreEstado === nuevoEstado)?.idEstado },
      });
      setPedidos(prev => prev.map(p =>
        p.idPedido === pedido.idPedido
          ? { ...p, estadoPedido: { ...p.estadoPedido, nombreEstado: nuevoEstado } }
          : p
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setActualizando(null);
    }
  };

  const getSiguienteEstado = (estadoActual) => {
    switch (estadoActual) {
      case "PENDIENTE": return "EN_RUTA";
      case "EN_RUTA": return "ENTREGADO";
      default: return null;
    }
  };

  const getIconoBoton = (estadoActual) => {
    switch (estadoActual) {
      case "PENDIENTE": return "local_shipping";
      case "EN_RUTA": return "check_circle";
      default: return null;
    }
  };

  const getLabelBoton = (estadoActual) => {
    switch (estadoActual) {
      case "PENDIENTE": return "Iniciar Entrega";
      case "EN_RUTA": return "Marcar Entregado";
      default: return null;
    }
  };

  if (!repartidorId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-inverse-surface text-on-primary p-3 sm:p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="material-symbols-outlined text-2xl sm:text-3xl shrink-0">local_shipping</span>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">LogiFlow</h1>
                <p className="text-xs sm:text-sm text-outline-variant truncate">Panel del Repartidor</p>
              </div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">logout</span>
              <span className="text-xs sm:text-sm font-medium">Salir</span>
            </button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
          <div className="bg-white border border-outline-variant rounded-xl p-6 sm:p-8 text-center">
            <span className="material-symbols-outlined text-4xl sm:text-6xl text-primary mb-4">person_pin_circle</span>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-2">Sin perfil de repartidor</h2>
            <p className="text-sm sm:text-base text-on-surface-variant">Tu cuenta de usuario no tiene un perfil de repartidor vinculado. Contacta al administrador.</p>
          </div>
        </main>
      </div>
    );
  }

  const pedidosPendientes = pedidos.filter(p => p.estadoPedido?.nombreEstado === "PENDIENTE");
  const pedidosEnRuta = pedidos.filter(p => p.estadoPedido?.nombreEstado === "EN_RUTA");
  const pedidosEntregados = pedidos.filter(p => p.estadoPedido?.nombreEstado === "ENTREGADO");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-inverse-surface text-on-primary p-3 sm:p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="material-symbols-outlined text-2xl sm:text-3xl shrink-0">local_shipping</span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">LogiFlow</h1>
              <p className="text-xs sm:text-sm text-outline-variant truncate">Panel del Repartidor</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">Hola, <strong>{nombre}</strong></span>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary">
              <span className="material-symbols-outlined text-xl sm:text-2xl">logout</span>
              <span className="text-xs sm:text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFA000]/10 text-[#FFA000] rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">pending</span>
            </div>
            <div className="min-w-0"><p className="text-xs text-outline">Pendientes</p><p className="text-xl sm:text-2xl font-bold">{pedidosPendientes.length}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1976D2]/10 text-[#1976D2] rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">local_shipping</span>
            </div>
            <div className="min-w-0"><p className="text-xs text-outline">En Ruta</p><p className="text-xl sm:text-2xl font-bold">{pedidosEnRuta.length}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-3 sm:p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#43A047]/10 text-[#43A047] rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">check_circle</span>
            </div>
            <div className="min-w-0"><p className="text-xs text-outline">Entregados</p><p className="text-xl sm:text-2xl font-bold">{pedidosEntregados.length}</p></div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-outline-variant">
            <h2 className="font-bold text-base sm:text-xl text-on-surface">Mis Pedidos Asignados</h2>
          </div>
          <div className="divide-y divide-outline-variant/40">
            {loading ? (
              <LoadingSpinner texto="Cargando pedidos..." />
            ) : pedidos.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl sm:text-5xl text-outline">inbox</span>
                <p className="mt-2 text-sm sm:text-base">No tienes pedidos asignados actualmente.</p>
              </div>
            ) : (
              pedidos.map(p => {
                const siguienteEstado = getSiguienteEstado(p.estadoPedido?.nombreEstado);
                const icono = getIconoBoton(p.estadoPedido?.nombreEstado);
                const label = getLabelBoton(p.estadoPedido?.nombreEstado);

                return (
                  <div key={p.idPedido} className="p-3 sm:p-4 hover:bg-surface-container-lowest transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-on-surface text-sm sm:text-base">Pedido #{p.idPedido}</span>
                          <StatusBadge estado={p.estadoPedido?.nombreEstado} />
                        </div>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 flex flex-wrap items-center gap-1">
                          <span className="material-symbols-outlined text-sm align-middle shrink-0">location_on</span>
                          <span className="break-words">{p.direccionEntrega}</span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.direccionEntrega)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1976D2]/10 text-[#1976D2] rounded-full text-xs font-bold hover:bg-[#1976D2] hover:text-white transition-colors shrink-0"
                            title="Abrir en Google Maps"
                          >
                            <span className="material-symbols-outlined text-sm">map</span> Maps
                          </a>
                        </p>
                        <p className="text-xs text-outline mt-1 break-words">
                          Cliente: #{p.cliente?.idCliente || "-"} | Ruta: {p.ruta?.nombreRuta || "-"} | Salida: {p.horaSalida}
                        </p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-3 sm:min-w-fit">
                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary text-sm sm:text-base">S/ {p.costoEnvio}</p>
                          <p className="text-xs text-outline">{p.tiempoEstimadoEntrega} min est.</p>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end">
                          {siguienteEstado && (
                            <button
                              onClick={() => cambiarEstado(p, siguienteEstado)}
                              disabled={actualizando === p.idPedido}
                              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-colors ${
                                siguienteEstado === "EN_RUTA"
                                  ? "bg-[#1976D2] text-white hover:bg-[#1565C0]"
                                  : "bg-[#43A047] text-white hover:bg-[#388E3C]"
                              } disabled:opacity-50`}
                            >
                              <span className="material-symbols-outlined text-base sm:text-lg">{icono}</span>
                              {actualizando === p.idPedido ? "..." : label}
                            </button>
                          )}
                          {p.estadoPedido?.nombreEstado === "PENDIENTE" && (
                            <button
                              onClick={() => cambiarEstado(p, "CANCELADO")}
                              disabled={actualizando === p.idPedido}
                              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm bg-[#E53935] text-white hover:bg-[#C62828] disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-base sm:text-lg">cancel</span>
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PanelRepartidor;
