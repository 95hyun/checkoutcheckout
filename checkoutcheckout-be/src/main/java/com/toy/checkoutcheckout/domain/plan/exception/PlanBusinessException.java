package com.toy.checkoutcheckout.domain.plan.exception;

import com.toy.checkoutcheckout.global.error.BusinessException;
import com.toy.checkoutcheckout.global.error.ErrorCode;

public class PlanBusinessException extends BusinessException {
    
    public static final PlanBusinessException PLAN_NOT_FOUND = new PlanBusinessException(
            ErrorCode.PLAN_NOT_FOUND
    );
    
    public static final PlanBusinessException INVALID_PLAN_DATE = new PlanBusinessException(
            ErrorCode.INVALID_PLAN_DATE
    );

    public PlanBusinessException(ErrorCode errorCode) {
        super(errorCode);
    }
    
    public PlanBusinessException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
