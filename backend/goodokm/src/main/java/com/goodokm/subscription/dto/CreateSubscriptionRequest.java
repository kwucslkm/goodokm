package com.goodokm.subscription.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateSubscriptionRequest(
    @NotNull(message = "User id is required.") Long userId,
    @NotBlank(message = "Name is required.") String name,
    @NotBlank(message = "Category is required.") String category,
    @NotBlank(message = "Billing cycle is required.") String billingCycle,
    @NotNull(message = "Amount is required.") @Positive(message = "Amount must be positive.") Integer amount,
    @NotBlank(message = "Start date is required.") String nextBillingDate,
    String status,
    String memo
) {}
