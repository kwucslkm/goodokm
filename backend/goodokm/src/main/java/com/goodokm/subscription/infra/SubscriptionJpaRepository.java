package com.goodokm.subscription.infra;

import com.goodokm.subscription.domain.Subscription;
import com.goodokm.subscription.domain.SubscriptionRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionJpaRepository extends JpaRepository<Subscription, Long>, SubscriptionRepository {
}
