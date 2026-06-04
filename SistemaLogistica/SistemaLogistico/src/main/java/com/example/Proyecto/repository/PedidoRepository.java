package com.example.Proyecto.repository;

import com.example.Proyecto.entity.Pedido;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    // Buscar pedidos por estado
    @Query("""
           SELECT p
           FROM Pedido p
           WHERE p.estadoPedido.nombreEstado = :estado
           """)
    List<Pedido> buscarPedidosPorEstado(
            @Param("estado") String estado);

    // Buscar pedidos por repartidor
    @Query("""
           SELECT p
           FROM Pedido p
           WHERE p.repartidor.idRepartidor = :idRepartidor
           """)
    List<Pedido> buscarPedidosPorRepartidor(
            @Param("idRepartidor") Integer idRepartidor);

    // Buscar pedidos entre fechas
    @Query("""
           SELECT p
           FROM Pedido p
           WHERE p.fechaRegistro
           BETWEEN :fechaInicio AND :fechaFin
           """)
    List<Pedido> buscarPedidosEntreFechas(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin);

}
