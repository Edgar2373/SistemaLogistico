function LoadingSpinner({ texto = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-on-surface-variant">{texto}</p>
    </div>
  );
}

export default LoadingSpinner;
