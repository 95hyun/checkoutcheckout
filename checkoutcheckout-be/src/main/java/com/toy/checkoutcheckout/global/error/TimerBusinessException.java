package com.toy.checkoutcheckout.global.error;

import org.springframework.http.HttpStatus;

public class TimerBusinessException extends BusinessException {
    
    public static final TimerBusinessException TIMER_ALREADY_ACTIVE = new TimerBusinessException(
            "이미 활성화된 타이머가 있습니다.", 
            "TIMER_ALREADY_ACTIVE"
    );
    
    public static final TimerBusinessException NO_ACTIVE_TIMER = new TimerBusinessException(
            "활성화된 타이머가 없습니다.", 
            "NO_ACTIVE_TIMER"
    );

    public TimerBusinessException(String message, String code) {
        super(message, code);
    }
}
