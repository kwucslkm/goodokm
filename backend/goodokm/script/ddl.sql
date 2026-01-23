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
