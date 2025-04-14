package com.toy.checkoutcheckout.domain.study.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyJoinRequest {
    
    @NotNull(message = "비밀번호가 필요합니다.")
    private String password;
}
