package com.toy.checkoutcheckout.domain.auth.controller;

import com.toy.checkoutcheckout.domain.auth.dto.LoginRequest;
import com.toy.checkoutcheckout.domain.auth.dto.ProfileImageRequest;
import com.toy.checkoutcheckout.domain.auth.dto.SignupRequest;
import com.toy.checkoutcheckout.domain.auth.dto.TokenResponse;
import com.toy.checkoutcheckout.domain.auth.dto.UserResponse;
import com.toy.checkoutcheckout.domain.auth.service.AuthService;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(tokenResponse));
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal CurrentUser currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }
        
        log.info("사용자 정보 요청: userId={}", currentUser.getUserId());
        UserResponse userResponse = authService.getCurrentUser(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }
    
    /**
     * 캐릭터를 프로필 이미지로 설정하는 엔드포인트
     */
    @PostMapping("/profile/character")
    public ResponseEntity<ApiResponse<UserResponse>> setCharacterAsProfile(
            @Valid @RequestBody ProfileImageRequest request,
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        log.info("캐릭터 프로필 설정 요청: userId={}, characterType={}",
                currentUser != null ? currentUser.getUserId() : "null",
                request != null ? request.getCharacterType() : "null");
        
        if (currentUser == null) {
            log.warn("캐릭터 프로필 설정 실패: 인증되지 않은 사용자");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }
        
        try {
            UserResponse userResponse = authService.setCharacterAsProfile(request, currentUser.getUserId());
            log.info("캐릭터 프로필 설정 성공: userId={}, characterType={}", 
                    currentUser.getUserId(), userResponse.getCharacterType());
            return ResponseEntity.ok(ApiResponse.success(userResponse));
        } catch (Exception e) {
            log.error("캐릭터 프로필 설정 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("캐릭터 프로필 설정에 실패했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 프로필 이미지 제거 엔드포인트
     */
    @DeleteMapping("/profile/image")
    public ResponseEntity<ApiResponse<UserResponse>> removeProfileImage(
            @AuthenticationPrincipal CurrentUser currentUser) {
        
        log.info("프로필 이미지 제거 요청: userId={}", 
                currentUser != null ? currentUser.getUserId() : "null");
        
        if (currentUser == null) {
            log.warn("프로필 이미지 제거 실패: 인증되지 않은 사용자");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }
        
        try {
            UserResponse userResponse = authService.removeProfileImage(currentUser.getUserId());
            log.info("프로필 이미지 제거 성공: userId={}", currentUser.getUserId());
            return ResponseEntity.ok(ApiResponse.success(userResponse));
        } catch (Exception e) {
            log.error("프로필 이미지 제거 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("프로필 이미지 제거에 실패했습니다: " + e.getMessage()));
        }
    }
}