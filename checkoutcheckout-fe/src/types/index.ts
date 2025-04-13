// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

// 인증 관련 타입
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
}

// 타이머 관련 타입
export interface TimerSession {
  id: number;
  startTime: string;
  endTime?: string;
  duration: number; // 초 단위
}

export interface TimerStatus {
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  currentDuration?: number; // 초 단위
}

export interface DailyStudyTime {
  date: string;
  duration: number; // 초 단위
}

export interface StudyTimeHistory {
  records: DailyStudyTime[];
}

// 랭킹 관련 타입
export interface RankEntry {
  rank: number;
  userId: number;
  nickname: string;
  studyTime: number; // 초 단위
}

export interface DailyRanking {
  date: string;
  rankings: RankEntry[];
}

// API 응답 관련 타입
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code: string;
}