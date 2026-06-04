
package com.example.Proyecto.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OperadorController {

    @GetMapping("/api/operador/test")
    public String operador(){

        return "ADMIN Y OPERADOR";
    }
}