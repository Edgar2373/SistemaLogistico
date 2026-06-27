package com.example.Proyecto.service.impl;

import com.example.Proyecto.config.PasswordConfig;
import com.example.Proyecto.entity.Usuario;
import com.example.Proyecto.repository.UsuarioRepository;
import com.example.Proyecto.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        // Hashear la contraseña antes de guardar
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public Usuario actualizar(Integer id, Usuario usuario) {
        Usuario existente = usuarioRepository.findById(id).orElse(null);
        if (existente != null) {
            existente.setNombre(usuario.getNombre());
            existente.setTelefono(usuario.getTelefono());
            existente.setUsuario(usuario.getUsuario());
            existente.setEmail(usuario.getEmail());
            // Solo hashear si se envió una nueva contraseña
            if (usuario.getPasswordHash() != null && !usuario.getPasswordHash().isEmpty()) {
                existente.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
            }
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