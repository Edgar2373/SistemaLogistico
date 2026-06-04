package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Cliente;
import com.example.Proyecto.service.ClienteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
@CrossOrigin("*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listar();
    }

    @PostMapping
    public Cliente guardar(@Valid @RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Integer id) {
        return clienteService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        clienteService.eliminar(id);
    }
    
    @PutMapping("/{id}")
    public Cliente actualizar(
        @PathVariable Integer id,
        @Valid @RequestBody Cliente cliente) {

        return clienteService.actualizar(id, cliente);
}

}