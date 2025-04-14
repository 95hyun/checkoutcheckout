package com.toy.checkoutcheckout.domain.auth.controller;

import com.toy.checkoutcheckout.domain.auth.dto.LoginRequest;
import com.toy.checkoutcheckout.domain.auth.dto.SignupRequest;
import com.toy.checkoutcheckout.domain.auth.dto.TokenResponse;
import com.toy.checkoutcheckout.domain.auth.dto.UserResponse;
import com.toy.checkoutcheckout.domain.auth.service.AuthService;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
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
        return ResponseEntity.ok(ApiResponse.success(UserResponse.builder()
                .id(currentUser.getUserId())
                .email(currentUser.getEmail())
                .nickname(currentUser.getNickname())
                .build()));
    }
}
