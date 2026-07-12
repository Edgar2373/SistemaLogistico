/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { getPagos, actualizarPago } from "../../services/pagoService";
import { subirEvidenciaPago } from "../../lib/supabase";
import { METODOS_PAGO } from "../../utils/constans";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(null);
  const fileInputRef = useRef({});

  const cargar = async () => {
    try {
      const p = await getPagos();
      setPagos(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = pagos.filter(p => {
    const coincideEstado = filtroEstado ? p.estadoPago === filtroEstado : true;
    const coincideBusqueda = busqueda
      ? String(p.idPago).includes(busqueda) ||
        p.metodoPago?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.referenciaTransaccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.boleta?.idBoleta).includes(busqueda)
      : true;
    return coincideEstado && coincideBusqueda;
  });

  const handleMetodoPago = async (pago, nuevoMetodo) => {
    if (!nuevoMetodo) return;
    try {
      await actualizarPago(pago.idPago, {
        metodoPago: nuevoMetodo,
        estadoPago: pago.estadoPago,
        fechaPago: pago.fechaPago || new Date().toISOString().split("T")[0],
        referenciaTransaccion: pago.referenciaTransaccion || `REF-${pago.idPago}`,
        boleta: { idBoleta: pago.boleta?.idBoleta },
      });
      await cargar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeleccionarArchivo = (pago, archivo) => {
    if (!archivo) return;
    subirFoto(pago, archivo);
  };

  const subirFoto = async (pago, archivo) => {
    try {
      setSubiendo(pago.idPago);
      setError("");
      const url = await subirEvidenciaPago(archivo, pago.idPago);
      await actualizarPago(pago.idPago, {
        metodoPago: pago.metodoPago,
        estadoPago: "PAGADO",
        fechaPago: new Date().toISOString().split("T")[0],
        referenciaTransaccion: pago.referenciaTransaccion || `EVID-${pago.idPago}`,
        boleta: { idBoleta: pago.boleta?.idBoleta },
        urlEvidencia: url,
      });
      await cargar();
    } catch (err) {
      console.error(err);
      setError("Error al subir la evidencia. Intente de nuevo.");
    } finally {
      setSubiendo(null);
    }
  };

  const coloresEstado = {
    PAGADO: "bg-[#43A047]/10 text-[#43A047]",
    PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]",
    CANCELADO: "bg-[#E53935]/10 text-[#E53935]",
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Pagos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Adjunta la evidencia de pago para confirmar el pago.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Buscar por ID, mtodo, referencia o boleta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm font-medium"
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PAGADO">Pagado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Boleta</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Mtodo</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Evidencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filtrados.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-outline">No se encontraron pagos</td></tr>
              ) : (
                filtrados.reverse().map(p => (
                  <tr key={p.idPago} className="hover:bg-surface-container-lowest transition-colors h-12">
                    <td className="px-4 py-3 text-sm font-semibold">#{p.idPago}</td>
                    <td className="px-4 py-3 text-sm">BOL-000{p.boleta?.idBoleta || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={p.metodoPago || ""}
                        onChange={(e) => handleMetodoPago(p, e.target.value)}
                        className="border border-outline-variant rounded px-2 py-1 text-xs font-medium bg-white"
                        disabled={p.estadoPago === "PAGADO"}
                      >
                        <option value="">Seleccionar...</option>
                        {METODOS_PAGO.map(m => (
                          <option key={m} value={m.toUpperCase()}>{m}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${coloresEstado[p.estadoPago] || "bg-gray-100 text-gray-600"}`}>
                        {p.estadoPago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{p.fechaPago || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {p.urlEvidencia ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[#43A047]">
                              <span className="material-symbols-outlined text-xl">check_circle</span>
                            </span>
                            <a href={p.urlEvidencia} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              Ver foto
                            </a>
                          </div>
                        ) : p.estadoPago === "PENDIENTE" ? (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={el => fileInputRef.current[p.idPago] = el}
                              className="hidden"
                              onChange={(e) => handleSeleccionarArchivo(p, e.target.files[0])}
                            />
                            <button
                              onClick={() => fileInputRef.current[p.idPago]?.click()}
                              disabled={subiendo === p.idPago}
                              className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                            >
                              {subiendo === p.idPago ? (
                                <>
                                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                  Subiendo...
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-sm">attach_file</span>
                                  Adjuntar foto
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-outline">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Pagos;
