package com.toy.checkoutcheckout.domain.study.repository;

import com.toy.checkoutcheckout.domain.study.entity.Study;
import com.toy.checkoutcheckout.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study, Long> {
    
    List<Study> findByOwner(User owner);
    
    @Query("SELECT s FROM Study s WHERE s.name LIKE %:keyword% OR s.description LIKE %:keyword%")
    List<Study> searchStudies(@Param("keyword") String keyword);
    
    @Query("SELECT s FROM Study s JOIN StudyMember sm ON s = sm.study WHERE sm.user = :user")
    List<Study> findStudiesJoinedByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(sm) FROM StudyMember sm WHERE sm.study.id = :studyId")
    Long countMembersByStudyId(@Param("studyId") Long studyId);
}
