import api from "../api/axiosConfig";

export const getPedidos = async () => {
  const response = await api.get("/pedidos");
  return response.data;
};

export const getPedidosPorEstado = async (estado) => {
  const response = await api.get(`/pedidos/estado/${estado}`);
  return response.data;
};

export const getProductos = async () => {
  const response = await api.get("/productos");
  return response.data;
};

export const getClientes = async () => {
  const response = await api.get("/clientes");
  return response.data;
};

export const getRepartidores = async () => {
  const response = await api.get("/repartidores");
  return response.data;
};

export const getVehiculos = async () => {
  const response = await api.get("/vehiculos");
  return response.data;
};

export const getBoletas = async () => {
  const response = await api.get("/boletas");
  return response.data;
};

export const getDetallesPedido = async () => {
  const response = await api.get("/detalle-pedido");
  return response.data;
};
