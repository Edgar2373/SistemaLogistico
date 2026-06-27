package com.example.Proyecto.service;

import com.example.Proyecto.entity.Cliente;

import java.util.List;

public interface ClienteService {

    List<Cliente> listar();

    Cliente guardar(Cliente cliente);

    Cliente buscarPorId(Integer id);

    Cliente actualizar(Integer id, Cliente cliente);

    void eliminar(Integer id);

}