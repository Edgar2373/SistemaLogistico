

function Navbar() {

  const usuario = localStorage.getItem("usuario");

  return (
    <div className="bg-white shadow h-16 flex items-center justify-between px-6">

      <h1 className="font-bold text-xl">
        Sistema Logístico
      </h1>

      <div>
        Bienvenido: {usuario}
      </div>

    </div>
  );
}

export default Navbar;