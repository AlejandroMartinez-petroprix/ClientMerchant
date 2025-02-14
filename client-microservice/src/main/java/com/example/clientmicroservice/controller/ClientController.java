package com.example.clientmicroservice.controller;

import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;

    /**
     * Endpoint para crear un cliente en DynamoDB.
     */
    @PostMapping
    public ResponseEntity<ClientOutputDTO> createClient(@RequestBody ClientInputDTO clientInputDTO) {
        ClientOutputDTO createdClient = clientService.createClient(clientInputDTO);
        return ResponseEntity.ok(createdClient);
    }

    /**
     * Endpoint para obtener todos los clientes guardados en DynamoDB.
     */
    @GetMapping
    public ResponseEntity<List<ClientOutputDTO>> getAllClients() {
        List<ClientOutputDTO> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }
}
