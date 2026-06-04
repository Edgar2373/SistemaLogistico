package com.example.Proyecto.entity;

import com.example.Proyecto.enums.Rol;
import jakarta.persistence.*;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100,
            message = "El nombre no debe superar 100 caracteres")
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(
            regexp = "^[0-9]{9}$",
            message = "El teléfono debe tener 9 dígitos"
    )
    @Column(name = "telefono", nullable = false, length = 15)
    private String telefono;

    @NotBlank(message = "El usuario es obligatorio")
    @Size(
            min = 4,
            max = 20,
            message = "El usuario debe tener entre 4 y 20 caracteres"
    )
    @Column(name = "usuario", nullable = false, length = 50)
    private String usuario;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Correo inválido")
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(
            min = 6,
            message = "La contraseña debe tener mínimo 6 caracteres"
    )
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @NotNull
    @Column(name = "rol", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Rol rol;

    @NotBlank(message = "El estado del usuario es obligatorio")
    @Column(name = "estado_usuario", nullable = false, length = 50)
    private String estadoUsuario;

}