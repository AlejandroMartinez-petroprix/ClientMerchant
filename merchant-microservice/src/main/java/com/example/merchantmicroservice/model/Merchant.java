package com.example.merchantmicroservice.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

@DynamoDbBean
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Merchant extends MainTable {
    public static final String MERCHANT_PK_PREFIX = "MERCHANT#";
    public static final String MERCHANT_SK_PREFIX = "PROFILE";

    private String name;
    private String address;
    private MerchantType merchantType;
    private String clientId; //Relación con la tabla de clientes

    public void setId(String id) {
        setPartitionKey(MERCHANT_PK_PREFIX + id);
        setSortKey(MERCHANT_SK_PREFIX);
    }

    public String getId() {
        return getPartitionKey().substring(MERCHANT_PK_PREFIX.length());
    }

}
