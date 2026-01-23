package com.goodokm.payment.mapper;

import com.goodokm.payment.domain.Payment;
import com.goodokm.payment.dto.PaymentResponse;

public final class PaymentMapper {

  private PaymentMapper() {}

  public static PaymentResponse toResponse(Payment payment) {
    return new PaymentResponse(
        payment.getId(),
        payment.getSubscriptionId(),
        payment.getBillingDate(),
        payment.getAmount(),
        payment.getStatus()
    );
  }
}
