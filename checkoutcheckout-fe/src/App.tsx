import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
import './App.css';

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
    </Router>
  );
}

export default App;