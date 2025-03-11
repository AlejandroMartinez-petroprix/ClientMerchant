package com.example.clientmicroservice.interceptor;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * Interceptor that verifies if a request contains a valid JWT token.
 */

@Component
@Slf4j
public class JwtInterceptor implements HandlerInterceptor {

    private static final String SECRET_KEY = "a-string-secret-at-least-256-bits-long";

    /**
     * Pre-handle method to intercept the request and ensure a valid JWT token is present.
     *
     * @param request  The HTTP request.
     * @param response The HTTP response.
     * @param handler  The handler.
     * @return true if the token is valid, false otherwise.
     * @throws Exception if an error occurs during token verification.
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("Authorization");

        // Bloquear si no hay token
        if (token == null || !token.startsWith("Bearer ")) {
            log.warn("⚠️ No se recibió ningún token. Bloqueando acceso.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            try (PrintWriter writer = response.getWriter()) {
                writer.write("{\"error\": \"No token provided\"}");
            }
            return false;
        }

        token = token.substring(7);
        log.info("🔑 Token recibido: {}", token);

        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT decodedJWT = verifier.verify(token);

            int age = decodedJWT.getClaim("age").asInt();
            log.info("📢 Edad extraída del token: {}", age);

            if (age < 18) {
                log.warn("❌ Usuario menor de edad. Bloqueando acceso.");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                try (PrintWriter writer = response.getWriter()) {
                    writer.write("{\"error\": \"User is under 18 years old\"}");
                }
                return false;
            }

            log.info("✅ Usuario autorizado.");
            return true;
        } catch (Exception e) {
            log.error("❌ Token inválido.", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            try (PrintWriter writer = response.getWriter()) {
                writer.write("{\"error\": \"Invalid token\"}");
            }
            return false;
        }
    }
}
