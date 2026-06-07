package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Usuario;
import com.example.Proyecto.repository.UsuarioRepository;
import com.example.Proyecto.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public Usuario actualizar(Integer id, Usuario usuario) {

        Usuario existente =
                usuarioRepository.findById(id).orElse(null);

        if (existente != null) {

            existente.setNombre(usuario.getNombre());
            existente.setTelefono(usuario.getTelefono());
            existente.setUsuario(usuario.getUsuario());
            existente.setEmail(usuario.getEmail());
            existente.setPasswordHash(usuario.getPasswordHash());
            existente.setRol(usuario.getRol());
            existente.setEstadoUsuario(usuario.getEstadoUsuario());

            return usuarioRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }

}