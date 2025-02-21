package com.example.clientmicroservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Feign client interface for interacting with the Merchant microservice.
 */
@FeignClient(name = "merchant-microservice", url = "${merchant.service.url}")
public interface MerchantFeignClient {

    /**
     * Endpoint to call the Merchant controller by ID.
     *
     * @param merchantId The ID of the merchant.
     * @return The merchant object.
     */
    @GetMapping("/merchants/{id}")
    Object findById(@PathVariable("id") String merchantId);
}
