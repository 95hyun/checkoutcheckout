package com.toy.checkoutcheckout.domain.plan.controller;

import com.toy.checkoutcheckout.domain.plan.dto.StudyPlanDto;
import com.toy.checkoutcheckout.domain.plan.service.StudyPlanService;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Slf4j
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    // 특정 날짜의 계획 조회
    @GetMapping("/{date}")
    public ResponseEntity<ApiResponse<StudyPlanDto.Response>> getPlanByDate(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        log.info("계획 조회 요청: userId={}, date={}", currentUser.getUserId(), date);
        StudyPlanDto.Response response = studyPlanService.getPlanByDate(currentUser.getUserId(), date);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 특정 기간의 계획 조회
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyPlanDto.Response>>> getPlansByDateRange(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        log.info("기간별 계획 조회 요청: userId={}, startDate={}, endDate={}", 
                currentUser.getUserId(), startDate, endDate);
        List<StudyPlanDto.Response> response = studyPlanService.getPlansByDateRange(
                currentUser.getUserId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // 계획 생성 또는 업데이트
    @PostMapping("/{date}")
    public ResponseEntity<ApiResponse<StudyPlanDto.Response>> savePlan(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
            @RequestBody StudyPlanDto.Request request) {
        log.info("계획 저장 요청: userId={}, date={}, content={}, plannedDuration={}", 
                currentUser.getUserId(), date, request.getContent(), request.getPlannedDuration());
        StudyPlanDto.Response response = studyPlanService.savePlan(
                currentUser.getUserId(), date, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    // 계획 삭제
    @DeleteMapping("/{date}")
    public ResponseEntity<ApiResponse<Void>> deletePlan(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        log.info("계획 삭제 요청: userId={}, date={}", currentUser.getUserId(), date);
        studyPlanService.deletePlan(currentUser.getUserId(), date);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // 계획 완료 처리
    @PatchMapping("/{date}/complete")
    public ResponseEntity<ApiResponse<StudyPlanDto.Response>> completePlan(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        log.info("계획 완료 처리 요청: userId={}, date={}", currentUser.getUserId(), date);
        StudyPlanDto.Response response = studyPlanService.completePlan(
                currentUser.getUserId(), date);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
