package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.DetallePedido;
import com.example.Proyecto.repository.DetallePedidoRepository;
import com.example.Proyecto.service.DetallePedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetallePedidoServiceImpl implements DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Override
    public List<DetallePedido> listar() {
        return detallePedidoRepository.findAll();
    }

    @Override
    public DetallePedido guardar(DetallePedido detallePedido) {
        return detallePedidoRepository.save(detallePedido);
    }

    @Override
    public DetallePedido buscarPorId(Integer id) {
        return detallePedidoRepository.findById(id).orElse(null);
    }

    @Override
    public DetallePedido actualizar(Integer id, DetallePedido detallePedido) {

        DetallePedido detalleExistente =
                detallePedidoRepository.findById(id).orElse(null);

        if (detalleExistente != null) {

            detalleExistente.setCantidad(detallePedido.getCantidad());
            detalleExistente.setPrecioUnitario(detallePedido.getPrecioUnitario());
            detalleExistente.setSubtotal(detallePedido.getSubtotal());

            detalleExistente.setPedido(detallePedido.getPedido());
            detalleExistente.setProducto(detallePedido.getProducto());

            return detallePedidoRepository.save(detalleExistente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        detallePedidoRepository.deleteById(id);
    }

}