package com.goodokm.notification.mapper;

import com.goodokm.notification.domain.Notification;
import com.goodokm.notification.dto.NotificationResponse;

public final class NotificationMapper {

  private NotificationMapper() {}

  public static NotificationResponse toResponse(Notification notification) {
    return new NotificationResponse(
        notification.getId(),
        notification.getUserId(),
        notification.getSubscriptionId(),
        notification.getNotifyDate(),
        notification.getNotifyType(),
        notification.getSentYn()
    );
  }
}
