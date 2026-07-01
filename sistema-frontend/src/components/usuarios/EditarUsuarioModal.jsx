function EditarUsuarioModal({ visible, onClose, onGuardar, usuario }) {
  if (!visible || !usuario) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-4 modal-overlay">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 sm:px-9 sm:py-6 bg-surface border-b border-outline-variant flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-on-surface">Editar Usuario</h3>
            <p className="text-sm font-medium text-on-surface-variant">Modifica los datos del usuario.</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-variant rounded-full p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={onGuardar} className="px-5 py-4 sm:px-9 sm:py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Nombre Completo</label>
              <input
                name="nombre"
                defaultValue={usuario.nombre}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                type="text"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Nombre de Usuario</label>
              <input
                name="usuario"
                defaultValue={usuario.usuario}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                type="text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-sm text-on-surface-variant">Correo Electrónico</label>
            <input
              name="email"
              defaultValue={usuario.email}
              className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
              type="email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Rol Asignado</label>
              <select
                name="rol"
                defaultValue={usuario.rol}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
              >
                <option value="ADMIN">Administrador</option>
                <option value="OPERADOR">Operador</option>
                <option value="REPARTIDOR">Repartidor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Contraseña (dejar vacío para no cambiar)</label>
              <input
                name="password"
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Teléfono (9 dígitos)</label>
              <input
                name="telefono"
                defaultValue={usuario.telefono}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
                type="text"
                maxLength={9}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm text-on-surface-variant">Estado</label>
              <select
                name="estadoUsuario"
                defaultValue={usuario.estadoUsuario}
                className="w-full border border-outline-variant rounded-lg focus:ring-primary focus:border-primary px-3 py-2"
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 sm:gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 sm:px-6 rounded-lg font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 sm:px-6 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 transition-all shadow-md">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarUsuarioModal;