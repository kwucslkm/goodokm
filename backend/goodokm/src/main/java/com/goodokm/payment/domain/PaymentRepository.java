package com.goodokm.payment.domain;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository {
  List<Payment> findAll();
  List<Payment> findBySubscriptionId(Long subscriptionId);
  Optional<Payment> findById(Long id);
  Payment save(Payment payment);
}
