package com.doubleplay.backend.service;

import com.doubleplay.backend.dto.LoginRequest;
import com.doubleplay.backend.dto.LoginResponse;
import com.doubleplay.backend.dto.SignupRequest;
import com.doubleplay.backend.entity.RefreshToken;
import com.doubleplay.backend.entity.Users;
import com.doubleplay.backend.repository.RefreshTokenRepository;
import com.doubleplay.backend.repository.UsersRepository;
import com.doubleplay.backend.security.JwtProvider;
import com.doubleplay.backend.util.CookieUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsersRepository usersRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder encoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public Users signup(SignupRequest req) {
        if (usersRepository.existsByEmail(req.email())) throw new IllegalStateException("duplicate");

        String provider = "LOCAL";

        Users u = Users.builder()
                .email(req.email())
                .password(encoder.encode(req.password()))
                .nickname(req.nickname())
                .gender(req.gender())
                .oauthProvider(provider)
                .role("USER")
                .build();

        return usersRepository.save(u);
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        Users u = usersRepository.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("invalid"));
        if (!encoder.matches(req.password(), u.getPassword())) throw new IllegalArgumentException("invalid");
        String access = jwtProvider.generateAccessToken(u.getUserId(), u.getRole());
        String refresh = jwtProvider.generateRefreshToken(u.getUserId());
        refreshTokenRepository.deleteByUserId(u.getUserId());
        RefreshToken rt = RefreshToken.builder()
                .token(refresh)
                .userId(u.getUserId())
                .expiresAt(LocalDateTime.now().plusDays(14))
                .revoked(false)
                .build();
        refreshTokenRepository.save(rt);
        return new LoginResponse(access, refresh, new LoginResponse.UserPayload(u.getUserId(), u.getNickname(), u.getRole()));
    }

    public String reissue(String refreshToken) {
        var saved = refreshTokenRepository.findByTokenAndRevokedFalse(refreshToken).orElseThrow(() -> new IllegalArgumentException("invalid"));
        var claims = jwtProvider.parse(refreshToken).getBody();
        Long uid = Long.valueOf(claims.getSubject());
        var u = usersRepository.findById(uid).orElseThrow();
        return jwtProvider.generateAccessToken(u.getUserId(), u.getRole());
    }

    public ResponseCookie issueRefreshCookie(String refreshToken) {
        return CookieUtil.httpOnly("refreshToken", refreshToken, 14L * 24 * 60 * 60);
    }
}