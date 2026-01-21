# Project Structure

```
goodokm/
├─ README.md
├─ STRUCTURE.md
├─ backend/
│  └─ goodokm/
│     ├─ build.gradle
│     ├─ settings.gradle
│     ├─ script/
│     │  ├─ ddl.sql
│     │  └─ dml.sql
│     └─ src/
│        ├─ main/
│        │  ├─ java/
│        │  │  └─ com/goodokm/
│        │  │     ├─ GoodokmApplication.java
│        │  │     ├─ auth/ (removed: replaced by user controller)
│        │  │     ├─ billing/
│        │  │     │  ├─ BillingService.java
│        │  │     │  └─ BillingScheduler.java
│        │  │     ├─ common/
│        │  │     │  ├─ ApiResponse.java
│        │  │     │  └─ BaseEntity.java
│        │  │     ├─ config/
│        │  │     │  ├─ PasswordConfig.java
│        │  │     │  └─ WebConfig.java
│        │  │     ├─ notification/
│        │  │     │  ├─ Notification.java
│        │  │     │  ├─ NotificationController.java
│        │  │     │  ├─ NotificationRepository.java
│        │  │     │  └─ NotificationService.java
│        │  │     ├─ payment/
│        │  │     │  ├─ Payment.java
│        │  │     │  ├─ PaymentController.java
│        │  │     │  ├─ PaymentRepository.java
│        │  │     │  └─ PaymentService.java
│        │  │     ├─ subscription/
│        │  │     │  ├─ Subscription.java
│        │  │     │  ├─ SubscriptionController.java
│        │  │     │  ├─ SubscriptionRepository.java
│        │  │     │  └─ SubscriptionService.java
│        │  │     └─ user/
│        │  │        ├─ User.java
│        │  │        ├─ UserController.java
│        │  │        ├─ UserRepository.java
│        │  │        └─ UserService.java
│        │  └─ resources/
│        │     └─ application.yml
│        └─ test/
│           └─ java/com/goodokm/GoodokmApplicationTests.java
└─ frontend/
   ├─ app/
   │  ├─ layout.tsx
   │  ├─ globals.css
   │  ├─ page.tsx
   │  ├─ login/page.tsx
   │  ├─ signup/page.tsx
   │  ├─ dashboard/page.tsx
   │  └─ subscriptions/
   │     ├─ page.tsx
   │     ├─ new/page.tsx
   │     └─ canceled/page.tsx
   ├─ src/
   │  ├─ components/
   │  │  ├─ Header.tsx
   │  │  └─ SubscriptionList.tsx
   │  └─ lib/
   │     └─ api.ts
   ├─ .env.local
   ├─ package.json
   └─ tsconfig.json
```
