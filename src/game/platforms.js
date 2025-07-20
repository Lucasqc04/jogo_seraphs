// Platform blocks (stepped ground)
export const platforms = [
  { x: 0, y: 600, width: 200, height: 100 },
  { x: 200, y: 550, width: 200, height: 150 },
  { x: 400, y: 500, width: 200, height: 200 },
  { x: 600, y: 450, width: 200, height: 250 },
  { x: 800, y: 500, width: 200, height: 200 },
  { x: 1000, y: 550, width: 200, height: 150 }
];

// Get ground level at any x position
export function getGroundLevel(x) {
  for (let platform of platforms) {
    if (x >= platform.x && x <= platform.x + platform.width) {
      return platform.y;
    }
  }
  return 700; // Default ground level
}

// Check if point is underground
export function isUnderground(x, y) {
  return y > getGroundLevel(x);
}
