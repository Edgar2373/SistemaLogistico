package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Repartidor;
import com.example.Proyecto.service.RepartidorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/repartidores")
public class RepartidorController {

    @Autowired
    private RepartidorService repartidorService;

    @GetMapping
    public List<Repartidor> listar() {
        return repartidorService.listar();
    }

    @PostMapping
    public Repartidor guardar(
            @RequestBody Repartidor repartidor) {

        return repartidorService.guardar(repartidor);
    }

    @GetMapping("/{id}")
    public Repartidor buscarPorId(
            @PathVariable Integer id) {

        return repartidorService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Repartidor actualizar(
            @PathVariable Integer id,
            @RequestBody Repartidor repartidor) {

        return repartidorService.actualizar(
                id,
                repartidor);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {

        repartidorService.eliminar(id);
    }
    
    
    //PRUEBA
    @GetMapping("/api/repartidor/test")
    public String repartidor(){

        return "SOLO REPARTIDOR";
    }

}