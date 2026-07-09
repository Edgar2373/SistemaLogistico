/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo } from "../../services/vehiculoService";

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    try { setVehiculos(await getVehiculos()); } catch (e) { console.error(e); }
  };

  useEffect(() => { cargar(); }, []);

  const handleCrear = async (e) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.target);
    const tipo = fd.get("tipo"); const placa = fd.get("placa"); const estado = fd.get("estadoVehiculo");
    if (!tipo || !placa || !estado) { setError("Todos los campos son obligatorios"); return; }
    try { await crearVehiculo({ tipo, placa, estadoVehiculo: estado }); setModalNuevo(false); cargar(); } catch (err) { setError(err.response?.data?.error || "Error al crear"); }
  };

  const handleActualizar = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target);
    try { await actualizarVehiculo(seleccionado.idVehiculo, { tipo: fd.get("tipo"), placa: fd.get("placa"), estadoVehiculo: fd.get("estadoVehiculo") }); setModalEditar(false); setSeleccionado(null); cargar(); } catch (err) { console.error(err); }
  };

  const handleEliminar = async () => {
    try { await eliminarVehiculo(seleccionado.idVehiculo); setModalEliminar(false); setSeleccionado(null); cargar(); } catch (err) { console.error(err); }
  };

  const coloresEstado = { ACTIVO: "bg-[#43A047]/10 text-[#43A047]", EN_MANTENIMIENTO: "bg-[#FFA000]/10 text-[#FFA000]", INACTIVO: "bg-[#E53935]/10 text-[#E53935]" };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl text-on-surface">Gestión de Vehículos</h2>
          <p className="text-lg text-on-surface-variant mt-1">Administra la flota de vehículos.</p>
        </div>
        <button onClick={() => setModalNuevo(true)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-3 rounded-lg font-bold hover:opacity-90 shadow-sm">
          <span className="material-symbols-outlined">add</span> Nuevo Vehículo
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">ID</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Tipo</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant">Placa</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant hidden md:table-cell">Estado</th>
                <th className="px-4 py-3 text-sm font-medium text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {vehiculos.map(v => (
                <tr key={v.idVehiculo} className="hover:bg-surface-container-lowest transition-colors h-12">
                  <td className="px-4 py-3 text-sm font-semibold">#{v.idVehiculo}</td>
                  <td className="px-4 py-3 text-sm">{v.tipo}</td>
                  <td className="px-4 py-3 text-sm font-mono font-bold">{v.placa}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell"><span className={`px-2 py-1 rounded text-xs font-medium ${coloresEstado[v.estadoVehiculo] || "bg-gray-100 text-gray-600"}`}>{v.estadoVehiculo}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSeleccionado(v); setModalEditar(true); }} className="p-2 text-primary hover:bg-primary-fixed rounded transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                      <button onClick={() => { setSeleccionado(v); setModalEliminar(true); }} className="p-2 text-error hover:bg-error-container rounded transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
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
              <h3 className="text-xl font-bold">Nuevo Vehículo</h3>
              <button onClick={() => setModalNuevo(false)} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCrear} className="px-6 py-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">{error}</div>}
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label>
                <select name="tipo" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  <option value="MOTOCICLETA">Motocicleta</option>
                  <option value="CAMIONETA">Camioneta</option>
                  <option value="CAMION">Camión</option>
                  <option value="FURGON">Furgón</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Placa</label><input name="placa" className="w-full border border-outline-variant rounded-lg p-2" placeholder="Ej. ABC-123" required /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoVehiculo" className="w-full border border-outline-variant rounded-lg p-2" required>
                  <option value="">Seleccione...</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                  <option value="INACTIVO">Inactivo</option>
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
              <h3 className="text-xl font-bold">Editar Vehículo #{seleccionado.idVehiculo}</h3>
              <button onClick={() => { setModalEditar(false); setSeleccionado(null); }} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleActualizar} className="px-6 py-4 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label>
                <select name="tipo" defaultValue={seleccionado.tipo} className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="MOTOCICLETA">Motocicleta</option>
                  <option value="CAMIONETA">Camioneta</option>
                  <option value="CAMION">Camión</option>
                  <option value="FURGON">Furgón</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Placa</label><input name="placa" defaultValue={seleccionado.placa} className="w-full border border-outline-variant rounded-lg p-2" /></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Estado</label>
                <select name="estadoVehiculo" defaultValue={seleccionado.estadoVehiculo} className="w-full border border-outline-variant rounded-lg p-2">
                  <option value="ACTIVO">Activo</option>
                  <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                  <option value="INACTIVO">Inactivo</option>
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
            <h3 className="text-xl font-bold">¿Eliminar vehículo?</h3>
            <p className="text-on-surface-variant mt-2">Se eliminará <strong>{seleccionado?.placa}</strong> permanentemente.</p>
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

export default Vehiculos;
