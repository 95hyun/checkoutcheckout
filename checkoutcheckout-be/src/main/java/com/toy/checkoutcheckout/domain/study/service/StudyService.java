package com.toy.checkoutcheckout.domain.study.service;

import com.toy.checkoutcheckout.domain.study.dto.*;
import com.toy.checkoutcheckout.domain.study.entity.Study;
import com.toy.checkoutcheckout.domain.study.entity.StudyJoinRequest;
import com.toy.checkoutcheckout.domain.study.entity.StudyMember;
import com.toy.checkoutcheckout.domain.study.repository.StudyJoinRequestRepository;
import com.toy.checkoutcheckout.domain.study.repository.StudyMemberRepository;
import com.toy.checkoutcheckout.domain.study.repository.StudyRepository;
import com.toy.checkoutcheckout.domain.user.entity.User;
import com.toy.checkoutcheckout.domain.user.repository.UserRepository;
import com.toy.checkoutcheckout.global.exception.BadRequestException;
import com.toy.checkoutcheckout.global.exception.ForbiddenException;
import com.toy.checkoutcheckout.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final StudyJoinRequestRepository studyJoinRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public StudyResponse createStudy(Long userId, StudyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        String hashedPassword = null;
        if (request.getIsPasswordProtected() && request.getPassword() != null && !request.getPassword().isEmpty()) {
            hashedPassword = passwordEncoder.encode(request.getPassword());
        }

        Study study = Study.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(user)
                .maxMembers(request.getMaxMembers())
                .password(hashedPassword)
                .isPasswordProtected(request.getIsPasswordProtected())
                .isApprovalRequired(request.getIsApprovalRequired())
                .build();

        Study savedStudy = studyRepository.save(study);

        // 스터디장을 스터디 멤버로 추가
        StudyMember ownerMember = StudyMember.builder()
                .study(savedStudy)
                .user(user)
                .isAdmin(true) // 스터디장은 관리자 권한을 가짐
                .build();

        studyMemberRepository.save(ownerMember);

        return StudyResponse.from(savedStudy, userId, 1, true);
    }

    @Transactional(readOnly = true)
    public List<StudyResponse> getAllStudies(Long userId) {
        List<Study> studies = studyRepository.findAll();
        return studies.stream()
                .map(study -> {
                    Integer currentMembers = studyMemberRepository.countMembersByStudy(study).intValue();
                    Boolean isMember = studyMemberRepository.existsByStudyAndUser(study, 
                            User.builder().id(userId).build());
                    return StudyResponse.from(study, userId, currentMembers, isMember);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudyResponse> getMyStudies(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        List<Study> studies = studyRepository.findStudiesJoinedByUser(user);
        return studies.stream()
                .map(study -> {
                    Integer currentMembers = studyMemberRepository.countMembersByStudy(study).intValue();
                    return StudyResponse.from(study, userId, currentMembers, true);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudyDetailResponse getStudyDetail(Long userId, Long studyId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        // 사용자가 스터디 멤버인지 확인
        Boolean isMember = studyMemberRepository.existsByStudyAndUser(study, user);
        
        // 스터디 멤버가 아니면 상세 정보를 볼 수 없음
        if (!isMember) {
            throw new ForbiddenException("스터디 멤버만 상세 정보를 볼 수 있습니다.");
        }

        // 관리자 권한 확인
        Boolean isAdmin = studyMemberRepository.findByStudyAndUser(study, user)
                .map(StudyMember::getIsAdmin)
                .orElse(false);

        // 스터디 멤버 목록 조회
        List<StudyMember> members = studyMemberRepository.findByStudy(study);
        List<StudyMemberResponse> memberResponses = members.stream()
                .map(member -> {
                    Boolean isOwner = member.getUser().getId().equals(study.getOwner().getId());
                    return StudyMemberResponse.from(member, isOwner);
                })
                .collect(Collectors.toList());

        Integer currentMembers = members.size();

        return StudyDetailResponse.from(study, userId, currentMembers, isMember, isAdmin, memberResponses);
    }

    @Transactional
    public StudyResponse updateStudy(Long userId, Long studyId, StudyRequest request) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장만 수정 가능
        if (!study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장만 스터디를 수정할 수 있습니다.");
        }

        String hashedPassword = null;
        if (request.getIsPasswordProtected() && request.getPassword() != null && !request.getPassword().isEmpty()) {
            hashedPassword = passwordEncoder.encode(request.getPassword());
        }

        study.update(
                request.getName(),
                request.getDescription(),
                request.getMaxMembers(),
                hashedPassword,
                request.getIsPasswordProtected(),
                request.getIsApprovalRequired()
        );

        Integer currentMembers = studyMemberRepository.countMembersByStudy(study).intValue();

        return StudyResponse.from(study, userId, currentMembers, true);
    }

    @Transactional
    public void deleteStudy(Long userId, Long studyId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장만 삭제 가능
        if (!study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장만 스터디를 삭제할 수 있습니다.");
        }

        // 스터디 관련 모든 데이터 삭제 (가입 요청, 스터디 멤버)
        studyJoinRequestRepository.deleteAll(
                studyJoinRequestRepository.findByStudyAndStatus(study, StudyJoinRequest.RequestStatus.PENDING)
        );
        
        studyMemberRepository.deleteAll(
                studyMemberRepository.findByStudy(study)
        );

        studyRepository.delete(study);
    }

    @Transactional
    public void joinStudy(Long userId, Long studyId, com.toy.checkoutcheckout.domain.study.dto.StudyJoinRequest request) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        // 이미 가입된 멤버인지 확인
        if (studyMemberRepository.existsByStudyAndUser(study, user)) {
            throw new BadRequestException("이미 스터디에 가입되어 있습니다.");
        }

        // 가입 요청이 이미 존재하는지 확인
        if (studyJoinRequestRepository.existsByStudyAndUserAndStatus(study, user, StudyJoinRequest.RequestStatus.PENDING)) {
            throw new BadRequestException("이미 가입 요청이 처리 중입니다.");
        }

        // 스터디 정원 확인
        Long currentMemberCount = studyMemberRepository.countMembersByStudy(study);
        if (currentMemberCount >= study.getMaxMembers()) {
            throw new BadRequestException("스터디 정원이 가득 찼습니다.");
        }

        // 비밀번호 확인
        if (study.getIsPasswordProtected()) {
            if (request.getPassword() == null || !passwordEncoder.matches(request.getPassword(), study.getPassword())) {
                throw new BadRequestException("비밀번호가 일치하지 않습니다.");
            }
        }

        // 승인이 필요한 경우
        if (study.getIsApprovalRequired()) {
            StudyJoinRequest joinRequest = StudyJoinRequest.builder()
                    .study(study)
                    .user(user)
                    .status(StudyJoinRequest.RequestStatus.PENDING)
                    .build();

            studyJoinRequestRepository.save(joinRequest);
        } else {
            // 즉시 가입
            StudyMember member = StudyMember.builder()
                    .study(study)
                    .user(user)
                    .isAdmin(false) // 일반 멤버는 관리자 권한이 없음
                    .build();

            studyMemberRepository.save(member);
        }
    }

    @Transactional
    public void leaveStudy(Long userId, Long studyId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        // 스터디장은 탈퇴할 수 없음
        if (study.getOwner().getId().equals(userId)) {
            throw new BadRequestException("스터디장은 스터디를 탈퇴할 수 없습니다. 스터디를 삭제하거나 스터디장을 위임하세요.");
        }

        // 스터디 멤버인지 확인
        StudyMember member = studyMemberRepository.findByStudyAndUser(study, user)
                .orElseThrow(() -> new NotFoundException("스터디 멤버가 아닙니다."));

        studyMemberRepository.delete(member);
    }

    @Transactional
    public void kickMember(Long userId, Long studyId, Long targetUserId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장 또는 관리자만 강퇴 가능
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        StudyMember requester = studyMemberRepository.findByStudyAndUser(study, user)
                .orElseThrow(() -> new ForbiddenException("스터디 멤버가 아닙니다."));

        if (!requester.getIsAdmin() && !study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장 또는 관리자만 멤버를 강퇴할 수 있습니다.");
        }

        // 대상 사용자가 스터디장인 경우 강퇴 불가
        if (study.getOwner().getId().equals(targetUserId)) {
            throw new BadRequestException("스터디장은 강퇴할 수 없습니다.");
        }

        // 관리자가 다른 관리자를 강퇴하려는 경우 (스터디장은 가능)
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("대상 사용자를 찾을 수 없습니다."));

        StudyMember targetMember = studyMemberRepository.findByStudyAndUser(study, targetUser)
                .orElseThrow(() -> new NotFoundException("대상 사용자가 스터디 멤버가 아닙니다."));

        if (requester.getIsAdmin() && !study.getOwner().getId().equals(userId) && targetMember.getIsAdmin()) {
            throw new ForbiddenException("관리자는 다른 관리자를 강퇴할 수 없습니다.");
        }

        studyMemberRepository.delete(targetMember);
    }

    @Transactional
    public void makeAdmin(Long userId, Long studyId, Long targetUserId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장만 관리자 지정 가능
        if (!study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장만 관리자를 지정할 수 있습니다.");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("대상 사용자를 찾을 수 없습니다."));

        StudyMember targetMember = studyMemberRepository.findByStudyAndUser(study, targetUser)
                .orElseThrow(() -> new NotFoundException("대상 사용자가 스터디 멤버가 아닙니다."));

        targetMember.makeAdmin();
    }

    @Transactional
    public void removeAdmin(Long userId, Long studyId, Long targetUserId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장만 관리자 해제 가능
        if (!study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장만 관리자를 해제할 수 있습니다.");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("대상 사용자를 찾을 수 없습니다."));

        StudyMember targetMember = studyMemberRepository.findByStudyAndUser(study, targetUser)
                .orElseThrow(() -> new NotFoundException("대상 사용자가 스터디 멤버가 아닙니다."));

        targetMember.removeAdmin();
    }

    @Transactional(readOnly = true)
    public List<StudyJoinRequestResponse> getJoinRequests(Long userId, Long studyId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장 또는 관리자만 조회 가능
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        StudyMember requester = studyMemberRepository.findByStudyAndUser(study, user)
                .orElseThrow(() -> new ForbiddenException("스터디 멤버가 아닙니다."));

        if (!requester.getIsAdmin() && !study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장 또는 관리자만 가입 요청을 조회할 수 있습니다.");
        }

        List<StudyJoinRequest> requests = studyJoinRequestRepository.findByStudyAndStatus(
                study, StudyJoinRequest.RequestStatus.PENDING);

        return requests.stream()
                .map(StudyJoinRequestResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveJoinRequest(Long userId, Long studyId, Long requestId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장 또는 관리자만 승인 가능
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        StudyMember requester = studyMemberRepository.findByStudyAndUser(study, user)
                .orElseThrow(() -> new ForbiddenException("스터디 멤버가 아닙니다."));

        if (!requester.getIsAdmin() && !study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장 또는 관리자만 가입 요청을 승인할 수 있습니다.");
        }

        StudyJoinRequest joinRequest = studyJoinRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("가입 요청을 찾을 수 없습니다."));

        // 요청이 해당 스터디에 대한 것인지 확인
        if (!joinRequest.getStudy().getId().equals(studyId)) {
            throw new BadRequestException("잘못된 요청입니다.");
        }

        // 스터디 정원 확인
        Long currentMemberCount = studyMemberRepository.countMembersByStudy(study);
        if (currentMemberCount >= study.getMaxMembers()) {
            throw new BadRequestException("스터디 정원이 가득 찼습니다.");
        }

        // 요청 승인
        joinRequest.approve();

        // 스터디 멤버로 추가
        StudyMember member = StudyMember.builder()
                .study(study)
                .user(joinRequest.getUser())
                .isAdmin(false) // 일반 멤버는 관리자 권한이 없음
                .build();

        studyMemberRepository.save(member);
    }

    @Transactional
    public void rejectJoinRequest(Long userId, Long studyId, Long requestId) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new NotFoundException("스터디를 찾을 수 없습니다."));

        // 스터디장 또는 관리자만 거절 가능
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        StudyMember requester = studyMemberRepository.findByStudyAndUser(study, user)
                .orElseThrow(() -> new ForbiddenException("스터디 멤버가 아닙니다."));

        if (!requester.getIsAdmin() && !study.getOwner().getId().equals(userId)) {
            throw new ForbiddenException("스터디장 또는 관리자만 가입 요청을 거절할 수 있습니다.");
        }

        StudyJoinRequest joinRequest = studyJoinRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("가입 요청을 찾을 수 없습니다."));

        // 요청이 해당 스터디에 대한 것인지 확인
        if (!joinRequest.getStudy().getId().equals(studyId)) {
            throw new BadRequestException("잘못된 요청입니다.");
        }

        // 요청 거절
        joinRequest.reject();
    }
}
