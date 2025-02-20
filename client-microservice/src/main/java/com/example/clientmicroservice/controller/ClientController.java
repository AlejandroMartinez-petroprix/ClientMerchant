package com.example.clientmicroservice.controller;

import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Slf4j
public class ClientController {
    private final ClientService clientService;
    private final ObjectMapper objectMapper;


    /**
     * Endpoint para crear un cliente
     */
    @PostMapping
    public ResponseEntity<?> createClient(@Valid @RequestBody ClientInputDTO clientInputDTO) {
        return ResponseEntity.ok(clientService.createClient(clientInputDTO));
    }



    /**
     * Endpoint para obtener un cliente por ID con opción de simpleOutput
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@Valid @PathVariable String id, @RequestParam(required = false) boolean simpleOutput) {
        return ResponseEntity.ok(clientService.getClientById(id, simpleOutput));
    }

    /**
     * Endpoint para buscar clientes por nombre
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<List<ClientOutputDTO>> findByName(@Valid @RequestParam String name) {
        return ResponseEntity.ok(clientService.findByName(name));
    }

    /**
     * Endpoint para buscar clientes por email
     */
    @GetMapping("/search/by-email")
    public ResponseEntity<ClientOutputDTO> findByEmail(@Valid @RequestParam String email) {
        return ResponseEntity.ok(clientService.findByEmail(email));
    }

    /**
     * Endpoint para actualizar un cliente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientOutputDTO> updateClient(@Valid @PathVariable String id, @RequestBody ClientInputDTO clientInputDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientInputDTO));
    }

    @GetMapping("/merchant/{merchantId}/exists")
    public ResponseEntity<Boolean> checkMerchantExists(@Valid @PathVariable String merchantId) {
        return ResponseEntity.ok(clientService.doesMerchantExist(merchantId));
    }



}

