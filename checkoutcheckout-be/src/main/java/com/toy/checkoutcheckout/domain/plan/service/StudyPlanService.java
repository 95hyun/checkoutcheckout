package com.toy.checkoutcheckout.domain.plan.service;

import com.toy.checkoutcheckout.domain.plan.dto.StudyPlanDto;
import com.toy.checkoutcheckout.domain.plan.entity.StudyPlan;
import com.toy.checkoutcheckout.domain.plan.exception.PlanBusinessException;
import com.toy.checkoutcheckout.domain.plan.repository.StudyPlanRepository;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.global.error.BusinessException;
import com.toy.checkoutcheckout.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public StudyPlanDto.Response getPlanByDate(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        StudyPlan studyPlan = studyPlanRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> PlanBusinessException.PLAN_NOT_FOUND);
        
        return StudyPlanDto.Response.fromEntity(studyPlan);
    }

    @Transactional(readOnly = true)
    public List<StudyPlanDto.Response> getPlansByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        List<StudyPlan> studyPlans = studyPlanRepository.findByUserAndDateBetweenOrderByDateAsc(user, startDate, endDate);
        
        return studyPlans.stream()
                .map(StudyPlanDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudyPlanDto.Response savePlan(Long userId, LocalDate date, StudyPlanDto.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        // 요청 유효성 검증
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "계획 내용은 필수입니다.");
        }
        
        if (request.getPlannedDuration() == null || request.getPlannedDuration() <= 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "계획 시간은 0보다 커야 합니다.");
        }
        
        // 기존 계획 조회 또는 새 계획 생성
        StudyPlan studyPlan = studyPlanRepository.findByUserAndDate(user, date)
                .orElse(StudyPlan.builder()
                        .user(user)
                        .date(date)
                        .isCompleted(false)
                        .build());
        
        studyPlan.update(request.getContent(), request.getPlannedDuration());
        
        StudyPlan savedPlan = studyPlanRepository.save(studyPlan);
        log.info("계획 저장 완료: userId={}, planId={}, date={}", userId, savedPlan.getId(), date);
        
        return StudyPlanDto.Response.fromEntity(savedPlan);
    }

    @Transactional
    public void deletePlan(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        StudyPlan studyPlan = studyPlanRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> PlanBusinessException.PLAN_NOT_FOUND);
        
        studyPlanRepository.delete(studyPlan);
        log.info("계획 삭제 완료: userId={}, planId={}, date={}", userId, studyPlan.getId(), date);
    }

    @Transactional
    public StudyPlanDto.Response completePlan(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        
        StudyPlan studyPlan = studyPlanRepository.findByUserAndDate(user, date)
                .orElseThrow(() -> PlanBusinessException.PLAN_NOT_FOUND);
        
        studyPlan.markAsCompleted();
        
        StudyPlan savedPlan = studyPlanRepository.save(studyPlan);
        log.info("계획 완료 처리 완료: userId={}, planId={}, date={}", userId, savedPlan.getId(), date);
        
        return StudyPlanDto.Response.fromEntity(savedPlan);
    }
}
