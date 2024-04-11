# SSAFY 10기 특화 프로젝트 (핀테크)

# 감정저축은행

### 목차

[1. 프로젝트 개요](#1-프로젝트-개요)

[2. 팀 역할 소개](#2-팀-소개)

[3. 프로젝트 개발 환경](#3-프로젝트-개발-환경)

[4. 주요 기능 소개](#4-주요-기능-소개)

[5. 서비스 화면](#5-서비스-화면)

## 1. 프로젝트 개요

<b>“감정도 재화도 과다하게 소비한다면 삶이 피폐해지고 맙니다.
그래서 이제 저축해요 감정도 재화도” </b>

    맹목적인 소비금지가 아니라
    자신의 감정을 잘 파악하고 일회성 소비를 줄여나감으로써
    불필요한 소비가 아닌 저축을 할 수 있는 서비스

## 2. 팀 역할 소개

    이수형 : Leader, BackEnd, AI

    김재민 : BackEnd, Infra

    엄예진 : BackEnd, AI, Data Pipeline 구축

    장선웅 : FrontEnd, 3D Modeling

    나하나 : FrontEnd, 3D Modeling, Design

    조상민 : FrontEnd Leader,

## 3. 프로젝트 개발 환경

<h3>3-1. FrontEnd</h3>

```
Node 18.12.0
Three.js
Blender
React
NPM
Cannon-es
Drei
R3F
Zustand
```

<h3>3-2. BackEnd</h3>

```
1. Spring
    Java 17
    Spring Boot 2.4.5
    JPA
    JWT
    RestTemplate

2. FastAPI
    Python3.10
    Uvicorn
    Transformer
    PyTorch
    Gluonnlp
    KoBERT
```

<h3>3-3. Infra</h3>

```
Docker Compose 3
Apache Airflow
Google Cloud Platform
NginX
Certbot
EC2
RDS
```

## 4. 주요 기능 소개

1. 메인 페이지

   - Blender를 통해 모델링 된 3D 오브젝트들을 Three.js로 배치하여 마치 게임 같은 3D 쿼터뷰 페이지를 구현
   - 사용자가 직접 움직이며 메인 페이지 내의 오브젝트들과 상호작용을 통해 사용자의 흥미를 유발하는 메인 페이지 구현

2. 저축

   - 메모 저축

     - 사용자가 메모 입력 시 AI(koBERT)가 해당 메모를 분석하여 7가지 감정에 대한 수치화 진행
     - 사용자의 감정 분석을 통해 가장 수치가 높은 감정 추천 및 확인
     - 감정 수치를 통해 저축할 금액을 추천
       - 기쁜 감정일 경우 기부 추천
     - 사용자가 선택한 감정과 금액을 해당 서비스 DB와 SSAFY 금융망의 계좌에 저축 진행
       - SSAFY 금융망에서는 출금 연결한 계좌와 저축 계좌 사이에 계좌 이체

   - 이모지 저축
     - 메모를 원하지 않는 사용자의 편의를 위해 메모 없이 감정을 이모지로 선택하고 금액을 입력하여 저축
     - 저축 로직은 메모 저축과 동일하게 진행

3. 기부
   - DB에 저장된 기부 단체들 중 하나를 선택하여 금액을 지정하고 기부 진행
   - 기부 금액은 서비스 계좌(저축 계좌)에서 출금되도록 지정
   - 기부 내역도 확인 가능
4. 마이페이지
   - 회원 정보 및 계좌 정보를 확인, 수정 할 수 있는 페이지
   - 저축 내용을 그래프로 통계화 한 페이지
     - 저축 할 때 지정한 각 감정들의 저축 횟수와 비율을 원그래프의 형식으로 제공
     - 저축액 추이를 하루 단위로 구분한 선그래프 제공
     - 지금을 기준으로 1년 전까지의 캘린더 그래프에 해당 날짜에 저축한 횟수를 색으로 구분한 스트릭 그래프 제공
     - 저축 계좌의 목표 금액과 현재 저축액의 달성률을 확인 할 수 있는 그래프 제공

## 5. 서비스 화면

1. 메인 페이지
   <img src="./image/main.png" alt="Main Page">
   <br><br>
2. 메모 저축
   <img src="./image/memo.png" alt="Memo Saving">
   <br><br>
3. 이모티콘 저축
   <img src="./image/imoji.png" alt="Imoji Saving">
   <br><br>
4. 기부
   <img src="./image/donation.png" alt="Donation">
   <br><br>
5. 마이페이지
   <img src="./image/mypage.png" alt="User My Page">


## 6.시스템 아키텍쳐

   <img src="./image/arthitecture.png" alt="System Architecture">