
package com.example.Proyecto.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String rol;
    private String nombre;
    private Integer idUsuario;
    private Integer repartidorId;
}