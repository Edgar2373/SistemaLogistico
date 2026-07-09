package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ruta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Integer idRuta;

    @Column(name = "nombre_ruta", nullable = false, length = 100)
    private String nombreRuta;

    @Column(name = "distancia_km")
    private Double distanciaKm;

    @ManyToOne
    @JoinColumn(name = "id_zona")
    private Zona zona;

}