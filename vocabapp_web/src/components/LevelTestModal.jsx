import React, { useState } from 'react';
import { X, Sparkles, Brain, Award, ChevronRight, RotateCcw, BarChart3, Clock, CheckCircle2, ChevronLeft, Lightbulb, ArrowRight } from 'lucide-react';
import { levelTestQuestions, getLevelFromScore } from '../data/levelTestData';
import { Mascot } from './Mascot';

export const LevelTestModal = ({ isOpen, onClose, t, isDark }) => {
    const [testState, setTestState] = useState('intro'); // intro, testing, analyzing, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isRevealingNext, setIsRevealingNext] = useState(false);

    if (!isOpen) return null;

    const startTest = () => {
        setTestState('testing');
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleAnswerSelect = (optionIndex) => {
        if (isRevealingNext) return;

        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));

        // Auto-advance with a slight delay
        setIsRevealingNext(true);
        setTimeout(() => {
            if (currentQuestionIndex < levelTestQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setIsRevealingNext(false);
            } else {
                finishTest();
            }
        }, 400);
    };

    const finishTest = () => {
        setTestState('analyzing');
        setTimeout(() => {
            setTestState('result');
        }, 1500);
    };

    const reset = () => {
        setTestState('intro');
        setCurrentQuestionIndex(0);
        setAnswers({});
        setIsRevealingNext(false);
    };

    const calculateScore = () => {
        let score = 0;
        levelTestQuestions.forEach((q, idx) => {
            if (answers[idx] === q.correct) score++;
        });
        return score;
    };

    const score = calculateScore();
    const evaluation = getLevelFromScore(score);

    const getLevelColor = (level) => {
        if (level.includes('C')) return 'text-emerald-500';
        if (level.includes('B2')) return 'text-teal-500';
        if (level.includes('B1')) return 'text-blue-500';
        if (level.includes('A2')) return 'text-amber-500';
        return 'text-slate-400';
    };

    const currentQuestion = levelTestQuestions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / levelTestQuestions.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Container */}
            <div className={`relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-[2.5rem] border shadow-2xl overflow-hidden transition-all duration-500 scale-in-center ${isDark ? 'bg-[#121216] border-slate-800' : 'bg-white border-slate-200'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <BarChart3 size={22} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {t.levelTestTitle || "Seviye Tespit"}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">English Core Engine</span>
                                <span className="px-1.5 py-0.5 text-[7px] font-black bg-indigo-500 text-white rounded-full leading-none">V2</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {testState === 'intro' && (
                        <div className="animate-fade-in flex flex-col items-center text-center">
                            <Mascot isDark={isDark} size="lg" look="happy" glow={true} />
                            <h3 className={`text-3xl font-black mb-4 mt-4 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Hi, I'm your Hoca! 👋</h3>
                            <p className={`text-sm font-bold opacity-60 mb-8 max-w-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                "I've prepared 15 questions ranging from basic to advanced. Let's find your real English level together!"
                            </p>

                            <div className={`w-full p-5 rounded-3xl mb-8 flex items-center gap-4 text-left border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                    <Clock size={18} strokeWidth={3} />
                                </div>
                                <div>
                                    <div className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Estimated Time</div>
                                    <div className="text-[10px] font-bold opacity-50">Around 3-5 minutes</div>
                                </div>
                            </div>

                            <button
                                onClick={startTest}
                                className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all transform active:scale-[0.98]"
                            >
                                TESTE BAŞLA <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {testState === 'testing' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Question {currentQuestionIndex + 1} of 15</span>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-md self-start ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{currentQuestion.level} Difficulty</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] font-black opacity-50">{Math.round(progressPercent)}%</div>
                                </div>
                            </div>

                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                            </div>

                            <div key={currentQuestionIndex} className="animate-slide-up">
                                <h3 className={`text-xl font-bold mb-8 leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {currentQuestion.question}
                                </h3>

                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(idx)}
                                            className={`w-full p-5 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center group
                        ${answers[currentQuestionIndex] === idx
                                                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg'
                                                    : isDark
                                                        ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                                                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:text-slate-900'}`}
                                        >
                                            <span>{option}</span>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQuestionIndex] === idx ? 'bg-white border-white text-indigo-500' : 'border-current opacity-20 group-hover:opacity-40'}`}>
                                                {answers[currentQuestionIndex] === idx && <CheckCircle2 size={14} strokeWidth={3} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {testState === 'analyzing' && (
                        <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
                            <div className="relative mb-10 w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                                    <Sparkles size={40} className="animate-pulse" />
                                </div>
                            </div>
                            <h3 className={`text-2xl font-black mb-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Analyzing Skills...</h3>
                            <p className={`text-sm font-bold opacity-60 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Evaluating grammar, structure, and complexity patterns.</p>
                        </div>
                    )}

                    {testState === 'result' && (
                        <div className="animate-fade-in text-center py-4">
                            <div className="mb-6 relative">
                                <div className="flex justify-center mb-4">
                                    <Mascot isDark={isDark} size="lg" look="happy" glow={true} />
                                </div>
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Your Verified Level
                                </h3>
                                <div className={`text-4xl font-black mb-2 animate-scale-up ${getLevelColor(evaluation.level)}`}>
                                    {evaluation.level}
                                </div>
                                <div className={`text-sm font-bold opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Correct Answers: <span className="text-indigo-500 font-black">{score}</span> / 15
                                </div>
                            </div>

                            <div className={`p-6 rounded-[2rem] mb-8 text-left border ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/20 shadow-xl' : 'bg-slate-50 border-slate-200'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Award size={18} />
                                    </div>
                                    <h4 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Hoca'dan Not</h4>
                                </div>
                                <p className={`text-base font-bold mb-4 leading-snug ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                                    {evaluation.feedback}
                                </p>
                                <div className={`h-px w-full my-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                                <div className="flex items-center gap-3 text-indigo-500">
                                    <Lightbulb size={16} strokeWidth={3} />
                                    <p className="text-[11px] font-black uppercase tracking-widest">Growth Recommendation</p>
                                </div>
                                <p className={`text-xs font-bold leading-relaxed opacity-70 mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {score < 10 ? "Focus on common irregular verbs and consistent daily practice vocabulary." : "Start reading more academic articles to polish your advanced grammar structures."}
                                </p>
                            </div>

                            <button
                                onClick={reset}
                                className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                            >
                                <RotateCcw size={14} /> Restart Test
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Area */}
                <div className={`p-6 pt-2 border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                        VOCABAPP VERIFIED ASSESSMENT <ChevronRight size={10} className="text-slate-600" /> V2.1
                    </p>
                </div>
            </div>
        </div>
    );
};
