package com.example.Proyecto.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class GenerarLinkRequest {
    private Integer idPedido;
    private BigDecimal monto;
    private String cliente;
}
