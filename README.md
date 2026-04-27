# 🎯 AI Lotto Prediction System

로또 당첨 데이터를 기반으로  
여러 AI 모델을 활용해 번호를 분석하고 생성하는 프로젝트입니다.

단순 랜덤 생성이 아닌,  
각 알고리즘별 접근 방식을 비교하며  
데이터 기반으로 번호를 도출하는 구조를 구현했습니다.

---

## 📌 주요 기능

- 📊 과거 로또 데이터 기반 분석
- 🤖 AI 모델별 번호 생성 방식 제공
  - Random Forest
  - RNN
  - XGBoost
  - TensorFlow
- 🎯 알고리즘별 결과 비교 UI
- 🔄 랜덤 + 확률 기반 혼합 생성
- 📦 JSON 데이터 기반 로컬 분석

---

## 🛠️ 기술 스택

- Frontend: React
- Build Tool: Vite
- Language: JavaScript
- Data: JSON (로또 당첨 데이터)

---

## 📂 프로젝트 구조

```
src/
├── components/
│   ├── LottoGenerator.jsx
│   ├── RandomForestCard.jsx
│   ├── RNNCard.jsx
│   ├── XGBoostCard.jsx
│   └── TensorFlowCard.jsx
├── lib/
│   ├── lotto.json
│   └── utils.js
├── App.jsx
└── main.jsx
```



---

## 🚀 실행 방법

```bash
npm install
npm run dev
