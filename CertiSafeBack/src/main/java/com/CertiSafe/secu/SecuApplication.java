package com.CertiSafe.secu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SecuApplication {

	public static void main(String[] args) {
		SpringApplication.run(SecuApplication.class, args);
	}

}
