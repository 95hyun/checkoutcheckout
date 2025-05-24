package com.toy.checkoutcheckout.global.error;

public class CharacterBusinessException extends BusinessException {
    
    public static final CharacterBusinessException CHARACTER_NOT_FOUND = new CharacterBusinessException(
            ErrorCode.CHARACTER_NOT_FOUND
    );
    
    public static final CharacterBusinessException CHARACTER_ALREADY_ACQUIRED = new CharacterBusinessException(
            ErrorCode.CHARACTER_ALREADY_ACQUIRED
    );

    public CharacterBusinessException(String message, String code) {
        super(message, code);
    }
    
    public CharacterBusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public CharacterBusinessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
