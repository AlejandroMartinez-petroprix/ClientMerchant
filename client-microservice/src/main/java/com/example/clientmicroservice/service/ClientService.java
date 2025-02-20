package com.example.clientmicroservice.service;

import com.example.clientmicroservice.feign.MerchantFeignClient;
import com.example.clientmicroservice.mappers.ClientMapper;
import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final MerchantFeignClient merchantClient;

    public ClientOutputDTO createClient(ClientInputDTO clientInputDTO) {
        Client client = clientMapper.toEntity(clientInputDTO);
        clientRepository.create(client);
        return clientMapper.toDto(client);
    }

    public ClientOutputDTO getClientById(String id, boolean simpleOutput) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            return simpleOutput ? new ClientOutputDTO(client.getId(), null, null, null,null) : clientMapper.toDto(client);
        }
        throw new RuntimeException("Client not found");
    }

    public List<ClientOutputDTO> findByName(String name) {
        List<Client> clients = clientRepository.findByName(name);

        if (clients.isEmpty()) {
            throw new RuntimeException("Client or clients not found");        }

        return clients.stream()
                .map(clientMapper::toDto)
                .collect(Collectors.toList());
    }


    public ClientOutputDTO findByEmail(String email) {
        return clientRepository.findByEmail(email)
                .map(clientMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    public ClientOutputDTO updateClient(String id, ClientInputDTO clientInputDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(clientInputDTO.getName());
        client.setSurname(clientInputDTO.getSurname());
        client.setPhone(clientInputDTO.getPhone());

        clientRepository.update(client);
        return clientMapper.toDto(client);
    }

    public boolean doesMerchantExist(String merchantId) {
        try {
            merchantClient.findById(merchantId, true);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}

