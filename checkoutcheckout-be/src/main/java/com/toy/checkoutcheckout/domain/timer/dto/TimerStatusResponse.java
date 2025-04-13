package com.toy.checkoutcheckout.domain.timer.dto;

import com.toy.checkoutcheckout.domain.timer.entity.TimerSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimerStatusResponse {
    
    private boolean isActive;
    private LocalDateTime startTime;
    private Long currentDuration;  // 초 단위로 현재까지 경과한 시간
    
    public static TimerStatusResponse from(TimerSession timerSession) {
        if (timerSession == null) {
            return TimerStatusResponse.builder()
                    .isActive(false)
                    .build();
        }
        
        return TimerStatusResponse.builder()
                .isActive(timerSession.isActive())
                .startTime(timerSession.getStartTime())
                .currentDuration(timerSession.getCurrentDuration())
                .build();
    }
}
