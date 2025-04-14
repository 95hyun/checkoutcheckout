package com.toy.checkoutcheckout.domain.study.entity;

import com.toy.checkoutcheckout.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "studies")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Study {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "max_members", nullable = false)
    private Integer maxMembers;

    @Column(name = "password")
    private String password;

    @Column(name = "is_password_protected", nullable = false)
    private Boolean isPasswordProtected;

    @Column(name = "is_approval_required", nullable = false)
    private Boolean isApprovalRequired;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 스터디 정보 업데이트
    public void update(String name, String description, Integer maxMembers, String password, 
                       Boolean isPasswordProtected, Boolean isApprovalRequired) {
        this.name = name;
        this.description = description;
        this.maxMembers = maxMembers;
        this.password = password;
        this.isPasswordProtected = isPasswordProtected;
        this.isApprovalRequired = isApprovalRequired;
    }
}
