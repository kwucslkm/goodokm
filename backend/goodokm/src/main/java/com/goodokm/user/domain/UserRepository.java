package com.goodokm.user.domain;

import java.util.Optional;

public interface UserRepository {
  boolean existsByEmail(String email);
  Optional<User> findByEmail(String email);
  Optional<User> findById(Long id);
  User save(User user);
  java.util.List<User> findAll();
}
