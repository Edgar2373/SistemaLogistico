package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Ruta;
import com.example.Proyecto.service.RutaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rutas")
public class RutaController {

    @Autowired
    private RutaService rutaService;

    @GetMapping
    public List<Ruta> listar() {
        return rutaService.listar();
    }

    @PostMapping
    public Ruta guardar(@RequestBody Ruta ruta) {
        return rutaService.guardar(ruta);
    }

    @GetMapping("/{id}")
    public Ruta buscarPorId(@PathVariable Integer id) {
        return rutaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Ruta actualizar(
            @PathVariable Integer id,
            @RequestBody Ruta ruta) {

        return rutaService.actualizar(id, ruta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        rutaService.eliminar(id);
    }

}
