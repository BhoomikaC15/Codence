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
        backgroundColor: '#C084FC',
        boxShadow: '0 0 6px 3px rgba(192,132,252,0.6)',
        ...style,
      }}
    />
  );
}

function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [quizError, setQuizError] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const roomCode = localStorage.getItem('roomCode') || '';

useEffect(() => {
  const fetchQuiz = async () => {
    const code = localStorage.getItem('submittedCode') || '';
    if (!code) {
      setQuizError('No submitted code found. Go back and run Explain first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_snippet: code }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      const data = await response.json();

      // Convert A/B/C/D format to array format our UI expects
      const formatted = data.quiz.questions.map(q => ({
        question: q.question,
        options: Object.values(q.options),
        correct: ['A', 'B', 'C', 'D'].indexOf(q.correct_answer),
        difficulty: q.difficulty,
      }));

      if (!formatted.length) {
        setQuizError('No quiz questions were returned. Please try again.');
      }
      setQuestions(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setQuizError('Failed to load quiz from backend. Please try again.');
      setLoading(false);
    }
  };

  fetchQuiz();
}, []);

  const handleSelect = (optionIndex) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === questions[currentQ].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 100);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      // Quiz finished — emit final score
      if (roomCode) {
        socket.emit('submit_score', {
          room_code: roomCode,
          points: quizScore,
        });
      }
      // Add to total score
      const prev = parseInt(localStorage.getItem('totalScore') || '0');
      localStorage.setItem('totalScore', prev + quizScore);
      setFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const fireflies = [
    { top: '10%', left: '5%', animationDelay: '0s' },
    { top: '35%', left: '3%', animationDelay: '0.8s' },
    { top: '65%', left: '6%', animationDelay: '1.4s' },
    { top: '15%', left: '93%', animationDelay: '0.5s' },
    { top: '50%', left: '96%', animationDelay: '1.1s' },
    { top: '78%', left: '92%', animationDelay: '0.3s' },
  ];

  const question = questions[currentQ];
  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#0D0520' }}
    >
      {/* Purple tinted sky */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #0D0520 0%, #150A30 50%, #0d1f0d 100%)',
      }} />

      {/* Purple glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(192,132,252,0.08) 0%, transparent 60%)',
      }} />

      {/* Stars */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '2px', height: '2px',
          backgroundColor: '#C084FC',
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

      {/* Fireflies */}
      {fireflies.map((f, i) => (
        <Firefly key={i} style={{ top: f.top, left: f.left, animationDelay: f.animationDelay }} />
      ))}

      {/* Main content */}
      <div
        className="z-10 flex flex-col h-full px-6 py-4"
        style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-lg font-bold"
            style={{ color: '#C084FC', textShadow: '2px 2px 0px #3b0764' }}
          >
            🧩 QUIZ ROUND
          </h1>
          {!finished && !loading && (
            <span
              className="text-xs px-3 py-2"
              style={{
                backgroundColor: '#150A30',
                border: '3px solid #C084FC',
                color: '#C084FC',
              }}
            >
              {currentQ + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{
                width: '40px', height: '40px',
                border: '4px solid #C084FC',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
              }}
            />
            <p className="text-xs" style={{ color: '#C084FC' }}>
              ⚡ Nova Lite is generating your quiz...
            </p>
            <p className="text-xs mt-2" style={{ color: '#7a5a9a' }}>
              Questions based on your specific code
            </p>
          </div>
        )}

        {/* Finished screen */}
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center gap-6"
          >
            <h2
              className="text-3xl font-bold text-center"
              style={{ color: '#FFE566', textShadow: '4px 4px 0px #8B6914' }}
            >
              🏆 QUEST COMPLETE!
            </h2>
            <div
              className="px-8 py-4 text-center"
              style={{
                backgroundColor: '#150A30',
                border: '4px solid #C084FC',
                boxShadow: '6px 6px 0px #3b0764',
              }}
            >
              <p className="text-xs mb-2" style={{ color: '#C084FC' }}>
                QUIZ SCORE
              </p>
              <p
                className="text-4xl font-bold"
                style={{ color: '#FFE566' }}
              >
                +{quizScore} XP
              </p>
            </div>
            <button
              onClick={() => navigate('/results')}
              className="w-full py-4 text-xs font-bold transition-all active:translate-y-1"
              style={{
                backgroundColor: '#FFE566',
                border: '4px solid #8B6914',
                boxShadow: '4px 4px 0px #8B6914',
                color: '#0D1F0D',
                cursor: 'pointer',
                letterSpacing: '2px',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#fff0a0'}
              onMouseLeave={e => e.target.style.backgroundColor = '#FFE566'}
            >
              🏆 SEE FINAL RESULTS
            </button>
          </motion.div>
        )}

        {/* Empty / error state */}
        {!loading && !finished && questions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-xs" style={{ color: '#FF6B6B' }}>
              ⚠️ {quizError || 'No quiz available right now.'}
            </p>
            <button
              onClick={() => navigate('/code-input')}
              className="px-4 py-3 text-xs font-bold transition-all active:translate-y-1"
              style={{
                backgroundColor: '#C084FC',
                border: '3px solid #3b0764',
                boxShadow: '4px 4px 0px #3b0764',
                color: '#0D1F0D',
                cursor: 'pointer',
              }}
            >
              ← BACK TO CODE INPUT
            </button>
          </div>
        )}

        {/* Question */}
        {!loading && !finished && question && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Progress bar */}
              <div
                className="w-full h-2 mb-6"
                style={{ backgroundColor: '#150A30', border: '2px solid #C084FC' }}
              >
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: '#C084FC' }}
                  animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question card */}
              <div
                className="p-6 mb-6"
                style={{
                  backgroundColor: '#150A30',
                  border: '4px solid #C084FC',
                  boxShadow: '6px 6px 0px #3b0764',
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#E9D5FF' }}
                >
                  {question.question}
                </p>
                 <span
                   className="text-xs mt-2 inline-block px-2 py-1"
                   style={{
                     backgroundColor:
                       question.difficulty === 'easy' ? '#0a2a0a' :
                       question.difficulty === 'medium' ? '#2a2000' : '#2a0000',
                     border: `2px solid ${
                       question.difficulty === 'easy' ? '#A8FF3E' :
                       question.difficulty === 'medium' ? '#FFE566' : '#FF6B6B'
                     }`,
                     color:
                       question.difficulty === 'easy' ? '#A8FF3E' :
                       question.difficulty === 'medium' ? '#FFE566' : '#FF6B6B',
                   }}
                 >
                   {question.difficulty?.toUpperCase() || 'MEDIUM'}
                 </span>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3 flex-1">
                {question.options.map((option, i) => {
                  let bgColor = '#0D0520';
                  let borderColor = '#C084FC';
                  let textColor = '#C084FC';

                  if (answered) {
                    if (i === question.correct) {
                      bgColor = '#0a2a0a';
                      borderColor = '#A8FF3E';
                      textColor = '#A8FF3E';
                    } else if (i === selected && i !== question.correct) {
                      bgColor = '#2a0000';
                      borderColor = '#FF6B6B';
                      textColor = '#FF6B6B';
                    } else {
                      borderColor = '#3b0764';
                      textColor = '#5a3a7a';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.02 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(i)}
                      className="flex items-center gap-4 px-4 py-3 text-xs text-left transition-all"
                      style={{
                        backgroundColor: bgColor,
                        border: `3px solid ${borderColor}`,
                        boxShadow: answered ? 'none' : `3px 3px 0px #3b0764`,
                        color: textColor,
                        cursor: answered ? 'default' : 'pointer',
                      }}
                    >
                      <span
                        className="font-bold flex-shrink-0 w-6 h-6 flex items-center justify-center"
                        style={{
                          backgroundColor: borderColor,
                          color: answered ? '#0D0520' : '#0D0520',
                          fontSize: '10px',
                        }}
                      >
                        {OPTION_LABELS[i]}
                      </span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button */}
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-3 mt-4 text-xs font-bold transition-all active:translate-y-1"
                  style={{
                    backgroundColor: '#C084FC',
                    border: '4px solid #3b0764',
                    boxShadow: '4px 4px 0px #3b0764',
                    color: '#0D1F0D',
                    cursor: 'pointer',
                    letterSpacing: '2px',
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#d8b4fe'}
                  onMouseLeave={e => e.target.style.backgroundColor = '#C084FC'}
                >
                  {currentQ + 1 >= questions.length ? '🏆 FINISH QUEST' : '→ NEXT QUESTION'}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Quiz;