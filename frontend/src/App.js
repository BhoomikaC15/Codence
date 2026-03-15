import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './Components/PageTransition';
import LandingPage from './pages/LandingPage';
import CreateGuild from './pages/CreateGuild';
import JoinGuild from './pages/JoinGuild';
import GuildLobby from './pages/GuildLobby';
import CodeInput from './pages/CodeInput';
import Explanation from './pages/Explanation';
import Game from './pages/Game';
import Quiz from './pages/Quiz';
import Results from './pages/Results';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/create-guild" element={<PageTransition><CreateGuild /></PageTransition>} />
        <Route path="/join-guild" element={<PageTransition><JoinGuild /></PageTransition>} />
        <Route path="/guild-lobby" element={<PageTransition><GuildLobby /></PageTransition>} />
        <Route path="/code-input" element={<PageTransition><CodeInput /></PageTransition>} />
        <Route path="/explanation" element={<PageTransition><Explanation /></PageTransition>} />
        <Route path="/game" element={<PageTransition><Game /></PageTransition>} />
        <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
        <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;