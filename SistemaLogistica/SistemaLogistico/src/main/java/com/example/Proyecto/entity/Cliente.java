package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(
        regexp = "^[0-9]{9}$",
        message = "El teléfono debe tener 9 dígitos"
    )
    @Column(name = "telefono", nullable = false, length = 15)
    private String telefono;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(name = "direccion_principal", nullable = false, length = 200)
    private String direccionPrincipal;

}