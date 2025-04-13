package com.toy.checkoutcheckout.domain.timer.service;

import com.toy.checkoutcheckout.domain.timer.dto.DailyStudyTimeResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerSessionResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerStatusResponse;
import com.toy.checkoutcheckout.domain.timer.entity.TimerSession;
import com.toy.checkoutcheckout.domain.timer.repository.TimerSessionRepository;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimerService {

    private final TimerSessionRepository timerSessionRepository;
    private final UserRepository userRepository;

    @Transactional
    public TimerSessionResponse startTimer(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 이미 활성화된 타이머가 있는지 확인
        timerSessionRepository.findByUserAndIsActiveTrue(user).ifPresent(activeSession -> {
            throw com.toy.checkoutcheckout.global.error.TimerBusinessException.TIMER_ALREADY_ACTIVE;
        });

        LocalDateTime now = LocalDateTime.now();
        
        TimerSession timerSession = TimerSession.builder()
                .user(user)
                .startTime(now)
                .isActive(true)
                .duration(0L) // 명시적으로 0으로 초기화
                .sessionDate(now.toLocalDate()) // 명시적으로 현재 날짜 설정
                .build();

        TimerSession savedSession = timerSessionRepository.save(timerSession);
        
        // 로깅을 추가하여 디버깅 정보 확인 (실제 운영에서는 제거)
        System.out.println("Timer started - ID: " + savedSession.getId() + 
                          ", StartTime: " + savedSession.getStartTime() + 
                          ", IsActive: " + savedSession.isActive());
                          
        return TimerSessionResponse.from(savedSession);
    }

    @Transactional
    public TimerSessionResponse stopTimer(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        TimerSession activeSession = timerSessionRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> com.toy.checkoutcheckout.global.error.TimerBusinessException.NO_ACTIVE_TIMER);

        // 타이머 중지 처리
        activeSession.stopTimer();
        
        // 저장 및 변경사항 확인
        TimerSession savedSession = timerSessionRepository.save(activeSession);
        
        // 로깅을 추가하여 디버깅 정보 확인 (실제 운영에서는 제거)
        System.out.println("Timer stopped - ID: " + savedSession.getId() + 
                          ", Duration: " + savedSession.getDuration() + 
                          ", EndTime: " + savedSession.getEndTime() +
                          ", IsActive: " + savedSession.isActive());
        
        return TimerSessionResponse.from(savedSession);
    }

    @Transactional(readOnly = true)
    public TimerStatusResponse getTimerStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        TimerSession activeSession = timerSessionRepository.findByUserAndIsActiveTrue(user).orElse(null);
        return TimerStatusResponse.from(activeSession);
    }

    @Transactional(readOnly = true)
    public DailyStudyTimeResponse getStudyTimeHistory(String email, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<Object[]> results = timerSessionRepository.findDailyStudyTimeByUserAndDateRange(user, startDate, endDate);
        
        Map<LocalDate, Long> dailyStudyTimes = new HashMap<>();
        
        // 기간 내 모든 날짜에 대해 0초로 초기화
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            dailyStudyTimes.put(currentDate, 0L);
            currentDate = currentDate.plusDays(1);
        }
        
        // 실제 공부 기록이 있는 날짜만 업데이트
        for (Object[] result : results) {
            LocalDate date = (LocalDate) result[0];
            Long duration = (Long) result[1];
            dailyStudyTimes.put(date, duration);
        }

        return DailyStudyTimeResponse.from(dailyStudyTimes);
    }

    @Transactional(readOnly = true)
    public List<TimerSessionResponse> getRecentSessions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<TimerSession> sessions = timerSessionRepository.findByUserOrderByStartTimeDesc(user);
        return sessions.stream()
                .map(TimerSessionResponse::from)
                .collect(Collectors.toList());
    }
}
