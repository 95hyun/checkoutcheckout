import React, { useEffect } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Timer from '../components/Timer';
import useTimerStore from '../store/timerStore';
import useCharacterStore from '../store/characterStore';
import { FaCalendarAlt, FaClock, FaGem } from 'react-icons/fa';
import { formatSecondsToReadable } from '../utils/timeUtils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';

// 캐릭터 이미지 매핑 (임시 - 실제로는 서버에서 URL을 받아올 것)
const characterImages: Record<string, string> = {
  // 소문자
  'cleric': '클레릭',
  'knight': '기사',
  'dwarf': '드워프',
  'demonfemale': '여성 악마',
  'demonmale': '남성 악마',
  'wizard': '마법사',
  'shield': '방패병',
  'captain': '캡틴',
  'archer': '궁수',
  'assassin': '암살자',
  
  // 카멜 케이스
  'demonFemale': '여성 악마',
  'demonMale': '남성 악마',
  
  // 스네이크 케이스
  'demon_female': '여성 악마',
  'demon_male': '남성 악마',
  
  // 대문자
  'CLERIC': '클레릭',
  'KNIGHT': '기사',
  'DWARF': '드워프',
  'DEMON_FEMALE': '여성 악마',
  'DEMON_MALE': '남성 악마',
  'WIZARD': '마법사',
  'SHIELD': '방패병',
  'CAPTAIN': '캡틴',
  'ARCHER': '궁수',
  'ASSASSIN': '암살자',
  
  // 첫 글자만 대문자
  'Cleric': '클레릭',
  'Knight': '기사',
  'Dwarf': '드워프',
  'DemonFemale': '여성 악마',
  'DemonMale': '남성 악마',
  'Wizard': '마법사',
  'Shield': '방패병',
  'Captain': '캡틴',
  'Archer': '궁수',
  'Assassin': '암살자'
};

const DashboardPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const { 
    recentSessions = [], // 기본값으로 빈 배열 설정
    fetchRecentSessions, 
    isLoading, 
    error 
  } = useTimerStore();
  
  const {
    todayCharacter,
    fetchUserCharacters,
    loading: characterLoading,
    error: characterError
  } = useCharacterStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 최근 세션 데이터와 캐릭터 정보 불러오기
    fetchRecentSessions();
    fetchUserCharacters();
  }, [fetchRecentSessions, fetchUserCharacters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 타이머 섹션 */}
          <div className="lg:col-span-2">
            <Timer />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            {/* 오늘의 캐릭터 섹션 */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaGem className="mr-2 text-primary" />
                오늘의 획득 캐릭터
              </h2>
              
              {characterError && (
                <ErrorMessage message={characterError} className="mb-4" />
              )}
              
              {characterLoading ? (
                <div className="flex justify-center py-8">
                  <Loading size="md" />
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  {todayCharacter ? (
                    <>
                      <div className="mb-4 p-2 bg-gray-100 rounded-lg">
                        <div className="w-32 h-32 overflow-hidden rounded-lg">
                          {/* 캐릭터 타입에 따른 이미지 표시 */}
                          <div className={`w-full h-full flex items-center justify-center character-${todayCharacter.type} character-image`}>
                            {/* 
                              이미지가 로드되지 않을 경우에만 텍스트 표시,
                              character.type 값을 그대로 클래스에 적용 (대소문자 구분 유지)
                            */}
                            <span className="text-lg font-bold opacity-0">
                              {characterImages[todayCharacter.type] || todayCharacter.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-center">
                        {characterImages[todayCharacter.type] || todayCharacter.type}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        획득일: {new Date(todayCharacter.acquiredDate).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 p-2 bg-gray-100 rounded-lg">
                        <div className="w-32 h-32 overflow-hidden rounded-lg flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">?</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-center">
                        아직 오늘 획득한 캐릭터가 없습니다.<br />
                        10초 이상 공부하면 캐릭터를 획득할 수 있습니다!
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* 최근 세션 섹션 */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary" />
                최근 공부 기록
              </h2>
              
              {error && (
                <ErrorMessage message={error} className="mb-4" />
              )}
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loading size="md" />
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentSessions && recentSessions.length > 0 ? (
                    recentSessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                            {session.endTime && (
                              <p className="text-xs text-gray-400">
                                ~ {new Date(session.endTime).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="text-gray-400 mr-1" />
                            <span className="font-medium">
                              {formatSecondsToReadable(session.duration || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-8 text-center text-gray-500">
                      아직 공부 기록이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;