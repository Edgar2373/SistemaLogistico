function TopBar() {
  const nombre = localStorage.getItem("nombre") || "Admin User";

  return (
    <header className="h-16 w-full px-lg flex justify-between items-center bg-surface border-b border-outline-variant sticky top-0 z-40">

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary"
            placeholder="Buscar pedidos, conductores..."
            type="text"
          />
        </div>
      </div>

      {/* Acciones derecha */}
      <div className="flex items-center gap-xl">
        <div className="flex gap-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
            notifications
          </button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
            apps
          </button>
        </div>

        {/* Avatar usuario */}
        <div className="flex items-center gap-sm cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-on-surface">{nombre}</p>
            <p className="text-[10px] text-outline">Super Admin</p>
          </div>
          <img
            className="w-10 h-10 rounded-full border-2 border-primary-fixed"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4I95JPDqYypD8xv7jFzeI_doJfNI5T5shNY7JGYcjFx2Ls1lkOR_tGScm81KyD1zQI1bF0GEVmDXHLj0p06Erc2SGmUkC0tMPxxfFdqvRlS9qPBFDxxaqcRZxVQg4hLr12grwek7PWbQyql1urpoBjaUBA6jSHiH30Vg5vmyzwA8rMbVxLc0AqU5M-sZ3yaFMgRYWu7tc9uC-j0cj7NfunpdukyBOhO1lXfDpUPsy24W_mEgq5wCLbSSkdnUnACCLLVfwlxJ-0sFM"
            alt="Avatar"
          />
        </div>
      </div>

    </header>
  );
}

export default TopBar;
