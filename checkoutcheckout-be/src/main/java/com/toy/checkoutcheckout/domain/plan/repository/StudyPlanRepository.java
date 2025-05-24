package com.toy.checkoutcheckout.domain.plan.repository;

import com.toy.checkoutcheckout.domain.plan.entity.StudyPlan;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {

    // 특정 사용자 및 날짜에 해당하는 계획 조회
    Optional<StudyPlan> findByUserAndDate(User user, LocalDate date);

    // 특정 사용자 및 날짜 범위에 해당하는 계획 조회
    List<StudyPlan> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);

    // 특정 사용자의 모든 계획 조회
    List<StudyPlan> findByUserOrderByDateDesc(User user);
}
