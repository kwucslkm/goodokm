package com.goodokm.payment.api;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.goodokm.common.response.ApiResponse;
import com.goodokm.payment.application.PaymentService;
import com.goodokm.payment.domain.Payment;
import com.goodokm.payment.dto.CreatePaymentRequest;
import com.goodokm.payment.dto.PaymentResponse;
import com.goodokm.payment.mapper.PaymentMapper;
import jakarta.validation.Valid;
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
  public ApiResponse<List<PaymentResponse>> getPayments(
      @RequestParam(required = false) Long subscriptionId
  ) {
    var payments = paymentService.getPayments(subscriptionId).stream()
        .map(PaymentMapper::toResponse)
        .collect(Collectors.toList());
    return ApiResponse.ok(payments);
  }

  @PostMapping
  public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(
      @Valid @RequestBody CreatePaymentRequest request
  ) {
    Payment payment = new Payment();
    payment.setSubscriptionId(request.subscriptionId());
    payment.setBillingDate(LocalDate.parse(request.billingDate()));
    payment.setAmount(request.amount());
    payment.setStatus(request.status());

    Payment saved = paymentService.create(payment);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(PaymentMapper.toResponse(saved)));
  }
}
