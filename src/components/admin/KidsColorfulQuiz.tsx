import React, { useState, useEffect, useRef } from 'react';

// KidsColorfulQuiz.jsx
// Single-file React component using Tailwind CSS for a bright, playful quiz game.
// Default export at bottom. Drop into a create-react-app or Next.js page and ensure Tailwind is enabled.

const QUESTIONS = [
  {
    id: 1,
    question: 'Which animal is the largest?',
    image: '🐘',
    options: [
      { id: 'a', label: 'Elephant', img: '🐘', correct: true },
      { id: 'b', label: 'Cat', img: '🐱', correct: false },
      { id: 'c', label: 'Dog', img: '🐶', correct: false },
      { id: 'd', label: 'Rabbit', img: '🐰', correct: false },
    ],
  },
  {
    id: 2,
    question: 'What color is the sun?',
    image: '☀️',
    options: [
      { id: 'a', label: 'Green', img: '🟩', correct: false },
      { id: 'b', label: 'Yellow', img: '🟨', correct: true },
      { id: 'c', label: 'Blue', img: '🟦', correct: false },
      { id: 'd', label: 'Purple', img: '🟪', correct: false },
    ],
  },
  {
    id: 3,
    question: 'Which one is a fruit?',
    image: '🍎',
    options: [
      { id: 'a', label: 'Apple', img: '🍎', correct: true },
      { id: 'b', label: 'Carrot', img: '🥕', correct: false },
      { id: 'c', label: 'Bread', img: '🍞', correct: false },
      { id: 'd', label: 'Cheese', img: '🧀', correct: false },
    ],
  },
  {
    id: 4,
    question: 'Which animal can fly?',
    image: '🦅',
    options: [
      { id: 'a', label: 'Eagle', img: '🦅', correct: true },
      { id: 'b', label: 'Cow', img: '🐄', correct: false },
      { id: 'c', label: 'Sheep', img: '🐑', correct: false },
      { id: 'd', label: 'Pig', img: '🐷', correct: false },
    ],
  },
];

function useTimer(initialSeconds, active, onTimeUp) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) {
      onTimeUp && onTimeUp();
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, active, onTimeUp]);
  useEffect(() => setSeconds(initialSeconds), [initialSeconds]);
  return [seconds, setSeconds];
}

function playBeep(correct = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = correct ? 'sine' : 'square';
    o.frequency.value = correct ? 880 : 220;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 200);
  } catch (e) {
    // silently fail
  }
}

export default function KidsColorfulQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [seconds, setSeconds] = useTimer(15, true, () => handleTimeUp());
  const musicRef = useRef(null);

  useEffect(() => {
    // start/stop background music using oscillator for a gentle loop
    if (!musicOn || muted) {
      if (musicRef.current) {
        musicRef.current.stop();
        musicRef.current = null;
      }
      return;
    }
    // simple ambient drone using oscillator
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 220;
      g.gain.value = 0.002;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      musicRef.current = {
        stop: () => { o.stop(); ctx.close(); musicRef.current = null; }
      };
    } catch (e) { }
    return () => {
      if (musicRef.current) {
        musicRef.current.stop();
        musicRef.current = null;
      }
    };
  }, [musicOn, muted]);

  useEffect(() => {
    // reset timer when moving to next question
    setSeconds(15);
  }, [index]);

  function handleSelect(option) {
    if (selected) return; // prevent multiple clicks
    setSelected(option.id);
    setShowFeedback(true);
    const correct = option.correct;
    if (correct) {
      setScore(s => s + 1);
      !muted && playBeep(true);
    } else {
      !muted && playBeep(false);
    }
    // short delay then move next
    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (index + 1 < QUESTIONS.length) setIndex(i => i + 1);
      else setIndex(i => i + 1); // to trigger results
    }, 900);
  }

  function handleTimeUp() {
    if (selected) return;
    setSelected('timeup');
    setShowFeedback(true);
    !muted && playBeep(false);
    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (index + 1 < QUESTIONS.length) setIndex(i => i + 1);
      else setIndex(i => i + 1);
    }, 900);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
    setSeconds(15);
  }

  const inResults = index >= QUESTIONS.length;
  const percent = Math.round((index / QUESTIONS.length) * 100);
  const stars = Math.min(5, Math.round((score / QUESTIONS.length) * 5));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-yellow-50 p-6">
      {/* animated background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="cloud animate-cloud bg-white opacity-40 rounded-full blur-2xl" style={{ width: 300, height: 100, top: 20, left: 30 }} />
        <div className="cloud animate-cloud-slow bg-white opacity-30 rounded-full blur-3xl" style={{ width: 200, height: 80, top: 120, right: 40 }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold text-indigo-700">Fun Quiz for Kids!</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setMuted(m => !m); }}
              className="p-2 rounded-full bg-white shadow hover:scale-105 transform transition"
              aria-label="mute"
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => setMusicOn(m => !m)}
              className="p-2 rounded-full bg-white shadow hover:scale-105 transform transition"
              aria-label="music"
            >
              {musicOn ? '🎵' : '🎶'}
            </button>
          </div>
        </header>

        <main>
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{QUESTIONS[Math.min(index, QUESTIONS.length - 1)]?.image || '🎉'}</div>
                <div>
                  <div className="text-sm text-gray-500">Question</div>
                  <div className="text-lg font-bold">{inResults ? 'All done!' : `#${index + 1} of ${QUESTIONS.length}`}</div>
                </div>
              </div>
              <div className="w-48">
                <div className="text-sm text-gray-500">Time left</div>
                <div className="text-xl font-bold">{inResults ? '-' : `${seconds}s`}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: 'linear-gradient(90deg,#f97316,#facc15,#34d399)' }} />
            </div>

            {!inResults ? (
              <div>
                <h2 className="text-2xl font-extrabold mb-3">{QUESTIONS[index].question}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {QUESTIONS[index].options.map(opt => {
                    const isSelected = selected === opt.id;
                    const isCorrect = opt.correct && showFeedback && (selected === opt.id || selected === 'timeup');
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt)}
                        className={`rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg transform transition-all hover:scale-105 focus:scale-105 focus:outline-none ${isSelected ? 'ring-4 ring-offset-2' : ''}`}
                        style={{ background: 'linear-gradient(180deg,#fff,#fef3c7)' }}
                      >
                        <div className={`text-5xl mb-2 ${isSelected ? 'animate-pop' : ''}`}>{opt.img}</div>
                        <div className="font-bold text-lg">{opt.label}</div>
                        {/* feedback */}
                        {showFeedback && isSelected && (
                          <div className={`mt-2 text-sm font-semibold ${opt.correct ? 'text-green-600' : 'text-red-500'}`}>
                            {opt.correct ? 'Yay! Well done! 🎉' : 'Oops! Try next one!'}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl">🎉</div>
                <h2 className="text-3xl font-extrabold mt-4">Great job!</h2>
                <p className="mt-2 text-lg">You got <strong>{score}</strong> out of <strong>{QUESTIONS.length}</strong> correct.</p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`text-4xl transform transition ${i < stars ? 'animate-bounce' : 'opacity-30'}`}>⭐</div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                  <button onClick={restart} className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transform transition">Play Again</button>
                  <button onClick={() => alert('Share feature coming soon!')} className="px-4 py-2 rounded-full bg-yellow-300 font-bold shadow">Share</button>
                </div>
              </div>
            )}

            {/* Footer small controls */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div>Score: <span className="font-bold">{score}</span></div>
              <div>Progress: <span className="font-bold">{index}/{QUESTIONS.length}</span></div>
            </div>
          </div>
        </main>

        <footer className="mt-4 text-center text-sm text-gray-500">Made with ❤️ — bright colors & silly sounds!</footer>
      </div>

      {/* small style block for animations */}
      <style>{`
        .animate-cloud { animation: floatX 20s linear infinite; }
        .animate-cloud-slow { animation: floatX 40s linear infinite; }
        @keyframes floatX { from { transform: translateX(-20%);} to { transform: translateX(120%);} }
        .animate-pop { animation: pop 300ms ease; }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.18); } 100% { transform: scale(1); } }
        .rounded-2xl { border-radius: 1rem; }
      `}</style>
    </div>
  );
}
