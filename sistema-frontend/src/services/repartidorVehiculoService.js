import api from "../api/axiosConfig";

export const getAsignaciones = async () => {
  const response = await api.get("/repartidor-vehiculo");
  return response.data;
};

export const crearAsignacion = async (datos) => {
  const response = await api.post("/repartidor-vehiculo", datos);
  return response.data;
};

export const actualizarAsignacion = async (id, datos) => {
  const response = await api.put(`/repartidor-vehiculo/${id}`, datos);
  return response.data;
};

export const eliminarAsignacion = async (id) => {
  await api.delete(`/repartidor-vehiculo/${id}`);
};
