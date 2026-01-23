package com.goodokm.notification.dto;

import java.time.LocalDate;

public record NotificationResponse(
    Long id,
    Long userId,
    Long subscriptionId,
    LocalDate notifyDate,
    String notifyType,
    Boolean sentYn
) {}
