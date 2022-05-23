package com.ahlquist.smileconsoleplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class SmileConsolePlusApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmileConsolePlusApplication.class, args);
    }

}
