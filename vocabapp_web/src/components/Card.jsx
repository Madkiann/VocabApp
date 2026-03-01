import React, { useState } from 'react';
import {
    Check,
    Bookmark,
    Sparkles,
    RefreshCw,
    Edit3,
    Target,
    Layers,
    Loader2,
    Clock,
    Volume2,
    AlertCircle,
    Eye,
    EyeOff,
    Share2,
    BookOpen,
    ChevronDown,
    Trash2,
    Undo2,
    Lightbulb,
    MessagesSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { shareWordToCanvas } from '../utils/shareWord';
import { Mascot } from './Mascot';

export const Card = ({
    wordObj,
    isSavedStatus,
    toggleSaveWord,
    showWriting,
    setShowWriting,
    userSentence,
    setUserSentence,
    writingFeedback,
    setWritingFeedback,
    isEvaluating,
    evaluateSentence,
    showAi,
    setShowAi,
    aiData,
    isAiLoading,
    fetchAiData,
    showDetails,
    setShowDetails,
    showForms,
    setShowForms,
    isDark,
    t,
    appLang,
    isTranslated,
    setIsTranslated,
    isRevealed,
    setIsRevealed,
    renderClickableText,
    setQuickTx,
    stats,
    isAdmin = false,
    onDeleteWord,
    onEditWord,
    onUndo,
    canUndo,
    isSystem = false
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isExampleTrRevealed, setIsExampleTrRevealed] = useState(false);
    const [isCaseExamplesOpen, setIsCaseExamplesOpen] = useState(false);
    const [revealedCaseExampleIdx, setRevealedCaseExampleIdx] = useState(null);
    const [isMiniCaseTrOpen, setIsMiniCaseTrOpen] = useState(false);

    const handleSpeak = (e) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            // Warm up voices (crucial for some browsers/WebViews)
            const voices = window.speechSynthesis.getVoices();

            const utterance = new SpeechSynthesisUtterance(wordObj.word);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.volume = 1.0;

            // Try to find a high-quality English voice if available
            const preferredVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (err) => {
                console.error("TTS Error:", err);
                setIsSpeaking(false);
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    if (!wordObj || !wordObj.sm2) return null;

    return (
        <>
            {/* Embedded Stats - Top Layer Capsule */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-full z-[160] border shadow-2xl pointer-events-none font-black text-[11px] tracking-tight bg-slate-900/60 dark:bg-black/40 border-slate-900/10 dark:border-white/10 text-white/90 backdrop-blur-md">
                <div className="flex items-center gap-1.5 leading-none">
                    <BookOpen size={14} className="text-indigo-400 opacity-90" />
                    <span>{stats?.current} / {stats?.total}</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1.5 leading-none">
                    <Clock size={14} className="text-amber-400 opacity-90" />
                    <span>{stats?.timeRemaining} {t.minsShort} {t.minsLeft}</span>
                </div>
            </div>

            {/* Top Action Area - Positioned relative to card top */}
            <div className="absolute top-12 right-6 flex gap-2 z-50">
                {canUndo && (
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onUndo(); }}
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} backdrop-blur-md`}
                        title={t.undo || "Geri Al"}
                    >
                        <Undo2 size={16} strokeWidth={2.5} />
                    </button>
                )}
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); shareWordToCanvas(wordObj, appLang, t, isDark); }}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-slate-800/40 text-slate-300' : 'bg-white/50 text-slate-500 hover:bg-white/90'} backdrop-blur-md`}
                    title="Paylaş / Share"
                >
                    <Share2 size={16} strokeWidth={2.5} />
                </button>
                {!isSystem && (
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); toggleSaveWord(wordObj); }}
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isSavedStatus ? 'bg-amber-400 text-slate-900 shadow-glow-amber' : (isDark ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/80 backdrop-blur-md' : 'bg-white/50 text-slate-500 hover:bg-white/90 backdrop-blur-md')}`}
                    >
                        <Bookmark size={16} strokeWidth={2.5} fill={isSavedStatus ? "currentColor" : "none"} />
                    </button>
                )}
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onEditWord(wordObj); }}
                            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}
                            title="Edit"
                        >
                            <Edit3 size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onDeleteWord(wordObj.id); }}
                            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                            title="Delete"
                        >
                            <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col h-full animate-fade-in relative z-10 font-sans">
                {/* Reveal Overlay - Top Level */}
                {!isRevealed && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group text-center bg-transparent select-none active:bg-slate-500/5 transition-colors duration-200"
                        onClick={() => {
                            setIsRevealed(true);
                        }}
                    >
                        <h2 className={`font-black tracking-tight mb-4 w-full px-2 leading-none pointer-events-none ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl') : 'text-5xl sm:text-6xl'}`} style={{ wordBreak: 'break-word' }}>
                            {wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}
                        </h2>
                        <div className="flex items-center justify-center gap-2 opacity-50 font-serif text-xl relative z-30" style={{ fontFamily: '"Arial Unicode MS", "Lucida Sans Unicode", "Segoe UI", sans-serif' }}>
                            <Volume2
                                size={24}
                                className={`transition-all cursor-pointer ${isSpeaking ? 'text-indigo-400 scale-110 opacity-100 drop-shadow-md' : 'hover:scale-110 hover:text-indigo-500'}`}
                                onClick={handleSpeak}
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                            <span>{wordObj.phonetic}</span>
                        </div>
                        <div className="absolute bottom-16 flex flex-col items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity text-indigo-500 pointer-events-none">
                            <Eye size={36} className="animate-pulse" />
                            <span className="font-extrabold text-[10px] tracking-[0.3em] uppercase">{t.activeRecallTap || "Öğrenmek İçin Dokun"}</span>
                        </div>
                    </div>
                )}

                <div className={`flex-grow flex flex-col overflow-y-auto scrollbar-hide pr-1 relative min-h-0 pt-20 mask-fade-v transition-all duration-300 ${!isRevealed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`} style={{ touchAction: 'pan-y' }}>
                    {/* Persistent POS Tag */}
                    <div className="flex px-8 mb-4">
                        <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm ${isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                            {appLang === 'tr' ? wordObj.posTr : wordObj.pos}
                        </span>
                    </div>

                    {isRevealed && (
                        <div className="space-y-8 pb-8">
                            {/* Mastered Badge */}
                            {wordObj.sm2.rep > 3 && (
                                <div className="mb-2">
                                    <span className="flex items-center w-fit gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20">
                                        <Sparkles size={12} /> {t.mastered || 'MASTERED'}
                                    </span>
                                </div>
                            )}
                            {/* Word & Phonetic */}
                            <div
                                className="mb-2 relative cursor-pointer group hover:bg-slate-500/5 p-4 -ml-4 rounded-3xl transition-colors"
                                onClick={() => setIsRevealed(false)}
                            >
                                <h2 className={`font-black tracking-tight mb-0.5 leading-tight pr-8 ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl') : 'text-4xl sm:text-5xl'}`} style={{ wordBreak: 'break-word' }}>{wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}</h2>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{wordObj.trWord.charAt(0).toUpperCase() + wordObj.trWord.slice(1)}</h3>
                                <div className="flex items-center gap-2 opacity-50 relative z-20" style={{ fontFamily: '"Arial Unicode MS", "Lucida Sans Unicode", "Segoe UI", sans-serif' }}>
                                    <Volume2
                                        size={16}
                                        className={`cursor-pointer transition-all ${isSpeaking ? 'text-indigo-400 scale-125 opacity-100 drop-shadow-md' : 'hover:scale-125 hover:text-indigo-500'}`}
                                        onClick={handleSpeak}
                                    />
                                    <p className={`text-lg font-medium italic ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>{wordObj.phonetic}</p>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
                                    <EyeOff size={24} className="text-slate-500" />
                                </div>
                            </div>

                            {/* Definition */}
                            <section className="mt-6 mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 flex items-center gap-2">
                                    <span className="w-4 h-[2px] bg-current opacity-20"></span> {t.def}
                                </h3>
                                <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${isDark ? 'bg-indigo-950/20 border-indigo-500/20 shadow-premium' : 'bg-indigo-50/50 border-indigo-100 shadow-premium'}`}>
                                    <div className="space-y-4">
                                        <p className={`text-3xl font-black leading-tight ${isDark ? 'text-blue-100' : 'text-blue-900'}`}>
                                            {renderClickableText(isTranslated ? wordObj.trDef : wordObj.engDef)}
                                        </p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsTranslated(!isTranslated); }}
                                            className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em]"
                                        >
                                            <RefreshCw size={14} className={isTranslated ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
                                            {isTranslated ? t.toEn : t.toTr}
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Example */}
                            <section className="mt-6 mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 flex items-center gap-2">
                                    <span className="w-4 h-[2px] bg-current opacity-20"></span> {t.ex}
                                </h3>
                                <p className={`text-xl font-bold leading-relaxed mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                    "{renderClickableText(wordObj.engExample)}"
                                </p>
                                <div className="space-y-3">
                                    {!isExampleTrRevealed ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsExampleTrRevealed(true); }}
                                            className="flex items-center gap-2 text-[10px] font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-[0.2em]"
                                        >
                                            <RefreshCw size={14} /> {t.showTranslation || "Çeviriyi Gör"}
                                        </button>
                                    ) : (
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setIsExampleTrRevealed(false); }}
                                            className={`p-5 rounded-3xl border-l-[6px] italic text-sm font-medium animate-fade-in cursor-pointer ${isDark ? 'glass-dark border-indigo-500/50 text-slate-300' : 'glass border-indigo-400 text-slate-600'}`}>
                                            {wordObj.trExample}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Tools Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button
                                    onClick={() => { setShowWriting(!showWriting); setShowAi(false); setShowForms(false); setShowDetails(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95 ${showWriting ? 'border-amber-400 bg-amber-400/10 text-amber-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400' : 'border-slate-100 glass text-slate-600 shadow-sm')}`}
                                >
                                    <Edit3 size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{t.buildSentence.substring(0, 10)}</span>
                                </button>
                                <button
                                    onClick={() => { setShowDetails(!showDetails); setShowAi(false); setShowWriting(false); setShowForms(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showDetails ? 'border-emerald-400 bg-emerald-400/10 text-emerald-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-emerald-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-emerald-500')}`}
                                >
                                    <BookOpen size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.detailsBtn || 'DETAILS'}</span>
                                </button>
                                <button
                                    onClick={() => { if (!showAi) fetchAiData(wordObj.word); setShowAi(!showAi); setShowWriting(false); setShowForms(false); setShowDetails(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showAi ? 'border-blue-400 bg-blue-400/10 text-blue-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-blue-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-blue-500')}`}
                                >
                                    <Sparkles size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.askAiBtn || 'ASK AI'}</span>
                                </button>

                                <button
                                    onClick={() => { setShowForms(!showForms); setShowAi(false); setShowWriting(false); setShowDetails(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showForms ? 'border-indigo-400 bg-indigo-400/10 text-indigo-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-indigo-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-indigo-500')}`}
                                >
                                    <Layers size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.formsBtn || 'FORMS'}</span>
                                </button>
                            </div>

                            {/* Case Examples (Vaka Örnekleri) - Word Mode Accordion */}
                            {wordObj.details?.caseExamples?.length > 0 && (
                                <section className="mt-4 mb-4">
                                    <div
                                        className={`w-full p-5 rounded-[2.5rem] border-2 relative overflow-hidden text-left shadow-sm cursor-pointer transition-all duration-300 flex flex-col ${isDark ? 'border-amber-500/10 bg-amber-500/5 hover:border-amber-500/30' : 'border-amber-100 bg-amber-50/30 hover:bg-amber-50'}`}
                                        onClick={(e) => { e.stopPropagation(); setIsCaseExamplesOpen(!isCaseExamplesOpen); }}
                                    >
                                        <div className="flex items-center justify-between relative z-10 w-full px-1">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 text-amber-600'}`}>
                                                    <Lightbulb size={20} strokeWidth={2.5} />
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-[0.3em] mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Vaka Örnekleri</span>
                                            </div>
                                            <ChevronDown size={20} strokeWidth={2.5} className={`transform transition-transform duration-300 ${isDark ? 'text-amber-400' : 'text-amber-600'} ${isCaseExamplesOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        <div className={`grid transition-all duration-300 ease-in-out w-full ${isCaseExamplesOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                            <div className="overflow-hidden space-y-4">
                                                {wordObj.details.caseExamples.map((item, idx) => (
                                                    <div key={idx} className={`p-5 rounded-3xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                        <p className={`text-sm font-bold mb-3 leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                                                            {item.tr}
                                                        </p>

                                                        <AnimatePresence>
                                                            {revealedCaseExampleIdx === idx && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    <div
                                                                        className={`p-4 rounded-2xl border-l-[6px] italic text-sm font-medium ${isDark ? 'bg-amber-500/10 border-amber-500/50 text-amber-200' : 'bg-amber-50 border-amber-400 text-amber-900'} cursor-pointer mb-2`}
                                                                        onClick={(e) => { e.stopPropagation(); setRevealedCaseExampleIdx(null); }}
                                                                    >
                                                                        {item.en}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {revealedCaseExampleIdx !== idx && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setRevealedCaseExampleIdx(idx); }}
                                                                className="flex items-center gap-2 text-[10px] font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-[0.2em]"
                                                            >
                                                                <RefreshCw size={14} /> ÇEVİRİYİ GÖR
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Panels */}
                            <div className="space-y-6 pb-6">
                                {showWriting && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-amber-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-amber-500 uppercase tracking-[0.2em]">
                                            <Target size={20} /> {t.translateThis}
                                        </h4>
                                        <p className="text-lg font-black mb-6 opacity-90 leading-tight">"{wordObj.trExample}"</p>
                                        <textarea
                                            value={userSentence}
                                            onChange={(e) => setUserSentence(e.target.value)}
                                            placeholder={t.typeHere}
                                            className={`w-full p-6 rounded-[2rem] border-2 mb-6 bg-transparent focus:outline-none focus:border-amber-400 transition-all text-lg font-bold ${isDark ? 'border-slate-800 text-white' : 'border-slate-100 text-slate-900 shadow-inner'}`}
                                            rows="1"
                                        />
                                        <button
                                            onClick={() => evaluateSentence(wordObj.word)}
                                            disabled={isEvaluating || !userSentence.trim()}
                                            className="w-full py-5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-black rounded-3xl shadow-glow-amber transition-all active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {isEvaluating ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />} {t.sendToTeacher}
                                        </button>
                                        {writingFeedback && (
                                            <div className="mt-8 p-8 rounded-[2.5rem] glass dark:glass-dark shadow-premium animate-fade-in border-t-8 border-indigo-500">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <Mascot isDark={isDark} size="sm" look={writingFeedback.score >= 8 ? "happy" : "neutral"} isAdmin={isAdmin} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">{t.teacherNotes}</span>
                                                    </div>
                                                    <div className="flex gap-1.5 items-center px-4 py-2 bg-amber-400 rounded-full font-black text-xs text-slate-900 shadow-sm">
                                                        <Target size={14} /> {writingFeedback.score}/10
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-xs font-black uppercase opacity-40 mb-2 tracking-widest">{t.teacherComment}</p>
                                                        <p className="text-base font-bold italic leading-relaxed text-slate-700 dark:text-slate-300">"{writingFeedback.feedback}"</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase opacity-40 mb-2 tracking-widest">{t.betterVersion}</p>
                                                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-tight tracking-tight">{writingFeedback.correctedSentence}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showAi && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-blue-500/20' : 'bg-white border-blue-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-blue-500 uppercase tracking-[0.2em]">
                                            <Sparkles size={20} /> AI ANALYSIS
                                        </h4>
                                        {isAiLoading ? (
                                            <div className="flex flex-col items-center py-12 gap-5 relative opacity-80">
                                                <Mascot isDark={isDark} size="lg" animated={false} glow={false} className="mb-2" isAdmin={isAdmin} />
                                                <p className="text-sm font-black animate-pulse uppercase tracking-[0.25em] opacity-40 text-blue-500">{t.teacherThinking}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 animate-fade-in">
                                                {aiData?.sentences?.map((s, i) => (
                                                    <div key={i} className={`p-5 rounded-[2rem] ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-blue-50/50 border border-blue-100'}`}>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-blue-500 text-white rounded-full mb-3 inline-block shadow-sm">{s.type}</span>
                                                        <p className="text-xl font-black leading-tight mb-2 tracking-tight">{s.eng}</p>
                                                        <p className="text-sm opacity-60 font-medium italic">{s.tr}</p>
                                                    </div>
                                                ))}
                                                {aiData?.mnemonic && (
                                                    <div className="p-6 rounded-[2rem] bg-indigo-500/10 border-2 border-dashed border-indigo-500/20">
                                                        <h5 className="text-[10px] font-black uppercase text-indigo-500 mb-2 tracking-[0.2em]">{t.tactic}</h5>
                                                        <p className="text-base italic font-bold text-slate-700 dark:text-slate-300">"{aiData.mnemonic}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showForms && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-purple-500/20' : 'bg-white border-purple-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-purple-500 uppercase tracking-[0.2em]">
                                            <Layers size={20} /> {t.wordForms || 'WORD FAMILY'}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {wordObj.wordFamily && Object.entries(wordObj.wordFamily).map(([pos, word]) => word && (
                                                <div key={pos} className={`p-5 rounded-3xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-purple-50/50 border border-purple-100'}`}>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">{pos}</span>
                                                    <p className="text-base font-black text-purple-600 dark:text-purple-400 tracking-tight">{word}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showDetails && wordObj.details && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-emerald-500/20' : 'bg-white border-emerald-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-emerald-500 uppercase tracking-[0.2em]">
                                            <BookOpen size={20} /> {t.wordDetails || 'WORD DETAILS'}
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                {(wordObj.details.root || wordObj.details.origin?.root) && (
                                                    <div className={`p-5 rounded-3xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-2">{t.root}</span>
                                                        <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.origin?.root || wordObj.details.root}</p>
                                                    </div>
                                                )}
                                                {(wordObj.details.prefix || wordObj.details.origin?.prefix) && (
                                                    <div className={`p-5 rounded-3xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-2">{t.prefix}</span>
                                                        <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.origin?.prefix || wordObj.details.prefix}</p>
                                                    </div>
                                                )}
                                                {(wordObj.details.suffix || wordObj.details.origin?.suffix) && (
                                                    <div className={`p-5 rounded-3xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-2">{t.suffix}</span>
                                                        <p className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.origin?.suffix || wordObj.details.suffix}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {((wordObj.details.synonyms?.length > 0 || wordObj.details.antonyms?.length > 0) || (wordObj.details.similarWords?.synonyms?.length > 0 || wordObj.details.similarWords?.antonyms?.length > 0)) && (
                                                <div className="pt-4 border-t border-emerald-500/10">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 block">{t.similarWords}</span>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {(wordObj.details.similarWords?.synonyms?.length > 0 || wordObj.details.synonyms?.length > 0) && (
                                                            <div>
                                                                <span className="text-[9px] font-black uppercase opacity-50 block mb-2">{t.synonyms}</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(wordObj.details.similarWords?.synonyms || wordObj.details.synonyms).map((syn, i) => (
                                                                        <span key={i} className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>{syn}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {(wordObj.details.similarWords?.antonyms?.length > 0 || wordObj.details.antonyms?.length > 0) && (
                                                            <div>
                                                                <span className="text-[9px] font-black uppercase opacity-50 block mb-2">{t.antonyms}</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(wordObj.details.similarWords?.antonyms || wordObj.details.antonyms).map((ant, i) => (
                                                                        <span key={i} className={`px-3 py-1 text-xs font-bold rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>{ant}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}




                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Back Button */}
                            <div className="flex justify-center pt-8 pb-4">
                                <button
                                    onClick={() => setIsRevealed(false)}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all opacity-40 hover:opacity-100 hover:scale-105 active:scale-95 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                                >
                                    <ChevronDown size={18} className="rotate-180" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t.back || "GERİ"}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
