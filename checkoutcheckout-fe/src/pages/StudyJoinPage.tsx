import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock, FaUserCheck, FaArrowLeft } from 'react-icons/fa';
import useStudyStore from '../store/studyStore';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const StudyJoinPage: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const { studies, isLoading, error, fetchStudies, joinStudy } = useStudyStore();
  
  const [password, setPassword] = useState<string>('');
  
  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);
  
  if (isLoading && !studies.length) {
    return <Loading />;
  }
  
  // 스터디 정보 찾기
  const study = studies.find(s => s.id === parseInt(studyId || '0'));
  
  if (!study) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">스터디를 찾을 수 없습니다.</h1>
          <button
            onClick={() => navigate('/studies')}
            className="btn-primary flex items-center"
          >
            <FaArrowLeft className="mr-2" /> 스터디 목록으로
          </button>
        </div>
      </div>
    );
  }
  
  // 이미 가입된 스터디인 경우
  if (study.isMember) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">이미 가입된 스터디입니다.</h1>
          <button
            onClick={() => navigate(`/studies/${study.id}`)}
            className="btn-primary flex items-center"
          >
            스터디 입장하기
          </button>
        </div>
      </div>
    );
  }
  
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await joinStudy(study.id, study.isPasswordProtected ? password : undefined);
      if (success) {
        if (study.isApprovalRequired) {
          navigate('/studies', { 
            state: { 
              message: `${study.name} 스터디에 가입 신청이 완료되었습니다. 스터디장의 승인을 기다려주세요.` 
            } 
          });
        } else {
          navigate(`/studies/${study.id}`);
        }
      }
    } catch (error) {
      console.error('스터디 가입 에러:', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/studies')}
          className="text-gray-500 hover:text-gray-700 mr-3"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">스터디 가입</h1>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{study.name}</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">
            {study.description || '스터디 설명이 없습니다.'}
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6 text-sm text-gray-500 border-t border-b border-gray-200 py-3">
          <div>
            <p>스터디장: {study.ownerNickname}</p>
            <p>현재 인원: {study.currentMembers}/{study.maxMembers}명</p>
          </div>
          <div>
            {study.isPasswordProtected && (
              <div className="flex items-center">
                <FaLock className="mr-1 text-yellow-500" />
                <span>비밀번호 보호</span>
              </div>
            )}
            {study.isApprovalRequired && (
              <div className="flex items-center mt-1">
                <FaUserCheck className="mr-1 text-blue-500" />
                <span>가입 승인 필요</span>
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleJoin}>
          {study.isPasswordProtected && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                스터디 비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              {study.isApprovalRequired && (
                <p className="text-sm text-gray-500 italic">
                  * 스터디장의 승인 후 가입이 완료됩니다.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : study.isApprovalRequired ? '가입 신청' : '가입하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyJoinPage;