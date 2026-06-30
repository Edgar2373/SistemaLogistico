import { useState, useEffect } from "react";

function NuevoUsuarioModal({ isOpen, onClose, onSave, usuario = null }) {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    email: "",
    telefono: "",
    rol: "OPERADOR",
    password: "",
    estadoUsuario: "Activo",
  });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Sync state with selected user when editing
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        usuario: usuario.usuario || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || "OPERADOR",
        password: "", // Don't preload hash
        estadoUsuario: usuario.estadoUsuario || "Activo",
      });
    } else {
      setFormData({
        nombre: "",
        usuario: "",
        email: "",
        telefono: "",
        rol: "OPERADOR",
        password: "",
        estadoUsuario: "Activo",
      });
    }
    setError("");
    setGuardando(false);
  }, [usuario, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!formData.nombre || !formData.usuario || !formData.email || !formData.telefono) {
      setError("Todos los campos obligatorios deben estar completos");
      return;
    }
    if (!/^\d{9}$/.test(formData.telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El correo electrónico no es válido");
      return;
    }
    if (!usuario && (!formData.password || formData.password.length < 6)) {
      setError("La contraseña es obligatoria y debe tener mínimo 6 caracteres");
      return;
    }

    setGuardando(true);
    try {
      await onSave(formData);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === "object") {
        const mensajes = Object.values(err.response.data).join(". ");
        setError(mensajes);
      } else {
        setError(err.response?.data?.error || "Error al procesar la solicitud");
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm modal-overlay">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden transform scale-100 transition-all duration-300">
        
        {/* Cabecera */}
        <div className="p-6 bg-surface border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              {usuario ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              {usuario ? "Modifica los datos del usuario." : "Completa los datos para el nuevo acceso."}
            </p>
          </div>
          <button
            type="button"
            className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Ana García"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* Nombre de Usuario */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Usuario * (4-20 carac.)
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="agarcia_logi"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ana.garcia@logiflow.com"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Teléfono * (9 dígitos)
              </label>
              <input
                type="text"
                name="telefono"
                maxLength={9}
                value={formData.telefono}
                onChange={handleChange}
                placeholder="987654321"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Rol Asignado */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Rol Asignado *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="OPERADOR">OPERADOR</option>
                <option value="REPARTIDOR">REPARTIDOR</option>
              </select>
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                {usuario ? "Nueva Contraseña (Opcional)" : "Contraseña Temporal *"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={usuario ? "Dejar en blanco para no cambiar" : "••••••"}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* Estado del Usuario (Solo al editar) */}
          {usuario && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase">
                Estado *
              </label>
              <select
                name="estadoUsuario"
                value={formData.estadoUsuario}
                onChange={handleChange}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2 text-sm outline-none"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className={`px-6 py-2.5 rounded-lg font-bold text-on-primary transition-all shadow-md cursor-pointer ${
                guardando ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:opacity-90"
              }`}
            >
              {guardando ? "GUARDANDO..." : usuario ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoUsuarioModal;
