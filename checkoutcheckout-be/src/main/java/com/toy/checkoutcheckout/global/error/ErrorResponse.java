package com.toy.checkoutcheckout.global.error;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class ErrorResponse {

    private String message;
    private HttpStatus status;
    private String code;
    private LocalDateTime timestamp;

    @Builder
    public ErrorResponse(String message, HttpStatus status, String code) {
        this.message = message;
        this.status = status;
        this.code = code;
        this.timestamp = LocalDateTime.now();
    }
}
