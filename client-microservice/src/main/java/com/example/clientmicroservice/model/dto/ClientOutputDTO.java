package com.example.clientmicroservice.model.dto;

import lombok.*;

import javax.validation.constraints.*;

/*
 * DTO para la salida de datos de un cliente
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ClientOutputDTO {

    @NotNull(message = "El ID no puede ser nulo")
    @Pattern(regexp = "^[0-9a-fA-F-]{36}$", message = "El ID debe ser un UUID válido")
    private String id;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    private String name;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    private String surname;

    @NotBlank(message = "El teléfono no puede estar vacío")
    @Pattern(regexp = "^[6-9][0-9]{8}$", message = "Formato de teléfono incorrecto")
    private String phone;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Formato de email inválido")
    private String email;
}

