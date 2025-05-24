package com.toy.checkoutcheckout.domain.character.controller;

import com.toy.checkoutcheckout.domain.character.dto.CharacterAcquireRequest;
import com.toy.checkoutcheckout.domain.character.dto.CharacterCheckResponse;
import com.toy.checkoutcheckout.domain.character.dto.CharacterResponse;
import com.toy.checkoutcheckout.domain.character.service.CharacterService;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.global.auth.CurrentUser;
import com.toy.checkoutcheckout.global.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {
    
    private final CharacterService characterService;
    private final UserRepository userRepository;
    
    /**
     * 캐릭터 획득 API
     */
    @PostMapping("/acquire")
    public ResponseEntity<ApiResponse<CharacterResponse>> acquireCharacter(
            @AuthenticationPrincipal CurrentUser currentUser,
            @RequestBody CharacterAcquireRequest request) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        CharacterResponse response = characterService.acquireCharacter(user, request.getCharacterType(), request.getRarity());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 사용자의 모든 캐릭터 조회 API
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<CharacterResponse>>> getUserCharacters(
            @AuthenticationPrincipal CurrentUser currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<CharacterResponse> characters = characterService.getUserCharacters(user);
        return ResponseEntity.ok(ApiResponse.success(characters));
    }
    
    /**
     * 오늘 캐릭터 획득 여부 확인 API
     */
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<CharacterCheckResponse>> checkTodayCharacter(
            @AuthenticationPrincipal CurrentUser currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean hasCharacter = characterService.hasTodayCharacter(user);
        return ResponseEntity.ok(ApiResponse.success(new CharacterCheckResponse(hasCharacter)));
    }
    
    /**
     * 오늘 획득한 캐릭터 조회 API
     */
    @GetMapping("/today/detail")
    public ResponseEntity<ApiResponse<CharacterResponse>> getTodayCharacter(
            @AuthenticationPrincipal CurrentUser currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        CharacterResponse character = characterService.getTodayCharacter(user);
        if (character == null) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.ok(ApiResponse.success(character));
    }
}