import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

function Tree({ left, height = 120 }) {
  return (
    <div className="absolute bottom-16 flex flex-col items-center" style={{ left }}>
      <div style={{ width: '60px', height: '60px', backgroundColor: '#1a3a0e', boxShadow: '4px 4px 0 #0d1f0d, -4px 4px 0 #0d1f0d' }} />
      <div style={{ width: '80px', height: '50px', backgroundColor: '#2D5A1B', boxShadow: '4px 4px 0 #1a3a0e, -4px 4px 0 #1a3a0e', marginTop: '-10px' }} />
      <div style={{ width: '100px', height: '50px', backgroundColor: '#3A7A24', marginTop: '-10px' }} />
      <div style={{ width: '24px', height: `${height - 100}px`, backgroundColor: '#4a2a10', borderLeft: '4px solid #2a1500' }} />
    </div>
  );
}

function Firefly({ style }) {
  return (
    <div
      className="absolute rounded-full animate-pulse"
      style={{
        width: '4px', height: '4px',
        backgroundColor: '#FFE566',
        boxShadow: '0 0 4px 2px rgba(255,229,102,0.6)',
        ...style,
      }}
    />
  );
}

function CodeInput() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [casting, setCasting] = useState(false);

  const handleCast = () => {
    if (!code.trim() || !language.trim()) return;
    setCasting(true);
    setTimeout(() => {
      navigate('/explanation');
    }, 2000);
  };

  const fireflies = [
    { top: '10%', left: '5%', animationDelay: '0s' },
    { top: '30%', left: '3%', animationDelay: '1s' },
    { top: '60%', left: '7%', animationDelay: '0.5s' },
    { top: '15%', left: '92%', animationDelay: '0.8s' },
    { top: '45%', left: '95%', animationDelay: '1.3s' },
    { top: '70%', left: '90%', animationDelay: '0.3s' },
  ];

  return (
    <div
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#050F05' }}
    >
      {/* Dark foggy sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #050810 0%, #050F05 70%, #0d1f0d 100%)',
      }} />

      {/* Stars */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '2px', height: '2px',
          backgroundColor: '#fff',
          top: `${(i * 13) % 35}%`,
          left: `${(i * 17) % 100}%`,
          opacity: 0.25,
        }} />
      ))}

      {/* Moon */}
      <div className="absolute" style={{
        top: '30px', right: '100px',
        width: '40px', height: '40px',
        backgroundColor: '#c8c8a0',
        boxShadow: '0 0 15px 5px rgba(200,200,160,0.2)',
      }} />

      {/* Dark trees */}
      <Tree left="0px" height={170} />
      <Tree left="85px" height={140} />
      <Tree left="calc(100% - 95px)" height={170} />
      <Tree left="calc(100% - 180px)" height={145} />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16" style={{ backgroundColor: '#0d1f0d' }} />
      <div className="absolute bottom-16 left-0 right-0 h-4" style={{ backgroundColor: '#1a3a0e' }} />

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Casting overlay */}
      {casting && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        >
          <div
            className="text-4xl font-bold animate-pulse text-center"
            style={{ color: '#A8FF3E', textShadow: '0 0 30px rgba(168,255,62,0.8)' }}
          >
            ✨ CASTING SPELL...
          </div>
          <p className="text-xs mt-4" style={{ color: '#FFE566' }}>
            Nova AI is reading your scroll...
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="z-10 flex flex-col items-center w-full px-6 py-4 h-full" style={{ maxWidth: '1100px' }}>

        {/* Flavor text */}
        <p className="text-xs mb-1 text-center" style={{ color: '#4A9A2E' }}>
          ✨ The ancient scroll awaits your spell...
        </p>

        {/* Title */}
        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ color: '#A8FF3E', textShadow: '3px 3px 0px #2D5A1B, 0 0 20px rgba(168,255,62,0.4)' }}
        >
          📜 THE SPELL SCROLL
        </h1>

        {/* Language input */}
        <div className="w-full mb-4">
          <label className="text-xs mb-2 block" style={{ color: '#FFE566' }}>
            — Name your School of Magic —
          </label>
          <input
            type="text"
            placeholder="e.g. Python, JavaScript, Go, Kotlin, Rust..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-3 text-xs outline-none"
            style={{
              backgroundColor: '#0D1F0D',
              border: '4px solid #A8FF3E',
              color: '#A8FF3E',
              letterSpacing: '1px',
            }}
          />
        </div>

        {/* Monaco Editor */}
        <div
          className="w-full mb-4"
          style={{
            border: '4px solid #A8FF3E',
            boxShadow: '6px 6px 0px #000, 0 0 20px rgba(168,255,62,0.2)',
          }}
        >
          {/* Scroll header */}
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              backgroundColor: '#1E3A1E',
              borderBottom: '2px solid #A8FF3E',
            }}
          >
            <span className="text-xs" style={{ color: '#A8FF3E' }}>
              📜 {language ? `${language} Spell` : 'Select a school of magic first...'}
            </span>
            <span className="text-xs" style={{ color: '#4A9A2E' }}>
              {code.split('\n').length} lines
            </span>
          </div>

          <Editor
            height="400px"
            language={language.toLowerCase() || 'plaintext'}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              padding: { top: 12 },
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Cast button */}
        <button
          disabled={!code.trim() || !language.trim() || casting}
          onClick={handleCast}
          className="w-full py-4 text-sm font-bold mb-3 transition-all active:translate-y-1"
          style={{
            backgroundColor: !code.trim() || !language.trim() ? '#1E3A1E' : '#A8FF3E',
            border: '4px solid #2D5A1B',
            boxShadow: !code.trim() || !language.trim() ? 'none' : '4px 4px 0px #2D5A1B, 0 0 20px rgba(168,255,62,0.4)',
            color: !code.trim() || !language.trim() ? '#2D5A1B' : '#0D1F0D',
            cursor: !code.trim() || !language.trim() ? 'not-allowed' : 'pointer',
            letterSpacing: '2px',
          }}
          onMouseEnter={e => { if (code.trim() && language.trim()) e.target.style.backgroundColor = '#c4ff6e' }}
          onMouseLeave={e => { if (code.trim() && language.trim()) e.target.style.backgroundColor = '#A8FF3E' }}
        >
          ✨ CAST THE SPELL
        </button>

        <button
          onClick={() => navigate('/guild-lobby')}
          className="text-xs text-center transition-all"
          style={{ color: '#2D5A1B', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.color = '#A8FF3E'}
          onMouseLeave={e => e.target.style.color = '#2D5A1B'}
        >
          ← Back to Lobby
        </button>

      </div>
    </div>
  );
}

export default CodeInput;