function ConfirmDeleteModal({ isOpen, onClose, onConfirm, usuario }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm modal-overlay">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 transform scale-100 transition-all duration-300 text-center">
        
        {/* Icono de advertencia */}
        <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">warning</span>
        </div>

        {/* Título y detalles */}
        <h3 className="text-xl font-bold text-on-surface">¿Eliminar usuario?</h3>
        <p className="text-sm text-on-surface-variant mt-2 mb-6">
          Esta acción es permanente y revocará inmediatamente todos los accesos de{" "}
          <span className="font-bold text-on-surface">{usuario?.nombre || "este usuario"}</span> al sistema LogiFlow.
        </p>

        {/* Acciones */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            Confirmar Eliminación
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Mantener Usuario
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
