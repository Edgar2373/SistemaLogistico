import { useState, useEffect } from "react";
import UsuariosHeader from "../../components/usuarios/UsuariosHeader";
import StatsSection from "../../components/usuarios/StatsSection";
import UsuariosTable from "../../components/usuarios/UsuariosTable";
import NuevoUsuarioModal from "../../components/usuarios/NuevoUsuarioModal";
import ConfirmDeleteModal from "../../components/usuarios/ConfirmDeleteModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../../services/usuarioService";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCargar, setErrorCargar] = useState("");

  const [roleFilter, setRoleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Alertas
  const [alerta, setAlerta] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const mostrarAlerta = (mensaje, tipo = "success") => {
    setAlerta({ mostrar: true, mensaje, tipo });
    setTimeout(() => {
      setAlerta({ mostrar: false, mensaje: "", tipo: "" });
    }, 3000);
  };

  // Cargar usuarios de la API
  const cargarUsuarios = async () => {
    setCargando(true);
    setErrorCargar("");
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setErrorCargar("Error al conectar con el servidor para cargar usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter((usr) => {
    // Normalizar estados para evitar discrepancias de mayúsculas/minúsculas ("Activo" vs "ACTIVO")
    const estado = (usr.estadoUsuario || "").toUpperCase();

    // Filtrado por rol
    const cumpleRol = roleFilter ? usr.rol === roleFilter : true;

    // Filtrado por búsqueda
    const query = searchQuery.toLowerCase();
    const cumpleBusqueda =
      (usr.nombre || "").toLowerCase().includes(query) ||
      (usr.usuario || "").toLowerCase().includes(query) ||
      (usr.email || "").toLowerCase().includes(query) ||
      (usr.idUsuario || "").toString().includes(query);

    return cumpleRol && cumpleBusqueda;
  });

  // Estadísticas calculadas dinámicamente desde el backend
  const total = usuarios.length;
  const activos = usuarios.filter((u) => (u.estadoUsuario || "").toUpperCase() === "ACTIVO" || (u.estadoUsuario || "") === "Activo").length;
  const inactivos = usuarios.filter((u) => (u.estadoUsuario || "").toUpperCase() === "INACTIVO" || (u.estadoUsuario || "") === "Inactivo").length;
  const pendientes = usuarios.filter((u) => (u.estadoUsuario || "").toUpperCase() === "PENDIENTE" || (u.estadoUsuario || "") === "Pendiente").length;

  // Handlers para abrir modales
  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usr) => {
    setSelectedUser(usr);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (usr) => {
    setSelectedUser(usr);
    setIsDeleteOpen(true);
  };

  // Guardar usuario (Crear o Editar)
  const handleSaveUser = async (data) => {
    if (selectedUser) {
      // Editar: PUT /usuarios/{id}
      // Se mantiene el passwordHash original para no resetear la contraseña
      await updateUsuario(selectedUser.idUsuario, {
        nombre: data.nombre,
        usuario: data.usuario,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol,
        estadoUsuario: data.estadoUsuario,
        passwordHash: selectedUser.passwordHash
      });
      mostrarAlerta("Usuario actualizado correctamente");
    } else {
      // Crear: POST /api/auth/register
      await createUsuario({
        nombre: data.nombre,
        usuario: data.usuario,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol,
        password: data.password
      });
      mostrarAlerta("Usuario creado correctamente");
    }
    await cargarUsuarios();
    setIsModalOpen(false);
  };

  // Eliminar usuario: DELETE /usuarios/{id}
  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUsuario(selectedUser.idUsuario);
        mostrarAlerta("Usuario eliminado correctamente", "danger");
        await cargarUsuarios();
      } catch (err) {
        console.error(err);
        mostrarAlerta("Error al intentar eliminar el usuario", "danger");
      }
    }
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Alerta flotante */}
      {alerta.mostrar && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${alerta.tipo === "danger"
            ? "bg-red-50 border-red-300 text-red-700"
            : "bg-green-50 border-green-300 text-green-700"
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {alerta.tipo === "danger" ? "error" : "check_circle"}
            </span>
            <span className="font-semibold text-sm">{alerta.mensaje}</span>
          </div>
        </div>
      )}

      {/* Cabecera */}
      <UsuariosHeader
        onAddClick={handleOpenAdd}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Grid de Estadísticas */}
      <StatsSection
        total={total}
        activos={activos}
        inactivos={inactivos}
        pendientes={pendientes}
      />

      {/* Barra de Búsqueda Secundaria */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex items-center gap-3">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por ID, nombre, usuario o correo..."
          className="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-on-surface outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-outline hover:text-on-surface cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Vista Principal / Carga / Error */}
      {cargando ? (
        <LoadingSpinner />
      ) : errorCargar ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center">
          <p className="font-semibold">{errorCargar}</p>
          <button
            onClick={cargarUsuarios}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Reintentar Conexión
          </button>
        </div>
      ) : (
        <UsuariosTable
          usuarios={usuariosFiltrados}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modal Nuevo / Editar */}
      <NuevoUsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        usuario={selectedUser}
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        usuario={selectedUser}
      />
    </div>
  );
}

export default Usuarios;
