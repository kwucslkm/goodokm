package com.goodokm.user.application;

import java.util.List;
import com.goodokm.user.domain.User;
import com.goodokm.user.domain.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public User getUser(Long id) {
    return userRepository.findById(id).orElseThrow(() ->
        new IllegalArgumentException("User not found."));
  }
}
