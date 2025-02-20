package com.example.clientmicroservice.config;

import com.example.clientmicroservice.model.Client;
import com.example.clientmicroservice.utils.AwsCredentials;
import com.example.clientmicroservice.utils.AwsProperties;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.net.URI;

/**
 * Configuration class for DynamoDB.
 */
@Slf4j
@Configuration
@EnableConfigurationProperties({AwsProperties.class, AwsCredentials.class})
public class DynamoDbConfig {

    private final AwsProperties awsProperties;

    public DynamoDbConfig(AwsProperties awsProperties) {
        this.awsProperties = awsProperties;
    }

    /**
     * Creates a DynamoDbClient bean using AWS properties.
     *
     * @return a configured DynamoDbClient.
     */
    @Bean
    public DynamoDbClient dynamoDbClient() {

        var builder = DynamoDbClient.builder()
                .region(Region.of(awsProperties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(awsProperties.getCredentials().getAccessKey(),
                                awsProperties.getCredentials().getSecretKey())
                ));

        if (awsProperties.getEndpointOverride() != null) {
            log.info("Using endpoint override: {}", awsProperties.getEndpointOverride());
            builder.endpointOverride(URI.create(awsProperties.getEndpointOverride()));
        }

        return builder.build();
    }

    /**
     * Creates a DynamoDbEnhancedClient bean.
     *
     * @param dynamoDbClient The DynamoDbClient to be used.
     * @return a configured DynamoDbEnhancedClient.
     */
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder().dynamoDbClient(dynamoDbClient).build();
    }

    /**
     * Creates a DynamoDbTable bean for the Client model.
     *
     * @param dynamoDbEnhancedClient The DynamoDbEnhancedClient to be used.
     * @return a configured DynamoDbTable for the Client model.
     */
    @Bean
    public DynamoDbTable<Client> clientTable(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        return dynamoDbEnhancedClient.table(awsProperties.getDynamoDbTableName(), TableSchema.fromBean(Client.class));
    }
}