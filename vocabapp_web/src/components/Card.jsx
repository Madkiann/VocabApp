import React, { useState, useEffect } from 'react';
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
    MessagesSquare,
    Feather,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { shareWordToCanvas } from '../utils/shareWord';
import { Mascot } from './Mascot';
import { DiscoveryBar } from './DiscoveryBar';
import { sounds } from '../utils/sounds';

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
    showCaseExamples,
    setShowCaseExamples,
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
    cardBg,
    onEvolveBond,
    isSystem = false,
    showMiniStory,
    setShowMiniStory
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showBondDetails, setShowBondDetails] = useState(false);
    const [isExampleTrRevealed, setIsExampleTrRevealed] = useState(false);
    const [isCaseExamplesOpen, setIsCaseExamplesOpen] = useState(false);
    const [revealedCaseExampleIdx, setRevealedCaseExampleIdx] = useState(null);
    const [isMiniCaseTrOpen, setIsMiniCaseTrOpen] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async (e) => {
        if (e) e.stopPropagation();
        if (isSharing) return;
        setIsSharing(true);
        try {
            await shareWordToCanvas(wordObj, appLang, t, isDark);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSharing(false);
        }
    };

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

    const [revealedCaseEn, setRevealedCaseEn] = useState({});

    if (!wordObj || !wordObj.sm2) return null;

    useEffect(() => {
        setRevealedCaseEn({});
        setShowMiniStory(false);
        setIsMiniCaseTrOpen(false);
    }, [wordObj?.id]);

    const getBondInfo = () => {
        const bondXP = wordObj.sm2.bondXP || 0;
        const lastQuality = wordObj.sm2.lastQualityScore;

        // Stubborn (Dirençli) - Crimson Warning
        if (lastQuality === 2) {
            return {
                id: 'stubborn',
                name: t.bond_stubborn || 'Dirençli',
                color: 'text-red-400',
                bg: 'bg-red-950/60',
                border: 'border-red-500/50',
                glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]',
                featherColor: 'text-red-400',
                cardEffect: 'ring-4 ring-red-500/30 animate-pulse-gentle'
            };
        }

        // Stranger (Yabancı) - Minimalist Mist
        if (bondXP === 0) return {
            id: 'stranger',
            name: t.bond_stranger || 'Yabancı',
            color: isDark ? 'text-slate-400' : 'text-slate-700',
            bg: isDark ? 'bg-slate-900/40' : 'bg-slate-200/80',
            border: isDark ? 'border-slate-700/30' : 'border-slate-300/60',
            featherColor: isDark ? 'text-slate-500' : 'text-slate-600',
            cardEffect: 'backdrop-blur-[4px] saturate-[1.1]'
        };

        // Acquaintance (Tanış) - Rose Quartz
        if (bondXP < 100) return {
            id: 'acquaintance',
            name: t.bond_acquaintance || 'Tanış',
            color: isDark ? 'text-rose-300' : 'text-rose-700',
            bg: isDark ? 'bg-rose-950/40' : 'bg-rose-300/85',
            border: isDark ? 'border-rose-500/40' : 'border-rose-400/60',
            glow: isDark ? 'shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'shadow-[0_0_40px_rgba(244,63,94,0.3)]',
            featherColor: isDark ? 'text-rose-400' : 'text-rose-700',
            cardEffect: 'ring-2 ring-rose-500/30'
        };

        // Confidant (Sırdaş) - Royal Amethyst
        if (bondXP < 250) return {
            id: 'confidant',
            name: t.bond_confidant || 'Sırdaş',
            color: isDark ? 'text-purple-300' : 'text-purple-800',
            bg: isDark ? 'bg-purple-950/50' : 'bg-purple-300/85',
            border: isDark ? 'border-purple-500/50' : 'border-purple-400/60',
            glow: isDark ? 'shadow-[0_0_40px_rgba(168,85,247,0.4)]' : 'shadow-[0_0_50px_rgba(168,85,247,0.4)]',
            featherColor: isDark ? 'text-purple-400' : 'text-purple-700',
            texture: 'stone',
            pulse: 'animate-pulse-slow',
            cardEffect: 'ring-2 ring-purple-500/40'
        };

        // Companion (Yoldaş) - Radiant Golden Mettle
        return {
            id: 'companion',
            name: t.bond_companion || 'Yoldaş',
            color: isDark ? 'text-amber-300' : 'text-amber-900',
            bg: isDark ? 'bg-amber-950/60' : 'bg-amber-300/90',
            border: isDark ? 'border-amber-400/60' : 'border-amber-500/60',
            glow: isDark ? 'shadow-[0_0_60px_rgba(245,158,11,0.5)]' : 'shadow-[0_0_80px_rgba(245,158,11,0.5)]',
            featherColor: isDark ? 'text-amber-400' : 'text-amber-700',
            seal: true,
            texture: 'stone',
            sound: 'companion',
            cardEffect: isDark ? 'ring-4 ring-amber-400/40 shadow-inner-gold' : 'ring-4 ring-amber-500/50 shadow-inner-gold-vibrant'
        };
    };

    const bond = getBondInfo();
    const wisdomProgress = Math.min(100, Math.round(((wordObj.sm2.int || 0) / 21) * 100));

    return (
        <div className={`w-full h-full ${cardBg} ${isDark ? 'shadow-black/50' : 'shadow-blue-900/10'} rounded-[2.5rem] shadow-2xl border flex flex-col origin-center overflow-hidden animate-fade-in relative transition-all duration-700`}>
            {/* High-Impact Interior Paint Layer */}
            <div className={`absolute inset-0 transition-all duration-1000 ${bond.bg} ${bond.glow} ${bond.cardEffect || ''}`}></div>


            {/* Background Texture Overlays */}
            {bond.texture === 'stone' && (
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
            )}

            {bond.id === 'stranger' && (
                <div className="absolute inset-0 bg-slate-500/5 backdrop-blur-[2px] pointer-events-none z-0"></div>
            )}


            <div className="flex flex-col h-full animate-fade-in relative z-10 font-sans p-6 pt-6">
                {/* 1. Zihin Yıldızları (Discovery) - En Üst ve Simetrik */}
                {!isSystem && <DiscoveryBar current={stats?.currentDiscovery || 0} total={12} isDark={isDark} />}

                {/* 2. Statü ve Aksiyonlar - Discovery'nin Altında */}
                <div className="flex justify-between items-center w-full mb-6 relative z-50">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); setShowBondDetails(true); }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${bond.bg} ${bond.border} ${bond.color}`}
                    >
                        <Feather size={14} className={`animate-pulse ${bond.featherColor}`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{bond.name}</span>
                    </button>

                    <div className="flex gap-2">
                        {canUndo && (
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); onUndo(); }}
                                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} backdrop-blur-md`}
                                title={t.undo || "Geri Al"}
                            >
                                <Undo2 size={16} strokeWidth={2.5} />
                            </button>
                        )}
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={handleShare}
                            disabled={isSharing}
                            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isSharing ? 'opacity-50' : ''} ${isDark ? 'bg-slate-800/40 text-slate-300' : 'bg-white/50 text-slate-500 hover:bg-white/90'} backdrop-blur-md`}
                            title="Paylaş / Share"
                        >
                            {isSharing ? <Loader2 size={16} strokeWidth={2.5} className="animate-spin" /> : <Share2 size={16} strokeWidth={2.5} />}
                        </button>
                        {!isSystem && (
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => { e.stopPropagation(); toggleSaveWord(wordObj); }}
                                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isSavedStatus ? 'bg-amber-400 text-slate-900 shadow-glow-amber' : (isDark ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/80 backdrop-blur-md' : 'bg-white/50 text-slate-500 hover:bg-white/90 backdrop-blur-md')}`}
                            >
                                <Bookmark size={16} strokeWidth={2.5} fill={isSavedStatus ? "currentColor" : "none"} />
                            </button>
                        )}
                        {isAdmin && (
                            <div className="flex gap-2">
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onEditWord(wordObj); }}
                                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}
                                    title="Edit"
                                >
                                    <Edit3 size={16} strokeWidth={2.5} />
                                </button>
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onDeleteWord(wordObj.id); }}
                                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 border border-transparent shadow-sm ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                                    title="Delete"
                                >
                                    <Trash2 size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Reveal Overlay - Top Level */}
                {!isRevealed && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group text-center bg-transparent select-none active:bg-slate-500/5 transition-colors duration-200"
                        onClick={() => {
                            setIsRevealed(true);
                            if (bond.sound === 'companion') {
                                sounds.playCompanion();
                            }
                        }}
                    >
                        <h2 className={`font-black tracking-tight mb-4 w-full px-2 leading-none pointer-events-none transition-all duration-700 ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl') : 'text-5xl sm:text-6xl'}`} style={{ wordBreak: 'break-word' }}>
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

                <div
                    className={`flex-grow flex flex-col overflow-y-auto scrollbar-hide pr-1 relative min-h-0 pt-4 mask-fade-v transition-all duration-500 ${!isRevealed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} ${bond.glow || ''} ${bond.pulse || ''}`}
                    style={{ touchAction: 'pan-y' }}
                >
                    {/* Background Texture Overlays */}
                    {bond.texture === 'stone' && (
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
                    )}
                    {bond.seal && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none animate-spin-slow">
                            <Award size={300} strokeWidth={1} />
                        </div>
                    )}

                    {/* Persistent POS Tag */}
                    <div className="flex px-8 mb-4">
                        <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm ${isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                            {appLang === 'tr' ? wordObj.posTr : wordObj.pos}
                        </span>
                    </div>

                    {isRevealed && (
                        <div className="space-y-8 pb-8">
                            {/* Word & Phonetic */}
                            <div
                                className="mb-2 relative cursor-pointer group hover:bg-slate-500/5 p-4 -ml-4 rounded-3xl transition-colors"
                                onClick={() => setIsRevealed(false)}
                            >
                                <h2 className={`card-title font-black tracking-tight mb-0.5 leading-tight pr-8 ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl') : 'text-4xl sm:text-5xl'}`} style={{ wordBreak: 'break-word' }}>{wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}</h2>
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
                                        <p className={`card-description text-3xl font-black leading-tight ${isDark ? 'text-blue-100' : 'text-blue-900'}`}>
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
                                <p className={`card-example text-xl font-bold leading-relaxed mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
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
                                    onClick={() => { setShowCaseExamples(!showCaseExamples); setShowAi(false); setShowForms(false); setShowDetails(false); setShowWriting(false); setShowMiniStory(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95 ${showCaseExamples ? 'border-amber-400 bg-amber-400/10 text-amber-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400' : 'border-slate-100 glass text-slate-600 shadow-sm')}`}
                                >
                                    <Lightbulb size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{t.caseExamples}</span>
                                </button>
                                <button
                                    onClick={() => { setShowDetails(!showDetails); setShowAi(false); setShowWriting(false); setShowForms(false); setShowCaseExamples(false); setShowMiniStory(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showDetails ? 'border-emerald-400 bg-emerald-400/10 text-emerald-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-emerald-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-emerald-500')}`}
                                >
                                    <BookOpen size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.detailsBtn || 'DETAILS'}</span>
                                </button>
                                <button
                                    onClick={() => { if (!showAi) fetchAiData(wordObj.word); setShowAi(!showAi); setShowWriting(false); setShowForms(false); setShowDetails(false); setShowCaseExamples(false); setShowMiniStory(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showAi ? 'border-blue-400 bg-blue-400/10 text-blue-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-blue-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-blue-500')}`}
                                >
                                    <Sparkles size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.askAiBtn || 'ASK AI'}</span>
                                </button>

                                <button
                                    onClick={() => { setShowForms(!showForms); setShowAi(false); setShowWriting(false); setShowDetails(false); setShowCaseExamples(false); }}
                                    className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showForms ? 'border-indigo-400 bg-indigo-400/10 text-indigo-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-indigo-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-indigo-500')}`}
                                >
                                    <Layers size={24} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t.formsBtn || 'FORMS'}</span>
                                </button>

                                <button
                                    onClick={() => { setShowWriting(!showWriting); setShowAi(false); setShowForms(false); setShowDetails(false); setShowCaseExamples(false); }}
                                    className={`col-span-2 flex items-center justify-center gap-3 p-5 rounded-[2rem] border-2 transition-all hover:scale-[1.02] active:scale-95 ${showWriting ? 'border-purple-400 bg-purple-400/10 text-purple-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400' : 'border-slate-100 glass text-slate-600 shadow-sm')}`}
                                >
                                    <Edit3 size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center">{t.writingBtn || 'YAZMA PRATİĞİ'}</span>
                                </button>
                            </div>


                            {/* Panels */}
                            <div className="space-y-6 pb-6">
                                {showCaseExamples && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-amber-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-amber-500 uppercase tracking-[0.2em]">
                                            <Lightbulb size={20} /> {t.caseExamples}
                                        </h4>

                                        {wordObj.details?.caseExamples?.length > 0 && (
                                            <div className="mb-0 space-y-4">
                                                {wordObj.details.caseExamples.map((ex, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => setRevealedCaseEn(prev => ({ ...prev, [i]: !prev[i] }))}
                                                        className={`p-5 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50/50 border-amber-100'}`}
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            <p className={`text-base font-black leading-tight tracking-tight ${isDark ? 'text-amber-400/90' : 'text-amber-600'}`}>"{ex?.tr || ''}"</p>

                                                            <div className={`grid transition-all duration-300 ease-in-out ${(revealedCaseEn || {})[i] ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                                                <div className="overflow-hidden">
                                                                    <p className={`text-sm font-bold italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                                        {ex?.en || ''}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {!(revealedCaseEn || {})[i] && (
                                                                <div className="flex items-center gap-2 mt-1 text-[9px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-60 transition-opacity text-amber-500">
                                                                    <RefreshCw size={12} /> {t.toEn || 'İngilizcesini Gör'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showWriting && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-purple-500/20' : 'bg-white border-purple-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-purple-500 uppercase tracking-[0.2em]">
                                            <Edit3 size={20} /> {t.writingBtn || 'YAZMA PRATİĞİ'}
                                        </h4>

                                        <div className="h-px bg-amber-500/10 mb-8"></div>

                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-purple-500 uppercase tracking-[0.2em]">
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
                                            className="w-full py-5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-black rounded-3xl shadow-glow-purple transition-all active:scale-95 flex items-center justify-center gap-3"
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
                                                    <div className="flex gap-1.5 items-center px-4 py-2 bg-purple-500 rounded-full font-black text-xs text-white shadow-sm">
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

                                {showMiniStory && wordObj.details?.miniCase && (
                                    <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-pink-500/20' : 'bg-white border-pink-200 shadow-premium'}`}>
                                        <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-pink-500 uppercase tracking-[0.2em]">
                                            <Mascot isDark={isDark} size="xs" isAdmin={isAdmin} /> MINI CASE STORY
                                        </h4>
                                        <p className={`text-xl font-black leading-tight mb-4 tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-950'}`}>
                                            {typeof wordObj.details.trMiniCase === 'object' ? wordObj.details.trMiniCase.tr : wordObj.details.trMiniCase}
                                        </p>

                                        <div className="mt-4">
                                            {!isMiniCaseTrOpen ? (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrOpen(true); }}
                                                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
                                                >
                                                    <RefreshCw size={14} /> {t.showEn || "İngilizcesini Gör"}
                                                </button>
                                            ) : (
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrOpen(false); }}
                                                    className={`p-5 rounded-2xl border-l-[6px] italic text-sm font-bold cursor-pointer animate-fade-in ${isDark ? 'bg-indigo-950/40 border-indigo-600/50 text-slate-400' : 'bg-indigo-100/80 border-indigo-400 text-slate-800'}`}>
                                                    {typeof wordObj.details.miniCase === 'object' ? wordObj.details.miniCase.en : wordObj.details.miniCase}
                                                </div>
                                            )}
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


                                            {wordObj.details?.moreExamples?.length > 0 && (
                                                <div className="pt-4 border-t border-emerald-500/10">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 block">{t.moreExamples || 'MORE EXAMPLES'}</span>
                                                    <div className="space-y-4">
                                                        {wordObj.details.moreExamples.map((ex, i) => (
                                                            <div key={i} className={`p-4 rounded-2xl ${isDark ? 'bg-emerald-950/20' : 'bg-emerald-50'}`}>
                                                                <p className="text-sm font-bold mb-1 leading-tight tracking-tight">"{ex.en}"</p>
                                                                <p className="text-[10px] opacity-60 font-medium italic">{ex.tr}</p>
                                                            </div>
                                                        ))}
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
            {/* Bond Details Overlay */}
            <AnimatePresence>
                {showBondDetails && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => { e.stopPropagation(); setShowBondDetails(false); }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-sm rounded-[3rem] p-8 border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl ${bond.bg} ${bond.border}`}>
                                    <Feather size={40} className={bond.color} />
                                </div>

                                <span className={`text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.mindBonds || 'Zihin Bağları'}</span>
                                <h3 className={`text-4xl font-black mb-4 ${bond.color}`}>{bond.name}</h3>

                                <p className={`text-sm font-medium italic mb-8 opacity-60`}>"{bond.desc}"</p>

                                <div className={`w-full p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.wisdomBar || 'Bilgelik Barı'}</span>
                                        <span className="text-xl font-black opacity-60">%{wisdomProgress}</span>
                                    </div>

                                    <div className="w-full h-3 bg-slate-500/10 rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${wisdomProgress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${bond.id === 'companion' ? 'bg-gradient-to-r from-amber-400 to-orange-400' : (wisdomProgress > 70 ? 'bg-purple-400' : 'bg-indigo-400')}`}
                                        />
                                    </div>
                                    <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest text-right">{t.maxLevelCompanion || 'Maksimum Seviye: Yoldaş (%100)'}</p>
                                </div>

                                {isAdmin && (
                                    <button
                                        onClick={() => onEvolveBond(wordObj.id)}
                                        className="mt-4 px-6 py-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/30 active:scale-95 transition-all"
                                    >
                                        DEBUG: EVOLVE BOND
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowBondDetails(false)}
                                    className="mt-8 px-10 py-4 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                    {t.gotIt || 'ANLADIM'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
