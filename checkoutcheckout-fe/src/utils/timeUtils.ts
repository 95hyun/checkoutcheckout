/**
 * 시간 관련 유틸리티 함수들을 모아둔 파일입니다.
 * 타이머, 통계, 랭킹 등 다양한 컴포넌트에서 사용합니다.
 */

/**
 * 초 단위 시간을 00:00:00 형식(시:분:초)으로 변환합니다.
 * 타이머 표시, 통계, 랭킹 등에서 사용됩니다.
 */
export const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
};

/**
 * 초 단위 시간을 읽기 쉬운 형식으로 변환합니다. (예: 2시간 30분)
 * 계획 목표 시간, 통계 요약 등에서 사용됩니다.
 */
export const formatSecondsToReadable = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}초`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = '';
  if (hours > 0) {
    result += `${hours}시간 `;
  }
  if (minutes > 0) {
    result += `${minutes}분 `;
  }
  if (remainingSeconds > 0 && hours === 0) { // 시간이 있으면 초는 표시하지 않음
    result += `${remainingSeconds}초`;
  }

  return result.trim();
};

/**
 * 공부 시간에 따른 색상 계산 (GitHub 잔디 스타일)
 * 공부 시간 시각화에 사용됩니다.
 */
export const getIntensityColor = (durationInSeconds: number): string => {
  // 최대 8시간(28800초)를 기준으로 색상 강도 계산
  const maxDuration = 28800;
  const intensity = Math.min(durationInSeconds / maxDuration, 1);
  
  if (intensity === 0) return '#ebedf0'; // 공부 안 함
  if (intensity < 0.2) return '#9be9a8'; // 매우 적음
  if (intensity < 0.4) return '#40c463'; // 적음
  if (intensity < 0.6) return '#30a14e'; // 보통
  if (intensity < 0.8) return '#216e39'; // 많음
  return '#0e4429'; // 매우 많음
};

/**
 * 한국 시간 기준으로 오늘 날짜를 YYYY-MM-DD 형식으로 반환합니다.
 * 캐릭터 획득 날짜 비교 등에서 사용됩니다.
 */
export const getTodayKST = (): string => {
  const now = new Date();
  // 한국 시간으로 변환 (UTC+9)
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  
  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 주어진 날짜를 한국 시간 기준으로 YYYY-MM-DD 형식으로 변환합니다.
 */
export const formatDateKST = (date: Date | string): string => {
  const dateObj = new Date(date);
  // 한국 시간으로 변환 (UTC+9)
  const kstTime = new Date(dateObj.getTime() + (9 * 60 * 60 * 1000));
  
  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};