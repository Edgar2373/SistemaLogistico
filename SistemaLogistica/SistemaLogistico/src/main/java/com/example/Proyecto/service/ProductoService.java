package com.example.Proyecto.service;

import com.example.Proyecto.entity.Producto;

import java.util.List;

public interface ProductoService {

    List<Producto> listar();

    Producto guardar(Producto producto);

    Producto buscarPorId(Integer id);

    Producto actualizar(Integer id, Producto producto);

    void eliminar(Integer id);

}