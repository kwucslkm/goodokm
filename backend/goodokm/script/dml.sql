-- DML

-- 유저 데이터
INSERT INTO users (email, password)
VALUES ('test@goodokm.com', 'password123');


-- 구독 데이터
INSERT INTO subscriptions
(user_id, name, category, billing_cycle, amount, next_billing_date, memo)
VALUES
    (1, 'Netflix', 'VIDEO', 'MONTHLY', 17000, '2026-02-01', '프리미엄'),
    (1, '쿠팡와우', 'SHOPPING', 'MONTHLY', 4990, '2026-01-28', ''),
    (1, 'MS 365', 'WORK', 'YEARLY', 119000, '2026-05-10', '개발용')
;

-- 결제 예정 데이터
INSERT INTO payments
(subscription_id, billing_date, amount, status)
VALUES
    (1, '2026-02-01', 17000, 'EXPECTED'),
    (2, '2026-01-28', 4990, 'EXPECTED'),
    (3, '2026-05-10', 119000, 'EXPECTED')
;

-- 알림 테스트 데이터
INSERT INTO notifications
(user_id, subscription_id, notify_date, notify_type)
VALUES
    (1, 1, '2026-01-29', 'EMAIL'),
    (1, 2, '2026-01-27', 'EMAIL');
