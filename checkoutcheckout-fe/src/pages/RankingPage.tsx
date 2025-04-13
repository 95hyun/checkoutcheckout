import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useRankStore from '../store/rankStore';
import useAuthStore from '../store/authStore';
import RankingTable from '../components/RankingTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { format } from 'date-fns';
import { FaTrophy } from 'react-icons/fa';

const RankingPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  // 현재 사용자 정보 가져오기
  const { user } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { 
    dailyRanking, 
    fetchDailyRanking, 
    isLoading, 
    error 
  } = useRankStore();

  useEffect(() => {
    fetchDailyRanking(selectedDate);
  }, [fetchDailyRanking, selectedDate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaTrophy className="mr-2 text-primary" />
            일일 랭킹
          </h1>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedDate ? format(selectedDate, 'yyyy년 M월 d일') : '오늘'} 랭킹
              </h2>
              <div className="flex items-center space-x-2">
                <label htmlFor="date-select" className="text-sm text-gray-600">
                  날짜 선택:
                </label>
                <input
                  id="date-select"
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-4 sm:p-6">
              <ErrorMessage message={error} />
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loading size="lg" />
            </div>
          ) : (
            <RankingTable 
              rankings={dailyRanking?.rankings || []} 
              currentUserId={user?.id}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;