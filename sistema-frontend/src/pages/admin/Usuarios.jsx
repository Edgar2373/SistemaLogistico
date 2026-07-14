/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getUsuarios, crearUsuario, actualizarUsuario } from "../../services/usuarioService";
import { crearRepartidor } from "../../services/repartidorService";
import UsuariosHeader from "../../components/usuarios/UsuariosHeader";
import StatsSection from "../../components/usuarios/StatsSection";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import NuevoUsuarioModal from "../../components/usuarios/NuevoUsuarioModal";
import EditarUsuarioModal from "../../components/usuarios/EditarUsuarioModal";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Modales
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      setTotalPaginas(Math.ceil(data.length / 10));
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrar por rol
  const usuariosFiltrados = filtroRol
    ? usuarios.filter((u) => u.rol === filtroRol)
    : usuarios;

  // Paginación
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * 10,
    paginaActual * 10
  );

  // Estadísticas
  const total = usuarios.length;
  const repartidores = usuarios.filter((u) => u.rol === "REPARTIDOR");
  const activos = repartidores.filter((u) => u.estadoUsuario === "OPERATIVO").length;
  const inactivos = repartidores.filter((u) => u.estadoUsuario !== "OPERATIVO").length;
  const pendientes = 0;


  // CREAR
  const handleGuardarNuevo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rol = formData.get("rol");
    const nuevoUsuario = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      usuario: formData.get("usuario"),
      email: formData.get("email"),
      passwordHash: formData.get("password"),
      rol,
      estadoUsuario: "OPERATIVO",
    };
    try {
      const usuarioCreado = await crearUsuario(nuevoUsuario);
      if (rol === "REPARTIDOR") {
        const licencia = formData.get("licencia");
        await crearRepartidor({
          licencia,
          estadoRepartidor: "DISPONIBLE",
          rendimientoPromedio: 0,
          usuario: { idUsuario: usuarioCreado.idUsuario }
        });
      }
      setModalNuevo(false);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  // EDITAR — abre modal con datos del usuario
  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditar(true);
  };

  // ACTUALIZAR — envía PUT al backend
  const handleActualizar = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datosActualizados = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      usuario: formData.get("usuario"),
      email: formData.get("email"),
      rol: formData.get("rol"),
      estadoUsuario: formData.get("estadoUsuario") || "OPERATIVO",
    };
    // Solo incluir contraseña si se escribió una nueva
    const password = formData.get("password");
    if (password && password.trim() !== "") {
      datosActualizados.passwordHash = password;
    }
    try {
      await actualizarUsuario(usuarioSeleccionado.idUsuario, datosActualizados);
      setModalEditar(false);
      setUsuarioSeleccionado(null);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <>
      <UsuariosHeader
        filtroRol={filtroRol}
        setFiltroRol={setFiltroRol}
        onNuevoUsuario={() => setModalNuevo(true)}
      />

      <StatsSection total={total} activos={activos} inactivos={inactivos} pendientes={pendientes} />

      <UsuariosTable
        usuarios={usuariosPagina}
        onEditar={handleEditar}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambioPagina={setPaginaActual}
      />

      <NuevoUsuarioModal
        visible={modalNuevo}
        onClose={() => setModalNuevo(false)}
        onGuardar={handleGuardarNuevo}
      />

      <EditarUsuarioModal
        visible={modalEditar}
        onClose={() => { setModalEditar(false); setUsuarioSeleccionado(null); }}
        onGuardar={handleActualizar}
        usuario={usuarioSeleccionado}
      />

    </>
  );
}

export default Usuarios;
