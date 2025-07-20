// Sound system
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function playSound(type) {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  const sounds = {
    shoot: { freq: 800, duration: 0.1, type: 'square' },
    hit: { freq: 200, duration: 0.2, type: 'sawtooth' },
    enemyDie: { freq: 150, duration: 0.3, type: 'triangle' },
    levelup: { freq: 600, duration: 0.5, type: 'sine' },
    jump: { freq: 400, duration: 0.15, type: 'square' },
    enemyShoot: { freq: 300, duration: 0.1, type: 'sawtooth' },
    thunder: { freq: 100, duration: 0.4, type: 'sawtooth' },
    shield: { freq: 1000, duration: 0.2, type: 'sine' },
    revive: { freq: 800, duration: 0.8, type: 'sine' },
    upgrade: { freq: 1200, duration: 0.3, type: 'sine' }
  };
  
  const sound = sounds[type] || sounds.shoot;
  
  oscillator.frequency.setValueAtTime(sound.freq, audioContext.currentTime);
  oscillator.type = sound.type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + sound.duration);
}
