package com.example.clientmicroservice.service;

import com.example.clientmicroservice.mappers.ClientMapper;
import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public ClientOutputDTO createClient(ClientInputDTO clientInputDTO) {
        Client client = clientMapper.toEntity(clientInputDTO);
        client.setId(java.util.UUID.randomUUID().toString());
        clientRepository.create(client);
        return clientMapper.toDto(client);
    }

    public List<ClientOutputDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }
}

