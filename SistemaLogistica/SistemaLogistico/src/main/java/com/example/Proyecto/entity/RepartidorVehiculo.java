package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "repartidor_vehiculo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepartidorVehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Integer idAsignacion;

    @Column(name = "fecha_asignacion")
    private LocalDate fechaAsignacion;

    @Column(name = "estado_asignacion", length = 50)
    private String estadoAsignacion;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_repartidor")
    private Repartidor repartidor;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;

}