import { gameState, projectiles, enemies, enemyProjectiles, pickups, thunderbolts, screenShake, screenShakeIntensity } from '../game/gameState.js';
import { getGroundLevel, isUnderground } from '../game/platforms.js';
import { upgrades } from '../game/upgrades.js';
import { playSound } from '../audio/soundSystem.js';
import { createDamageNumber } from '../effects/damageNumbers.js';
import { getUpgradeMultiplier } from './playerTypes.js';

// Player object
export const player = {
  x: 100, y: 400, width: 30, height: 40,
  vx: 0, vy: 0, speed: 5, jumpPower: 15,
  onGround: false, jumps: 0, maxJumps: 1,
  hp: 100, maxHp: 100, exp: 0, level: 1,
  expToNext: 100, invulnerable: false, invulnTime: 500,
  lastInvuln: 0, projectileDamage: 10, attackSpeed: 200,
  critChance: 0, critDamage: 1, defense: 0, soulDropChance: 0,
  projectileHits: 1, projectileSize: 1, fragmentation: 0,
  friction: 0, distanceRun: 0, lastX: 100, lifeSteal: 0,
  luck: 0, healingOrbChance: 0, rage: false, regrowth: false,
  thunderbolt: 0, lastThunder: 0, upgradeChoices: 3,
  barrier: false, lastBarrier: 0, cold: false, focus: false,
  focusTime: 0, bodyDamage: 0, tome: false, wisps: 0,
  wound: false, revives: 0, shielded: false,
  selectedType: 'speedster', // Tipo padrão
  typeName: 'Speedster',
  typeColor: '#00FFFF',
  // Estatísticas de tracking
  totalDamageDealt: 0,
  totalDamageTaken: 0,
  projectilesFired: 0,
  projectileHits: 0,
  
  update() {
    // Movement
    if (gameState.keys['a'] || gameState.keys['A']) {
      this.vx = -this.speed;
      this.focusTime = 0;
    } else if (gameState.keys['d'] || gameState.keys['D']) {
      this.vx = this.speed;
      this.focusTime = 0;
    } else {
      this.vx = 0;
      if (this.focus) this.focusTime += 16;
    }

    // Jumping
    if ((gameState.keys[' '] || gameState.keys['Space']) && this.jumps < this.maxJumps) {
      this.vy = -this.jumpPower;
      this.jumps++;
      this.onGround = false;
      gameState.keys[' '] = false;
      gameState.keys['Space'] = false;
      playSound('jump');
    }

    // Physics
    this.vy += 0.8; // gravity
    this.x += this.vx;
    this.y += this.vy;

    // Friction tracking
    if (Math.abs(this.vx) > 0) {
      this.distanceRun += Math.abs(this.x - this.lastX);
      if (this.friction > 0 && this.distanceRun >= 60) {
        for (let i = 0; i < this.friction; i++) {
          projectiles.push({
            x: this.x + this.width/2,
            y: this.y,
            vx: (Math.random() - 0.5) * 6,
            vy: -8 - Math.random() * 5,
            size: 6,
            damage: this.projectileDamage * 0.7,
            hits: 1,
            owner: 'player',
            explosive: true
          });
          this.projectilesFired++;
        }
        this.distanceRun = 0;
      }
    }
    this.lastX = this.x;

    // Ground collision
    this.onGround = false;
    const groundLevel = getGroundLevel(this.x + this.width/2);
    if (this.y + this.height >= groundLevel) {
      this.y = groundLevel - this.height;
      this.vy = 0;
      this.onGround = true;
      this.jumps = 0;
    }

    // Boundaries
    this.x = Math.max(0, Math.min(1200 - this.width, this.x));
    if (this.y > 700) {
      if (this.revives > 0) {
        this.revives--;
        this.hp = this.maxHp;
        this.x = 100;
        this.y = 400;
        enemies.length = 0;
        enemyProjectiles.length = 0;
        playSound('revive');
      } else {
        this.hp = 0;
      }
    }

    // Invulnerability
    if (this.invulnerable && Date.now() - this.lastInvuln > this.invulnTime) {
      this.invulnerable = false;
    }

    // Shooting
    const canShoot = Date.now() - gameState.lastShot > this.attackSpeed * (this.focus ? Math.max(0.5, 1 - this.focusTime / 10000) : 1);
    if ((gameState.mouse.down || this.autoShoot) && canShoot) {
      if (!isUnderground(gameState.mouse.x, gameState.mouse.y)) {
        this.shoot();
        gameState.lastShot = Date.now();
      }
    }

    // Regrowth
    if (this.regrowth && enemies.length > 0) {
      this.hp = Math.min(this.maxHp, this.hp + enemies.length * 0.01);
    }

    // Thunderbolt - reduzida a frequência
    if (this.thunderbolt > 0 && Date.now() - this.lastThunder > 8000) { // Aumentado de 3000 para 8000ms (8 segundos)
      for (let i = 0; i < this.thunderbolt; i++) {
        if (enemies.length > 0) {
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          thunderbolts.push({
            x: target.x + target.width/2,
            y: 0,
            target: target,
            time: 0
          });
        }
      }
      this.lastThunder = Date.now();
      playSound('thunder');
    }

    // Wisps shooting
    if (this.wisps > 0 && enemies.length > 0) {
      for (let i = 0; i < this.wisps; i++) {
        if (Math.random() < 0.02) { // 2% chance per frame per wisp
          const angle = (Date.now() / 1000 + i * Math.PI * 2 / this.wisps) % (Math.PI * 2);
          const wispX = this.x + this.width/2 + Math.cos(angle) * 40;
          const wispY = this.y + this.height/2 + Math.sin(angle) * 40;
          
          // Find nearest enemy
          let nearestEnemy = null;
          let nearestDist = Infinity;
          enemies.forEach(enemy => {
            const dist = Math.sqrt((enemy.x - wispX) ** 2 + (enemy.y - wispY) ** 2);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestEnemy = enemy;
            }
          });
          
          if (nearestEnemy) {
            const dx = nearestEnemy.x + nearestEnemy.width/2 - wispX;
            const dy = nearestEnemy.y + nearestEnemy.height/2 - wispY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            projectiles.push({
              x: wispX,
              y: wispY,
              vx: (dx / dist) * 8,
              vy: (dy / dist) * 8,
              damage: Math.round(this.damage * 0.4),
              size: 3,
              color: '#FFFF00',
              fromWisp: true
            });
          }
        }
      }
    }

    // Barrier
    if (this.barrier && Date.now() - this.lastBarrier > 5000) {
      this.shielded = true;
      this.lastBarrier = Date.now();
    }
  },

  shoot() {
    const dx = gameState.mouse.x - (this.x + this.width/2);
    const dy = gameState.mouse.y - (this.y + this.height/2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    const speed = 12;

    const isCrit = Math.random() < this.critChance;
    const damage = this.projectileDamage * (isCrit ? 1 + this.critDamage : 1);

    projectiles.push({
      x: this.x + this.width/2,
      y: this.y + this.height/2,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      size: 8 * this.projectileSize, // Aumentado de 5 para 8
      damage: damage,
      hits: this.projectileHits,
      owner: 'player',
      crit: isCrit
    });

    this.projectilesFired++;
    playSound('shoot');
  },

  takeDamage(damage) {
    if (this.invulnerable) return;
    // Se o projétil só atinge inimigos, ignora o dano
    if (typeof damage === 'object' && damage.hitsEnemiesOnly) return;
    if (this.shielded) {
      this.shielded = false;
      playSound('shield');
      return;
    }

    const actualDamage = Math.max(1, (typeof damage === 'object' ? damage.value : damage) * (1 - this.defense));
    this.hp -= actualDamage;
    this.totalDamageTaken += actualDamage;
    this.invulnerable = true;
    this.lastInvuln = Date.now();
    
    createDamageNumber(this.x + this.width/2, this.y, actualDamage, '#ff0000');
    playSound('hit');

    if (this.hp <= 0 && this.revives > 0) {
      this.revives--;
      this.hp = this.maxHp;
      enemies.length = 0;
      enemyProjectiles.length = 0;
      this.invulnerable = false;
      playSound('revive');
    }
  },

  gainExp(amount) {
    this.exp += amount;
    if (this.exp >= this.expToNext) {
      this.levelUp();
    }
  },

  levelUp() {
    this.level++;
    this.exp -= this.expToNext;
    this.expToNext = Math.floor(this.expToNext * 1.3); // Reduzido de 1.5 para 1.3 para ficar mais fácil
    playSound('levelup');
    this.showUpgradeMenu();
  },

  showUpgradeMenu() {
    gameState.gameRunning = false;
    const availableUpgrades = [...upgrades];
    const chosenUpgrades = [];
    
    for (let i = 0; i < this.upgradeChoices; i++) {
      if (availableUpgrades.length === 0) break;
      
      let rarity = 'common';
      const rand = Math.random() + this.luck;
      if (rand > 0.7) rarity = 'uncommon';
      if (rand > 0.9) rarity = 'rare';
      if (rand > 0.98) rarity = 'legendary';
      
      const filtered = availableUpgrades.filter(u => u.rarity === rarity);
      const pool = filtered.length > 0 ? filtered : availableUpgrades;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      
      chosenUpgrades.push(chosen);
      availableUpgrades.splice(availableUpgrades.indexOf(chosen), 1);
    }
    
    const upgradeOptions = document.getElementById('upgradeOptions');
    upgradeOptions.innerHTML = '';
    
    chosenUpgrades.forEach((upgrade, index) => {
      const div = document.createElement('div');
      div.className = 'upgrade-option';
      
      const colors = {
        common: '#808080',
        uncommon: '#4169E1',
        rare: '#9370DB',
        legendary: '#FFD700'
      };
      
      const rarityNames = {
        common: 'Comum',
        uncommon: 'Incomum',
        rare: 'Raro',
        legendary: 'Lendário'
      };
      
      div.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px;">
          <div style="font-size: 0.8rem; color: ${colors[upgrade.rarity]}; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${rarityNames[upgrade.rarity]}</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #fff; margin-bottom: 8px;">${upgrade.name}</div>
          <div style="font-size: 0.9rem; color: #ccc; line-height: 1.4;">${upgrade.desc}</div>
        </div>
      `;
      
      div.style.cssText = `
        background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9));
        border: 3px solid ${colors[upgrade.rarity]};
        color: white;
        padding: 20px;
        margin: 10px;
        cursor: pointer;
        border-radius: 15px;
        transition: all 0.3s;
        min-width: 200px;
        max-width: 220px;
        box-shadow: 0 5px 20px ${colors[upgrade.rarity]}40, inset 0 1px 0 rgba(255,255,255,0.1);
        position: relative;
        overflow: hidden;
      `;
      
      // Adicionar efeito de brilho
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: shimmer 2s infinite;
        pointer-events: none;
      `;
      div.appendChild(shimmer);
      
      div.onmouseover = () => {
        div.style.transform = 'translateY(-8px) scale(1.05)';
        div.style.boxShadow = `0 15px 35px ${colors[upgrade.rarity]}60, inset 0 1px 0 rgba(255,255,255,0.2)`;
        div.style.borderWidth = '4px';
      };
      
      div.onmouseout = () => {
        div.style.transform = 'translateY(0) scale(1)';
        div.style.boxShadow = `0 5px 20px ${colors[upgrade.rarity]}40, inset 0 1px 0 rgba(255,255,255,0.1)`;
        div.style.borderWidth = '3px';
      };
      
      div.onclick = () => this.selectUpgrade(upgrade);
      upgradeOptions.appendChild(div);
    });
    
    // Adicionar animação CSS para o shimmer se não existir
    if (!document.getElementById('shimmerStyle')) {
      const style = document.createElement('style');
      style.id = 'shimmerStyle';
      style.textContent = `
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.getElementById('upgradeMenu').style.display = 'flex';
  },

  selectUpgrade(upgrade) {
    // Aplicar multiplicador baseado no tipo de personagem
    const multiplier = getUpgradeMultiplier(this.selectedType, upgrade.name);
    
    // Criar uma versão modificada do upgrade com multiplicador
    const modifiedUpgrade = {
      ...upgrade,
      effect: (player) => {
        // Salvar valores originais antes de aplicar upgrade
        const originalProjectileDamage = player.projectileDamage;
        const originalSpeed = player.speed;
        const originalAttackSpeed = player.attackSpeed;
        const originalMaxHp = player.maxHp;
        
        // Aplicar upgrade normal
        upgrade.effect(player);
        
        // Aplicar multiplicadores específicos
        if (upgrade.name.includes('Catalyst')) {
          const damageIncrease = player.projectileDamage - originalProjectileDamage;
          player.projectileDamage = originalProjectileDamage + (damageIncrease * multiplier);
        }
        if (upgrade.name.includes('Swift')) {
          const speedRatio = player.speed / originalSpeed;
          player.speed = originalSpeed * (1 + (speedRatio - 1) * multiplier);
        }
        if (upgrade.name.includes('Resonance')) {
          const speedRatio = originalAttackSpeed / player.attackSpeed;
          player.attackSpeed = originalAttackSpeed / (1 + (speedRatio - 1) * multiplier);
        }
        if (upgrade.name.includes('Growth')) {
          const hpIncrease = player.maxHp - originalMaxHp;
          player.maxHp = originalMaxHp + (hpIncrease * multiplier);
          player.hp += (hpIncrease * multiplier) - hpIncrease;
        }
      }
    };
    
    modifiedUpgrade.effect(this);
    document.getElementById('upgradeMenu').style.display = 'none';
    gameState.gameRunning = true;
    playSound('upgrade');
  },

  draw() {
    gameState.ctx.save();
    
    // Apply screen shake
    if (screenShakeIntensity > 0) {
      gameState.ctx.translate(
        (Math.random() - 0.5) * screenShakeIntensity,
        (Math.random() - 0.5) * screenShakeIntensity
      );
    }
    
    if (this.invulnerable) {
      gameState.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 100);
    }
    
    // Draw barrier
    if (this.shielded) {
      gameState.ctx.strokeStyle = '#00FFFF';
      gameState.ctx.lineWidth = 3;
      gameState.ctx.shadowBlur = 15;
      gameState.ctx.shadowColor = '#00FFFF';
      gameState.ctx.beginPath();
      gameState.ctx.arc(this.x + this.width/2, this.y + this.height/2, 
             Math.max(this.width, this.height)/2 + 8, 0, Math.PI * 2);
      gameState.ctx.stroke();
      gameState.ctx.shadowBlur = 0;
    }
    
    // Player color based on type and rage
    let playerColor = this.typeColor || '#00AAFF';
    if (this.hp < this.maxHp * 0.5 && this.rage) {
      playerColor = '#FF4444';
    }
    gameState.ctx.fillStyle = playerColor;
    gameState.ctx.shadowBlur = 10;
    gameState.ctx.shadowColor = playerColor;
    gameState.ctx.fillRect(this.x, this.y, this.width, this.height);
    gameState.ctx.shadowBlur = 0;
    
    // Draw wisps
    for (let i = 0; i < this.wisps; i++) {
      const angle = (Date.now() / 1000 + i * Math.PI * 2 / this.wisps) % (Math.PI * 2);
      const wispX = this.x + this.width/2 + Math.cos(angle) * 40;
      const wispY = this.y + this.height/2 + Math.sin(angle) * 40;
      
      gameState.ctx.fillStyle = '#FFFF00';
      gameState.ctx.shadowBlur = 8;
      gameState.ctx.shadowColor = '#FFFF00';
      gameState.ctx.beginPath();
      gameState.ctx.arc(wispX, wispY, 4, 0, Math.PI * 2);
      gameState.ctx.fill();
      gameState.ctx.shadowBlur = 0;
    }
    
    gameState.ctx.restore();
  }
};
