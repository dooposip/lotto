/**
 * Lotto AI Factory - 공통 유틸리티 함수
 */

// 1. 번호 대역별 공식 로또 공 색상 반환
export const getBallColor = (num) => {
  if (num <= 10) return '#fbc400'; // 노랑
  if (num <= 20) return '#69c8f2'; // 파랑
  if (num <= 30) return '#ff7272'; // 빨강
  if (num <= 40) return '#aaaaaa'; // 회색
  return '#b0d840'; // 초록
};

// 2. 가중치 기반 확률적 번호 샘플링 (중복 없는 6개 추출)
export const weightedSample = (weights, size = 6) => {
  const result = [];
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const w = [...weights.slice(1)]; // 1~45번 가중치만 추출

  while (result.length < size) {
    const totalW = w.reduce((a, b) => a + b, 0);
    if (totalW <= 0) break;

    let r = Math.random() * totalW;
    for (let i = 0; i < pool.length; i++) {
      if (r < w[i]) {
        if (!result.includes(pool[i])) {
          result.push(pool[i]);
        }
        break;
      }
      r -= w[i];
    }
  }
  return result.sort((a, b) => a - b);
};
