package com.goodokm.user.mapper;

import com.goodokm.user.domain.User;
import com.goodokm.user.dto.UserResponse;

public final class UserMapper {

  private UserMapper() {}

  public static UserResponse toResponse(User user) {
    return new UserResponse(user.getId(), user.getEmail());
  }
}
