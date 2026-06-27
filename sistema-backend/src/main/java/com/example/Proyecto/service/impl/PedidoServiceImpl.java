package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Pedido;
import com.example.Proyecto.entity.DetallePedido;
import com.example.Proyecto.entity.Repartidor;
import com.example.Proyecto.entity.Producto;
import com.example.Proyecto.entity.Boleta;
import com.example.Proyecto.entity.Pago;
import com.example.Proyecto.repository.PedidoRepository;
import com.example.Proyecto.repository.DetallePedidoRepository;
import com.example.Proyecto.repository.RepartidorRepository;
import com.example.Proyecto.repository.ProductoRepository;
import com.example.Proyecto.repository.BoletaRepository;
import com.example.Proyecto.repository.PagoRepository;
import com.example.Proyecto.service.PedidoService;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private RepartidorRepository repartidorRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private BoletaRepository boletaRepository;

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido guardar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Override
    public Pedido buscarPorId(Integer id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    @Override
    public Pedido actualizar(Integer id, Pedido pedido) {

        Pedido pedidoExistente = pedidoRepository.findById(id).orElse(null);

        if (pedidoExistente != null) {

            pedidoExistente.setFechaRegistro(pedido.getFechaRegistro());
            pedidoExistente.setHoraSalida(pedido.getHoraSalida());
            pedidoExistente.setHoraEntrega(pedido.getHoraEntrega());
            pedidoExistente.setTiempoEstimadoEntrega(pedido.getTiempoEstimadoEntrega());
            pedidoExistente.setTiempoRealEntrega(pedido.getTiempoRealEntrega());
            pedidoExistente.setCostoEnvio(pedido.getCostoEnvio());
            pedidoExistente.setDireccionEntrega(pedido.getDireccionEntrega());
            pedidoExistente.setOrdenEnRuta(pedido.getOrdenEnRuta());

            pedidoExistente.setCliente(pedido.getCliente());
            pedidoExistente.setUsuario(pedido.getUsuario());
            pedidoExistente.setRepartidor(pedido.getRepartidor());
            pedidoExistente.setRuta(pedido.getRuta());
            pedidoExistente.setEstadoPedido(pedido.getEstadoPedido());

            return pedidoRepository.save(pedidoExistente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        pedidoRepository.deleteById(id);
    }

    
    
    // JPQL
    @Override
    public List<Pedido> buscarPedidosPorEstado(String estado) {
        return pedidoRepository.buscarPedidosPorEstado(estado);
    }

    @Override
    public List<Pedido> buscarPedidosPorRepartidor(Integer idRepartidor) {
        return pedidoRepository.buscarPedidosPorRepartidor(idRepartidor);
    }

    @Override
    public List<Pedido> buscarPedidosEntreFechas(
            LocalDate fechaInicio,
            LocalDate fechaFin) {

        return pedidoRepository.buscarPedidosEntreFechas(
                        fechaInicio,
                        fechaFin);
    }

    @Override
    @Transactional
    public Pedido registrarPedidoCompleto(Pedido pedido) {
        // 1. Validar Repartidor
        if (pedido.getRepartidor() == null || pedido.getRepartidor().getIdRepartidor() == null) {
            throw new RuntimeException("El pedido debe tener un repartidor asignado");
        }

        Repartidor repartidor = repartidorRepository.findById(pedido.getRepartidor().getIdRepartidor())
                .orElseThrow(() -> new RuntimeException("Repartidor no encontrado"));

        if (!"DISPONIBLE".equalsIgnoreCase(repartidor.getEstadoRepartidor())) {
            throw new RuntimeException("El repartidor asignado no está DISPONIBLE");
        }

        // 2. Guardar Pedido (Cabecera)
        // Set the valid repartidor to ensure entity is updated and tracked
        pedido.setRepartidor(repartidor);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // 3. Procesar Detalles y Stock
        double totalBoleta = 0.0;
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new RuntimeException("El pedido no contiene detalles");
        }

        for (DetallePedido detalle : pedido.getDetalles()) {
            if (detalle.getProducto() == null || detalle.getProducto().getIdProducto() == null) {
                throw new RuntimeException("El detalle debe tener un producto asociado");
            }
            
            Producto producto = productoRepository.findById(detalle.getProducto().getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                    
            int nuevoStock = producto.getStock() - detalle.getCantidad();
            if (nuevoStock < 0) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombreProducto());
            }
            
            // Actualizar stock del producto
            producto.setStock(nuevoStock);
            productoRepository.save(producto);
            
            // Calcular subtotales usando el precio actual del producto
            double precioUnitario = producto.getPrecio().doubleValue();
            detalle.setPrecioUnitario(precioUnitario);
            double subtotal = detalle.getCantidad() * precioUnitario;
            detalle.setSubtotal(subtotal);
            
            // Guardar detalle
            detalle.setPedido(pedidoGuardado);
            detalle.setProducto(producto);
            detallePedidoRepository.save(detalle);
            
            totalBoleta += subtotal;
        }

        // 4. Cambiar Estado del Repartidor
        repartidor.setEstadoRepartidor("OCUPADO");
        repartidorRepository.save(repartidor);

        // 5. Comprobante y Pago
        Boleta boleta = new Boleta();
        boleta.setFechaEmision(LocalDate.now());
        boleta.setTotal(totalBoleta);
        boleta.setPedido(pedidoGuardado);
        Boleta boletaGuardada = boletaRepository.save(boleta);

        Pago pago = new Pago();
        pago.setMetodoPago("TARJETA"); // O valor por defecto
        pago.setEstadoPago("COMPLETADO");
        pago.setFechaPago(LocalDate.now());
        pago.setReferenciaTransaccion("REF-" + System.currentTimeMillis());
        pago.setBoleta(boletaGuardada);
        pagoRepository.save(pago);

        return pedidoGuardado;
    }

}
