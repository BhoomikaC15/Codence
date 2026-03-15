import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '4px', height: '4px',
        backgroundColor: '#88CCFF',
        boxShadow: '0 0 6px 3px rgba(136,204,255,0.6)',
        ...style,
      }}
    />
  );
}

function Explanation() {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [allLinesRevealed, setAllLinesRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  const code = localStorage.getItem('submittedCode') || '';

  // Fetch explanation from backend
  useEffect(() => {
    if (!code) {
      setError('No code found. Please go back and submit code.');
      setLoading(false);
      return;
    }

    const fetchExplanation = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/explain-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          let detail = 'Failed to get explanation from backend.';
          try {
            const errorData = await response.json();
            detail = errorData?.detail || detail;
          } catch {
            // Keep default message if backend did not return JSON
          }
          throw new Error(detail);
        }

        const data = await response.json();

        // Split explanation into lines for typewriter effect
        const splitLines = data.explanation
          .split('\n')
          .filter(line => line.trim() !== '');
        setLines(splitLines);

        // Set up audio if available
        if (data.audio_base64) {
          const audioSrc = `data:audio/mpeg;base64,${data.audio_base64}`;
          audioRef.current = new Audio(audioSrc);
        }

        setLoading(false);
      } catch (err) {
        setError(err?.message || 'Failed to connect to Nova AI. Is the backend running?');
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [code]);

  // Typewriter effect — reveal lines one by one
  useEffect(() => {
    if (loading || lines.length === 0) return;
    if (currentLine < lines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => [...prev, lines[currentLine]]);
        setCurrentLine(prev => prev + 1);
        // Auto scroll to bottom
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setAllLinesRevealed(true);
    }
  }, [currentLine, lines, loading]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  const fireflies = [
    { top: '10%', left: '5%', animationDelay: '0s' },
    { top: '30%', left: '3%', animationDelay: '0.8s' },
    { top: '60%', left: '6%', animationDelay: '1.4s' },
    { top: '15%', left: '93%', animationDelay: '0.5s' },
    { top: '50%', left: '95%', animationDelay: '1.1s' },
    { top: '75%', left: '91%', animationDelay: '0.3s' },
  ];

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#050D1A' }}
    >
      {/* Blue moonlight sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 50%, #0d1f0d 100%)',
      }} />

      {/* Moonlight glow */}
      <div className="absolute" style={{
        top: '-50px', left: '50%',
        transform: 'translateX(-50%)',
        width: '400px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(100,160,255,0.12) 0%, transparent 70%)',
      }} />

      {/* Moon */}
      <div className="absolute" style={{
        top: '20px', right: '80px',
        width: '50px', height: '50px',
        backgroundColor: '#C8D8FF',
        boxShadow: '0 0 25px 10px rgba(180,200,255,0.3)',
      }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '2px', height: '2px',
          backgroundColor: '#88CCFF',
          top: `${(i * 13) % 40}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.4,
        }} />
      ))}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-12" style={{ backgroundColor: '#0d1f0d' }} />
      <div className="absolute bottom-12 left-0 right-0 h-3" style={{ backgroundColor: '#1a3a0e' }} />

      {/* Fireflies — blue tinted */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div className="z-10 flex flex-col h-full px-6 py-4" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-lg font-bold"
            style={{ color: '#88CCFF', textShadow: '2px 2px 0px #0a1628' }}
          >
            🌙 NOVA'S EXPLANATION
          </h1>

          {/* Voice orb */}
          <motion.button
            onClick={handlePlayAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isPlaying ? {
              boxShadow: [
                '0 0 10px 4px rgba(136,204,255,0.4)',
                '0 0 20px 8px rgba(136,204,255,0.7)',
                '0 0 10px 4px rgba(136,204,255,0.4)',
              ]
            } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold"
            style={{
              backgroundColor: isPlaying ? '#88CCFF' : '#0A1628',
              border: '3px solid #88CCFF',
              color: isPlaying ? '#050D1A' : '#88CCFF',
              cursor: audioRef.current ? 'pointer' : 'not-allowed',
              opacity: audioRef.current ? 1 : 0.5,
            }}
          >
            {isPlaying ? '🔊 PLAYING...' : '🔈 PLAY VOICE'}
          </motion.button>
        </div>

        {/* Explanation box */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 mb-4"
          style={{
            backgroundColor: '#0A1628',
            border: '4px solid #88CCFF',
            boxShadow: '6px 6px 0px #051020, 0 0 20px rgba(136,204,255,0.15)',
          }}
        >
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: '40px', height: '40px',
                  border: '4px solid #88CCFF',
                  borderTop: '4px solid transparent',
                  borderRadius: '50%',
                }}
              />
              <p className="text-xs" style={{ color: '#88CCFF' }}>
                Nova AI is reading your spell...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-xs text-center" style={{ color: '#FF6B6B' }}>
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Explanation lines */}
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-3 mb-3"
              >
                <span style={{ color: '#88CCFF', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <span className="text-xs leading-relaxed" style={{ color: '#C8E8FF' }}>
                  {line}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing cursor */}
          {!loading && currentLine < lines.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              style={{ color: '#88CCFF' }}
            >
              ▊
            </motion.span>
          )}
        </div>

          {/* Ready button — only shows after all lines revealed */}
          {allLinesRevealed && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/game')}
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
              ⚔️ I'M READY — BEGIN THE BATTLE!
            </motion.button>
          )}

          {/* Still loading message */}
          {!allLinesRevealed && !loading && !error && (
            <p className="text-xs text-center" style={{ color: '#88CCFF' }}>
              📖 Read carefully... button appears when explanation is complete.
            </p>
          )}

      </div>
    </div>
  );
}

export default Explanation;