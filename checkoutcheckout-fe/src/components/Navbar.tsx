import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { FaClock, FaChartBar, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa';
import { Rarity } from '../types';

// 캐릭터 희귀도 매핑 (기본값 설정 - 관리 용이성을 위해 대문자 기준)
const characterRarityMap: Record<string, Rarity> = {
  // Common 동물 캐릭터
  'COMMON_RABBIT': 'common',
  'COMMON_SQUIRREL': 'common',
  'COMMON_HEDGEHOG': 'common',
  'COMMON_PIGEON': 'common',
  
  // Uncommon 동물 캐릭터
  'UNCOMMON_CAT': 'uncommon',
  'UNCOMMON_DOG': 'uncommon',
  'UNCOMMON_BEAR': 'uncommon',
  'UNCOMMON_HAMSTER': 'uncommon',
  
  // Rare 동물 캐릭터
  'RARE_WOLF': 'rare',
  'RARE_FOX': 'rare',
  'RARE_LION': 'rare',
  'RARE_PENGUIN': 'rare',
  
  // Epic 동물 캐릭터
  'EPIC_UNICORN': 'epic',
  'EPIC_DRAGON': 'epic',
  'EPIC_PHONEIX': 'epic',
  'EPIC_WHITETIGER': 'epic',
  
  // Legendary 동물 캐릭터
  'LEGENDARY_DOGE': 'legendary',
  'LEGENDARY_PEPE': 'legendary',
  'LEGENDARY_TRALELLOTRALALA': 'legendary',
  'LEGENDARY_CHILLGUY': 'legendary'
};

// 캐릭터 타입 문자열에서 희귀도 가져오기 (대소문자 및 형식 정규화)
const getRarityForCharacter = (characterType: string): Rarity => {
  // 타입이 없으면 common 반환
  if (!characterType) return 'common';
  
  // 카멜케이스(demonFemale) -> DEMON_FEMALE 처리
  if (/^[a-z]+[A-Z]/.test(characterType)) {
    // 카멜 케이스 -> 스네이크 케이스
    const snakeCase = characterType.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    return characterRarityMap[snakeCase] || 'common';
  }
  
  // 소문자(common_rabbit)인 경우 'COMMON_RABBIT' 변환
  if (/^[a-z_]+$/.test(characterType)) {
    const upperCase = characterType.toUpperCase();
    return characterRarityMap[upperCase] || 'common';
  }
  
  // 이미 SNAKE_CASE이거나 다른 형식인 경우 그대로 검색
  return characterRarityMap[characterType.toUpperCase()] || 'common';
};

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigate = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a 
                href="/"
                onClick={handleNavigate('/')} 
                className="text-xl font-bold text-gray-900"
              >
                CheckoutCheckout
              </a>
            </div>
            
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  onClick={handleNavigate('/dashboard')}
                  className={`border-transparent text-gray-500 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard' ? 'border-red-600 text-red-600' : ''
                  }`}
                >
                  <FaClock className="mr-1" /> 공부하기
                </a>
                <a
                  href="/history"
                  onClick={handleNavigate('/history')}
                  className={`border-transparent text-gray-500 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/history' ? 'border-red-600 text-red-600' : ''
                  }`}
                >
                  <FaChartBar className="mr-1" /> 캘린더
                </a>
                <a
                  href="/ranking"
                  onClick={handleNavigate('/ranking')}
                  className={`border-transparent text-gray-500 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/ranking' ? 'border-red-600 text-red-600' : ''
                  }`}
                >
                  <FaChartBar className="mr-1" /> 랭킹
                </a>
                <a
                  href="/studies"
                  onClick={handleNavigate('/studies')}
                  className={`border-transparent text-gray-500 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/studies' ? 'border-red-600 text-red-600' : ''
                  }`}
                >
                  <FaUsers className="mr-1" /> 스터디
                </a>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-sm font-medium text-gray-700">
                    {user.nickname}님을 응원합니다
                  </span>
                )}
                <a
                  href="/profile"
                  onClick={handleNavigate('/profile')}
                  className="text-gray-500 hover:text-red-600"
                  title="마이페이지"
                >
                  {user?.characterType ? (
                    <div className={`w-8 h-8 rounded-full overflow-hidden relative profile-rarity-${user.characterType ? getRarityForCharacter(user.characterType) : 'common'}`}>
                      <div className={`w-full h-full character-${user.characterType} character-image`}></div>
                    </div>
                  ) : (
                    <FaUser />
                  )}
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600"
                  title="로그아웃"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  onClick={handleNavigate('/login')}
                  className="text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  로그인
                </a>
                <a
                  href="/signup"
                  onClick={handleNavigate('/signup')}
                  className="bg-red-600 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  회원가입
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;