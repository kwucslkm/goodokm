package com.goodokm.notification.application;

import java.util.List;
import com.goodokm.notification.domain.Notification;
import com.goodokm.notification.domain.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

  private final NotificationRepository notificationRepository;

  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public List<Notification> getNotifications(Long userId) {
    if (userId == null) {
      return notificationRepository.findAll();
    }
    return notificationRepository.findByUserId(userId);
  }

  public Notification create(Notification notification) {
    return notificationRepository.save(notification);
  }
}
