import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Timer, Zap, Trophy, Star, ArrowRight, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { rawVocabulary } from '../data/vocabulary';

export const SpeedBlitzArena = ({ isDark, t, onClose }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('vocabapp_blitz_high') || '0'));
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [combo, setCombo] = useState(0);

    const generateChallenge = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * rawVocabulary.length);
        const wordObj = rawVocabulary[randomIndex];

        // Pick 3 wrong options
        let wrongOptions = [];
        while (wrongOptions.length < 3) {
            const w = rawVocabulary[Math.floor(Math.random() * rawVocabulary.length)];
            if (w.word !== wordObj.word && !wrongOptions.includes(w.trWord)) {
                wrongOptions.push(w.trWord);
            }
        }

        const allOptions = [...wrongOptions, wordObj.trWord].sort(() => Math.random() - 0.5);
        setCurrentWord(wordObj);
        setOptions(allOptions);
        setFeedback(null);
    }, []);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setCombo(0);
        generateChallenge();
    };

    const handleAnswer = (selectedTr) => {
        if (gameState !== 'playing' || feedback) return;

        const isCorrect = selectedTr === currentWord.trWord;
        if (isCorrect) {
            setFeedback('correct');
            setScore(prev => prev + 10 + (combo * 2));
            setCombo(prev => prev + 1);
            setTimeout(() => generateChallenge(), 400);
        } else {
            setFeedback('wrong');
            setScore(prev => Math.max(0, prev - 5));
            setCombo(0);
            setTimeout(() => generateChallenge(), 800);
        }
    };

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('gameover');
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('vocabapp_blitz_high', score.toString());
            }
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, score, highScore]);

    return (
        <div className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 transition-all duration-300 ${isDark ? 'bg-black/95' : 'bg-slate-900/40 backdrop-blur-sm'}`}>
            <div className={`relative w-full max-w-lg h-[80vh] sm:h-[650px] rounded-[3rem] shadow-2xl flex flex-col border overflow-hidden ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'
                }`}>

                {/* Timer Bar */}
                {gameState === 'playing' && (
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${timeLeft < 10 ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`}
                            style={{ width: `${(timeLeft / 60) * 100}%` }}
                        />
                    </div>
                )}

                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <button onClick={onClose} className={`p-2 rounded-xl transition-all hover:bg-white/5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">SCORE</span>
                            <span className="text-lg font-black tracking-tighter tabular-nums">{score}</span>
                        </div>
                        <div className={`p-3 rounded-2xl flex items-center gap-2 ${timeLeft < 10 ? 'bg-rose-500 text-white animate-bounce' : isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <Timer size={18} />
                            <span className="font-black tabular-nums">{timeLeft}s</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-20">

                    {gameState === 'start' && (
                        <div className="animate-pop">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500 flex items-center justify-center text-white mb-6 mx-auto shadow-glow-blue rotate-3">
                                <Zap size={40} fill="currentColor" />
                            </div>
                            <h2 className={`text-4xl font-black italic tracking-tighter mb-4 uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>SPEED BLITZ</h2>
                            <p className="text-xs font-bold opacity-50 mb-10 max-w-[240px] leading-relaxed mx-auto">60 saniye içinde kaç kelime bildiğini kanıtla. Kombolar ekstra puan getirir!</p>

                            <div className={`p-6 rounded-3xl border mb-10 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <Trophy size={20} className="text-amber-500 mx-auto mb-2" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 block">PERSONAL BEST</span>
                                <span className="text-2xl font-black text-amber-500">{highScore}</span>
                            </div>

                            <button
                                onClick={startGame}
                                className="px-12 py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xl shadow-glow-blue active:scale-95 transition-all flex items-center gap-3"
                            >
                                GO BLITZ <ArrowRight size={24} />
                            </button>
                        </div>
                    )}

                    {gameState === 'playing' && currentWord && (
                        <div className="w-full animate-fade-in flex flex-col items-center">
                            {/* Combo Badge */}
                            {combo > 1 && (
                                <div className="mb-4 px-4 py-1.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-bounce">
                                    <Sparkles size={12} fill="currentColor" /> {combo}X COMBO!
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className={`text-5xl font-black tracking-tighter italic mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentWord.word}</h3>
                                <div className="flex justify-center items-center gap-2 opacity-30">
                                    <span className="text-[10px] font-black italic tracking-widest uppercase">{currentWord.phonetic}</span>
                                    <span className="w-1 h-1 rounded-full bg-current"></span>
                                    <span className="text-[10px] font-black italic tracking-widest uppercase text-indigo-400">{currentWord.pos}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt)}
                                        className={`p-6 rounded-[2rem] font-black text-sm transition-all active:scale-95 border-2 ${feedback === 'correct' && opt === currentWord.trWord
                                                ? 'bg-emerald-500 border-emerald-500 text-white scale-105'
                                                : feedback === 'wrong' && opt === currentWord.trWord
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                                    : feedback === 'wrong' && opt !== currentWord.trWord
                                                        ? 'bg-rose-500 border-rose-500 text-white'
                                                        : isDark
                                                            ? 'bg-white/5 border-white/5 hover:border-indigo-500 hover:bg-indigo-500/10'
                                                            : 'bg-slate-50 border-slate-100 hover:border-indigo-400 hover:bg-white'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {gameState === 'gameover' && (
                        <div className="animate-pop">
                            <div className="relative mb-8">
                                <Trophy size={80} className="text-amber-500 mx-auto" />
                                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-2 uppercase text-indigo-500">TIMES UP!</h2>
                            <p className="text-lg font-black mb-10">You scored <span className="text-3xl text-emerald-500 tabular-nums">{score}</span> points</p>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">NEW SCORE</div>
                                    <div className="text-2xl font-black">{score}</div>
                                </div>
                                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1">BEST</div>
                                    <div className="text-2xl font-black text-amber-500">{highScore}</div>
                                </div>
                            </div>

                            <button
                                onClick={startGame}
                                className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xl shadow-glow-blue active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                <RotateCcw size={24} /> PLAY AGAIN
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
