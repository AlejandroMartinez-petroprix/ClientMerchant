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

/*
    Configuración de DynamoDB
 */
@Slf4j
@Configuration
@EnableConfigurationProperties({AwsProperties.class, AwsCredentials.class})
public class DynamoDbConfig {

    private final AwsProperties awsProperties;

    public DynamoDbConfig(AwsProperties awsProperties) {
        this.awsProperties = awsProperties;
    }

    /*
         Creación del cliente de DynamoDB a partir de las propiedades de AWS
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

    /*
        Cliente de DynamoDB mejorado
     */
    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder().dynamoDbClient(dynamoDbClient).build();
    }

    /*
        Tabla de DynamoDB principal
     */
    @Bean
    public DynamoDbTable<Client> clientTable(DynamoDbEnhancedClient dynamoDbEnhancedClient) {
        return dynamoDbEnhancedClient.table(awsProperties.getDynamoDbTableName(), TableSchema.fromBean(Client.class));
    }
}
