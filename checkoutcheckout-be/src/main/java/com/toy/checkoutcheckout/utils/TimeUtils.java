package com.toy.checkoutcheckout.utils;

/**
 * 시간 관련 유틸리티 클래스
 */
public class TimeUtils {
    
    /**
     * 초 단위를 "HH:MM:SS" 형식으로 변환
     * @param seconds 초 단위 시간
     * @return 시:분:초 형식의 문자열
     */
    public static String formatMillisToTimeString(long seconds) {
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;
        
        return String.format("%02d:%02d:%02d", hours, minutes, remainingSeconds);
    }
    
    /**
     * 초 단위를 읽기 쉬운 형식으로 변환 (예: 2시간 30분)
     * @param seconds 초 단위 시간
     * @return 사람이 읽기 쉬운 형식의 문자열
     */
    public static String formatSecondsToReadable(long seconds) {
        if (seconds < 60) {
            return seconds + "초";
        }

        StringBuilder result = new StringBuilder();
        long hours = seconds / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;

        if (hours > 0) {
            result.append(hours).append("시간 ");
        }
        if (minutes > 0) {
            result.append(minutes).append("분 ");
        }
        if (remainingSeconds > 0 && hours == 0) { // 시간이 있으면 초는 표시하지 않음
            result.append(remainingSeconds).append("초");
        }

        return result.toString().trim();
    }
}