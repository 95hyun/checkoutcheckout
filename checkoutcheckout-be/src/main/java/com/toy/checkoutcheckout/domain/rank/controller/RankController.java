package com.toy.checkoutcheckout.domain.rank.controller;

import com.toy.checkoutcheckout.domain.rank.dto.DailyRankingResponse;
import com.toy.checkoutcheckout.domain.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/rank")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;

    @GetMapping("/daily")
    public ResponseEntity<DailyRankingResponse> getDailyRanking(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        DailyRankingResponse response = rankService.getDailyRanking(date);
        return ResponseEntity.ok(response);
    }
}
