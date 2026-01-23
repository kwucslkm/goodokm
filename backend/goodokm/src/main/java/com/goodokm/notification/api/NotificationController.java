package com.goodokm.notification.api;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import com.goodokm.common.response.ApiResponse;
import com.goodokm.notification.application.NotificationService;
import com.goodokm.notification.domain.Notification;
import com.goodokm.notification.dto.CreateNotificationRequest;
import com.goodokm.notification.dto.NotificationResponse;
import com.goodokm.notification.mapper.NotificationMapper;
import jakarta.validation.Valid;
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
  public ApiResponse<List<NotificationResponse>> getNotifications(
      @RequestParam(required = false) Long userId
  ) {
    var notifications = notificationService.getNotifications(userId).stream()
        .map(NotificationMapper::toResponse)
        .collect(Collectors.toList());
    return ApiResponse.ok(notifications);
  }

  @PostMapping
  public ResponseEntity<ApiResponse<NotificationResponse>> createNotification(
      @Valid @RequestBody CreateNotificationRequest request
  ) {
    Notification notification = new Notification();
    notification.setUserId(request.userId());
    notification.setSubscriptionId(request.subscriptionId());
    notification.setNotifyDate(LocalDate.parse(request.notifyDate()));
    notification.setNotifyType(request.notifyType());
    notification.setSentYn(request.sentYn());

    Notification saved = notificationService.create(notification);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.ok(NotificationMapper.toResponse(saved)));
  }
}
