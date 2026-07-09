package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Pedido;
import com.example.Proyecto.service.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Hidden;
import java.time.LocalDate;

@Hidden
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<Pedido> listar() {
        return pedidoService.listar();
    }

    @PostMapping
    public Pedido guardar(@Valid @RequestBody Pedido pedido) {
        return pedidoService.guardar(pedido);
    }

    @GetMapping("/{id}")
    public Pedido buscarPorId(@PathVariable Integer id) {
        return pedidoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Pedido actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody Pedido pedido) {

        return pedidoService.actualizar(id, pedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        pedidoService.eliminar(id);
    }

    
    
    //JPQL
    @GetMapping("/estado/{estado}")
    public List<Pedido> buscarPorEstado(@PathVariable String estado) {
        return pedidoService.buscarPedidosPorEstado(estado);
    }

    @GetMapping("/repartidor/{id}")
    public List<Pedido> buscarPorRepartidor(@PathVariable Integer id) {
        return pedidoService.buscarPedidosPorRepartidor(id);
    }

    @GetMapping("/fechas")
    public List<Pedido> buscarEntreFechas(
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin) {
        return pedidoService.buscarPedidosEntreFechas(
                        fechaInicio,
                        fechaFin);
    }

    //actualiza el stock
    @PostMapping("/completo")
    public Pedido registrarCompleto(@Valid @RequestBody Pedido pedido) {
        return pedidoService.registrarPedidoCompleto(pedido);
    }

}
