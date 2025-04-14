import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaLock, FaUnlock, FaUser, FaUsers, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import useStudyStore from '../store/studyStore';
import useAuthStore from '../store/authStore';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const StudiesPage: React.FC = () => {
  const { studies, myStudies, isLoading, error, fetchStudies, fetchMyStudies } = useStudyStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  
  useEffect(() => {
    fetchStudies();
    fetchMyStudies();
  }, [fetchStudies, fetchMyStudies]);
  
  const handleCreateStudy = () => {
    navigate('/studies/create');
  };
  
  const handleStudyClick = (studyId: number, isMember: boolean) => {
    if (isMember) {
      navigate(`/studies/${studyId}`);
    }
  };
  
  if (isLoading && (!studies.length || !myStudies.length)) {
    return <Loading />;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">스터디</h1>
        <button 
          onClick={handleCreateStudy}
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-2" /> 스터디 개설
        </button>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FaUsers className="inline mr-2" /> 전체 스터디
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`${
                activeTab === 'my'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FaUser className="inline mr-2" /> 내 스터디
            </button>
          </nav>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'all' && studies.map(study => (
          <div 
            key={study.id}
            onClick={() => handleStudyClick(study.id, study.isMember)}
            className={`bg-white rounded-lg shadow-md overflow-hidden border ${
              study.isMember ? 'border-primary cursor-pointer hover:shadow-lg' : 'border-gray-200'
            } transition duration-200`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{study.name}</h2>
                <div className="flex items-center space-x-2">
                  {study.isPasswordProtected ? 
                    <FaLock className="text-gray-500" title="비밀번호 보호" /> : 
                    <FaUnlock className="text-gray-500" title="공개 스터디" />
                  }
                  {study.isMember && 
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      가입됨
                    </span>
                  }
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                {study.description || '스터디 설명이 없습니다.'}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  <span>{study.currentMembers}/{study.maxMembers} 명</span>
                </div>
                <span>개설자: {study.ownerNickname}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
              {study.isMember ? (
                <Link 
                  to={`/studies/${study.id}`}
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  스터디 입장
                </Link>
              ) : (
                study.isApprovalRequired ? (
                  <div className="flex items-center">
                    <FaUserPlus className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">승인 필요</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">즉시 가입</span>
                  </div>
                )
              )}
              
              {!study.isMember && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/studies/join/${study.id}`);
                  }}
                  className="btn-primary-sm"
                >
                  가입하기
                </button>
              )}
            </div>
          </div>
        ))}
        
        {activeTab === 'my' && (
          myStudies.length > 0 ? (
            myStudies.map(study => (
              <div 
                key={study.id}
                onClick={() => navigate(`/studies/${study.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-primary cursor-pointer hover:shadow-lg transition duration-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">{study.name}</h2>
                    <div className="flex items-center space-x-2">
                      {study.isOwner && 
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          스터디장
                        </span>
                      }
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {study.description || '스터디 설명이 없습니다.'}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{study.currentMembers}/{study.maxMembers} 명</span>
                    </div>
                    <span>개설자: {study.ownerNickname}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <Link 
                    to={`/studies/${study.id}`}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    스터디 입장
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <FaUsers className="text-4xl mb-4" />
              <p className="mb-4">가입한 스터디가 없습니다.</p>
              <button 
                onClick={() => setActiveTab('all')}
                className="btn-primary-sm"
              >
                스터디 찾아보기
              </button>
            </div>
          )
        )}
      </div>
      
      {/* 스터디가 없는 경우 */}
      {activeTab === 'all' && studies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FaUsers className="text-4xl mb-4" />
          <p className="mb-4">아직 스터디가 없습니다. 첫 번째 스터디를 개설해보세요!</p>
          <button 
            onClick={handleCreateStudy}
            className="btn-primary"
          >
            <FaPlus className="mr-2" /> 스터디 개설하기
          </button>
        </div>
      )}
    </div>
  );
};

export default StudiesPage;