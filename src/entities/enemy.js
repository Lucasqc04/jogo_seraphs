import { gameState, enemies, enemyProjectiles, pickups, projectiles } from '../game/gameState.js';
import { getGroundLevel } from '../game/platforms.js';
import { player } from './player.js';
import { playSound } from '../audio/soundSystem.js';
import { createDamageNumber } from '../effects/damageNumbers.js';

// Enemy types
export const enemyTypes = {
  flyer: {
    width: 25, height: 25, hp: 20, speed: 2, damage: 15,
    color: '#FF4444', shootCooldown: 2000,
    behavior: 'follow'
  },
  shooter: {
    width: 30, height: 30, hp: 35, speed: 1.5, damage: 25,
    color: '#FF6666', shootCooldown: 1500,
    behavior: 'hover'
  },
  tank: {
    width: 40, height: 40, hp: 80, speed: 1, damage: 30,
    color: '#AA2222', shootCooldown: 3000,
    behavior: 'charge'
  },
  dasher: {
    width: 20, height: 20, hp: 15, speed: 4, damage: 20,
    color: '#FF8888', shootCooldown: 2500,
    behavior: 'dash'
  },
  bomber: {
    width: 35, height: 35, hp: 50, speed: 1.2, damage: 40,
    color: '#FF2200', shootCooldown: 4000,
    behavior: 'bomber'
  },
  sniper: {
    width: 25, height: 25, hp: 25, speed: 0.5, damage: 50,
    color: '#AA00AA', shootCooldown: 3500,
    behavior: 'sniper'
  },
  swarm: {
    width: 15, height: 15, hp: 8, speed: 3, damage: 10,
    color: '#FFAA00', shootCooldown: 1000,
    behavior: 'swarm'
  },
  guardian: {
    width: 50, height: 50, hp: 150, speed: 0.8, damage: 35,
    color: '#440044', shootCooldown: 2500,
    behavior: 'guardian'
  },
  hunter: {
    width: 28, height: 28, hp: 30, speed: 2.5, damage: 20,
    color: '#00AA44', shootCooldown: 1800,
    behavior: 'hunter'
  },
  berserker: {
    width: 32, height: 32, hp: 45, speed: 1.8, damage: 25,
    color: '#AA4400', shootCooldown: 1200,
    behavior: 'berserker'
  }
};

// Enemy class
export class Enemy {
  constructor(x, y, type = 'flyer') {
    this.type = type;
    const template = enemyTypes[type];
    
    this.x = x;
    this.y = y;
    this.width = template.width;
    this.height = template.height;
    this.hp = template.hp + Math.floor(gameState.gameTime / 30000) * 10;
    this.maxHp = this.hp;
    this.speed = template.speed + Math.floor(gameState.gameTime / 60000);
    this.damage = template.damage + Math.floor(gameState.gameTime / 45000) * 5;
    this.color = template.color;
    this.shootCooldown = template.shootCooldown;
    this.behavior = template.behavior;
    
    this.followHeight = 300; // Altura mínima para não ir para as plataformas
    this.following = false;
    this.lastShot = 0;
    this.slowFactor = 1;
    this.bleeding = 0;
    this.bleedTime = 0;
    this.dashCooldown = 0;
    this.hoverOffset = Math.random() * Math.PI * 2;
  }

  update() {
    // Bleeding effect
    if (this.bleeding > 0 && Date.now() - this.bleedTime > 500) {
      this.hp -= this.bleeding;
      this.bleedTime = Date.now();
      this.bleeding = Math.max(0, this.bleeding - 1);
      createDamageNumber(this.x + this.width/2, this.y, this.bleeding, '#AA0000');
    }

    // Movement based on behavior
    if (!this.following && this.y < this.followHeight) {
      this.y += this.speed * this.slowFactor;
    } else {
      this.following = true;
      
      const dx = (player.x + player.width/2) - (this.x + this.width/2);
      const dy = (player.y + player.height/2) - (this.y + this.height/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Limitar movimento vertical - não descer abaixo de y=300
      const canMoveDown = this.y < 300;
      
      switch(this.behavior) {
        case 'follow':
          if (dist > 5) {
            this.x += (dx / dist) * this.speed * 0.5 * this.slowFactor;
            // Só move verticalmente se não estiver muito baixo ou se for para subir
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.5 * this.slowFactor;
            }
          }
          break;
          
        case 'hover':
          const targetY = Math.max(300, player.y - 80 + Math.sin(Date.now() / 1000 + this.hoverOffset) * 20);
          this.x += (dx / dist) * this.speed * 0.3 * this.slowFactor;
          this.y += ((targetY - this.y) / 50) * this.slowFactor;
          break;
          
        case 'charge':
          if (dist > 5) {
            this.x += (dx / dist) * this.speed * 0.8 * this.slowFactor;
            // Só move verticalmente se não estiver muito baixo ou se for para subir
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.8 * this.slowFactor;
            }
          }
          break;
          
        case 'dash':
          if (this.dashCooldown <= 0 && dist > 50) {
            this.x += (dx / dist) * this.speed * 3 * this.slowFactor;
            // Só move verticalmente se não estiver muito baixo ou se for para subir
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 3 * this.slowFactor;
            }
            this.dashCooldown = 60;
          } else {
            this.dashCooldown--;
            this.x += (dx / dist) * this.speed * 0.2 * this.slowFactor;
            // Só move verticalmente se não estiver muito baixo ou se for para subir
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.2 * this.slowFactor;
            }
          }
          break;
          
        case 'bomber':
          // Move devagar até se aproximar, então explode
          if (dist > 80) {
            this.x += (dx / dist) * this.speed * 0.4 * this.slowFactor;
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.4 * this.slowFactor;
            }
          } else {
            // Explode causando múltiplos projéteis
            if (Date.now() - this.lastShot > this.shootCooldown) {
              for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                enemyProjectiles.push({
                  x: this.x + this.width/2,
                  y: this.y + this.height/2,
                  vx: Math.cos(angle) * 3,
                  vy: Math.sin(angle) * 3,
                  size: 6,
                  damage: this.damage * 0.7,
                  hitsEnemiesOnly: false
                });
              }
              this.lastShot = Date.now();
            }
          }
          break;
          
        case 'sniper':
          // Fica longe e atira com precisão
          if (dist < 200) {
            this.x -= (dx / dist) * this.speed * 0.3 * this.slowFactor;
            if (dy < 0 || canMoveDown) {
              this.y -= (dy / dist) * this.speed * 0.3 * this.slowFactor;
            }
          }
          break;
          
        case 'swarm':
          // Movimento erratico em enxame
          const swarmOffset = Math.sin(Date.now() / 500 + this.hoverOffset) * 50;
          this.x += (dx / dist) * this.speed * 0.6 * this.slowFactor + swarmOffset * 0.01;
          if (dy < 0 || canMoveDown) {
            this.y += (dy / dist) * this.speed * 0.6 * this.slowFactor;
          }
          break;
          
        case 'guardian':
          // Move lentamente mas atira múltiplos projéteis
          if (dist > 5) {
            this.x += (dx / dist) * this.speed * 0.3 * this.slowFactor;
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.3 * this.slowFactor;
            }
          }
          // Atira 3 projéteis em leque
          if (Date.now() - this.lastShot > this.shootCooldown) {
            for (let i = -1; i <= 1; i++) {
              const angle = Math.atan2(dy, dx) + i * 0.3;
              enemyProjectiles.push({
                x: this.x + this.width/2,
                y: this.y + this.height/2,
                vx: Math.cos(angle) * 4,
                vy: Math.sin(angle) * 4,
                size: 8,
                damage: this.damage * 0.8,
                hitsEnemiesOnly: false
              });
            }
            this.lastShot = Date.now();
            playSound('enemyShoot');
            return; // Evita tiro duplo
          }
          break;
          
        case 'hunter':
          // Persegue rapidamente mas para quando próximo
          if (dist > 30) {
            this.x += (dx / dist) * this.speed * 0.7 * this.slowFactor;
            if (dy < 0 || canMoveDown) {
              this.y += (dy / dist) * this.speed * 0.7 * this.slowFactor;
            }
          } else {
            // Para e atira rapidamente
            this.shootCooldown = Math.min(this.shootCooldown, 1000);
          }
          break;
          
        case 'berserker':
          // Fica mais rápido quando com pouca vida
          const berserkerSpeed = this.hp < this.maxHp * 0.5 ? 1.5 : 1;
          this.x += (dx / dist) * this.speed * 0.6 * berserkerSpeed * this.slowFactor;
          if (dy < 0 || canMoveDown) {
            this.y += (dy / dist) * this.speed * 0.6 * berserkerSpeed * this.slowFactor;
          }
          if (this.hp < this.maxHp * 0.5) {
            this.shootCooldown = Math.min(this.shootCooldown, 800);
          }
          break;
      }
      
      // Garantir que o inimigo não desça abaixo de y=300
      if (this.y > 300) {
        this.y = 300;
      }
      
      // Shooting
      if (Date.now() - this.lastShot > this.shootCooldown) {
        // Guardian tem comportamento especial de tiro
        if (this.behavior === 'guardian') {
          // Já foi tratado no switch acima
          return;
        }
        
        const speed = 4; // Reduzido de 6 para 4 para ficar mais fácil de desviar
        enemyProjectiles.push({
          x: this.x + this.width/2,
          y: this.y + this.height/2,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          size: 7, // Aumentado de 4 para 7
          damage: this.damage,
          hitsEnemiesOnly: false // padrão
        });
        this.lastShot = Date.now();
        playSound('enemyShoot');
      }
    }
  }

  takeDamage(damage) {
    this.hp -= damage;
    this.lastDamage = damage; // Rastrear o último dano recebido
    createDamageNumber(this.x + this.width/2, this.y, damage, '#FFFF00');
    
    if (player.cold) {
      this.slowFactor = Math.max(0.2, this.slowFactor - 0.01);
    }
    if (player.wound) {
      this.bleeding = Math.max(this.bleeding, 5);
      this.bleedTime = Date.now();
    }
    if (player.lifeSteal > 0) {
      player.hp = Math.min(player.maxHp, player.hp + damage * player.lifeSteal);
    }
  }

  die() {
    gameState.kills++;
    
    // Usar o último dano recebido ou dano padrão
    const lastDamage = this.lastDamage || player.projectileDamage;
    
    // Drop soul orb
    if (Math.random() < player.soulDropChance) {
      pickups.push({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        type: 'soul',
        value: 5
      });
    }
    
    // Drop healing orb
    if (Math.random() < player.healingOrbChance) {
      pickups.push({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        type: 'heal',
        value: 15
      });
    }
    
    // Fragmentation
    if (player.fragmentation > 0) {
      for (let i = 0; i < player.fragmentation; i++) {
        const angle = (Math.PI * 2 / player.fragmentation) * i + Math.random() * 0.5;
        projectiles.push({
          x: this.x + this.width/2,
          y: this.y + this.height/2,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          size: 6,
          damage: Math.max(1, Math.round(lastDamage * 0.2)),
          hits: 1,
          owner: 'player',
          color: '#ff6600',
          explosionFragment: true,
          hitsEnemiesOnly: !!player.fragmentationHitsEnemiesOnly
        });
      }
    }
    
    // EXP aumentado para facilitar a progressão
    player.gainExp(20 + Math.floor(gameState.gameTime / 15000) * 8);
    playSound('enemyDie');
  }

  draw() {
    gameState.ctx.fillStyle = this.bleeding > 0 ? '#FF6666' : this.color;
    gameState.ctx.shadowBlur = 8;
    gameState.ctx.shadowColor = this.color;
    gameState.ctx.fillRect(this.x, this.y, this.width, this.height);
    gameState.ctx.shadowBlur = 0;
    
    // Health bar
    if (this.hp < this.maxHp) {
      gameState.ctx.fillStyle = '#222';
      gameState.ctx.fillRect(this.x, this.y - 8, this.width, 4);
      gameState.ctx.fillStyle = '#4F4';
      gameState.ctx.fillRect(this.x, this.y - 8, (this.hp / this.maxHp) * this.width, 4);
    }
  }
}
