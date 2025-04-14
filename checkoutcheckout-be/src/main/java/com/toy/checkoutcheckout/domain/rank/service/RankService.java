package com.toy.checkoutcheckout.domain.rank.service;

import com.toy.checkoutcheckout.domain.rank.dto.DailyRankingResponse;
import com.toy.checkoutcheckout.domain.rank.dto.StudyMemberRankingResponse;
import com.toy.checkoutcheckout.domain.rank.dto.StudyRankingResponse;
import com.toy.checkoutcheckout.domain.study.entity.Study;
import com.toy.checkoutcheckout.domain.study.repository.StudyMemberRepository;
import com.toy.checkoutcheckout.domain.study.repository.StudyRepository;
import com.toy.checkoutcheckout.domain.timer.repository.TimerSessionRepository;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.global.exception.ForbiddenException;
import com.toy.checkoutcheckout.global.exception.NotFoundException;
import com.toy.checkoutcheckout.utils.TimeUtils;
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
    private final StudyRepository studyRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final UserRepository userRepository;

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
    
    @Transactional(readOnly = true)
    public StudyRankingResponse getDailyStudyRanking(LocalDate date) {
        List<Object[]> results = timerSessionRepository.findDailyStudyRanking(date);
        
        List<StudyRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long studyId = (Long) result[0];
            String studyName = (String) result[1];
            Long studyTime = (Long) result[2];
            
            // 디버깅 로그 추가
            System.out.println("스터디 ID: " + studyId + ", 이름: " + studyName + ", 공부시간(초): " + studyTime);
            String formattedTime = TimeUtils.formatMillisToTimeString(studyTime);
            System.out.println("변환된 시간: " + formattedTime);
            
            rankings.add(StudyRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .studyId(studyId)
                    .studyName(studyName)
                    .studyTime(studyTime)
                    .formattedStudyTime(formattedTime)
                    .build());
        }
        
        return StudyRankingResponse.builder()
                .startDate(date)
                .endDate(date)
                .rankings(rankings)
                .build();
    }
    
    @Transactional(readOnly = true)
    public StudyRankingResponse getWeeklyStudyRanking(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = timerSessionRepository.findWeeklyStudyRanking(startDate, endDate);
        
        List<StudyRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long studyId = (Long) result[0];
            String studyName = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(StudyRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .studyId(studyId)
                    .studyName(studyName)
                    .studyTime(studyTime)
                    .formattedStudyTime(TimeUtils.formatMillisToTimeString(studyTime))
                    .build());
        }
        
        return StudyRankingResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .rankings(rankings)
                .build();
    }
    
    @Transactional(readOnly = true)
    public StudyRankingResponse getMonthlyStudyRanking(int year, int month) {
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());
        
        List<Object[]> results = timerSessionRepository.findMonthlyStudyRanking(year, month);
        
        List<StudyRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long studyId = (Long) result[0];
            String studyName = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(StudyRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .studyId(studyId)
                    .studyName(studyName)
                    .studyTime(studyTime)
                    .formattedStudyTime(TimeUtils.formatMillisToTimeString(studyTime))
                    .build());
        }
        
        return StudyRankingResponse.builder()
                .startDate(firstDayOfMonth)
                .endDate(lastDayOfMonth)
                .rankings(rankings)
                .build();
    }
    
    @Transactional(readOnly = true)
    public StudyMemberRankingResponse getStudyMemberDailyRanking(Long userId, Long studyId, LocalDate date) {
        // 스터디 존재 확인
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));
        
        // 사용자가 스터디 멤버인지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        if (!studyMemberRepository.existsByStudyAndUser(study, user)) {
            throw new ForbiddenException("스터디 멤버만 랭킹을 확인할 수 있습니다.");
        }
        
        List<Object[]> results = timerSessionRepository.findDailyRankingByDateAndStudy(date, studyId);
        
        List<StudyMemberRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long memberId = (Long) result[0];
            String nickname = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(StudyMemberRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .userId(memberId)
                    .nickname(nickname)
                    .studyTime(studyTime)
                    .formattedStudyTime(TimeUtils.formatMillisToTimeString(studyTime))
                    .build());
        }
        
        // 총 공부시간 계산
        Long totalStudyTime = rankings.stream()
                .mapToLong(StudyMemberRankingResponse.RankEntry::getStudyTime)
                .sum();
                
        return StudyMemberRankingResponse.builder()
                .studyId(studyId)
                .studyName(study.getName())
                .startDate(date)
                .endDate(date)
                .rankings(rankings)
                .totalStudyTime(totalStudyTime)
                .formattedTotalStudyTime(TimeUtils.formatMillisToTimeString(totalStudyTime))
                .build();
    }
    
    @Transactional(readOnly = true)
    public StudyMemberRankingResponse getStudyMemberWeeklyRanking(Long userId, Long studyId, 
                                                               LocalDate startDate, LocalDate endDate) {
        // 스터디 존재 확인
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));
        
        // 사용자가 스터디 멤버인지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        if (!studyMemberRepository.existsByStudyAndUser(study, user)) {
            throw new ForbiddenException("스터디 멤버만 랭킹을 확인할 수 있습니다.");
        }
        
        List<Object[]> results = timerSessionRepository.findWeeklyRankingByDateRangeAndStudy(startDate, endDate, studyId);
        
        List<StudyMemberRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long memberId = (Long) result[0];
            String nickname = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(StudyMemberRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .userId(memberId)
                    .nickname(nickname)
                    .studyTime(studyTime)
                    .formattedStudyTime(TimeUtils.formatMillisToTimeString(studyTime))
                    .build());
        }
        
        // 총 공부시간 계산
        Long totalStudyTime = rankings.stream()
                .mapToLong(StudyMemberRankingResponse.RankEntry::getStudyTime)
                .sum();
                
        return StudyMemberRankingResponse.builder()
                .studyId(studyId)
                .studyName(study.getName())
                .startDate(startDate)
                .endDate(endDate)
                .rankings(rankings)
                .totalStudyTime(totalStudyTime)
                .formattedTotalStudyTime(TimeUtils.formatMillisToTimeString(totalStudyTime))
                .build();
    }
    
    @Transactional(readOnly = true)
    public StudyMemberRankingResponse getStudyMemberMonthlyRanking(Long userId, Long studyId, int year, int month) {
        // 스터디 존재 확인
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));
        
        // 사용자가 스터디 멤버인지 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        if (!studyMemberRepository.existsByStudyAndUser(study, user)) {
            throw new ForbiddenException("스터디 멤버만 랭킹을 확인할 수 있습니다.");
        }
        
        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
        LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());
        
        List<Object[]> results = timerSessionRepository.findMonthlyRankingByYearMonthAndStudy(year, month, studyId);
        
        List<StudyMemberRankingResponse.RankEntry> rankings = new ArrayList<>();
        int rank = 1;
        
        for (Object[] result : results) {
            Long memberId = (Long) result[0];
            String nickname = (String) result[1];
            Long studyTime = (Long) result[2];
            
            rankings.add(StudyMemberRankingResponse.RankEntry.builder()
                    .rank(rank++)
                    .userId(memberId)
                    .nickname(nickname)
                    .studyTime(studyTime)
                    .formattedStudyTime(TimeUtils.formatMillisToTimeString(studyTime))
                    .build());
        }
        
        // 총 공부시간 계산
        Long totalStudyTime = rankings.stream()
                .mapToLong(StudyMemberRankingResponse.RankEntry::getStudyTime)
                .sum();
                
        return StudyMemberRankingResponse.builder()
                .studyId(studyId)
                .studyName(study.getName())
                .startDate(firstDayOfMonth)
                .endDate(lastDayOfMonth)
                .rankings(rankings)
                .totalStudyTime(totalStudyTime)
                .formattedTotalStudyTime(TimeUtils.formatMillisToTimeString(totalStudyTime))
                .build();
    }
}
