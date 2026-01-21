package com.goodokm.subscription;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionService {

  private final SubscriptionRepository subscriptionRepository;

  public SubscriptionService(SubscriptionRepository subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  public List<Subscription> getSubscriptions(Long userId) {
    if (userId == null) {
      return subscriptionRepository.findAll();
    }
    return subscriptionRepository.findByUserId(userId);
  }

  public Subscription create(Subscription subscription) {
    return subscriptionRepository.save(subscription);
  }

  public void delete(Long id) {
    subscriptionRepository.deleteById(id);
  }
}
