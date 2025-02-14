package com.example.clientmicroservice.model.dto;

import lombok.*;

import javax.validation.constraints.Email;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientInputDTO {
    private String name;
    private String surname;
    private String cifNifNie;
    private String phone;
    @Email
    private String email;
}
