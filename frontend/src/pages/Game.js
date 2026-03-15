import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket/socket';

function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '4px', height: '4px',
        backgroundColor: '#FF6B6B',
        boxShadow: '0 0 6px 3px rgba(255,107,107,0.6)',
        ...style,
      }}
    />
  );
}

// Picks which lines to blank out — mix of random + every 3rd line (key lines)
function selectBlankLines(lines) {
  const blanked = new Set();
  lines.forEach((line, i) => {
    if (line.trim() === '') return;
    // Every 3rd line is a "key line"
    if (i % 3 === 1) blanked.add(i);
    // Random 20% of remaining lines
    else if (Math.random() < 0.2) blanked.add(i);
  });
  return blanked;
}

function Game() {
  const navigate = useNavigate();
  const [codeLines, setCodeLines] = useState([]);
  const [blankLines, setBlankLines] = useState(new Set());
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  const roomCode = localStorage.getItem('roomCode') || '';

  useEffect(() => {
    const code = localStorage.getItem('submittedCode') || '';
    if (!code) {
      navigate('/code-input');
      return;
    }
    const lines = code.split('\n');
    const blanked = selectBlankLines(lines);
    setCodeLines(lines);
    setBlankLines(blanked);

    // Initialize answers as empty strings for each blank
    const initialAnswers = {};
    blanked.forEach(i => { initialAnswers[i] = ''; });
    setAnswers(initialAnswers);
  }, [navigate]);

  const handleSubmit = () => {
    if (submitted) return;

    let earned = 0;
    const lineResults = {};

    blankLines.forEach(i => {
      const correct = codeLines[i].trim();
      const given = (answers[i] || '').trim();

      if (given === correct) {
        lineResults[i] = 'correct';
        earned += 100;
      } else if (correct.includes(given) && given.length > 0) {
        lineResults[i] = 'partial';
        earned += 40;
      } else {
        lineResults[i] = 'wrong';
      }
    });

    setResults(lineResults);
    setScore(earned);
    setSubmitted(true);

    // Emit score to backend
    if (roomCode) {
      socket.emit('submit_score', {
        room_code: roomCode,
        points: earned,
      });
    }

    // Update total score in localStorage
    const prev = parseInt(localStorage.getItem('totalScore') || '0');
    const newTotal = prev + earned;
    localStorage.setItem('totalScore', newTotal);
    setTotalScore(newTotal);
  };

  const fireflies = [
    { top: '10%', left: '3%', animationDelay: '0s' },
    { top: '40%', left: '5%', animationDelay: '0.8s' },
    { top: '70%', left: '2%', animationDelay: '1.4s' },
    { top: '20%', left: '95%', animationDelay: '0.5s' },
    { top: '55%', left: '97%', animationDelay: '1.1s' },
    { top: '80%', left: '93%', animationDelay: '0.3s' },
  ];

  const allFilled = [...blankLines].every(i => (answers[i] || '').trim() !== '');

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#0D0005' }}
    >
      {/* Red battle sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1a0005 0%, #0D0010 50%, #0d1f0d 100%)',
      }} />

      {/* Battle glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,50,50,0.07) 0%, transparent 60%)',
      }} />

      {/* Stars */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '2px', height: '2px',
          backgroundColor: '#FF6B6B',
          top: `${(i * 13) % 35}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.3,
        }} />
      ))}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-12"
        style={{ backgroundColor: '#0d1f0d' }} />
      <div className="absolute bottom-12 left-0 right-0 h-3"
        style={{ backgroundColor: '#1a3a0e' }} />

      {/* Red fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div
        className="z-10 flex flex-col h-full px-6 py-4"
        style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1
            className="text-lg font-bold"
            style={{ color: '#FF6B6B', textShadow: '2px 2px 0px #5a0000' }}
          >
            ⚔️ BATTLE ROUND
          </h1>
          {submitted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-xs font-bold px-3 py-2"
              style={{
                backgroundColor: '#FFE566',
                border: '3px solid #8B6914',
                color: '#0D1F0D',
              }}
            >
              ⭐ +{score} XP
            </motion.div>
          )}
        </div>

        {/* Hint */}
        {!submitted && (
          <p className="text-xs mb-3" style={{ color: '#FF9A9A' }}>
            🔴 Fill in the missing lines — blank fields marked in red
          </p>
        )}

        {/* Code display */}
        <div
          className="flex-1 overflow-y-auto p-4 mb-3 font-mono"
          style={{
            backgroundColor: '#0A0010',
            border: '4px solid #FF6B6B',
            boxShadow: '6px 6px 0px #5a0000, 0 0 20px rgba(255,107,107,0.1)',
          }}
        >
          {codeLines.map((line, i) => (
            <div key={i} className="flex items-center gap-3 mb-1">
              {/* Line number */}
              <span
                className="text-xs select-none w-6 text-right flex-shrink-0"
                style={{ color: '#5a3a3a' }}
              >
                {i + 1}
              </span>

              {blankLines.has(i) ? (
                // Blank line — input field
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={answers[i] || ''}
                    onChange={(e) => {
                      if (!submitted) {
                        setAnswers(prev => ({ ...prev, [i]: e.target.value }));
                      }
                    }}
                    disabled={submitted}
                    placeholder="// fill in this line..."
                    className="w-full px-2 py-1 text-xs outline-none font-mono"
                    style={{
                      backgroundColor: submitted
                        ? results[i] === 'correct' ? '#0a2a0a'
                          : results[i] === 'partial' ? '#2a2000'
                          : '#2a0000'
                        : '#1a0010',
                      border: `2px solid ${
                        submitted
                          ? results[i] === 'correct' ? '#A8FF3E'
                            : results[i] === 'partial' ? '#FFE566'
                            : '#FF6B6B'
                          : '#FF6B6B'
                      }`,
                      color: submitted
                        ? results[i] === 'correct' ? '#A8FF3E'
                          : results[i] === 'partial' ? '#FFE566'
                          : '#FF6B6B'
                        : '#FF9A9A',
                    }}
                  />
                  {/* Show correct answer after submit if wrong */}
                  {submitted && results[i] !== 'correct' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs px-2 py-1 mt-1 font-mono"
                      style={{
                        backgroundColor: '#0a2a0a',
                        border: '1px solid #A8FF3E',
                        color: '#A8FF3E',
                      }}
                    >
                      ✅ {codeLines[i]}
                    </motion.div>
                  )}
                </div>
              ) : (
                // Normal line
                <span
                  className="text-xs font-mono"
                  style={{ color: '#C8C8C8' }}
                >
                  {line || ' '}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Submit / Next buttons */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className="w-full py-3 text-xs font-bold transition-all active:translate-y-1"
            style={{
              backgroundColor: allFilled ? '#FF6B6B' : '#2a0010',
              border: '4px solid #5a0000',
              boxShadow: allFilled ? '4px 4px 0px #5a0000' : 'none',
              color: allFilled ? '#fff' : '#5a0000',
              cursor: allFilled ? 'pointer' : 'not-allowed',
              letterSpacing: '2px',
            }}
            onMouseEnter={e => { if (allFilled) e.target.style.backgroundColor = '#ff9a9a' }}
            onMouseLeave={e => { if (allFilled) e.target.style.backgroundColor = '#FF6B6B' }}
          >
            ⚔️ SUBMIT ANSWERS
          </button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/quiz')}
            className="w-full py-3 text-xs font-bold transition-all active:translate-y-1"
            style={{
              backgroundColor: '#A8FF3E',
              border: '4px solid #2D5A1B',
              boxShadow: '4px 4px 0px #2D5A1B',
              color: '#0D1F0D',
              cursor: 'pointer',
              letterSpacing: '2px',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#c4ff6e'}
            onMouseLeave={e => e.target.style.backgroundColor = '#A8FF3E'}
          >
            🧩 NEXT — QUIZ ROUND
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default Game;