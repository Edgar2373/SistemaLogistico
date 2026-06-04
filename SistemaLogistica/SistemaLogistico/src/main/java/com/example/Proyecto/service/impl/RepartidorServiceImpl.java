package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Repartidor;
import com.example.Proyecto.repository.RepartidorRepository;
import com.example.Proyecto.service.RepartidorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepartidorServiceImpl
        implements RepartidorService {

    @Autowired
    private RepartidorRepository repartidorRepository;

    @Override
    public List<Repartidor> listar() {
        return repartidorRepository.findAll();
    }

    @Override
    public Repartidor guardar(Repartidor repartidor) {
        return repartidorRepository.save(repartidor);
    }

    @Override
    public Repartidor buscarPorId(Integer id) {

        return repartidorRepository.findById(id)
                .orElse(null);
    }

    @Override
    public Repartidor actualizar(
            Integer id,
            Repartidor repartidor) {

        Repartidor existente =
                repartidorRepository.findById(id)
                        .orElse(null);

        if (existente != null) {

            existente.setLicencia(
                    repartidor.getLicencia());

            existente.setEstadoRepartidor(
                    repartidor.getEstadoRepartidor());

            existente.setRendimientoPromedio(
                    repartidor.getRendimientoPromedio());

            return repartidorRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        repartidorRepository.deleteById(id);
    }

}