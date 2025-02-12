package com.example.clientmicroservice.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@DynamoDBDocument
public class Client extends MainTable {

    @DynamoDBAttribute
    private String name;

    @DynamoDBAttribute
    private String surname;

    @DynamoDBAttribute
    private String cifNifNie;

    @DynamoDBAttribute
    private String phone;
}
