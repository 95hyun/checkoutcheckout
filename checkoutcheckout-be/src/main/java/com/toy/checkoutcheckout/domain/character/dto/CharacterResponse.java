package com.toy.checkoutcheckout.domain.character.dto;

import com.toy.checkoutcheckout.domain.character.entity.CharacterEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterResponse {
    private Long id;
    private String type;
    private String rarity;
    private LocalDate acquiredDate;
    
    public static CharacterResponse from(CharacterEntity character) {
        return CharacterResponse.builder()
                .id(character.getId())
                .type(character.getType())
                .rarity(character.getRarity())
                .acquiredDate(character.getAcquiredDate())
                .build();
    }
}
