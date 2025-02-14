package com.example.merchantmicroservice.model.dto;

import com.example.merchantmicroservice.model.MerchantType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantInputDTO {
    private String name;
    private String address;
    private MerchantType merchantType;
    private String clientId; //Relación con la tabla de clientes

}
