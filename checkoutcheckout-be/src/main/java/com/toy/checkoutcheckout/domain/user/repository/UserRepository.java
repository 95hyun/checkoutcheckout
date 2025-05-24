package com.toy.checkoutcheckout.domain.user.repository;

import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.characterType = :characterType WHERE u.id = :userId")
    int updateCharacterType(@Param("userId") Long userId, @Param("characterType") String characterType);
    
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.characterType = null WHERE u.id = :userId")
    int clearProfileImage(@Param("userId") Long userId);
}