package com.example.Proyecto.service.impl;

import com.example.Proyecto.entity.Producto;
import com.example.Proyecto.repository.ProductoRepository;
import com.example.Proyecto.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto buscarPorId(Integer id) {
        return productoRepository.findById(id).orElse(null);
    }

    @Override
    public Producto actualizar(Integer id, Producto producto) {

        Producto productoExistente = productoRepository.findById(id).orElse(null);

        if (productoExistente != null) {

            productoExistente.setNombreProducto(producto.getNombreProducto());
            productoExistente.setPrecio(producto.getPrecio());
            productoExistente.setStock(producto.getStock());
            productoExistente.setCategoria(producto.getCategoria());

            return productoRepository.save(productoExistente);
        }

        return null;
    }

    @Override
    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

}