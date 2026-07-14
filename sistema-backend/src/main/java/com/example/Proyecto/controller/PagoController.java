package com.example.Proyecto.controller;

import com.example.Proyecto.entity.Pago;
import com.example.Proyecto.service.PagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @Autowired
    private com.example.Proyecto.service.MercadoPagoService mercadoPagoService;

    @PostMapping("/generar-link")
    @org.springframework.transaction.annotation.Transactional
    public org.springframework.http.ResponseEntity<?> generarLinkPago(@RequestBody com.example.Proyecto.dto.GenerarLinkRequest request) {
        try {
            String titulo = "Pedido #" + request.getIdPedido() + " - " + request.getCliente();
            String initPoint = mercadoPagoService.crearPreferenciaPago(titulo, request.getMonto());

            // Si a futuro la BD en la entidad Pedido o Pago tiene un campo init_point o url_pago,
            // aquí se puede actualizar el registro. Como se analizó la BD y no existe el campo,
            // simplemente devolvemos la URL al frontend.
            
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("init_point", initPoint);

            return org.springframework.http.ResponseEntity.ok(response);
        } catch (Exception e) {
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("error", e.getMessage());
            return org.springframework.http.ResponseEntity.badRequest().body(error);
        }
    }


    @GetMapping
    public List<Pago> listar() {
        return pagoService.listar();
    }

    @PostMapping
    public Pago guardar(@Valid @RequestBody Pago pago) {
        return pagoService.guardar(pago);
    }

    @GetMapping("/{id}")
    public Pago buscarPorId(@PathVariable Integer id) {
        return pagoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Pago actualizar(
        @PathVariable Integer id,
        @Valid @RequestBody Pago pago) {

        return pagoService.actualizar(id, pago);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        pagoService.eliminar(id);
    }

}