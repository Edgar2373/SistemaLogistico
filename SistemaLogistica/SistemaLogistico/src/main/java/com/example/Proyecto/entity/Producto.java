package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(
            max = 100,
            message = "El nombre no debe superar 100 caracteres"
    )
    @Column(name = "nombre_producto", nullable = false, length = 100)
    private String nombreProducto;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(name = "precio")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Positive(message = "El stock debe ser mayor a 0")
    @Column(name = "stock")
    private Integer stock;

    @NotNull(message = "La categoría es obligatoria")
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

}