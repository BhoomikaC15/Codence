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

// Pixel campfire
function Campfire() {
  return (
    <div className="absolute bottom-20 left-1/2 flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
      {/* Flames */}
      <div className="flex gap-1 animate-pulse">
        <div style={{ width: '10px', height: '20px', backgroundColor: '#FF4500', boxShadow: '0 0 8px 4px rgba(255,69,0,0.6)' }} />
        <div style={{ width: '10px', height: '30px', backgroundColor: '#FF6B00', marginTop: '-10px', boxShadow: '0 0 10px 5px rgba(255,107,0,0.7)' }} />
        <div style={{ width: '10px', height: '20px', backgroundColor: '#FF4500', boxShadow: '0 0 8px 4px rgba(255,69,0,0.6)' }} />
      </div>
      {/* Logs */}
      <div className="flex gap-1 mt-1">
        <div style={{ width: '35px', height: '8px', backgroundColor: '#6B3E1E', transform: 'rotate(-20deg)' }} />
        <div style={{ width: '35px', height: '8px', backgroundColor: '#4a2a10', transform: 'rotate(20deg)' }} />
      </div>
    </div>
  );
}

// Player colors
const PLAYER_COLORS = ['#FF6B6B', '#6BC5FF', '#A8FF3E', '#FFE566', '#FF9EFF', '#FF9A3C'];

// Mock players for UI (will be replaced with real socket data later)
const mockPlayers = [
  { id: 1, name: 'Bhoomika (You)', isHost: true },
  { id: 2, name: 'Disha', isHost: false },
];

function GuildLobby() {
  const navigate = useNavigate();
  const roomCode = 'XK92F'; // Will be dynamic later
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fireflies = [
    { top: '10%', left: '10%', animationDelay: '0s' },
    { top: '25%', left: '6%', animationDelay: '0.7s' },
    { top: '55%', left: '12%', animationDelay: '1.2s' },
    { top: '15%', left: '82%', animationDelay: '0.4s' },
    { top: '45%', left: '90%', animationDelay: '0.9s' },
    { top: '65%', left: '78%', animationDelay: '1.5s' },
    { top: '35%', left: '48%', animationDelay: '0.6s' },
    { top: '75%', left: '30%', animationDelay: '1.1s' },
    { top: '20%', left: '60%', animationDelay: '0.3s' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0D1F0D' }}
    >
      {/* Sky — warm orange tint for campfire mood */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a1a2e 0%, #0D1F0D 60%, #1a3a0e 100%)',
      }} />

      {/* Campfire glow on ground */}
      <div className="absolute" style={{
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '60px',
        background: 'radial-gradient(ellipse, rgba(255,107,0,0.3) 0%, transparent 70%)',
      }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '2px', height: '2px',
          backgroundColor: '#fff',
          top: `${(i * 13) % 35}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.4,
        }} />
      ))}

      {/* Moon — slightly orange tinted */}
      <div className="absolute" style={{
        top: '40px', right: '120px',
        width: '50px', height: '50px',
        backgroundColor: '#FFD580',
        boxShadow: '0 0 20px 8px rgba(255,213,128,0.3)',
      }} />

      {/* Trees */}
      <Tree left="0px" height={160} />
      <Tree left="90px" height={130} />
      <Tree left="calc(100% - 100px)" height={160} />
      <Tree left="calc(100% - 190px)" height={140} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ backgroundColor: '#1a3a0e' }} />
      <div className="absolute bottom-16 left-0 right-0 h-4" style={{ backgroundColor: '#2D5A1B' }} />

      {/* Campfire */}
      <Campfire />

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg px-4">

        {/* Title */}
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: '#FF9A3C', textShadow: '3px 3px 0px #7a3a00' }}
        >
          🔥 GUILD LOBBY
        </h1>

        {/* Room code card */}
        <div
          className="w-full p-4 mb-4 flex flex-col items-center"
          style={{
            backgroundColor: '#1E1200',
            border: '4px solid #FF9A3C',
            boxShadow: '6px 6px 0px #7a3a00',
          }}
        >
          <p className="text-xs mb-2" style={{ color: '#FF9A3C' }}>ROOM CODE</p>
          <div className="flex items-center gap-4">
            <span
              className="text-3xl font-bold tracking-widest"
              style={{ color: '#FFE566', textShadow: '2px 2px 0px #8B6914' }}
            >
              {roomCode}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-bold transition-all active:translate-y-1"
              style={{
                backgroundColor: copied ? '#A8FF3E' : '#FF9A3C',
                border: '3px solid #7a3a00',
                boxShadow: '3px 3px 0px #7a3a00',
                color: '#0D1F0D',
                cursor: 'pointer',
              }}
            >
              {copied ? '✅ COPIED!' : '📋 COPY'}
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: '#7a5a00' }}>
            Share this code with your guild members
          </p>
        </div>

        {/* Players card */}
        <div
          className="w-full p-4 mb-4"
          style={{
            backgroundColor: '#1E1200',
            border: '4px solid #FF9A3C',
            boxShadow: '6px 6px 0px #7a3a00',
          }}
        >
          <p className="text-xs mb-3" style={{ color: '#FF9A3C' }}>
            👥 PLAYERS ({mockPlayers.length}/6)
          </p>

          <div className="flex flex-col gap-2">
            {mockPlayers.map((player, i) => (
              <div
                key={player.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{
                  backgroundColor: '#0D0800',
                  border: `3px solid ${PLAYER_COLORS[i]}`,
                }}
              >
                {/* Color dot */}
                <div style={{
                  width: '16px', height: '16px',
                  backgroundColor: PLAYER_COLORS[i],
                  flexShrink: 0,
                }} />
                {/* Name */}
                <span className="text-xs flex-1" style={{ color: PLAYER_COLORS[i] }}>
                  {player.name}
                </span>
                {/* Host badge */}
                {player.isHost && (
                  <span
                    className="text-xs px-2 py-1"
                    style={{
                      backgroundColor: '#FF9A3C',
                      color: '#0D0800',
                      fontSize: '8px',
                    }}
                  >
                    HOST
                  </span>
                )}
              </div>
            ))}

            {/* Empty slots */}
            {[...Array(6 - mockPlayers.length)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2"
                style={{
                  backgroundColor: '#0D0800',
                  border: '3px solid #3a2a00',
                }}
              >
                <div style={{ width: '16px', height: '16px', backgroundColor: '#3a2a00' }} />
                <span className="text-xs" style={{ color: '#3a2a00' }}>Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start button — only host sees this active */}
        <button
          className="w-full py-4 text-xs font-bold mb-3 transition-all active:translate-y-1"
          style={{
            backgroundColor: '#A8FF3E',
            border: '4px solid #2D5A1B',
            boxShadow: '4px 4px 0px #2D5A1B',
            color: '#0D1F0D',
            cursor: 'pointer',
            letterSpacing: '1px',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#c4ff6e'}
          onMouseLeave={e => e.target.style.backgroundColor = '#A8FF3E'}
          onClick={() => navigate('/code-input')}
        >
          ⚔️ START QUEST
        </button>

        <button
          onClick={() => navigate('/')}
          className="text-xs text-center transition-all"
          style={{ color: '#7a5a00', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = '#FF9A3C'}
          onMouseLeave={e => e.target.style.color = '#7a5a00'}
        >
          ← Leave Guild
        </button>

      </div>
    </div>
  );
}

export default GuildLobby;