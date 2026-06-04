package com.example.Proyecto.service;

import com.example.Proyecto.entity.Ruta;

import java.util.List;

public interface RutaService {

    List<Ruta> listar();

    Ruta guardar(Ruta ruta);

    Ruta buscarPorId(Integer id);

    Ruta actualizar(Integer id, Ruta ruta);

    void eliminar(Integer id);

}