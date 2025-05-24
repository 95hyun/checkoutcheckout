package com.toy.checkoutcheckout.global.error;

public class AuthBusinessException extends BusinessException {
    
    public static final AuthBusinessException EMAIL_ALREADY_EXISTS = new AuthBusinessException(
            ErrorCode.DUPLICATE_EMAIL
    );
    
    public static final AuthBusinessException NICKNAME_ALREADY_EXISTS = new AuthBusinessException(
            ErrorCode.DUPLICATE_NICKNAME
    );
    
    public static final AuthBusinessException LOGIN_FAILED = new AuthBusinessException(
            ErrorCode.INVALID_CREDENTIALS
    );

    public AuthBusinessException(String message, String code) {
        super(message, code);
    }
    
    public AuthBusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public AuthBusinessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
