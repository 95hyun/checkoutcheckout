package com.toy.checkoutcheckout.global.error;

public class AuthBusinessException extends BusinessException {
    
    public static final AuthBusinessException EMAIL_ALREADY_EXISTS = new AuthBusinessException(
            "이미 가입된 이메일입니다.", 
            "EMAIL_ALREADY_EXISTS"
    );
    
    public static final AuthBusinessException NICKNAME_ALREADY_EXISTS = new AuthBusinessException(
            "이미 사용 중인 닉네임입니다.", 
            "NICKNAME_ALREADY_EXISTS"
    );
    
    public static final AuthBusinessException LOGIN_FAILED = new AuthBusinessException(
            "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.", 
            "LOGIN_FAILED"
    );

    public AuthBusinessException(String message, String code) {
        super(message, code);
    }
}
