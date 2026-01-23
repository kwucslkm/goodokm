package com.goodokm.auth.api;

import com.goodokm.auth.application.AuthService;
import com.goodokm.auth.dto.AuthResponse;
import com.goodokm.auth.dto.LoginRequest;
import com.goodokm.auth.dto.RegisterRequest;
import com.goodokm.auth.mapper.AuthMapper;
import com.goodokm.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<ApiResponse<AuthResponse>> register(
      @Valid @RequestBody RegisterRequest request
  ) {
    var user = authService.register(request.email(), request.password());
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(AuthMapper.toResponse(user)));
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    var user = authService.login(request.email(), request.password());
    return ApiResponse.ok(AuthMapper.toResponse(user));
  }
}
