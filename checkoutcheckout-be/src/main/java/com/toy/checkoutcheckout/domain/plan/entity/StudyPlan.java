package com.toy.checkoutcheckout.domain.plan.entity;

import com.toy.checkoutcheckout.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "study_plans")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private Integer plannedDuration; // 초 단위

    @Column(nullable = false)
    private boolean isCompleted;

    // 계획 완료 처리
    public void markAsCompleted() {
        this.isCompleted = true;
    }

    // 계획 내용 및 시간 업데이트
    public void update(String content, Integer plannedDuration) {
        this.content = content;
        this.plannedDuration = plannedDuration;
    }
}
