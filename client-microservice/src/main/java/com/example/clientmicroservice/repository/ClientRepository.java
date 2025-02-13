package com.example.clientmicroservice.repository;

import com.example.clientmicroservice.model.Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

import java.util.List;
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

    public List<Client> findAll() {
        log.info("Buscando todos los clientes en DynamoDB...");
        return clientTable.scan().items().stream().collect(Collectors.toList());
    }
}
