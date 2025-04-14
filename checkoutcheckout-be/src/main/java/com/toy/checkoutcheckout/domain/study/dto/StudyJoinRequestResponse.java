package com.toy.checkoutcheckout.domain.study.dto;

import com.toy.checkoutcheckout.domain.study.entity.StudyJoinRequest.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyJoinRequestResponse {
    
    private Long id;
    private Long studyId;
    private String studyName;
    private Long userId;
    private String userNickname;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    
    public static StudyJoinRequestResponse from(com.toy.checkoutcheckout.domain.study.entity.StudyJoinRequest request) {
        return StudyJoinRequestResponse.builder()
                .id(request.getId())
                .studyId(request.getStudy().getId())
                .studyName(request.getStudy().getName())
                .userId(request.getUser().getId())
                .userNickname(request.getUser().getNickname())
                .status(request.getStatus())
                .requestedAt(request.getRequestedAt())
                .processedAt(request.getProcessedAt())
                .build();
    }
}
