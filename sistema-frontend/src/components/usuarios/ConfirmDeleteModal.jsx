function ConfirmDeleteModal({ visible, onClose, onConfirmar, nombreUsuario }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 modal-overlay">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-6 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-4xl">warning</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">¿Eliminar usuario?</h3>
        <p className="text-base text-on-surface-variant mt-2 mb-2">
          Esta acción es permanente y revocará inmediatamente todos los accesos de <strong>{nombreUsuario}</strong> al sistema LogiFlow.
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={onConfirmar} className="w-full py-3 rounded-lg font-bold bg-error text-on-error hover:opacity-90 transition-all">
            Confirmar Eliminación
          </button>
          <button onClick={onClose} className="w-full py-3 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
            Mantener Usuario
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;