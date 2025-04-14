import React, { useEffect, useState } from 'react';
import { useRequireAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import useRankStore from '../store/rankStore';
import useAuthStore from '../store/authStore';
import useStudyRankingStore from '../store/studyRankingStore';
import RankingTable from '../components/RankingTable';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { FaTrophy, FaUsers, FaUser } from 'react-icons/fa';

enum RankingType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

enum RankingCategory {
  USERS = 'users',
  STUDIES = 'studies'
}

const RankingPage: React.FC = () => {
  // 인증 체크
  useRequireAuth();
  
  // 현재 사용자 정보 가져오기
  const { user } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [rankingType, setRankingType] = useState<RankingType>(RankingType.DAILY);
  const [category, setCategory] = useState<RankingCategory>(RankingCategory.USERS);
  
  const { 
    dailyRanking, 
    fetchDailyRanking, 
    isLoading: isUserRankingLoading, 
    error: userRankingError 
  } = useRankStore();
  
  const {
    dailyStudyRanking,
    weeklyStudyRanking,
    monthlyStudyRanking,
    fetchDailyStudyRanking,
    fetchWeeklyStudyRanking,
    fetchMonthlyStudyRanking,
    isLoading: isStudyRankingLoading,
    error: studyRankingError
  } = useStudyRankingStore();

  useEffect(() => {
    // 사용자 랭킹
    if (category === RankingCategory.USERS) {
      fetchDailyRanking(selectedDate);
    } 
    // 스터디 랭킹
    else if (category === RankingCategory.STUDIES) {
      if (rankingType === RankingType.DAILY) {
        fetchDailyStudyRanking(selectedDate);
      } else if (rankingType === RankingType.WEEKLY) {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // 월요일 시작
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // 일요일 종료
        fetchWeeklyStudyRanking(weekStart, weekEnd);
      } else if (rankingType === RankingType.MONTHLY) {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // 0-based to 1-based
        fetchMonthlyStudyRanking(year, month);
      }
    }
  }, [fetchDailyRanking, fetchDailyStudyRanking, fetchWeeklyStudyRanking, fetchMonthlyStudyRanking, 
      selectedDate, rankingType, category]);
  
  const getPeriodText = () => {
    if (rankingType === RankingType.DAILY) {
      return format(selectedDate, 'yyyy년 M월 d일');
    } else if (rankingType === RankingType.WEEKLY) {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'yyyy년 M월 d일')} ~ ${format(weekEnd, 'yyyy년 M월 d일')}`;
    } else if (rankingType === RankingType.MONTHLY) {
      return format(selectedDate, 'yyyy년 M월');
    }
    return '';
  };
  
  // 현재 선택된 랭킹 데이터
  const getCurrentRankingData = () => {
    if (category === RankingCategory.USERS) {
      return dailyRanking?.rankings || [];
    } else if (category === RankingCategory.STUDIES) {
      if (rankingType === RankingType.DAILY) {
        return dailyStudyRanking?.rankings || [];
      } else if (rankingType === RankingType.WEEKLY) {
        return weeklyStudyRanking?.rankings || [];
      } else if (rankingType === RankingType.MONTHLY) {
        return monthlyStudyRanking?.rankings || [];
      }
    }
    return [];
  };
  
  const isLoading = category === RankingCategory.USERS ? isUserRankingLoading : isStudyRankingLoading;
  const error = category === RankingCategory.USERS ? userRankingError : studyRankingError;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaTrophy className="mr-2 text-primary" />
            랭킹
          </h1>
        </div>
        
        {/* 카테고리 선택 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setCategory(RankingCategory.USERS)}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                category === RankingCategory.USERS
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              <FaUser className="inline mr-1" /> 사용자 랭킹
            </button>
            <button
              type="button"
              onClick={() => setCategory(RankingCategory.STUDIES)}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                category === RankingCategory.STUDIES
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 border-l-0`}
            >
              <FaUsers className="inline mr-1" /> 스터디 랭킹
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-bold">
                {getPeriodText()} 랭킹
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* 스터디 랭킹인 경우만 기간 선택 표시 */}
                {category === RankingCategory.STUDIES && (
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => setRankingType(RankingType.DAILY)}
                      className={`px-3 py-1 text-xs font-medium rounded-l-md ${
                        rankingType === RankingType.DAILY
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300`}
                    >
                      일간
                    </button>
                    <button
                      type="button"
                      onClick={() => setRankingType(RankingType.WEEKLY)}
                      className={`px-3 py-1 text-xs font-medium ${
                        rankingType === RankingType.WEEKLY
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border-t border-b border-gray-300`}
                    >
                      주간
                    </button>
                    <button
                      type="button"
                      onClick={() => setRankingType(RankingType.MONTHLY)}
                      className={`px-3 py-1 text-xs font-medium rounded-r-md ${
                        rankingType === RankingType.MONTHLY
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } border border-gray-300`}
                    >
                      월간
                    </button>
                  </div>
                )}
                
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
              rankings={getCurrentRankingData()} 
              currentUserId={category === RankingCategory.USERS ? user?.id : null}
              isStudyRanking={category === RankingCategory.STUDIES}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;