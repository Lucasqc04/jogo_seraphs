// Upgrade definitions with rarity
export const upgrades = [
  // Common upgrades
  { name: "Catalisador", desc: "Dano dos Projéteis +2", rarity: "common", effect: (player) => player.projectileDamage += 2 },
  { name: "Visão", desc: "Chance de Crítico +5%", rarity: "common", effect: (player) => player.critChance += 0.05 },
  { name: "Crescimento", desc: "HP Máximo +10", rarity: "common", effect: (player) => { player.maxHp += 10; player.hp += 10; } },
  { name: "Impulso", desc: "Altura do Salto +30%", rarity: "common", effect: (player) => player.jumpPower *= 1.3 },
  { name: "Renovar", desc: "Curar até o HP Máximo", rarity: "common", effect: (player) => player.hp = player.maxHp },
  { name: "Resistir", desc: "Defesa +4%", rarity: "common", effect: (player) => player.defense += 0.04 },
  { name: "Ressonância", desc: "Vel. de Ataque +12%", rarity: "common", effect: (player) => player.attackSpeed *= 0.88 },
  { name: "Almas", desc: "Chance de orbe de alma +1%", rarity: "common", effect: (player) => player.soulDropChance += 0.01 },
  { name: "Estabilidade", desc: "Projétil aguenta +1 hit", rarity: "common", effect: (player) => player.projectileHits += 1 },
  { name: "Velocidade", desc: "Velocidade de Movimento +20%", rarity: "common", effect: (player) => player.speed *= 1.2 },
  // Aumenta o tamanho dos projéteis do jogador
  { name: "Projétil Maior", desc: "Aumenta o tamanho dos projéteis em 30%", rarity: "common", effect: (player) => player.projectileSize *= 1.3 },
  
  // Uncommon upgrades
  { name: "Catalisador+", desc: "Dano dos Projéteis +4", rarity: "uncommon", effect: (player) => player.projectileDamage += 4 },
  { name: "Carga", desc: "Tamanho dos Projéteis +20%", rarity: "uncommon", effect: (player) => player.projectileSize *= 1.2 },
  { name: "Manto", desc: "Invulnerabilidade +10% duração", rarity: "uncommon", effect: (player) => player.invulnTime *= 1.1 },
  { name: "Fragmentação", desc: "Inimigos soltam 2 projéteis fracos", rarity: "uncommon", effect: (player) => player.fragmentation = Math.min(player.fragmentation + 2, 6) },
  { name: "Crescimento+", desc: "HP Máximo +20", rarity: "uncommon", effect: (player) => { player.maxHp += 20; player.hp += 20; } },
  { name: "Jorro", desc: "Adiciona +1 Salto", rarity: "uncommon", effect: (player) => player.maxJumps += 1 },
  { name: "Sanguessuga", desc: "Roubo de Vida 3% do Dano", rarity: "uncommon", effect: (player) => player.lifeSteal += 0.03 },
  { name: "Sorte", desc: "Maior chance de itens incomuns", rarity: "uncommon", effect: (player) => player.luck += 0.1 },
  { name: "Orbe", desc: "5% chance de orbe de cura", rarity: "uncommon", effect: (player) => player.healingOrbChance += 0.05 },
  { name: "Precisão", desc: "Crítico +50% de dano", rarity: "uncommon", effect: (player) => player.critDamage += 0.5 },
  { name: "Fúria", desc: "HP baixo aumenta dano", rarity: "uncommon", effect: (player) => player.rage = true },
  { name: "Regeneração", desc: "Regenera HP baseado em inimigos", rarity: "uncommon", effect: (player) => player.regrowth = true },
  { name: "Ressonância+", desc: "Vel. de Ataque +24%", rarity: "uncommon", effect: (player) => player.attackSpeed *= 0.76 },
  { name: "Encolher", desc: "Te deixa 10% menor", rarity: "uncommon", effect: (player) => { player.width *= 0.9; player.height *= 0.9; } },
  { name: "Velocidade+", desc: "Velocidade de Movimento +40%", rarity: "uncommon", effect: (player) => player.speed *= 1.4 },
  
  // Rare upgrades
  { name: "Avaliação", desc: "+1 opção de upgrade", rarity: "rare", effect: (player) => player.upgradeChoices += 1 },
  { name: "Barreira", desc: "Escudo bloqueia dano periodicamente", rarity: "rare", effect: (player) => player.barrier = true },
  { name: "Frio", desc: "Inimigos ficam lentos ao receber dano", rarity: "rare", effect: (player) => player.cold = true },
  { name: "Fragmentação+", desc: "Inimigos soltam 6 projéteis fracos que atingem apenas outros inimigos", rarity: "rare", effect: (player) => { player.fragmentation = 6; player.fragmentationHitsEnemiesOnly = true; } },
  { name: "Foco", desc: "Vel. de ataque quando parado", rarity: "rare", effect: (player) => player.focus = true },
  { name: "Crescimento++", desc: "HP Máximo +40", rarity: "rare", effect: (player) => { player.maxHp += 40; player.hp += 40; } },
  { name: "Sanguessuga+", desc: "Roubo de Vida 9% do Dano", rarity: "rare", effect: (player) => player.lifeSteal += 0.09 },
  { name: "Superaquecimento", desc: "Corpo causa 40 de dano por contato", rarity: "rare", effect: (player) => player.bodyDamage += 40 },
  { name: "Tomo", desc: "Itens comuns 35% mais efetivos", rarity: "rare", effect: (player) => player.tome = true },
  { name: "Fogo-Fátuo", desc: "Invoca um espírito atacante", rarity: "rare", effect: (player) => player.wisps += 1 },
  { name: "Ferida", desc: "Dano aplica sangramento", rarity: "rare", effect: (player) => player.wound = true },
    { name: "Raio", desc: "2 raios a cada 8 segundos", rarity: "rare", effect: (player) => player.thunderbolt = Math.min(player.thunderbolt + 2, 8) },

  
  // Legendary upgrades
  { name: "Imortal", desc: "+1 Revive (mata todos os inimigos)", rarity: "legendary", effect: (player) => { player.revives += 1; } },
  { name: "Auto-Tiro", desc: "Tiro automático lendário: não precisa clicar para atirar", rarity: "legendary", effect: (player) => { player.autoShoot = true; } },
  { name: "Atrito Supremo", desc: "Cada metro corrido lança 2 projéteis explosivos", rarity: "legendary", effect: (player) => player.friction = 2 },
  { name: "Velocidade Suprema", desc: "Velocidade de Movimento +100%", rarity: "legendary", effect: (player) => player.speed *= 2.0 },
  { name: "Catalisador Supremo", desc: "Dano dos Projéteis +10", rarity: "legendary", effect: (player) => player.projectileDamage += 10 },
  { name: "Crítico Supremo", desc: "Chance de Crítico +25% e Dano Crítico +100%", rarity: "legendary", effect: (player) => { player.critChance += 0.25; player.critDamage += 1.0; } },
  { name: "Ressonância Suprema", desc: "Velocidade de Ataque +50%", rarity: "legendary", effect: (player) => player.attackSpeed *= 0.5 },
  { name: "Gigante", desc: "Projéteis +200% de tamanho e +5 dano", rarity: "legendary", effect: (player) => { player.projectileSize *= 3.0; player.projectileDamage += 5; } },
  { name: "Multi-Salto", desc: "+3 Saltos adicionais", rarity: "legendary", effect: (player) => player.maxJumps += 3 },
  { name: "Vampiro", desc: "Roubo de Vida 25% do Dano", rarity: "legendary", effect: (player) => player.lifeSteal += 0.25 },
  { name: "Raio+", desc: "6 raios a cada 8 segundos", rarity: "legendary", effect: (player) => player.thunderbolt = 6 },

];
