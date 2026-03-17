import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    X,
    Check,
    ArrowRight,
    Flame,
    Heart,
    RotateCcw,
    Trophy,
    Zap,
    ChevronRight,
    Star,
    Sparkles
} from 'lucide-react';
import { Mascot } from './Mascot';
import { grammarCases } from '../data/libraryData';

// Performance Optimization: Memoized Token component
const Token = React.memo(({ text, onClick, index, isSelected, isDark }) => (
    <button
        onClick={() => onClick(index)}
        className={`px-4 py-2.5 rounded-2xl font-black text-sm transition-all active:scale-90 shadow-sm border-2 animate-pop ${isSelected
            ? 'opacity-20 pointer-events-none'
            : isDark
                ? 'bg-slate-800 border-white/5 text-white hover:border-indigo-500'
                : 'bg-white border-slate-100 text-slate-800 hover:border-indigo-400'
            }`}
    >
        {text}
    </button>
));

export const StreakRunArena = ({ isDark, t, onClose, isAdmin }) => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem('vocabapp_arena_streak') || '0'));
    const [lives, setLives] = useState(3);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [level, setLevel] = useState(1);

    // Performance: Memoize all challenges to avoid recalculating
    const allChallenges = useMemo(() => {
        let pool = [];
        grammarCases.forEach(category => {
            category.examples.forEach((ex, idx) => {
                let diff = 1;
                if (category.id.startsWith('pe-') || category.id.startsWith('cl-')) diff = 2;
                if (category.id.startsWith('ad-') || category.id.startsWith('pr-')) diff = 3;

                pool.push({
                    id: `${category.id}-${idx}`,
                    tr: ex.tr,
                    eng: ex.eng.replace(/[.,!?]/g, ''),
                    point: ex.point,
                    difficulty: diff,
                    source: category.title
                });
            });
        });
        return pool;
    }, []);

    const initNextChallenge = useCallback(() => {
        setFeedback(null);
        setSelectedTokens([]);

        // Pick based on level
        const possible = allChallenges.filter(c => c.difficulty <= level);
        const random = possible[Math.floor(Math.random() * possible.length)];

        const words = random.eng.split(' ');
        const scrambled = [...words].sort(() => Math.random() - 0.5);

        // Add distractors if level is higher
        if (level > 1) {
            const distractors = ["is", "the", "not", "always", "very", "do", "will"].sort(() => Math.random() - 0.5);
            scrambled.push(...distractors.slice(0, level - 1));
        }

        setCurrentChallenge({
            ...random,
            tokens: scrambled.sort(() => Math.random() - 0.5),
            correctSequence: words
        });
    }, [allChallenges, level]);

    const handleStart = () => {
        setGameState('playing');
        setStreak(0);
        setLives(3);
        setLevel(1);
        initNextChallenge();
    };

    const handleTokenClick = (index) => {
        if (feedback || isSelected(index)) return;

        const token = currentChallenge.tokens[index];
        const newSelected = [...selectedTokens, { text: token, index }];
        setSelectedTokens(newSelected);

        // Check sequence as they build it
        const currentPart = currentChallenge.correctSequence.slice(0, newSelected.length);
        const isRightSoFar = newSelected.every((val, idx) => val.text.toLowerCase() === currentPart[idx].toLowerCase());

        if (!isRightSoFar) {
            setFeedback('wrong');
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                setTimeout(() => setGameState('gameover'), 1500);
            } else {
                setTimeout(() => initNextChallenge(), 1500);
            }
        } else if (newSelected.length === currentChallenge.correctSequence.length) {
            // Success!
            setFeedback('correct');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > bestStreak) {
                setBestStreak(newStreak);
                localStorage.setItem('vocabapp_arena_streak', newStreak.toString());
            }

            // Progression logic
            if (newStreak % 5 === 0) setLevel(prev => Math.min(prev + 1, 3));

            setTimeout(() => {
                initNextChallenge();
            }, 1000);
        }
    };

    const isSelected = (index) => selectedTokens.some(t => t.index === index);

    const handleRemoveLast = () => {
        if (feedback) return;
        setSelectedTokens(prev => prev.slice(0, -1));
    };

    return (
        <div className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 transition-all duration-300 ${isDark ? 'bg-black/95' : 'bg-slate-900/40 backdrop-blur-sm'}`}>
            <div className={`relative w-full max-w-lg h-[85vh] sm:h-[700px] rounded-[3rem] shadow-2xl flex flex-col border overflow-hidden ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'
                }`}>

                {/* Header Section - Minimal for performance */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <button onClick={onClose} className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-500'}`}>
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500">
                            <Flame size={14} className={streak > 0 ? 'animate-bounce' : ''} fill="currentColor" />
                            <span className="text-xs font-black">{streak}</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <Heart key={i} size={14} className={i <= lives ? 'fill-red-500 text-red-500' : 'opacity-10'} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center">

                    {gameState === 'start' && (
                        <div className="flex flex-col items-center text-center max-w-xs animate-fade-in">
                            <Zap size={64} className="text-amber-500 mb-6" fill="currentColor" />
                            <h2 className={`text-3xl font-black italic tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>STREAK CASE RUN</h2>
                            <p className="text-xs font-bold opacity-50 mb-8 leading-relaxed">Verilen Türkçe ifadenin İngilizcesini kelimeleri doğru sırayla dizerek oluştur. Bakalım ne kadar hatasız gideceksin?</p>

                            <div className={`w-full p-6 rounded-3xl mb-10 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <Trophy size={20} className="text-amber-500 mx-auto mb-2" />
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-30">BEST STREAK</div>
                                <div className="text-2xl font-black">{bestStreak}</div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xl shadow-glow-blue active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                START RUN <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {gameState === 'playing' && currentChallenge && (
                        <div className="w-full flex flex-col h-full animate-fade-in">
                            {/* Level Indicator */}
                            <div className="flex justify-between items-center mb-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${level === 1 ? 'text-emerald-500 bg-emerald-500/10' :
                                    level === 2 ? 'text-indigo-500 bg-indigo-500/10' :
                                        'text-rose-500 bg-rose-500/10'
                                    }`}>
                                    {level === 1 ? 'Beginner' : level === 2 ? 'Master' : 'Legend'} • {currentChallenge.source}
                                </span>
                            </div>

                            {/* The Question (Turkish) */}
                            <div className={`w-full p-8 rounded-[2.5rem] text-center mb-8 border-2 transition-all duration-300 ${feedback === 'correct' ? 'border-emerald-500 bg-emerald-500/5' :
                                feedback === 'wrong' ? 'border-rose-500 bg-rose-500/5' :
                                    isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                                }`}>
                                <p className="text-lg font-black leading-tight tracking-tight italic">
                                    "{currentChallenge.tr}"
                                </p>
                            </div>

                            {/* Sentence Area (Where they see what they built) */}
                            <div className={`w-full min-h-[100px] p-6 rounded-3xl border-2 border-dashed flex flex-wrap gap-2 content-start mb-8 transition-colors ${isDark ? 'bg-indigo-950/20 border-white/10' : 'bg-indigo-50 border-indigo-100/50'
                                }`}>
                                {selectedTokens.map((tok, i) => (
                                    <div
                                        key={i}
                                        onClick={i === selectedTokens.length - 1 ? handleRemoveLast : null}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black animate-pop ${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white shadow-sm'
                                            } ${i === selectedTokens.length - 1 ? 'cursor-pointer active:scale-90 hover:bg-rose-500' : ''}`}
                                    >
                                        {tok.text}
                                    </div>
                                ))}
                                {selectedTokens.length === 0 && (
                                    <div className="w-full flex items-center justify-center h-full opacity-20 italic text-[10px] font-bold uppercase tracking-widest">
                                        Build the sentence...
                                    </div>
                                )}
                            </div>

                            {/* Tokens Pool (Scrambled Words) */}
                            <div className="flex-1 flex flex-wrap justify-center gap-2 content-start mb-10 overflow-y-auto pt-2">
                                {currentChallenge.tokens.map((token, idx) => (
                                    <Token
                                        key={idx}
                                        text={token}
                                        index={idx}
                                        onClick={handleTokenClick}
                                        isSelected={isSelected(idx)}
                                        isDark={isDark}
                                    />
                                ))}
                            </div>

                            {/* Info/Hint Area */}
                            {feedback === 'correct' && (
                                <div className="flex items-center gap-3 text-emerald-500 animate-slide-up mb-4">
                                    <Sparkles size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Great! Next challenge in a moment...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {gameState === 'gameover' && (
                        <div className="flex flex-col items-center text-center animate-fade-in w-full">
                            <Mascot isDark={isDark} size="lg" look="sad" isAdmin={isAdmin} />
                            <h2 className="text-4xl font-black italic tracking-tighter mt-8 mb-2 uppercase text-rose-500">GAME OVER</h2>
                            <p className="text-xs font-bold opacity-50 mb-10">Güzel bir denemeydi! Streak buraya kadarmış.</p>

                            <div className="grid grid-cols-2 gap-3 w-full mb-10">
                                <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1 text-center">YOUR STREAK</div>
                                    <div className="text-2xl font-black text-amber-500 text-center">{streak}</div>
                                </div>
                                <div className={`p-6 rounded-[2rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-1 text-center">BEST STREAK</div>
                                    <div className="text-2xl font-black text-center">{bestStreak}</div>
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full py-5 rounded-[2rem] bg-indigo-600 text-white font-black text-xl shadow-glow-blue active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={20} /> TRY AGAIN
                            </button>
                        </div>
                    )}

                </div>

                {/* Bottom Footer - Simple and clean */}
                <div className={`p-6 border-t flex items-center justify-center gap-8 ${isDark ? 'bg-white/5 border-white/5 text-white/20' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest">DIFFICULTY</span>
                        <span className="text-[10px] font-bold">{level === 1 ? 'Novice' : level === 2 ? 'Expert' : 'Master'}</span>
                    </div>
                    <div className="h-6 w-px bg-current opacity-20"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest">SOLVED</span>
                        <span className="text-[10px] font-bold">{gameState === 'gameover' ? (streak) : streak}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
