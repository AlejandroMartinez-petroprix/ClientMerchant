package com.example.merchantmicroservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "client-service", url = "http://localhost:8081")
public interface Client {
    @GetMapping("/clients/{id}/exists")
    Boolean clientExists(@PathVariable("id") String clientId);
}