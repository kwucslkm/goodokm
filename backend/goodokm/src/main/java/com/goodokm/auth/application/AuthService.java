package com.goodokm.auth.application;

import com.goodokm.user.domain.User;
import com.goodokm.user.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User register(String email, String password) {
    String normalizedEmail = email == null ? "" : email.trim();
    if (normalizedEmail.isBlank() || password == null || password.isBlank()) {
      throw new IllegalArgumentException("Email and password are required.");
    }
    if (userRepository.existsByEmail(normalizedEmail)) {
      throw new IllegalStateException("Email already exists.");
    }

    User user = new User();
    user.setEmail(normalizedEmail);
    user.setPassword(passwordEncoder.encode(password));
    return userRepository.save(user);
  }

  public User login(String email, String password) {
    String normalizedEmail = email == null ? "" : email.trim();
    if (normalizedEmail.isBlank() || password == null || password.isBlank()) {
      throw new IllegalArgumentException("Email and password are required.");
    }

    return userRepository.findByEmail(normalizedEmail)
        .filter(user -> passwordEncoder.matches(password, user.getPassword()))
        .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
  }
}
