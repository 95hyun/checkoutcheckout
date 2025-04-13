import React, { useEffect } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Timer from '../components/Timer';
import useTimerStore from '../store/timerStore';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { formatSecondsToReadable } from '../utils/timeUtils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DashboardPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  const { 
    recentSessions = [], // 기본값으로 빈 배열 설정
    fetchRecentSessions, 
    isLoading, 
    error 
  } = useTimerStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 최근 세션 데이터 불러오기
    fetchRecentSessions();
  }, [fetchRecentSessions]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 타이머 섹션 */}
          <div className="lg:col-span-2">
            <Timer />
          </div>
          
          {/* 최근 세션 섹션 */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-primary" />
              최근 공부 기록
            </h2>
            
            {error && (
              <ErrorMessage message={error} className="mb-4" />
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loading size="md" />
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentSessions && recentSessions.length > 0 ? (
                  recentSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(session.startTime).toLocaleString()}
                          </p>
                          {session.endTime && (
                            <p className="text-xs text-gray-400">
                              ~ {new Date(session.endTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-1" />
                          <span className="font-medium">
                            {formatSecondsToReadable(session.duration || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    아직 공부 기록이 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;