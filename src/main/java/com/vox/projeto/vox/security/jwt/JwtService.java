package com.vox.projeto.vox.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // Idealmente, coloque isso no application.properties
    // jwt.secret=SUA_CHAVE_SECRETA_AQUI_COM_PELO_MENOS_32_CARACTERES_PARA_HS256
    @Value("${jwt.secret:CHAVE_SUPER_SECRETA_COM_PELO_MENOS_32_CARACTERES_AQUI}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 horas em milissegundos
    private Long expiration;

    private SecretKey getSigningKey() {
        // Garante que a chave tenha o tamanho adequado para HS256
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey()) // Não precisa especificar o algoritmo
                .compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpirado(String token) {
        try {
            Date expiration = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}