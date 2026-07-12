export const ESTADOS_PEDIDO = {
  PENDIENTE: "PENDIENTE",
  EN_RUTA: "EN_RUTA",
  ENTREGADO: "ENTREGADO",
  CANCELADO: "CANCELADO",
};

export const COLORES_ESTADO = {
  PENDIENTE: "bg-[#FFA000]/10 text-[#FFA000]",
  EN_RUTA: "bg-[#1976D2]/10 text-[#1976D2]",
  ENTREGADO: "bg-[#43A047]/10 text-[#43A047]",
  CANCELADO: "bg-[#E53935]/10 text-[#E53935]",
};

export const METODOS_PAGO = [
  "Efectivo",
  "Transferencia",
  "Yape",
  "Plin",
  "Tarjeta",
];

export const ESTADOS_PAGO = ["Pendiente", "Pagado"];

export const ESTADOS_REPARTIDOR = ["DISPONIBLE", "OCUPADO", "INACTIVO"];

export const ESTADOS_VEHICULO = ["ACTIVO", "EN_MANTENIMIENTO", "INACTIVO"];

export const CATEGORIAS_DEFAULT = [
  "Laptops",
  "Monitores",
  "Periféricos",
  "Redes",
  "Impresoras",
  "Almacenamiento",
  "Accesorios",
];

export const EMPRESA_CONFIG = {
  nombre: import.meta.env.VITE_EMPRESA_NOMBRE || "Logiflow SAC",
  direccion: import.meta.env.VITE_EMPRESA_DIRECCION || "Av. Principal 123, Lima",
  telefono: import.meta.env.VITE_EMPRESA_TELEFONO || "+51 999 888 777",
  ctaBancaria: import.meta.env.VITE_EMPRESA_CTA_BANCARIA || "123-456-789",
  yape: import.meta.env.VITE_EMPRESA_YAPE || "999888777",
  plin: import.meta.env.VITE_EMPRESA_PLIN || "999888777",
};
