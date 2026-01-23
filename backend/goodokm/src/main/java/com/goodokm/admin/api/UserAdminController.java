package com.goodokm.admin.api;

import java.util.List;
import java.util.stream.Collectors;
import com.goodokm.common.response.ApiResponse;
import com.goodokm.user.application.UserService;
import com.goodokm.user.mapper.UserMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class UserAdminController {

  private final UserService userService;

  public UserAdminController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ApiResponse<List<?>> getUsers() {
    var users = userService.getUsers().stream()
        .map(UserMapper::toResponse)
        .collect(Collectors.toList());
    return ApiResponse.ok(users);
  }

  @GetMapping("/{id}")
  public ApiResponse<?> getUser(@PathVariable Long id) {
    return ApiResponse.ok(UserMapper.toResponse(userService.getUser(id)));
  }
}
