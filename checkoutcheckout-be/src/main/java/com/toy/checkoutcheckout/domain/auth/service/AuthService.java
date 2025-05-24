package com.toy.checkoutcheckout.domain.auth.service;

import com.toy.checkoutcheckout.domain.auth.dto.LoginRequest;
import com.toy.checkoutcheckout.domain.auth.dto.ProfileImageRequest;
import com.toy.checkoutcheckout.domain.auth.dto.SignupRequest;
import com.toy.checkoutcheckout.domain.auth.dto.TokenResponse;
import com.toy.checkoutcheckout.domain.auth.dto.UserResponse;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.domain.user.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw com.toy.checkoutcheckout.global.error.AuthBusinessException.EMAIL_ALREADY_EXISTS;
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw com.toy.checkoutcheckout.global.error.AuthBusinessException.NICKNAME_ALREADY_EXISTS;
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        try {
            log.info("로그인 시도: {}", request.getEmail());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            log.info("로그인 성공: {}", request.getEmail());

            String token = jwtTokenProvider.createToken(request.getEmail());
            log.info("Generated token for user {}: {}", request.getEmail(), token);
            return TokenResponse.of(token);
        } catch (AuthenticationException e) {
            log.error("로그인 실패: {}, 원인: {}", request.getEmail(), e.getMessage());
            throw com.toy.checkoutcheckout.global.error.AuthBusinessException.LOGIN_FAILED;
        }
    }

    @Transactional
    public UserResponse setCharacterAsProfile(ProfileImageRequest request, Long userId) {
        log.info("캐릭터를 프로필로 설정: userId={}, characterType={}", userId, request.getCharacterType());

        // 유저 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        log.info("사용자 확인 완료: {}", user.getEmail());

        // 캐릭터 타입 설정
        user.setCharacterType(request.getCharacterType());
        log.info("캐릭터 타입 설정 완료: {}", request.getCharacterType());

        // 유저 저장
        User savedUser = userRepository.save(user);
        log.info("사용자 정보 저장 완료");

        UserResponse response = UserResponse.from(savedUser);
        log.info("최종 응답 준비 완료: characterType={}", response.getCharacterType());

        return response;
    }

    @Transactional
    public UserResponse removeProfileImage(Long userId) {
        log.info("프로필 이미지 제거: userId={}", userId);

        // 유저 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        log.info("사용자 확인 완료: {}", user.getEmail());

        // 프로필 이미지 제거
        user.clearProfileImage();
        log.info("프로필 이미지 제거 완료");

        // 유저 저장
        User savedUser = userRepository.save(user);
        log.info("사용자 정보 저장 완료");

        UserResponse response = UserResponse.from(savedUser);
        log.info("최종 응답 준비 완료: characterType={}", response.getCharacterType());

        return response;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        log.info("현재 사용자 정보 조회: userId={}", userId);

        // 유저 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        log.info("사용자 확인 완료: {}", user.getEmail());

        UserResponse response = UserResponse.from(user);
        log.info("사용자 정보 조회 완료: characterType={}", response.getCharacterType());

        return response;
    }
}