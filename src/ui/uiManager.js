import { gameState, enemies, projectiles, enemyProjectiles, pickups, thunderbolts, damageNumbers } from '../game/gameState.js';
import { player } from '../entities/player.js';
import { formatTime } from '../utils/saveSystem.js';

// Update UI
export function updateUI() {
  // HP Bar
  document.getElementById('hpText').textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
  document.getElementById('hpBar').style.width = `${(player.hp / player.maxHp) * 100}%`;
  
  // EXP Bar
  document.getElementById('levelText').textContent = player.level;
  document.getElementById('expText').textContent = `${player.exp}/${player.expToNext}`;
  document.getElementById('expBar').style.width = `${(player.exp / player.expToNext) * 100}%`;
  
  // Game Stats
  document.getElementById('enemyCount').textContent = enemies.length;
  document.getElementById('killCount').textContent = gameState.kills;
  document.getElementById('gameTime').textContent = formatTime(Math.floor(gameState.gameTime / 1000));
  document.getElementById('waveNumber').textContent = gameState.wave;
}

export function drawGameOverScreen() {
  // Show detailed game over overlay
  showGameOverOverlay();
}

export function showGameOverOverlay() {
  // Create or update game over overlay
  let gameOverOverlay = document.getElementById('gameOverOverlay');
  if (!gameOverOverlay) {
    gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'gameOverOverlay';
    gameOverOverlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center;
      z-index: 2000; font-family: 'Courier New', monospace;
    `;
    document.getElementById('gameContainer').appendChild(gameOverOverlay);
  }
  
  const timePlayed = formatTime(Math.floor(gameState.gameTime / 1000));
  const damageDealt = Math.round(player.totalDamageDealt || 0);
  const damageTaken = Math.round(player.totalDamageTaken || 0);
  const projectilesFired = player.projectilesFired || 0;
  const accuracy = projectilesFired > 0 ? Math.round((player.projectileHits || 0) / projectilesFired * 100) : 0;
  
  gameOverOverlay.innerHTML = `
    <div style="background: linear-gradient(135deg, #1a0000, #330000); padding: 40px; border-radius: 20px; 
                text-align: center; border: 3px solid #ff0000; box-shadow: 0 0 40px rgba(255,0,0,0.7);
                max-width: 600px; color: #fff;">
      
      <h1 style="color: #ff0000; font-size: 3rem; margin: 0 0 20px 0; text-shadow: 0 0 20px #ff0000;">
        GAME OVER
      </h1>
      
      <div style="background: rgba(0,0,0,0.5); padding: 25px; border-radius: 15px; margin: 20px 0;
                  border: 2px solid #ff4444;">
        <h2 style="color: #ffaa00; margin-top: 0; font-size: 1.5rem;">Estatísticas da Partida</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: left; 
                    font-size: 1.1rem; line-height: 1.6;">
          <div>
            <div style="color: #00ffff;">Personagem: <span style="color: ${player.typeColor || '#fff'}">${player.typeName || 'Unknown'}</span></div>
            <div style="color: #00ffff;">Level Alcançado: <span style="color: #fff">${player.level}</span></div>
            <div style="color: #00ffff;">Inimigos Mortos: <span style="color: #fff">${gameState.kills}</span></div>
            <div style="color: #00ffff;">Tempo Sobrevivido: <span style="color: #fff">${timePlayed}</span></div>
            <div style="color: #00ffff;">Wave Alcançada: <span style="color: #fff">${gameState.wave}</span></div>
          </div>
          <div>
            <div style="color: #ff6600;">Dano Causado: <span style="color: #fff">${damageDealt}</span></div>
            <div style="color: #ff6600;">Dano Recebido: <span style="color: #fff">${damageTaken}</span></div>
            <div style="color: #ff6600;">Projéteis Disparados: <span style="color: #fff">${projectilesFired}</span></div>
            <div style="color: #ff6600;">Precisão: <span style="color: #fff">${accuracy}%</span></div>
            <div style="color: #ff6600;">HP Final: <span style="color: #fff">0/${player.maxHp}</span></div>
          </div>
        </div>
      </div>
      
      <div style="display: flex; gap: 20px; justify-content: center; margin-top: 30px;">
        <button id="playAgainBtn" style="padding: 15px 30px; font-size: 1.2rem; 
                background: linear-gradient(45deg, #00ff00, #00aa00); border: none; border-radius: 8px; 
                color: #000; cursor: pointer; font-weight: bold; font-family: inherit;
                box-shadow: 0 0 20px rgba(0,255,0,0.5); transition: all 0.3s;">
          JOGAR NOVAMENTE
        </button>
        <button id="backToMenuBtn" style="padding: 15px 30px; font-size: 1.2rem; 
                background: linear-gradient(45deg, #ff6600, #cc4400); border: none; border-radius: 8px; 
                color: #fff; cursor: pointer; font-weight: bold; font-family: inherit;
                box-shadow: 0 0 20px rgba(255,102,0,0.5); transition: all 0.3s;">
          MENU INICIAL
        </button>
      </div>
      
      <div style="margin-top: 20px; color: #888; font-size: 0.9rem;">
        <p>Use os botões acima ou pressione ESC para o menu</p>
      </div>
    </div>
  `;
  
  // Add button event listeners
  document.getElementById('playAgainBtn').onclick = () => {
    hideGameOverOverlay();
    window.restartWithSameCharacter();
  };
  
  document.getElementById('backToMenuBtn').onclick = () => {
    hideGameOverOverlay();
    window.quitToMenu();
  };
  
  // Add hover effects
  document.querySelectorAll('#gameOverOverlay button').forEach(btn => {
    btn.onmouseenter = () => {
      btn.style.transform = 'translateY(-3px) scale(1.05)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'translateY(0) scale(1)';
    };
  });
  
  gameOverOverlay.style.display = 'flex';
}

export function hideGameOverOverlay() {
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  if (gameOverOverlay) {
    gameOverOverlay.style.display = 'none';
  }
}

export function drawDamageNumbers() {
  damageNumbers.forEach((dmg, index) => {
    dmg.y += dmg.vy;
    dmg.life--;
    
    gameState.ctx.fillStyle = dmg.color;
    gameState.ctx.font = '14px Arial';
    gameState.ctx.textAlign = 'center';
    gameState.ctx.globalAlpha = dmg.life / 60;
    gameState.ctx.fillText(dmg.damage.toString(), dmg.x, dmg.y);
    gameState.ctx.globalAlpha = 1;
    
    if (dmg.life <= 0) {
      damageNumbers.splice(index, 1);
    }
  });
}
