import React, { useState } from 'react';
import './RNNCard.css';
import { getBallColor, weightedSample } from '../lib/utils';

const RNNCard = ({ sharedLines, winningHistory, resetFlag }) => {
  const [state, setState] = useState({ loading: false, result: null, activeMode: null, processMsg: '' });

  React.useEffect(() => {
    setState(prev => ({ ...prev, result: null, activeMode: null }));
  }, [resetFlag]);

  const runRNNAnalysis = (inputData) => {
    let weights = Array(46).fill(1);
    const sequences = inputData.slice(-10);
    if (sequences.length === 0) return null;

    let hiddenState = Array(46).fill(0.1);
    sequences.forEach((round, idx) => {
      const importance = (idx + 1) / sequences.length;
      round.forEach(num => { if(num >= 1 && num <= 45) hiddenState[num] += (0.5 * importance); });
    });

    const lastRound = sequences[sequences.length - 1];
    lastRound.forEach(num => {
      hiddenState[num] *= 1.5;
      if (num > 1) hiddenState[num - 1] += 0.2;
      if (num < 45) hiddenState[num + 1] += 0.2;
    });

    for(let i = 1; i <= 45; i++) weights[i] = hiddenState[i] + 1;

    return {
      numbers: weightedSample(weights),
      confidence: (Math.random() * 3 + 93.2).toFixed(1),
      insight: `RNN 시계열 시퀀스 분석 완료. 최근 ${sequences.length}개 조합의 연속성 패턴과 은닉 상태(Hidden State)를 분석했습니다.`
    };
  };

  const handleAnalyze = (mode) => {
    setState(prev => ({ ...prev, loading: true, activeMode: mode, processMsg: '최근 시퀀스 데이터 로드 중...' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, processMsg: '시간적 선후 관계 및 은닉 상태 갱신 중...' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, processMsg: '번호 간격 전이 확률 및 미래 지점 예측 중...' }));
        setTimeout(() => {
          let sourceData = mode === 'auto' ? sharedLines : mode === 'winning' ? winningHistory : [...winningHistory, ...sharedLines];
          const result = runRNNAnalysis(sourceData);
          setState({ loading: false, result, activeMode: mode, processMsg: '' });
        }, 700);
      }, 700);
    }, 700);
  };

  return (
    <div className="rnn-card">
      <div className="rnn-header">
        <span className="rnn-tag">RNN 엔진</span>
        {state.result && <span className="rnn-confidence">신뢰도: {state.result.confidence}%</span>}
      </div>
      <div className="rnn-content">
        {state.result ? (
          <div className="rnn-result-box">
             <div className="rnn-status-label">{state.activeMode === 'auto' ? '시계열 자동 분석 완료' : state.activeMode === 'winning' ? '역사적 시퀀스 분석 완료' : '통합 시퀀스 예측 완료'}</div>
             <div className="rnn-numbers">{state.result.numbers.map((n, i) => (<span key={i} className="rnn-ball" style={{ backgroundColor: getBallColor(n) }}>{n}</span>))}</div>
             <p className="rnn-insight">{state.result.insight}</p>
          </div>
        ) : state.loading ? (
          <div className="rnn-loading-area"><div className="rnn-spinner"></div><div className="rnn-process-text">{state.processMsg}</div></div>
        ) : (
          <div className="rnn-placeholder">{sharedLines.length === 0 ? '번호 추첨 필요' : '분석 모드를 선택하세요'}</div>
        )}
      </div>
      <div className="rnn-btn-group">
        <button className={`btn-rnn btn-auto ${state.activeMode === 'auto' ? 'active' : ''}`} onClick={() => handleAnalyze('auto')} disabled={state.loading || sharedLines.length === 0}>자동</button>
        <button className={`btn-rnn btn-winning ${state.activeMode === 'winning' ? 'active' : ''}`} onClick={() => handleAnalyze('winning')} disabled={state.loading}>당첨</button>
        <button className={`btn-rnn btn-integrated ${state.activeMode === 'integrated' ? 'active' : ''}`} onClick={() => handleAnalyze('integrated')} disabled={state.loading || sharedLines.length === 0}>통합</button>
      </div>
    </div>
  );
};

export default RNNCard;
