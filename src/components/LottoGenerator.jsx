import React, { useState } from 'react';
import './LottoGenerator.css';

const LottoGenerator = ({ onGenerated }) => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRandomNumbers = () => {
    const newLines = [];
    for (let i = 0; i < 10; i++) {
      const line = new Set();
      while (line.size < 6) {
        line.add(Math.floor(Math.random() * 45) + 1);
      }
      newLines.push([...line].sort((a, b) => a - b));
    }
    return newLines;
  };

  const handleDraw = () => {
    setLoading(true);
    setTimeout(() => {
      const result = generateRandomNumbers();
      setLines(result);
      setLoading(false);
      if (onGenerated) onGenerated(result);
    }, 800);
  };

  return (
    <section className="lotto-generator-container">
      <div className="draw-panel">
        <button 
          className="mega-draw-btn" 
          onClick={handleDraw} 
          disabled={loading}
        >
          {loading ? '데이터 생성 중...' : lines.length > 0 ? '전체 번호 다시 생성하기' : '자동 추천 번호 10줄 생성'}
        </button>
        
        <div className="generated-lines-area">
          {lines.length > 0 ? (
            <div className="lines-grid-compact">
              {lines.map((line, idx) => (
                <div key={idx} className="line-item">
                  <span className="l-idx">{idx + 1}</span>
                  <div className="l-balls">
                    {line.map((n, i) => (
                      <span key={i}>{n}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-notice">
              상단 버튼을 눌러 분석의 기초가 될 10줄을 먼저 생성하세요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LottoGenerator;
