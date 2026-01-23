package com.goodokm.auth.mapper;

import com.goodokm.auth.dto.AuthResponse;
import com.goodokm.user.domain.User;

public final class AuthMapper {

  private AuthMapper() {}

  public static AuthResponse toResponse(User user) {
    return new AuthResponse(user.getId(), user.getEmail());
  }
}
