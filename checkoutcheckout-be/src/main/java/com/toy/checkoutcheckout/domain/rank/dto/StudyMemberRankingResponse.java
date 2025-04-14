package com.toy.checkoutcheckout.domain.rank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyMemberRankingResponse {
    
    private Long studyId;
    private String studyName;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<RankEntry> rankings;
    private Long totalStudyTime; // 스터디원들의 공부시간 합계 (초 단위)
    private String formattedTotalStudyTime; // 포맷팅된 공부시간 합계 (HH:MM:SS)
    
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankEntry {
        private int rank;
        private Long userId;
        private String nickname;
        private Long studyTime; // 초 단위
        private String formattedStudyTime; // "00:00:00" 형식
    }
}