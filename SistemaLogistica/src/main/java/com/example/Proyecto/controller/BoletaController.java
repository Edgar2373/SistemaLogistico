package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Boleta;
import com.example.Proyecto.service.BoletaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boletas")
@CrossOrigin("*")
public class BoletaController {

    @Autowired
    private BoletaService boletaService;

    @GetMapping
    public List<Boleta> listar() {
        return boletaService.listar();
    }

    @PostMapping
    public Boleta guardar(@RequestBody Boleta boleta) {
        return boletaService.guardar(boleta);
    }

    @GetMapping("/{id}")
    public Boleta buscarPorId(@PathVariable Integer id) {
        return boletaService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Boleta actualizar(
            @PathVariable Integer id,
            @RequestBody Boleta boleta) {

        return boletaService.actualizar(id, boleta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        boletaService.eliminar(id);
    }

}