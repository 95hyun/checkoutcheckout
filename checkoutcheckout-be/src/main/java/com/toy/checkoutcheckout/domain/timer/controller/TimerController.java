package com.toy.checkoutcheckout.domain.timer.controller;

import com.toy.checkoutcheckout.domain.timer.dto.DailyStudyTimeResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerSessionResponse;
import com.toy.checkoutcheckout.domain.timer.dto.TimerStatusResponse;
import com.toy.checkoutcheckout.domain.timer.service.TimerService;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timer")
@RequiredArgsConstructor
public class TimerController {

    private final TimerService timerService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<TimerSessionResponse>> startTimer(@AuthenticationPrincipal CurrentUser currentUser) {
        TimerSessionResponse response = timerService.startTimer(currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/stop")
    public ResponseEntity<ApiResponse<TimerSessionResponse>> stopTimer(@AuthenticationPrincipal CurrentUser currentUser) {
        TimerSessionResponse response = timerService.stopTimer(currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<TimerStatusResponse>> getTimerStatus(@AuthenticationPrincipal CurrentUser currentUser) {
        TimerStatusResponse response = timerService.getTimerStatus(currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<DailyStudyTimeResponse>> getStudyTimeHistory(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(30)}") 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        DailyStudyTimeResponse response = timerService.getStudyTimeHistory(currentUser.getEmail(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<TimerSessionResponse>>> getRecentSessions(@AuthenticationPrincipal CurrentUser currentUser) {
        List<TimerSessionResponse> sessions = timerService.getRecentSessions(currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }
}
