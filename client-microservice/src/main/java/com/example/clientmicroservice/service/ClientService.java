package com.example.clientmicroservice.service;

import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    public Client createTestClient() {
        Client client = Client.builder()
                .name("Test Client")
                .surname("Test Surname")
                .cifNifNie("12345678A")
                .phone("123456789")
                .build();

        return clientRepository.create(client);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
}
