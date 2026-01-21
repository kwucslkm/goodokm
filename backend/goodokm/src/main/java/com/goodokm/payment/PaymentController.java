package com.goodokm.payment;

import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @GetMapping
  public List<Payment> getPayments(@RequestParam(required = false) Long subscriptionId) {
    return paymentService.getPayments(subscriptionId);
  }

  @PostMapping
  public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentRequest request) {
    Payment payment = new Payment();
    payment.setSubscriptionId(request.subscriptionId());
    payment.setBillingDate(LocalDate.parse(request.billingDate()));
    payment.setAmount(request.amount());
    payment.setStatus(request.status());

    Payment saved = paymentService.create(payment);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  public record CreatePaymentRequest(
      Long subscriptionId,
      String billingDate,
      Integer amount,
      String status
  ) {}
}
