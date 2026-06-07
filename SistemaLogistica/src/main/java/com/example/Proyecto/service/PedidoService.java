package com.example.Proyecto.service;

import com.example.Proyecto.entity.Pedido;
import java.time.LocalDate;

import java.util.List;

public interface PedidoService {

    List<Pedido> listar();

    Pedido guardar(Pedido pedido);

    Pedido buscarPorId(Integer id);

    Pedido actualizar(Integer id, Pedido pedido);

    void eliminar(Integer id);
    

    // JPQL
    List<Pedido> buscarPedidosPorEstado(String estado);

    List<Pedido> buscarPedidosPorRepartidor(Integer idRepartidor);

    List<Pedido> buscarPedidosEntreFechas(
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

    Pedido registrarPedidoCompleto(Pedido pedido);

}
