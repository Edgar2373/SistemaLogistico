package com.example.Proyecto.service;

import com.example.Proyecto.dto.mercadopago.ItemRequest;
import com.example.Proyecto.dto.mercadopago.PreferenceRequest;
import com.example.Proyecto.dto.mercadopago.PreferenceResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Collections;

@Slf4j
@Service
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private final RestTemplate restTemplate;

    public MercadoPagoService() {
        this.restTemplate = new RestTemplate();
    }

    public String crearPreferenciaPago(String titulo, BigDecimal montoTotal) {
        // 1. Construir el Item
        ItemRequest item = new ItemRequest();
        item.setId("ITEM-1");
        item.setTitle(titulo);
        item.setQuantity(1);
        item.setUnitPrice(montoTotal);

        // 2. Construir la Preference
        PreferenceRequest preferenceRequest = new PreferenceRequest();
        preferenceRequest.setItems(Collections.singletonList(item));

        // 3. Configurar Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        // 4. Armar la petición
        HttpEntity<PreferenceRequest> requestEntity = new HttpEntity<>(preferenceRequest, headers);

        // 5. Ejecutar la llamada HTTP
        String url = "https://api.mercadopago.com/checkout/preferences";
        try {
            ResponseEntity<PreferenceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    PreferenceResponse.class
            );

            if (response.getBody() != null && response.getBody().getInitPoint() != null) {
                return response.getBody().getInitPoint();
            } else {
                throw new RuntimeException("Mercado Pago no devolvió el init_point");
            }
        } catch (HttpClientErrorException e) {
            System.err.println("=============== ERROR DE MERCADO PAGO ===============");
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            System.err.println("=====================================================");
            log.error("Error al comunicarse con Mercado Pago: {}", e.getResponseBodyAsString(), e);
            throw new RuntimeException("Error en la pasarela de pago: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado creando preferencia de Mercado Pago", e);
            throw new RuntimeException("Error inesperado en la pasarela de pago");
        }
    }
}
