package com.example.merchantmicroservice.repository;

import com.example.merchantmicroservice.model.Merchant;
import com.example.merchantmicroservice.model.MerchantType;
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
public class MerchantRepository {

    private final DynamoDbTable<Merchant> merchantTable;

    public Merchant create(Merchant merchant) {
        merchant.setId(java.util.UUID.randomUUID().toString());
        try {
            merchantTable.putItem(merchant);
            log.info("Merchant guardado exitosamente en DynamoDB.");
        } catch (ResourceNotFoundException e) {
            log.error("ERROR: La tabla no existe en DynamoDB.");
        }
        return merchant;
    }

    public Optional<Merchant> findById(String id) {
        log.info("Buscando al merchant con ID: {} en DynamoDB...", id);

        return Optional.ofNullable(merchantTable.getItem(r -> r.key(k -> k.partitionValue(Merchant.MERCHANT_PK_PREFIX + id)
                .sortValue(Merchant.MERCHANT_SK_PREFIX))));
    }

    public List<Merchant> findByName(String name) {
        log.info("Buscando merchants por nombre: {} en DynamoDB...", name);
        return merchantTable.scan().items().stream()
                .filter(m -> m.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }
    public void update(Merchant merchant) {
        log.info("Actualizando merchant con ID: {} en DynamoDB...", merchant.getId());
        merchantTable.putItem(merchant);

    }
    public List<Merchant> findByClientId(String clientId) {
        return merchantTable.scan().items().stream()
                .filter(m -> clientId.equals(m.getClientId()))
                .collect(Collectors.toList());
    }

    public String findClientByMerchantId(String merchantId) {
        Merchant merchant = findById(merchantId).get();
        return (merchant != null) ? merchant.getClientId() : null;
    }
}

