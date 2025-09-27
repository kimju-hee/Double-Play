package com.doubleplay.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank String email,
        @Size(min = 8, max = 64) String password,
        @NotBlank String nickname,
        @Pattern(regexp = "M|F") String gender,
        @NotBlank String oauth_provider
) {}