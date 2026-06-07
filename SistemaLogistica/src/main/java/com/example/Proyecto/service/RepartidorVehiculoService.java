package com.example.Proyecto.service;

import com.example.Proyecto.entity.RepartidorVehiculo;

import java.util.List;

public interface RepartidorVehiculoService {

    List<RepartidorVehiculo> listar();

    RepartidorVehiculo guardar(
            RepartidorVehiculo repartidorVehiculo);

    RepartidorVehiculo buscarPorId(Integer id);

    RepartidorVehiculo actualizar(
            Integer id,
            RepartidorVehiculo repartidorVehiculo);

    void eliminar(Integer id);

}