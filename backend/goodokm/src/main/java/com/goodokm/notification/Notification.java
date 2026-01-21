package com.goodokm.notification;

import java.time.LocalDate;
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
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "subscription_id", nullable = false)
  private Long subscriptionId;

  @Column(name = "notify_date", nullable = false)
  private LocalDate notifyDate;

  @Column(name = "notify_type", nullable = false, length = 20)
  private String notifyType;

  @Column(name = "sent_yn")
  private Boolean sentYn;
}
