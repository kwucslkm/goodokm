package com.goodokm.payment.dto;

import java.time.LocalDate;

public record PaymentResponse(
    Long id,
    Long subscriptionId,
    LocalDate billingDate,
    Integer amount,
    String status
) {}
