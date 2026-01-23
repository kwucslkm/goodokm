package com.goodokm.payment.infra;

import com.goodokm.payment.domain.Payment;
import com.goodokm.payment.domain.PaymentRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentJpaRepository extends JpaRepository<Payment, Long>, PaymentRepository {
}
