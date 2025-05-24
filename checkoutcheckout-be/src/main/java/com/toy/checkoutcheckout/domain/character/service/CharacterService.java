package com.toy.checkoutcheckout.domain.character.service;

import com.toy.checkoutcheckout.domain.character.dto.CharacterResponse;
import com.toy.checkoutcheckout.domain.character.entity.CharacterEntity;
import com.toy.checkoutcheckout.domain.character.repository.CharacterRepository;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.global.error.CharacterBusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CharacterService {
    
    private final CharacterRepository characterRepository;
    
    // 유효한 캐릭터 타입 목록
    private static final List<String> VALID_CHARACTER_TYPES = Arrays.asList(
            // Common 동물 캐릭터
            "common_rabbit", "common_squirrel", "common_hedgehog", "common_pigeon",
            // Uncommon 동물 캐릭터
            "uncommon_cat", "uncommon_dog", "uncommon_bear", "uncommon_hamster",
            // Rare 동물 캐릭터
            "rare_wolf", "rare_fox", "rare_lion", "rare_penguin",
            // Epic 동물 캐릭터
            "epic_unicorn", "epic_dragon", "epic_phoneix", "epic_whitetiger",
            // Legendary 동물 캐릭터
            "legendary_doge", "legendary_pepe", "legendary_tralellotralala", "legendary_chillguy"
    );
    
    /**
     * 사용자가 캐릭터를 획득합니다.
     */
    @Transactional
    public CharacterResponse acquireCharacter(User user, String characterType, String rarity) {
        LocalDate today = LocalDate.now();
        
        // 캐릭터 타입 유효성 검사
        if (!VALID_CHARACTER_TYPES.contains(characterType)) {
            throw new CharacterBusinessException("유효하지 않은 캐릭터 타입입니다.", "INVALID_CHARACTER_TYPE");
        }
        
        // 희귀도 유효성 검사 (null이면 캐릭터 타입에서 추출)
        if (rarity == null || rarity.trim().isEmpty()) {
            // 캐릭터 타입에서 희귀도 추출 (예: common_rabbit -> common)
            String[] parts = characterType.split("_");
            if (parts.length > 0) {
                rarity = parts[0];
            } else {
                rarity = "common"; // 기본값
            }
        }
        
        // 희귀도 유효성 검사
        List<String> validRarities = Arrays.asList("common", "uncommon", "rare", "epic", "legendary");
        if (!validRarities.contains(rarity)) {
            rarity = "common"; // 유효하지 않으면 기본값으로 설정
        }
        
        // 오늘 이미 캐릭터를 획득했는지 확인
        if (characterRepository.existsByUserAndAcquiredDate(user, today)) {
            throw new CharacterBusinessException("오늘 이미 캐릭터를 획득했습니다.", "ALREADY_ACQUIRED");
        }
        
        // 캐릭터 생성 및 저장
        CharacterEntity character = CharacterEntity.builder()
                .user(user)
                .type(characterType)
                .rarity(rarity)
                .acquiredDate(today)
                .createdAt(LocalDateTime.now())
                .build();
        
        CharacterEntity savedCharacter = characterRepository.save(character);
        
        // 사용자의 현재 캐릭터로 설정 (characterType 필드 사용)
        user.setCharacterType(characterType);
        
        return CharacterResponse.from(savedCharacter);
    }
    
    /**
     * 사용자의 모든 캐릭터를 조회합니다.
     */
    @Transactional(readOnly = true)
    public List<CharacterResponse> getUserCharacters(User user) {
        List<CharacterEntity> characters = characterRepository.findByUserOrderByAcquiredDateDesc(user);
        return characters.stream()
                .map(CharacterResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 사용자가 오늘 캐릭터를 이미 획득했는지 확인합니다.
     */
    @Transactional(readOnly = true)
    public boolean hasTodayCharacter(User user) {
        LocalDate today = LocalDate.now();
        return characterRepository.existsByUserAndAcquiredDate(user, today);
    }
    
    /**
     * 사용자가 오늘 획득한 캐릭터를 조회합니다.
     */
    @Transactional(readOnly = true)
    public CharacterResponse getTodayCharacter(User user) {
        LocalDate today = LocalDate.now();
        return characterRepository.findByUserAndAcquiredDate(user, today)
                .map(CharacterResponse::from)
                .orElse(null);
    }
}
