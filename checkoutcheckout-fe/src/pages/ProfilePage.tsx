import React, { useEffect } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import useCharacterStore from '../store/characterStore';
import { FaUser, FaGem, FaCalendarAlt } from 'react-icons/fa';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import '../assets/character-styles.css';

// 캐릭터 이미지 매핑 (임시 - 실제로는 서버에서 URL을 받아올 것)
const characterImages = {
  'cleric': '클레릭', // 성직자
  'knight': '기사',
  'dwarf': '드워프',
  'demonfemale': '여성 악마',
  'demonmale': '남성 악마',
  'wizard': '마법사',
  'shield': '방패병',
  'captain': '캡틴',
  'archer': '궁수',
  'assassin': '암살자',
  // 대문자 버전 추가
  'CLERIC': '클레릭',
  'KNIGHT': '기사',
  'DWARF': '드워프',
  'DEMON_FEMALE': '여성 악마',
  'DEMON_MALE': '남성 악마',
  'WIZARD': '마법사',
  'SHIELD': '방패병',
  'CAPTAIN': '캡틴',
  'ARCHER': '궁수',
  'ASSASSIN': '암살자'
};

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
  
  useEffect(() => {
    fetchUserCharacters();
  }, [fetchUserCharacters]);
  
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
                  <div key={index} className="flex flex-col items-center p-2 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-full mb-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {/* 실제 서비스에서는 이미지 URL을 사용하고, 로컬 테스트에서는 임시 텍스트 표시 */}
                      <div className={`w-full h-full flex items-center justify-center character-${character.type} character-image`}>
                        {/* 이미지가 로드되지 않을 경우에만 텍스트 표시 */}
                        <span className="text-lg font-bold opacity-0">
                          {characterImages[character.type as keyof typeof characterImages] || character.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-center">
                      {characterImages[character.type as keyof typeof characterImages] || character.type}
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
                    10초 이상 공부하면 매일 새로운 캐릭터를 획득할 수 있습니다!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;