package com.toy.checkoutcheckout.domain.character.repository;

import com.toy.checkoutcheckout.domain.character.entity.CharacterEntity;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CharacterRepository extends JpaRepository<CharacterEntity, Long> {
    
    List<CharacterEntity> findByUserOrderByAcquiredDateDesc(User user);
    
    // 특정 사용자가 특정 날짜에 획득한 캐릭터가 있는지 확인
    Optional<CharacterEntity> findByUserAndAcquiredDate(User user, LocalDate date);
    
    boolean existsByUserAndAcquiredDate(User user, LocalDate date);
}
