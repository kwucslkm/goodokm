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

  public Subscription getById(Long id) {
    return subscriptionRepository.findById(id).orElse(null);
  }

  public Subscription update(Long id, Subscription updated) {
    Subscription existing = subscriptionRepository.findById(id).orElse(null);
    if (existing == null) {
      return null;
    }

    existing.setName(updated.getName());
    existing.setCategory(updated.getCategory());
    existing.setBillingCycle(updated.getBillingCycle());
    existing.setAmount(updated.getAmount());
    existing.setNextBillingDate(updated.getNextBillingDate());
    existing.setStatus(updated.getStatus());
    existing.setMemo(updated.getMemo());
    return subscriptionRepository.save(existing);
  }

  public void delete(Long id) {
    subscriptionRepository.deleteById(id);
  }
}
