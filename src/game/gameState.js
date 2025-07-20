// Game state and variables
export const gameState = {
  screen: 'start', // 'start', 'playing', 'paused'
  canvas: null,
  ctx: null,
  gameRunning: false,
  keys: {},
  mouse: { x: 0, y: 0, down: false },
  lastShot: 0,
  gameTime: 0,
  startTime: 0,
  wave: 1,
  kills: 0,
  lastSave: 0,
  lastEnemySpawn: 0,
  enemySpawnRate: 3000
};

// Game arrays
export let enemies = [];
export let projectiles = [];
export let enemyProjectiles = [];
export let pickups = [];
export let thunderbolts = [];
export let damageNumbers = [];

// Screen shake
export let screenShakeIntensity = 0;

export function screenShake(intensity) {
  screenShakeIntensity = intensity;
  setTimeout(() => {
    screenShakeIntensity = Math.max(0, screenShakeIntensity - 1);
    if (screenShakeIntensity > 0) screenShake(screenShakeIntensity);
  }, 50);
}

// Reset game arrays
export function resetGameArrays() {
  enemies.length = 0;
  projectiles.length = 0;
  enemyProjectiles.length = 0;
  pickups.length = 0;
  thunderbolts.length = 0;
  damageNumbers.length = 0;
}
