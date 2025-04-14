package com.toy.checkoutcheckout.domain.character.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterCheckResponse {
    private boolean hasCharacter;
}
