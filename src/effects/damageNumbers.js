import { damageNumbers, setScreenShakeIntensity } from '../game/gameState.js';

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
setScreenShakeIntensity(intensity);
setTimeout(() => {
  setScreenShakeIntensity(Math.max(0, intensity - 1));
  if (intensity > 1) screenShake(intensity - 1);
}, 50);
}
