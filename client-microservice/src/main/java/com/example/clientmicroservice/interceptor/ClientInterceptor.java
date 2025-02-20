package com.example.clientmicroservice.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Component
public class ClientInterceptor implements HandlerInterceptor {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if ("POST".equalsIgnoreCase(request.getMethod()) && request.getRequestURI().startsWith("/clients")) {
            log.info("Interceptando petición - Método: {} - URI: {}", request.getMethod(), request.getRequestURI());

            // Envolver la request para poder leer el cuerpo varias veces
            CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);

            // Leer el JSON del cuerpo de la petición
            Map<String, Object> jsonMap = objectMapper.readValue(cachedRequest.getInputStream(), Map.class);

            InputStream inputStream = request.getInputStream();
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, bytesRead);
            }


            // Modificar el nombre antes de que llegue al Controller
            if (jsonMap.containsKey("name")) {
                String originalName = jsonMap.get("name").toString();
                jsonMap.put("name", originalName + "_MODIFICADO");
                log.info("Nombre modificado: {} → {}", originalName, jsonMap.get("name"));
            }

            // Crear un nuevo request con el cuerpo modificado
            byte[] modifiedBody = objectMapper.writeValueAsBytes(jsonMap);
            CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(request, modifiedBody);

            // Reemplazar el request original con el modificado
            request.setAttribute("wrappedRequest", wrappedRequest);
        }
        return true;
    }

}
