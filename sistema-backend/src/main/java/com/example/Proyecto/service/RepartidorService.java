package com.example.Proyecto.service;

import com.example.Proyecto.entity.Repartidor;

import java.util.List;

public interface RepartidorService {

    List<Repartidor> listar();

    Repartidor guardar(Repartidor repartidor);

    Repartidor buscarPorId(Integer id);

    Repartidor actualizar(Integer id,
                           Repartidor repartidor);

    void eliminar(Integer id);

}