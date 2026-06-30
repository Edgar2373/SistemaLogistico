import api from "../api/axiosConfig";

// Obtener todos los repartidores
// GET /repartidores
export const getRepartidores = async () => {
  const response = await api.get("/repartidores");
  return response.data;
};

// Obtener un repartidor por ID
// GET /repartidores/{id}
export const getRepartidorById = async (id) => {
  const response = await api.get(`/repartidores/${id}`);
  return response.data;
};

// Crear repartidor
// POST /repartidores
export const createRepartidor = async (repartidorData) => {
  const response = await api.post("/repartidores", {
    licencia: repartidorData.licencia,
    estadoRepartidor: repartidorData.estadoRepartidor,
    rendimientoPromedio: Number(repartidorData.rendimientoPromedio || 0)
  });
  return response.data;
};

// Actualizar repartidor
// PUT /repartidores/{id}
export const updateRepartidor = async (id, repartidorData) => {
  const response = await api.put(`/repartidores/${id}`, {
    idRepartidor: id,
    licencia: repartidorData.licencia,
    estadoRepartidor: repartidorData.estadoRepartidor,
    rendimientoPromedio: Number(repartidorData.rendimientoPromedio || 0)
  });
  return response.data;
};

// Eliminar repartidor
// DELETE /repartidores/{id}
export const deleteRepartidor = async (id) => {
  const response = await api.delete(`/repartidores/${id}`);
  return response.data;
};
