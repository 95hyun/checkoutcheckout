import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar 추가 */}
      <Navbar />
      
      {/* 헤더 영역 */}
      <header className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          째깍째깍!
          <br />
          당신의 시간은 지금도 흘러가고 있습니다
        </h1>
        <p className="text-gray-600 mb-12">
          공부 시간을 기록하고, 수집하고, 경쟁해요!<br />
          스터디를 만들어서 경쟁하면 공부가 더 재밌을거에요
        </p>
        <div className="flex justify-center">
          <Link to="/signup" className="bg-red-600 text-white py-3 px-10 rounded-full font-medium hover:bg-red-700 transition-colors">
            무료로 시작하기
          </Link>
        </div>
      </header>
      
      {/* 첫 번째 기능 소개 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 flex justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-red-600">알림메시지</span> 원하는 시간으로,<br />
              미리 설정한 문구 그대로
            </h2>
            <p className="text-gray-600 mb-4">
              공부하는 습관을 형성하는데<br />
              도움을 드리기 위해서<br />
              간단한 설정을 통해 자동으로 알림을 보내드려요
            </p>
          </div>
        </div>
      </section>
      
      {/* 두 번째 기능 소개 섹션 */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="md:w-1/2 flex justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              스터디에 가입해서<br />
              다른 스터디와 경쟁
            </h2>
            <p className="text-gray-600 mb-4">
              같은 스터디원들의 공부시간 기록을 보고 자극도 받고<br />
              다른 스터디와 공부시간 랭킹 경쟁할 수 있어요
            </p>
          </div>
        </div>
      </section>
      
      {/* 사용자 리뷰 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">
            많은 개발자들이 <span className="text-red-600">째깍째깍</span>을 애용하고 있습니다 👏
          </h2>
        </div>

        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            {
              name: '현OO',
              role: '백엔드 개발자',
              text: '자격증 공부를 하는데, 준비하는 사람들끼리 스터디를 만들어서 전부 합격했어요!',
            },
            {
              name: '이OO',
              role: 'LG CNS 부트캠프 학생',
              text: '잔디 채우는거랑 랭킹 등수 올리는 재미가 훌륭하네요..',
            },
            {
              name: '남OO',
              role: '고등학생',
              text: '6시간 채우고 얻는 카드를 모으는 재미로 자연스레 공부습관을 들일 수 있었어요.',
            },
          ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-auto">"{item.text}"</p>
              </div>
          ))}
        </div>
      </section>
      
      {/* CTA 섹션 */}
      <section className="py-24 bg-red-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            이미 많은 유저들이<br />
            째깍째깍을 이용하고 있습니다.
          </h2>
          <Link to="/signup" className="inline-block bg-black text-white py-3 px-10 rounded-full font-medium hover:bg-gray-800 transition-colors">
            무료로 시작하기
          </Link>
        </div>
      </section>
      
      {/* 푸터 */}
      <footer className="py-8 text-sm text-gray-500">
        <div className="max-w-5xl mx-auto px-4">
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between">
            <div>
              <p>Copyright © 2025, 째깍째깍. All rights reserved.</p>
              <p className="mt-2">github @95hyun</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p>개인정보처리방침</p>
              <p className="mt-2">이용약관</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;