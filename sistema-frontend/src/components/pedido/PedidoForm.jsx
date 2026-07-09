import { useState, useEffect } from "react";
import { getClientes } from "../../services/clienteService";
import { getProductos } from "../../services/productoService";
import { getRepartidores } from "../../services/repartidorService";
import { getVehiculos } from "../../services/vehiculoService";
import { getRutas } from "../../services/rutaService";
import { getEstadosPedido } from "../../services/estadoPedidoService";
import { crearPedidoCompleto } from "../../services/pedidoService";

function PedidoForm({ onExito, onCancelar }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [c, p, r, v, ru, e] = await Promise.all([
          getClientes(), getProductos(), getRepartidores(), getVehiculos(), getRutas(), getEstadosPedido()
        ]);
        setClientes(c);
        setProductos(p);
        setRepartidores(r);
        setVehiculos(v);
        setRutas(ru);
        setEstados(e);
      } catch (err) {
        console.error(err);
      }
    };
    cargar();
  }, []);

  const agregarDetalle = () => {
    setDetalles([...detalles, { idProducto: "", cantidad: 1, precioUnitario: 0 }]);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevos = [...detalles];
    if (campo === "idProducto") {
      const prod = productos.find(p => p.idProducto === Number(valor));
      nuevos[index] = {
        ...nuevos[index],
        idProducto: Number(valor),
        precioUnitario: prod ? Number(prod.precio) : 0,
      };
    } else {
      nuevos[index] = { ...nuevos[index], [campo]: Number(valor) };
    }
    setDetalles(nuevos);
  };

  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const totalGeneral = detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (detalles.length === 0) {
      setError("Debe agregar al menos un producto al pedido");
      return;
    }

    const fd = new FormData(e.target);
    const payload = {
      fechaRegistro: fd.get("fechaRegistro"),
      horaSalida: fd.get("horaSalida") + ":00",
      horaEntrega: fd.get("horaEntrega") + ":00",
      tiempoEstimadoEntrega: Number(fd.get("tiempoEstimadoEntrega")),
      tiempoRealEntrega: 0,
      costoEnvio: Number(fd.get("costoEnvio")),
      direccionEntrega: fd.get("direccionEntrega"),
      ordenEnRuta: Number(fd.get("ordenEnRuta") || 1),
      cliente: { idCliente: Number(fd.get("idCliente")) },
      usuario: { idUsuario: Number(localStorage.getItem("idUsuario")) },
      repartidor: { idRepartidor: Number(fd.get("idRepartidor")) },
      ruta: { idRuta: Number(fd.get("idRuta")) },
      estadoPedido: { idEstado: estados.find(e => e.nombreEstado === "PENDIENTE")?.idEstado || 1 },
      detalles: detalles.map(d => ({
        producto: { idProducto: d.idProducto },
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.cantidad * d.precioUnitario,
      })),
    };

    try {
      setCargando(true);
      await crearPedidoCompleto(payload);
      onExito();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || Object.values(err.response?.data || {}).join(". ");
      setError(msg || "Error al crear el pedido");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>
      )}

      <div className="bg-surface-container-low rounded-lg p-4">
        <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Información del Cliente
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Cliente *</label>
            <select name="idCliente" className="w-full border border-outline-variant rounded-lg p-2" required>
              <option value="">Seleccione un cliente...</option>
              {clientes.map(c => (
                <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Dirección de Entrega *</label>
            <input name="direccionEntrega" className="w-full border border-outline-variant rounded-lg p-2" required placeholder="Av. Principal 123, Lima" />
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            Productos del Pedido
          </h4>
          <button type="button" onClick={agregarDetalle} className="flex items-center gap-1 text-primary text-sm font-bold hover:underline">
            <span className="material-symbols-outlined text-lg">add_circle</span> Agregar
          </button>
        </div>
        {detalles.length === 0 ? (
          <p className="text-outline text-sm text-center py-4">No hay productos agregados. Haga clic en "Agregar" para comenzar.</p>
        ) : (
          <div className="space-y-3">
            {detalles.map((detalle, index) => (
              <div key={index} className="flex items-center gap-2 bg-white border border-outline-variant rounded-lg p-3">
                <div className="flex-1">
                  <select
                    value={detalle.idProducto}
                    onChange={(e) => actualizarDetalle(index, "idProducto", e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-2 text-sm"
                    required
                  >
                    <option value="">Producto...</option>
                    {productos.map(p => (
                      <option key={p.idProducto} value={p.idProducto}>
                        {p.nombreProducto} - S/ {p.precio} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={detalle.cantidad}
                    onChange={(e) => actualizarDetalle(index, "cantidad", e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-2 text-sm text-center"
                    required
                  />
                </div>
                <div className="w-24 text-right text-sm font-bold text-primary">
                  S/ {(detalle.cantidad * detalle.precioUnitario).toFixed(2)}
                </div>
                <button type="button" onClick={() => eliminarDetalle(index)} className="text-error hover:bg-error-container rounded p-1">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-outline-variant">
              <span className="text-lg font-bold text-on-surface">Total: S/ {totalGeneral.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface-container-low rounded-lg p-4">
        <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">local_shipping</span>
          Asignación Logística
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Repartidor *</label>
            <select name="idRepartidor" className="w-full border border-outline-variant rounded-lg p-2" required>
              <option value="">Seleccione...</option>
              {repartidores.filter(r => r.estadoRepartidor === "DISPONIBLE").map(r => (
                <option key={r.idRepartidor} value={r.idRepartidor}>
                  {r.licencia || `Rep #${r.idRepartidor}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Vehículo *</label>
            <select name="idVehiculo" className="w-full border border-outline-variant rounded-lg p-2" required>
              <option value="">Seleccione...</option>
              {vehiculos.filter(v => v.estadoVehiculo === "ACTIVO").map(v => (
                <option key={v.idVehiculo} value={v.idVehiculo}>
                  {v.placa} - {v.tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Ruta *</label>
            <select name="idRuta" className="w-full border border-outline-variant rounded-lg p-2" required>
              <option value="">Seleccione...</option>
              {rutas.map(r => (
                <option key={r.idRuta} value={r.idRuta}>{r.nombreRuta}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-lg p-4">
        <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">schedule</span>
          Horarios y Costo
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Fecha *</label>
            <input name="fechaRegistro" type="date" className="w-full border border-outline-variant rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Hora Salida *</label>
            <input name="horaSalida" type="time" className="w-full border border-outline-variant rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Hora Entrega *</label>
            <input name="horaEntrega" type="time" className="w-full border border-outline-variant rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Costo Envío (S/) *</label>
            <input name="costoEnvio" type="number" step="0.01" className="w-full border border-outline-variant rounded-lg p-2" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Tiempo Estimado (min) *</label>
            <input name="tiempoEstimadoEntrega" type="number" className="w-full border border-outline-variant rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Orden en Ruta</label>
            <input name="ordenEnRuta" type="number" defaultValue="1" className="w-full border border-outline-variant rounded-lg p-2" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="px-5 py-2.5 rounded-lg font-bold border border-outline-variant hover:bg-surface-container-low">
          Cancelar
        </button>
        <button type="submit" disabled={cargando} className="px-5 py-2.5 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 disabled:opacity-50">
          {cargando ? "Creando..." : "Crear Pedido"}
        </button>
      </div>
    </form>
  );
}

export default PedidoForm;
