package com.goodokm.notification.infra;

import com.goodokm.notification.domain.Notification;
import com.goodokm.notification.domain.NotificationRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationJpaRepository extends JpaRepository<Notification, Long>, NotificationRepository {
}
