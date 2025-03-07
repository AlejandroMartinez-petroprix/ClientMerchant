package com.example.clientmicroservice.service;

import com.example.clientmicroservice.feign.MerchantFeignClient;
import com.example.clientmicroservice.mappers.ClientMapper;
import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import com.example.clientmicroservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final MerchantFeignClient merchantClient;

    /**
     * Retrieves all Clients.
     *
     * @return A list of Clients as DTOs.
     */
    public List<Client> getAllClients() {
        return new ArrayList<>(clientRepository.findAll());
    }

    /**
     * Creates a new Client.
     *
     * @param clientInputDTO The DTO containing client input data.
     * @return The created Client
     */
    public Client createClient(ClientInputDTO clientInputDTO) {
        Client client = clientMapper.toEntity(clientInputDTO);
        clientRepository.create(client);
        return client;
    }

    /**
     * Retrieves a Client by its ID.
     *
     * @param id The ID of the Client.
     * @param simpleOutput Whether to return a simplified output.
     * @return The Client as a DTO.
     * @throws RuntimeException if the Client is not found.
     */
    public Client getClientById(String id, boolean simpleOutput) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            if (simpleOutput) {
                Client simpleClient = new Client();
                simpleClient.setId(client.getId());
                return simpleClient;
            } else
                return client;
        }
        throw new RuntimeException("Client not found");
    }

    /**
     * Finds Clients by their name.
     *
     * @param name The name of the Clients to be found.
     * @return A list of Clients as DTOs.
     * @throws RuntimeException if no Clients are found.
     */
    public List<Client> findByName(String name) {
        List<Client> clients = clientRepository.findByName(name);

        if (clients.isEmpty()) {
            throw new RuntimeException("Client or clients not found");        }

        return clients.stream()
                .collect(Collectors.toList());
    }

    /**
     * Finds a Client by its email.
     *
     * @param email The email of the Client to be found.
     * @return The Client as a DTO.
     * @throws RuntimeException if the Client is not found.
     */
    public Client findByEmail(String email) {
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    /**
     * Updates an existing Client.
     *
     * @param id The ID of the Client to be updated.
     * @param clientInputDTO The DTO containing updated client data.
     * @return The updated Client as a DTO.
     * @throws RuntimeException if the Client is not found.
     */
    public Client updateClient(String id, ClientInputDTO clientInputDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setName(clientInputDTO.getName());
        client.setSurname(clientInputDTO.getSurname());
        client.setPhone(clientInputDTO.getPhone());

        clientRepository.update(client);
        return client;
    }

    /**
     * Checks if a Merchant exists by its ID.
     *
     * @param merchantId The ID of the Merchant.
     * @return true if the Merchant exists, false otherwise.
     */
    public boolean doesMerchantExist(String merchantId) {
        try {
            merchantClient.findById(merchantId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}

