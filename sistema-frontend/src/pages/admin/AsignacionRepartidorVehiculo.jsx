/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getAsignaciones, crearAsignacion, actualizarAsignacion, eliminarAsignacion } from "../../services/repartidorVehiculoService";
import { getRepartidores } from "../../services/repartidorService";
import { getVehiculos } from "../../services/vehiculoService";

function AsignacionRepartidorVehiculo() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    try { const [a, r, v] = await Promise.all([getAsignaciones(), getRepartidores(), getVehiculos()]); setAsignaciones(a); setRepartidores(r); setVehiculos(v); } catch (e) { console.error(e); }
  };

  useEffect(() => { cargar(); }, []);

  const handleCrear = async (e) => {
    e.preventDefault(); setError(""); const fd = new FormData(e.target);
    try {
      await crearAsignacion({ fechaAsignacion: fd.get("fechaAsignacion"), estadoAsignacion: fd.get("estadoAsignacion"), repartidor: { idRepartidor: Number(fd.get("idRepartidor")) }, vehiculo: { idVehiculo: Number(fd.get("idVehiculo")) } });
      setModalNuevo(false); cargar();
    } catch (err) { setError(err.response?.data?.error || "Error al crear"); }
  };

  const handleActualizar = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    try {
      await actualizarAsignacion(seleccionado.idAsignacion, { fechaAsignacion: fd.get("fechaAsignacion"), estadoAsignacion: fd.get("estadoAsignacion"), repartidor: { idRepartidor: Number(fd.get("idRepartidor")) }, vehiculo: { idVehiculo: Number(fd.get("idVehiculo")) } });
      setModalEditar(false); setSeleccionado(null); cargar();
    } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try { await eliminarAsignacion(seleccionado.idAsignacion); setModalEliminar(false); setSeleccionado(null); cargar(); } catch (err) { console.error(err); }
  };

  const coloresEstado = { ACTIVA: "bg-[#43A047]/10 text-[#43A047]", INACTIVA: "bg-[#E53935]/10 text-[#E53935]", PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]" };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Asignación Repartidor - Vehículo</h2>
          <p className="text-lg text-on-surface-variant mt-1">Gestiona las asignaciones de vehículos a repartidores.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nueva Asignación
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Repartidor</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Vehículo</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {asignaciones.map(a => (
                <tr key={a.idAsignacion} className="hover:bg-surface-container-lowest transition-colors h-12">
                  <td className="px-4 py-3 text-sm font-semibold">#{a.idAsignacion}</td>
                  <td className="px-4 py-3 text-sm">Rep. #{a.repartidor?.idRepartidor || "-"}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">Veh. #{a.vehiculo?.idVehiculo || "-"}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{a.fechaAsignacion}</td>
                  <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs font-medium ${coloresEstado[a.estadoAsignacion] || "bg-gray-100 text-gray-600"}`}>{a.estadoAsignacion}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSeleccionado(a); setModalEditar(true); }} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button onClick={() => { setSeleccionado(a); setModalEliminar(true); }} className="p-2 text-error hover:bg-error-container rounded transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalNuevo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Nueva Asignación</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Repartidor</label>
                <select name="idRepartidor" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  {repartidores.map(r => <option key={r.idRepartidor} value={r.idRepartidor}>Rep #{r.idRepartidor} - {r.licencia}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Vehículo</label>
                <select name="idVehiculo" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  {vehiculos.map(v => <option key={v.idVehiculo} value={v.idVehiculo}>Veh #{v.idVehiculo} - {v.placa}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha de Asignación</label><input name="fechaAsignacion" type="date" className="w-full border border-outline-variant rounded-lg p-2" required /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoAsignacion" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  <option value="ACTIVA">Activa</option><option value="INACTIVA">Inactiva</option><option value="PENDIENTE">Pendiente</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalNuevo(false)} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar && seleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold">Editar Asignación #{seleccionado.idAsignacion}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Repartidor</label>
                <select name="idRepartidor" defaultValue={seleccionado.repartidor?.idRepartidor} className="w-full border border-outline-variant rounded-lg p-2">
                  {repartidores.map(r => <option key={r.idRepartidor} value={r.idRepartidor}>Rep #{r.idRepartidor}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Vehículo</label>
                <select name="idVehiculo" defaultValue={seleccionado.vehiculo?.idVehiculo} className="w-full border border-outline-variant rounded-lg p-2">
                  {vehiculos.map(v => <option key={v.idVehiculo} value={v.idVehiculo}>Veh #{v.idVehiculo} - {v.placa}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Fecha</label><input name="fechaAsignacion" type="date" defaultValue={seleccionado.fechaAsignacion} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoAsignacion" defaultValue={seleccionado.estadoAsignacion} className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="ACTIVA">Activa</option><option value="INACTIVA">Inactiva</option><option value="PENDIENTE">Pendiente</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="px-4 py-2 rounded-lg font-bold border border-outline-variant">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4"><span className="material-symbols-outlined text-4xl">warning</span></div>
            <h3 className="text-xl font-bold">¿Eliminar asignación?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará la asignación <strong>#{seleccionado?.idAsignacion}</strong> permanentemente.</p>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={handleEliminar} className="w-full py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90">Confirmar</button>
              <button onClick={() => { setModalEliminar(false); setSeleccionado(null); }} className="w-full py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AsignacionRepartidorVehiculo;
