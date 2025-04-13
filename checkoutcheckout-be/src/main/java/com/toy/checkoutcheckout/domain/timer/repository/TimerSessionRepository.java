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
}
