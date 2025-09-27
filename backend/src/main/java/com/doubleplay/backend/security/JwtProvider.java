package com.doubleplay.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {
    private final Key key;
    private final long accessExpMin;
    private final long refreshExpDay;

    public JwtProvider(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.access-exp-min}") long accessExpMin,
                       @Value("${jwt.refresh-exp-day}") long refreshExpDay) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessExpMin = accessExpMin;
        this.refreshExpDay = refreshExpDay;
    }

    public String generateAccessToken(Long userId, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("role", role)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessExpMin, ChronoUnit.MINUTES)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("typ", "refresh")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(refreshExpDay, ChronoUnit.DAYS)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public Long getUserId(String token) {
        return Long.valueOf(parse(token).getBody().getSubject());
    }
}