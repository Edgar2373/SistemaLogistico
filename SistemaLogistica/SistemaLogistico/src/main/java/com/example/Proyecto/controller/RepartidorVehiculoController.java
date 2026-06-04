package com.example.Proyecto.controller;

import com.example.Proyecto.entity.RepartidorVehiculo;
import com.example.Proyecto.service.RepartidorVehiculoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/repartidor-vehiculo")
@CrossOrigin("*")
public class RepartidorVehiculoController {

    @Autowired
    private RepartidorVehiculoService
            repartidorVehiculoService;

    @GetMapping
    public List<RepartidorVehiculo> listar() {

        return repartidorVehiculoService.listar();
    }

    @PostMapping
    public RepartidorVehiculo guardar(
            @RequestBody RepartidorVehiculo repartidorVehiculo) {

        return repartidorVehiculoService
                .guardar(repartidorVehiculo);
    }

    @GetMapping("/{id}")
    public RepartidorVehiculo buscarPorId(
            @PathVariable Integer id) {

        return repartidorVehiculoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public RepartidorVehiculo actualizar(
            @PathVariable Integer id,
            @RequestBody RepartidorVehiculo repartidorVehiculo) {

        return repartidorVehiculoService
                .actualizar(id, repartidorVehiculo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {

        repartidorVehiculoService.eliminar(id);
    }

}