package com.example.Proyecto.service;

import com.example.Proyecto.entity.DetallePedido;

import java.util.List;

public interface DetallePedidoService {

    List<DetallePedido> listar();

    DetallePedido guardar(DetallePedido detallePedido);

    DetallePedido buscarPorId(Integer id);

    DetallePedido actualizar(Integer id, DetallePedido detallePedido);

    void eliminar(Integer id);

}