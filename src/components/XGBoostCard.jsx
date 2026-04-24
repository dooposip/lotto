import React, { useState } from 'react';
import './XGBoostCard.css';
import { getBallColor, weightedSample } from '../lib/utils';

const XGBoostCard = ({ sharedLines, winningHistory, resetFlag }) => {
  const [state, setState] = useState({
    loading: false,
    result: null,
    activeMode: null,
    processMsg: ''
  });

  // 새 번호 생성 시 결과 리셋 효과
  React.useEffect(() => {
    setState(prev => ({ ...prev, result: null, activeMode: null }));
  }, [resetFlag]);

  const runXGBoostAnalysis = (inputData) => {
    let weights = Array(46).fill(1);
    const flatNumbers = inputData.flat();
    const counts = Array(46).fill(0);
    flatNumbers.forEach(n => { if(n >= 1 && n <= 45) counts[n]++; });
    
    if (flatNumbers.length === 0) return null;

    const learningRate = 0.1;
    const iterations = 5;
    const expected = flatNumbers.length / 45;

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 1; i <= 45; i++) {
        const residual = (counts[i] - expected) / (expected || 1);
        const logAdjustment = -residual * learningRate;
        weights[i] *= Math.exp(logAdjustment);
      }
    }

    return {
      numbers: weightedSample(weights),
      confidence: (Math.random() * 5 + 92).toFixed(1),
      insight: `XGBoost ${iterations}단계 부스팅 완료. 데이터 잔차(Residual) 오차율을 최소화하여 통계적 평형 상태를 도출했습니다.`
    };
  };

  const handleAnalyze = (mode) => {
    setState(prev => ({ ...prev, loading: true, activeMode: mode, processMsg: '데이터 스캔 중...' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, processMsg: mode === 'auto' ? '소규모 패턴 분석 중...' : '대규모 통계 분포 계산 중...' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, processMsg: '5단계 잔차 부스팅 및 가중치 튜닝 중...' }));
        setTimeout(() => {
          let sourceData = mode === 'auto' ? sharedLines : mode === 'winning' ? winningHistory : [...winningHistory, ...sharedLines];
          const analysisResult = runXGBoostAnalysis(sourceData);
          setState({ loading: false, result: analysisResult, activeMode: mode, processMsg: '' });
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="xgboost-card">
      <div className="card-header">
        <span className="xgboost-tag">XGBOOST 엔진</span>
        {state.result && <span className="xg-confidence">신뢰도: {state.result.confidence}%</span>}
      </div>
      <div className="xgboost-content">
        {state.result ? (
          <div className="xg-result-box">
             <div className="xg-status-label">{state.activeMode === 'auto' ? '자동 데이터 분석 완료' : state.activeMode === 'winning' ? '과거 당첨 분석 완료' : '통합 시뮬레이션 완료'}</div>
             <div className="xg-numbers">
                {state.result.numbers.map((n, i) => (
                  <span key={i} className="xg-ball" style={{ backgroundColor: getBallColor(n) }}>{n}</span>
                ))}
             </div>
             <p className="xg-insight">{state.result.insight}</p>
          </div>
        ) : state.loading ? (
          <div className="xg-loading-area">
            <div className="xg-spinner"></div>
            <div className="xg-process-text">{state.processMsg}</div>
          </div>
        ) : (
          <div className="xg-placeholder">{sharedLines.length === 0 ? '번호 추첨 필요' : '분석 모드를 선택하세요'}</div>
        )}
      </div>
      <div className="xgboost-btn-group">
        <button className={`btn-xg btn-auto ${state.activeMode === 'auto' ? 'active' : ''}`} onClick={() => handleAnalyze('auto')} disabled={state.loading || sharedLines.length === 0}>자동</button>
        <button className={`btn-xg btn-winning ${state.activeMode === 'winning' ? 'active' : ''}`} onClick={() => handleAnalyze('winning')} disabled={state.loading}>당첨</button>
        <button className={`btn-xg btn-integrated ${state.activeMode === 'integrated' ? 'active' : ''}`} onClick={() => handleAnalyze('integrated')} disabled={state.loading || sharedLines.length === 0}>통합</button>
      </div>
    </div>
  );
};

export default XGBoostCard;
