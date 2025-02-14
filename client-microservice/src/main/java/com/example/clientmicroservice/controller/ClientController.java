package com.example.clientmicroservice.controller;

import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    /**
     * Endpoint para crear un cliente
     */
    @PostMapping
    public ResponseEntity<ClientOutputDTO> createClient(@RequestBody @Valid ClientInputDTO clientInputDTO) {
        ClientOutputDTO createdClient = clientService.createClient(clientInputDTO);
        return ResponseEntity.ok(createdClient);
    }

    /**
     * Endpoint para obtener todos los clientes
     */
    @GetMapping
    public ResponseEntity<List<ClientOutputDTO>> getAllClients() {
        List<ClientOutputDTO> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    /**
     * Endpoint para obtener un cliente por ID con opción de simpleOutput
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getClientById(@PathVariable String id, @RequestParam(required = false) boolean simpleOutput) {
        return ResponseEntity.ok(clientService.getClientById(id, simpleOutput));
    }

    /**
     * Endpoint para buscar clientes por nombre
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<List<ClientOutputDTO>> findByName(@RequestParam String name) {
        return ResponseEntity.ok(clientService.findByName(name));
    }

    /**
     * Endpoint para buscar clientes por email
     */
    @GetMapping("/search/by-email")
    public ResponseEntity<ClientOutputDTO> findByEmail(@RequestParam @Email String email) {
        return ResponseEntity.ok(clientService.findByEmail(email));
    }

    /**
     * Endpoint para actualizar un cliente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientOutputDTO> updateClient(@PathVariable String id, @RequestBody ClientInputDTO clientInputDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientInputDTO));
    }
}

