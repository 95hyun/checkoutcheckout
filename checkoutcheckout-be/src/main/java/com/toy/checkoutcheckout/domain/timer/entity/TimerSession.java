package com.toy.checkoutcheckout.domain.timer.entity;

import com.toy.checkoutcheckout.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "timer_sessions")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimerSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long duration; // 초 단위로 저장

    @Column(nullable = false)
    private LocalDate sessionDate; // 세션이 시작된 날짜 (날짜별 통계를 위함)

    @Column(nullable = false)
    private boolean isActive; // 현재 활성화된 세션인지 여부

    @PrePersist
    public void prePersist() {
        if (this.startTime == null) {
            this.startTime = LocalDateTime.now();
        }
        this.sessionDate = this.startTime.toLocalDate();
        this.isActive = true;
        this.duration = 0L; // 초기 duration 값을 0으로 설정
    }

    public void stopTimer() {
        LocalDateTime now = LocalDateTime.now();
        this.endTime = now;
        this.duration = ChronoUnit.SECONDS.between(this.startTime, now);
        this.isActive = false;
    }

    private Long calculateDuration() {
        if (this.endTime == null) {
            return ChronoUnit.SECONDS.between(this.startTime, LocalDateTime.now());
        }
        return ChronoUnit.SECONDS.between(this.startTime, this.endTime);
    }

    public Long getCurrentDuration() {
        return calculateDuration();
    }
}
