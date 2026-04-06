// สัญลักษณ์การ์ด
export const CARDS = {
  ROCK: { id: 'ROCK', beats: 'SCISSORS', label: 'ค้อน' },
  PAPER: { id: 'PAPER', beats: 'ROCK', label: 'กระดาษ' },
  SCISSORS: { id: 'SCISSORS', beats: 'PAPER', label: 'กรรไกร' }
};

// สุ่มการ์ด 10 ใบ
export const generateDeck = () => {
  const keys = Object.keys(CARDS);
  return Array.from({ length: 10 }, (_, i) => ({
    instanceId: i, // ID เฉพาะของการ์ดแต่ละใบ
    ...CARDS[keys[Math.floor(Math.random() * keys.length)]]
  }));
};

// เช็คผู้ชนะในแต่ละหมัด
export const checkRoundWinner = (cardA, cardB) => {
  if (cardA.id === cardB.id) return 'DRAW';
  return cardA.beats === cardB.id ? 'PLAYER' : 'BOT';
};