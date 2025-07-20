import { gameState } from '../game/gameState.js';

// Input handling
export function initializeInput() {
  document.addEventListener('keydown', (e) => {
    if (gameState.screen === 'playing') {
      gameState.keys[e.key] = true;
      
      // Prevenir scroll quando pressiona espaço
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
      }
      
      if (e.key === 'Escape') {
        togglePause();
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
  });
}

export function initializeMouseInput() {
  gameState.canvas.addEventListener('mousemove', (e) => {
    const rect = gameState.canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
  });

  gameState.canvas.addEventListener('mousedown', () => {
    gameState.mouse.down = true;
  });

  gameState.canvas.addEventListener('mouseup', () => {
    gameState.mouse.down = false;
  });
}

export function togglePause() {
  if (gameState.screen === 'playing') {
    gameState.screen = 'paused';
    gameState.gameRunning = false;
    document.getElementById('pauseMenu').style.display = 'block';
  } else if (gameState.screen === 'paused') {
    gameState.screen = 'playing';
    gameState.gameRunning = true;
    document.getElementById('pauseMenu').style.display = 'none';
  }
}
