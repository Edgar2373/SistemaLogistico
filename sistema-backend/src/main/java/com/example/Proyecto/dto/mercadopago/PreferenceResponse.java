package com.example.Proyecto.dto.mercadopago;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class PreferenceResponse {
    @JsonProperty("init_point")
    private String initPoint;
}
