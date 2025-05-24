package com.toy.checkoutcheckout.global.error;

import org.springframework.http.HttpStatus;

/**
 * 접근 권한이 없는 경우에 사용하는 예외
 */
public class ForbiddenException extends BusinessException {

    public ForbiddenException(String message) {
        super(ErrorCode.ACCESS_DENIED);
    }
    
    public ForbiddenException(String message, String code) {
        super(message, code);
    }
    
    public ForbiddenException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public ForbiddenException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
