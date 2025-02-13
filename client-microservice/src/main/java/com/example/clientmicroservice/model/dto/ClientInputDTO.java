package com.example.clientmicroservice.model.dto;

import lombok.*;

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
}
