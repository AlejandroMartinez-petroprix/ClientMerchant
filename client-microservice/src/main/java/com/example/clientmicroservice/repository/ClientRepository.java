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

    /**
     * Retrieves all Clients from DynamoDB.
     *
     * @return A list of all Clients.
     */
    public List<Client> findAll() {
        log.info("Buscando todos los clientes en DynamoDB...");

        return clientTable.scan().items().stream()
                .filter(client -> client.getPartitionKey().startsWith("CLIENT#"))
                .collect(Collectors.toList());
    }

    /**
     * Creates a new Client in DynamoDB.
     *
     * @param client The Client entity to be created.
     * @return The created Client entity.
     */
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

    /**
     * Finds a Client by its ID in DynamoDB.
     *
     * @param id The ID of the Client to be found.
     * @return An Optional containing the found Client, or empty if not found.
     */
    public Optional<Client> findById(String id) {
        log.info("Buscando al cliente con ID: {} en DynamoDB...", id);

        return Optional.ofNullable(clientTable.getItem(r -> r.key(k -> k.partitionValue(Client.CLIENT_PK_PREFIX + id)
                .sortValue(Client.CLIENT_SK_PREFIX))));
    }

    /**
     * Finds Clients by their name in DynamoDB.
     *
     * @param name The name of the Clients to be found.
     * @return A list of Clients matching the given name.
     */
    public List<Client> findByName(String name) {
        log.info("Buscando clientes por nombre: {} en DynamoDB...", name);

        return clientTable.scan().items().stream()
                .filter(client -> client.getPartitionKey().startsWith("CLIENT#"))
                .filter(client -> client.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Finds a Client by its email in DynamoDB using a Global Secondary Index (GSI).
     *
     * @param email The email of the Client to be found.
     * @return An Optional containing the found Client, or empty if not found.
     */
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

    /**
     * Updates an existing Client in DynamoDB.
     *
     * @param client The Client entity to be updated.
     */
    public void update(Client client) {
        log.info("Actualizando cliente con ID: {} en DynamoDB...", client.getId());
        clientTable.putItem(client);
    }
}
