package com.goodokm.user;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    try {
      User saved = userService.register(request.email(), request.password());
      return ResponseEntity.status(HttpStatus.CREATED)
          .body(Map.of("id", saved.getId(), "email", saved.getEmail()));
    } catch (IllegalStateException ex) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(ex.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    return userService.login(request.email(), request.password())
        .<ResponseEntity<?>>map(user ->
            ResponseEntity.ok(Map.of("id", user.getId(), "email", user.getEmail())))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Invalid email or password."));
  }

  public record RegisterRequest(String email, String password) {}

  public record LoginRequest(String email, String password) {}
}
