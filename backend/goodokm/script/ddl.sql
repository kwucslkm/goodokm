CREATE TABLE users (
                       id              BIGSERIAL PRIMARY KEY,
                       email           VARCHAR(255) NOT NULL UNIQUE,
                       password        VARCHAR(255) NOT NULL,
                       created_at      TIMESTAMP DEFAULT NOW(),
                       updated_at      TIMESTAMP DEFAULT NOW()
);

-- SUBSCRIPTION 테이블
DROP TABLE IF EXISTS subscriptions;

CREATE TABLE subscriptions (
                               id                  BIGSERIAL PRIMARY KEY,
                               user_id             BIGINT NOT NULL,
                               name                VARCHAR(100) NOT NULL,
                               category            VARCHAR(50) NOT NULL,
                               billing_cycle       VARCHAR(20) NOT NULL, -- MONTHLY, YEARLY
                               amount              INTEGER NOT NULL,
                               next_billing_date   DATE NOT NULL,
                               status              VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CANCELED
                               memo                TEXT,
                               created_at          TIMESTAMP DEFAULT NOW(),
                               updated_at          TIMESTAMP DEFAULT NOW(),
                               CONSTRAINT fk_subscription_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);
-- PAYMENT 테이블
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
                          id                  BIGSERIAL PRIMARY KEY,
                          subscription_id     BIGINT NOT NULL,
                          billing_date        DATE NOT NULL,
                          amount              INTEGER NOT NULL,
                          status              VARCHAR(20) NOT NULL, -- EXPECTED, PAID, SKIPPED
                          created_at          TIMESTAMP DEFAULT NOW(),
                          updated_at          TIMESTAMP DEFAULT NOW(),
                          CONSTRAINT fk_payment_subscription
                              FOREIGN KEY (subscription_id)
                                  REFERENCES subscriptions(id)
                                  ON DELETE CASCADE
);

-- NOTIFICATION 테이블
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
                               id                  BIGSERIAL PRIMARY KEY,
                               user_id             BIGINT NOT NULL,
                               subscription_id     BIGINT NOT NULL,
                               notify_date         DATE NOT NULL,
                               notify_type         VARCHAR(20) NOT NULL, -- EMAIL
                               sent_yn             BOOLEAN DEFAULT FALSE,
                               created_at          TIMESTAMP DEFAULT NOW(),
                               updated_at          TIMESTAMP DEFAULT NOW(),
                               CONSTRAINT fk_notification_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE,
                               CONSTRAINT fk_notification_subscription
                                   FOREIGN KEY (subscription_id)
                                       REFERENCES subscriptions(id)
                                       ON DELETE CASCADE
);

CREATE TABLE subscription_service (
                                      id BIGSERIAL PRIMARY KEY,
                                      name VARCHAR(100) NOT NULL,          -- 서비스명 (Netflix)
                                      provider VARCHAR(100),               -- 회사명 (Netflix Inc.)
                                      category VARCHAR(50),                -- video, music, cloud, ai, game ...
                                      monthly_price INTEGER,               -- 기본 월 구독료 (KRW 기준)
                                      yearly_price INTEGER,                -- 연간 요금 (optional)
                                      currency VARCHAR(10) DEFAULT 'KRW',
                                      logo_url TEXT,                       -- 로고 이미지 경로
                                      homepage_url TEXT,                   -- 공식 사이트
                                      description TEXT,                    -- 한 줄 설명
                                      is_active BOOLEAN DEFAULT TRUE,
                                      created_at TIMESTAMP DEFAULT NOW(),
                                      updated_at TIMESTAMP DEFAULT NOW()
);
-- 확장 플렌
CREATE TABLE subscription_service_plan (
                                           id BIGSERIAL PRIMARY KEY,
                                           service_id BIGINT REFERENCES subscription_service(id),
                                           plan_name VARCHAR(50),               -- Basic / Standard / Premium
                                           monthly_price INTEGER,
                                           yearly_price INTEGER,
                                           description TEXT
);
