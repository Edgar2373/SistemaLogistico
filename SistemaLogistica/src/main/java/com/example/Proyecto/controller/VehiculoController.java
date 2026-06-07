package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Vehiculo;
import com.example.Proyecto.service.VehiculoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
@CrossOrigin("*")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @GetMapping
    public List<Vehiculo> listar() {
        return vehiculoService.listar();
    }

    @PostMapping
    public Vehiculo guardar(
            @RequestBody Vehiculo vehiculo) {

        return vehiculoService.guardar(vehiculo);
    }

    @GetMapping("/{id}")
    public Vehiculo buscarPorId(
            @PathVariable Integer id) {

        return vehiculoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Vehiculo actualizar(
            @PathVariable Integer id,
            @RequestBody Vehiculo vehiculo) {

        return vehiculoService.actualizar(
                id,
                vehiculo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {

        vehiculoService.eliminar(id);
    }

}