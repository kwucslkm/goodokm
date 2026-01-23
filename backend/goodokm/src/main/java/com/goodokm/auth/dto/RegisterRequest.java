package com.goodokm.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @Email @NotBlank(message = "Email is required.") String email,
    @NotBlank(message = "Password is required.") String password
) {}
