package com.toy.checkoutcheckout.global.error;

public class CharacterBusinessException extends BusinessException {
    private static final String DEFAULT_ERROR_CODE = "CHARACTER_ERROR";
    
    public CharacterBusinessException(String message) {
        super(message, DEFAULT_ERROR_CODE);
    }
    
    public CharacterBusinessException(String message, String code) {
        super(message, code);
    }
}
