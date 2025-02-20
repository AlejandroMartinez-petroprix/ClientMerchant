package com.example.merchantmicroservice.model;

import lombok.Data;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * Represents the main table entity for DynamoDB.
 */
@Data
@DynamoDbBean
public class MainTable {
    private String partitionKey;
    private String sortKey;
    private String id;
    private String status;
    private String gIndex2Pk;
    private String createdDate;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("PK")
    public String getPartitionKey() {
        return partitionKey;
    }

    @DynamoDbSortKey
    @DynamoDbAttribute("SK")
    public String getSortKey() {
        return sortKey;
    }

    @DynamoDbAttribute("id")
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("status")
    public String getStatus() {
        return status;
    }

    /**
     * Gets the secondary partition key for the GSI1 index.
     *
     * @return the secondary partition key
     */
    @DynamoDbSecondaryPartitionKey(indexNames = "GSI1")
    @DynamoDbAttribute("gIndex2Pk")
    public String getGIndex2Pk() {
        return gIndex2Pk;
    }

    @DynamoDbAttribute("createdDate")
    public String getCreatedDate() {
        return createdDate;
    }
}
