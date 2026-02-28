import React, { useState } from 'react';
import { Bookmark, Share2, Sparkles, Volume2, Eye, EyeOff, ChevronDown, RefreshCw, Layers, Clock, BookOpen, Edit3, Trash2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { sharePhrasalToCanvas } from '../utils/shareWord';

export const PhrasalCard = ({
    wordObj,
    isSavedStatus,
    toggleSaveWord,
    isDark,
    t,
    appLang,
    isRevealed,
    setIsRevealed,
    renderClickableText,
    stats,
    isAdmin = false,
    isTranslated,
    setIsTranslated,
    onDeleteWord,
    onEditWord
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMiniCaseOpen, setIsMiniCaseOpen] = useState(false);
    const [isMiniCaseTrOpen, setIsMiniCaseTrOpen] = useState(false);
    const [isExampleTrRevealed, setIsExampleTrRevealed] = useState(false);

    const handleSpeak = (e) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(wordObj.word);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
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
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); sharePhrasalToCanvas(wordObj, appLang, isDark); }}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/80 hover:text-indigo-400 backdrop-blur-md' : 'bg-white/50 text-slate-500 hover:bg-white/90 hover:text-indigo-500 backdrop-blur-md'}`}
                    title="Paylaş / Share"
                >
                    <Share2 size={16} strokeWidth={2.5} />
                </button>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); toggleSaveWord(wordObj); }}
                    className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isSavedStatus ? 'bg-amber-400 text-slate-900 shadow-glow-amber' : (isDark ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/80 backdrop-blur-md' : 'bg-white/50 text-slate-500 hover:bg-white/90 backdrop-blur-md')}`}
                >
                    <Bookmark size={16} strokeWidth={2.5} fill={isSavedStatus ? "currentColor" : "none"} />
                </button>
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
            </div >


            {/* Reveal Overlay - Top Level */}
            {!isRevealed && (
                <div
                    className="absolute inset-x-0 bottom-0 top-16 flex flex-col items-center justify-center cursor-pointer group text-center bg-transparent select-none active:bg-slate-500/5 transition-colors duration-200"
                    onClick={() => {
                        setIsRevealed(true);
                    }}
                >
                    <h2 className={`font-black tracking-tight mb-4 w-full px-2 leading-none pointer-events-none ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl') : 'text-5xl sm:text-6xl'}`} style={{ wordBreak: 'break-word' }}>
                        {wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}
                    </h2>
                    <div className="flex items-center justify-center gap-2 opacity-50 font-serif text-xl pointer-events-none" style={{ fontFamily: '"Arial Unicode MS", "Lucida Sans Unicode", "Segoe UI", sans-serif' }}>
                        <Volume2
                            size={24}
                            className={`transition-all ${isSpeaking ? 'text-indigo-400 scale-110 opacity-100 drop-shadow-md' : ''}`}
                        />
                        <span>{wordObj.phonetic}</span>
                    </div>
                    <div className="absolute bottom-16 flex flex-col items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity text-indigo-500 pointer-events-none">
                        <Eye size={36} className="animate-pulse" />
                        <span className="font-extrabold text-[10px] tracking-[0.3em] uppercase">{t.activeRecallTap || "Öğrenmek İçin Dokun"}</span>
                    </div>
                </div>
            )}

            <div className={`flex-grow flex flex-col overflow-y-auto custom-scrollbar pr-2 pl-1 relative min-h-0 pt-20 mask-fade-v transition-all duration-300 ${!isRevealed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`} style={{ touchAction: 'pan-y' }}>
                {/* Persistent POS Tag - Now inside scrollable for 'embedded' feel */}
                <div className="flex px-8 mb-4">
                    <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm ${isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                        {appLang === 'tr' ? wordObj.posTr : wordObj.pos}
                    </span>
                </div>

                <div className="space-y-8 pb-8">
                    {/* Mastered Badge - Only shown when revealed */}
                    {wordObj.sm2.rep > 3 && (
                        <div className="mb-2">
                            <span className="flex items-center w-fit gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20">
                                <Sparkles size={12} /> {t.mastered || 'MASTERED'}
                            </span>
                        </div>
                    )}
                    {/* Word & Phonetic in revealed mode */}
                    <div
                        className="mb-2 relative cursor-pointer group hover:bg-slate-500/5 p-4 -ml-4 rounded-3xl transition-colors"
                        onClick={() => setIsRevealed(false)}
                    >
                        <h2 className={`font-black tracking-tight mb-1 leading-tight pr-8 ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl') : 'text-4xl sm:text-5xl'}`} style={{ wordBreak: 'break-word' }}>{wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}</h2>
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


                    {/* Definition Section */}
                    <section className="mt-4 mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-current opacity-20"></span> {t.def || "AÇIKLAMA"}
                        </h3>
                        <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${isDark ? 'bg-indigo-950/20 border-indigo-500/20 shadow-premium' : 'bg-indigo-50/50 border-indigo-100 shadow-premium'}`}>
                            <p className={`text-xl font-bold leading-tight ${isDark ? 'text-blue-100' : 'text-blue-900'}`}>
                                {renderClickableText ? renderClickableText(isTranslated ? wordObj.trDef : wordObj.engDef) : (isTranslated ? wordObj.trDef : wordObj.engDef)}
                            </p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsTranslated(!isTranslated); }}
                            className="mt-3 flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em]"
                        >
                            <RefreshCw size={14} className={isTranslated ? 'rotate-180 transition-transform' : ''} />
                            {isTranslated ? t.toEn : t.toTr}
                        </button>
                    </section>

                    {/* Example Section */}
                    <section className="mt-4 mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 flex items-center gap-2">
                            <span className="w-4 h-[2px] bg-current opacity-20"></span> {t.ex || "ÖRNEK CÜMLE"}
                        </h3>
                        <p className={`text-xl font-bold leading-relaxed mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            "{renderClickableText ? renderClickableText(wordObj.engExample) : wordObj.engExample}"
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

                    {/* AI Mini Case Display */}
                    {wordObj.details?.miniCase && (
                        <section className="mt-4 mb-8">
                            <div
                                className={`w-full p-5 rounded-[2.5rem] border-2 relative overflow-hidden text-left shadow-sm cursor-pointer transition-all duration-300 flex flex-col ${isDark ? 'border-amber-500/20 bg-amber-900/10 hover:border-amber-500/40' : 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/50'}`}
                                onClick={(e) => { e.stopPropagation(); setIsMiniCaseOpen(!isMiniCaseOpen); }}
                            >
                                <div className="absolute top-0 right-[-10px] w-32 h-32 opacity-[0.03] pointer-events-none">
                                    <Mascot isDark={isDark} size="logo" isAdmin={isAdmin} />
                                </div>

                                <div className="flex items-center justify-between relative z-10 w-full px-1">
                                    <div className="flex items-center gap-3">
                                        <Mascot isDark={isDark} size="sm" isAdmin={isAdmin} />
                                        <span className={`text-[11px] font-black uppercase tracking-[0.3em] mt-0.5 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Mini Case Story</span>
                                    </div>
                                    <ChevronDown size={20} strokeWidth={2.5} className={`transform transition-transform duration-300 ${isDark ? 'text-amber-500' : 'text-amber-600'} ${isMiniCaseOpen ? 'rotate-180' : ''}`} />
                                </div>

                                <div className={`grid transition-all duration-300 ease-in-out w-full ${isMiniCaseOpen ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className={`text-[17px] font-bold leading-relaxed relative z-10 ${isDark ? 'text-slate-200' : 'text-slate-800'} ${isMiniCaseTrOpen ? 'mb-4' : 'mb-3'}`}>
                                            {renderClickableText ? renderClickableText(wordObj.details?.miniCase) : wordObj.details?.miniCase}
                                        </p>

                                        <div className={`grid transition-all duration-300 ease-in-out w-full ${isMiniCaseTrOpen ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
                                            <div className="overflow-hidden">
                                                <div className={`p-4 rounded-2xl border-l-4 italic text-sm relative z-10 ${isDark ? 'bg-black/20 border-amber-500/50 text-slate-400' : 'bg-white/50 border-amber-400 text-slate-600'}`}>
                                                    {wordObj.details?.trMiniCase}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrOpen(!isMiniCaseTrOpen); }}
                                            className={`flex items-center inline-flex gap-2 text-[10px] font-black transition-colors uppercase tracking-[0.2em] relative z-20 ${isDark ? 'text-amber-500 hover:text-amber-400' : 'text-amber-600 hover:text-amber-500'}`}
                                        >
                                            <RefreshCw size={14} className={isMiniCaseTrOpen ? "rotate-180 transition-transform duration-500" : "transition-transform duration-500"} />
                                            {isMiniCaseTrOpen ? (t.hideTranslation || "ÇEVİRİYİ GİZLE") : (t.showTranslation || "ÇEVİRİYİ GÖR")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    <div className="pt-8 pb-4 flex justify-center">
                        <button
                            onClick={() => setIsRevealed(false)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all opacity-40 hover:opacity-100 hover:scale-105 active:scale-95 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                        >
                            <ChevronDown size={18} className="rotate-180" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t.back || "GERİ"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hint Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30 animate-pulse text-[10px] font-bold uppercase tracking-widest text-inherit pointer-events-none z-0">
                {t.swipeHint || "Kaydır"}
            </div>
        </>
    );
};
