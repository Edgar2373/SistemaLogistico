package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.EstadoPedido;
import com.example.Proyecto.repository.EstadoPedidoRepository;
import com.example.Proyecto.service.EstadoPedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadoPedidoServiceImpl
        implements EstadoPedidoService {

    @Autowired
    private EstadoPedidoRepository estadoPedidoRepository;

    @Override
    public List<EstadoPedido> listar() {
        return estadoPedidoRepository.findAll();
    }

    @Override
    public EstadoPedido guardar(
            EstadoPedido estadoPedido) {

        return estadoPedidoRepository.save(estadoPedido);
    }

    @Override
    public EstadoPedido buscarPorId(Integer id) {

        return estadoPedidoRepository.findById(id)
                .orElse(null);
    }

    @Override
    public EstadoPedido actualizar(
            Integer id,
            EstadoPedido estadoPedido) {

        EstadoPedido existente =
                estadoPedidoRepository.findById(id)
                        .orElse(null);

        if (existente != null) {

            existente.setNombreEstado(
                    estadoPedido.getNombreEstado());

            return estadoPedidoRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        estadoPedidoRepository.deleteById(id);
    }

}