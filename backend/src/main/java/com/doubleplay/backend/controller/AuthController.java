package com.doubleplay.backend.controller;

import com.doubleplay.backend.dto.LoginRequest;
import com.doubleplay.backend.dto.LoginResponse;
import com.doubleplay.backend.dto.RefreshRequest;
import com.doubleplay.backend.dto.SignupRequest;
import com.doubleplay.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        var u = authService.signup(req);
        return ResponseEntity.ok(new LoginResponse.UserPayload(u.getUserId(), u.getNickname(), u.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req, HttpServletResponse res) {
        var resp = authService.login(req);
        var cookie = authService.issueRefreshCookie(resp.refreshToken());
        res.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest req, @CookieValue(name = "refreshToken", required = false) String cookieToken) {
        String token = req.refreshToken() != null && !req.refreshToken().isBlank() ? req.refreshToken() : cookieToken;
        if (token == null || token.isBlank()) return ResponseEntity.badRequest().body("no token");
        String newAccess = authService.reissue(token);
        HashMap<String, String> map = new HashMap<>();
        map.put("accessToken", newAccess);
        return ResponseEntity.ok(map);
    }
}
