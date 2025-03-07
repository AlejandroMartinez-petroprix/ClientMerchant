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

/**
 * Interceptor that verifies if the user is over 18 years old, based on the JWT token.
 */

@Component
@Slf4j
public class JwtInterceptor implements HandlerInterceptor {

    private static final String SECRET_KEY = "a-string-secret-at-least-256-bits-long";

    /**
     * Pre-handle method to intercept the request and check the user's age from the JWT token.
     *
     * @param request  The HTTP request.
     * @param response The HTTP response.
     * @param handler  The handler.
     * @return true if the user is over 18 years old, false otherwise.
     * @throws Exception if an error occurs during token verification.
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
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
                    response.getWriter().write("User is under 18 years old");
                    return false;
                }

                log.info("✅ Usuario autorizado.");
            } catch (Exception e) {
                log.error("❌ Token inválido.", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid token");
                return false;
            }
        } else {
            log.warn("⚠️ No se recibió ningún token.");
        }

        return true;
    }
}
