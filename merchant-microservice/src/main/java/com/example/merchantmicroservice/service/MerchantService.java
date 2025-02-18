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
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final MerchantMapper merchantMapper;


    public MerchantOutputDTO createMerchant(MerchantInputDTO merchantInputDTO) {
        Merchant merchant = merchantMapper.toEntity(merchantInputDTO);
        merchant.setId(java.util.UUID.randomUUID().toString());
        merchantRepository.create(merchant);
        return merchantMapper.toDto(merchant);
    }

    public MerchantOutputDTO findById(String id, boolean simpleOutput) {
        Optional<Merchant> merchantOpt = merchantRepository.findById(id);
        if (merchantOpt.isPresent()) {
            Merchant merchant = merchantOpt.get();
            return simpleOutput ? new MerchantOutputDTO(merchant.getId(), null, null, null,null) : merchantMapper.toDto(merchant);
        }
        throw new RuntimeException("Merchant not found");

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
