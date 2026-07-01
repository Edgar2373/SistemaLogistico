import { useState } from "react";

function NuevoClienteModal({ visible, onClose, onGuardar }) {
  const [error, setError] = useState("");
  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const telefono = formData.get("telefono");
    const direccionPrincipal = formData.get("direccionPrincipal");

    if (!nombre || !telefono || !direccionPrincipal) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!/^\d{9}$/.test(telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos");
      return;
    }

    if (nombre.length > 100) {
      setError("El nombre no debe exceder 100 caracteres");
      return;
    }

    if (direccionPrincipal.length > 200) {
      setError("La dirección no debe exceder 200 caracteres");
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
            <h3 className="text-xl font-bold bold">Nuevo Cliente</h3>
            <p className="text-sm font-medium text-on-surface-variant">Completa los datos del nuevo cliente.</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 sm:px-9 sm:py-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="font-bold text-on-surface-variant">Nombre del Cliente</label>
            <input
              name="nombre"
              className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
              placeholder="Ej. Almacenes Mediterráneo S.L."
              type="text"
              maxLength={100}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Teléfono (9 dígitos)</label>
              <input
                name="telefono"
                className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                placeholder="987654321"
                type="text"
                maxLength={9}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface-variant">Dirección Principal</label>
              <input
                name="direccionPrincipal"
                className="w-full border border-gray-500 rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                placeholder="Av. Principal 123"
                type="text"
                maxLength={200}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-3 py-2 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 transition-all shadow-md">
              Crear Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoClienteModal;
