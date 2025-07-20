// Tipos de personagem disponíveis
export const playerTypes = {
  speedster: {
    name: 'Speedster',
    description: 'Rápido e ágil, mas com dano moderado',
    color: '#00FFFF',
    stats: {
      speed: 7,
      jumpPower: 18,
      projectileDamage: 8,
      attackSpeed: 150,
      hp: 90,
      maxHp: 90
    }
  },
  heavy: {
    name: 'Heavy Gunner',
    description: 'Lento mas com alto dano',
    color: '#FF6600',
    stats: {
      speed: 3,
      jumpPower: 12,
      projectileDamage: 20,
      attackSpeed: 400,
      hp: 130,
      maxHp: 130
    }
  },
  mystic: {
    name: 'Mystic',
    description: 'Fraco mas começa com poder lendário',
    color: '#FF00FF',
    stats: {
      speed: 4,
      jumpPower: 10,
      projectileDamage: 6,
      attackSpeed: 300,
      hp: 70,
      maxHp: 70
    },
    startingUpgrades: ['legendary']
  },
  veteran: {
    name: 'Veteran',
    description: 'Fraco mas experiente com múltiplos upgrades',
    color: '#00FF00',
    stats: {
      speed: 4.5,
      jumpPower: 11,
      projectileDamage: 7,
      attackSpeed: 250,
      hp: 80,
      maxHp: 80
    },
    startingUpgrades: ['common', 'uncommon', 'rare']
  }
};

// Função para aplicar estatísticas do tipo de personagem
export async function applyPlayerType(player, type) {
  const playerType = playerTypes[type];
  if (!playerType) return;
  
  Object.assign(player, playerType.stats);
  player.selectedType = type;
  player.typeName = playerType.name;
  player.typeColor = playerType.color;
  
  // Aplicar upgrades iniciais se existirem
  if (playerType.startingUpgrades) {
    await applyStartingUpgrades(player, playerType.startingUpgrades);
  }
}

// Função para aplicar upgrades iniciais
export async function applyStartingUpgrades(player, upgradeTypes) {
  // Para personagens especiais, marcar que devem mostrar menus de upgrade
  if (upgradeTypes.includes('legendary') || upgradeTypes.length > 1) {
    player.showStartingUpgradeMenus = upgradeTypes;
    return; // Não aplicar agora, será aplicado quando mostrar os menus
  }
  
  // Para outros casos, aplicar normalmente
  const { upgrades } = await import('../game/upgrades.js');
  
  upgradeTypes.forEach(rarity => {
    const availableUpgrades = upgrades.filter(u => u.rarity === rarity);
    if (availableUpgrades.length > 0) {
      const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
      randomUpgrade.effect(player);
    }
  });
}

// Função para obter multiplicadores de upgrade baseados no tipo
export function getUpgradeMultiplier(playerType, upgradeName) {
  const multipliers = {
    speedster: {
      'Swift': 1.5,        // Speedster ganha mais velocidade
      'Resonance': 1.3,    // Melhor velocidade de ataque
      'Impulse': 1.4,      // Melhor salto
      'Catalyst': 0.8      // Menos dano base
    },
    heavy: {
      'Catalyst': 1.5,     // Heavy ganha mais dano
      'Growth': 1.3,       // Mais HP
      'Resist': 1.4,       // Melhor defesa
      'Swift': 0.6,        // Menos velocidade
      'Resonance': 0.7     // Menos velocidade de ataque
    }
  };
  
  return multipliers[playerType]?.[upgradeName] || 1.0;
}
