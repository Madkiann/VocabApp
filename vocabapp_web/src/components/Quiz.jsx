import { RefreshCw, GraduationCap, AlertCircle, Target, ArrowRight, Sparkles, Loader2, Check, RotateCcw } from 'lucide-react';
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
        <div className="flex flex-col h-full w-full animate-fade-in">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-4">
                <div className={`p-6 rounded-[2.5rem] border-2 shadow-premium ${quizFeedback.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-purple-500/30 bg-purple-500/5'}`}>
                    <div className="flex flex-col items-center gap-4">
                        <Mascot
                            isDark={isDark}
                            size="lg"
                            look={quizFeedback.type === 'success' ? "happy" : "neutral"}
                            isAdmin={isAdmin}
                        />
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${quizFeedback.type === 'success' ? 'bg-emerald-500 animate-pop' : 'bg-purple-500 animate-shake'}`}>
                                {quizFeedback.type === 'success' ? <Check size={20} strokeWidth={3} /> : <RotateCcw size={20} strokeWidth={3} />}
                            </div>
                            <span className="font-black text-lg uppercase tracking-tight text-inherit">{quizFeedback.message}</span>
                        </div>
                    </div>

                    {quizFeedback.type === 'error' && quizFeedback.correctValueLocal && (
                        <div className="mt-6 flex flex-col gap-4">
                            <div className="opacity-50 text-center">
                                <p className="text-[8px] uppercase font-black tracking-widest mb-1">{t.yourAnswer || "Your Answer"}</p>
                                <p className="text-sm font-bold line-through opacity-70">{quizFeedback.userValueLocal}</p>
                            </div>
                            <div className={`p-5 rounded-3xl text-center ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-100 shadow-sm'}`}>
                                <p className="text-[8px] uppercase font-black tracking-widest text-indigo-500 mb-1">{t.correctAnswerIs || "Correct Answer"}</p>
                                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight uppercase">{quizFeedback.correctValueLocal}</p>
                            </div>
                        </div>
                    )}
                </div>

                {quizExplanation && (
                    <div className={`mt-4 p-6 rounded-[2.5rem] border-2 border-indigo-500/50 bg-indigo-500/5 animate-fade-in`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-indigo-500" />
                            <p className="font-black uppercase tracking-widest text-indigo-500 text-[9px]">{t.teacherAnalysis || "Hoca Analizi"}</p>
                        </div>
                        <p className="text-sm font-bold leading-relaxed italic opacity-90">"{quizExplanation}"</p>
                    </div>
                )}
            </div>

            {/* Bottom Sticky Action Area */}
            <div className="mt-auto space-y-2 flex-shrink-0">
                <button
                    onClick={() => { setAppMode('swipe'); if (deck[currentWordIndex]) setIsRevealed(deck[currentWordIndex].sm2.rep === 0); }}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-glow-blue transition-all active:scale-95 uppercase tracking-widest"
                >
                    {t.gotIt || "Anladım"} <ArrowRight size={20} />
                </button>

                {quizFeedback.type === 'error' && !quizExplanation && (
                    <button
                        onClick={explainMistake}
                        disabled={isExplaining}
                        className={`w-full py-2.5 rounded-xl font-black flex items-center justify-center gap-2 border-2 transition-all uppercase tracking-widest text-[9px] ${isDark ? 'border-indigo-500/30 text-indigo-400 opacity-60 hover:opacity-100 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 opacity-60 hover:opacity-100 hover:bg-indigo-50'}`}
                    >
                        {isExplaining ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                        {t.askTeacher || "NEDEN? HOCAYA SOR"}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className={`w-full h-full max-w-sm ${cardBg} rounded-[2.5rem] shadow-premium p-5 pt-6 border flex flex-col animate-fade-in overflow-hidden relative z-10 font-sans`}>
            {/* 1. Header Area - Slimmed down */}
            <div className="w-full flex items-center justify-between mb-4 flex-shrink-0">
                <div className={`flex items-center gap-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        {appMode === 'quiz_mc' && <GraduationCap size={22} />}
                        {appMode === 'quiz_tf' && <AlertCircle size={22} />}
                        {appMode === 'quiz_sentence' && <Target size={22} />}
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-tight leading-none">{appMode === 'quiz_mc' ? t.meaning || "MEANING" : appMode === 'quiz_tf' ? t.trueFalse || "TRUE/FALSE" : t.buildSentence || "SENTENCE"}</h2>
                        {isQuizReview && (
                            <div className={`mt-1 px-1.5 py-0.5 rounded-md text-[6.5px] font-black uppercase tracking-widest flex items-center gap-1 w-max ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                <RefreshCw size={8} /> Review
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={() => setIsTranslated(!isTranslated)} className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-amber-600'}`}>
                    <RefreshCw size={18} className={isTranslated ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
                </button>
            </div>

            {/* 2. Content Area - Flexible & Scrollable if needed */}
            <div className={`flex-1 flex flex-col ${!quizFeedback ? 'justify-center' : 'justify-start overflow-y-auto custom-scrollbar'} min-h-0 w-full`}>
                {!quizFeedback ? (
                    <>
                        <div className="w-full mb-4 relative z-10 flex-shrink-0">
                            {appMode === 'quiz_mc' && (
                                <div className={`p-5 rounded-[2rem] text-center border shadow-inner ${isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                                    <h3 className={`text-xl font-black leading-tight ${isDark ? 'text-white' : 'text-indigo-900'}`}>{isTranslated ? quizQuestion.target.trDef : quizQuestion.target.engDef}</h3>
                                </div>
                            )}
                            {appMode === 'quiz_tf' && (
                                <div className={`p-5 rounded-[2rem] text-center border ${isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${isDark ? 'text-indigo-400' : 'text-indigo-900'}`}>{quizQuestion.target.word}</h3>
                                    <p className="text-sm opacity-50 font-medium italic leading-tight">"{isTranslated ? quizQuestion.displayedTrDef : quizQuestion.displayedEngDef}"</p>
                                </div>
                            )}
                            {appMode === 'quiz_sentence' && (
                                <div className={`p-5 rounded-[2rem] text-white shadow-glow-blue border border-blue-400/30 ${isDark ? 'bg-blue-600/80' : 'bg-blue-700'}`}>
                                    <p className="text-lg font-black leading-tight tracking-tight text-center">"{quizQuestion.target.trExample}"</p>
                                </div>
                            )}
                        </div>

                        {/* 3. Action / Options Area */}
                        <div className="w-full space-y-3 flex-shrink-0">
                            {appMode === 'quiz_mc' && quizQuestion.options.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleQuizAction(opt.id === quizQuestion.target.id, t.incorrectCorrect || "Incorrect!", quizQuestion.target.word, null, 'mc')}
                                    className={`w-full p-4 rounded-[1.5rem] text-base font-black transition-all hover:scale-[1.02] active:scale-95 border-2 shadow-sm flex items-center justify-between group ${isDark ? 'bg-slate-800 border-transparent hover:border-indigo-500 text-slate-100' : 'bg-white border-slate-100 hover:border-indigo-400 text-slate-900'}`}
                                >
                                    <span className="uppercase tracking-tight truncate mr-2">{opt.word}</span>
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all group-hover:bg-indigo-500 group-hover:border-indigo-500 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
                                    </div>
                                </button>
                            ))}
                            {appMode === 'quiz_tf' && (
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => handleQuizAction(false === quizQuestion.isCorrectPair, t.incorrectBtn || "Incorrect!", quizQuestion.target.word, null, 'tf')} className="flex-1 py-5 rounded-[1.5rem] bg-purple-500 text-white font-black text-xl shadow-glow-purple transition-all active:scale-95 uppercase tracking-widest">{t.falseBtn || "FALSE"}</button>
                                    <button onClick={() => handleQuizAction(true === quizQuestion.isCorrectPair, t.incorrectBtn || "Incorrect!", quizQuestion.target.word, null, 'tf')} className="flex-1 py-5 rounded-[1.5rem] bg-emerald-500 text-white font-black text-xl shadow-glow-emerald transition-all active:scale-95 uppercase tracking-widest">{t.trueBtn || "TRUE"}</button>
                                </div>
                            )}
                            {appMode === 'quiz_sentence' && (
                                <div className="flex flex-col h-full min-h-0">
                                    <div className={`flex-1 min-h-[100px] max-h-[180px] overflow-y-auto border-2 border-dashed rounded-[2rem] p-4 flex flex-wrap content-start gap-2 transition-all ${isDark ? 'bg-indigo-950/20 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                                        {selectedTokens.map((tok, i) => (
                                            <div
                                                key={tok.id}
                                                draggable
                                                onDragStart={(e) => onDragStart(e, i)}
                                                onDragEnter={(e) => onDragEnter(e, i)}
                                                onDragEnd={onDragEnd}
                                                onClick={() => toggleToken(tok, 'selected')}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-black rounded-xl cursor-grab active:cursor-grabbing shadow-sm animate-pop"
                                            >
                                                {tok.text}
                                            </div>
                                        ))}
                                        {selectedTokens.length === 0 && <p className="w-full text-center text-[10px] font-black uppercase tracking-widest opacity-20 py-4 leading-relaxed">{t.dragTokens || "Select words"}</p>}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 justify-center mt-4 max-h-[120px] overflow-y-auto p-1">
                                        {availableTokens.map(tok => (
                                            <button
                                                key={tok.id}
                                                onClick={() => toggleToken(tok, 'available')}
                                                className={`px-3 py-1.5 font-black rounded-xl shadow-sm border-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight text-[10px] ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}
                                            >
                                                {tok.text}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleSentenceCheck}
                                        disabled={selectedTokens.length === 0}
                                        className="w-full mt-4 py-4 bg-amber-400 disabled:opacity-50 text-slate-900 font-black text-base rounded-2xl shadow-glow-amber transition-all active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                                    >
                                        <Target size={20} /> {t.checkAnswer || "CHECK"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 w-full flex flex-col h-full min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            {renderQuizFeedback()}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Hint - Zero impact on content */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-20 text-[8px] font-bold uppercase tracking-widest pointer-events-none z-0">
                {t.quizHint || "Think carefully"}
            </div>
        </div>
    );
};
