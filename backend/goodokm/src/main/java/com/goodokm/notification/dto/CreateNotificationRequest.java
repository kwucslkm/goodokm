package com.goodokm.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateNotificationRequest(
    @NotNull(message = "User id is required.") Long userId,
    @NotNull(message = "Subscription id is required.") Long subscriptionId,
    @NotBlank(message = "Notify date is required.") String notifyDate,
    @NotBlank(message = "Notify type is required.") String notifyType,
    Boolean sentYn
) {}
