package com.goodokm.subscription.dto;

import java.time.LocalDate;

public record SubscriptionResponse(
    Long id,
    Long userId,
    String name,
    String category,
    String billingCycle,
    Integer amount,
    LocalDate nextBillingDate,
    String status,
    String memo,
    String createdAt,
    String updatedAt
) {}
