package com.goodokm.billing;

import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BillingScheduler {

  private final BillingService billingService;

  public BillingScheduler(BillingService billingService) {
    this.billingService = billingService;
  }

  @Scheduled(cron = "0 0 1 * * *")
  public void runDailyBilling() {
    billingService.generateBillingArtifacts(LocalDate.now());
  }
}
