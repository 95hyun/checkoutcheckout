package com.toy.checkoutcheckout.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 공통 오류
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력 값입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "서버 오류가 발생했습니다."),
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "C003", "요청한 리소스가 존재하지 않습니다."),
    
    // 인증, 인가 관련 오류
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A002", "접근 권한이 없습니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "A003", "만료된 토큰입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "A004", "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."),
    
    // 사용자 관련 오류
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U002", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "U003", "이미 사용 중인 닉네임입니다."),
    
    // 타이머 관련 오류
    TIMER_ALREADY_STARTED(HttpStatus.BAD_REQUEST, "T001", "이미 타이머가 시작되었습니다."),
    TIMER_NOT_STARTED(HttpStatus.BAD_REQUEST, "T002", "시작된 타이머가 없습니다."),
    
    // 스터디 관련 오류
    STUDY_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "스터디를 찾을 수 없습니다."),
    STUDY_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "S002", "스터디 멤버를 찾을 수 없습니다."),
    
    // 계획 관련 오류
    PLAN_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "계획을 찾을 수 없습니다."),
    INVALID_PLAN_DATE(HttpStatus.BAD_REQUEST, "P002", "유효하지 않은 계획 날짜입니다."),
    
    // 파일 업로드 관련 오류
    FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE, "F001", "파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다."),
    MULTIPART_ERROR(HttpStatus.BAD_REQUEST, "F002", "파일 업로드 중 오류가 발생했습니다."),
    
    // 캐릭터 관련 오류
    CHARACTER_NOT_FOUND(HttpStatus.NOT_FOUND, "CH001", "캐릭터를 찾을 수 없습니다."),
    CHARACTER_ALREADY_ACQUIRED(HttpStatus.CONFLICT, "CH002", "이미 획득한 캐릭터입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
