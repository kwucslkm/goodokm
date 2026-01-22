package com.goodokm.subscription;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

  private final SubscriptionService subscriptionService;

  public SubscriptionController(SubscriptionService subscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  @GetMapping
  public List<Subscription> getSubscriptions(@RequestParam(required = false) Long userId) {
    return subscriptionService.getSubscriptions(userId);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
    Subscription subscription = subscriptionService.getById(id);
    if (subscription == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(subscription);
  }

  @PostMapping
  public ResponseEntity<Subscription> createSubscription(
      @RequestBody CreateSubscriptionRequest request) {
    Subscription subscription = new Subscription();
    subscription.setUserId(request.userId());
    subscription.setName(request.name());
    subscription.setCategory(request.category());
    subscription.setBillingCycle(request.billingCycle());
    subscription.setAmount(request.amount());
    subscription.setNextBillingDate(LocalDate.parse(request.nextBillingDate()));
    subscription.setStatus(request.status() == null ? "ACTIVE" : request.status());
    subscription.setMemo(request.memo());

    Subscription saved = subscriptionService.create(subscription);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Subscription> updateSubscription(
      @PathVariable Long id,
      @RequestBody UpdateSubscriptionRequest request) {
    Subscription subscription = new Subscription();
    subscription.setName(request.name());
    subscription.setCategory(request.category());
    subscription.setBillingCycle(request.billingCycle());
    subscription.setAmount(request.amount());
    subscription.setNextBillingDate(LocalDate.parse(request.nextBillingDate()));
    subscription.setStatus(request.status());
    subscription.setMemo(request.memo());

    Subscription updated = subscriptionService.update(id, subscription);
    if (updated == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
    subscriptionService.delete(id);
    return ResponseEntity.noContent().build();
  }

  public record CreateSubscriptionRequest(
      Long userId,
      String name,
      String category,
      String billingCycle,
      Integer amount,
      String nextBillingDate,
      String status,
      String memo
  ) {}

  public record UpdateSubscriptionRequest(
      String name,
      String category,
      String billingCycle,
      Integer amount,
      String nextBillingDate,
      String status,
      String memo
  ) {}
}
