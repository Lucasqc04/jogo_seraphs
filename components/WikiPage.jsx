import React, { useEffect, useState } from 'react';

// Importa as funções de geração da wiki
import {
  generatePlayerHTML,
  generateControlsHTML,
  generateEnemiesHTML,
  generateUpgradesHTML,
  generateTipsHTML
} from '../src/utils/wikiGenerator.js';

// Componente para renderizar HTML dinâmico com segurança
function RenderHTML({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function WikiPage() {
  const [playerHTML, setPlayerHTML] = useState('');
  const [controlsHTML, setControlsHTML] = useState('');
  const [enemiesHTML, setEnemiesHTML] = useState('');
  const [upgradesHTML, setUpgradesHTML] = useState({ common: '', uncommon: '', rare: '', legendary: '' });
  const [tipsHTML, setTipsHTML] = useState('');

  useEffect(() => {
    setPlayerHTML(generatePlayerHTML());
    setControlsHTML(generateControlsHTML());
    setEnemiesHTML(generateEnemiesHTML());
    setUpgradesHTML(generateUpgradesHTML());
    setTipsHTML(generateTipsHTML());
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', color: '#e0e0e0', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <header style={{ background: 'linear-gradient(90deg, #000428, #004e92)', padding: '2rem 0', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,255,255,0.3)', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#00ffff', textShadow: '0 0 30px #00ffff, 0 0 60px #00ffff', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>NEON PLATFORMER</h1>
        <p style={{ fontSize: '1.2rem', color: '#88ccff', position: 'relative', zIndex: 1 }}>Wiki Dinâmica do Jogo</p>
      </header>

      <nav style={{ background: 'rgba(0,0,0,0.8)', padding: '1rem', margin: '2rem 0', borderRadius: 15, border: '2px solid #00ffff', boxShadow: '0 0 20px rgba(0,255,255,0.2)', position: 'sticky', top: 20, zIndex: 100 }}>
        <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', padding: 0 }}>
          <li><a href="#player" style={navLinkStyle}>🎮 Personagens</a></li>
          <li><a href="#controls" style={navLinkStyle}>🕹️ Controles</a></li>
          <li><a href="#enemies" style={navLinkStyle}>👹 Inimigos</a></li>
          <li><a href="#upgrades" style={navLinkStyle}>⭐ Upgrades</a></li>
          <li><a href="#mechanics" style={navLinkStyle}>⚡ Mecânicas</a></li>
          <li><a href="#tips" style={navLinkStyle}>💡 Dicas</a></li>
        </ul>
      </nav>

      <section id="player" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>🎮 PERSONAGENS</h2>
        <p>Escolha entre 4 tipos únicos de personagem, cada um com estatísticas e características especiais!</p>
        <div className="card">
          <RenderHTML html={playerHTML} />
        </div>
      </section>

      <section id="controls" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>🕹️ CONTROLES</h2>
        <p>Domine os controles para sobreviver às ondas de inimigos!</p>
        <div className="controls">
          <RenderHTML html={controlsHTML} />
        </div>
      </section>

      <section id="enemies" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>👹 INIMIGOS</h2>
        <p>Os inimigos aparecem no topo da tela e descem até a altura configurada, onde ficam flutuando e atirando. Cada tipo tem comportamentos únicos e suas estatísticas aumentam com o tempo!</p>
        <div className="grid">
          <RenderHTML html={enemiesHTML} />
        </div>
      </section>

      <section id="upgrades" style={sectionStyle}>
        <h2 style={sectionTitleStyle}>⭐ SISTEMA DE UPGRADES</h2>
        <p>A cada nível você pode escolher entre upgrades aleatórios. Existem 4 raridades diferentes, cada uma com efeitos mais poderosos!</p>
        <h3 style={upgradeTitleStyle}>🔵 Upgrades Comuns</h3>
        <div className="grid">
          <RenderHTML html={upgradesHTML.common} />
        </div>
        <h3 style={upgradeTitleStyle}>🟢 Upgrades Incomuns</h3>
        <div className="grid">
          <RenderHTML html={upgradesHTML.uncommon} />
        </div>
        <h3 style={upgradeTitleStyle}>🔵 Upgrades Raros</h3>
        <div className="grid">
          <RenderHTML html={upgradesHTML.rare} />
        </div>
        <h3 style={upgradeTitleStyle}>🟠 Upgrades Lendários</h3>
        <div className="grid">
          <RenderHTML html={upgradesHTML.legendary} />
        </div>
      </section>

      <section id="tips" style={sectionStyle}>
        <div className="tips">
          <RenderHTML html={tipsHTML} />
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(90deg, #000428, #004e92)', marginTop: '4rem', borderTop: '3px solid #00ffff' }}>
        <h2>Pronto para a Batalha?</h2>
        <p>Use essas informações para dominar o Neon Platformer!</p>
        <a href="/" className="back-to-game" style={{ display: 'inline-block', background: 'linear-gradient(45deg, #00ff00, #00aa00)', color: '#000', padding: '1rem 2rem', textDecoration: 'none', borderRadius: 10, fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 20px rgba(0,255,0,0.5)', transition: 'all 0.3s ease' }}>🎮 VOLTAR AO JOGO</a>
      </footer>
    </div>
  );
}

const navLinkStyle = {
  color: '#00ffff',
  textDecoration: 'none',
  padding: '0.5rem 1.5rem',
  border: '2px solid #00ffff',
  borderRadius: 25,
  transition: 'all 0.3s ease',
  background: 'rgba(0,255,255,0.1)'
};

const sectionStyle = {
  margin: '3rem 0',
  padding: '2rem',
  background: 'rgba(0,0,0,0.6)',
  borderRadius: 20,
  border: '2px solid #444',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  position: 'relative',
  overflow: 'hidden'
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  color: '#ffff00',
  textShadow: '0 0 20px #ffff00',
  marginBottom: '1.5rem',
  textAlign: 'center'
};

const upgradeTitleStyle = {
  fontSize: '1.8rem',
  color: '#00ff00',
  textShadow: '0 0 15px #00ff00',
  margin: '2rem 0 1rem 0'
};
