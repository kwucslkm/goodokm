package com.goodokm.subscription;

import java.time.LocalDate;
import com.goodokm.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
public class Subscription extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, length = 50)
  private String category;

  @Column(name = "billing_cycle", nullable = false, length = 20)
  private String billingCycle;

  @Column(nullable = false)
  private Integer amount;

  @Column(name = "next_billing_date", nullable = false)
  private LocalDate nextBillingDate;

  @Column(length = 20)
  private String status;

  private String memo;

}
