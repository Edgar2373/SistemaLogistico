package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @NotNull(message = "La fecha de registro es obligatoria")
    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    @NotNull(message = "La hora de salida es obligatoria")
    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @NotNull(message = "La hora de entrega es obligatoria")
    @Column(name = "hora_entrega")
    private LocalTime horaEntrega;

    @Column(name = "tiempo_estimado_entrega")
    private Integer tiempoEstimadoEntrega;

    @Column(name = "tiempo_real_entrega")
    private Integer tiempoRealEntrega;

    @NotNull(message = "El costo de envío es obligatorio")
    @Positive(message = "Debe ser mayor a 0")
    @Column(name = "costo_envio")
    private BigDecimal costoEnvio;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(name = "direccion_entrega", length = 200)
    private String direccionEntrega;

    @NotNull(message = "El orden en ruta es obligatorio")
    @Positive(message = "Debe ser mayor a 0")
    @Column(name = "orden_en_ruta")
    private Integer ordenEnRuta;

    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @NotNull(message = "El usuario es obligatorio")
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @NotNull(message = "El repartidor es obligatorio")
    @ManyToOne
    @JoinColumn(name = "id_repartidor")
    private Repartidor repartidor;

    @NotNull(message = "La ruta es obligatoria")
    @ManyToOne
    @JoinColumn(name = "id_ruta")
    private Ruta ruta;

    @NotNull(message = "El estado del pedido es obligatorio")
    @ManyToOne
    @JoinColumn(name = "id_estado")
    private EstadoPedido estadoPedido;

    @Transient
    private java.util.List<DetallePedido> detalles = new java.util.ArrayList<>();

}