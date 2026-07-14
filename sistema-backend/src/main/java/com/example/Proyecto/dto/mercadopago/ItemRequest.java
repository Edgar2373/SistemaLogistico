package com.example.Proyecto.dto.mercadopago;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

@Data
public class ItemRequest {
    private String id;
    private String title;
    private String description;
    
    @JsonProperty("picture_url")
    private String pictureUrl;
    
    @JsonProperty("category_id")
    private String categoryId;
    
    private Integer quantity;
    
    @JsonProperty("unit_price")
    private BigDecimal unitPrice;
}
