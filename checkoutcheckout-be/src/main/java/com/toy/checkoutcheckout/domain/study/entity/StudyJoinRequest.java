package com.toy.checkoutcheckout.domain.study.entity;

import com.toy.checkoutcheckout.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_join_requests",
       uniqueConstraints = @UniqueConstraint(columnNames = {"study_id", "user_id"}))
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    private Study study;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    @Column
    private LocalDateTime processedAt;

    @PrePersist
    public void prePersist() {
        this.requestedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
    }

    public void approve() {
        this.status = RequestStatus.APPROVED;
        this.processedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = RequestStatus.REJECTED;
        this.processedAt = LocalDateTime.now();
    }

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }
}
