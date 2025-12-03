package com.engihub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
// import org.springframework.boot.autoconfigure.domain.EntityScan; // Remove if not found

@SpringBootApplication
@ComponentScan(basePackages = "com.engihub.backend")
@EnableJpaRepositories(basePackages = "com.engihub.backend.repository")
@EnableScheduling
// @EntityScan(basePackages = "com.engihub.backend.model") // Remove if import fails
public class EngihubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EngihubBackendApplication.class, args);
    }
}