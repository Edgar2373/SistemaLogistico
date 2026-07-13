package com.example.Proyecto.dto;

import com.example.Proyecto.enums.Rol;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioUpdateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe tener 9 dígitos")
    private String telefono;

    @NotBlank(message = "El usuario es obligatorio")
    @Size(min = 4, max = 20, message = "El usuario debe tener entre 4 y 20 caracteres")
    private String usuario;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Correo inválido")
    private String email;

    private String passwordHash;

    @NotNull
    private Rol rol;

    @NotBlank(message = "El estado del usuario es obligatorio")
    private String estadoUsuario;
}
