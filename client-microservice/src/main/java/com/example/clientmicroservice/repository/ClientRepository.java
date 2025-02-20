package com.example.clientmicroservice.repository;

import com.example.clientmicroservice.model.Client;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbIndex;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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
                .filter(client -> client.getPartitionKey().startsWith("CLIENT#"))
                .filter(client -> client.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }


    public Optional<Client> findByEmail(String email) {
        log.info("Buscando cliente con email: {} en GSI1...", email);

        try {
            DynamoDbIndex<Client> gsi = clientTable.index("GSI1");

            var results = gsi.query(r -> r.queryConditional(
                    QueryConditional.keyEqualTo(k -> k.partitionValue(email))
            ));

            return StreamSupport.stream(results.spliterator(), false)
                    .flatMap(page -> page.items().stream())
                    .findFirst();

        } catch (Exception e) {
            log.error("No se pudo buscar el cliente por email en GSI1.");
            return Optional.empty();
        }
    }


    public void update(Client client) {
        log.info("Actualizando cliente con ID: {} en DynamoDB...", client.getId());
        clientTable.putItem(client);
    }
}
