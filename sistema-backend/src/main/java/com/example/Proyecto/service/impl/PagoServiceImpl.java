package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Pago;
import com.example.Proyecto.repository.PagoRepository;
import com.example.Proyecto.service.PagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    public List<Pago> listar() {
        return pagoRepository.findAll();
    }

    @Override
    public Pago guardar(Pago pago) {
        return pagoRepository.save(pago);
    }

    @Override
    public Pago buscarPorId(Integer id) {
        return pagoRepository.findById(id).orElse(null);
    }

    @Override
    public Pago actualizar(Integer id, Pago pago) {

        Pago pagoExistente =
                pagoRepository.findById(id).orElse(null);

        if (pagoExistente != null) {

            pagoExistente.setMetodoPago(pago.getMetodoPago());
            pagoExistente.setEstadoPago(pago.getEstadoPago());
            pagoExistente.setFechaPago(pago.getFechaPago());
            pagoExistente.setReferenciaTransaccion(
                    pago.getReferenciaTransaccion());

            pagoExistente.setBoleta(pago.getBoleta());

            return pagoRepository.save(pagoExistente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        pagoRepository.deleteById(id);
    }

}