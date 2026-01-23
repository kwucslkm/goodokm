package com.goodokm.notification.domain;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository {
  List<Notification> findAll();
  List<Notification> findByUserId(Long userId);
  Optional<Notification> findById(Long id);
  Notification save(Notification notification);
}
