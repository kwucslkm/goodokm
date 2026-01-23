package com.goodokm.subscription.application;

import java.util.List;
import com.goodokm.subscription.domain.Subscription;
import com.goodokm.subscription.domain.SubscriptionRepository;
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

  public Subscription getById(Long id) {
    return subscriptionRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Subscription not found."));
  }

  public Subscription create(Subscription subscription) {
    return subscriptionRepository.save(subscription);
  }

  public Subscription update(Long id, Subscription updated) {
    Subscription existing = subscriptionRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Subscription not found."));

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
