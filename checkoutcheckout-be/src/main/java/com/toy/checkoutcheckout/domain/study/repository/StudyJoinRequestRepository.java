package com.toy.checkoutcheckout.domain.study.repository;

import com.toy.checkoutcheckout.domain.study.entity.Study;
import com.toy.checkoutcheckout.domain.study.entity.StudyJoinRequest;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyJoinRequestRepository extends JpaRepository<StudyJoinRequest, Long> {
    
    List<StudyJoinRequest> findByStudyAndStatus(Study study, StudyJoinRequest.RequestStatus status);
    
    List<StudyJoinRequest> findByUserAndStatus(User user, StudyJoinRequest.RequestStatus status);
    
    Optional<StudyJoinRequest> findByStudyAndUser(Study study, User user);
    
    boolean existsByStudyAndUserAndStatus(Study study, User user, StudyJoinRequest.RequestStatus status);
}
