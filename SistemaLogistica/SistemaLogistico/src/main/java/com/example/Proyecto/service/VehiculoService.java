package com.example.Proyecto.service;

import com.example.Proyecto.entity.Vehiculo;

import java.util.List;

public interface VehiculoService {

    List<Vehiculo> listar();

    Vehiculo guardar(Vehiculo vehiculo);

    Vehiculo buscarPorId(Integer id);

    Vehiculo actualizar(Integer id,
                         Vehiculo vehiculo);

    void eliminar(Integer id);

}