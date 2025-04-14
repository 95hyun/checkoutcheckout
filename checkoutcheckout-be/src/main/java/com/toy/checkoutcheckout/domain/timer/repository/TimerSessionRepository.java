package com.toy.checkoutcheckout.domain.timer.repository;

import com.toy.checkoutcheckout.domain.timer.entity.TimerSession;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimerSessionRepository extends JpaRepository<TimerSession, Long> {
    
    Optional<TimerSession> findByUserAndIsActiveTrue(User user);
    
    List<TimerSession> findByUserOrderByStartTimeDesc(User user);
    
    @Query("SELECT t FROM TimerSession t WHERE t.user = :user AND t.sessionDate BETWEEN :startDate AND :endDate ORDER BY t.sessionDate ASC")
    List<TimerSession> findByUserAndDateRange(@Param("user") User user, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t.sessionDate, SUM(t.duration) FROM TimerSession t " +
           "WHERE t.user = :user AND t.sessionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.sessionDate ORDER BY t.sessionDate ASC")
    List<Object[]> findDailyStudyTimeByUserAndDateRange(@Param("user") User user, 
                                                     @Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t.user.id, t.user.nickname, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "WHERE t.sessionDate = :date " +
           "GROUP BY t.user.id, t.user.nickname " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findDailyRankingByDate(@Param("date") LocalDate date);
    
    // 스터디 회원들의 일일 랭킹
    @Query("SELECT t.user.id, t.user.nickname, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE t.sessionDate = :date AND sm.study.id = :studyId " +
           "GROUP BY t.user.id, t.user.nickname " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findDailyRankingByDateAndStudy(@Param("date") LocalDate date, @Param("studyId") Long studyId);
    
    // 스터디 회원들의 주간 랭킹
    @Query("SELECT t.user.id, t.user.nickname, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE t.sessionDate BETWEEN :startDate AND :endDate AND sm.study.id = :studyId " +
           "GROUP BY t.user.id, t.user.nickname " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findWeeklyRankingByDateRangeAndStudy(@Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate, 
                                                     @Param("studyId") Long studyId);
    
    // 스터디 회원들의 월간 랭킹
    @Query("SELECT t.user.id, t.user.nickname, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE YEAR(t.sessionDate) = :year AND MONTH(t.sessionDate) = :month AND sm.study.id = :studyId " +
           "GROUP BY t.user.id, t.user.nickname " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findMonthlyRankingByYearMonthAndStudy(@Param("year") int year, 
                                                      @Param("month") int month, 
                                                      @Param("studyId") Long studyId);
    
    // 전체 스터디 랭킹 (스터디별 누적 시간)
    @Query("SELECT sm.study.id, sm.study.name, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE t.sessionDate = :date " +
           "GROUP BY sm.study.id, sm.study.name " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findDailyStudyRanking(@Param("date") LocalDate date);
    
    // 주간 스터디 랭킹
    @Query("SELECT sm.study.id, sm.study.name, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE t.sessionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY sm.study.id, sm.study.name " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findWeeklyStudyRanking(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // 월간 스터디 랭킹
    @Query("SELECT sm.study.id, sm.study.name, SUM(t.duration) as totalDuration " +
           "FROM TimerSession t " +
           "JOIN StudyMember sm ON t.user = sm.user " +
           "WHERE YEAR(t.sessionDate) = :year AND MONTH(t.sessionDate) = :month " +
           "GROUP BY sm.study.id, sm.study.name " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findMonthlyStudyRanking(@Param("year") int year, @Param("month") int month);
}
