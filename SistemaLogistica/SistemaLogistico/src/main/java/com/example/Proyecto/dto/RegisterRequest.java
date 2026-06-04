
package com.example.Proyecto.dto;

import com.example.Proyecto.enums.Rol;
import lombok.Data;

@Data
public class RegisterRequest {

    private String nombre;
    private String telefono;
    private String usuario;
    private String email;
    private String password;
    private Rol rol;
}
