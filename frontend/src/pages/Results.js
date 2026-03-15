import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket/socket';

function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '6px', height: '6px',
        backgroundColor: '#FFE566',
        boxShadow: '0 0 8px 4px rgba(255,229,102,0.8)',
        ...style,
      }}
    />
  );
}

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

const RANK_COLORS = ['#FFE566', '#C0C0C0', '#CD7F32', '#A8FF3E', '#6BC5FF', '#FF9EFF'];
const RANK_LABELS = ['🥇', '🥈', '🥉', '4th', '5th', '6th'];

function Results() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const playerName = localStorage.getItem('playerName') || '';
  const roomCode = localStorage.getItem('roomCode') || '';

  useEffect(() => {
    // Get total score from localStorage
    const score = parseInt(localStorage.getItem('totalScore') || '0');
    setTotalScore(score);

    // Request leaderboard from backend
    if (roomCode) {
      socket.emit('request_leaderboard', { room_code: roomCode });
    }

    // Listen for leaderboard update
    socket.on('leaderboard_update', (data) => {
      setLeaderboard(data.leaderboard);
    });

    // Show confetti after a short delay
    setTimeout(() => setShowConfetti(true), 500);

    return () => {
      socket.off('leaderboard_update');
    };
  }, [roomCode]);

  const handlePlayAgain = () => {
    // Clear game data but keep player info
    localStorage.removeItem('submittedCode');
    localStorage.removeItem('submittedLanguage');
    localStorage.removeItem('totalScore');
    navigate('/code-input');
  };

  const handleLeave = () => {
    socket.emit('leave_room_event', { room_code: roomCode });
    localStorage.clear();
    navigate('/');
  };

  // Find player's rank
  const playerRank = leaderboard.findIndex(p => p.username === playerName) + 1;

  // Confetti particles
  const confettiColors = ['#FFE566', '#A8FF3E', '#FF6B6B', '#6BC5FF', '#C084FC', '#FF9A3C'];
  const confettiParticles = [...Array(30)].map((_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    size: Math.random() * 8 + 4,
  }));

  const fireflies = [
    { top: '10%', left: '8%', animationDelay: '0s' },
    { top: '25%', left: '5%', animationDelay: '0.5s' },
    { top: '50%', left: '10%', animationDelay: '1s' },
    { top: '70%', left: '6%', animationDelay: '0.3s' },
    { top: '15%', left: '88%', animationDelay: '0.8s' },
    { top: '40%', left: '92%', animationDelay: '1.3s' },
    { top: '65%', left: '87%', animationDelay: '0.6s' },
    { top: '80%', left: '91%', animationDelay: '1.1s' },
    { top: '35%', left: '50%', animationDelay: '0.4s' },
    { top: '55%', left: '70%', animationDelay: '0.9s' },
    { top: '20%', left: '30%', animationDelay: '1.4s' },
    { top: '75%', left: '45%', animationDelay: '0.2s' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0D1F0D' }}
    >
      {/* Golden celebration sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0a1a0a 0%, #0D1F0D 60%, #1a3a0e 100%)',
      }} />

      {/* Golden glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255,229,102,0.08) 0%, transparent 60%)',
      }} />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: i % 3 === 0 ? '3px' : '2px',
          height: i % 3 === 0 ? '3px' : '2px',
          backgroundColor: '#FFE566',
          top: `${(i * 13) % 40}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.4,
        }} />
      ))}

      {/* Moon — golden */}
      <div className="absolute" style={{
        top: '30px', right: '100px',
        width: '55px', height: '55px',
        backgroundColor: '#FFE566',
        boxShadow: '0 0 30px 12px rgba(255,229,102,0.4)',
      }} />

      {/* Trees */}
      <Tree left="0px" height={160} />
      <Tree left="90px" height={130} />
      <Tree left="calc(100% - 100px)" height={160} />
      <Tree left="calc(100% - 190px)" height={140} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ backgroundColor: '#1a3a0e' }} />
      <div className="absolute bottom-16 left-0 right-0 h-4" style={{ backgroundColor: '#2D5A1B' }} />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              left: p.left,
              top: '-10px',
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [1, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Fireflies — extra golden */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div className="z-10 flex flex-col items-center w-full max-w-lg px-4 py-8">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-2"
          style={{ color: '#FFE566', textShadow: '4px 4px 0px #8B6914' }}
        >
          🏆 QUEST COMPLETE!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-center mb-6"
          style={{ color: '#A8FF3E' }}
        >
          Your guild has mastered the spell!
        </motion.p>

        {/* Player score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="w-full p-6 mb-4 text-center"
          style={{
            backgroundColor: '#1a2a00',
            border: '4px solid #FFE566',
            boxShadow: '6px 6px 0px #8B6914, 0 0 30px rgba(255,229,102,0.2)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: '#FFE566' }}>YOUR TOTAL SCORE</p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
            className="text-5xl font-bold mb-2"
            style={{ color: '#FFE566', textShadow: '3px 3px 0px #8B6914' }}
          >
            {totalScore}
          </motion.p>
          <p className="text-xs" style={{ color: '#A8FF3E' }}>XP EARNED</p>
          {playerRank > 0 && (
            <p className="text-xs mt-2" style={{ color: '#FFE566' }}>
              Your rank: {RANK_LABELS[playerRank - 1]}
            </p>
          )}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full p-4 mb-4"
          style={{
            backgroundColor: '#0D1F0D',
            border: '4px solid #FFE566',
            boxShadow: '6px 6px 0px #8B6914',
          }}
        >
          <p className="text-xs mb-3 text-center" style={{ color: '#FFE566' }}>
            👥 GUILD LEADERBOARD
          </p>

          {leaderboard.length === 0 ? (
            <p className="text-xs text-center" style={{ color: '#4A9A2E' }}>
              Loading scores...
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {leaderboard.map((player, i) => (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3 px-3 py-2"
                  style={{
                    backgroundColor: player.username === playerName ? '#1a2a00' : '#050F05',
                    border: `3px solid ${RANK_COLORS[i]}`,
                  }}
                >
                  <span className="text-sm flex-shrink-0">{RANK_LABELS[i]}</span>
                  <span
                    className="text-xs flex-1"
                    style={{ color: RANK_COLORS[i] }}
                  >
                    {player.username}
                    {player.username === playerName && ' (You)'}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: RANK_COLORS[i] }}
                  >
                    {player.score} XP
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full flex flex-col gap-3"
        >
          <button
            onClick={handlePlayAgain}
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
            ⚔️ PLAY AGAIN — NEW SPELL
          </button>

          <button
            onClick={handleLeave}
            className="text-xs text-center transition-all"
            style={{
              color: '#4A9A2E',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.target.style.color = '#FFE566'}
            onMouseLeave={e => e.target.style.color = '#4A9A2E'}
          >
            ← Leave Guild & Return Home
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default Results;