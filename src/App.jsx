import { useState, useEffect } from 'react'
import './App.css'
import LottoGenerator from './components/LottoGenerator'
import XGBoostCard from './components/XGBoostCard'
import RandomForestCard from './components/RandomForestCard'
import RNNCard from './components/RNNCard'
import TensorFlowCard from './components/TensorFlowCard'

function App() {
  const [sharedLines, setSharedLines] = useState([]);
  const [winningHistory, setWinningHistory] = useState([]);
  const [dataError, setDataError] = useState(false);
  const [resetFlag, setResetFlag] = useState(0);

  // 데이터 로딩
  useEffect(() => {
    fetch('/src/lib/lotto.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const history = Object.values(data).map(nums => nums.slice(0, 6));
        setWinningHistory(history);
        setDataError(false);
      })
      .catch(err => {
        console.error("데이터 로드 실패:", err);
        setDataError(true);
      });
  }, []);

  // 10줄 번호가 새로 생성될 때 실행되는 핸들러
  const handleNewLinesGenerated = (newLines) => {
    setSharedLines(newLines);
    setResetFlag(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>⚙️ Lotto AI Factory</h1>
        <p>4대 AI 모델 시뮬레이션 기반 정밀 예측 시스템</p>
        {dataError && <div className="data-error-banner">⚠️ 역사적 데이터 로드 실패. 일부 기능이 제한될 수 있습니다.</div>}
      </header>

      {/* 10줄 카드: 번호 생성 시 부모에게 알림 */}
      <LottoGenerator onGenerated={handleNewLinesGenerated} />

      <section className="analysis-dashboard">
        <div className="dashboard-grid">
          {/* 독립형 AI 모델 카드들 (winningHistory 로드 여부 전달 가능) */}
          <XGBoostCard sharedLines={sharedLines} winningHistory={winningHistory} resetFlag={resetFlag} />
          <RandomForestCard sharedLines={sharedLines} winningHistory={winningHistory} resetFlag={resetFlag} />
          <RNNCard sharedLines={sharedLines} winningHistory={winningHistory} resetFlag={resetFlag} />
          <TensorFlowCard sharedLines={sharedLines} winningHistory={winningHistory} resetFlag={resetFlag} />
        </div>
      </section>
    </div>
  )
}

export default App
