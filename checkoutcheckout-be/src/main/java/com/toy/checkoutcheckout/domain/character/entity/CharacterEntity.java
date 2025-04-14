package com.toy.checkoutcheckout.domain.character.entity;

import com.toy.checkoutcheckout.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "characters")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String type;
    
    @Column(name = "acquired_date", nullable = false)
    private LocalDate acquiredDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
