import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir al login después del registro
import { register } from "../../services/authService";

export default function Registro() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");          // Errores del backend
  const [exito, setExito] = useState("");          // Mensaje de éxito
  const [cargando, setCargando] = useState(false); // Estado de carga

  const navigate = useNavigate(); // Hook para navegar

  // Estado del formulario con todos los campos
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    usuario: "",
    email: "",
    password: "",
    rol: ""
  });

  // Actualizar campo del formulario cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    // === VALIDACIONES EN FRONTEND ===

    // Validar que todos los campos estén llenos
    if (!formData.nombre || !formData.telefono || !formData.usuario || 
        !formData.email || !formData.password || !formData.rol) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validar teléfono: exactamente 9 dígitos
    if (!/^\d{9}$/.test(formData.telefono)) {
      setError("El teléfono debe tener exactamente 9 dígitos");
      return;
    }

    // Validar email: formato válido
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    // Validar contraseña: mínimo 6 caracteres
    if (formData.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      // Llamar al servicio de registro
      await register(formData);

      // Si todo sale bien, mostrar mensaje y redirigir al login
      setExito("Cuenta creada correctamente. Redirigiendo al login...");
      
      // Esperar 2 segundos y redirigir al login
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // El backend retorna errores de validación como un mapa: { nombre: "mensaje", telefono: "mensaje" }
      if (err.response?.data && typeof err.response.data === "object") {
        // Unir todos los mensajes de error en uno solo
        const mensajes = Object.values(err.response.data).join(". ");
        setError(mensajes);
      } else {
        const mensaje = err.response?.data?.error || "Error al registrar usuario";
        setError(mensaje);
      }
    } finally {
      setCargando(false);
    }
  };

  // Calcular fortaleza de la contraseña para la barra visual
  const calcularFortaleza = () => {
    const pass = formData.password;
    if (pass.length < 6) return 25;
    if (pass.length >= 8 && /[A-Z]/.test(pass)) return 66;
    if (pass.length >= 10 && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) return 100;
    return 40;
  };

  const fortaleza = calcularFortaleza();

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">

      <main className="w-full max-w-[1100px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row">

        {/* PANEL IZQUIERDO - Imagen decorativa */}
        <section className="hidden md:flex md:w-5/12 bg-slate-900 text-white p-10 flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-blue-400 text-5xl">
                local_shipping
              </span>
              <h1 className="text-3xl font-bold">
                LogiFlow
              </h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-5">
              Optimice su cadena de suministro hoy.
            </h2>
            <p className="text-slate-300">
              Únase a la red logística más eficiente y
              gestione su flota con precisión en tiempo real.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1553413077-190dd305871c"
            alt="Dashboard"
            className="rounded-xl h-64 object-cover"
          />
        </section>

        {/* FORMULARIO DE REGISTRO */}
        <section className="w-full md:w-7/12 p-8 md:p-12">
          <div className="max-w-md mx-auto">

            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-800">
                Crear cuenta nueva
              </h3>
              <p className="text-slate-500 mt-2">
                Complete los datos para registrarse.
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {exito && (
              <div className="bg-green-50 border border-green-300 text-green-700 text-sm rounded-lg p-3 mb-4">
                {exito}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NOMBRE COMPLETO */}
              <div>
                <label htmlFor="nombre" className="block text-xs font-bold text-slate-500 mb-2">
                  NOMBRE COMPLETO *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* TELÉFONO + USUARIO */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    TELÉFONO * (9 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="987654321"
                    className="w-full border rounded-lg p-3"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    USUARIO * (4-20 caracteres)
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    placeholder="jperez"
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@gmail.com"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* CONTRASEÑA + ROL */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    CONTRASEÑA * (mín. 6)
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      className="absolute right-3 top-3"
                    >
                      <span className="material-symbols-outlined">
                        {mostrarPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {/* Barra de fortaleza de contraseña */}
                  <div className="w-full h-2 bg-slate-200 rounded mt-2">
                    <div
                      className={`h-2 rounded transition-all ${
                        fortaleza < 40 ? "bg-red-500" : fortaleza < 80 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${fortaleza}%` }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">
                    ROL *
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">Seleccione...</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OPERADOR">OPERADOR</option>
                    <option value="REPARTIDOR">REPARTIDOR</option>
                  </select>
                </div>
              </div>

              {/* BOTÓN DE REGISTRO */}
              <button
                type="submit"
                disabled={cargando}
                className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 ${
                  cargando
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {cargando ? "CREANDO CUENTA..." : "CREAR CUENTA"}
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>

            </form>

            {/* Link para volver al login */}
            <div className="text-center mt-8">
              <p className="text-slate-500">
                ¿Ya tienes una cuenta?
              </p>
              <a
                href="/login"
                className="text-blue-600 font-bold"
              >
                VOLVER AL LOGIN
              </a>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}