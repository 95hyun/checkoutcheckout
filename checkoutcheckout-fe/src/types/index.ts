// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  characterType?: string; // character -> characterType으로 변경
}

// 캐릭터 관련 타입
export interface Character {
  id: number;
  type: string;
  acquiredDate: string;
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

// 스터디 관련 타입
export interface Study {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerNickname: string;
  maxMembers: number;
  currentMembers: number;
  isPasswordProtected: boolean;
  isApprovalRequired: boolean;
  isOwner: boolean;
  isMember: boolean;
  createdAt: string;
}

export interface StudyDetail extends Study {
  isAdmin: boolean;
  members: StudyMember[];
}

export interface StudyMember {
  id: number;
  userId: number;
  nickname: string;
  profileImage?: string;
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: string;
}

export interface StudyJoinRequest {
  id: number;
  studyId: number;
  studyName: string;
  userId: number;
  userNickname: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
}

export interface StudyCreateRequest {
  name: string;
  description: string;
  maxMembers: number;
  password?: string;
  isPasswordProtected: boolean;
  isApprovalRequired: boolean;
}

export interface StudyJoinRequestDto {
  password?: string;
}

// 스터디 랭킹 관련 타입
export interface StudyRankEntry {
  rank: number;
  studyId: number;
  studyName: string;
  studyTime: number; // 밀리초 단위
  formattedStudyTime: string; // "00:00:00" 형식
}

export interface StudyRanking {
  startDate: string;
  endDate: string;
  rankings: StudyRankEntry[];
}

export interface StudyMemberRankEntry {
  rank: number;
  userId: number;
  nickname: string;
  studyTime: number; // 밀리초 단위
  formattedStudyTime: string; // "00:00:00" 형식
}

export interface StudyMemberRanking {
  studyId: number;
  studyName: string;
  startDate: string;
  endDate: string;
  rankings: StudyMemberRankEntry[];
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