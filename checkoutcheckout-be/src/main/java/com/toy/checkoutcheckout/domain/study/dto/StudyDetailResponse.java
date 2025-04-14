package com.toy.checkoutcheckout.domain.study.dto;

import com.toy.checkoutcheckout.domain.study.entity.Study;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyDetailResponse {
    
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
    private Boolean isAdmin;
    private LocalDateTime createdAt;
    private List<StudyMemberResponse> members;
    
    public static StudyDetailResponse from(Study study, Long userId, Integer currentMembers, 
                                          Boolean isMember, Boolean isAdmin, List<StudyMemberResponse> members) {
        return StudyDetailResponse.builder()
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
                .isAdmin(isAdmin)
                .createdAt(study.getCreatedAt())
                .members(members)
                .build();
    }
}
