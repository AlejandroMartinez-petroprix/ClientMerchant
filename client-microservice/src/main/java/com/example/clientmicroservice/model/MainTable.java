package com.example.clientmicroservice.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@DynamoDBTable(tableName = "MainTable")
public abstract class MainTable {

    @Id
    @DynamoDBHashKey(attributeName = "PK")
    private String pk;

    @DynamoDBRangeKey(attributeName = "SK")
    private String sk;

    @DynamoDBAttribute
    private String id;

    @DynamoDBAttribute
    private String status;

    @DynamoDBAttribute(attributeName = "gIndex2Pk")
    private String gIndex2Pk;

    @DynamoDBAttribute(attributeName = "createdDate")
    private String createdDate;
}
