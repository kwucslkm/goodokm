package com.goodokm.user.infra;

import com.goodokm.user.domain.User;
import com.goodokm.user.domain.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<User, Long>, UserRepository {
}
