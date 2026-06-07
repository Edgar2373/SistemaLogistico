package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Vehiculo;
import com.example.Proyecto.repository.VehiculoRepository;
import com.example.Proyecto.service.VehiculoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculoServiceImpl
        implements VehiculoService {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Override
    public List<Vehiculo> listar() {
        return vehiculoRepository.findAll();
    }

    @Override
    public Vehiculo guardar(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    public Vehiculo buscarPorId(Integer id) {

        return vehiculoRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Vehiculo actualizar(
            Integer id,
            Vehiculo vehiculo) {

        Vehiculo existente =
                vehiculoRepository.findById(id)
                        .orElse(null);

        if (existente != null) {

            existente.setTipo(vehiculo.getTipo());
            existente.setPlaca(vehiculo.getPlaca());
            existente.setEstadoVehiculo(
                    vehiculo.getEstadoVehiculo());

            return vehiculoRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        vehiculoRepository.deleteById(id);
    }

}