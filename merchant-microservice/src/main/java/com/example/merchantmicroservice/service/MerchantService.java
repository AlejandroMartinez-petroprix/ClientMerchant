package com.example.merchantmicroservice.service;

import com.example.merchantmicroservice.mappers.MerchantMapper;
import com.example.merchantmicroservice.model.Merchant;
import com.example.merchantmicroservice.model.dto.MerchantInputDTO;
import com.example.merchantmicroservice.model.dto.MerchantOutputDTO;
import com.example.merchantmicroservice.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing merchants.
 */
@Service
@RequiredArgsConstructor
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final MerchantMapper merchantMapper;

    /**
     * Creates a new merchant.
     *
     * @param merchantInputDTO the merchant input data transfer object
     * @return the created merchant output data transfer object
     * @throws IllegalStateException if a merchant with the same name already exists for the client
     * @throws RuntimeException if there is an error creating the merchant
     */
    public MerchantOutputDTO createMerchant(MerchantInputDTO merchantInputDTO) {
        List<Merchant> existingMerchants = merchantRepository.findByClientId(merchantInputDTO.getClientId());
        boolean exists = existingMerchants.stream()
                .anyMatch(m -> m.getName().equalsIgnoreCase(merchantInputDTO.getName()));

        if (exists) {
            throw new IllegalStateException("Ya existe un merchant con ese nombre para el cliente " + merchantInputDTO.getClientId());
        }

        Merchant merchant = merchantMapper.toEntity(merchantInputDTO);
        merchant.setId(java.util.UUID.randomUUID().toString());

        try {
            merchantRepository.create(merchant);
            return merchantMapper.toDto(merchant);
        } catch (Exception e) {
            throw new RuntimeException("Error al crear el merchant: " + e.getMessage(), e);
        }
    }

    /**
     * Finds a merchant by its ID.
     *
     * @param id the ID of the merchant
     * @param simpleOutput whether to return a simplified output
     * @return the found merchant output data transfer object
     * @throws IllegalArgumentException if the merchant is not found
     */
    public MerchantOutputDTO findById(String id, boolean simpleOutput) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Merchant con ID " + id + " no encontrado."));

        return simpleOutput ? new MerchantOutputDTO(merchant.getId(), null, null, null, null)
                : merchantMapper.toDto(merchant);
    }

    /**
     * Finds merchants by their name.
     *
     * @param name the name of the merchants to find
     * @return a list of found merchant output data transfer objects
     */
    public List<MerchantOutputDTO> findByName(String name) {
        return merchantRepository.findByName(name).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Updates an existing merchant.
     *
     * @param id the ID of the merchant to update
     * @param merchantInputDTO the merchant input data transfer object
     * @return the updated merchant output data transfer object
     * @throws RuntimeException if the merchant is not found
     */
    public MerchantOutputDTO updateMerchant(String id, MerchantInputDTO merchantInputDTO) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        merchant.setName(merchantInputDTO.getName());
        merchant.setAddress(merchantInputDTO.getAddress());
        merchant.setMerchantType(merchantInputDTO.getMerchantType());
        merchantRepository.update(merchant);
        return merchantMapper.toDto(merchant);
    }

    /**
     * Finds merchants by their client ID.
     *
     * @param clientId the client ID of the merchants to find
     * @return a list of found merchant output data transfer objects
     */
    public List<MerchantOutputDTO> findByClientId(String clientId) {
        return merchantRepository.findByClientId(clientId).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Finds the client ID by a merchant's ID.
     *
     * @param merchantId the ID of the merchant
     * @return the client ID of the merchant
     * @throws RuntimeException if the merchant is not found
     */
    public String findClientByMerchantId(String merchantId) {
        return merchantRepository.findClientByMerchantId(merchantId);
    }
}