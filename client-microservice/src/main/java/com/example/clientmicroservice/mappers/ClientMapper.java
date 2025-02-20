package com.example.clientmicroservice.mappers;

import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.model.dto.ClientInputDTO;
import com.example.clientmicroservice.model.dto.ClientOutputDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

/*
    ClientMapper mapea los objetos de tipo Client con los objetos de tipo ClientInputDTO y ClientOutputDTO.
 */
@Component
@Mapper(componentModel = "spring")
public interface ClientMapper {
    @Mapping(target = "id", ignore = true)
    Client toEntity(ClientInputDTO dto);

    ClientOutputDTO toDto(Client client);
}

