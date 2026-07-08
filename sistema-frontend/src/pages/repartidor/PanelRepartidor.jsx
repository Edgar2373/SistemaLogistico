/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getPedidosPorRepartidor, actualizarPedido } from "../../services/pedidoService";
import { getRepartidores } from "../../services/repartidorService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function PanelRepartidor() {
  const [pedidos, setPedidos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [repartidorId, setRepartidorId] = useState(() => localStorage.getItem("repartidorId"));
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const nombre = localStorage.getItem("nombre") || "Repartidor";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [r, e] = await Promise.all([getRepartidores(), getEstadosPedido()]);
        setRepartidores(r);
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

  const seleccionarRepartidor = (id) => {
    localStorage.setItem("repartidorId", id);
    setRepartidorId(id);
    setLoading(true);
  };

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
        <header className="bg-inverse-surface text-on-primary p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">local_shipping</span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">LogiFlow</h1>
                <p className="text-sm text-outline-variant">Panel del Repartidor</p>
              </div>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="bg-white border border-outline-variant rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-primary mb-4">person_pin_circle</span>
            <h2 className="text-xl font-bold text-on-surface mb-2">Seleccione su perfil de repartidor</h2>
            <p className="text-on-surface-variant mb-6">Para ver sus pedidos asignados, seleccione su identificación de repartidor.</p>
            <div className="max-w-md mx-auto">
              <select
                onChange={(e) => e.target.value && seleccionarRepartidor(e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-3 text-lg"
                defaultValue=""
              >
                <option value="">Seleccione su ID de repartidor...</option>
                {repartidores.map(r => (
                  <option key={r.idRepartidor} value={r.idRepartidor}>
                    {r.licencia || `Repartidor #${r.idRepartidor}`}
                  </option>
                ))}
              </select>
            </div>
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
            <button onClick={() => { localStorage.removeItem("repartidorId"); setRepartidorId(null); }} className="p-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary" title="Cambiar perfil">
              <span className="material-symbols-outlined">swap_horiz</span>
            </button>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-variant transition-colors text-on-primary">
              <span className="material-symbols-outlined">logout</span>
              <span className="hidden sm:inline text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFA000]/10 text-[#FFA000] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">pending</span>
            </div>
            <div><p className="text-xs text-outline">Pendientes</p><p className="text-2xl font-bold">{pedidosPendientes.length}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2]/10 text-[#1976D2] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div><p className="text-xs text-outline">En Ruta</p><p className="text-2xl font-bold">{pedidosEnRuta.length}</p></div>
          </div>
          <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-[#43A047]/10 text-[#43A047] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div><p className="text-xs text-outline">Entregados</p><p className="text-2xl font-bold">{pedidosEntregados.length}</p></div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h2 className="font-bold text-xl text-on-surface">Mis Pedidos Asignados</h2>
          </div>
          <div className="divide-y divide-outline-variant/40">
            {loading ? (
              <LoadingSpinner texto="Cargando pedidos..." />
            ) : pedidos.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-outline">inbox</span>
                <p className="mt-2">No tienes pedidos asignados actualmente.</p>
              </div>
            ) : (
              pedidos.map(p => {
                const siguienteEstado = getSiguienteEstado(p.estadoPedido?.nombreEstado);
                const icono = getIconoBoton(p.estadoPedido?.nombreEstado);
                const label = getLabelBoton(p.estadoPedido?.nombreEstado);

                return (
                  <div key={p.idPedido} className="p-4 hover:bg-surface-container-lowest transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">Pedido #{p.idPedido}</span>
                          <StatusBadge estado={p.estadoPedido?.nombreEstado} />
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">
                          <span className="material-symbols-outlined text-sm align-middle">location_on</span> {p.direccionEntrega}
                        </p>
                        <p className="text-xs text-outline mt-1">
                          Cliente: #{p.cliente?.idCliente || "-"} | Ruta: {p.ruta?.nombreRuta || "-"} | Salida: {p.horaSalida}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-primary">S/ {p.costoEnvio}</p>
                          <p className="text-xs text-outline">{p.tiempoEstimadoEntrega} min est.</p>
                        </div>
                        <div className="flex gap-2">
                          {siguienteEstado && (
                            <button
                              onClick={() => cambiarEstado(p, siguienteEstado)}
                              disabled={actualizando === p.idPedido}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-sm transition-colors ${
                                siguienteEstado === "EN_RUTA"
                                  ? "bg-[#1976D2] text-white hover:bg-[#1565C0]"
                                  : "bg-[#43A047] text-white hover:bg-[#388E3C]"
                              } disabled:opacity-50`}
                            >
                              <span className="material-symbols-outlined text-lg">{icono}</span>
                              {actualizando === p.idPedido ? "..." : label}
                            </button>
                          )}
                          {p.estadoPedido?.nombreEstado === "PENDIENTE" && (
                            <button
                              onClick={() => cambiarEstado(p, "CANCELADO")}
                              disabled={actualizando === p.idPedido}
                              className="flex items-center gap-1 px-3 py-2 rounded-lg font-bold text-sm bg-[#E53935] text-white hover:bg-[#C62828] disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-lg">cancel</span>
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
