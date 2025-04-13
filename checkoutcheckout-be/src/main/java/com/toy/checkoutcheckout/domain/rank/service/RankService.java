package com.toy.checkoutcheckout.domain.rank.service;

import com.toy.checkoutcheckout.domain.rank.dto.DailyRankingResponse;
import com.toy.checkoutcheckout.domain.timer.repository.TimerSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankService {

    private final TimerSessionRepository timerSessionRepository;

    @Transactional(readOnly = true)
    public DailyRankingResponse getDailyRanking(LocalDate date) {
        List<Object[]> results = timerSessionRepository.findDailyRankingByDate(date);
        
        List<DailyRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long userId = (Long) result[0];
            String nickname = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(DailyRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .userId(userId)
                    .nickname(nickname)
                    .studyTime(studyTime)
                    .build());
        }
        
        return DailyRankingResponse.builder()
                .date(date)
                .rankings(rankings)
                .build();
    }
}
