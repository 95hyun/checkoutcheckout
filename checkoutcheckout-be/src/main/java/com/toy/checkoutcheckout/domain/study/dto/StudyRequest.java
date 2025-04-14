package com.toy.checkoutcheckout.domain.study.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyRequest {
    
    @NotBlank(message = "스터디 이름은 필수입니다.")
    @Size(min = 2, max = 50, message = "스터디 이름은 2~50자 사이여야 합니다.")
    private String name;
    
    @Size(max = 1000, message = "스터디 설명은 1000자를 초과할 수 없습니다.")
    private String description;
    
    @Min(value = 2, message = "최소 인원은 2명 이상이어야 합니다.")
    @Max(value = 10, message = "최대 인원은 10명을 초과할 수 없습니다.")
    private Integer maxMembers;
    
    private String password;
    
    private Boolean isPasswordProtected;
    
    private Boolean isApprovalRequired;
}
