import React, { useEffect, useState, useRef } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import useCharacterStore from '../store/characterStore';
import { FaUser, FaGem, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';

// 캐릭터 이미지 매핑
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

// 모달에서 표시할 캐릭터 인터페이스
interface ModalCharacter {
  type: string;
  acquiredDate: string;
}

const ProfilePage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const { user } = useAuthStore();
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
    setSelectedCharacter({
      type: character.type,
      acquiredDate: character.acquiredDate,
    });
    setRotation({ x: 0, y: 0 }); // 회전 각도 초기화
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
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
    if (!isDragging) return;
    
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
    const rotateY = (mouseX - centerX) * 0.1; // 좌우 회전
    const rotateX = (centerY - mouseY) * 0.1; // 상하 회전
    
    // 빛 반사 효과 위치 계산 (카드 내 마우스 위치의 비율)
    const normalizedX = (mouseX - rect.left) / rect.width;
    const normalizedY = (mouseY - rect.top) / rect.height;
    
    // 회전 및 빛 반사 효과 적용
    setRotation({ x: rotateX, y: rotateY });
    setShinePosition({ x: normalizedX, y: normalizedY });
  };

  // 마우스 드래그 종료 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // 회전 원위치로 부드럽게 돌아가기
    setTimeout(() => {
      if (!isDragging) {
        setRotation({ x: 0, y: 0 });
      }
    }, 2000);
  };

  // 마우스가 카드 위를 떠날 때
  const handleMouseLeave = () => {
    setIsDragging(false);
    
    // 회전 원위치로 바로 돌아가기
    setRotation({ x: 0, y: 0 });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl mb-4 sm:mb-0 sm:mr-6">
              <FaUser />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.nickname || '사용자'}</h1>
              <p className="text-gray-500">{user?.email || ''}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FaGem className="mr-2 text-primary" />
            획득한 캐릭터 컬렉션
          </h2>
          
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
                    className="flex flex-col items-center p-2 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCharacterClick(character)}
                  >
                    <div className="w-full mb-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <div className={`w-full h-full flex items-center justify-center character-${character.type} character-image`}>
                        <span className="text-lg font-bold opacity-0">
                          {characterImages[character.type] || character.type}
                        </span>
                      </div>
                    </div>
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

      {/* 캐릭터 모달 - 순수 이미지 중심 */}
      {selectedCharacter && (
        <div className={`character-modal ${modalActive ? 'active' : ''}`}>
          {/* 배경 오버레이 */}
          <div className="character-modal-overlay" onClick={closeModal}></div>
          
          {/* 모달 컨텐츠 */}
          <div className="character-modal-content">
            {/* 날짜 표시 - 상단에 작게 배치 */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
              {new Date(selectedCharacter.acquiredDate).toLocaleDateString()}
            </div>
            
            {/* 닫기 버튼 - 상단 우측에 배치 */}
            <button 
              className="absolute -top-10 -right-10 text-white opacity-70 hover:opacity-100 transition-opacity z-50"
              onClick={closeModal}
            >
              <FaTimes size={24} />
            </button>
            
            {/* 3D 카드 컨테이너 */}
            <div 
              ref={cardRef}
              className="card-container"
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
              style={{ 
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              {/* 카드 면 */}
              <div className="card-face holographic"></div>
              
              {/* 빛 반사 효과 */}
              <div 
                className="card-shine" 
                style={{ 
                  transform: `translateX(${(shinePosition.x - 0.5) * 200}%) translateY(${(shinePosition.y - 0.5) * 200}%) rotate(45deg)`,
                  opacity: isDragging ? 0.7 : 0.3
                }}
              ></div>
              
              {/* 캐릭터 이미지 */}
              <div 
                className={`w-full h-full character-${selectedCharacter.type} character-image character-modal-image`}
                style={{
                  zIndex: 5,
                  transform: `scale(0.95)`,
                }}
              ></div>
              
              {/* 카드 테두리 효과 */}
              <div className="card-border"></div>
              
              {/* 캐릭터 이름 - 하단에 표시 */}
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {characterImages[selectedCharacter.type] || selectedCharacter.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;