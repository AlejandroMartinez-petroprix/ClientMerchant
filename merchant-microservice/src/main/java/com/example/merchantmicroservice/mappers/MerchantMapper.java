package com.example.merchantmicroservice.mappers;

import com.example.merchantmicroservice.model.Merchant;
import com.example.merchantmicroservice.model.dto.MerchantInputDTO;
import com.example.merchantmicroservice.model.dto.MerchantOutputDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * Mapper interface for converting between Merchant entities and DTOs.
 */
@Component
@Mapper(componentModel = "spring")
public interface MerchantMapper {

    /**
     * Converts a MerchantInputDTO to a Merchant entity.
     * The ID field is ignored during the mapping.
     *
     * @param dto the MerchantInputDTO to convert
     * @return the converted Merchant entity
     */
    @Mapping(target = "id", ignore = true)
    Merchant toEntity(MerchantInputDTO dto);

    /**
     * Converts a Merchant entity to a MerchantOutputDTO.
     *
     * @param merchant the Merchant entity to convert
     * @return the converted MerchantOutputDTO
     */
    MerchantOutputDTO toDto(Merchant merchant);
}