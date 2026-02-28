import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Tree({ left, height = 120 }) {
  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left }}>
      <div style={{ width: '60px', height: '60px', backgroundColor: '#2D5A1B', boxShadow: '4px 4px 0 #1a3a0e, -4px 4px 0 #1a3a0e' }} />
      <div style={{ width: '80px', height: '50px', backgroundColor: '#3A7A24', boxShadow: '4px 4px 0 #2D5A1B, -4px 4px 0 #2D5A1B', marginTop: '-10px' }} />
      <div style={{ width: '100px', height: '50px', backgroundColor: '#4A9A2E', marginTop: '-10px' }} />
      <div style={{ width: '24px', height: `${height - 100}px`, backgroundColor: '#6B3E1E', borderLeft: '4px solid #4a2a10' }} />
    </div>
  );
}

function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '6px', height: '6px',
        backgroundColor: '#FFE566',
        boxShadow: '0 0 6px 3px rgba(255,229,102,0.8)',
        ...style,
      }}
    />
  );
}

function CreateGuild() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [guildName, setGuildName] = useState('');

  const fireflies = [
    { top: '15%', left: '12%', animationDelay: '0s' },
    { top: '40%', left: '8%', animationDelay: '0.7s' },
    { top: '65%', left: '15%', animationDelay: '1.2s' },
    { top: '20%', left: '80%', animationDelay: '0.4s' },
    { top: '50%', left: '88%', animationDelay: '0.9s' },
    { top: '70%', left: '75%', animationDelay: '1.5s' },
    { top: '30%', left: '50%', animationDelay: '0.6s' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0D1F0D' }}
    >
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a1a2e 0%, #0D1F0D 60%, #1a3a0e 100%)',
      }} />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: i % 3 === 0 ? '3px' : '2px',
          height: i % 3 === 0 ? '3px' : '2px',
          backgroundColor: '#fff',
          top: `${(i * 13) % 40}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.5,
        }} />
      ))}

      {/* Moon */}
      <div className="absolute" style={{
        top: '40px', right: '120px',
        width: '50px', height: '50px',
        backgroundColor: '#FFF5C0',
        boxShadow: '0 0 20px 8px rgba(255,245,192,0.3)',
      }} />

      {/* Trees */}
      <Tree left="0px" height={160} />
      <Tree left="90px" height={130} />
      <Tree left="calc(100% - 100px)" height={160} />
      <Tree left="calc(100% - 190px)" height={140} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ backgroundColor: '#1a3a0e' }} />
      <div className="absolute bottom-16 left-0 right-0 h-4" style={{ backgroundColor: '#2D5A1B' }} />

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Card */}
      <div
        className="z-10 flex flex-col w-96 p-8"
        style={{
          backgroundColor: '#1E3A1E',
          border: '4px solid #A8FF3E',
          boxShadow: '6px 6px 0px #2D5A1B, 0 0 20px rgba(168,255,62,0.15)',
        }}
      >
        {/* Title */}
        <h1
          className="text-xl font-bold text-center mb-1"
          style={{ color: '#A8FF3E', textShadow: '3px 3px 0px #2D5A1B' }}
        >
          ⚔️ CREATE GUILD
        </h1>
        <p className="text-center text-xs mb-6" style={{ color: '#FFE566' }}>
          Set up your guild and invite friends
        </p>

        {/* Player Name */}
        <label className="text-xs mb-2" style={{ color: '#A8FF3E' }}>
          YOUR NAME
        </label>
        <input
          type="text"
          placeholder="Enter player name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="mb-5 px-3 py-3 text-xs outline-none"
          style={{
            backgroundColor: '#0D1F0D',
            border: '4px solid #A8FF3E',
            color: '#A8FF3E',
            letterSpacing: '1px',
          }}
        />

        {/* Guild Name */}
        <label className="text-xs mb-2" style={{ color: '#A8FF3E' }}>
          GUILD NAME
        </label>
        <input
          type="text"
          placeholder="Enter guild name..."
          value={guildName}
          onChange={(e) => setGuildName(e.target.value)}
          className="mb-8 px-3 py-3 text-xs outline-none"
          style={{
            backgroundColor: '#0D1F0D',
            border: '4px solid #A8FF3E',
            color: '#A8FF3E',
            letterSpacing: '1px',
          }}
        />

        {/* Create Button */}
        <button
          disabled={!playerName || !guildName}
          className="w-full py-4 text-xs font-bold mb-4 transition-all active:translate-y-1"
          style={{
            backgroundColor: !playerName || !guildName ? '#2D5A1B' : '#A8FF3E',
            border: `4px solid ${!playerName || !guildName ? '#1a3a0e' : '#2D5A1B'}`,
            boxShadow: !playerName || !guildName ? 'none' : '4px 4px 0px #2D5A1B',
            color: !playerName || !guildName ? '#4A9A2E' : '#0D1F0D',
            cursor: !playerName || !guildName ? 'not-allowed' : 'pointer',
            letterSpacing: '1px',
          }}
          onMouseEnter={e => { if (playerName && guildName) e.target.style.backgroundColor = '#c4ff6e' }}
          onMouseLeave={e => { if (playerName && guildName) e.target.style.backgroundColor = '#A8FF3E' }}
        >
          ⚔️ CREATE GUILD
        </button>

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="text-xs text-center transition-all"
          style={{ color: '#4A9A2E', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = '#A8FF3E'}
          onMouseLeave={e => e.target.style.color = '#4A9A2E'}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default CreateGuild;