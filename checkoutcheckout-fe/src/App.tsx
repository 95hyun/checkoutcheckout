import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import RankingPage from './pages/RankingPage';
import ProfilePage from './pages/ProfilePage';
import StudiesPage from './pages/StudiesPage';
import StudyCreatePage from './pages/StudyCreatePage';
import StudyDetailPage from './pages/StudyDetailPage';
import StudyEditPage from './pages/StudyEditPage';
import StudyJoinPage from './pages/StudyJoinPage';
import { authApi } from './api/authApi';
import useAuthStore from './store/authStore';
import Loading from './components/Loading';
import './App.css';

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loading size="lg" />
  </div>
);

// 스크롤 관리 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  const { isAuthenticated, setUser } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      const fetchCurrentUser = async () => {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      
      fetchCurrentUser();
    }
  }, [isAuthenticated, setUser]);
  
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* 로그인 및 회원가입 페이지는 홈페이지의 모달로 대체됨 */}
          <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
          <Route path="/signup" element={<Navigate to="/?auth=signup" replace />} />
          
          {/* 기존 라우트들 */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* 스터디 관련 라우트 */}
          <Route path="/studies" element={<StudiesPage />} />
          <Route path="/studies/create" element={<StudyCreatePage />} />
          <Route path="/studies/edit/:studyId" element={<StudyEditPage />} />
          <Route path="/studies/join/:studyId" element={<StudyJoinPage />} />
          <Route path="/studies/:studyId" element={<StudyDetailPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;