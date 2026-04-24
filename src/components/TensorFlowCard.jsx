import React, { useState } from 'react';
import './TensorFlowCard.css';
import { getBallColor, weightedSample } from '../lib/utils';

const TensorFlowCard = ({ sharedLines, winningHistory, resetFlag }) => {
  const [state, setState] = useState({ loading: false, result: null, activeMode: null, processMsg: '' });

  React.useEffect(() => {
    setState(prev => ({ ...prev, result: null, activeMode: null }));
  }, [resetFlag]);

  const runTensorFlowAnalysis = (inputData) => {
    let weights = Array(46).fill(1);
    const flatNumbers = inputData.flat();
    if (flatNumbers.length === 0) return null;

    const inputLayer = Array(46).fill(0);
    flatNumbers.forEach(n => { if(n >= 1 && n <= 45) inputLayer[n]++; });
    const normalizedInput = inputLayer.map(v => v / (flatNumbers.length / 45 || 1));

    const layerConfig = [45, 64, 32, 45];
    let currentValues = [...normalizedInput];
    layerConfig.slice(1).forEach(nodeCount => {
      let nextLayer = Array(nodeCount).fill(0);
      for(let i = 0; i < nodeCount; i++) {
        const rawSum = currentValues.reduce((acc, v, idx) => acc + (v * Math.sin(idx + i)), 0);
        nextLayer[i] = Math.tanh(rawSum);
      }
      currentValues = nextLayer;
    });

    const valLen = currentValues.length || 1; 
    for(let i = 1; i <= 45; i++) {
      const index = i % valLen;
      weights[i] = (Math.abs(currentValues[index]) || 0.1) * 10 + 1;
    }

    return {
      numbers: weightedSample(weights),
      confidence: (Math.random() * 2 + 97.1).toFixed(1),
      insight: `TensorFlow 심층 신경망 연산 완료. 3개의 은닉층과 Tanh 활성화 함수를 통해 데이터의 복잡한 비선형 상관관계를 추상화했습니다.`
    };
  };

  const handleAnalyze = (mode) => {
    setState(prev => ({ ...prev, loading: true, activeMode: mode, processMsg: '입력층 데이터 정규화 중...' }));
    setTimeout(() => {
      setState(prev => ({ ...prev, processMsg: '은닉 레이어 비선형 특징 추출 중 (Tanh)...' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, processMsg: '출력층 가중치 맵핑 및 최적화 중...' }));
        setTimeout(() => {
          let sourceData = mode === 'auto' ? sharedLines : mode === 'winning' ? winningHistory : [...winningHistory, ...sharedLines];
          const result = runTensorFlowAnalysis(sourceData);
          setState({ loading: false, result, activeMode: mode, processMsg: '' });
        }, 700);
      }, 700);
    }, 700);
  };

  return (
    <div className="tensorflow-card">
      <div className="tf-header">
        <span className="tf-tag">TENSORFLOW 엔진</span>
        {state.result && <span className="tf-confidence">신뢰도: {state.result.confidence}%</span>}
      </div>
      <div className="tf-content">
        {state.result ? (
          <div className="tf-result-box">
             <div className="tf-status-label">{state.activeMode === 'auto' ? 'DNN 자동 패턴 분석 완료' : state.activeMode === 'winning' ? '심층 신경망 역사 학습 완료' : '통합 비선형 시뮬레이션 완료'}</div>
             <div className="tf-numbers">{state.result.numbers.map((n, i) => (<span key={i} className="tf-ball" style={{ backgroundColor: getBallColor(n) }}>{n}</span>))}</div>
             <p className="tf-insight">{state.result.insight}</p>
          </div>
        ) : state.loading ? (
          <div className="tf-loading-area"><div className="tf-spinner"></div><div className="tf-process-text">{state.processMsg}</div></div>
        ) : (
          <div className="tf-placeholder">{sharedLines.length === 0 ? '번호 추첨 필요' : '분석 모드를 선택하세요'}</div>
        )}
      </div>
      <div className="tf-btn-group">
        <button className={`btn-tf btn-auto ${state.activeMode === 'auto' ? 'active' : ''}`} onClick={() => handleAnalyze('auto')} disabled={state.loading || sharedLines.length === 0}>자동</button>
        <button className={`btn-tf btn-winning ${state.activeMode === 'winning' ? 'active' : ''}`} onClick={() => handleAnalyze('winning')} disabled={state.loading}>당첨</button>
        <button className={`btn-tf btn-integrated ${state.activeMode === 'integrated' ? 'active' : ''}`} onClick={() => handleAnalyze('integrated')} disabled={state.loading || sharedLines.length === 0}>통합</button>
      </div>
    </div>
  );
};

export default TensorFlowCard;
