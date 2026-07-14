package com.example.Proyecto.dto.mercadopago;

import lombok.Data;
import java.util.List;

@Data
public class PreferenceRequest {
    private List<ItemRequest> items;
}
