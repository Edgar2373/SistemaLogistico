package com.example.Proyecto.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @NotBlank(message = "El método de pago es obligatorio")
    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @NotBlank(message = "El estado del pago es obligatorio")
    @Column(name = "estado_pago", length = 50)
    private String estadoPago;

    @NotNull(message = "La fecha de pago es obligatoria")
    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    @NotBlank(message = "La referencia es obligatoria")
    @Column(name = "referencia_transaccion", length = 100)
    private String referenciaTransaccion;

    @NotNull(message = "La boleta es obligatoria")
    @ManyToOne
    @JoinColumn(name = "id_boleta")
    private Boleta boleta;

    @Column(name = "url_evidencia", length = 255)
    private String urlEvidencia;

}