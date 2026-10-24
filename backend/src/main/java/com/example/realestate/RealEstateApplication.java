package com.example.realestate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class RealEstateApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealEstateApplication.class, args);
    }
}
