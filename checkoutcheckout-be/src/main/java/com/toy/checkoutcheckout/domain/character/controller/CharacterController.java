package com.toy.checkoutcheckout.domain.character.controller;

import com.toy.checkoutcheckout.domain.character.dto.CharacterAcquireRequest;
import com.toy.checkoutcheckout.domain.character.dto.CharacterCheckResponse;
import com.toy.checkoutcheckout.domain.character.dto.CharacterResponse;
import com.toy.checkoutcheckout.domain.character.service.CharacterService;
import com.toy.checkoutcheckout.domain.user.entity.User;
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
    
    /**
     * 캐릭터 획득 API
     */
    @PostMapping("/acquire")
    public ResponseEntity<CharacterResponse> acquireCharacter(
            @AuthenticationPrincipal User user,
            @RequestBody CharacterAcquireRequest request) {
        CharacterResponse response = characterService.acquireCharacter(user, request.getCharacterType());
        return ResponseEntity.ok(response);
    }
    
    /**
     * 사용자의 모든 캐릭터 조회 API
     */
    @GetMapping("/user")
    public ResponseEntity<List<CharacterResponse>> getUserCharacters(
            @AuthenticationPrincipal User user) {
        List<CharacterResponse> characters = characterService.getUserCharacters(user);
        return ResponseEntity.ok(characters);
    }
    
    /**
     * 오늘 캐릭터 획득 여부 확인 API
     */
    @GetMapping("/today")
    public ResponseEntity<CharacterCheckResponse> checkTodayCharacter(
            @AuthenticationPrincipal User user) {
        boolean hasCharacter = characterService.hasTodayCharacter(user);
        return ResponseEntity.ok(new CharacterCheckResponse(hasCharacter));
    }
    
    /**
     * 오늘 획득한 캐릭터 조회 API
     */
    @GetMapping("/today/detail")
    public ResponseEntity<CharacterResponse> getTodayCharacter(
            @AuthenticationPrincipal User user) {
        CharacterResponse character = characterService.getTodayCharacter(user);
        if (character == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(character);
    }
}