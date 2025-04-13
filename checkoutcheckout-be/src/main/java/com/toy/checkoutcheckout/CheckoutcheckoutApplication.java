package com.toy.checkoutcheckout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CheckoutcheckoutApplication {

    public static void main(String[] args) {
        SpringApplication.run(CheckoutcheckoutApplication.class, args);
    }

}
