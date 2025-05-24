package com.toy.checkoutcheckout.global.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {
    
    private final String code;
    private final ErrorCode errorCode;
    
    public BusinessException(String message, String code) {
        super(message);
        this.code = code;
        this.errorCode = null;
    }
    
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.code = errorCode.getCode();
    }
    
    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.code = errorCode.getCode();
    }
    
    public HttpStatus getStatus() {
        return errorCode != null ? errorCode.getStatus() : null;
    }
}
