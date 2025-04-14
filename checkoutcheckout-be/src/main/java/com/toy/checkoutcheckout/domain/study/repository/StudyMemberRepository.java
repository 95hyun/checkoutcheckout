package com.toy.checkoutcheckout.domain.study.repository;

import com.toy.checkoutcheckout.domain.study.entity.Study;
import com.toy.checkoutcheckout.domain.study.entity.StudyMember;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyMemberRepository extends JpaRepository<StudyMember, Long> {
    
    List<StudyMember> findByStudy(Study study);
    
    List<StudyMember> findByUser(User user);
    
    Optional<StudyMember> findByStudyAndUser(Study study, User user);
    
    void deleteByStudyAndUser(Study study, User user);
    
    @Query("SELECT COUNT(sm) FROM StudyMember sm WHERE sm.study = :study")
    Long countMembersByStudy(@Param("study") Study study);
    
    @Query("SELECT sm FROM StudyMember sm WHERE sm.study = :study AND sm.isAdmin = true")
    List<StudyMember> findAdminsByStudy(@Param("study") Study study);
    
    boolean existsByStudyAndUser(Study study, User user);
}
