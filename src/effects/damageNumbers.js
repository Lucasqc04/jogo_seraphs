import { damageNumbers, screenShakeIntensity } from '../game/gameState.js';

// Damage numbers
export function createDamageNumber(x, y, damage, color) {
  damageNumbers.push({
    x: x,
    y: y,
    damage: Math.ceil(damage),
    color: color,
    life: 60,
    vy: -2
  });
}

// Screen shake function
export function screenShake(intensity) {
  screenShakeIntensity = intensity;
  setTimeout(() => {
    screenShakeIntensity = Math.max(0, screenShakeIntensity - 1);
    if (screenShakeIntensity > 0) screenShake(screenShakeIntensity);
  }, 50);
}
