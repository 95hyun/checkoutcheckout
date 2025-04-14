package com.toy.checkoutcheckout.domain.study.controller;

import com.toy.checkoutcheckout.domain.study.dto.*;
import com.toy.checkoutcheckout.domain.study.service.StudyService;
import com.toy.checkoutcheckout.global.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/studies")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;

    @PostMapping
    public ResponseEntity<ApiResponse<StudyResponse>> createStudy(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody StudyRequest request) {
        StudyResponse response = studyService.createStudy(currentUser.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyResponse>>> getAllStudies(
            @AuthenticationPrincipal CurrentUser currentUser) {
        List<StudyResponse> response = studyService.getAllStudies(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<StudyResponse>>> getMyStudies(
            @AuthenticationPrincipal CurrentUser currentUser) {
        List<StudyResponse> response = studyService.getMyStudies(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{studyId}")
    public ResponseEntity<ApiResponse<StudyDetailResponse>> getStudyDetail(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId) {
        StudyDetailResponse response = studyService.getStudyDetail(currentUser.getUserId(), studyId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{studyId}")
    public ResponseEntity<ApiResponse<StudyResponse>> updateStudy(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @Valid @RequestBody StudyRequest request) {
        StudyResponse response = studyService.updateStudy(currentUser.getUserId(), studyId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{studyId}")
    public ResponseEntity<ApiResponse<Void>> deleteStudy(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId) {
        studyService.deleteStudy(currentUser.getUserId(), studyId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{studyId}/join")
    public ResponseEntity<ApiResponse<Void>> joinStudy(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @RequestBody(required = false) StudyJoinRequest request) {
        // 비밀번호가 필요한 경우에만 request가 필요하므로 null 허용
        studyService.joinStudy(currentUser.getUserId(), studyId, request);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{studyId}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveStudy(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId) {
        studyService.leaveStudy(currentUser.getUserId(), studyId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{studyId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> kickMember(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @PathVariable Long userId) {
        studyService.kickMember(currentUser.getUserId(), studyId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{studyId}/members/{userId}/admin")
    public ResponseEntity<ApiResponse<Void>> makeAdmin(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @PathVariable Long userId) {
        studyService.makeAdmin(currentUser.getUserId(), studyId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{studyId}/members/{userId}/admin")
    public ResponseEntity<ApiResponse<Void>> removeAdmin(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @PathVariable Long userId) {
        studyService.removeAdmin(currentUser.getUserId(), studyId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{studyId}/join-requests")
    public ResponseEntity<ApiResponse<List<StudyJoinRequestResponse>>> getJoinRequests(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId) {
        List<StudyJoinRequestResponse> response = studyService.getJoinRequests(currentUser.getUserId(), studyId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{studyId}/join-requests/{requestId}/approve")
    public ResponseEntity<ApiResponse<Void>> approveJoinRequest(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @PathVariable Long requestId) {
        studyService.approveJoinRequest(currentUser.getUserId(), studyId, requestId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{studyId}/join-requests/{requestId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectJoinRequest(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable Long studyId,
            @PathVariable Long requestId) {
        studyService.rejectJoinRequest(currentUser.getUserId(), studyId, requestId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
