package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private Integer idVehiculo;

    @Column(name = "tipo", nullable = false, length = 50)
    private String tipo;

    @Column(name = "placa", nullable = false, length = 20)
    private String placa;

    @Column(name = "estado_vehiculo", nullable = false, length = 50)
    private String estadoVehiculo;

}