import React, { useState, useRef, useEffect } from 'react';
import { Volume2, ChevronDown, Hand, Sparkles, BookOpen, Users, Compass, RefreshCw, Clock, Edit3, Trash2, Wind, Shuffle, SortAsc, Info, Music2, X, Flame, CloudRain, Waves } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import FlamingoImg from '../assets/Mascot/Flamingoo.png';
import { Mascot } from './Mascot';
import { ChillModeAudio } from './ChillModeAudio';

// Audio assets are located in public/Audio and are referenced by static URL

const ChillCard = ({ wordObj, isDark, appLang, t, handleSpeak, index, total, isAdmin, onDeleteWord, onEditWord, chillSortMode, setChillSortMode, showAmbientLounge, setShowAmbientLounge }) => {
    if (!wordObj) return null;
    const [isRevealed, setIsRevealed] = useState(false);
    const [isExampleTrRevealed, setIsExampleTrRevealed] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [isDefTrRevealed, setIsDefTrRevealed] = useState(false);
    const [openSections, setOpenSections] = useState({
        family: false,
        details: false,
        examples: false
    });
    const [isMiniCaseTrRevealed, setIsMiniCaseTrRevealed] = useState(false);
    const [isCaseExamplesOpen, setIsCaseExamplesOpen] = useState(false);
    const [revealedCaseEn, setRevealedCaseEn] = useState({});
    const [isMiniCaseOpen, setIsMiniCaseOpen] = useState(false);

    useEffect(() => {
        setRevealedCaseEn({});
        setIsMiniCaseTrRevealed(false);
        setIsCaseExamplesOpen(false);
    }, [wordObj?.id]);

    const minsRemaining = Math.max(1, Math.ceil((total - index + 1) * 0.25));

    const toggleSection = (section, e) => {
        if (e) e.stopPropagation();
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div
            className="w-full min-h-[100dvh] snap-start snap-always relative flex flex-col items-center justify-center p-6 sm:p-12 cursor-pointer group flex-shrink-0"
            onClick={() => setIsRevealed(!isRevealed)}
        >
            {/* Admin Buttons Overlay */}
            {isAdmin && (
                <div className="absolute top-8 right-8 z-[60] flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEditWord(wordObj); }}
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}
                        title="Edit"
                    >
                        <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteWord(wordObj.id); }}
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                        title="Delete"
                    >
                        <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                </div>
            )}
            {/* Background Concept Art Mascot Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
                <img
                    src={FlamingoImg}
                    alt="Flamingo Concept Art"
                    className={`w-[120%] h-auto max-w-[800px] object-cover transition-opacity duration-1000 ${isDark ? 'opacity-[0.03] grayscale invert' : 'opacity-[0.05] grayscale brightness-0'}`}
                    style={{ filter: isDark ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'drop-shadow(0 0 10px rgba(0,0,0,0.5))', mixBlendMode: isDark ? 'screen' : 'multiply' }}
                />
            </div>

            <div className={`relative z-10 w-full max-w-md flex flex-col flex-1 justify-center transition-all duration-700 ${isRevealed ? 'pb-10 pt-10' : 'pb-20 pt-20'}`}>

                {!isRevealed ? (
                    <div className="flex flex-col justify-center animate-fade-in">
                        {/* Word Banner - Non-revealed */}
                        <div className="flex justify-center mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                {appLang === 'tr' ? (wordObj.posTr || wordObj.pos) : (wordObj.pos || 'CHILL MODE')}
                            </span>
                        </div>

                        <h2 className={`font-black tracking-tighter leading-none mb-4 text-center ${wordObj.word.length > 10 ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'} transition-colors duration-500 drop-shadow-xl ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ wordBreak: 'break-word' }}>
                            {wordObj.word}
                        </h2>

                        <div className="flex items-center justify-center gap-3 opacity-60 font-serif text-2xl" style={{ fontFamily: '"Arial Unicode MS", "Segoe UI", sans-serif' }}>
                            <Volume2
                                size={28}
                                className={`cursor-pointer transition-all hover:scale-110 hover:text-indigo-500 active:scale-95`}
                                onClick={(e) => handleSpeak(wordObj.word, e)}
                            />
                            <span className="italic">{wordObj.phonetic}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center mt-12 opacity-30 group-hover:opacity-100 transition-opacity">
                            <Hand size={36} className="animate-pulse mb-3 text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">{t.activeRecallTap || "DETAYLAR İÇİN DOKUN"}</span>
                        </div>
                    </div>
                ) : (
                    <div className={`w-full p-7 sm:p-10 rounded-[3.5rem] border backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative animate-fade-in-up transition-all duration-500 overflow-y-auto max-h-[85dvh] scrollbar-hide ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`} onClick={(e) => e.stopPropagation()}>

                        {/* Premium Info & Sorting Portal */}
                        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }}
                                className={`p-3 rounded-2xl border backdrop-blur-md transition-all active:scale-95 shadow-lg ${isDark ? 'bg-slate-900/60 border-slate-700/50 text-slate-400' : 'bg-white/60 border-slate-200 text-slate-500'}`}
                            >
                                <Info size={20} className={showSortMenu ? 'text-indigo-500' : ''} />
                            </button>

                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                        className={`p-2 rounded-3xl border shadow-2xl backdrop-blur-2xl flex flex-col gap-1 pointer-events-auto ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-100'}`}
                                    >
                                        {[
                                            { id: 'random', icon: Shuffle, label: 'Rastgele' },
                                            { id: 'alphabetical', icon: SortAsc, label: 'A-Z' },
                                            { id: 'newest', icon: Clock, label: 'Yeni' }
                                        ].map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={(e) => { e.stopPropagation(); setChillSortMode(mode.id); setShowSortMenu(false); }}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${chillSortMode === mode.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-indigo-500/10 opacity-60 hover:opacity-100'}`}
                                            >
                                                <mode.icon size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                                            </button>
                                        ))}

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Word in revealed mode - Minimal version inside card */}
                        <div className="mb-8 text-center">
                            <div className="flex justify-center mb-3">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] opacity-80 shadow-sm ${isDark ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                    {wordObj.targetMode === 'phrasal' ? (appLang === 'tr' ? 'DEYİMSEL FİİL' : 'PHRASAL VERB') : (appLang === 'tr' ? (wordObj.posTr || wordObj.pos) : (wordObj.pos || 'VOCAB'))}
                                </span>
                            </div>
                            <h2 className={`font-black tracking-tight leading-none mb-1 text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {wordObj.word}
                            </h2>
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{wordObj.trWord}</h3>
                            <div className="flex items-center justify-center gap-2 opacity-50 font-serif italic mb-2 relative z-20">
                                <Volume2
                                    size={18}
                                    className={`cursor-pointer transition-all hover:scale-125 hover:text-indigo-500`}
                                    onClick={(e) => handleSpeak(wordObj.word, e)}
                                />
                                <p className="text-sm">{wordObj.phonetic}</p>
                            </div>
                        </div>

                        {/* Primary Meaning */}
                        <div className="mb-6 text-center">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 flex items-center justify-center gap-2">
                                <span className="w-4 h-[2px] bg-current opacity-20"></span> {t.def || 'ANLAM'} <span className="w-4 h-[2px] bg-current opacity-20"></span>
                            </h3>

                            <p className={`text-sm font-semibold opacity-70 italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {isDefTrRevealed ? wordObj.trDef : wordObj.engDef}
                            </p>

                            {wordObj.targetMode === 'phrasal' && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsDefTrRevealed(!isDefTrRevealed); }}
                                    className="mt-2 flex items-center gap-1.5 mx-auto text-[9px] font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.2em]"
                                >
                                    <RefreshCw size={12} className={isDefTrRevealed ? 'rotate-180 transition-transform' : ''} />
                                    {isDefTrRevealed ? t.toEn : t.toTr}
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* Example Sentence Section */}
                            <div className={`p-5 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white/40 border-slate-100'}`}>
                                <p className={`text-lg font-bold leading-relaxed mb-3 italic text-center ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    "{wordObj.engExample}"
                                </p>
                                <div className="flex flex-col items-center">
                                    {!isExampleTrRevealed ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsExampleTrRevealed(true); }}
                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                                        >
                                            <RefreshCw size={14} /> {t.showTranslation || 'Çeviriyi Gör'}
                                        </button>
                                    ) : (
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setIsExampleTrRevealed(false); }}
                                            className={`px-4 py-2 rounded-xl italic text-xs font-medium text-center cursor-pointer animate-fade-in ${isDark ? 'bg-black/30 text-slate-400' : 'bg-white/60 text-slate-600'}`}
                                        >
                                            {wordObj.trExample}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Collapsible: Family (Kelime Ailesi) */}
                            {(wordObj.wordForms || wordObj.wordFamily) && (
                                <div className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-white/30'}`}>
                                    <button
                                        onClick={(e) => toggleSection('family', e)}
                                        className="w-full px-5 py-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        <span className="flex items-center gap-2"><Users size={14} className="text-indigo-400" /> {t.wordForms || 'KELİME AİLESİ'}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${openSections.family ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${openSections.family ? 'grid-rows-[1fr] opacity-100 pb-4 px-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <div className="flex flex-wrap gap-2">
                                                {wordObj.wordForms?.map((wf, idx) => (
                                                    <span key={idx} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {wf.form} <span className="opacity-40 font-normal">({appLang === 'tr' ? wf.posTr : wf.pos})</span>
                                                    </span>
                                                ))}
                                                {wordObj.wordFamily && Object.entries(wordObj.wordFamily).map(([pos, word], idx) => (
                                                    <span key={`f-${idx}`} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {word} <span className="opacity-40 font-normal">({pos})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Unified Collapsible: Details (Detaylar) */}
                            {wordObj.details && (
                                <div className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-white/30'}`}>
                                    <button
                                        onClick={(e) => toggleSection('details', e)}
                                        className="w-full px-5 py-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        <span className="flex items-center gap-2"><Compass size={14} className="text-emerald-400" /> {t.detailsBtn || 'Details'}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${openSections.details ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${openSections.details ? 'grid-rows-[1fr] opacity-100 pb-4 px-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden space-y-6">
                                            {/* Root/Prefix/Suffix */}
                                            {(wordObj.details.root || wordObj.details.prefix || wordObj.details.suffix) && (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {wordObj.details.root && wordObj.details.root !== 'null' && (
                                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-1">{t.root}</span>
                                                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.root}</p>
                                                        </div>
                                                    )}
                                                    {wordObj.details.prefix && wordObj.details.prefix !== 'null' && (
                                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-1">{t.prefix}</span>
                                                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.prefix}</p>
                                                        </div>
                                                    )}
                                                    {wordObj.details.suffix && wordObj.details.suffix !== 'null' && (
                                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-1">{t.suffix}</span>
                                                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{wordObj.details.suffix}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Synonyms/Antonyms */}
                                            {(wordObj.details.synonyms?.length > 0 || wordObj.details.antonyms?.length > 0) && (
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    {wordObj.details.synonyms?.length > 0 && (
                                                        <div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2 block">{t.synonyms}</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {wordObj.details.synonyms.map((syn, idx) => <span key={idx} className="text-xs font-bold text-emerald-500">{syn}</span>)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {wordObj.details.antonyms?.length > 0 && (
                                                        <div className="border-l border-slate-700/30 pl-4">
                                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2 block">{t.antonyms}</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {wordObj.details.antonyms.map((ant, idx) => <span key={idx} className="text-xs font-bold text-rose-500">{ant}</span>)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}


                                            {/* More Examples */}
                                            {wordObj.details.moreExamples?.length > 0 && (
                                                <div className="pt-4 border-t border-slate-700/10">
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-3 block">{t.moreExamples || 'EK ÖRNEKLER'}</span>
                                                    <ul className="space-y-3">
                                                        {wordObj.details.moreExamples.map((ex, idx) => (
                                                            <li key={idx} className="text-xs font-bold italic leading-relaxed opacity-80 border-l-2 border-blue-500/30 pl-3">
                                                                "{typeof ex === 'object' ? (ex.en || ex.tr || JSON.stringify(ex)) : ex}"
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Collapsible: Mini Case Story */}
                            {wordObj.details?.miniCase && (
                                <div className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'border-pink-500/20 bg-pink-500/5' : 'border-pink-100 bg-pink-50/30'}`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsMiniCaseOpen(!isMiniCaseOpen); }}
                                        className="w-full px-5 py-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        <span className="flex items-center gap-2 text-pink-500"><Mascot isDark={isDark} size="xs" isAdmin={isAdmin} /> STORY</span>
                                        <ChevronDown size={16} className={`transition-transform duration-500 ${isMiniCaseOpen ? 'rotate-180 text-pink-500' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${isMiniCaseOpen ? 'grid-rows-[1fr] opacity-100 pb-4 px-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <p className={`text-xs font-bold leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {typeof wordObj.details.miniCase === 'object' ? (wordObj.details.miniCase.en || wordObj.details.miniCase.tr) : (wordObj.details.miniCase || "")}
                                            </p>
                                            <div className="mt-3">
                                                {!isMiniCaseTrRevealed ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrRevealed(true); }}
                                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                                                    >
                                                        <RefreshCw size={12} /> {t.showTranslation || "Çeviriyi Gör"}
                                                    </button>
                                                ) : (
                                                    <div
                                                        onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrRevealed(false); }}
                                                        className={`p-3 rounded-xl italic text-[10px] cursor-pointer animate-fade-in ${isDark ? 'bg-black/30 text-slate-400 border-l-2 border-amber-500/50' : 'bg-white/50 text-slate-600 border-l-2 border-amber-400'}`}>
                                                        {typeof wordObj.details.trMiniCase === 'object' ? wordObj.details.trMiniCase.tr : (wordObj.details.trMiniCase || wordObj.details.miniCase?.tr || "")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Collapsible: Case Examples (Vaka Örnekleri) */}
                            {(wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples)?.length > 0 && (
                                <div className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-100 bg-amber-50/30'}`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsCaseExamplesOpen(!isCaseExamplesOpen); }}
                                        className="w-full px-5 py-4 flex items-center justify-between text-[11px] font-black uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        <span className="flex items-center gap-2 text-amber-500"><Sparkles size={14} /> {t.caseExamples || 'VAKA ÖRNEKLERİ'}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-300 ${isCaseExamplesOpen ? 'rotate-180 text-amber-500' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ease-in-out ${isCaseExamplesOpen ? 'grid-rows-[1fr] opacity-100 pb-4 px-5' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden space-y-3">
                                            {(wordObj.details.caseExamples || wordObj.details.trMiniCaseExamples).map((ex, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={(e) => { e.stopPropagation(); setRevealedCaseEn(prev => ({ ...prev, [idx]: !prev[idx] })); }}
                                                    className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-amber-100'}`}
                                                >
                                                    <p className={`text-[13px] font-black leading-tight tracking-tight mb-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                                        "{typeof ex === 'string' ? ex : (ex.en || ex.tr)}"
                                                    </p>

                                                    <div className={`grid transition-all duration-300 ease-in-out ${revealedCaseEn[idx] ? 'grid-rows-[1fr] opacity-100 pt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                                        <div className="overflow-hidden">
                                                            <p className={`text-xs font-bold italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                                {typeof ex === 'object' ? (ex.tr || ex.en) : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {!revealedCaseEn[idx] && typeof ex === 'object' && (
                                                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity text-amber-500">
                                                            <RefreshCw size={12} /> {t.toTr || 'TR'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                )}
            </div>

            {/* Down Indicator */}
            {!isRevealed && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 animate-bounce pointer-events-none">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] mb-1">Kaydır</span>
                    <ChevronDown size={28} />
                </div>
            )}
        </div>
    );
};

export const ChillMode = ({ vocab, isDark, appLang, t, dueTodayCount, dueTodayMins, isAdmin, onDeleteWord, onEditWord, chillSortMode, setChillSortMode }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [showAmbientLounge, setShowAmbientLounge] = useState(false);
    const [activeSound, setActiveSound] = useState(null);
    const containerRef = useRef(null);
    const audioRef = useRef(null);

    const sounds = [
        { id: 'fire', icon: <Flame size={20} />, label: 'HUZUR', file: '/Audio/fireplace.wav', color: 'text-orange-400' },
        { id: 'rain', icon: <CloudRain size={20} />, label: 'YAĞMUR', file: '/Audio/rain-on-windows-interior.wav', color: 'text-blue-400' },
        { id: 'waves', icon: <Waves size={20} />, label: 'DENİZ', file: '/Audio/calm-seawaves.wav', color: 'text-cyan-400' },
        { id: 'storm', icon: <Wind size={20} />, label: 'TERAS', file: '/Audio/the-rain-falls-against-the-parasol.wav', color: 'text-slate-400' },
    ];

    const toggleSound = (soundId) => {
        if (activeSound === soundId) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setActiveSound(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const soundObj = sounds.find(s => s.id === soundId);
            const audio = new Audio(soundObj.file);
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(err => console.error("Audio play failed:", err));
            audioRef.current = audio;
            setActiveSound(soundId);
        }
    };

    useEffect(() => {
        // Cleanup audio on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollPos = containerRef.current.scrollTop;
            const cardHeight = window.innerHeight;
            const newIndex = Math.min(vocab.length, Math.max(1, Math.round(scrollPos / cardHeight) + 1));
            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [vocab.length, currentIndex]);

    const handleSpeak = (word, e) => {
        if (e) e.stopPropagation();
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="absolute inset-0 z-[150] overflow-hidden pointer-events-none">
            {/* Mascot Toggle Button - Absolute within the root container (NOT scrolling) */}
            <motion.button
                onClick={() => setShowAmbientLounge(!showAmbientLounge)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute bottom-5 left-5 z-[400] p-4 rounded-[2.5rem] border-2 shadow-2xl backdrop-blur-xl transition-all duration-500 pointer-events-auto ${showAmbientLounge ? 'bg-indigo-500 border-indigo-400 rotate-12 scale-110' : (isDark ? 'bg-slate-900/80 border-slate-700/50 hover:border-indigo-500/50 shadow-black/40' : 'bg-white/95 border-slate-200 hover:border-indigo-400 shadow-xl')}`}
            >
                <div className="relative">
                    <Mascot isDark={isDark} size="sm" variant="3d" look={showAmbientLounge ? "happy" : "chill"} animated={activeSound !== null} />
                    {activeSound && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                    )}
                </div>
            </motion.button>

            {/* Ambient Lounge Global Overlay */}
            <AnimatePresence>
                {showAmbientLounge && (
                    <div className="absolute inset-0 z-[405] pointer-events-none flex items-center justify-start p-6 sm:p-12">
                        <motion.div
                            initial={{ x: -100, opacity: 0, scale: 0.3, rotate: -10 }}
                            animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ x: -100, opacity: 0, scale: 0.3, rotate: -10 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="w-full max-w-sm pointer-events-auto"
                        >
                            <div className={`p-8 rounded-[4rem] border-4 backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col gap-8 transition-all duration-500 ${isDark ? 'bg-slate-950/95 border-indigo-500/40' : 'bg-white/95 border-indigo-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-1 rounded-[2rem] transition-transform duration-700 ${activeSound ? 'scale-110' : ''}`}>
                                            <Mascot isDark={isDark} size="md" variant="3d" look="happy" animated={true} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className={`text-[14px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>Ambient Lounge</h4>
                                            <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Studying with focus</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAmbientLounge(false)}
                                        className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-40 hover:opacity-100 active:scale-90 border-2 border-transparent hover:border-rose-500/20`}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="px-1">
                                    <ChillModeAudio
                                        isDark={isDark}
                                        activeSound={activeSound}
                                        toggleSound={toggleSound}
                                        sounds={sounds}
                                    />
                                </div>

                                <div className={`mt-2 p-4 rounded-3xl text-center text-[10px] font-black uppercase tracking-widest transition-all ${activeSound ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                    {activeSound ? `Şu an aktif: ${sounds.find(s => s.id === activeSound)?.label}` : 'Başlamak için bir ortam seç'}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Scrollable Container (Interactive) */}
            <div
                ref={containerRef}
                className={`absolute inset-0 overflow-y-auto snap-y snap-mandatory custom-scrollbar pointer-events-auto ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} hide-scrollbar`}
            >
                <div className="flex flex-col w-full">
                    {vocab.map((wordObj, i) => (
                        <ChillCard
                            key={`${wordObj.word}-${i}`}
                            wordObj={wordObj}
                            isDark={isDark}
                            appLang={appLang}
                            t={t}
                            handleSpeak={handleSpeak}
                            index={i + 1}
                            total={vocab.length}
                            isAdmin={isAdmin}
                            onDeleteWord={onDeleteWord}
                            onEditWord={onEditWord}
                            chillSortMode={chillSortMode}
                            setChillSortMode={setChillSortMode}
                            showAmbientLounge={showAmbientLounge}
                            setShowAmbientLounge={setShowAmbientLounge}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
