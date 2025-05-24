import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { FaTimes } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login, signup } = useAuthStore();
  const navigate = useNavigate();
  
  // initialMode가 변경될 때 모드 업데이트
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
    setError(null);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const switchMode = () => {
    resetForm();
    setMode(mode === 'login' ? 'signup' : 'login');
  };
  
  const validateForm = (): boolean => {
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return false;
      }
      
      if (password.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login({ email, password });
        handleClose();
        navigate('/dashboard');
      } else {
        await signup({ email, password, nickname });
        setMode('login');
        setError('회원가입이 완료되었습니다. 로그인해주세요.');
      }
    } catch (err: any) {
      const errorMessage = mode === 'login' 
        ? '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
        : '회원가입에 실패했습니다. 다시 시도해주세요.';
      setError(err.response?.data?.message || errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {mode === 'login' ? '로그인' : '회원가입'}
                </h3>
                
                <div className="mt-4">
                  {error && (
                    <ErrorMessage 
                      message={error} 
                      onClose={() => setError(null)} 
                      className="mb-4" 
                    />
                  )}
                  
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        이메일
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                    </div>
                    
                    {mode === 'signup' && (
                      <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                          닉네임
                        </label>
                        <div className="mt-1">
                          <input
                            id="nickname"
                            name="nickname"
                            type="text"
                            required
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        비밀번호
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input w-full"
                        />
                      </div>
                      {mode === 'signup' && (
                        <p className="mt-1 text-xs text-gray-500">
                          비밀번호는 8자 이상이어야 합니다.
                        </p>
                      )}
                    </div>
                    
                    {mode === 'signup' && (
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          비밀번호 확인
                        </label>
                        <div className="mt-1">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary"
                      >
                        {isLoading ? <Loading size="sm" /> : (mode === 'login' ? '로그인' : '회원가입')}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          또는
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={switchMode}
                          className="font-medium text-primary hover:text-indigo-500"
                        >
                          {mode === 'login' ? '새 계정 만들기' : '이미 계정이 있으신가요? 로그인'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;