package com.example.clientmicroservice.repository;

import com.example.clientmicroservice.model.Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ClientRepository {

    private final DynamoDbTable<Client> clientTable;

    public Client create(Client client) {
        client.setId(java.util.UUID.randomUUID().toString());
        try {
            clientTable.putItem(client);
            log.info("Cliente guardado exitosamente en DynamoDB.");
        } catch (ResourceNotFoundException e) {
            log.error("ERROR: La tabla no existe en DynamoDB.");
        }
        return client;
    }

    public Optional<Client> findById(String id) {
        log.info("Buscando al cliente con ID: {} en DynamoDB...", id);

        return Optional.ofNullable(clientTable.getItem(r -> r.key(k -> k.partitionValue(Client.CLIENT_PK_PREFIX + id)
                .sortValue(Client.CLIENT_SK_PREFIX))));
    }

    public List<Client> findByName(String name) {
        log.info("Buscando clientes por nombre: {} en DynamoDB...", name);
        return clientTable.scan().items().stream()
                .filter(client -> client.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    public Optional<Client> findByEmail(String email) {
        log.info("Buscando cliente por email: {} en DynamoDB...", email);
        return clientTable.scan().items().stream()
                .filter(client -> email.equals(client.getEmail()))
                .findFirst();
    }

    public void update(Client client) {
        log.info("Actualizando cliente con ID: {} en DynamoDB...", client.getId());
        clientTable.putItem(client);
    }
}
