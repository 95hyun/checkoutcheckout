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
public class DailyRankingResponse {
    
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankEntry {
        private Integer rank;
        private Long userId;
        private String nickname;
        private Long studyTime;  // 초 단위
    }
    
    private LocalDate date;
    private List<RankEntry> rankings;
}
