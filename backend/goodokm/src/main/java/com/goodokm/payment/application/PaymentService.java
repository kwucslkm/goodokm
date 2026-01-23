package com.goodokm.payment.application;

import java.util.List;
import com.goodokm.payment.domain.Payment;
import com.goodokm.payment.domain.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

  private final PaymentRepository paymentRepository;

  public PaymentService(PaymentRepository paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  public List<Payment> getPayments(Long subscriptionId) {
    if (subscriptionId == null) {
      return paymentRepository.findAll();
    }
    return paymentRepository.findBySubscriptionId(subscriptionId);
  }

  public Payment create(Payment payment) {
    return paymentRepository.save(payment);
  }
}
