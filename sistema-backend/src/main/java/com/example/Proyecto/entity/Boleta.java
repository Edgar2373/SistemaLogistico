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
@Table(name = "boleta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Integer idBoleta;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "total")
    private Double total;

    @OneToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

}