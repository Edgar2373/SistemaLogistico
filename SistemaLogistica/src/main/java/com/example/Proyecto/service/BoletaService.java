package com.example.Proyecto.service;

import com.example.Proyecto.entity.Boleta;

import java.util.List;

public interface BoletaService {

    List<Boleta> listar();

    Boleta guardar(Boleta boleta);

    Boleta buscarPorId(Integer id);

    Boleta actualizar(Integer id, Boleta boleta);

    void eliminar(Integer id);

}