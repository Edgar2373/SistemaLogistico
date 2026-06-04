
package com.example.Proyecto.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @GetMapping("/api/admin/test")
    public String admin(){

        return "SOLO ADMIN";
    }
}
