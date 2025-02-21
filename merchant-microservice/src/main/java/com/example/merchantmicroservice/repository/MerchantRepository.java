package com.example.merchantmicroservice.repository;

import com.example.merchantmicroservice.model.Merchant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbIndex;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.services.dynamodb.model.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository for managing Merchant entities in DynamoDB.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class MerchantRepository {

    private final DynamoDbTable<Merchant> merchantTable;

    /**
     * Creates a new Merchant in DynamoDB.
     *
     * @param merchant the Merchant entity to be created
     * @return the created Merchant entity
     * @throws IllegalStateException if a Merchant with the same ID already exists
     * @throws RuntimeException if the Merchant could not be saved in DynamoDB
     */
    public Merchant create(Merchant merchant) {
        merchant.setId(java.util.UUID.randomUUID().toString());

        if (findById(merchant.getId()).isPresent()) {
            throw new IllegalStateException("Merchant con ID " + merchant.getId() + " ya existe.");
        }

        try {
            merchantTable.putItem(merchant);
            log.info("Merchant guardado exitosamente en DynamoDB.");
            return merchant;
        } catch (ResourceNotFoundException e) {
            log.error("ERROR: La tabla no existe en DynamoDB.");
            throw new RuntimeException("No se pudo guardar el merchant en DynamoDB", e);
        }
    }

    /**
     * Finds a Merchant by its ID.
     *
     * @param id the ID of the Merchant
     * @return an Optional containing the found Merchant, or empty if not found
     */
    public Optional<Merchant> findById(String id) {
        Merchant merchant = merchantTable.getItem(r -> r.key(k -> k.partitionValue(Merchant.MERCHANT_PK_PREFIX + id)
                .sortValue(Merchant.MERCHANT_SK_PREFIX)));

        if (merchant == null) {
            log.warn("Merchant con ID {} no encontrado.", id);
            return Optional.empty();
        }
        return Optional.of(merchant);
    }

    /**
     * Finds Merchants by their name.
     *
     * @param name the name of the Merchants to find
     * @return a list of Merchants with the given name
     */
    public List<Merchant> findByName(String name) {
        log.info("Buscando merchants por nombre: {} en DynamoDB...", name);
        return merchantTable.scan().items().stream()
                .filter(m -> m.getPartitionKey().startsWith("MERCHANT#"))
                .filter(m -> m.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing Merchant in DynamoDB.
     *
     * @param merchant the Merchant entity to update
     * @throws IllegalStateException if the Merchant does not exist
     */
    public void update(Merchant merchant) {
        if (!findById(merchant.getId()).isPresent()) {
            throw new IllegalStateException("No se puede actualizar: Merchant con ID " + merchant.getId() + " no existe.");
        }

        merchantTable.putItem(merchant);
        log.info("Merchant actualizado correctamente.");
    }

    /**
     * Finds Merchants by their client ID.
     *
     * @param clientId the client ID of the Merchants to find
     * @return a list of Merchants with the given client ID
     * @throws RuntimeException if there is an error querying the GSI1 index
     */
    public List<Merchant> findByClientId(String clientId) {
        try {
            DynamoDbIndex<Merchant> gsi = merchantTable.index("GSI1");

            var results = gsi.query(r -> r.queryConditional(
                    QueryConditional.keyEqualTo(k -> k.partitionValue(clientId))
            ));

            List<Merchant> merchants = new ArrayList<>();
            results.forEach(page -> merchants.addAll(page.items()));
            return merchants;
        } catch (Exception e) {
            log.error("No se pudo buscar merchants por clientId en el GSI1. Verifica que el índice existe.");
            throw new RuntimeException("Error al buscar merchants por clientId", e);
        }
    }

    /**
     * Finds the client ID by a Merchant's ID.
     *
     * @param merchantId the ID of the Merchant
     * @return the client ID of the Merchant
     * @throws RuntimeException if the Merchant is not found
     */
    public String findClientByMerchantId(String merchantId) {
        Optional<Merchant> merchantOpt = findById(merchantId);
        if (merchantOpt.isPresent()) {
            return merchantOpt.get().getClientId();
        }
        throw new RuntimeException("Merchant no encontrado");
    }
}