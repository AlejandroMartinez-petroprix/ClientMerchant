package com.example.clientmicroservice.model.dto;

import lombok.*;

import javax.validation.constraints.Email;

import javax.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientInputDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String name;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String surname;

    @NotBlank(message = "El CIF/NIF/NIE no puede estar vacío")
    @Pattern(regexp = "^[0-9XYZ][0-9]{7}[A-Z]$", message = "Formato incorrecto de CIF/NIF/NIE")
    private String cifNifNie;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Pattern(regexp = "^[6-9][0-9]{8}$", message = "Formato de teléfono incorrecto")
    private String phone;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Formato de email inválido")
    private String email;
}

