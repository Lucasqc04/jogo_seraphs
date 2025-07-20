import { enemyTypes } from '../entities/enemy.js';
import { upgrades } from '../game/upgrades.js';
import { playerTypes } from '../entities/playerTypes.js';
import { gameState } from '../game/gameState.js';

// Função para gerar o conteúdo dinâmico da wiki
export function generateWikiContent() {
  return {
    // Informações do jogador e tipos atualizadas
    player: {
      baseStats: {
        hp: 100,
        speed: 5,
        jumpPower: 15,
        projectileDamage: 10,
        attackSpeed: 200
      },
      types: Object.entries(playerTypes).map(([key, type]) => ({
        id: key,
        nome: type.name,
        descricao: type.description,
        color: type.color,
        stats: type.stats,
        startingUpgrades: type.startingUpgrades || [],
        specialFeatures: getSpecialFeatures(key)
      }))
    },
    
    // Tipos de inimigos com informações dinâmicas
    enemies: [
      ...Object.entries(enemyTypes).map(([type, data]) => ({
        type,
        name: getEnemyName(type),
        width: data.width,
        height: data.height,
        baseHp: data.hp,
        baseSpeed: data.speed,
        baseDamage: data.damage,
        color: data.color,
        shootCooldown: data.shootCooldown,
        behavior: data.behavior,
        description: getEnemyDescription(type)
      })),
      // Novos tipos
      {
        type: 'bomber', name: 'Bombardeiro', baseHp: 60, baseSpeed: 2, baseDamage: 20, color: '#ff6600', shootCooldown: 3000, behavior: 'explode', description: 'Se aproxima e explode causando dano em área.'
      },
      {
        type: 'sniper', name: 'Franco-atirador', baseHp: 40, baseSpeed: 2, baseDamage: 30, color: '#00ffcc', shootCooldown: 2500, behavior: 'sniper', description: 'Atira de longe, mira no jogador.'
      },
      {
        type: 'swarm', name: 'Enxame', baseHp: 15, baseSpeed: 6, baseDamage: 8, color: '#ff00ff', shootCooldown: 1200, behavior: 'swarm', description: 'Vários inimigos pequenos que atacam em grupo.'
      },
      {
        type: 'guardian', name: 'Guardião', baseHp: 120, baseSpeed: 1.5, baseDamage: 15, color: '#ffff00', shootCooldown: 3500, behavior: 'shield', description: 'Possui escudo temporário, resiste a dano.'
      },
      {
        type: 'hunter', name: 'Caçador', baseHp: 35, baseSpeed: 4, baseDamage: 18, color: '#00ff00', shootCooldown: 1800, behavior: 'hunter', description: 'Persegue o jogador agressivamente.'
      },
      {
        type: 'berserker', name: 'Berserker', baseHp: 80, baseSpeed: 3.5, baseDamage: 35, color: '#ff2222', shootCooldown: 2000, behavior: 'berserk', description: 'Fica mais rápido e forte quando está com pouca vida.'
      }
    ],
    
    // Upgrades organizados por raridade
    upgrades: {
      common: upgrades.filter(u => u.rarity === 'common'),
      uncommon: upgrades.filter(u => u.rarity === 'uncommon'),
      rare: upgrades.filter(u => u.rarity === 'rare'),
      legendary: upgrades.filter(u => u.rarity === 'legendary')
    },
    
    // Mecânicas do jogo atualizadas
    mechanics: {
      enemySpawnRate: 3000,
      enemySpawnRateDecrease: 100,
      minimumSpawnRate: 500,
      hpIncreaseInterval: 30000,
      hpIncrease: 10,
      speedIncreaseInterval: 60000,
      damageIncreaseInterval: 45000,
      damageIncrease: 5,
      followHeight: 300,
      gameStats: {
        totalDamageDealt: 'Dano total causado aos inimigos',
        totalDamageTaken: 'Dano total recebido',
        projectilesFired: 'Projéteis disparados',
        projectileHits: 'Projéteis que atingiram inimigos',
        accuracy: 'Precisão calculada automaticamente'
      },
      specialMechanics: {
        thunderbolt: 'Raio atinge inimigos em linha vertical a cada 8 segundos, causando 15 de dano.',
        wisps: 'Wisps orbitam o jogador e disparam projéteis automáticos.',
        explosion: 'Projéteis explosivos geram 8 mini-projéteis que causam 20% do dano principal.',
        fragmentation: 'Inimigos mortos soltam projéteis que causam 20% do dano do projétil que os matou.',
        projectileCollision: 'Projéteis do jogador e inimigos se anulam ao colidir (exceto fragmentos).',
        autoShoot: 'Upgrade lendário permite disparo automático sem clicar.',
        characterSelection: 'Escolha entre 4 tipos de personagem no início do jogo.',
        startingUpgradeMenus: 'Mystic e Veteran mostram menus de upgrade no início da partida.'
      }
    }
  };
}

function getSpecialFeatures(characterType) {
  const features = {
    speedster: [
      'Alta velocidade de movimento',
      'Pulos mais altos',
      'Ataque rápido',
      'HP reduzido para compensar'
    ],
    heavy: [
      'Dano muito alto',
      'HP elevado',
      'Movimento lento',
      'Ataque lento mas devastador'
    ],
    mystic: [
      'Estatísticas fracas',
      'Começa com 1 upgrade lendário',
      'Menu de seleção no início',
      'Alto risco, alta recompensa'
    ],
    veteran: [
      'Estatísticas fracas',
      'Começa com 3 upgrades',
      'Menus sequenciais no início',
      'Progressão inicial acelerada'
    ]
  };
  return features[characterType] || [];
}

function getEnemyName(type) {
  const names = {
    flyer: 'Voador',
    shooter: 'Atirador',
    tank: 'Tanque',
    dasher: 'Corredor',
    bomber: 'Bombardeiro',
    sniper: 'Franco-atirador',
    swarm: 'Enxame',
    guardian: 'Guardião',
    hunter: 'Caçador',
    berserker: 'Berserker'
  };
  return names[type] || type;
}

function getEnemyDescription(type) {
  const descriptions = {
    flyer: 'Inimigo básico que segue o jogador diretamente. Rápido e ágil, mas frágil.',
    shooter: 'Mantém distância e atira. Moderadamente resistente.',
    tank: 'Pesado e resistente, carrega contra o jogador. Lento mas poderoso.',
    dasher: 'Faz investidas rápidas. Baixa resistência, alta velocidade.',
    bomber: 'Se aproxima e explode causando dano em área.',
    sniper: 'Atira de longe, mira no jogador.',
    swarm: 'Vários inimigos pequenos que atacam em grupo.',
    guardian: 'Possui escudo temporário, resiste a dano.',
    hunter: 'Persegue o jogador agressivamente.',
    berserker: 'Fica mais rápido e forte quando está com pouca vida.'
  };
  return descriptions[type] || 'Descrição não disponível.';
}

function getBehaviorDescription(behavior) {
  const descriptions = {
    follow: 'Segue o jogador diretamente',
    hover: 'Flutua próximo ao jogador',
    charge: 'Carrega contra o jogador',
    dash: 'Faz investidas rápidas'
  };
  return descriptions[behavior] || behavior;
}

// Função para gerar HTML dos inimigos
export function generateEnemiesHTML() {
  const wikiData = generateWikiContent();
  
  return wikiData.enemies.map(enemy => `
    <div class="card enemy-card">
      <h4>${enemy.name}</h4>
      <div class="stats">
        <span class="stat hp">HP Base: ${enemy.baseHp}</span>
        <span class="stat damage">Dano Base: ${enemy.baseDamage}</span>
        <span class="stat speed">Velocidade: ${enemy.baseSpeed}</span>
        <span class="stat behavior">Comportamento: ${getBehaviorDescription(enemy.behavior)}</span>
      </div>
      <p>${enemy.description}</p>
      <div style="margin-top: 10px; font-size: 0.9rem; color: #888;">
        <div>• Cooldown de Tiro: ${enemy.shootCooldown}ms</div>
        <div>• Cor: <span style="color: ${enemy.color};">${enemy.color}</span></div>
      </div>
    </div>
  `).join('');
}

// Função para gerar HTML dos upgrades
export function generateUpgradesHTML() {
  const wikiData = generateWikiContent();
  
  const generateUpgradeCards = (upgrades, rarityClass) => {
    return upgrades.map(upgrade => `
      <div class="card upgrade-card ${rarityClass}">
        <h4>${upgrade.name}</h4>
        <p><strong>Efeito:</strong> ${upgrade.desc}</p>
        <p>Melhoria de ${upgrade.rarity === 'common' ? 'nível básico' : 
          upgrade.rarity === 'uncommon' ? 'nível intermediário' : 
          upgrade.rarity === 'rare' ? 'nível avançado' : 'nível máximo'}.</p>
      </div>
    `).join('');
  };
  
  return {
    common: generateUpgradeCards(wikiData.upgrades.common, 'rarity-common'),
    uncommon: generateUpgradeCards(wikiData.upgrades.uncommon, 'rarity-uncommon'),
    rare: generateUpgradeCards(wikiData.upgrades.rare, 'rarity-rare'),
    legendary: generateUpgradeCards(wikiData.upgrades.legendary, 'rarity-legendary')
  };
}

// Função para gerar informações do jogador
export function generatePlayerHTML() {
  const wikiData = generateWikiContent();
  return `
    <h4>Estatísticas Base (antes da seleção de personagem)</h4>
    <div class="stats">
      <span class="stat hp">HP: ${wikiData.player.baseStats.hp}</span>
      <span class="stat speed">Velocidade: ${wikiData.player.baseStats.speed}</span>
      <span class="stat">Força do Salto: ${wikiData.player.baseStats.jumpPower}</span>
      <span class="stat damage">Dano: ${wikiData.player.baseStats.projectileDamage}</span>
      <span class="stat">Vel. Ataque: ${wikiData.player.baseStats.attackSpeed}ms</span>
    </div>
    
    <h4>Tipos de Personagem Disponíveis</h4>
    <div class="grid">
      ${wikiData.player.types.map(type => `
        <div class="card" style="border-left: 5px solid ${type.color};">
          <h4 style="color: ${type.color};">${type.nome}</h4>
          <p>${type.descricao}</p>
          <div class="stats">
            <span class="stat hp">HP: ${type.stats.hp}/${type.stats.maxHp}</span>
            <span class="stat speed">Velocidade: ${type.stats.speed}</span>
            <span class="stat">Salto: ${type.stats.jumpPower}</span>
            <span class="stat damage">Dano: ${type.stats.projectileDamage}</span>
            <span class="stat">Vel. Ataque: ${type.stats.attackSpeed}ms</span>
          </div>
          ${type.startingUpgrades.length > 0 ? `
            <div style="margin-top: 10px; padding: 8px; background: rgba(255,215,0,0.1); border-radius: 5px;">
              <strong>🌟 Bônus Inicial:</strong> ${type.startingUpgrades.join(', ')}
            </div>
          ` : ''}
          <div style="margin-top: 10px;">
            <strong>Características:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${type.specialFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>
    
    <h4>Sistema de Estatísticas</h4>
    <div class="tip-item">
      <strong>Dano Total Causado:</strong> Rastreia todo o dano causado aos inimigos durante a partida.
    </div>
    <div class="tip-item">
      <strong>Dano Total Recebido:</strong> Rastreia todo o dano recebido de inimigos e projéteis.
    </div>
    <div class="tip-item">
      <strong>Precisão:</strong> Calculada automaticamente baseada em projéteis disparados vs projéteis que atingiram inimigos.
    </div>
  `;
}

// Função para gerar controles
export function generateControlsHTML() {
  return `
    <div class="control-item">
      <span class="control-key">A</span><span class="control-key">D</span>
      <div>Movimento Horizontal</div>
    </div>
    <div class="control-item">
      <span class="control-key">Espaço</span>
      <div>Pular</div>
    </div>
    <div class="control-item">
      <span class="control-key">Mouse</span>
      <div>Mirar e Atirar</div>
    </div>
    <div class="control-item">
      <span class="control-key">ESC</span>
      <div>Pausar/Despausar</div>
    </div>
  `;
}

// Adiciona explicação das dificuldades na wiki
export function generateDifficultyHTML() {
  return `
    <h3>⚡ Dificuldades Disponíveis</h3>
    <div class="tip-item"><strong>Fácil:</strong> Inimigos com pouca vida, dano e velocidade. EXP aumentada.</div>
    <div class="tip-item"><strong>Normal:</strong> Desafio elevado, inimigos com vida, dano e velocidade bem maiores. EXP reduzida.</div>
    <div class="tip-item"><strong>Difícil:</strong> Inimigos muito resistentes e rápidos, dano alto. EXP menor.</div>
    <div class="tip-item"><strong>Muito Difícil:</strong> Inimigos extremamente fortes, rápidos e com pouco EXP.</div>
    <div class="tip-item"><strong>Impossível:</strong> Experiência extrema, inimigos quase invencíveis, dano altíssimo, EXP mínima.</div>
    <div style="margin-top:10px; font-size:0.95rem; color:#ffaa00;">A dificuldade afeta vida, dano, velocidade dos inimigos e a quantidade de EXP recebida!</div>
  `;
}

// Função para gerar dicas baseadas nas mecânicas do jogo
export function generateTipsHTML() {
  const wikiData = generateWikiContent();
  return `
    <h3>💡 Dicas Estratégicas Avançadas</h3>
    ${generateDifficultyHTML()}
    
    <h4>🎮 Escolha de Personagem</h4>
    <div class="tip-item">
      <strong>Speedster:</strong> Ideal para jogadores que preferem mobilidade e esquiva. Use a velocidade para evitar ataques.
    </div>
    <div class="tip-item">
      <strong>Heavy Gunner:</strong> Para jogadores que preferem eliminar inimigos rapidamente. Use o alto dano e HP para resistir.
    </div>
    <div class="tip-item">
      <strong>Mystic:</strong> Para jogadores experientes que querem tentar builds arriscadas com upgrades lendários.
    </div>
    <div class="tip-item">
      <strong>Veteran:</strong> Para jogadores que querem uma progressão inicial acelerada com múltiplos upgrades.
    </div>
    
    <h4>⚔️ Escalada de Dificuldade</h4>
    <div class="tip-item">
      <strong>HP dos Inimigos:</strong> Aumenta +${wikiData.mechanics.hpIncrease} a cada ${wikiData.mechanics.hpIncreaseInterval/1000}s
    </div>
    <div class="tip-item">
      <strong>Velocidade:</strong> Aumenta a cada ${wikiData.mechanics.speedIncreaseInterval/1000}s  
    </div>
    <div class="tip-item">
      <strong>Dano:</strong> Aumenta +${wikiData.mechanics.damageIncrease} a cada ${wikiData.mechanics.damageIncreaseInterval/1000}s
    </div>
    <div class="tip-item">
      <strong>Taxa de Spawn:</strong> Começa em ${wikiData.mechanics.enemySpawnRate}ms, diminui ${wikiData.mechanics.enemySpawnRateDecrease}ms a cada 10s (mínimo ${wikiData.mechanics.minimumSpawnRate}ms)
    </div>
    
    <h4>🌟 Builds Recomendadas</h4>
    <div class="tip-item">
      <strong>Build de Movimento:</strong> Combine Velocidade Suprema + Atrito Supremo para dano passivo enquanto se move.
    </div>
    <div class="tip-item">
      <strong>Build de Crítico:</strong> Crítico Supremo + Precisão + Catalisador Supremo para dano massivo.
    </div>
    <div class="tip-item">
      <strong>Build de Sobrevivência:</strong> Vampiro + Crescimento++ + Barreira para máxima resistência.
    </div>
    <div class="tip-item">
      <strong>Build de Auto-Ataque:</strong> Auto-Tiro + Wisps + Thunderbolt para ataque automático completo.
    </div>
  `;
}
