import React from 'react';
import GuildLobby from './pages/GuildLobby';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateGuild from './pages/CreateGuild';
import JoinGuild from './pages/JoinGuild';
import CodeInput from './pages/CodeInput';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-guild" element={<CreateGuild />} />
        <Route path="/join-guild" element={<JoinGuild />} />
        <Route path="/guild-lobby" element={<GuildLobby />} />
        <Route path="/code-input" element={<CodeInput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;