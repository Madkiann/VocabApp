import React from 'react';
import { RefreshCw, GraduationCap, AlertCircle, Target, ArrowRight, Sparkles, Loader2, Check, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Mascot } from './Mascot';
export const Quiz = ({
    t,
    isDark,
    appMode,
    quizQuestion,
    isTranslated,
    setIsTranslated,
    quizFeedback,
    handleQuizAction,
    selectedTokens,
    availableTokens,
    toggleToken,
    handleSentenceCheck,
    onDragStart,
    onDragEnter,
    onDragEnd,
    quizExplanation,
    explainMistake,
    isExplaining,
    setAppMode,
    deck,
    currentWordIndex,
    setIsRevealed,
    cardBg,
    bgMain,
    textMain,
    isAdmin = false,
    isQuizReview = false
}) => {
    const renderQuizFeedback = () => (
        <div className="mt-8 space-y-6 animate-fade-in w-full">
            <div className={`p-8 rounded-[3rem] border-2 shadow-premium ${quizFeedback.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10'}`}>
                <div className={`text-center font-black text-2xl mb-6 flex flex-col items-center gap-6 ${quizFeedback.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <Mascot
                        isDark={isDark}
                        size="xl"
                        look={quizFeedback.type === 'success' ? "happy" : "neutral"}
                        animated={false}
                        glow={false}
                        className="opacity-90"
                        isAdmin={isAdmin}
                    />
                    <div className="flex items-center justify-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl flex-shrink-0 ${quizFeedback.type === 'success' ? 'bg-emerald-500 animate-pop' : 'bg-rose-500 animate-shake'}`}>
                            {quizFeedback.type === 'success' ? <Check size={24} strokeWidth={3.5} /> : <X size={24} strokeWidth={3.5} />}
                        </div>
                        <span className="uppercase tracking-tight">{quizFeedback.message}</span>
                    </div>
                </div>

                {quizFeedback.type === 'error' && quizFeedback.correctValueLocal && (
                    <div className="text-center mt-6 flex flex-col gap-6">
                        {quizFeedback.userValueLocal && (
                            <div className="opacity-50">
                                <p className="text-[10px] uppercase font-black tracking-[0.25em] mb-2">{t.yourAnswer}</p>
                                <p className="text-xl font-bold line-through decoration-rose-500/50">{quizFeedback.userValueLocal}</p>
                            </div>
                        )}
                        <div className={`p-6 rounded-[2rem] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-100 shadow-sm'}`}>
                            <p className="text-[10px] uppercase font-black tracking-[0.25em] text-indigo-500 mb-2">{t.correctAnswerIs}</p>
                            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight uppercase">{quizFeedback.correctValueLocal}</p>
                        </div>
                    </div>
                )}
            </div>

            {quizFeedback.type === 'error' && !quizExplanation && (
                <div className="flex flex-col gap-4">
                    <button onClick={() => { setAppMode('swipe'); if (deck[currentWordIndex]) setIsRevealed(deck[currentWordIndex].sm2.rep === 0); }} className="w-full py-6 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg flex items-center justify-center gap-3 shadow-glow-blue transition-all active:scale-95 uppercase tracking-widest">
                        {t.gotIt} <ArrowRight size={24} />
                    </button>
                    <button onClick={explainMistake} disabled={isExplaining} className={`w-full py-5 rounded-3xl font-black flex items-center justify-center gap-3 border-2 transition-all uppercase tracking-widest text-xs ${isDark ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'}`}>
                        {isExplaining ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />} {t.askTeacher}
                    </button>
                </div>
            )}

            {quizExplanation && (
                <div className={`p-8 rounded-[3rem] border-2 border-indigo-500 animate-fade-in ${isDark ? 'glass-dark' : 'glass'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500 rounded-lg text-white"><Sparkles size={16} /></div>
                        <p className="font-black uppercase tracking-[0.2em] text-indigo-500 text-[10px]">{t.teacherAnalysis}</p>
                    </div>
                    <p className="text-lg font-bold leading-relaxed mb-6 italic opacity-90">"{quizExplanation}"</p>
                    <button onClick={() => { setAppMode('swipe'); if (deck[currentWordIndex]) setIsRevealed(deck[currentWordIndex].sm2.rep === 0); }} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest">
                        {t.gotIt} <ArrowRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className={`w-full max-w-sm ${cardBg} rounded-[2.5rem] shadow-premium p-8 border mt-4 flex flex-col items-center animate-fade-in overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar`}>
            <div className="w-full flex items-center justify-between mb-8">
                <div className={`flex items-center gap-3 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        {appMode === 'quiz_mc' && <GraduationCap size={28} />}
                        {appMode === 'quiz_tf' && <AlertCircle size={28} />}
                        {appMode === 'quiz_sentence' && <Target size={28} />}
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">{appMode === 'quiz_mc' ? t.meaning : appMode === 'quiz_tf' ? t.trueFalse : t.buildSentence}</h2>
                        {isQuizReview && (
                            <div className={`mt-1 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest flex items-center gap-1 w-max ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                <RefreshCw size={8} /> Review Mode
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={() => setIsTranslated(!isTranslated)} className={`p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-sm ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-amber-600'}`}>
                    <RefreshCw size={22} className={isTranslated ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
                </button>
            </div>

            <div className="w-full mb-10">
                {appMode === 'quiz_mc' && (
                    <div className={`p-8 rounded-[2.5rem] text-center border shadow-inner ${isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                        <h3 className={`text-3xl font-black leading-tight ${isDark ? 'text-white' : 'text-indigo-900'}`}>{isTranslated ? quizQuestion.target.trDef : quizQuestion.target.engDef}</h3>
                    </div>
                )}
                {appMode === 'quiz_tf' && (
                    <div className={`p-8 rounded-[2.5rem] text-center border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <h3 className={`text-4xl font-black mb-4 uppercase tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-900'}`}>{quizQuestion.target.word}</h3>
                        <p className="text-lg opacity-50 font-medium italic leading-tight">"{isTranslated ? quizQuestion.displayedTrDef : quizQuestion.displayedEngDef}"</p>
                    </div>
                )}
                {appMode === 'quiz_sentence' && (
                    <div className={`p-8 rounded-[2.5rem] text-white shadow-glow-blue border border-blue-400/30 ${isDark ? 'bg-blue-600/80' : 'bg-blue-700'}`}>
                        <p className="text-2xl font-black leading-tight tracking-tight text-center">"{quizQuestion.target.trExample}"</p>
                    </div>
                )}
            </div>

            {!quizFeedback ? (
                <div className="w-full space-y-4">
                    {appMode === 'quiz_mc' && quizQuestion.options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleQuizAction(opt.id === quizQuestion.target.id, t.incorrectCorrect, quizQuestion.target.word, null, 'mc')}
                            className={`w-full p-6 rounded-[2rem] text-lg font-black transition-all hover:scale-[1.03] active:scale-95 border-2 shadow-sm flex items-center justify-between group ${isDark ? 'bg-slate-800 border-transparent hover:border-indigo-500 text-slate-100' : 'bg-white border-slate-100 hover:border-indigo-400 text-slate-900'}`}
                        >
                            <span className="uppercase tracking-tight">{opt.word}</span>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all group-hover:bg-indigo-500 group-hover:border-indigo-500 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
                            </div>
                        </button>
                    ))}
                    {appMode === 'quiz_tf' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleQuizAction(true === quizQuestion.isCorrectPair, t.incorrectBtn, quizQuestion.target.word, null, 'tf')} className="flex-1 py-7 rounded-[2rem] bg-emerald-500 text-white font-black text-2xl shadow-glow-emerald transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">{t.trueBtn}</button>
                            <button onClick={() => handleQuizAction(false === quizQuestion.isCorrectPair, t.incorrectBtn, quizQuestion.target.word, null, 'tf')} className="flex-1 py-7 rounded-[2rem] bg-rose-500 text-white font-black text-2xl shadow-glow-rose transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">{t.falseBtn}</button>
                        </div>
                    )}
                    {appMode === 'quiz_sentence' && (
                        <>
                            <div className={`min-h-[140px] border-2 border-dashed rounded-[2.5rem] p-6 flex flex-wrap content-start gap-3 transition-all ${isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                                {selectedTokens.map((tok, i) => (
                                    <div
                                        key={tok.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, i)}
                                        onDragEnter={(e) => onDragEnter(e, i)}
                                        onDragEnd={onDragEnd}
                                        onClick={() => toggleToken(tok, 'selected')}
                                        className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-2xl cursor-grab active:cursor-grabbing shadow-premium animate-pop"
                                    >
                                        {tok.text}
                                    </div>
                                ))}
                                {selectedTokens.length === 0 && <p className="w-full text-center text-sm font-black uppercase tracking-widest opacity-20 py-8 leading-relaxed px-4">{t.dragTokens}</p>}
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center mt-8">
                                {availableTokens.map(tok => (
                                    <button
                                        key={tok.id}
                                        onClick={() => toggleToken(tok, 'available')}
                                        className={`px-5 py-2.5 font-black rounded-2xl shadow-sm border-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}
                                    >
                                        {tok.text}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSentenceCheck}
                                disabled={selectedTokens.length === 0}
                                className="w-full mt-10 py-6 bg-amber-400 disabled:opacity-50 text-slate-900 font-black text-lg rounded-3xl shadow-glow-amber transition-all active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                            >
                                <Target size={24} /> {t.checkAnswer}
                            </button>
                        </>
                    )}
                </div>
            ) : renderQuizFeedback()}
        </div>
    );
};
