package com.example.Proyecto.service;

import com.example.Proyecto.dto.UsuarioUpdateDTO;
import com.example.Proyecto.entity.Usuario;

import java.util.List;

public interface UsuarioService {

    List<Usuario> listar();

    Usuario guardar(Usuario usuario);

    Usuario buscarPorId(Integer id);

    Usuario actualizar(Integer id, UsuarioUpdateDTO dto);

    void eliminar(Integer id);

}