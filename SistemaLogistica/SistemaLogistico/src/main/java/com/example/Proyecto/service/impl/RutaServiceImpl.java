package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Ruta;
import com.example.Proyecto.repository.RutaRepository;
import com.example.Proyecto.service.RutaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutaServiceImpl implements RutaService {

    @Autowired
    private RutaRepository rutaRepository;

    @Override
    public List<Ruta> listar() {
        return rutaRepository.findAll();
    }

    @Override
    public Ruta guardar(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    @Override
    public Ruta buscarPorId(Integer id) {
        return rutaRepository.findById(id).orElse(null);
    }

    @Override
    public Ruta actualizar(Integer id, Ruta ruta) {

        Ruta existente =
                rutaRepository.findById(id).orElse(null);

        if (existente != null) {

            existente.setNombreRuta(ruta.getNombreRuta());
            existente.setDistanciaKm(ruta.getDistanciaKm());
            existente.setZona(ruta.getZona());

            return rutaRepository.save(existente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        rutaRepository.deleteById(id);
    }

}