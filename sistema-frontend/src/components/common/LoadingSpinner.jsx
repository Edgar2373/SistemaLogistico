function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-on-surface-variant mt-4 font-semibold">Cargando datos...</p>
    </div>
  );
}

export default LoadingSpinner;
