package com.toy.checkoutcheckout.domain.rank.controller;

import com.toy.checkoutcheckout.domain.rank.dto.DailyRankingResponse;
import com.toy.checkoutcheckout.domain.rank.dto.StudyMemberRankingResponse;
import com.toy.checkoutcheckout.domain.rank.dto.StudyRankingResponse;
import com.toy.checkoutcheckout.domain.rank.service.RankService;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/ranks")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<DailyRankingResponse>> getDailyRanking(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now();
        }
        
        DailyRankingResponse response = rankService.getDailyRanking(date);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디별 일일 랭킹
    @GetMapping("/studies/daily")
    public ResponseEntity<ApiResponse<StudyRankingResponse>> getDailyStudyRanking(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now();
        }
        
        StudyRankingResponse response = rankService.getDailyStudyRanking(date);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디별 주간 랭킹
    @GetMapping("/studies/weekly")
    public ResponseEntity<ApiResponse<StudyRankingResponse>> getWeeklyStudyRanking(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        StudyRankingResponse response = rankService.getWeeklyStudyRanking(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디별 월간 랭킹
    @GetMapping("/studies/monthly")
    public ResponseEntity<ApiResponse<StudyRankingResponse>> getMonthlyStudyRanking(
            @RequestParam int year,
            @RequestParam int month) {
        
        StudyRankingResponse response = rankService.getMonthlyStudyRanking(year, month);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디 내 일일 랭킹
    @GetMapping("/studies/{studyId}/daily")
    public ResponseEntity<ApiResponse<StudyMemberRankingResponse>> getStudyMemberDailyRanking(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now();
        }
        
        StudyMemberRankingResponse response = rankService.getStudyMemberDailyRanking(
                currentUser.getUserId(), studyId, date);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디 내 주간 랭킹
    @GetMapping("/studies/{studyId}/weekly")
    public ResponseEntity<ApiResponse<StudyMemberRankingResponse>> getStudyMemberWeeklyRanking(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        StudyMemberRankingResponse response = rankService.getStudyMemberWeeklyRanking(
                currentUser.getUserId(), studyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    // 스터디 내 월간 랭킹
    @GetMapping("/studies/{studyId}/monthly")
    public ResponseEntity<ApiResponse<StudyMemberRankingResponse>> getStudyMemberMonthlyRanking(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @RequestParam int year,
            @RequestParam int month) {
        
        StudyMemberRankingResponse response = rankService.getStudyMemberMonthlyRanking(
                currentUser.getUserId(), studyId, year, month);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}