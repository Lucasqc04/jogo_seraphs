import { gameState, enemies, projectiles, enemyProjectiles, pickups, thunderbolts, resetGameArrays } from './src/game/gameState.js';
import { platforms, getGroundLevel, isUnderground } from './src/game/platforms.js';
import { player } from './src/entities/player.js';
import { Enemy } from './src/entities/enemy.js';
import { playerTypes, applyPlayerType } from './src/entities/playerTypes.js';
import { initializeInput, initializeMouseInput, togglePause } from './src/input/inputHandler.js';
import { saveGame, loadGame, updateStatsDisplay, clearGameData, formatTime } from './src/utils/saveSystem.js';
import { updateUI, drawGameOverScreen, drawDamageNumbers, hideGameOverOverlay } from './src/ui/uiManager.js';

// Helper function to destroy enemy and give rewards
function destroyEnemy(enemy) {
  const index = enemies.indexOf(enemy);
  if (index > -1) {
    enemies.splice(index, 1);
    player.exp += enemy.expReward || 10;
    player.kills++;
    
    // Check for level up
    if (player.exp >= player.expToNext) {
      player.levelUp();
    }
    
    // Chance for pickup
    if (Math.random() < 0.1) {
      pickups.push({
        x: enemy.x + enemy.width/2,
        y: enemy.y + enemy.height/2,
        type: Math.random() < 0.5 ? 'health' : 'exp',
        time: Date.now()
      });
    }
  }
}

// HTML Template
document.getElementById('app').innerHTML = `
  <div id="gameContainer" style="position: relative; width: 100vw; height: 100vh; background: #000; overflow: hidden; font-family: 'Courier New', monospace;">
    <!-- Start Screen -->
    <div id="startScreen" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, #000428, #004e92); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1000;">
      <div style="text-align: center; color: #00ffff; text-shadow: 0 0 20px #00ffff;">
        <h1 style="font-size: 4rem; margin: 0; text-shadow: 0 0 30px #00ffff;">NEON PLATFORMER</h1>
        <p style="font-size: 1.2rem; margin: 20px 0; opacity: 0.8;">Survive the endless waves</p>
        
        <div id="gameStats" style="background: rgba(0,0,0,0.7); padding: 20px; border-radius: 10px; margin: 30px 0; border: 2px solid #00ffff; box-shadow: 0 0 20px rgba(0,255,255,0.3);">
          <h3 style="color: #ffff00; margin-top: 0;">Game Statistics</h3>
          <div id="statsContent" style="color: #ffffff; line-height: 1.6;"></div>
        </div>
        
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          <button id="startNewGame" style="padding: 15px 30px; font-size: 1.2rem; background: linear-gradient(45deg, #00ff00, #00aa00); border: none; border-radius: 5px; color: #000; cursor: pointer; font-weight: bold; box-shadow: 0 0 15px rgba(0,255,0,0.5); transition: all 0.3s;">START NEW GAME</button>
          <button id="resumeGame" style="padding: 15px 30px; font-size: 1.2rem; background: linear-gradient(45deg, #ffff00, #aaaa00); border: none; border-radius: 5px; color: #000; cursor: pointer; font-weight: bold; box-shadow: 0 0 15px rgba(255,255,0,0.5); transition: all 0.3s; display: none;">RESUME GAME</button>
          <button id="openWiki" style="padding: 15px 30px; font-size: 1.2rem; background: linear-gradient(45deg, #00ffff, #0088aa); border: none; border-radius: 5px; color: #000; cursor: pointer; font-weight: bold; box-shadow: 0 0 15px rgba(0,255,255,0.5); transition: all 0.3s;">📖 WIKI</button>
          <button id="clearHistory" style="padding: 15px 30px; font-size: 1.2rem; background: linear-gradient(45deg, #ff0000, #aa0000); border: none; border-radius: 5px; color: #fff; cursor: pointer; font-weight: bold; box-shadow: 0 0 15px rgba(255,0,0,0.5); transition: all 0.3s;">CLEAR HISTORY</button>
        </div>
        
        <div style="margin-top: 30px; color: #888; font-size: 0.9rem;">
          <p>Controls: A/D - Move | Space - Jump | Mouse - Aim & Shoot | ESC - Pause</p>
        </div>
      </div>
    </div>
    
    <!-- Character Selection Screen -->
    <div id="characterScreen" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(45deg, #001122, #003366); display: none; flex-direction: column; justify-content: center; align-items: center; z-index: 1001;">
      <div style="text-align: center; color: #00ffff; text-shadow: 0 0 20px #00ffff;">
        <h1 style="font-size: 3rem; margin: 0; text-shadow: 0 0 30px #00ffff;">ESCOLHA SEU PERSONAGEM</h1>
        <p style="font-size: 1.2rem; margin: 20px 0; opacity: 0.8;">Cada tipo tem características únicas</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; justify-content: center; margin: 40px 0; max-width: 800px;">
          <div id="selectSpeedster" class="character-card" style="background: linear-gradient(135deg, #001a2e, #003366); padding: 25px; border-radius: 15px; border: 3px solid #00ffff; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(0,255,255,0.3);">
            <div style="width: 60px; height: 60px; background: #00ffff; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 0 20px #00ffff;"></div>
            <h3 style="color: #00ffff; margin: 10px 0; font-size: 1.2rem;">SPEEDSTER</h3>
            <p style="color: #aaffff; margin: 10px 0; font-size: 0.9rem;">Rápido e ágil</p>
            <div style="text-align: left; font-size: 0.8rem; color: #88ccff;">
              <div>• Velocidade: ★★★★☆</div>
              <div>• Dano: ★★★☆☆</div>
              <div>• Vel. Tiro: ★★★★☆</div>
              <div>• HP: ★★★☆☆</div>
            </div>
          </div>
          
          <div id="selectHeavy" class="character-card" style="background: linear-gradient(135deg, #2e1a00, #663300); padding: 25px; border-radius: 15px; border: 3px solid #ff6600; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(255,102,0,0.3);">
            <div style="width: 60px; height: 60px; background: #ff6600; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 0 20px #ff6600;"></div>
            <h3 style="color: #ff6600; margin: 10px 0; font-size: 1.2rem;">HEAVY GUNNER</h3>
            <p style="color: #ffaa66; margin: 10px 0; font-size: 0.9rem;">Lento mas poderoso</p>
            <div style="text-align: left; font-size: 0.8rem; color: #cc8844;">
              <div>• Velocidade: ★★☆☆☆</div>
              <div>• Dano: ★★★★★</div>
              <div>• Vel. Tiro: ★★☆☆☆</div>
              <div>• HP: ★★★★☆</div>
            </div>
          </div>
          
          <div id="selectMystic" class="character-card" style="background: linear-gradient(135deg, #2e002e, #660066); padding: 25px; border-radius: 15px; border: 3px solid #ff00ff; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(255,0,255,0.3);">
            <div style="width: 60px; height: 60px; background: #ff00ff; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 0 20px #ff00ff;"></div>
            <h3 style="color: #ff00ff; margin: 10px 0; font-size: 1.2rem;">MYSTIC</h3>
            <p style="color: #ffaaff; margin: 10px 0; font-size: 0.9rem;">Fraco + Lendário</p>
            <div style="text-align: left; font-size: 0.8rem; color: #cc88cc;">
              <div>• Velocidade: ★★☆☆☆</div>
              <div>• Dano: ★★☆☆☆</div>
              <div>• Vel. Tiro: ★★☆☆☆</div>
              <div>• HP: ★★☆☆☆</div>
              <div style="color: #ffaa00;">• Upgrade Lendário!</div>
            </div>
          </div>
          
          <div id="selectVeteran" class="character-card" style="background: linear-gradient(135deg, #002e00, #006600); padding: 25px; border-radius: 15px; border: 3px solid #00ff00; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(0,255,0,0.3);">
            <div style="width: 60px; height: 60px; background: #00ff00; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 0 20px #00ff00;"></div>
            <h3 style="color: #00ff00; margin: 10px 0; font-size: 1.2rem;">VETERAN</h3>
            <p style="color: #aaffaa; margin: 10px 0; font-size: 0.9rem;">Fraco + Múltiplos</p>
            <div style="text-align: left; font-size: 0.8rem; color: #88cc88;">
              <div>• Velocidade: ★★☆☆☆</div>
              <div>• Dano: ★★☆☆☆</div>
              <div>• Vel. Tiro: ★★★☆☆</div>
              <div>• HP: ★★★☆☆</div>
              <div style="color: #ffaa00;">• 3 Upgrades!</div>
            </div>
          </div>
        </div>
        
        <button id="backToMenu" style="padding: 10px 20px; font-size: 1rem; background: linear-gradient(45deg, #666, #999); border: none; border-radius: 5px; color: #fff; cursor: pointer; font-weight: bold; margin-top: 20px;">VOLTAR</button>
      </div>
    </div>
    
    <!-- Game Canvas -->
    <canvas id="gameCanvas" width="1200" height="700" style="display: none; background: #000; border: 2px solid #333; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></canvas>
    
    <!-- Game UI Overlay -->
    <div id="gameUI" style="position: absolute; top: 0; left: 0; pointer-events: none; z-index: 100; display: none;">
      <!-- HP Bar -->
      <div style="position: absolute; top: 20px; left: 20px; width: 250px;">
        <div style="background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; border: 1px solid #00ffff;">
          <div style="color: #ff0000; font-size: 14px; margin-bottom: 5px;">HP: <span id="hpText">100/100</span></div>
          <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden;">
            <div id="hpBar" style="background: linear-gradient(90deg, #ff0000, #ff4444); height: 100%; width: 100%; transition: width 0.3s; box-shadow: 0 0 10px #ff0000;"></div>
          </div>
        </div>
      </div>
      
      <!-- EXP Bar -->
      <div style="position: absolute; top: 80px; left: 20px; width: 250px;">
        <div style="background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; border: 1px solid #ffff00;">
          <div style="color: #ffff00; font-size: 14px; margin-bottom: 5px;">Level <span id="levelText">1</span> - EXP: <span id="expText">0/100</span></div>
          <div style="background: #333; height: 15px; border-radius: 8px; overflow: hidden;">
            <div id="expBar" style="background: linear-gradient(90deg, #ffff00, #ffaa00); height: 100%; width: 0%; transition: width 0.3s; box-shadow: 0 0 8px #ffff00;"></div>
          </div>
        </div>
      </div>
      
      <!-- Game Stats -->
      <div style="position: absolute; top: 20px; right: 20px;">
        <div style="background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; border: 1px solid #00ff00; color: #00ff00; font-size: 14px; line-height: 1.5;">
          <div>Enemies: <span id="enemyCount">0</span></div>
          <div>Kills: <span id="killCount">0</span></div>
          <div>Time: <span id="gameTime">0:00</span></div>
          <div>Wave: <span id="waveNumber">1</span></div>
        </div>
      </div>
    </div>
    
    <!-- Pause Menu -->
    <div id="pauseMenu" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 1000;">
      <div style="background: linear-gradient(45deg, #001122, #003366); padding: 40px; border-radius: 15px; text-align: center; border: 2px solid #00ffff; box-shadow: 0 0 30px rgba(0,255,255,0.5);">
        <h2 style="color: #00ffff; margin-top: 0; text-shadow: 0 0 10px #00ffff;">PAUSED</h2>
        <div style="margin: 30px 0;">
          <button id="resumeBtn" style="display: block; margin: 10px auto; padding: 12px 25px; background: linear-gradient(45deg, #00ff00, #00aa00); border: none; border-radius: 5px; color: #000; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 0 10px rgba(0,255,0,0.5);">Resume</button>
          <button id="saveQuitBtn" style="display: block; margin: 10px auto; padding: 12px 25px; background: linear-gradient(45deg, #ff6600, #cc4400); border: none; border-radius: 5px; color: #fff; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 0 10px rgba(255,102,0,0.5);">Save & Quit</button>
        </div>
      </div>
    </div>
    
    <!-- Upgrade Menu -->
    <div id="upgradeMenu" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: none; justify-content: center; align-items: center; z-index: 1000;">
      <div style="background: linear-gradient(45deg, #1a1a2e, #16213e); padding: 30px; border-radius: 15px; text-align: center; border: 2px solid #ffff00; box-shadow: 0 0 30px rgba(255,255,0,0.5);">
        <h2 style="color: #ffff00; margin-top: 0; text-shadow: 0 0 15px #ffff00;">LEVEL UP!</h2>
        <p style="color: #fff; margin-bottom: 30px;">Choose an upgrade:</p>
        <div id="upgradeOptions" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; max-width: 600px;"></div>
      </div>
    </div>
  </div>
`;

// Game initialization and core functions
function initGame() {
  gameState.canvas = document.getElementById('gameCanvas');
  gameState.ctx = gameState.canvas.getContext('2d');
  
  // Initialize input systems
  initializeInput();
  initializeMouseInput(gameState.canvas);
  
  // UI event handlers
  document.getElementById('startNewGame').onclick = showCharacterSelection;
  document.getElementById('resumeGame').onclick = resumeGame;
  document.getElementById('openWiki').onclick = () => {
    window.open('wiki-dynamic.html', '_blank');
  };
  document.getElementById('clearHistory').onclick = () => {
    if (confirm('Clear all game history?')) {
      clearGameData();
    }
  };
  
  // Character selection handlers
  document.getElementById('selectSpeedster').onclick = async () => await startNewGameWithCharacter('speedster');
  document.getElementById('selectHeavy').onclick = async () => await startNewGameWithCharacter('heavy');
  document.getElementById('selectMystic').onclick = async () => await startNewGameWithCharacter('mystic');
  document.getElementById('selectVeteran').onclick = async () => await startNewGameWithCharacter('veteran');
  document.getElementById('backToMenu').onclick = hideCharacterSelection;
  
  // Character card hover effects
  document.querySelectorAll('.character-card').forEach(card => {
    card.onmouseenter = () => {
      card.style.transform = 'translateY(-5px) scale(1.05)';
      let shadowColor = 'rgba(255,255,255,0.6)';
      if (card.id.includes('Speedster')) shadowColor = 'rgba(0,255,255,0.6)';
      else if (card.id.includes('Heavy')) shadowColor = 'rgba(255,102,0,0.6)';
      else if (card.id.includes('Mystic')) shadowColor = 'rgba(255,0,255,0.6)';
      else if (card.id.includes('Veteran')) shadowColor = 'rgba(0,255,0,0.6)';
      card.style.boxShadow = `0 15px 35px ${shadowColor}`;
    };
    card.onmouseleave = () => {
      card.style.transform = 'translateY(0) scale(1)';
      let shadowColor = 'rgba(255,255,255,0.3)';
      if (card.id.includes('Speedster')) shadowColor = 'rgba(0,255,255,0.3)';
      else if (card.id.includes('Heavy')) shadowColor = 'rgba(255,102,0,0.3)';
      else if (card.id.includes('Mystic')) shadowColor = 'rgba(255,0,255,0.3)';
      else if (card.id.includes('Veteran')) shadowColor = 'rgba(0,255,0,0.3)';
      card.style.boxShadow = `0 0 20px ${shadowColor}`;
    };
  });
  
  document.getElementById('resumeBtn').onclick = () => togglePause();
  document.getElementById('saveQuitBtn').onclick = () => {
    saveGame();
    quitToMenu();
  };
  
  // Auto-pause when tab loses focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState.screen === 'playing') {
      togglePause();
    }
  });
  
  updateStatsDisplay();
}

function showCharacterSelection() {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('characterScreen').style.display = 'flex';
}

function hideCharacterSelection() {
  document.getElementById('characterScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
}

async function startNewGameWithCharacter(characterType) {
  // Apply character type to player
  await applyPlayerType(player, characterType);
  
  // Reset other player stats
  Object.assign(player, {
    x: 100, y: 400, width: 30, height: 40,
    vx: 0, vy: 0, onGround: false, jumps: 0, maxJumps: 1,
    exp: 0, level: 1, expToNext: 60, invulnerable: false, invulnTime: 500,
    lastInvuln: 0, critChance: 0, critDamage: 1, defense: 0, soulDropChance: 0,
    projectileHits: 1, projectileSize: 1, fragmentation: 0,
    friction: 0, distanceRun: 0, lastX: 100, lifeSteal: 0,
    luck: 0, healingOrbChance: 0, rage: false, regrowth: false,
    thunderbolt: 0, lastThunder: 0, upgradeChoices: 3,
    barrier: false, lastBarrier: 0, cold: false, focus: false,
    focusTime: 0, bodyDamage: 0, tome: false, wisps: 0,
    wound: false, revives: 0, shielded: false,
    // Resetar estatísticas de tracking
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    projectilesFired: 0,
    projectileHits: 0,
    // Preservar as estatísticas do tipo de personagem
    selectedType: player.selectedType,
    typeName: player.typeName,
    typeColor: player.typeColor,
    speed: player.speed,
    jumpPower: player.jumpPower,
    projectileDamage: player.projectileDamage,
    attackSpeed: player.attackSpeed,
    hp: player.hp,
    maxHp: player.maxHp
  });
  
  // Reset game state
  gameState.gameTime = 0;
  gameState.startTime = Date.now();
  gameState.wave = 1;
  gameState.kills = 0;
  gameState.lastShot = 0;
  gameState.lastSave = Date.now();
  
  // Clear arrays
  resetGameArrays();
  
  // Hide character selection and start game
  document.getElementById('characterScreen').style.display = 'none';
  
  // Verificar se deve mostrar menus de upgrade iniciais
  if (player.showStartingUpgradeMenus) {
    gameState.pendingStartingUpgrades = [...player.showStartingUpgradeMenus];
    player.showStartingUpgradeMenus = null;
  }
  
  startGame();
}

function startNewGame() {
  // Esta função agora só é chamada para resume
  // Reset game state
  gameState.gameTime = 0;
  gameState.startTime = Date.now();
  gameState.wave = 1;
  gameState.kills = 0;
  gameState.lastShot = 0;
  gameState.lastSave = Date.now();
  
  // Clear arrays
  resetGameArrays();
  
  startGame();
}

function startGame() {
  gameState.screen = 'playing';
  gameState.gameRunning = true;
  
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('characterScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('gameUI').style.display = 'block';
  
  // Se há upgrades iniciais pendentes, mostrar o primeiro menu
  if (gameState.pendingStartingUpgrades && gameState.pendingStartingUpgrades.length > 0) {
    setTimeout(() => {
      showStartingUpgradeMenu();
    }, 500); // Pequeno delay para a transição
  }
  
  gameLoop();
}

function resumeGame() {
  if (loadGame()) {
    startGame();
  } else {
    alert('No saved game found!');
  }
}

function quitToMenu() {
  gameState.screen = 'start';
  gameState.gameRunning = false;
  
  document.getElementById('startScreen').style.display = 'flex';
  document.getElementById('characterScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('gameUI').style.display = 'none';
  document.getElementById('pauseMenu').style.display = 'none';
  document.getElementById('upgradeMenu').style.display = 'none';
  
  updateStatsDisplay();
}

// Função para mostrar menus de upgrade iniciais
async function showStartingUpgradeMenu() {
  if (!gameState.pendingStartingUpgrades || gameState.pendingStartingUpgrades.length === 0) {
    return;
  }
  
  const currentRarity = gameState.pendingStartingUpgrades.shift();
  const { upgrades } = await import('./src/game/upgrades.js');
  
  let availableUpgrades;
  let menuTitle;
  let numChoices;
  
  if (currentRarity === 'legendary') {
    availableUpgrades = upgrades.filter(u => u.rarity === 'legendary');
    menuTitle = 'ESCOLHA SEU PODER LENDÁRIO!';
    numChoices = Math.min(4, availableUpgrades.length);
  } else {
    availableUpgrades = upgrades.filter(u => u.rarity === currentRarity);
    menuTitle = `ESCOLHA SEU UPGRADE ${currentRarity.toUpperCase()}!`;
    numChoices = Math.min(3, availableUpgrades.length);
  }
  
  // Embaralhar e pegar as opções
  const shuffled = [...availableUpgrades].sort(() => 0.5 - Math.random());
  const options = shuffled.slice(0, numChoices);
  
  // Parar o jogo
  gameState.gameRunning = false;
  
  // Mostrar menu
  const upgradeMenu = document.getElementById('upgradeMenu');
  const upgradeTitle = upgradeMenu.querySelector('h2');
  const upgradeOptions = document.getElementById('upgradeOptions');
  
  upgradeTitle.textContent = menuTitle;
  upgradeOptions.innerHTML = '';
  
  options.forEach((upgrade, index) => {
    const rarityColors = {
      common: '#ffffff',
      uncommon: '#00ff00', 
      rare: '#0099ff',
      legendary: '#ff6600'
    };
    
    const button = document.createElement('button');
    button.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: ${rarityColors[upgrade.rarity]}; margin: 0 0 10px 0;">${upgrade.name}</h3>
        <p style="margin: 0; font-size: 0.9rem;">${upgrade.desc}</p>
      </div>
    `;
    button.style.cssText = `
      padding: 15px; background: linear-gradient(135deg, #1a1a2e, #16213e); 
      border: 2px solid ${rarityColors[upgrade.rarity]}; border-radius: 10px; 
      color: #fff; cursor: pointer; font-family: inherit; 
      box-shadow: 0 0 15px ${rarityColors[upgrade.rarity]}40; transition: all 0.3s;
      min-width: 180px; max-width: 250px;
    `;
    
    button.onmouseenter = () => {
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = `0 0 25px ${rarityColors[upgrade.rarity]}80`;
    };
    button.onmouseleave = () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = `0 0 15px ${rarityColors[upgrade.rarity]}40`;
    };
    
    button.onclick = () => {
      // Aplicar upgrade
      upgrade.effect(player);
      
      // Fechar menu
      upgradeMenu.style.display = 'none';
      
      // Verificar se há mais upgrades pendentes
      if (gameState.pendingStartingUpgrades && gameState.pendingStartingUpgrades.length > 0) {
        setTimeout(() => {
          showStartingUpgradeMenu();
        }, 300);
      } else {
        // Todos os upgrades foram aplicados, continuar o jogo
        gameState.gameRunning = true;
      }
    };
    
    upgradeOptions.appendChild(button);
  });
  
  upgradeMenu.style.display = 'flex';
}

// Game loop
function gameLoop() {
  if (!gameState.gameRunning) {
    requestAnimationFrame(gameLoop);
    return;
  }

  gameState.gameTime += 16;
  
  // Auto-save every 30 seconds
  if (Date.now() - gameState.lastSave > 30000) {
    saveGame();
    gameState.lastSave = Date.now();
  }
  
  // Clear canvas
  gameState.ctx.fillStyle = '#000000';
  gameState.ctx.fillRect(0, 0, 1200, 700);
  
  // Draw platforms
  gameState.ctx.fillStyle = '#444444';
  gameState.ctx.shadowBlur = 5;
  gameState.ctx.shadowColor = '#666666';
  platforms.forEach(platform => {
    gameState.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
  gameState.ctx.shadowBlur = 0;
  
  // Spawn enemies with variety
  if (Date.now() - gameState.lastEnemySpawn > gameState.enemySpawnRate) {
    const types = ['flyer', 'shooter', 'tank', 'dasher', 'bomber', 'sniper', 'swarm', 'guardian', 'hunter', 'berserker'];
    const weights = [0.2, 0.15, 0.12, 0.1, 0.1, 0.08, 0.08, 0.07, 0.05, 0.05];
    
    let rand = Math.random();
    let selectedType = 'flyer';
    
    for (let i = 0; i < types.length; i++) {
      if (rand < weights[i]) {
        selectedType = types[i];
        break;
      }
      rand -= weights[i];
    }
    
    enemies.push(new Enemy(Math.random() * 1200, -30, selectedType));
    gameState.lastEnemySpawn = Date.now();
    gameState.enemySpawnRate = Math.max(500, 3000 - Math.floor(gameState.gameTime / 10000) * 100);
  }
  
  // Update wave
  gameState.wave = Math.floor(gameState.gameTime / 60000) + 1;
  
  // Update and draw player
  player.update();
  player.draw();
  
  // Update and draw enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();
    enemy.draw();
    
    if (enemy.hp <= 0) {
      enemy.die();
      enemies.splice(i, 1);
      continue;
    } else if (enemy.y > 750) {
      enemies.splice(i, 1);
      continue;
    }
    
    // Enemy collision with player
    if (!player.invulnerable &&
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y) {
      
      if (player.bodyDamage > 0) {
        enemy.takeDamage(player.bodyDamage);
      } else {
        player.takeDamage(enemy.damage);
      }
    }
  }
  
  // Update and draw projectiles
for (let i = projectiles.length - 1; i >= 0; i--) {
  const proj = projectiles[i];
  proj.x += proj.vx;
  proj.y += proj.vy;
  // Colisão com projéteis inimigos - apenas se não for fragmento de explosão
  if (!proj.hitsEnemiesOnly) {
    for (let j = enemyProjectiles.length - 1; j >= 0; j--) {
      const enemyProj = enemyProjectiles[j];
      if (
        proj.x < enemyProj.x + enemyProj.size &&
        proj.x + proj.size > enemyProj.x &&
        proj.y < enemyProj.y + enemyProj.size &&
        proj.y + proj.size > enemyProj.y
      ) {
        // Explosão visual
        for (let k = 0; k < 8; k++) {
          const angle = (Math.PI * 2 / 8) * k;
          projectiles.push({
            x: (proj.x + enemyProj.x) / 2,
            y: (proj.y + enemyProj.y) / 2,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            size: 3,
            damage: 0,
            hits: 1,
            owner: 'player'
          });
        }
        enemyProjectiles.splice(j, 1);
        projectiles.splice(i, 1);
        break;
      }
    }
  }
  // Terrain collision for projectiles
  if (isUnderground(proj.x, proj.y)) {
    if (proj.explosive && !proj.explosionFragment) {
      // Create explosion
      for (let k = 0; k < 8; k++) {
        const angle = (Math.PI * 2 / 8) * k;
        projectiles.push({
          x: proj.x,
          y: proj.y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          size: 3,
          damage: Math.max(1, Math.round(proj.damage * 0.2)),
          hits: 1,
          owner: 'player',
          color: '#ff6600',
          explosionFragment: true,
          hitsEnemiesOnly: true // Impede que exploda projéteis inimigos
        });
      }
    }
    projectiles.splice(i, 1);
    continue;
  }
    
    // Check enemy hits
    let hitEnemy = false;
    for (let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++) {
      const enemy = enemies[enemyIndex];
      if (proj.owner === 'player' &&
          proj.x < enemy.x + enemy.width &&
          proj.x + proj.size > enemy.x &&
          proj.y < enemy.y + enemy.height &&
          proj.y + proj.size > enemy.y) {
        
        let damage = proj.damage;
        
        // Aplicar multiplicadores de dano
        if (player.rage && player.hp < player.maxHp * 0.5) {
          const rageFactor = 1 + (1 - player.hp / player.maxHp) * 0.5;
          damage *= rageFactor;
        }
        
        // Garantir que o dano seja pelo menos 1
        damage = Math.max(1, Math.round(damage));
        
        enemy.takeDamage(damage);
        player.totalDamageDealt += damage;
        player.projectileHits++;
        proj.hits--;
        
        if (proj.hits <= 0) {
          if (proj.explosive && !proj.explosionFragment) {
            for (let k = 0; k < 8; k++) {
              const angle = (Math.PI * 2 / 8) * k;
              projectiles.push({
                x: proj.x,
                y: proj.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                size: 3,
                damage: Math.max(1, Math.round(proj.damage * 0.2)),
                hits: 1,
                owner: 'player',
                color: '#ff6600',
                explosionFragment: true,
                hitsEnemiesOnly: true // Impede que exploda projéteis inimigos
              });
            }
          }
          projectiles.splice(i, 1);
          hitEnemy = true;
        }
        break;
      }
    }
    
    if (hitEnemy) continue;
    
    // Draw projectile
    if (projectiles[i]) {
      gameState.ctx.fillStyle = proj.owner === 'player' ? 
        (proj.crit ? '#FFFF00' : '#FFFFFF') : '#FF0000';
      gameState.ctx.shadowBlur = 8;
      gameState.ctx.shadowColor = gameState.ctx.fillStyle;
      gameState.ctx.fillRect(proj.x, proj.y, proj.size, proj.size);
      gameState.ctx.shadowBlur = 0;
    }
    
    // Remove if out of bounds
    if (proj.x < -20 || proj.x > 1220 || proj.y < -20 || proj.y > 720) {
      projectiles.splice(i, 1);
      continue;
    }
}
  
  // Update and draw enemy projectiles
for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
  const proj = enemyProjectiles[i];
  if (!proj) continue;
  
  proj.x += proj.vx;
  proj.y += proj.vy;
  // Colisão com projéteis do jogador
  for (let j = projectiles.length - 1; j >= 0; j--) {
    const playerProj = projectiles[j];
    if (
      proj.x < playerProj.x + playerProj.size &&
      proj.x + proj.size > playerProj.x &&
      proj.y < playerProj.y + playerProj.size &&
      proj.y + proj.size > playerProj.y
    ) {
      // Explosão visual
      for (let k = 0; k < 8; k++) {
        const angle = (Math.PI * 2 / 8) * k;
        projectiles.push({
          x: (proj.x + playerProj.x) / 2,
          y: (proj.y + playerProj.y) / 2,
          vx: Math.cos(angle) * 2,
          vy: Math.sin(angle) * 2,
          size: 3,
          damage: 0,
          hits: 1,
          owner: 'player'
        });
      }
      projectiles.splice(j, 1);
      enemyProjectiles.splice(i, 1);
      break;
    }
  }
  // Terrain collision
  if (isUnderground(proj.x, proj.y)) {
    enemyProjectiles.splice(i, 1);
    continue;
  }
  // Check player hit
  if (!player.invulnerable &&
      proj.x < player.x + player.width &&
      proj.x + proj.size > player.x &&
      proj.y < player.y + player.height &&
      proj.y + proj.size > player.y) {
    player.takeDamage(proj.damage);
    enemyProjectiles.splice(i, 1);
  } else {
    gameState.ctx.fillStyle = '#FF0000';
    gameState.ctx.shadowBlur = 6;
    gameState.ctx.shadowColor = '#FF0000';
    gameState.ctx.fillRect(proj.x, proj.y, proj.size, proj.size);
    gameState.ctx.shadowBlur = 0;
  }
  if (proj.x < -20 || proj.x > 1220 || proj.y < -20 || proj.y > 720) {
    enemyProjectiles.splice(i, 1);
  }
}
  
  // Update and draw thunderbolts
  for (let i = thunderbolts.length - 1; i >= 0; i--) {
    const bolt = thunderbolts[i];
    if (!bolt) continue;
    
    bolt.life = bolt.life || 30;
    bolt.life--;
    gameState.ctx.fillStyle = '#ffff00';
    gameState.ctx.fillRect(bolt.x - 2, 0, 4, gameState.canvas.height);
    
    // Deal damage to enemies only
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (enemy.x + enemy.width/2 > bolt.x - 10 && enemy.x + enemy.width/2 < bolt.x + 10) {
        enemy.takeDamage(15);
        if (enemy.hp <= 0) {
          destroyEnemy(enemy);
        }
      }
    }
    
    if (bolt.life <= 0) {
      thunderbolts.splice(i, 1);
    }
  }

  // Draw damage numbers
  drawDamageNumbers();
  
  // Update UI
  updateUI();
  
  // Check game over
  if (player.hp <= 0) {
    saveGame();
    drawGameOverScreen();
    
    if (gameState.keys['Escape']) {
      const gameOverOverlay = document.getElementById('gameOverOverlay');
      if (gameOverOverlay && gameOverOverlay.style.display === 'flex') {
        hideGameOverOverlay();
        quitToMenu();
      }
    }
    
    requestAnimationFrame(gameLoop);
    return;
  }
  
  requestAnimationFrame(gameLoop);
}

// Function to restart with same character
function restartWithSameCharacter() {
  if (player.selectedType) {
    startNewGameWithCharacter(player.selectedType);
  } else {
    // Fallback to character selection if no type is saved
    showCharacterSelection();
  }
}

// Make functions globally available
window.restartWithSameCharacter = restartWithSameCharacter;
window.quitToMenu = quitToMenu;

// Initialize when page loads
initGame();
