package com.goodokm.notification;

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
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public List<Notification> getNotifications(@RequestParam(required = false) Long userId) {
    return notificationService.getNotifications(userId);
  }

  @PostMapping
  public ResponseEntity<Notification> createNotification(
      @RequestBody CreateNotificationRequest request) {
    Notification notification = new Notification();
    notification.setUserId(request.userId());
    notification.setSubscriptionId(request.subscriptionId());
    notification.setNotifyDate(LocalDate.parse(request.notifyDate()));
    notification.setNotifyType(request.notifyType());
    notification.setSentYn(request.sentYn());

    Notification saved = notificationService.create(notification);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
  }

  public record CreateNotificationRequest(
      Long userId,
      Long subscriptionId,
      String notifyDate,
      String notifyType,
      Boolean sentYn
  ) {}
}
