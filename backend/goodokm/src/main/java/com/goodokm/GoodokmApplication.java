package com.goodokm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GoodokmApplication {

  public static void main(String[] args) {
    SpringApplication.run(GoodokmApplication.class, args);
  }

}
