package com.toy.checkoutcheckout.domain.study.dto;

import com.toy.checkoutcheckout.domain.study.entity.Study;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyResponse {
    
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerNickname;
    private Integer maxMembers;
    private Integer currentMembers;
    private Boolean isPasswordProtected;
    private Boolean isApprovalRequired;
    private Boolean isOwner;
    private Boolean isMember;
    private LocalDateTime createdAt;
    
    public static StudyResponse from(Study study, Long userId, Integer currentMembers, Boolean isMember) {
        return StudyResponse.builder()
                .id(study.getId())
                .name(study.getName())
                .description(study.getDescription())
                .ownerId(study.getOwner().getId())
                .ownerNickname(study.getOwner().getNickname())
                .maxMembers(study.getMaxMembers())
                .currentMembers(currentMembers)
                .isPasswordProtected(study.getIsPasswordProtected())
                .isApprovalRequired(study.getIsApprovalRequired())
                .isOwner(userId.equals(study.getOwner().getId()))
                .isMember(isMember)
                .createdAt(study.getCreatedAt())
                .build();
    }
}
