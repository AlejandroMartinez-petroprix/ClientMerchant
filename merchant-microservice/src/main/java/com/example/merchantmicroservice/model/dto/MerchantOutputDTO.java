package com.example.merchantmicroservice.model.dto;

import com.example.merchantmicroservice.model.MerchantType;
import lombok.*;

import javax.validation.constraints.*;

/**
 * DTO for merchant output data.
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MerchantOutputDTO {
    private String id;
    private String name;
    private String address;
    private MerchantType merchantType;
    private String clientId;
}

