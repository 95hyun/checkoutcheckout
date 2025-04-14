package com.toy.checkoutcheckout.domain.auth.service;

import com.toy.checkoutcheckout.domain.auth.dto.LoginRequest;
import com.toy.checkoutcheckout.domain.auth.dto.SignupRequest;
import com.toy.checkoutcheckout.domain.auth.dto.TokenResponse;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
