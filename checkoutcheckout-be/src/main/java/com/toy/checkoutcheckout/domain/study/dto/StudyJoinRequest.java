package com.toy.checkoutcheckout.domain.study.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyJoinRequest {
    
    @NotNull(message = "비밀번호가 필요합니다.")
    private String password;
}
