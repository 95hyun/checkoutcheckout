import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUnlock, FaUserCheck, FaUsers } from 'react-icons/fa';
import useStudyStore from '../store/studyStore';
import { StudyCreateRequest } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import Navbar from '../components/Navbar';

const StudyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createStudy, isLoading, error, resetError } = useStudyStore();
  
  const [formData, setFormData] = useState<StudyCreateRequest>({
    name: '',
    description: '',
    maxMembers: 5,
    password: '',
    isPasswordProtected: false,
    isApprovalRequired: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    
    try {
      const study = await createStudy(formData);
      if (study) {
        navigate(`/studies/${study.id}`);
      }
    } catch (error) {
      console.error('스터디 생성 에러:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">스터디 개설</h1>
        
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
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              스터디 공개 여부
            </label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPasswordProtected: false, password: '' }))}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${!formData.isPasswordProtected ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <FaUnlock className="mr-2" /> 공개 스터디
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPasswordProtected: true }))}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${formData.isPasswordProtected ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <FaLock className="mr-2" /> 비밀번호 보호
              </button>
            </div>
            
            {formData.isPasswordProtected && (
              <div className="mt-3">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  비밀번호 *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="비밀번호를 입력하세요"
                  required={formData.isPasswordProtected}
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              가입 방식
            </label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isApprovalRequired: false }))}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${!formData.isApprovalRequired ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <FaUsers className="mr-2" /> 즉시 가입
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isApprovalRequired: true }))}
                className={`flex-1 py-2 px-4 flex items-center justify-center ${formData.isApprovalRequired ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <FaUserCheck className="mr-2" /> 가입 승인 필요
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/studies')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '생성 중...' : '스터디 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyCreatePage;