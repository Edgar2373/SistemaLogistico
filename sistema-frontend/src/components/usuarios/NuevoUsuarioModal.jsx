import { useState } from "react";

function NuevoUsuarioModal({ visible, onClose, onGuardar }) {
  
  const [error, setError] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("OPERADOR");
  if (!visible) return null;  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const usuario = formData.get("usuario");
    const email = formData.get("email");
    const password = formData.get("password");
    const telefono = formData.get("telefono");

    if (!nombre || !usuario || !email || !password || !telefono) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^\d{9}$/.test(telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    setError("");
    onGuardar(e);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-4 modal-overlay">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 sm:px-9 sm:py-6 bg-surface border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold bold">Nuevo Usuario</h3>
            <p className="text-sm font-medium text-on-surface-variant">Completa los datos para el nuevo acceso.</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}  className="px-5 py-4 sm:px-9 sm:py-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Nombre Completo</label>
              <input name="nombre" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" placeholder="Ej. Ana García" type="text" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Nombre de Usuario</label>
              <input name="usuario" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" placeholder="agarcia_logi" type="text" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-bold text-on-surface-variant">Correo Electrónico</label>
            <input name="email" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" placeholder="ana.garcia@logiflow.com" type="email" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Rol Asignado</label>
              <select name="rol" value={rolSeleccionado} onChange={(e) => setRolSeleccionado(e.target.value)} className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2">
                <option value="OPERADOR">Operador</option>
                <option value="REPARTIDOR">Repartidor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Contraseña</label>
              <input name="password" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" type="password" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Teléfono (9 dígitos)</label>
              <input name="telefono" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" placeholder="987654321" type="text" maxLength={9} />
            </div>
            {rolSeleccionado === "REPARTIDOR" && (
              <div className="space-y-1">
                <label className="font-bold text-on-surface-variant">Tipo de Licencia</label>
                <select name="licencia" className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2" required>
                  <option value="">Seleccione...</option>
                  <option value="A-1">A-1 (Motos)</option>
                  <option value="A-2A">A-2A (Autos particulares)</option>
                  <option value="A-2B">A-2B (Taxis)</option>
                  <option value="A-3A">A-3A (Camiones &lt; 4T)</option>
                  <option value="A-3B">A-3B (Camiones &gt; 4T)</option>
                  <option value="B-1">B-1 (Buses &lt; 8 pasajeros)</option>
                  <option value="B-2">B-2 (Buses &gt; 8 pasajeros)</option>
                  <option value="C-1">C-1 (Remolques)</option>
                </select>
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-3 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 transition-all shadow-md">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoUsuarioModal;
