package com.toy.checkoutcheckout.global.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        log.error("BusinessException: {}", e.getMessage());
        HttpStatus status = e.getStatus() != null ? e.getStatus() : HttpStatus.BAD_REQUEST;
        
        ErrorResponse response = ErrorResponse.builder()
                .message(e.getMessage())
                .status(status)
                .code(e.getCode())
                .build();
        
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.error("RuntimeException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message(e.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .code("INTERNAL_SERVER_ERROR")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException e) {
        log.error("UsernameNotFoundException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message(e.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .code("USER_NOT_FOUND")
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException e) {
        log.error("BadCredentialsException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.")
                .status(HttpStatus.UNAUTHORIZED)
                .code("INVALID_CREDENTIALS")
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
        log.error("AccessDeniedException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("접근 권한이 없습니다.")
                .status(HttpStatus.FORBIDDEN)
                .code("ACCESS_DENIED")
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
    
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ErrorResponse> handleValidationException(Exception e) {
        log.error("Validation Exception: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("입력값이 올바르지 않습니다.")
                .status(HttpStatus.BAD_REQUEST)
                .code("INVALID_INPUT")
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchElementException(NoSuchElementException e) {
        log.error("NoSuchElementException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message(e.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .code("RESOURCE_NOT_FOUND")
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        log.error("MaxUploadSizeExceededException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.")
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .code("FILE_TOO_LARGE")
                .build();
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
    }
    
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErrorResponse> handleMultipartException(MultipartException e) {
        log.error("MultipartException: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("파일 업로드 중 오류가 발생했습니다.")
                .status(HttpStatus.BAD_REQUEST)
                .code("MULTIPART_ERROR")
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("Exception: ", e);
        ErrorResponse response = ErrorResponse.builder()
                .message("서버 내부 오류가 발생했습니다.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .code("INTERNAL_SERVER_ERROR")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}