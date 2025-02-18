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


@Service
@RequiredArgsConstructor
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final MerchantMapper merchantMapper;


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

    public MerchantOutputDTO findById(String id, boolean simpleOutput) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Merchant con ID " + id + " no encontrado."));

        return simpleOutput ? new MerchantOutputDTO(merchant.getId(), null, null, null, null)
                : merchantMapper.toDto(merchant);
    }


    public List<MerchantOutputDTO> findByName(String name) {
        return merchantRepository.findByName(name).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList());
    }

    public MerchantOutputDTO updateMerchant(String id, MerchantInputDTO merchantInputDTO) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        merchant.setName(merchantInputDTO.getName());
        merchant.setAddress(merchantInputDTO.getAddress());
        merchant.setMerchantType(merchantInputDTO.getMerchantType());
        merchantRepository.update(merchant);
        return merchantMapper.toDto(merchant);
    }
    public List<MerchantOutputDTO> findByClientId(String clientId) {
        return merchantRepository.findByClientId(clientId).stream()
                .map(merchantMapper::toDto)
                .collect(Collectors.toList());
    }
    public String findClientByMerchantId(String merchantId) {
        return merchantRepository.findClientByMerchantId(merchantId);
    }
}
