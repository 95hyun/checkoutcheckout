package com.toy.checkoutcheckout.domain.timer.controller;

import com.toy.checkoutcheckout.domain.timer.dto.DailyStudyTimeResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerSessionResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerStatusResponse;
import com.toy.checkoutcheckout.domain.timer.service.TimerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timer")
@RequiredArgsConstructor
public class TimerController {

    private final TimerService timerService;

    @PostMapping("/start")
    public ResponseEntity<TimerSessionResponse> startTimer(Authentication authentication) {
        String email = authentication.getName();
        TimerSessionResponse response = timerService.startTimer(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stop")
    public ResponseEntity<TimerSessionResponse> stopTimer(Authentication authentication) {
        String email = authentication.getName();
        TimerSessionResponse response = timerService.stopTimer(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<TimerStatusResponse> getTimerStatus(Authentication authentication) {
        String email = authentication.getName();
        TimerStatusResponse response = timerService.getTimerStatus(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<DailyStudyTimeResponse> getStudyTimeHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(30)}") 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        String email = authentication.getName();
        DailyStudyTimeResponse response = timerService.getStudyTimeHistory(email, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<TimerSessionResponse>> getRecentSessions(Authentication authentication) {
        String email = authentication.getName();
        List<TimerSessionResponse> sessions = timerService.getRecentSessions(email);
        return ResponseEntity.ok(sessions);
    }
}
