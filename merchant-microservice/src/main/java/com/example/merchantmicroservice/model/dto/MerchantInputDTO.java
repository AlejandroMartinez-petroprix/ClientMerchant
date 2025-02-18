package com.example.merchantmicroservice.model.dto;

import com.example.merchantmicroservice.model.MerchantType;
import lombok.*;
import javax.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantInputDTO {

    @NotBlank(message = "El nombre del merchant no puede estar vacío")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres")
    private String name;

    @NotBlank(message = "La dirección no puede estar vacía")
    @Size(min = 5, max = 100, message = "La dirección debe tener entre 5 y 100 caracteres")
    private String address;

    @NotNull(message = "El tipo de merchant es obligatorio")
    private MerchantType merchantType;

    @NotBlank(message = "El clientId no puede estar vacío")
    @Pattern(regexp = "^[0-9a-fA-F-]{36}$", message = "El clientId debe ser un UUID válido")
    private String clientId;
}

