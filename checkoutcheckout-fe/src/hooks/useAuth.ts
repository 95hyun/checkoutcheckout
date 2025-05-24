import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  // 추가: 현재 위치에서 라우팅이 작동하는지 확인
  useEffect(() => {
    console.log('Current location:', location.pathname);
  }, [location]);

  return isAuthenticated;
};

export const useRedirectIfAuthenticated = (redirectTo = '/dashboard') => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return !isAuthenticated;
};