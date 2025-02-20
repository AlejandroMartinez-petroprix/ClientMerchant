package com.example.merchantmicroservice.config;

import com.example.merchantmicroservice.model.Merchant;
import com.example.merchantmicroservice.utils.AwsCredentials;
import com.example.merchantmicroservice.utils.AwsProperties;
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
 * Configuration class for setting up DynamoDB clients and tables.
 */
@Slf4j
@Configuration
@EnableConfigurationProperties({AwsProperties.class, AwsCredentials.class})
public class DynamoDbConfig {

    private final AwsProperties awsProperties;

    /**
     * Constructor for DynamoDbConfig.
     *
     * @param awsProperties the AWS properties
     */
    public DynamoDbConfig(AwsProperties awsProperties) {
        this.awsProperties = awsProperties;
    }

    /**
     * Creates a DynamoDbClient bean.
     *
     * @return the DynamoDbClient
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
            log.info("Usando endpoint override: {}", awsProperties.getEndpointOverride());
            builder.endpointOverride(URI.create(awsProperties.getEndpointOverride()));
        }

        return builder.build();
    }

    /**
     * Creates a DynamoDbEnhancedClient bean.
     *
     * @param dynamoDbClient the DynamoDbClient
     * @return the DynamoDbEnhancedClient
     */
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder().dynamoDbClient(dynamoDbClient).build();
    }

    /**
     * Creates a DynamoDbTable bean for the Merchant entity.
     *
     * @param dynamoDbEnhancedClient the DynamoDbEnhancedClient
     * @return the DynamoDbTable for Merchant
     */
    @Bean
    public DynamoDbTable<Merchant> clientTable(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        return dynamoDbEnhancedClient.table(awsProperties.getDynamoDbTableName(), TableSchema.fromBean(Merchant.class));
    }
}