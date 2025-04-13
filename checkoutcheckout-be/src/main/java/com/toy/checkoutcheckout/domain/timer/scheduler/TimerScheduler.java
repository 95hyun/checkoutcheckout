package com.toy.checkoutcheckout.domain.timer.scheduler;

import com.toy.checkoutcheckout.domain.timer.entity.TimerSession;
import com.toy.checkoutcheckout.domain.timer.repository.TimerSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class TimerScheduler {

    private final TimerSessionRepository timerSessionRepository;

    /**
     * 매일 자정(00:00)에 실행되는 스케줄러
     * 미종료된 활성 타이머 세션을 강제 종료하고 다음 날로 넘기지 않음
     */
    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 실행
    @Transactional
    public void closeActiveTimersAtMidnight() {
        log.info("Executing timer session cleanup at midnight");
        
        // 활성화된 모든 타이머 세션 조회
        List<TimerSession> activeSessions = timerSessionRepository.findAll().stream()
                .filter(TimerSession::isActive)
                .toList();
        
        log.info("Found {} active timer sessions to close", activeSessions.size());
        
        LocalDateTime now = LocalDateTime.now();
        
        // 각 세션을 종료 처리
        for (TimerSession session : activeSessions) {
            session.stopTimer();
            timerSessionRepository.save(session);
            log.info("Closed timer session: {}", session.getId());
        }
    }
}
