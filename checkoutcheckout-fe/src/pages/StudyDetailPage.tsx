import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaUserPlus, FaSignOutAlt, FaCrown, FaUserShield, FaChartBar } from 'react-icons/fa';
import useStudyStore from '../store/studyStore';
import useAuthStore from '../store/authStore';
import useStudyRankingStore from '../store/studyRankingStore';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StudyMemberRankingList from '../components/StudyMemberRankingList';

enum RankingType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

const StudyDetailPage: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const { currentStudy, joinRequests, isLoading, error, fetchStudyDetail, fetchJoinRequests, approveJoinRequest, rejectJoinRequest, leaveStudy, kickMember, makeAdmin, removeAdmin, deleteStudy } = useStudyStore();
  const { user } = useAuthStore();
  const { studyMemberDailyRanking, studyMemberWeeklyRanking, studyMemberMonthlyRanking, isLoading: isRankingLoading, fetchStudyMemberDailyRanking, fetchStudyMemberWeeklyRanking, fetchStudyMemberMonthlyRanking } = useStudyRankingStore();
  
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [currentTab, setCurrentTab] = useState<'members' | 'ranking'>('members');
  const [rankingType, setRankingType] = useState<RankingType>(RankingType.DAILY);
  
  useEffect(() => {
    if (studyId) {
      const id = parseInt(studyId);
      fetchStudyDetail(id);
      
      // 랭킹 데이터 로드
      const today = new Date();
      
      // 일간 랭킹
      fetchStudyMemberDailyRanking(id);
      
      // 주간 랭킹 (현재 날짜 기준 7일)
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 6);
      fetchStudyMemberWeeklyRanking(id, weekStart, today);
      
      // 월간 랭킹 (현재 월)
      fetchStudyMemberMonthlyRanking(id, today.getFullYear(), today.getMonth() + 1);
    }
  }, [studyId, fetchStudyDetail, fetchStudyMemberDailyRanking, fetchStudyMemberWeeklyRanking, fetchStudyMemberMonthlyRanking]);
  
  useEffect(() => {
    if (currentStudy?.isOwner || currentStudy?.isAdmin) {
      fetchJoinRequests(parseInt(studyId!));
    }
  }, [currentStudy, studyId, fetchJoinRequests]);
  
  if (isLoading && !currentStudy) {
    return <Loading />;
  }
  
  if (!currentStudy) {
    return (
      <div className="max-w-6xl mx-auto p-4">
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
  
  const handleLeaveStudy = async () => {
    if (window.confirm('정말로 스터디를 탈퇴하시겠습니까?')) {
      const success = await leaveStudy(currentStudy.id);
      if (success) {
        navigate('/studies');
      }
    }
  };
  
  const handleDeleteStudy = async () => {
    if (window.confirm('정말로 스터디를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const success = await deleteStudy(currentStudy.id);
      if (success) {
        navigate('/studies');
      }
    }
  };
  
  const handleKickMember = async (userId: number) => {
    if (window.confirm('정말로 이 회원을 강퇴하시겠습니까?')) {
      await kickMember(currentStudy.id, userId);
    }
  };
  
  const handleMakeAdmin = async (userId: number) => {
    await makeAdmin(currentStudy.id, userId);
  };
  
  const handleRemoveAdmin = async (userId: number) => {
    await removeAdmin(currentStudy.id, userId);
  };
  
  const handleApproveRequest = async (requestId: number) => {
    await approveJoinRequest(currentStudy.id, requestId);
  };
  
  const handleRejectRequest = async (requestId: number) => {
    await rejectJoinRequest(currentStudy.id, requestId);
  };
  
  const getPendingRequestsCount = () => {
    return joinRequests.filter(req => req.status === 'PENDING').length;
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/studies')}
          className="text-gray-500 hover:text-gray-700 mr-3"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{currentStudy.name}</h1>
        
        {/* 스터디장/관리자 메뉴 */}
        {(currentStudy.isOwner || currentStudy.isAdmin) && (
          <div className="ml-auto flex items-center space-x-2">
            {currentStudy.isApprovalRequired && (
              <button
                onClick={() => setShowJoinRequests(!showJoinRequests)}
                className={`relative btn-outline-sm ${showJoinRequests ? 'bg-gray-100' : ''}`}
              >
                <FaUserPlus className="mr-1" /> 가입 요청
                {getPendingRequestsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getPendingRequestsCount()}
                  </span>
                )}
              </button>
            )}
            
            {currentStudy.isOwner && (
              <>
                <button
                  onClick={() => navigate(`/studies/edit/${currentStudy.id}`)}
                  className="btn-outline-sm"
                >
                  <FaEdit className="mr-1" /> 수정
                </button>
                <button
                  onClick={handleDeleteStudy}
                  className="btn-danger-sm"
                >
                  <FaTrash className="mr-1" /> 삭제
                </button>
              </>
            )}
          </div>
        )}
        
        {/* 일반 회원 메뉴 */}
        {currentStudy.isMember && !currentStudy.isOwner && (
          <button
            onClick={handleLeaveStudy}
            className="ml-auto btn-outline-sm"
          >
            <FaSignOutAlt className="mr-1" /> 탈퇴
          </button>
        )}
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      {/* 스터디 설명 */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">스터디 소개</h2>
          <p className="text-gray-600">
            {currentStudy.description || '스터디 설명이 없습니다.'}
          </p>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
          <div>
            <p>스터디장: {currentStudy.ownerNickname}</p>
            <p>현재 인원: {currentStudy.currentMembers}/{currentStudy.maxMembers}명</p>
          </div>
          <div className="text-right">
            <p>개설일: {new Date(currentStudy.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      {/* 가입 요청 목록 (스터디장/관리자만 볼 수 있음) */}
      {showJoinRequests && (currentStudy.isOwner || currentStudy.isAdmin) && joinRequests.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">가입 대기 중인 요청</h2>
          
          <div className="divide-y">
            {joinRequests
              .filter(request => request.status === 'PENDING')
              .map(request => (
                <div key={request.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{request.userNickname}</p>
                    <p className="text-xs text-gray-500">
                      요청일: {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="btn-primary-sm"
                      disabled={isLoading}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="btn-danger-sm"
                      disabled={isLoading}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
          </div>
          
          {joinRequests.filter(request => request.status === 'PENDING').length === 0 && (
            <p className="text-gray-500 text-center py-4">대기 중인 가입 요청이 없습니다.</p>
          )}
        </div>
      )}
      
      {/* 탭 메뉴 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setCurrentTab('members')}
              className={`${
                currentTab === 'members'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FaUsers className="inline mr-2" /> 스터디원
            </button>
            <button
              onClick={() => setCurrentTab('ranking')}
              className={`${
                currentTab === 'ranking'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FaChartBar className="inline mr-2" /> 랭킹
            </button>
          </nav>
        </div>
      </div>
      
      {/* 탭 컨텐츠 */}
      {currentTab === 'members' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회원
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudy.members.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.nickname} className="h-10 w-10 rounded-full" />
                        ) : (
                          <span className="text-gray-500">{member.nickname.charAt(0)}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.nickname}
                          {member.userId === user?.id && <span className="ml-2 text-xs text-primary">(나)</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.isOwner ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <FaCrown className="mr-1" /> 스터디장
                        </span>
                      ) : member.isAdmin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          <FaUserShield className="mr-1" /> 관리자
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          일반 회원
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* 스터디장만 관리자 지정/해제 및 강퇴 가능 */}
                    {currentStudy.isOwner && member.userId !== user?.id && (
                      <div className="flex justify-end space-x-2">
                        {member.isAdmin ? (
                          <button
                            onClick={() => handleRemoveAdmin(member.userId)}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={isLoading}
                          >
                            관리자 해제
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMakeAdmin(member.userId)}
                            className="text-blue-600 hover:text-blue-900"
                            disabled={isLoading}
                          >
                            관리자 지정
                          </button>
                        )}
                        <button
                          onClick={() => handleKickMember(member.userId)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          강퇴
                        </button>
                      </div>
                    )}
                    
                    {/* 관리자는 일반 회원만 강퇴 가능 */}
                    {currentStudy.isAdmin && !currentStudy.isOwner && 
                     member.userId !== user?.id && !member.isAdmin && !member.isOwner && (
                      <button
                        onClick={() => handleKickMember(member.userId)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        강퇴
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {currentTab === 'ranking' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setRankingType(RankingType.DAILY)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  rankingType === RankingType.DAILY
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                일간
              </button>
              <button
                onClick={() => setRankingType(RankingType.WEEKLY)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  rankingType === RankingType.WEEKLY
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                주간
              </button>
              <button
                onClick={() => setRankingType(RankingType.MONTHLY)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  rankingType === RankingType.MONTHLY
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                월간
              </button>
            </div>
          </div>
          
          {isRankingLoading ? (
            <div className="flex justify-center py-10">
              <Loading />
            </div>
          ) : (
            <>
              {rankingType === RankingType.DAILY && studyMemberDailyRanking && (
                <StudyMemberRankingList 
                  rankings={studyMemberDailyRanking.rankings} 
                  period={`${new Date(studyMemberDailyRanking.startDate).toLocaleDateString()}`}
                  currentUserId={user?.id || 0}
                />
              )}
              
              {rankingType === RankingType.WEEKLY && studyMemberWeeklyRanking && (
                <StudyMemberRankingList 
                  rankings={studyMemberWeeklyRanking.rankings} 
                  period={`${new Date(studyMemberWeeklyRanking.startDate).toLocaleDateString()} ~ ${new Date(studyMemberWeeklyRanking.endDate).toLocaleDateString()}`}
                  currentUserId={user?.id || 0}
                />
              )}
              
              {rankingType === RankingType.MONTHLY && studyMemberMonthlyRanking && (
                <StudyMemberRankingList 
                  rankings={studyMemberMonthlyRanking.rankings} 
                  period={`${new Date(studyMemberMonthlyRanking.startDate).toLocaleDateString().split('.').slice(0, 2).join('.')}월`}
                  currentUserId={user?.id || 0}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyDetailPage;