# ⚾ Double-Play
### 야구 팬들을 위한 **실시간 채팅 & 티켓 거래 플랫폼**

---

## 🚀 프로젝트 소개

<p align="center">
  <img src="image/logo.png" alt="DoublePlay Logo" width="200"/>
</p>


Double-Play는 **야구 팬들이 모임을 만들고, 함께 채팅하며, 티켓을 안전하게 거래할 수 있는 커뮤니티 플랫폼**입니다.  
STOMP 기반 WebSocket을 활용해 **실시간 단체/1:1 채팅**을 지원하며, Spring Boot + React 기반 풀스택 프로젝트로 개발했습니다.

---

## 🛠 기술 스택

### Backend
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.5.6-brightgreen?style=flat-square&logo=springboot&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

### Database
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)


---

## 📌 핵심 기능

### 🔑 회원가입 / 로그인

| ![Logo1](image/1.png) | ![Logo2](image/2.png) |
|-----------------------|-----------------------|

- 로컬 회원가입 및 JWT 기반 로그인
- Refresh Token을 HttpOnly Cookie로 관리
- 역할(Role)별로 접근 권한을 차등 적용합니다

### 💬 실시간 채팅

방 만들기를 통해 실시간 채팅방 생성이 가능합니다.

![Logo1](image/3.png)

![Logo1](image/5.png)
WebSocket + STOMP 기반 메시지 송수신 기능입니다
채팅 내용은 DB에 저장되어 새로고침 후에도 대화가 유지됩니다

<br>

![Logo1](image/8.png)
- 사용자 요청 -> 방장 수락 -> 채팅 가능
- 사용자 요청 시 권한이 부여됩니다



| ![Logo1](image/6.png) | ![Logo2](image/7.png) |
|-----------------------|-----------------------|

<br>

### 🎟 티켓 거래 (1:1 채팅)
![Logo1](image/9.png)

![Logo1](image/10.png)
판매자는 티켓 정보를 입력하여 거래 등록이 가능합니다.

| ![Logo1](image/11.png) | ![Logo2](image/12.png) |
|------------------------|------------------------|

- 구매 버튼을 클릭하면 판매자와 1:1 채팅방이 생성되고, 티켓 거래 완료 시 채팅방이 닫히며 접근이 불가합니다.


### 📅 경기 조회
| ![Logo1](image/13.png) | ![Logo2](image/14.png) |
|------------------------|------------------------|

- 야구 경기 일정 및 구장별 경기 정보 조회가 가능합니다.

<br>

---

<br>
<br>

### 🚀 향후 개선 계획

- **CI/CD 배포 자동화**  
  Docker + GitHub Actions를 활용한 클라우드 환경 배포

- **신고 기능**  
  부적절한 메시지 및 사용자 신고 → 관리자 검토 및 제재 처리

- **알림 시스템**  
  새로운 메시지, 참여 요청 발생 시 실시간 알림 제공

- **모바일 최적화**  
  다양한 기기에서의 가독성 및 사용성 개선
