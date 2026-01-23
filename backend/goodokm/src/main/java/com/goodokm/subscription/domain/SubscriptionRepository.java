package com.goodokm.subscription.domain;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository {
  List<Subscription> findAll();
  List<Subscription> findByUserId(Long userId);
  Optional<Subscription> findById(Long id);
  Subscription save(Subscription subscription);
  void deleteById(Long id);
}
