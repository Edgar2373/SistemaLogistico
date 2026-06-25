import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir según el rol
import { login } from "../../services/authService";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");          // Mensaje de error del backend
  const [cargando, setCargando] = useState(false); // Estado de carga del botón

  const navigate = useNavigate(); // Hook para navegar entre rutas

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");       // Limpiar error anterior
    setCargando(true);  // Activar estado de carga

    try {
      // Llamar al servicio de login
      const data = await login(usuario, password);

      // Guardar datos del usuario en localStorage
      localStorage.setItem("token", data.token);     // Token JWT para auth
      localStorage.setItem("rol", data.rol);          // Rol: ADMIN, OPERADOR, REPARTIDOR
      localStorage.setItem("nombre", data.nombre);    // Nombre para mostrar en navbar
      localStorage.setItem("idUsuario", data.idUsuario); // ID para consultas

      // Redirigir según el rol del usuario
      if (data.rol === "ADMIN" || data.rol === "OPERADOR") {
        navigate("/admin");      // Admin y Operador van al mismo panel
      } else if (data.rol === "REPARTIDOR") {
        navigate("/repartidor"); // Repartidor va a su panel específico
      }

    } catch (err) {
      // Obtener el mensaje de error real del backend
      // Si el backend retorna { error: "mensaje" }, lo muestra
      // Si no hay respuesta (servidor caído), muestra mensaje genérico
      const mensaje = err.response?.data?.error || "Error al conectar con el servidor";
      setError(mensaje);
    } finally {
      setCargando(false); // Siempre desactivar carga, éxito o error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 relative overflow-hidden p-4">
      
      {/* Fondos decorativos */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-blue-200 blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-cyan-200 blur-[100px] opacity-40"></div>

      <main className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <span className="material-symbols-outlined text-[56px] text-blue-600">
            local_shipping
          </span>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-2">
            LogiFlow
          </h1>
          <p className="text-gray-500 mt-1">
            Fleet Management Excellence
          </p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Bienvenido
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Introduce tus credenciales para acceder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Campo Usuario */}
            <div>
              <label htmlFor="usuario" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Usuario
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                  person
                </span>
                <input
                  id="usuario"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">
                  lock
                </span>
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined">
                    {mostrarPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mensaje de error - solo se muestra si hay error */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              disabled={cargando} // Deshabilitar mientras carga
              className={`w-full font-bold py-4 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md ${
                cargando
                  ? "bg-blue-400 cursor-not-allowed"   // Estilo cuando está cargando
                  : "bg-blue-600 hover:bg-blue-700"    // Estilo normal
              } text-white`}
            >
              {cargando ? "ACCEDIENDO..." : "ACCEDER AL SISTEMA"}
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>

          </form>

          {/* Footer - Link a registro */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              ¿No tienes una cuenta?
            </p>
            <a
              href="/registro"
              className="block mt-2 text-blue-600 font-bold uppercase tracking-wider hover:text-blue-800"
            >
              Crear Cuenta
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2026 LogiFlow Fleet Management
          </p>
        </div>

      </main>
    </div>
  );
}