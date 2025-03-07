package com.example.clientmicroservice.model;

import lombok.Data;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * Represents the main table used across all microservices.
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
     * Gets the secondary partition key for the global secondary index.
     *
     * @return the secondary partition key.
     */
    @DynamoDbAttribute("gIndex2Pk")
    @DynamoDbSecondaryPartitionKey(indexNames = "GSI1")
    public String getGIndex2Pk() {
        return gIndex2Pk;
    }

    @DynamoDbAttribute("createdDate")
    public String getCreatedDate() {
        return createdDate;
    }
}
