package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Pago;
import com.example.Proyecto.service.PagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestController
@RequestMapping("/pagos")
@CrossOrigin("*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public List<Pago> listar() {
        return pagoService.listar();
    }

    @PostMapping
    public Pago guardar(@Valid @RequestBody Pago pago) {
        return pagoService.guardar(pago);
    }

    @GetMapping("/{id}")
    public Pago buscarPorId(@PathVariable Integer id) {
        return pagoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Pago actualizar(
        @PathVariable Integer id,
        @Valid @RequestBody Pago pago) {

        return pagoService.actualizar(id, pago);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        pagoService.eliminar(id);
    }

}