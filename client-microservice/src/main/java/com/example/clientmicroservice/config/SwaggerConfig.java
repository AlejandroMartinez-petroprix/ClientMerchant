package com.example.clientmicroservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.List;

/**
 * Configuration class for Swagger.
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    /**
     * Creates a Docket bean to configure Swagger.
     *
     * @return a Docket configured for the Client Microservice API.
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.clientmicroservice.controller"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(new ApiInfoBuilder()
                        .title("Client Microservice API")
                        .description("API documentation for Client Microservice")
                        .version("1.0")
                        .build())
                .securitySchemes(Collections.singletonList(apiKey()))
                .securityContexts(Collections.singletonList(securityContext()));
    }

    /**
     * Configures the API key for Swagger.
     *
     * @return an ApiKey object with the JWT configuration.
     */
    private ApiKey apiKey() {
        return new ApiKey("JWT", "Authorization", "header");
    }

    /**
     * Configures the security context for Swagger.
     *
     * @return a SecurityContext object with the security configuration.
     */
    private SecurityContext securityContext() {
        return SecurityContext.builder()
                .securityReferences(defaultAuth())
                .forPaths(PathSelectors.any())
                .build();
    }

    /**
     * Configures the default authorization for Swagger.
     *
     * @return a list of SecurityReference objects with the default authorization configuration.
     */
    private List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope("global", "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[]{authorizationScope};
        return Collections.singletonList(new SecurityReference("JWT", authorizationScopes));
    }
}