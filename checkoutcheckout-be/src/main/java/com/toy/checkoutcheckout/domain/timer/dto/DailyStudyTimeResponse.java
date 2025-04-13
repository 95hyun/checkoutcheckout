package com.toy.checkoutcheckout.domain.timer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStudyTimeResponse {
    
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRecord {
        private LocalDate date;
        private Long duration;  // 초 단위
    }
    
    private List<DailyRecord> records;
    
    public static DailyStudyTimeResponse from(Map<LocalDate, Long> dailyStudyTimes) {
        List<DailyRecord> records = dailyStudyTimes.entrySet().stream()
                .map(entry -> DailyRecord.builder()
                        .date(entry.getKey())
                        .duration(entry.getValue())
                        .build())
                .collect(Collectors.toList());
                
        return DailyStudyTimeResponse.builder()
                .records(records)
                .build();
    }
}
