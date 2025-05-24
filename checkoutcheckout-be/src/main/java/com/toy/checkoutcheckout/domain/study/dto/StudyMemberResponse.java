package com.toy.checkoutcheckout.domain.study.dto;

import com.toy.checkoutcheckout.domain.study.entity.StudyMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyMemberResponse {
    
    private Long id;
    private Long userId;
    private String nickname;
    private String characterType;
    private Boolean isAdmin;
    private Boolean isOwner;
    private LocalDateTime joinedAt;
    
    public static StudyMemberResponse from(StudyMember member, Boolean isOwner) {
        return StudyMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .nickname(member.getUser().getNickname())
                .characterType(member.getUser().getCharacterType())
                .isAdmin(member.getIsAdmin())
                .isOwner(isOwner)
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
