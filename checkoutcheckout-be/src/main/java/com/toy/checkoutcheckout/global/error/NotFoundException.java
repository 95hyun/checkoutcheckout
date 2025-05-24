package com.toy.checkoutcheckout.global.error;

import org.springframework.http.HttpStatus;

/**
 * 요청한 리소스를 찾을 수 없을 때 사용하는 예외
 */
public class NotFoundException extends BusinessException {

    public NotFoundException(String message) {
        super(ErrorCode.ENTITY_NOT_FOUND);
    }
    
    public NotFoundException(String message, String code) {
        super(message, code);
    }
    
    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public NotFoundException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
