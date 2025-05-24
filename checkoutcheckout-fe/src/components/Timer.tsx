import React, { useEffect, useState, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import { FaPlay, FaStop, FaGift, FaClock, FaCalendarAlt, FaCheckCircle, FaTasks, FaCheck, FaHourglassEnd } from 'react-icons/fa';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import useCharacterStore from '../store/characterStore';
import useTimerStore from '../store/timerStore';
import usePlanStore from '../store/planStore';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { formatSecondsToReadable, formatSeconds } from '../utils/timeUtils';
import { StudyPlanItem, Rarity } from '../types';
import CharacterCard from './CharacterCard';
import { CHARACTERS_BY_RARITY, RARITY_PROBABILITIES, getRandomRarity, getRandomCharacterByRarity } from '../constants/characterConstants';

// 캐릭터 획득을 위한 최소 공부 시간 (1시간)
const MIN_STUDY_TIME_FOR_CHARACTER = 3600; // 초 단위 (1시간 = 3600초)

const Timer: React.FC = () => {
  const {
    isActive = false,
    elapsedTime = 0,
    formattedTime = '00:00:00',
    startTimer,
    stopTimer,
    isLoading = false,
    error,
    resetError
  } = useTimer();

  const navigate = useNavigate();
  const [showCharacterAlert, setShowCharacterAlert] = useState<boolean>(false);
  const [acquiredCharacter, setAcquiredCharacter] = useState<string | null>(null);
  const characterTimeoutRef = useRef<number | null>(null);

  // 오늘 및 이번주 공부 시간 상태
  const [todayStudyTime, setTodayStudyTime] = useState<number>(0);
  const [weeklyStudyTime, setWeeklyStudyTime] = useState<number>(0);

  // 타이머에 선택된 계획 관련 상태
  const [selectedPlan, setSelectedPlan] = useState<StudyPlanItem | null>(() => {
    const savedPlan = localStorage.getItem('selectedStudyPlan');
    return savedPlan ? JSON.parse(savedPlan) : null;
  });
  const [showTargetReachedPopup, setShowTargetReachedPopup] = useState<boolean>(false);

  const {
    acquireCharacter,
    hasReceivedTodayCharacter,
    checkTodayCharacter,
    loading: characterLoading,
    error: characterError
  } = useCharacterStore();

  const {
    fetchStudyHistory,
    studyHistory,
    recentSessions
  } = useTimerStore();

  // 계획 관련 스토어
  const {
    getPlansByDate,
    currentDatePlans,
    isLoading: isPlanLoading,
    error: planError
  } = usePlanStore();

  // 페이지 로드 시 오늘 캐릭터를 이미 획득했는지 확인
  useEffect(() => {
    // 캐릭터 획득 여부를 확인하고 상태를 업데이트
    const checkCharacterStatus = async () => {
      console.log("캐릭터 상태 확인 중...");
      // 백엔드에서 오늘 획득한 캐릭터 정보 확인
      const hasCharacter = await checkTodayCharacter();
      console.log("캐릭터 획득 여부:", hasCharacter);
    };

    checkCharacterStatus();
  }, [checkTodayCharacter]);

  // 페이지 로드 시 공부 기록 및 오늘의 계획 불러오기
  useEffect(() => {
    const loadData = async () => {
      // 상태를 업데이트하기 위한 공부 기록 불러오기
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      // 이번주 날짜 범위 설정 (월요일 ~ 일요일)
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

      // 공부 기록 불러오기
      await fetchStudyHistory(todayStart, weekEnd);

      // 오늘의 계획 불러오기
      await getPlansByDate(today);
    };

    loadData();
  }, [fetchStudyHistory, getPlansByDate]);

  // 공부 기록이 로드되면 오늘 및 이번주 공부 시간 계산
  useEffect(() => {
    if (studyHistory && studyHistory.records) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

      // 오늘 공부 시간 계산
      const todayRecord = studyHistory.records.find(record => record.date === today);
      setTodayStudyTime(todayRecord ? todayRecord.duration : 0);

      // 이번주 공부 시간 계산 (월요일부터 현재까지)
      const weeklyRecords = studyHistory.records.filter(record =>
        record.date >= weekStart && record.date <= weekEnd
      );
      const totalWeeklyTime = weeklyRecords.reduce((total, record) => total + record.duration, 0);
      setWeeklyStudyTime(totalWeeklyTime);
    }
  }, [studyHistory]);

  // 타이머 상태가 변경되면 공부 시간 기록 업데이트
  useEffect(() => {
    if (!isActive) {
      // 타이머가 멈추면 갱신
      const updateStudyTimes = async () => {
        // 오늘 날짜 범위 설정
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // 이번주 날짜 범위 설정 (월요일 ~ 일요일)
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        // 공부 기록 불러오기
        await fetchStudyHistory(todayStart, weekEnd);
      };

      updateStudyTimes();
    }
  }, [isActive, fetchStudyHistory]);

  // 타이머가 실행 중이고 계획이 선택된 경우 목표 시간 체크
  useEffect(() => {
    if (isActive && selectedPlan && elapsedTime >= selectedPlan.plannedDuration && !selectedPlan.isCompleted) {
      setShowTargetReachedPopup(true);
    }
  }, [isActive, selectedPlan, elapsedTime]);

  // 공부 시간이 10초를 넘으면 캐릭터 획득 체크
  useEffect(() => {
    console.log("타이머 체크:", { isActive, hasReceivedTodayCharacter, elapsedTime });

    // 이미 캐릭터를 받았거나, 타이머가 실행 중이 아니거나, 10초가 안 되었으면 처리하지 않음
    if (!isActive || elapsedTime < MIN_STUDY_TIME_FOR_CHARACTER) {
      return;
    }

    if (hasReceivedTodayCharacter) {
      console.log("이미 오늘 캐릭터를 획득했습니다.");
      return;
    }

    // 이미 타임아웃이 설정되어 있으면 처리하지 않음
    if (characterTimeoutRef.current) {
      return;
    }

    console.log("10초 경과! 캐릭터 획득 조건 충족");

    // 캐릭터 획득 처리
    characterTimeoutRef.current = window.setTimeout(() => {
      try {
        // 희귀도 결정
        const randomRarity = getRandomRarity();

        // 해당 희귀도의 캐릭터 중 랜덤 선택
        const characterType = getRandomCharacterByRarity(randomRarity);
        console.log(`선택된 캐릭터 타입: ${characterType}, 희귀도: ${randomRarity}`);
        console.log(`캐릭터 목록 확인 - ${randomRarity}:`, CHARACTERS_BY_RARITY[randomRarity]);

        setAcquiredCharacter(characterType);
        setShowCharacterAlert(true);

        // 백엔드 API 호출 (희귀도 추가)
        acquireCharacter(characterType, randomRarity)
            .then((character) => {
              console.log('캐릭터 획득 성공:', character);
              console.log('이미지 경로:', `/characters/checkout_${characterType}.png`);
              // 캐릭터 획득 알림 표시
            })
            .catch(err => {
              console.error('캐릭터 획득 실패:', err);
            })
            .finally(() => {
              characterTimeoutRef.current = null;
            });
      } catch (error) {
        console.error("캐릭터 획득 중 오류 발생:", error);
        characterTimeoutRef.current = null;
      }
    }, 500); // 약간의 지연 추가

    return () => {
      if (characterTimeoutRef.current) {
        clearTimeout(characterTimeoutRef.current);
        characterTimeoutRef.current = null;
      }
    };
  }, [isActive, elapsedTime, hasReceivedTodayCharacter, acquireCharacter]);

  // 에러 메시지를 5초 후에 자동으로 지우기
  useEffect(() => {
    if ((error || characterError || planError) && resetError) {
      const timer = setTimeout(() => {
        resetError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, characterError, planError, resetError]);

  // 선택된 계획이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('selectedStudyPlan', JSON.stringify(selectedPlan));
    } else {
      localStorage.removeItem('selectedStudyPlan');
    }
  }, [selectedPlan]);

  const handleStartTimer = async () => {
    if (!isActive && !isLoading && startTimer) {
      await startTimer();
    }
  };

  const handleStopTimer = async () => {
    if (isActive && !isLoading && stopTimer) {
      await stopTimer();
      setSelectedPlan(null);
      localStorage.removeItem('selectedStudyPlan');
      if (showTargetReachedPopup) {
        setShowTargetReachedPopup(false);
      }
    }
  };

  const handleCharacterClose = () => {
    setShowCharacterAlert(false);
  };

  const navigateToProfile = () => {
    setShowCharacterAlert(false);
    navigate('/profile');
  };

  // 오늘 계획 수립으로 이동
  const navigateToPlanPage = () => {
    navigate('/history');
  };

  // 목표 시간 달성 후 계속 공부하기
  const handleContinueTimer = async () => {
    // 팝업 닫기
    setShowTargetReachedPopup(false);
  };

  // 목표 시간 달성 후 타이머 종료하기
  const handleStopAfterTarget = async () => {
    // 팝업 닫기 및 타이머 종료
    setShowTargetReachedPopup(false);
    await handleStopTimer();
  };

  // 오늘 날짜 계획 유무 확인
  const hasTodayPlans = currentDatePlans && currentDatePlans.items && currentDatePlans.items.length > 0;

  // 오늘 계획 중 완료되지 않은 항목 필터링
  const uncompletedPlans = hasTodayPlans
      ? currentDatePlans.items.filter(item => !item.isCompleted)
      : [];

  // 오늘 계획 중 완료된 항목 필터링
  const completedPlans = hasTodayPlans
      ? currentDatePlans.items.filter(item => item.isCompleted)
      : [];

  return (
      <div className="flex flex-col items-center p-8 shadow-lg rounded-lg bg-white w-full">
        <div className="text-6xl font-mono mb-8 select-none font-bold">
          {formattedTime}
        </div>

        {/* 타이머 시작 전 계획 선택 영역 (타이머가 활성화되지 않았을 때만 표시) */}
        {!isActive && (
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold mb-3">오늘의 공부 계획 선택</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {/* 계획 없음 옵션 */}
                <div
                    className={`p-3 border rounded-lg cursor-pointer transition-colors
                ${selectedPlan === null
                        ? 'bg-primary bg-opacity-10 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => setSelectedPlan(null)}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">계획 없음</div>
                    {selectedPlan === null && <FaCheck className="text-primary" />}
                  </div>
                </div>

                {/* 미완료 계획 목록 */}
                {uncompletedPlans.length > 0 ? (
                    uncompletedPlans.map(plan => (
                        <div
                            key={plan.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors
                    ${selectedPlan?.id === plan.id
                                ? 'bg-primary bg-opacity-10 border-primary text-primary'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                            onClick={() => setSelectedPlan(plan)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{plan.content}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                목표 시간: {formatSecondsToReadable(plan.plannedDuration)}
                              </div>
                            </div>
                            {selectedPlan?.id === plan.id && <FaCheck className="text-primary" />}
                          </div>
                        </div>
                    ))
                ) : hasTodayPlans ? (
                    <div className="text-center p-3 bg-gray-50 rounded-lg text-gray-500">
                      모든 계획을 완료했습니다!
                    </div>
                ) : (
                    <div className="text-center p-3 bg-gray-50 rounded-lg text-gray-500">
                      오늘 계획이 없습니다.
                      <button
                          onClick={navigateToPlanPage}
                          className="ml-1 text-primary hover:underline"
                      >
                        계획 추가하기
                      </button>
                    </div>
                )}
              </div>
            </div>
        )}

        <div className="flex space-x-4">
          {(isLoading || characterLoading) ? (
              <div className="flex items-center justify-center w-32 h-12">
                <Loading size="md" />
              </div>
          ) : !isActive ? (
              <button
                  onClick={handleStartTimer}
                  disabled={isLoading || characterLoading}
                  className="btn-primary flex items-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  aria-label="타이머 시작"
              >
                <FaPlay className="mr-2" /> 시작하기
              </button>
          ) : (
              <button
                  onClick={handleStopTimer}
                  disabled={isLoading || characterLoading}
                  className="btn bg-error text-white hover:bg-red-600 flex items-center px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  aria-label="타이머 중지"
              >
                <FaStop className="mr-2" /> 종료하기
              </button>
          )}
        </div>

        {isActive && (
            <div className="mt-4 text-green-600 font-medium text-center">
              <p>타이머가 실행 중입니다</p>
              {selectedPlan && (
                  <p className="text-sm mt-1 flex items-center justify-center">
                    <span className="font-medium">{selectedPlan.content}</span>
                    <span className="mx-2">•</span>
                    <span>목표: {formatSecondsToReadable(selectedPlan.plannedDuration)}</span>
                  </p>
              )}
              <p className="text-sm text-gray-600 mt-1">브라우저를 닫아도 계속 기록됩니다</p>
            </div>
        )}

        {/* 학습 요약 */}
        <div className="w-full mt-6 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <FaTasks className="mr-2 text-green-600" /> 오늘의 공부 계획
            </h3>
            <button
                onClick={navigateToPlanPage}
                className="text-primary text-sm hover:underline flex items-center"
            >
              {hasTodayPlans ? '계획 수정하기' : '계획 추가하기'} →
            </button>
          </div>

          {isPlanLoading ? (
              <div className="flex justify-center py-4">
                <Loading size="sm" />
              </div>
          ) : planError ? (
              <ErrorMessage message={planError} />
          ) : !hasTodayPlans ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                <p>오늘의 계획이 없습니다.</p>
                <button
                    onClick={navigateToPlanPage}
                    className="mt-2 text-primary hover:underline text-sm"
                >
                  계획 페이지에서 추가하기
                </button>
              </div>
          ) : (
              <div className="space-y-4">
                {/* 미완료 계획 */}
                {uncompletedPlans.length > 0 && (
                    <div className="space-y-2">
                      {uncompletedPlans.map(plan => (
                          <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex-1">
                              <p className="font-medium">{plan.content}</p>
                              <p className="text-xs text-gray-500 mt-1">목표: {formatSecondsToReadable(plan.plannedDuration)}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                )}

                {/* 완료된 계획 */}
                {completedPlans.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-600 mb-2 flex items-center">
                        <FaCheckCircle className="mr-1 text-green-500" /> 완료된 항목
                      </h4>
                      <div className="space-y-2">
                        {completedPlans.map(plan => (
                            <div key={plan.id} className="bg-green-50 border border-green-100 rounded-lg p-3">
                              <p className="font-medium text-gray-500 line-through">{plan.content}</p>
                              <p className="text-xs text-gray-400 mt-1">목표: {formatSecondsToReadable(plan.plannedDuration)}</p>
                            </div>
                        ))}
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        {/* 캐릭터 획득 알림 */}
        {showCharacterAlert && acquiredCharacter && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex flex-col items-center">
                  <FaGift className="text-5xl text-yellow-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">캐릭터 획득!</h3>

                  {/* 캐릭터 미리보기 */}
                  <div className="w-32 h-32 my-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <CharacterCard characterType={acquiredCharacter} className="w-full h-full" />
                  </div>

                  <p className="text-center mb-4">
                    축하합니다! 공부를 열심히 하여 새로운 캐릭터를 획득했습니다!
                  </p>
                  <p className="text-primary font-semibold mb-4">
                    캐릭터는 프로필 페이지에서 확인할 수 있습니다.
                  </p>
                  <div className="flex space-x-4">
                    <button
                        onClick={handleCharacterClose}
                        className="btn-outline px-4 py-2"
                    >
                      계속 공부하기
                    </button>
                    <button
                        onClick={navigateToProfile}
                        className="btn-primary px-4 py-2"
                    >
                      프로필로 이동
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* 목표 시간 달성 팝업 */}
        {showTargetReachedPopup && selectedPlan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex flex-col items-center">
                  <FaHourglassEnd className="text-5xl text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">목표 시간 달성!</h3>
                  <p className="text-center mb-4">
                    <span className="font-medium">'{selectedPlan.content}'</span> 계획의 목표 시간
                    <span className="font-medium"> {formatSecondsToReadable(selectedPlan.plannedDuration)}</span>을 달성했습니다!
                  </p>
                  <p className="text-gray-600 mb-4">
                    이 계획을 완료 처리하고 계속 진행하시겠습니까?
                  </p>
                  <div className="flex space-x-4">
                    <button
                        onClick={handleContinueTimer}
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                      계속 공부하기
                    </button>
                    <button
                        onClick={handleStopAfterTarget}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      타이머 종료하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Timer;