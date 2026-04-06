// src/utils/audioManager.js
export const playSFX = (url) => {
  const audio = new Audio(url);
  audio.volume = 0.5; // ปรับความดัง 0.0 - 1.0
  audio.play().catch(e => console.log("Audio play blocked"));
};

// สำหรับ BGM ที่ต้องเล่นวนลูป
let currentBGM = null;

export const playBGM = (url) => {
  if (currentBGM) {
    currentBGM.pause();
  }
  currentBGM = new Audio(url);
  currentBGM.loop = true;
  currentBGM.volume = 0.3;
  currentBGM.play().catch(e => console.log("BGM blocked by browser"));
};

export const stopBGM = () => {
  if (currentBGM) {
    currentBGM.pause();
    currentBGM = null;
  }
};