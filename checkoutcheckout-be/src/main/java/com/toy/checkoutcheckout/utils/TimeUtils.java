package com.toy.checkoutcheckout.utils;

/**
 * 시간 관련 유틸리티 클래스
 */
public class TimeUtils {
    
    /**
     * 밀리초를 "HH:MM:SS" 형식으로 변환
     * @param milliseconds 밀리초
     * @return 시:분:초 형식의 문자열
     */
    public static String formatMillisToTimeString(long milliseconds) {
        long totalSeconds = milliseconds / 1000;
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}
