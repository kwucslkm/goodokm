package com.goodokm.billing;

import java.time.LocalDate;
import java.util.List;
import com.goodokm.notification.Notification;
import com.goodokm.notification.NotificationRepository;
import com.goodokm.payment.Payment;
import com.goodokm.payment.PaymentRepository;
import com.goodokm.subscription.Subscription;
import com.goodokm.subscription.SubscriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class BillingService {

  private final SubscriptionRepository subscriptionRepository;
  private final PaymentRepository paymentRepository;
  private final NotificationRepository notificationRepository;

  public BillingService(
      SubscriptionRepository subscriptionRepository,
      PaymentRepository paymentRepository,
      NotificationRepository notificationRepository
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.paymentRepository = paymentRepository;
    this.notificationRepository = notificationRepository;
  }

  public void generateBillingArtifacts(LocalDate targetDate) {
    List<Subscription> subscriptions = subscriptionRepository.findAll();
    for (Subscription subscription : subscriptions) {
      if (!targetDate.equals(subscription.getNextBillingDate())) {
        continue;
      }

      Payment payment = new Payment();
      payment.setSubscriptionId(subscription.getId());
      payment.setBillingDate(subscription.getNextBillingDate());
      payment.setAmount(subscription.getAmount());
      payment.setStatus("EXPECTED");
      paymentRepository.save(payment);

      Notification notification = new Notification();
      notification.setUserId(subscription.getUserId());
      notification.setSubscriptionId(subscription.getId());
      notification.setNotifyDate(subscription.getNextBillingDate().minusDays(1));
      notification.setNotifyType("EMAIL");
      notification.setSentYn(false);
      notificationRepository.save(notification);
    }
  }
}
