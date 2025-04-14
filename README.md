<img width="833" alt="image" src="https://github.com/user-attachments/assets/eeb441da-874a-4bf1-95e9-649405a2668e" />


### 째깍째깍(checkoutcheckout)
열품타, 깃허브 잔디에서 아이디어를 얻어 **타이머로 공부시간을 기록하고 잔디를 심을 수 있는 서비스**. </br>
React와 MCP 경험을 위한 개인 토이 프로젝트입니다.

- 브라우저를 닫아도, 로그아웃을 해도 시간이 기록이 되는 타이머를 사용할 수 있습니다.
- 서비스 이용자들 간의 일/주/월 간 공부시간 랭킹을 확인할 수 있습니다.
- 일별로 누적 공부 시간에 따라서 잔디가 생성됩니다.
- 일정 공부시간을 돌파하면 매일 한번 캐릭터 카드를 얻을 수 있습니다.
- 수집된 캐릭터 카드들은 마이페이지에서 확인할 수 있습니다.
- 스터디를 개설/가입 할 수 있습니다.
- 스터디끼리 공부시간으로 랭킹을 산정하여 경쟁할 수 있습니다.

2025.04.13 ~

#### Stacks
Java, Spring Boot, MySQL, H2, JPA, JWT, Spring Security, redis, </br>
React, Vite, Zustand, Tailwind CSS, Axios, TypeScript, </br>
MCP(Model Context Protocol)

#### 현재 구현 된 기능
1. 회원가입, 로그인/로그아웃
2. 타이머 시작/중지/기록
3. 사이트 내 회원 전체 공부랭킹
4. 개인 공부시간 기록 (일/주/월/년)
5. 스터디 개설
6. 스터디 조회/가입/수정/삭제
7. 스터디 초대
8. 스터디 별 랭킹
9. 특정 시간 돌파 후 캐릭터카드 랜덤 수집
10. 캐릭터 콜렉팅 (마이페이지)

#### 추가 될 기능

- UI/UX 개선
- 타이머 기록 중 단계별 캐릭터 view
- 스터디 별 등급 (총 누적시간 기반)
- 공부시간 측정 부정행위 방지 기능
- Chrome Extention

⚠️ 현재 로컬단계에서 테스트버전 개발중입니다.

## 테스트실행 순서

### Local DB 세팅
backend 프로젝트 터미널에서
docker-compose up -d

### backend
어플리케이션 실행하시면 됩니다.

### frontend
npm run dev


