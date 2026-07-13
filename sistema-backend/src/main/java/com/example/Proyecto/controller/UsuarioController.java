package com.example.Proyecto.controller;

import com.example.Proyecto.dto.UsuarioUpdateDTO;
import com.example.Proyecto.entity.Usuario;
import com.example.Proyecto.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @PostMapping
    public Usuario guardar(@Valid @RequestBody Usuario usuario) {
        return usuarioService.guardar(usuario);
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(
        @PathVariable Integer id,
        @Valid @RequestBody UsuarioUpdateDTO dto) {

        return usuarioService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
        return "Usuario eliminado";

    }

}