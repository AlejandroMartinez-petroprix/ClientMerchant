package com.example.clientmicroservice.mappers;

import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/**
 * ClientMapper maps Client objects to ClientInputDTO and ClientOutputDTO objects.
 */
@Component
@Mapper(componentModel = "spring")
public interface ClientMapper {
    /**
     * Maps a ClientInputDTO to a Client entity.
     *
     * @param dto The ClientInputDTO to be mapped.
     * @return The mapped Client entity.
     */
    @Mapping(target = "id", ignore = true)
    Client toEntity(ClientInputDTO dto);

    /**
     * Maps a Client entity to a ClientOutputDTO.
     *
     * @param client The Client entity to be mapped.
     * @return The mapped ClientOutputDTO.
     */
    ClientOutputDTO toDto(Client client);
}

