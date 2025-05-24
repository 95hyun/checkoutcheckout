package com.toy.checkoutcheckout.global.error;

import org.springframework.http.HttpStatus;

/**
 * 잘못된 요청 매개변수나 값에 대한 예외
 */
public class BadRequestException extends BusinessException {

    public BadRequestException(String message) {
        super(ErrorCode.INVALID_INPUT_VALUE);
    }
    
    public BadRequestException(String message, String code) {
        super(message, code);
    }
    
    public BadRequestException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public BadRequestException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
