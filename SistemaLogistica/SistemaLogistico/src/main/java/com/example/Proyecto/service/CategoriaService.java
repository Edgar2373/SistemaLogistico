package com.example.Proyecto.service;

import com.example.Proyecto.entity.Categoria;

import java.util.List;

public interface CategoriaService {

    List<Categoria> listar();

    Categoria guardar(Categoria categoria);

    Categoria buscarPorId(Integer id);

    void eliminar(Integer id);

}