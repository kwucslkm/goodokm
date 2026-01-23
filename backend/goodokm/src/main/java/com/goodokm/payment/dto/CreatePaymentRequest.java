package com.goodokm.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreatePaymentRequest(
    @NotNull(message = "Subscription id is required.") Long subscriptionId,
    @NotBlank(message = "Billing date is required.") String billingDate,
    @NotNull(message = "Amount is required.") @Positive(message = "Amount must be positive.") Integer amount,
    @NotBlank(message = "Status is required.") String status
) {}
