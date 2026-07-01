import { useState, useEffect } from "react";
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../../services/usuarioService";
import UsuariosHeader from "../../components/usuarios/UsuariosHeader";
import StatsSection from "../../components/usuarios/StatsSection";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import NuevoUsuarioModal from "../../components/usuarios/NuevoUsuarioModal";
import EditarUsuarioModal from "../../components/usuarios/EditarUsuarioModal";
import ConfirmDeleteModal from "../../components/usuarios/ConfirmDeleteModal";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroRol, setFiltroRol] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Modales
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      setTotalPaginas(Math.ceil(data.length / 10));
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

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
  const activos = usuarios.filter((u) => u.estadoUsuario === "ACTIVO").length;
  const inactivos = usuarios.filter((u) => u.estadoUsuario !== "ACTIVO").length;
  const pendientes = 0;


  // CREAR
  const handleGuardarNuevo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nuevoUsuario = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      usuario: formData.get("usuario"),
      email: formData.get("email"),
      passwordHash: formData.get("password"),
      rol: formData.get("rol"),
      estadoUsuario: "ACTIVO",
    };
    try {
      await crearUsuario(nuevoUsuario);
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
      estadoUsuario: formData.get("estadoUsuario"),
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

  // ELIMINAR
  const handleEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarUsuario(usuarioSeleccionado.idUsuario);
      setModalEliminar(false);
      setUsuarioSeleccionado(null);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar:", error);
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
        onEliminar={handleEliminar}
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

      <ConfirmDeleteModal
        visible={modalEliminar}
        onClose={() => { setModalEliminar(false); setUsuarioSeleccionado(null); }}
        onConfirmar={confirmarEliminar}
        nombreUsuario={usuarioSeleccionado?.nombre || ""}
      />
    </>
  );
}

export default Usuarios;