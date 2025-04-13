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
public class TimerSessionResponse {
    
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long duration;  // 초 단위
    
    public static TimerSessionResponse from(TimerSession timerSession) {
        Long duration = timerSession.getDuration();
        if (duration == null && timerSession.isActive()) {
            // 활성화된 세션이면서 duration이 null인 경우 현재까지의 시간 계산
            duration = timerSession.getCurrentDuration();
        }
        
        return TimerSessionResponse.builder()
                .id(timerSession.getId())
                .startTime(timerSession.getStartTime())
                .endTime(timerSession.getEndTime())
                .duration(duration)
                .build();
    }
}
