package com.toy.checkoutcheckout.global.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이 서비스는 캐릭터 기반 프로필 시스템으로 전환하면서 더 이상 사용되지 않습니다.
 * 파일 업로드 기능이 제거되었습니다.
 */
@Service
public class FileStorageService {

    /**
     * 더 이상 사용되지 않는 메서드입니다.
     * 모든 프로필 이미지는 이제 캐릭터로 대체됩니다.
     */
    public String storeFile(MultipartFile file) {
        throw new UnsupportedOperationException("File upload is no longer supported. Use characters as profile images.");
    }
}