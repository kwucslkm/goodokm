package com.goodokm.subscription.api;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.goodokm.common.response.ApiResponse;
import com.goodokm.subscription.application.SubscriptionService;
import com.goodokm.subscription.domain.Subscription;
import com.goodokm.subscription.dto.CreateSubscriptionRequest;
import com.goodokm.subscription.dto.SubscriptionResponse;
import com.goodokm.subscription.dto.UpdateSubscriptionRequest;
import com.goodokm.subscription.mapper.SubscriptionMapper;
import jakarta.validation.Valid;
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
  public ApiResponse<List<SubscriptionResponse>> getSubscriptions(
      @RequestParam(required = false) Long userId
  ) {
    var subscriptions = subscriptionService.getSubscriptions(userId).stream()
        .map(SubscriptionMapper::toResponse)
        .collect(Collectors.toList());
    return ApiResponse.ok(subscriptions);
  }

  @GetMapping("/{id}")
  public ApiResponse<SubscriptionResponse> getSubscription(@PathVariable Long id) {
    return ApiResponse.ok(SubscriptionMapper.toResponse(subscriptionService.getById(id)));
  }

  @PostMapping
  public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
      @Valid @RequestBody CreateSubscriptionRequest request
  ) {
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
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(SubscriptionMapper.toResponse(saved)));
  }

  @PutMapping("/{id}")
  public ApiResponse<SubscriptionResponse> updateSubscription(
      @PathVariable Long id,
      @Valid @RequestBody UpdateSubscriptionRequest request
  ) {
    Subscription subscription = new Subscription();
    subscription.setName(request.name());
    subscription.setCategory(request.category());
    subscription.setBillingCycle(request.billingCycle());
    subscription.setAmount(request.amount());
    subscription.setNextBillingDate(LocalDate.parse(request.nextBillingDate()));
    subscription.setStatus(request.status());
    subscription.setMemo(request.memo());

    Subscription updated = subscriptionService.update(id, subscription);
    return ApiResponse.ok(SubscriptionMapper.toResponse(updated));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteSubscription(@PathVariable Long id) {
    subscriptionService.delete(id);
    return ApiResponse.ok(null);
  }
}
