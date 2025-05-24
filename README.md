![image](https://github.com/user-attachments/assets/0578ca64-23ae-47d1-b12c-24c889d24445)



### 째깍째깍(checkoutcheckout)
개발기간 25.04.13 ~ 25.04.15

열품타, 깃허브 잔디에서 아이디어를 얻어 **타이머로 공부시간을 기록하고 잔디를 심을 수 있는 서비스**. </br>
React와 Spring Boot를 활용한 개인 토이 프로젝트입니다.
기존의 아이디어를 빠르게 MCP(Model Context Protocol)를 활용해서 베이스 코드를 작성하고 다듬어 완성시키는 방식으로 빠르게 완성하는 걸 목표 했습니다.

#### 간단 기능 소개

![image](https://github.com/user-attachments/assets/cb75979a-7806-4498-a603-2714c2c8a356)
![image](https://github.com/user-attachments/assets/a76cf1de-4be4-454f-9eb7-857f16258141)

[타이머]
- 브라우저를 닫아도, 로그아웃을 해도 시간이 기록이 되는 타이머를 사용할 수 있습니다.
- 타이머에 기록된 공부 시간에 따라서 github contribute style의 잔디가 자동으로 심어집니다.

![image](https://github.com/user-attachments/assets/0df04277-7abe-45fd-8d8c-b8988f15f12f)

[스터디]
- 스터디를 개설/가입 할 수 있습니다.
- 개설 시 즉시가입 or 비밀번호 설정 할 수 있습니다.

![image](https://github.com/user-attachments/assets/f6a005af-81e7-44ee-8274-a68578753797)

[랭킹]
- 서비스 이용자들 간의 일/주/월 간 공부시간 랭킹을 확인할 수 있습니다.
- 스터디끼리 공부시간으로 랭킹을 산정하여 경쟁할 수 있습니다.
- 스터디 내 스터디원들 끼리 공부시간으로 랭킹을 산정하여 경쟁할 수 있습니다.

![image](https://github.com/user-attachments/assets/77f24fcd-8947-4d4b-bf43-6da2eca32c00)
[리워드]
- 일정 공부시간을 돌파하면 매일 한번 랜덤 희귀도의 캐릭터 카드를 얻을 수 있습니다.
- 캐릭터 카드 희귀도에 따라서 CSS 효과 차별화를 두었습니다.
- 수집된 캐릭터 카드들은 마이페이지에서 확인할 수 있습니다.
- 수집한 캐릭터 카드 중 하나를 선택하여 유저 프로필 이미지로 등록할 수 있습니다.

#### Stacks
Java, Spring Boot, </br>
MySQL, H2, redis, JPA, </br>
JWT, Spring Security, </br>
React, Vite, Zustand, Tailwind CSS, Axios, TypeScript, </br>
Jetbrains MCP Server(Model Context Protocol)

## 실행 순서

### Local DB 세팅
backend 프로젝트 터미널에서
docker-compose up -d

### backend
애플리케이션 실행하시면 됩니다.

### frontend
npm run dev


