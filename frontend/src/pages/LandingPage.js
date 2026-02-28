import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Animated firefly dot
function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '6px',
        height: '6px',
        backgroundColor: '#FFE566',
        boxShadow: '0 0 6px 3px rgba(255,229,102,0.8)',
        ...style,
      }}
    />
  );
}

// Pixel tree
function Tree({ left, height = 120 }) {
  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left }}>
      {/* Leaves */}
      <div style={{
        width: '60px', height: '60px',
        backgroundColor: '#2D5A1B',
        boxShadow: '4px 4px 0 #1a3a0e, -4px 4px 0 #1a3a0e',
        imageRendering: 'pixelated',
      }} />
      <div style={{
        width: '80px', height: '50px',
        backgroundColor: '#3A7A24',
        boxShadow: '4px 4px 0 #2D5A1B, -4px 4px 0 #2D5A1B',
        marginTop: '-10px',
      }} />
      <div style={{
        width: '100px', height: '50px',
        backgroundColor: '#4A9A2E',
        marginTop: '-10px',
      }} />
      {/* Trunk */}
      <div style={{
        width: '24px',
        height: `${height - 100}px`,
        backgroundColor: '#6B3E1E',
        borderLeft: '4px solid #4a2a10',
      }} />
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  const fireflies = [
    { top: '20%', left: '10%', animationDelay: '0s' },
    { top: '35%', left: '18%', animationDelay: '0.5s' },
    { top: '55%', left: '8%', animationDelay: '1s' },
    { top: '25%', left: '82%', animationDelay: '0.3s' },
    { top: '45%', left: '88%', animationDelay: '0.8s' },
    { top: '60%', left: '78%', animationDelay: '1.2s' },
    { top: '15%', left: '45%', animationDelay: '0.6s' },
    { top: '70%', left: '35%', animationDelay: '1.5s' },
    { top: '30%', left: '65%', animationDelay: '0.2s' },
    { top: '65%', left: '55%', animationDelay: '0.9s' },
    { top: '80%', left: '25%', animationDelay: '0.4s' },
    { top: '75%', left: '70%', animationDelay: '1.1s' },
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
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? '3px' : '2px',
            height: i % 3 === 0 ? '3px' : '2px',
            backgroundColor: '#fff',
            top: `${Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}

      {/* Moon */}
      <div className="absolute" style={{
        top: '40px', right: '120px',
        width: '50px', height: '50px',
        backgroundColor: '#FFF5C0',
        boxShadow: '0 0 20px 8px rgba(255,245,192,0.3)',
        imageRendering: 'pixelated',
      }} />

      {/* Trees left side */}
      <Tree left="0px" height={160} />
      <Tree left="90px" height={130} />
      <Tree left="170px" height={150} />

      {/* Trees right side */}
      <Tree left="calc(100% - 100px)" height={160} />
      <Tree left="calc(100% - 190px)" height={140} />
      <Tree left="calc(100% - 270px)" height={155} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ backgroundColor: '#1a3a0e' }} />
      <div className="absolute bottom-16 left-0 right-0 h-4" style={{ backgroundColor: '#2D5A1B' }} />

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div className="flex flex-col items-center z-10 px-4">

        {/* Title */}
        <h1
          className="text-5xl font-bold text-center mb-1"
          style={{
            color: '#A8FF3E',
            textShadow: '4px 4px 0px #2D5A1B, 0 0 20px rgba(168,255,62,0.5)',
            lineHeight: '1.4',
          }}
        >
          CODENCE
        </h1>

        <p
          className="text-center mb-8 text-xs"
          style={{ color: '#FFE566', textShadow: '1px 1px 0px #8B6914' }}
        >
          Learn. Battle. Level Up.
        </p>

        {/* Card */}
        <div
          className="flex flex-col gap-4 p-8 w-80"
          style={{
            backgroundColor: '#1E3A1E',
            border: '4px solid #A8FF3E',
            boxShadow: '6px 6px 0px #2D5A1B, 0 0 20px rgba(168,255,62,0.15)',
          }}
        >
          {/* Powered by badge */}
          <p className="text-center text-xs" style={{ color: '#FFE566' }}>
            ⚡ Powered by Amazon Nova AI
          </p>

          {/* Create button */}
          <button
            onClick={() => navigate('/create-guild')}
            className="w-full py-4 text-xs font-bold transition-all active:translate-y-1"
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
          >
            ⚔️ CREATE GAME
          </button>

          {/* Divider */}
          <p className="text-center text-xs" style={{ color: '#A8FF3E' }}>
            — or join a game —
          </p>

          {/* Join row */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ROOM CODE"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-3 text-xs outline-none uppercase"
              style={{
                backgroundColor: '#0D1F0D',
                border: '4px solid #A8FF3E',
                color: '#A8FF3E',
                letterSpacing: '3px',
              }}
            />
            <button
              onClick={() => navigate('/join-guild')}
              className="px-4 py-3 text-xs font-bold transition-all active:translate-y-1"
              style={{
                backgroundColor: '#FFE566',
                border: '4px solid #8B6914',
                boxShadow: '4px 4px 0px #8B6914',
                color: '#0D1F0D',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#fff0a0'}
              onMouseLeave={e => e.target.style.backgroundColor = '#FFE566'}
            >
              JOIN
            </button>
          </div>

          <p className="text-center text-xs" style={{ color: '#4A9A2E' }}>
            2-6 Players • Master the Code
          </p>
        </div>
      </div>

      {/* Bottom credit */}
      <p className="absolute bottom-3 text-xs z-10" style={{ color: '#4A9A2E' }}>
        Built for Amazon Nova AI Hackathon 2026
      </p>

    </div>
  );
}

export default LandingPage;