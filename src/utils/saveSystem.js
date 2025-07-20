import { gameState, enemies, projectiles, enemyProjectiles, pickups, thunderbolts, damageNumbers } from '../game/gameState.js';
import { player } from '../entities/player.js';

// Game state management
export function saveGame() {
  const gameData = {
    player: player,
    gameTime: gameState.gameTime,
    wave: gameState.wave,
    kills: gameState.kills,
    enemies: enemies,
    projectiles: projectiles,
    enemyProjectiles: enemyProjectiles,
    pickups: pickups,
    timestamp: Date.now()
  };
  
  localStorage.setItem('neonPlatformerSave', JSON.stringify(gameData));
  
  // Update statistics
  const stats = getGameStats();
  stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
  stats.totalKills = (stats.totalKills || 0) + gameState.kills;
  stats.totalTime = (stats.totalTime || 0) + Math.floor(gameState.gameTime / 1000);
  if (player.level > (stats.highestLevel || 0)) {
    stats.highestLevel = player.level;
  }
  
  localStorage.setItem('neonPlatformerStats', JSON.stringify(stats));
}

export function loadGame() {
  const saveData = localStorage.getItem('neonPlatformerSave');
  if (!saveData) return false;
  
  try {
    const gameData = JSON.parse(saveData);
    
    // Restore player state
    Object.assign(player, gameData.player);
    gameState.gameTime = gameData.gameTime;
    gameState.wave = gameData.wave;
    gameState.kills = gameData.kills;
    
    // Restore game objects
    enemies.length = 0;
    enemies.push(...gameData.enemies.map(e => {
      const Enemy = require('../entities/enemy.js').Enemy;
      const enemy = new Enemy(e.x, e.y, e.type);
      Object.assign(enemy, e);
      return enemy;
    }));
    
    Object.assign(projectiles, gameData.projectiles || []);
    Object.assign(enemyProjectiles, gameData.enemyProjectiles || []);
    Object.assign(pickups, gameData.pickups || []);
    
    return true;
  } catch (e) {
    console.error('Failed to load game:', e);
    return false;
  }
}

export function getGameStats() {
  const stats = localStorage.getItem('neonPlatformerStats');
  return stats ? JSON.parse(stats) : {};
}

export function clearGameData() {
  localStorage.removeItem('neonPlatformerSave');
  localStorage.removeItem('neonPlatformerStats');
  updateStatsDisplay();
}

export function updateStatsDisplay() {
  const stats = getGameStats();
  const statsContent = document.getElementById('statsContent');
  
  if (Object.keys(stats).length === 0) {
    statsContent.innerHTML = '<p style="color: #888;">Nenhum jogo jogado ainda</p>';
  } else {
    statsContent.innerHTML = `
      <div>Nível Mais Alto: <span style="color: #00ff00;">${stats.highestLevel || 0}</span></div>
      <div>Total de Mortes: <span style="color: #ff4444;">${stats.totalKills || 0}</span></div>
      <div>Tempo Total: <span style="color: #00ffff;">${formatTime(stats.totalTime || 0)}</span></div>
      <div>Jogos Jogados: <span style="color: #ffff00;">${stats.gamesPlayed || 0}</span></div>
    `;
  }
  
  // Show resume button if save exists
  const saveExists = localStorage.getItem('neonPlatformerSave');
  document.getElementById('resumeGame').style.display = saveExists ? 'inline-block' : 'none';
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
