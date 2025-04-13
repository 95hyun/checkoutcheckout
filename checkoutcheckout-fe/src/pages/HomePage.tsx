import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaClock, FaChartBar, FaTrophy, FaLaptop } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* 히어로 섹션 */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">
              효율적인 공부 시간 관리,<br />
              CheckoutCheckout
            </h1>
            <p className="text-lg mb-6">
              공부 시간을 정확하게 기록하고, 통계를 확인하며<br />
              다른 사용자들과 함께 동기부여를 얻어보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary">
                무료로 시작하기
              </Link>
              <Link to="/login" className="btn bg-white text-primary hover:bg-gray-100">
                로그인
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 w-80">
              <div className="text-gray-800 text-center">
                <div className="text-6xl font-mono font-bold text-primary mb-4">
                  02:45:30
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="btn-primary">시작하기</button>
                  <button className="btn bg-error text-white">종료하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 특징 섹션 */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12">주요 기능</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FaClock className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">타이머 기능</h3>
            <p className="text-gray-600">
              공부 시간을 정확하게 측정하고 기록합니다. 브라우저를 닫아도 계속 기록됩니다.
            </p>
          </div>
          
          <div className="card flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <FaChartBar className="text-3xl text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">통계 분석</h3>
            <p className="text-gray-600">
              일별, 주별, 월별 공부 시간을 한눈에 확인하고 성장 패턴을 분석합니다.
            </p>
          </div>
          
          <div className="card flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <FaTrophy className="text-3xl text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">랭킹 시스템</h3>
            <p className="text-gray-600">
              다른 사용자들과 공부 시간을 비교하고 순위를 확인하며 동기부여를 얻으세요.
            </p>
          </div>
          
          <div className="card flex flex-col items-center text-center">
            <div className="bg-yellow-100 p-4 rounded-full mb-4">
              <FaLaptop className="text-3xl text-warning" />
            </div>
            <h3 className="text-xl font-bold mb-2">간편한 사용</h3>
            <p className="text-gray-600">
              직관적인 UI로 누구나 쉽게 사용할 수 있습니다. 모바일에서도 최적화되었습니다.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA 섹션 */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            지금 바로 시작하세요!
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            CheckoutCheckout와 함께 더 효율적인 학습 습관을 만들어보세요.
            철저한 시간 관리가 성공의 비결입니다.
          </p>
          <Link to="/signup" className="btn-primary text-lg px-8 py-3">
            무료로 가입하기
          </Link>
        </div>
      </div>
      
      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">CheckoutCheckout</h2>
              <p className="text-gray-400">효율적인 공부 시간 관리</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">&copy; 2025 CheckoutCheckout. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;