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
public class StudyRankingResponse {
    
    private LocalDate startDate;
    private LocalDate endDate;
    private List<RankEntry> rankings;
    
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankEntry {
        private int rank;
        private Long studyId;
        private String studyName;
        private Long studyTime; // 밀리초 단위
        private String formattedStudyTime; // "00:00:00" 형식
    }
}
