package com.example.Proyecto.controller;

import com.example.Proyecto.entity.DetallePedido;
import com.example.Proyecto.service.DetallePedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestController
@RequestMapping("/detalle-pedido")
@CrossOrigin("*")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping
    public List<DetallePedido> listar() {
        return detallePedidoService.listar();
    }

    @PostMapping
    public DetallePedido guardar(
            @RequestBody DetallePedido detallePedido) {

        return detallePedidoService.guardar(detallePedido);
    }

    @GetMapping("/{id}")
    public DetallePedido buscarPorId(@PathVariable Integer id) {

        return detallePedidoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public DetallePedido actualizar(
            @PathVariable Integer id,
            @RequestBody DetallePedido detallePedido) {

        return detallePedidoService.actualizar(id, detallePedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {

        detallePedidoService.eliminar(id);
    }

}