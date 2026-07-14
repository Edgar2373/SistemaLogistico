package com.example.Proyecto.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "repartidor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Repartidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_repartidor")
    private Integer idRepartidor;

    @Column(name = "licencia", length = 50)
    private String licencia;

    @Column(name = "estado_repartidor", nullable = false, length = 50)
    private String estadoRepartidor;

    @Column(name = "rendimiento_promedio")
    private Double rendimientoPromedio;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"passwordHash", "rol", "usuario", "email", "telefono", "estadoUsuario"})
    private Usuario usuario;

}