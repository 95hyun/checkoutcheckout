import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock, FaUnlock, FaUserCheck, FaUsers, FaArrowLeft } from 'react-icons/fa';
import useStudyStore from '../store/studyStore';
import { StudyCreateRequest } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const StudyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId: string }>();
  const { currentStudy, isLoading, error, fetchStudyDetail, updateStudy, resetError } = useStudyStore();
  
  const [formData, setFormData] = useState<StudyCreateRequest>({
    name: '',
    description: '',
    maxMembers: 5,
    password: '',
    isPasswordProtected: false,
    isApprovalRequired: false
  });
  
  useEffect(() => {
    if (studyId) {
      fetchStudyDetail(parseInt(studyId));
    }
  }, [studyId, fetchStudyDetail]);
  
  useEffect(() => {
    if (currentStudy) {
      setFormData({
        name: currentStudy.name,
        description: currentStudy.description || '',
        maxMembers: currentStudy.maxMembers,
        password: '', // 비밀번호는 보안상 빈 값으로 초기화
        isPasswordProtected: currentStudy.isPasswordProtected,
        isApprovalRequired: currentStudy.isApprovalRequired
      });
    }
  }, [currentStudy]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value, 10) : value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'isPasswordProtected' && !checked) {
      // 비밀번호 보호를 해제하면 비밀번호 초기화
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        password: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    
    if (!studyId) return;
    
    try {
      const study = await updateStudy(parseInt(studyId), formData);
      if (study) {
        navigate(`/studies/${study.id}`);
      }
    } catch (error) {
      console.error('스터디 수정 에러:', error);
    }
  };
  
  if (isLoading && !currentStudy) {
    return <Loading />;
  }
  
  if (!currentStudy) {
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
  
  // 스터디장만 수정 가능
  if (!currentStudy.isOwner) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">스터디장만 수정할 수 있습니다.</h1>
          <button
            onClick={() => navigate(`/studies/${studyId}`)}
            className="btn-primary flex items-center"
          >
            <FaArrowLeft className="mr-2" /> 스터디로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(`/studies/${studyId}`)}
          className="text-gray-500 hover:text-gray-700 mr-3"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">스터디 수정</h1>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            스터디 이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="스터디 이름을 입력하세요"
            required
            minLength={2}
            maxLength={50}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            스터디 설명
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            placeholder="스터디 설명을 입력하세요"
            maxLength={1000}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxMembers">
            최대 인원 *
          </label>
          <select
            id="maxMembers"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}명</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            * 현재 인원보다 작게 설정할 경우, 새로운 멤버만 가입이 제한됩니다.
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPasswordProtected"
              name="isPasswordProtected"
              checked={formData.isPasswordProtected}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-gray-700 text-sm font-medium flex items-center" htmlFor="isPasswordProtected">
              {formData.isPasswordProtected ? 
                <><FaLock className="mr-1" /> 비밀번호 보호</> : 
                <><FaUnlock className="mr-1" /> 공개 스터디</>
              }
            </label>
          </div>
          
          {formData.isPasswordProtected && (
            <div className="mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                새 비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="비밀번호를 변경하려면 입력하세요"
              />
              <p className="text-xs text-gray-500 mt-1">
                * 비밀번호를 변경하지 않으려면 비워두세요.
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isApprovalRequired"
              name="isApprovalRequired"
              checked={formData.isApprovalRequired}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label className="text-gray-700 text-sm font-medium flex items-center" htmlFor="isApprovalRequired">
              {formData.isApprovalRequired ? 
                <><FaUserCheck className="mr-1" /> 가입 승인 필요</> : 
                <><FaUsers className="mr-1" /> 즉시 가입</>
              }
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/studies/${studyId}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? '수정 중...' : '스터디 수정'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyEditPage;