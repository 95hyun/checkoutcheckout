// 초 단위 시간을 00:00:00 형식으로 변환
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

// 초 단위 시간을 읽기 쉬운 형식으로 변환 (예: 2시간 30분)
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

// 시간 형식 변환 (초 -> 00:00:00) - Timer 컴포넌트용
export const formatTimeDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
};

// 공부 시간에 따른 색상 계산 (GitHub 잔디 스타일)
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