import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaClock, FaChartBar, FaTrophy, FaLaptop, FaGem, FaArrowRight, FaFire, FaStar } from 'react-icons/fa';

// 애니메이션 타이머 디스플레이
const AnimatedTimer = () => {
  const [time, setTime] = useState("00:00:00");
  
  useEffect(() => {
    // 매 초마다 시간 업데이트
    const times = ["00:10:25", "01:45:30", "02:30:15", "03:20:45"];
    let index = 0;
    
    const interval = setInterval(() => {
      setTime(times[index]);
      index = (index + 1) % times.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-6xl font-mono font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent mb-4 transition-all duration-700 ease-in-out">
      {time}
    </div>
  );
};

// 캐릭터 카드 미리보기
const CharacterPreview = () => {
  const characters = ['cleric', 'knight', 'wizard', 'archer'];
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % characters.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-24 h-24 bg-white rounded-lg shadow-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-400 opacity-70"></div>
      <div className={`absolute inset-2 bg-white rounded-md overflow-hidden flex items-center justify-center`}>
        <div className={`w-full h-full character-${characters[activeIndex]} character-image`}></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
        레어!
      </div>
    </div>
  );
};

// 커스텀 뱃지 컴포넌트
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-sm transform transition-transform hover:scale-105">
    {children}
  </span>
);

const HomePage: React.FC = () => {
  // 스크롤 위치에 따른 효과를 위한 상태
  const [scrollY, setScrollY] = useState(0);
  
  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* 히어로 섹션 */}
      <div className="relative bg-gradient-to-br from-primary to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between relative">
          {/* 좌측 컨텐츠 */}
          <div className="md:w-1/2 mb-12 md:mb-0 z-10">
            <Badge>New Features 2025</Badge>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 leading-tight">
              <span className="block">효율적인 공부</span>
              <span className="block">
                시간 관리,{" "}
                <span className="bg-white text-primary px-2 rounded-md transform inline-block rotate-1">
                  CheckoutCheckout
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-purple-100">
              공부 시간을 정확하게 기록하고, 통계로 확인하며,<br />
              <span className="font-bold underline decoration-wavy decoration-yellow-300 underline-offset-4">
                특별한 캐릭터 카드를 수집
              </span>해보세요!
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup" className="btn-primary shadow-lg transform transition-transform hover:scale-105 hover:-rotate-1 group">
                무료로 시작하기
                <FaArrowRight className="ml-2 inline-block transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="btn bg-white text-primary hover:bg-opacity-90 shadow-lg transform transition-transform hover:scale-105 hover:rotate-1">
                로그인
              </Link>
            </div>
            
            {/* 배지 아이콘 */}
            <div className="flex mt-8 space-x-2">
              <div className="flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1 text-sm">
                <FaFire className="text-yellow-300 mr-1" /> 랭킹 경쟁
              </div>
              <div className="flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1 text-sm">
                <FaStar className="text-yellow-300 mr-1" /> 다른 사람들과 스터디
              </div>
            </div>
          </div>
          
          {/* 우측 타이머 카드 */}
          <div className="md:w-1/2 flex justify-center z-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 transform hover:rotate-1 transition-transform">
              <div className="text-gray-800 text-center">
                <h3 className="text-lg font-bold text-gray-500 mb-2">내 공부 시간</h3>
                <AnimatedTimer />
                
                <div className="flex justify-center space-x-4 relative">
                  <button className="btn-primary shadow-lg transform transition-transform hover:scale-105 z-10">
                    시작하기
                  </button>
                  <button className="btn bg-error text-white shadow-lg transform transition-transform hover:scale-105 z-10">
                    종료하기
                  </button>
                  
                  {/* 캐릭터 카드 미리보기 - 부유하는 효과 */}
                  <div className="absolute -top-8 -right-12 animate-float">
                    <CharacterPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 하단 물결 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{
          clipPath: "polygon(100% 0%, 0% 0%, 0% 100%, 5% 98%, 10% 99%, 15% 98%, 20% 97%, 25% 96%, 30% 97%, 35% 98%, 40% 99%, 45% 98%, 50% 97%, 55% 96%, 60% 95%, 65% 96%, 70% 97%, 75% 98%, 80% 99%, 85% 98%, 90% 97%, 95% 96%, 100% 95%)"
        }}></div>
      </div>
      
      {/* 특징 섹션 */}
      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <Badge>Special Features</Badge>
          </div>
          
          <h2 className="text-3xl font-extrabold text-center mb-16 bg-gradient-to-r from-primary to-fuchsia-600 bg-clip-text text-transparent">
            째깍째깍의 특별한 기능들
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 카드 1 */}
            <div className="card flex flex-col items-center text-center group hover:shadow-xl transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-50 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right"></div>
              
              <div className="bg-blue-100 p-4 rounded-full mb-4 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <FaClock className="text-3xl text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">타이머 기능</h3>
              
              <p className="text-gray-600 relative z-10">
                공부 시간을 정확하게 측정하고 기록합니다. 브라우저를 닫아도 계속 기록됩니다.
              </p>
            </div>
            
            {/* 카드 2 */}
            <div className="card flex flex-col items-center text-center group hover:shadow-xl transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-green-50 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right"></div>
              
              <div className="bg-green-100 p-4 rounded-full mb-4 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <FaChartBar className="text-3xl text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">통계 분석</h3>
              
              <p className="text-gray-600 relative z-10">
                일별, 주별, 월별 공부 시간을 한눈에 확인하고 성장 패턴을 분석합니다.
              </p>
            </div>
            
            {/* 카드 3 */}
            <div className="card flex flex-col items-center text-center group hover:shadow-xl transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-purple-50 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right"></div>
              
              <div className="bg-purple-100 p-4 rounded-full mb-4 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <FaTrophy className="text-3xl text-purple-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">랭킹 시스템</h3>
              
              <p className="text-gray-600 relative z-10">
                다른 사용자들과 공부 시간을 비교하고 순위를 확인하며 동기부여를 얻으세요.
              </p>
            </div>
            
            {/* 카드 4 */}
            <div className="card flex flex-col items-center text-center group hover:shadow-xl transition-shadow overflow-hidden relative">
              <div className="absolute inset-0 bg-yellow-50 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-right"></div>
              
              <div className="bg-yellow-100 p-4 rounded-full mb-4 relative z-10 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <FaGem className="text-3xl text-amber-500" />
              </div>
              
              <h3 className="text-xl font-bold mb-2 relative z-10">캐릭터 컬렉션</h3>
              
              <p className="text-gray-600 relative z-10">
                매일 6시간 이상 공부하면 특별한 캐릭터 카드를 획득하고 컬렉션을 완성하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 통계 하이라이트 섹션 */}
      <div className="bg-gray-900 text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">놀라운 통계..가 생겼으면!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50 transform hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                7,000+
              </div>
              <div className="text-gray-400">사용자</div>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50 transform hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
                70,000+
              </div>
              <div className="text-gray-400">기록된 시간</div>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50 transform hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">
                20,000+
              </div>
              <div className="text-gray-400">수집된 카드</div>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50 transform hover:scale-105 transition-transform">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-gray-400">사용자 평점</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA 섹션 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge>지금 시작하세요</Badge>
          
          <h2 className="text-3xl font-extrabold mt-6 mb-6 bg-gradient-to-r from-primary to-fuchsia-600 bg-clip-text text-transparent">
            지금 바로 째깍째깍을 시작하세요!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            CheckoutCheckout와 함께 더 효율적인 학습 습관을 만들어보세요.
            <span className="font-bold">철저한 시간 관리가 성공의 비결입니다.</span>
          </p>
          
          <Link to="/signup" className="btn-primary text-lg px-8 py-3 shadow-xl transform transition-transform hover:scale-105 inline-flex items-center">
            무료로 가입하기
            <FaArrowRight className="ml-2" />
          </Link>
          
          <div className="mt-12 text-sm text-gray-500">
            이미 24,000명 이상의 학생들이 째깍째깍을 통해 공부 시간을 관리하고 있습니다.
          </div>
        </div>
      </div>
      
      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CheckoutCheckout
              </h2>
              <p className="text-gray-400 mt-2">효율적인 공부 시간 관리</p>
              
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  이용약관
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  개인정보처리방침
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  문의하기
                </a>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                &copy; 2025 CheckoutCheckout. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Made with 💖 in 🇰🇷
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS 스타일 */}
      <style jsx="true">{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(3deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;