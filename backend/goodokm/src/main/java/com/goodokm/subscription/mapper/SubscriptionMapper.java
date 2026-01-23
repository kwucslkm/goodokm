package com.goodokm.subscription.mapper;

import java.time.format.DateTimeFormatter;
import com.goodokm.subscription.domain.Subscription;
import com.goodokm.subscription.dto.SubscriptionResponse;

public final class SubscriptionMapper {

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  private SubscriptionMapper() {}

  public static SubscriptionResponse toResponse(Subscription subscription) {
    String createdAt = subscription.getCreatedAt() == null
        ? null
        : subscription.getCreatedAt().format(FORMATTER);
    String updatedAt = subscription.getUpdatedAt() == null
        ? null
        : subscription.getUpdatedAt().format(FORMATTER);

    return new SubscriptionResponse(
        subscription.getId(),
        subscription.getUserId(),
        subscription.getName(),
        subscription.getCategory(),
        subscription.getBillingCycle(),
        subscription.getAmount(),
        subscription.getNextBillingDate(),
        subscription.getStatus(),
        subscription.getMemo(),
        createdAt,
        updatedAt
    );
  }
}
