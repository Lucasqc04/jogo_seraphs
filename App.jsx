import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WikiPage from './components/WikiPage.jsx';
// ...importe outros componentes do seu app, ex: GamePage

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal do jogo */}
        {/* <Route path="/" element={<GamePage />} /> */}
        <Route path="/wiki" element={<WikiPage />} />
        {/* Outras rotas... */}
      </Routes>
    </Router>
  );
}
