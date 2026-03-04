import React, { useState } from 'react';
import { Bookmark, Share2, Sparkles, Volume2, Eye, EyeOff, ChevronDown, RefreshCw, RotateCw, Layers, Clock, BookOpen, Edit3, Trash2, Undo2, Lightbulb, MessagesSquare, Feather, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from './Mascot';
import { sharePhrasalToCanvas } from '../utils/shareWord';
import { DiscoveryBar } from './DiscoveryBar';
import { LevelTestModal } from './LevelTestModal';
import { sounds } from '../utils/sounds';

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
    onEditWord,
    onUndo,
    canUndo,
    cardBg,
    onEvolveBond,
    isSystem = false,
    showCaseExamples,
    setShowCaseExamples,
    showMiniStory,
    setShowMiniStory
}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMiniCaseTrOpen, setIsMiniCaseTrOpen] = useState(false);
    const [isExampleTrRevealed, setIsExampleTrRevealed] = useState(false);
    const [isCaseExamplesOpen, setIsCaseExamplesOpen] = useState(false);
    const [revealedCaseExampleIdx, setRevealedCaseExampleIdx] = useState(null);
    const [showBondDetails, setShowBondDetails] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [revealedCaseEn, setRevealedCaseEn] = useState({});

    if (!wordObj || !wordObj.sm2) return null;

    React.useEffect(() => {
        setRevealedCaseEn({});
        setShowMiniStory(false);
        setShowCaseExamples(false);
    }, [wordObj?.id]);

    const handleShare = async (e) => {
        if (e) e.stopPropagation();
        if (isSharing) return;
        setIsSharing(true);
        try {
            await sharePhrasalToCanvas(wordObj, appLang, isDark);
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

    const getBondInfo = () => {
        const { int: interval = 0, bondXP = 0, lastQualityScore = 3 } = wordObj.sm2;

        // Stubborn (Dirençli) - Crimson Warning
        if (lastQualityScore === 2) return {
            id: 'stubborn',
            name: t.bond_stubborn || 'Dirençli',
            desc: t.bond_stubborn_desc || 'Seni biraz terletiyor ama pes etmek yok!',
            color: 'text-red-400',
            bg: 'bg-red-950/60',
            border: 'border-red-500/50',
            glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]',
            featherColor: 'text-red-400',
            cardEffect: 'ring-4 ring-red-500/30 animate-pulse-gentle'
        };

        // Stranger (Yabancı) - Minimalist Mist
        if (bondXP === 0) return {
            id: 'stranger',
            name: t.bond_stranger || 'Yabancı',
            desc: t.bond_stranger_desc,
            color: isDark ? 'text-slate-400' : 'text-slate-700',
            bg: isDark ? 'bg-slate-900/40' : 'bg-slate-200/80',
            border: isDark ? 'border-slate-700/30' : 'border-slate-300/60',
            featherColor: isDark ? 'text-slate-500' : 'text-slate-600',
            cardEffect: 'backdrop-blur-[4px] saturate-[1.1]'
        };

        // Acquaintance (Tanış) - Rose Quartz
        if (bondXP < 100) {
            const subLevel = Math.floor(bondXP / 33.4) + 1;
            return {
                id: 'acquaintance',
                name: `${t.bond_acquaintance || 'Tanış'} (Lv ${subLevel})`,
                desc: t.bond_acquaintance_desc,
                color: isDark ? 'text-rose-300' : 'text-rose-700',
                bg: isDark ? 'bg-rose-950/40' : 'bg-rose-300/80',
                border: isDark ? 'border-rose-500/40' : 'border-rose-400/60',
                glow: isDark ? 'shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'shadow-[0_0_40px_rgba(244,63,94,0.3)]',
                featherColor: isDark ? 'text-rose-400' : 'text-rose-700',
                cardEffect: 'ring-2 ring-rose-500/30'
            };
        }

        // Confidant (Sırdaş) - Royal Amethyst
        if (bondXP < 250 || interval < 21) return {
            id: 'confidant',
            name: t.bond_confidant || 'Sırdaş',
            desc: t.bond_confidant_desc,
            color: isDark ? 'text-purple-300' : 'text-purple-800',
            bg: isDark ? 'bg-purple-950/50' : 'bg-purple-300/80',
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
            desc: t.bond_companion_desc,
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
                <div className="absolute inset-0 bg-slate-500/5 backdrop-blur-[2px] pointer-events-none z-0 opacity-40"></div>
            )}




            <div className="flex flex-col h-full relative z-10 font-sans p-6 pt-6">
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
                {!isRevealed && (
                    <div
                        className="absolute inset-x-0 bottom-0 top-16 flex flex-col items-center justify-center cursor-pointer group text-center bg-transparent select-none active:bg-slate-500/5 transition-colors duration-200"
                        onClick={() => {
                            setIsRevealed(true);
                            if (bond.id === 'companion') {
                                sounds.playCompanion();
                            }
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

                <div className={`flex-grow flex flex-col overflow-y-auto custom-scrollbar relative min-h-0 pt-4 mask-fade-v transition-all duration-300 ${!isRevealed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`} style={{ touchAction: 'pan-y' }}>
                    {/* Persistent POS Tag - Now inside scrollable for 'embedded' feel */}
                    <div className="flex px-8 mb-4">
                        <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm ${isDark ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
                            {appLang === 'tr' ? wordObj.posTr : wordObj.pos}
                        </span>
                    </div>

                    <div className="space-y-8 pb-8">
                        {/* Word & Phonetic in revealed mode */}
                        <div
                            className="mb-2 relative cursor-pointer group hover:bg-slate-500/5 p-4 -ml-4 rounded-3xl transition-colors"
                            onClick={() => setIsRevealed(false)}
                        >
                            <h2 className={`card-title font-black tracking-tight mb-1 leading-tight pr-8 ${isDark ? 'text-white' : 'text-slate-900'} ${wordObj.word.length > 8 ? (wordObj.word.length > 12 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl') : 'text-4xl sm:text-5xl'}`} style={{ wordBreak: 'break-word' }}>{wordObj.word.charAt(0).toUpperCase() + wordObj.word.slice(1)}</h2>
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
                            <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-700 overflow-hidden ${isDark ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-indigo-100/40 border-indigo-200/60'}`}>
                                <p className={`card-description text-xl font-bold leading-tight ${isDark ? 'text-blue-100' : 'text-blue-900'}`}>
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
                            <p className={`card-example text-xl font-bold leading-relaxed mb-4 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
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



                        {/* Tools Stack - Story First */}
                        <div className="flex flex-col gap-4 mt-8">
                            <button
                                onClick={() => { setShowMiniStory(!showMiniStory); setShowCaseExamples(false); }}
                                className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${showMiniStory ? 'border-pink-400 bg-pink-400/10 text-pink-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400 hover:border-slate-700 hover:text-pink-400' : 'border-slate-100 glass text-slate-600 shadow-sm hover:border-slate-300 hover:text-pink-500')}`}
                            >
                                <Mascot isDark={isDark} size="xs" isAdmin={isAdmin} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">STORY</span>
                            </button>
                            <button
                                onClick={() => { setShowCaseExamples(!showCaseExamples); setShowMiniStory(false); }}
                                className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-2 transition-all hover:scale-105 active:scale-95 ${showCaseExamples ? 'border-amber-400 bg-amber-400/10 text-amber-500' : (isDark ? 'border-slate-800 glass-dark text-slate-400' : 'border-slate-100 glass text-slate-600 shadow-sm')}`}
                            >
                                <Lightbulb size={24} />
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">{t.caseExamples || 'VAKA ÖRNEKLERİ'}</span>
                            </button>
                        </div>

                        <div className="space-y-6 mt-6">
                            {showMiniStory && wordObj.details?.miniCase && (
                                <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-indigo-500/20' : 'bg-indigo-50/60 border-indigo-200 shadow-premium'}`}>
                                    <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-indigo-500 uppercase tracking-[0.2em]">
                                        <Mascot isDark={isDark} size="xs" isAdmin={isAdmin} /> MINI CASE STORY
                                    </h4>
                                    <p className={`text-xl font-black leading-tight mb-4 tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-950'}`}>
                                        {typeof wordObj.details.miniCase === 'object' ? wordObj.details.miniCase.en : wordObj.details.miniCase}
                                    </p>

                                    <div className="mt-4">
                                        {!isMiniCaseTrOpen ? (
                                            <button
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrOpen(true); }}
                                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
                                            >
                                                <RefreshCw size={14} /> {t.showTranslation || "Çeviriyi Gör"}
                                            </button>
                                        ) : (
                                            <div
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => { e.stopPropagation(); setIsMiniCaseTrOpen(false); }}
                                                className={`p-5 rounded-2xl border-l-[6px] italic text-sm font-bold cursor-pointer animate-fade-in ${isDark ? 'bg-indigo-950/40 border-indigo-600/50 text-slate-400' : 'bg-indigo-100/80 border-indigo-400 text-slate-800'}`}>
                                                {typeof wordObj.details.trMiniCase === 'object' ? wordObj.details.trMiniCase.tr : wordObj.details.trMiniCase}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {showCaseExamples && (wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples)?.length > 0 && (
                                <div className={`p-8 rounded-[3rem] border-2 animate-fade-in ${isDark ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-amber-200 shadow-premium'}`}>
                                    <h4 className="text-xs font-black mb-6 flex items-center gap-2 text-amber-500 uppercase tracking-[0.2em]">
                                        <Lightbulb size={20} /> {t.caseExamples || 'VAKA ÖRNEKLERİ'}
                                    </h4>
                                    <div className="space-y-4">
                                        {(wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples).map((ex, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setRevealedCaseEn(prev => ({ ...prev, [i]: !prev[i] }))}
                                                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50/50 border-amber-100/50'}`}
                                            >
                                                <p className={`text-base font-black leading-tight tracking-tight mb-2 ${isDark ? 'text-amber-400/90' : 'text-amber-600'}`}>"{ex?.en || ''}"</p>

                                                <div className={`grid transition-all duration-300 ease-in-out ${(revealedCaseEn || {})[i] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                    <div className="overflow-hidden">
                                                        <p className={`text-sm font-bold italic pt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                            {ex?.tr || ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                {!(revealedCaseEn || {})[i] && (
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity text-amber-500">
                                                        <RefreshCw size={14} className="animate-spin-slow" /> {t.toTr}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

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
        </div>
    );
};
