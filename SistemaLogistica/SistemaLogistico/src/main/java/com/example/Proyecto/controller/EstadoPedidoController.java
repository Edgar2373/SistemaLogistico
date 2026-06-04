package com.example.Proyecto.controller;

import com.example.Proyecto.entity.EstadoPedido;
import com.example.Proyecto.service.EstadoPedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estado-pedido")
@CrossOrigin("*")
public class EstadoPedidoController {

    @Autowired
    private EstadoPedidoService estadoPedidoService;

    @GetMapping
    public List<EstadoPedido> listar() {
        return estadoPedidoService.listar();
    }

    @PostMapping
    public EstadoPedido guardar(
            @RequestBody EstadoPedido estadoPedido) {

        return estadoPedidoService.guardar(estadoPedido);
    }

    @GetMapping("/{id}")
    public EstadoPedido buscarPorId(
            @PathVariable Integer id) {

        return estadoPedidoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public EstadoPedido actualizar(
            @PathVariable Integer id,
            @RequestBody EstadoPedido estadoPedido) {

        return estadoPedidoService.actualizar(
                id,
                estadoPedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {

        estadoPedidoService.eliminar(id);
    }

}