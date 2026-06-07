package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Cliente;
import com.example.Proyecto.repository.ClienteRepository;
import com.example.Proyecto.service.ClienteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Integer id) {
        clienteRepository.deleteById(id);
    }
    
    @Override
    public Cliente actualizar(Integer id, Cliente cliente) {

    Cliente clienteExistente = clienteRepository.findById(id).orElse(null);

    if (clienteExistente != null) {

        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setDireccionPrincipal(cliente.getDireccionPrincipal());

        return clienteRepository.save(clienteExistente);
    }

    return null;
}

}
