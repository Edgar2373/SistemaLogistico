import api from "../api/axiosConfig";

export const getRutas = async () => {
  const response = await api.get("/rutas");
  return response.data;
};

export const crearRuta = async (datos) => {
  const response = await api.post("/rutas", datos);
  return response.data;
};

export const actualizarRuta = async (id, datos) => {
  const response = await api.put(`/rutas/${id}`, datos);
  return response.data;
};

export const eliminarRuta = async (id) => {
  await api.delete(`/rutas/${id}`);
};
