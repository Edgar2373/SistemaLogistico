package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Boleta;
import com.example.Proyecto.repository.BoletaRepository;
import com.example.Proyecto.service.BoletaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoletaServiceImpl implements BoletaService {

    @Autowired
    private BoletaRepository boletaRepository;

    @Override
    public List<Boleta> listar() {
        return boletaRepository.findAll();
    }

    @Override
    public Boleta guardar(Boleta boleta) {
        return boletaRepository.save(boleta);
    }

    @Override
    public Boleta buscarPorId(Integer id) {
        return boletaRepository.findById(id).orElse(null);
    }

    @Override
    public Boleta actualizar(Integer id, Boleta boleta) {

        Boleta boletaExistente =
                boletaRepository.findById(id).orElse(null);

        if (boletaExistente != null) {

            boletaExistente.setFechaEmision(boleta.getFechaEmision());
            boletaExistente.setTotal(boleta.getTotal());
            boletaExistente.setPedido(boleta.getPedido());

            return boletaRepository.save(boletaExistente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        boletaRepository.deleteById(id);
    }

}