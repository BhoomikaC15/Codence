import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateGuild from './pages/CreateGuild';
import JoinGuild from './pages/JoinGuild';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-guild" element={<CreateGuild />} />
        <Route path="/join-guild" element={<JoinGuild />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;