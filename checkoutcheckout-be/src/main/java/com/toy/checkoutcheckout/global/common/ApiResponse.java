package com.toy.checkoutcheckout.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private static final String SUCCESS_STATUS = "success";
    private static final String ERROR_STATUS = "error";

    private String status;
    private T data;
    private ErrorInfo error;

    @Getter
    @AllArgsConstructor
    private static class ErrorInfo {
        private String code;
        private String message;
    }

    // 성공 응답 생성
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(SUCCESS_STATUS, data, null);
    }

    // 에러 응답 생성
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(ERROR_STATUS, null, new ErrorInfo(code, message));
    }
}
