package com.toy.checkoutcheckout.global.error;

public class TimerBusinessException extends BusinessException {
    
    public static final TimerBusinessException TIMER_ALREADY_ACTIVE = new TimerBusinessException(
            ErrorCode.TIMER_ALREADY_STARTED
    );
    
    public static final TimerBusinessException NO_ACTIVE_TIMER = new TimerBusinessException(
            ErrorCode.TIMER_NOT_STARTED
    );

    public TimerBusinessException(String message, String code) {
        super(message, code);
    }
    
    public TimerBusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public TimerBusinessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
