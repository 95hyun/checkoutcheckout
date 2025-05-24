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
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 character-legendary_tralellotralala character-image transform -rotate-12"></div>
                <div className="w-32 h-32 character-common_rabbit character-image transform rotate-12"></div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-red-600">열심히 공부하면</span> 랜덤으로<br />
              캐릭터 카드를 얻어요
            </h2>
            <p className="text-gray-600 mb-4">
              공부하는 습관을 형성하는데<br />
              도움을 드리기 위해서<br />
              게이미피케이션 요소를 추가했어요
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
              스터디원끼리 공부 기록을 보고 자극도 받고<br />
              다른 스터디와 공부 시간으로 경쟁할 수 있어요
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
              text: '같은 자격증을 목표로 뜻에 맞는 사람끼리 스터디에 가입해서 서로 공부시간이 체크되니까 자극이 됐어요',
              character: 'rare_wolf'
            },
            {
              name: '구OO',
              role: 'LG CNS 부트캠프 학생',
              text: '전설 카드 얻으려고 매일 하고있습니다. 전설카드 주세요',
              character: 'legendary_doge'
            },
            {
              name: '정OO',
              role: '취준생',
              text: '코딩테스트 준비하느라 매일 공부 중이었는데 더 재밌게 할 수 있게 됐어요',
              character: 'epic_dragon'
            },
          ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mr-4 overflow-hidden">
                    <div className={`w-full h-full character-${item.character} character-image`}></div>
                  </div>
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
            째깍째깍으로<br />
            성취감을 올리세요
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