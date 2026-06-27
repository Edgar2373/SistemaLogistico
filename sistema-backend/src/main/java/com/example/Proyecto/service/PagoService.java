package com.example.Proyecto.service;

import com.example.Proyecto.entity.Pago;

import java.util.List;

public interface PagoService {

    List<Pago> listar();

    Pago guardar(Pago pago);

    Pago buscarPorId(Integer id);

    Pago actualizar(Integer id, Pago pago);

    void eliminar(Integer id);

}