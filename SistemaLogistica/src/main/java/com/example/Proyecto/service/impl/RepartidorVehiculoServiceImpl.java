package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.RepartidorVehiculo;
import com.example.Proyecto.repository.RepartidorVehiculoRepository;
import com.example.Proyecto.service.RepartidorVehiculoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepartidorVehiculoServiceImpl
        implements RepartidorVehiculoService {

    @Autowired
    private RepartidorVehiculoRepository
            repartidorVehiculoRepository;

    @Override
    public List<RepartidorVehiculo> listar() {
        return repartidorVehiculoRepository.findAll();
    }

    @Override
    public RepartidorVehiculo guardar(
            RepartidorVehiculo repartidorVehiculo) {

        return repartidorVehiculoRepository
                .save(repartidorVehiculo);
    }

    @Override
    public RepartidorVehiculo buscarPorId(Integer id) {

        return repartidorVehiculoRepository
                .findById(id)
                .orElse(null);
    }

    @Override
    public RepartidorVehiculo actualizar(
            Integer id,
            RepartidorVehiculo repartidorVehiculo) {

        RepartidorVehiculo existente =
                repartidorVehiculoRepository
                        .findById(id)
                        .orElse(null);

        if (existente != null) {

            existente.setFechaAsignacion(
                    repartidorVehiculo.getFechaAsignacion());

            existente.setEstadoAsignacion(
                    repartidorVehiculo.getEstadoAsignacion());

            existente.setRepartidor(
                    repartidorVehiculo.getRepartidor());

            existente.setVehiculo(
                    repartidorVehiculo.getVehiculo());

            return repartidorVehiculoRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        repartidorVehiculoRepository.deleteById(id);
    }

}