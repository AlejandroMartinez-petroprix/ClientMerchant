package com.example.clientmicroservice.model.dto;

import lombok.*;

import javax.validation.constraints.*;

/**
 * DTO for client output data.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ClientOutputDTO {
    private String id;
    private String name;
    private String surname;
    private String phone;
    private String email;
}

