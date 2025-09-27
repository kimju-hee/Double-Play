package com.doubleplay.backend.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        UserPayload user
) {
    public static record UserPayload(Long userId, String nickname, String role) {}
}