import React, { useEffect, useState, useRef } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import useCharacterStore from '../store/characterStore';
import { FaUser, FaGem, FaCalendarAlt, FaTimes, FaCheck } from 'react-icons/fa';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';
import '../assets/holographic-card.css';

import { Rarity } from '../types';

// 캐릭터 이미지 매핑
const characterImages: Record<string, string> = {
  // Common 동물 캐릭터
  'common_rabbit': '토끼',
  'common_squirrel': '다람쥐',
  'common_hedgehog': '고슴도치',
  'common_pigeon': '비둘기',
  
  // Uncommon 동물 캐릭터
  'uncommon_cat': '고양이',
  'uncommon_dog': '강아지',
  'uncommon_bear': '곰',
  'uncommon_hamster': '햄스터',
  
  // Rare 동물 캐릭터
  'rare_wolf': '늑대',
  'rare_fox': '여우',
  'rare_lion': '사자',
  'rare_penguin': '펭귄',
  
  // Epic 동물 캐릭터
  'epic_unicorn': '유니콘',
  'epic_dragon': '드래곤',
  'epic_phoneix': '불사조',
  'epic_whitetiger': '백호',
  
  // Legendary 동물 캐릭터
  'legendary_doge': '도지',
  'legendary_pepe': '페페',
  'legendary_tralellotralala': '트라랄라',
  'legendary_chillguy': '칠가이'
};

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

// 희귀도별 한글 표기
const rarityLabels: Record<Rarity, string> = {
  'common': '일반',
  'uncommon': '고급',
  'rare': '희귀',
  'epic': '영웅',
  'legendary': '전설'
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

// 모달에서 표시할 캐릭터 인터페이스
interface ModalCharacter {
  type: string;
  acquiredDate: string;
  rarity?: Rarity; // 희귀도 추가
}

const ProfilePage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const { 
    user, 
    setCharacterAsProfile, 
    removeProfileImage 
  } = useAuthStore();
  
  const { 
    characters,
    fetchUserCharacters,
    loading,
    error
  } = useCharacterStore();
  
  // 모달 관련 state
  const [selectedCharacter, setSelectedCharacter] = useState<ModalCharacter | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [shinePosition, setShinePosition] = useState({ x: 0, y: 0 });
  const [modalActive, setModalActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 프로필 관리 상태
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [profileEditMode, setProfileEditMode] = useState(false);

  useEffect(() => {
    fetchUserCharacters();
  }, [fetchUserCharacters]);
  
  // 선택된 캐릭터가 바뀌면 모달 활성화 애니메이션 적용
  useEffect(() => {
    if (selectedCharacter) {
      // 약간의 지연 후 모달 활성화 - 애니메이션을 위함
      setTimeout(() => {
        setModalActive(true);
      }, 10);
    } else {
      setModalActive(false);
    }
  }, [selectedCharacter]);

  // 캐릭터 카드 클릭 핸들러
  const handleCharacterClick = (character: any) => {
    if (profileEditMode) {
      // 프로필 편집 모드일 경우 캐릭터를 프로필로 설정
      handleSetCharacterAsProfile(character.type);
    } else {
      // 일반 모드일 경우 캐릭터 상세 모달 표시
      const rarity = character.rarity || getRarityForCharacter(character.type);
      setSelectedCharacter({
        type: character.type,
        acquiredDate: character.acquiredDate,
        rarity: rarity
      });
      setRotation({ x: 0, y: 0 }); // 회전 각도 초기화
    }
  };

  // 캐릭터를 프로필 이미지로 설정
  const handleSetCharacterAsProfile = async (characterType: string) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await setCharacterAsProfile(characterType);
      setProfileEditMode(false);
    } catch (error) {
      console.error('Failed to set character as profile:', error);
      setUpdateError('캐릭터를 프로필로 설정하는데 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 프로필 이미지 제거
  const handleRemoveProfileImage = async () => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await removeProfileImage();
      setProfileEditMode(false);
    } catch (error) {
      console.error('Failed to remove profile image:', error);
      setUpdateError('프로필 이미지 제거에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 모달 닫기 핸들러
  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // 이벤트 버블링 방지
    }
    setModalActive(false);
    setTimeout(() => {
      setSelectedCharacter(null);
    }, 300); // 애니메이션 시간을 고려해 약간의 지연 후 캐릭터 상태 초기화
  };

  // 마우스 드래그 시작 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 마우스 드래그 중 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    // 카드 회전 효과는 드래깅 상태에 관계없이 적용
    const card = cardRef.current;
    if (!card) return;
    
    // 카드를 기준으로 한 마우스 위치를 계산
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 마우스와 카드 중심 사이의 거리에 따라 회전 각도 계산
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // 회전 각도 계산 (카드 중심에서 마우스까지의 상대적 위치)
    // 회전 감도를 조절하여 좀 더 부드럽게 만듭니다
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10; // 좌우 회전
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 10; // 상하 회전
    
    // 빛 반사 효과 위치 계산 (카드 내 마우스 위치의 비율)
    let normalizedX = (mouseX - rect.left) / rect.width;
    let normalizedY = (mouseY - rect.top) / rect.height;
    
    // 범위를 0-1로 제한
    normalizedX = Math.max(0, Math.min(1, normalizedX));
    normalizedY = Math.max(0, Math.min(1, normalizedY));
    
    // 회전 및 빛 반사 효과 적용
    if (isDragging) {
      // 드래깅 중일 때는 회전 감도를 유지
      setRotation({ x: rotateX, y: rotateY });
    } else {
      // 드래깅 중이 아닐 때는 호버 효과로 약한 회전 적용
      setRotation({ x: rotateX * 0.5, y: rotateY * 0.5 });
    }
    setShinePosition({ x: normalizedX, y: normalizedY });
  };

  // 마우스 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // 드래그가 끝났을 때 부드럽게 회전을 원위치로 돌아가게 함
    // 약간의 지연 시간을 두어 자연스러운 효과 제공
    setTimeout(() => {
      if (!isDragging) {
        // 부드러운 트랜지션을 위해 천천히 원위치로
        setRotation({ 
          x: rotation.x * 0.7, 
          y: rotation.y * 0.7 
        });
        
        // 완전히 원위치로 돌아가기
        setTimeout(() => {
          if (!isDragging) {
            setRotation({ x: 0, y: 0 });
          }
        }, 500);
      }
    }, 100);
  };

  // 마우스가 트래킹 영역을 떠날 때
  const handleMouseLeave = () => {
    setIsDragging(false);
    
    // 트래킹 영역을 벗어날 때 부드럽게 원위치로 돌아가기
    // 자연스러운 모션을 위해 단계별로 애니메이션 처리
    const currRotation = { ...rotation };
    
    // 첫 단계: 현재 회전 각도의 60%로 줄이기
    setRotation({
      x: currRotation.x * 0.6,
      y: currRotation.y * 0.6
    });
    
    // 두 번째 단계: 현재 회전 각도의 20%로 줄이기
    setTimeout(() => {
      setRotation({
        x: currRotation.x * 0.2,
        y: currRotation.y * 0.2
      });
      
      // 세 번째 단계: 완전히 원위치로
      setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 100);
    }, 100);
  };

  // 프로필 이미지 렌더링
  const renderProfileImage = () => {
    if (isUpdating) {
      return (
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-200">
          <Loading size="sm" />
        </div>
      );
    }

    if (user?.characterType) {
      // 캐릭터 희귀도 가져오기
      const characterRarity = getRarityForCharacter(user.characterType);
      
      return (
        <div className={`w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative profile-rarity-${characterRarity}`}>
          <div className={`w-full h-full character-${user.characterType} character-image`}></div>
          
          {/* 희귀도별 특수 효과 */}
          {characterRarity === 'legendary' && <div className="profile-legendary-effect"></div>}
          {characterRarity === 'epic' && <div className="profile-epic-effect"></div>}
          {characterRarity === 'rare' && <div className="profile-rare-effect"></div>}
          
          {/* 작은 희귀도 배지 (옵션) */}
          <div className={`profile-rarity-badge profile-rarity-badge-${characterRarity}`}>
            {rarityLabels[characterRarity].charAt(0)}
          </div>
        </div>
      );
    }

    return (
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl">
        <FaUser />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            {/* 프로필 이미지 */}
            <div className="relative mb-4 sm:mb-0 sm:mr-6">
              {renderProfileImage()}
              
              {/* 프로필 이미지 수정 버튼 */}
              {!profileEditMode ? (
                <button 
                  className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
                  onClick={() => setProfileEditMode(true)}
                  title="캐릭터 변경"
                >
                  <FaGem size={14} />
                </button>
              ) : (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button 
                    className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors"
                    onClick={handleRemoveProfileImage}
                    title="프로필 이미지 제거"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">{user?.nickname || '사용자'}</h1>
              <p className="text-gray-500">{user?.email || ''}</p>
              
              {/* 프로필 이미지 편집 모드 안내 */}
              {profileEditMode && (
                <div className="mt-2 text-sm text-primary bg-blue-50 p-2 rounded-md">
                  캐릭터를 클릭하여 프로필 이미지로 설정하세요.
                </div>
              )}
              
              {/* 업데이트 에러 메시지 */}
              {updateError && (
                <div className="mt-2 text-sm text-red-600">
                  {updateError}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <FaGem className="mr-2 text-primary" />
            획득한 캐릭터 컬렉션
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            매일 한번 6시간 이상 공부했을 때 랜덤으로 캐릭터 카드를 획득하고, 프로필 사진으로 등록할 수 있어요!
          </p>
          
          {error && <ErrorMessage message={error} className="mb-4" />}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading size="md" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {characters && characters.length > 0 ? (
                characters.map((character, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center p-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer
                      ${profileEditMode ? 'border-dashed border-blue-300 hover:border-blue-500' : ''}
                      ${user?.characterType === character.type ? 'border-primary bg-blue-50' : ''}
                    `}
                    onClick={() => handleCharacterClick(character)}
                  >
                    {/* 희귀도 계산 */}
                    {(() => {
                      const rarity = character.rarity || getRarityForCharacter(character.type);
                      return (
                        <div className={`w-full mb-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative character-rarity-${rarity}`}>
                          {/* 희귀도 배지 표시 */}
                          <div className={`rarity-badge rarity-badge-${rarity}`}>
                            {rarityLabels[rarity]}
                          </div>
                          
                          <div className={`w-full h-full flex items-center justify-center character-${character.type} character-image`}>
                            {/* 프로필로 설정된 캐릭터 표시 */}
                            {user?.characterType === character.type && !profileEditMode && (
                              <div className="absolute top-1 left-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center">
                                <FaCheck size={10} />
                              </div>
                            )}
                            <span className="text-lg font-bold opacity-0">
                              {characterImages[character.type] || character.type}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                    <p className="text-sm font-medium text-center">
                      {characterImages[character.type] || character.type}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <FaCalendarAlt className="mr-1" size={10} />
                      {new Date(character.acquiredDate).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500">
                  <p>아직 획득한 캐릭터가 없습니다.</p>
                  <p className="mt-2 text-sm">
                    6시간 이상 공부하면 매일 새로운 캐릭터를 획득할 수 있습니다!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 캐릭터 모달 - 홀로그래픽 카드 디자인 */}
      {selectedCharacter && (
        <div className={`character-modal ${modalActive ? 'active' : ''}`}>
          {/* 배경 오버레이 */}
          <div className="character-modal-overlay" onClick={closeModal}></div>
          
          {/* 모달 컨텐츠 */}
          <div className="character-modal-content">
            {/* 날짜 표시 - 상단에 작게 배치 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-black bg-opacity-60 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm shadow-lg">
              획득일: {new Date(selectedCharacter.acquiredDate).toLocaleDateString()}
            </div>
            
            {/* 닫기 버튼 - 상단 우측에 배치 */}
            <button 
              className="absolute -top-12 -right-12 text-white hover:text-red-400 opacity-90 hover:opacity-100 transition-all z-[1000] bg-black bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm shadow-lg close-button"
              onClick={(e) => closeModal(e)}
              aria-label="닫기"
            >
              <FaTimes size={20} />
            </button>
            
            {/* 트래킹 영역 - 카드보다 넓은 영역으로 마우스 이벤트 캡처 */}
            <div 
              className="card-tracking-area"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                setIsDragging(true);
                setDragStart({ x: touch.clientX, y: touch.clientY });
              }}
              onTouchMove={(e) => {
                if (!isDragging || !cardRef.current) return;
                const touch = e.touches[0];
                
                const rect = cardRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 회전 각도 계산
                const rotateY = (touch.clientX - centerX) * 0.1;
                const rotateX = (centerY - touch.clientY) * 0.1;
                
                setRotation({ x: rotateX, y: rotateY });
              }}
              onTouchEnd={() => {
                setIsDragging(false);
                setRotation({ x: 0, y: 0 });
              }}
            >
              {/* 3D 카드 컨테이너 */}
              <div 
                ref={cardRef}
                className={`card-3d-container holographic-card character-rarity-${selectedCharacter.rarity || getRarityForCharacter(selectedCharacter.type)}`}
                style={{ 
                  transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              >
                {/* 카드 배경 레이어 */}
                <div className="card-bg-layer"></div>
                
                {/* 홀로그래픽 기본 레이어 */}
                <div className="card-face holographic"></div>
                
                {/* 홀로그래픽 프리즘 효과 */}
                <div className="holographic-prism-effect"></div>
                
                {/* 희귀도별 특수 효과 */}
                {(() => {
                  const rarity = selectedCharacter.rarity || getRarityForCharacter(selectedCharacter.type);
                  if (rarity === 'legendary') {
                    return (
                      <>
                        <div className="modal-legendary-effect"></div>
                        <div className="modal-legendary-particles"></div>
                        <div className="modal-legendary-sparkles"></div>
                      </>
                    );
                  } else if (rarity === 'epic') {
                    return (
                      <>
                        <div className="modal-epic-effect"></div>
                        <div className="modal-epic-glow"></div>
                      </>
                    );
                  } else if (rarity === 'rare') {
                    return (
                      <>
                        <div className="modal-rare-effect"></div>
                        <div className="modal-rare-shimmer"></div>
                      </>
                    );
                  } else if (rarity === 'uncommon') {
                    return <div className="modal-uncommon-effect"></div>;
                  }
                  return null;
                })()}
                
                {/* 빛 반사 효과 */}
                <div 
                  className="card-shine" 
                  style={{ 
                    transform: `translateX(${(shinePosition.x - 0.5) * 200}%) translateY(${(shinePosition.y - 0.5) * 200}%)`,
                    opacity: isDragging ? 0.7 : 0.3
                  }}
                ></div>
                
                {/* 캐릭터 이미지 */}
                <div 
                  className={`character-${selectedCharacter.type} character-image character-modal-image`}
                ></div>
                
                {/* 홀로그래픽 오버레이 */}
                <div className="holographic-overlay"></div>
                
                {/* 카드 테두리 */}
                <div className="card-border"></div>
                
                {/* 희귀도 배지 */}
                {(() => {
                  const rarity = selectedCharacter.rarity || getRarityForCharacter(selectedCharacter.type);
                  return (
                    <div className={`modal-rarity-badge rarity-badge-${rarity}`}>
                      {rarityLabels[rarity]}
                    </div>
                  );
                })()}
                
                {/* 캐릭터 이름 - 하단에 표시 */}
                <div className="character-name-badge">
                  <span>{characterImages[selectedCharacter.type] || selectedCharacter.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;