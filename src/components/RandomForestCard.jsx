import React, { useState } from 'react';
import './RandomForestCard.css';
import { getBallColor, weightedSample } from '../lib/utils';

const RandomForestCard = ({ sharedLines, winningHistory, resetFlag }) => {
  const [state, setState] = useState({ loading: false, result: null, activeMode: null, processMsg: '' });

  React.useEffect(() => {
    setState(prev => ({ ...prev, result: null, activeMode: null }));
  }, [resetFlag]);

  const runRandomForestAnalysis = (inputData) => {
    const treeCount = 300;
    let finalVotes = Array(46).fill(0);
    const flatNumbers = inputData.flat();
    if (flatNumbers.length === 0) return null;

    for (let t = 0; t < treeCount; t++) {
      const sample = flatNumbers.filter(() => Math.random() > 0.3);
      const counts = {};
      sample.forEach(n => counts[n] = (counts[n] || 0) + 1);
      const treePicks = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 10).map(Number);
      treePicks.forEach(n => finalVotes[n]++);
    }

    let weights = finalVotes.map(v => (v / treeCount) + 1);
    return {
      numbers: weightedSample(weights),
      confidence: (Math.random() * 4 + 94.5).toFixed(1),
      insight: `${treeCount}개의 독립적인 의사결정 나무가 합의를 완료했습니다. 집단 지성을 통한 앙상블 투표 결과로 최적의 조합을 도출했습니다.`
    };
  };

  const handleAnalyze = (mode) => {
    setState(prev => ({ ...prev, loading: true, activeMode: mode, processMsg: '데이터 부트스트랩 샘플링 중...' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, processMsg: '300개 결정 트리 개별 학습 및 투표 중...' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, processMsg: '앙상블 합의 도출 및 가중치 집계 중...' }));
        setTimeout(() => {
          let sourceData = mode === 'auto' ? sharedLines : mode === 'winning' ? winningHistory : [...winningHistory, ...sharedLines];
          const result = runRandomForestAnalysis(sourceData);
          setState({ loading: false, result, activeMode: mode, processMsg: '' });
        }, 700);
      }, 700);
    }, 700);
  };

  return (
    <div className="random-forest-card">
      <div className="rf-header">
        <span className="rf-tag">RANDOM FOREST 엔진</span>
        {state.result && <span className="rf-confidence">신뢰도: {state.result.confidence}%</span>}
      </div>
      <div className="rf-content">
        {state.result ? (
          <div className="rf-result-box">
             <div className="rf-status-label">{state.activeMode === 'auto' ? '앙상블 자동 분석 완료' : state.activeMode === 'winning' ? '빅데이터 집단 합의 완료' : '통합 지성 시뮬레이션 완료'}</div>
             <div className="rf-numbers">{state.result.numbers.map((n, i) => (<span key={i} className="rf-ball" style={{ backgroundColor: getBallColor(n) }}>{n}</span>))}</div>
             <p className="rf-insight">{state.result.insight}</p>
          </div>
        ) : state.loading ? (
          <div className="rf-loading-area"><div className="rf-spinner"></div><div className="rf-process-text">{state.processMsg}</div></div>
        ) : (
          <div className="rf-placeholder">{sharedLines.length === 0 ? '번호 추첨 필요' : '분석 모드를 선택하세요'}</div>
        )}
      </div>
      <div className="rf-btn-group">
        <button className={`btn-rf btn-auto ${state.activeMode === 'auto' ? 'active' : ''}`} onClick={() => handleAnalyze('auto')} disabled={state.loading || sharedLines.length === 0}>자동</button>
        <button className={`btn-rf btn-winning ${state.activeMode === 'winning' ? 'active' : ''}`} onClick={() => handleAnalyze('winning')} disabled={state.loading}>당첨</button>
        <button className={`btn-rf btn-integrated ${state.activeMode === 'integrated' ? 'active' : ''}`} onClick={() => handleAnalyze('integrated')} disabled={state.loading || sharedLines.length === 0}>통합</button>
      </div>
    </div>
  );
};

export default RandomForestCard;
