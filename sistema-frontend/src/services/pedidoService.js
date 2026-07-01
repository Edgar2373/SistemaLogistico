import api from "../api/axiosConfig";

// Obtener todos los pedidos
// GET /pedidos
export const getPedidos = async () => {
    const response = await api.get("/pedidos");
    return response.data;
};

// Obtener pedidos asignados a un repartidor
// GET /pedidos/repartidor/{id}
export const getPedidosByRepartidor = async (idRepartidor) => {
    const response = await api.get(`/pedidos/repartidor/${idRepartidor}`);
    return response.data;
};

// Obtener pedidos por estado
// GET /pedidos/estado/{estado}
export const getPedidosByEstado = async (estado) => {
    const response = await api.get(`/pedidos/estado/${estado}`);
    return response.data;
};