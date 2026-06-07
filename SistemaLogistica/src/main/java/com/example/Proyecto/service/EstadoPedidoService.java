package com.example.Proyecto.service;

import com.example.Proyecto.entity.EstadoPedido;

import java.util.List;

public interface EstadoPedidoService {

    List<EstadoPedido> listar();

    EstadoPedido guardar(EstadoPedido estadoPedido);

    EstadoPedido buscarPorId(Integer id);

    EstadoPedido actualizar(Integer id,
                            EstadoPedido estadoPedido);

    void eliminar(Integer id);

}