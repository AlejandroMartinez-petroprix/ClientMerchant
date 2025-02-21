package com.example.clientmicroservice.controller;

import com.example.clientmicroservice.mappers.ClientMapper;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.service.ClientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Slf4j
public class ClientController {
    private final ClientService clientService;
    private final ClientMapper clientMapper;


    /**
     * Endpoint to create a client.
     *
     * @param clientInputDTO The DTO containing client input data.
     * @return The created client as a ResponseEntity.
     */
    @PostMapping
    public ResponseEntity<ClientOutputDTO> createClient(@Valid @RequestBody ClientInputDTO clientInputDTO) {
        return ResponseEntity.ok(clientMapper.toDto(clientService.createClient(clientInputDTO)));
    }

    /**
     * Endpoint to get a client by ID with an option for simple output.
     *
     * @param id The ID of the client.
     * @param simpleOutput Whether to return a simplified output.
     * @return The client as a ResponseEntity.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClientOutputDTO> getClientById(@Valid @PathVariable String id, @RequestParam(required = false) boolean simpleOutput) {

        return ResponseEntity.ok(clientMapper.toDto(clientService.getClientById(id, simpleOutput)));
    }

    /**
     * Endpoint to search for clients by name.
     *
     * @param name The name of the clients to be found.
     * @return A list of clients as a ResponseEntity.
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<List<ClientOutputDTO>> findByName(@Valid @RequestParam String name) {
        return ResponseEntity.ok(clientService.findByName(name).stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList()));
    }

    /**
     * Endpoint to search for clients by email.
     *
     * @param email The email of the client to be found.
     * @return The client as a ResponseEntity.
     */
    @GetMapping("/search/by-email")
    public ResponseEntity<ClientOutputDTO> findByEmail(@Valid @RequestParam String email) {
        return ResponseEntity.ok(clientMapper.toDto((clientService.findByEmail(email))));
    }

    /**
     * Endpoint to update a client.
     *
     * @param id The ID of the client to be updated.
     * @param clientInputDTO The DTO containing updated client data.
     * @return The updated client as a ResponseEntity.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientOutputDTO> updateClient(@Valid @PathVariable String id, @RequestBody ClientInputDTO clientInputDTO) {
        return ResponseEntity.ok(clientMapper.toDto(clientService.updateClient(id, clientInputDTO)));
    }

    /**
     * Endpoint to check if a merchant exists.
     *
     * @param merchantId The ID of the merchant.
     * @return true if the merchant exists, false otherwise.
     */
    @GetMapping("/merchant/{merchantId}/exists")
    public ResponseEntity<Boolean> checkMerchantExists(@RequestParam String merchantId) {
        return ResponseEntity.ok(clientService.doesMerchantExist(merchantId));
    }



}

