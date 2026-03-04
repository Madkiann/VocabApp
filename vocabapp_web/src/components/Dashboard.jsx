import React, { useState } from 'react';
import { BarChart3, Moon, Clock, Brain, RefreshCw, Zap, Hourglass, Share2, MoreHorizontal, Target, TrendingUp, Copy, ArrowRight, Trophy, Lock, ChevronDown, Award, FileText, Check, X, Languages, ChevronRight, Feather, RotateCcw } from 'lucide-react';
import { Mascot } from './Mascot';
import AbstractIcon from './AchievementIcons';

export const Dashboard = ({
    t,
    isDark,
    setShowDashboard,
    streak,
    dueTodayCount,
    dueTodayMins,
    learnedCount,
    vocab,
    totalReviewsAll,
    globalRetention,
    bondStats,
    strongCount,
    weakWordsArray,
    bgMain,
    textMain,
    totalSecondsSpent,
    setQuickTx,
    vocabMode,
    setVocabMode,
    onLevelTestClick,
    maxStreak = 0,
    quizLog = { total: 0, correct: 0, history: [] },
    onVaultClick,
    onRetryQuiz,
    showQuizHistory,
    setShowQuizHistory,
    dailyStats = {},
    isAdmin = false,
    advanceTime,
    setShowLibrary
}) => {
    const [sortMode, setSortMode] = useState('name');
    const [achievementsExpanded, setAchievementsExpanded] = useState(false);
    const [achFilter, setAchFilter] = useState('all'); // all, locked, unlocked
    const [showStreakMenu, setShowStreakMenu] = useState(false);
    const [quizHistoryTab, setQuizHistoryTab] = useState('all'); // 'all', 'correct', 'wrong', 'reviewed'
    const [selectedDayStats, setSelectedDayStats] = useState(null);
    const [showFocusHistory, setShowFocusHistory] = useState(false);
    const [detailedFocusDay, setDetailedFocusDay] = useState(null);

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const hours = Math.floor(totalSecondsSpent / 3600);
    const mins = Math.floor((totalSecondsSpent % 3600) / 60);

    const handleShare = async () => {
        const textToShare = `🔥 Ferhat Hoca ile İngilizce'de ${streak} günlük seriye ulaştım! Sende bana katıl!`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kelime Serim',
                    text: textToShare,
                    url: 'https://ferhathocaingilizce.com',
                });
                if (setQuickTx) setQuickTx({ visible: true, text: 'Harika! Başarıyla paylaşıldı. 🚀', x: window.innerWidth / 2, y: window.innerHeight - 100 });
                setTimeout(() => setQuickTx(prev => ({ ...prev, visible: false })), 3000);
                return;
            } catch (err) {
                if (err.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(textToShare);
            if (setQuickTx) setQuickTx({ visible: true, text: 'Bağlantı kopyalandı! 🎉', x: window.innerWidth / 2, y: window.innerHeight - 100 });
        } catch (e) {
            const textArea = document.createElement("textarea");
            textArea.value = textToShare;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (setQuickTx) setQuickTx({ visible: true, text: 'Kopyalandı! 🎉', x: window.innerWidth / 2, y: window.innerHeight - 100 });
        }
        setTimeout(() => { if (setQuickTx) setQuickTx(prev => ({ ...prev, visible: false })); }, 3000);
    };

    return (
        <div className={`min-h-[100dvh] flex flex-col items-center p-4 font-sans transition-all duration-500 pb-32 overflow-x-hidden relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`} onClick={() => { setShowStreakMenu(false); if (setQuickTx) setQuickTx(prev => ({ ...prev, visible: false })); }}>

            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.15] ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
                <div className={`absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-[0.1] ${isDark ? 'bg-emerald-600' : 'bg-emerald-400'}`}></div>
            </div>

            <div className="w-full max-w-md mt-6 animate-fade-in mb-8 relative z-10">

                {/* Unique Fluid Streak Banner */}
                <div className={`relative p-6 rounded-[2.5rem] mb-6 overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 to-[#1e1e24] border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]'}`}>
                    <div className={`absolute -right-10 -top-10 w-40 h-40 blur-3xl opacity-30 pointer-events-none rounded-full ${isDark ? 'bg-emerald-600' : 'bg-emerald-400'}`}></div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl blur shadow-[0_0_20px_rgba(16,185,129,0.5)] opacity-50 animate-pulse"></div>
                                <div className={`absolute inset-0 rounded-3xl flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                                    <Moon size={32} className="text-emerald-500" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className={`text-2xl font-black tracking-tight flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <span className="flex items-center gap-3">
                                        {streak} <span className="text-xl opacity-60 font-medium">{t.dayWord || "Gün"}</span>
                                        <div className="scale-75 origin-left opacity-90 animate-float-subtle">
                                            <Mascot isDark={isDark} size="sm" variant="3d" look="glasses" animated={true} />
                                        </div>
                                    </span>
                                </h3>
                                <p className={`text-[11px] font-bold uppercase tracking-widest opacity-60`}>{t.continuousStreak || "Aralıksız Seri"}</p>
                                <div className="mt-1 flex gap-2">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-max">
                                        <Award size={10} className="inline" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">{t.maxStreak || "En İyi"}: {maxStreak}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-max">
                                        <Moon size={10} className="inline" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">{t.ramadanUpdate || "Hayırlı Ramazanlar"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                                className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-indigo-600 text-white shadow-lg'}`}
                            >
                                <Share2 size={14} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{t.share || "Paylaş"}</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowStreakMenu(!showStreakMenu); }} className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
                                <MoreHorizontal size={18} />
                            </button>

                            {showStreakMenu && (
                                <div className={`absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-xl border p-2 z-50 animate-fade-in ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                                    <button onClick={handleShare} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-xl transition-colors ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                        {t.share || "Paylaş"} <Copy size={16} className="opacity-50" />
                                    </button>
                                    <div className={`h-px w-full my-1 opacity-50 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                                    <button onClick={() => { setShowStreakMenu(false); if (setQuickTx) setQuickTx({ visible: true, text: (t.comingSoon || 'Çok Yakında'), x: window.innerWidth / 2, y: window.innerHeight - 100 }); setTimeout(() => setQuickTx(prev => ({ ...prev, visible: false })), 2000); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-xl transition-colors ${isDark ? 'text-emerald-400 hover:bg-slate-700' : 'text-emerald-600 hover:bg-slate-100'}`}>
                                        {t.protectStreak || "Seriyi Koru"} <Target size={16} className="opacity-50" />
                                    </button>
                                    {isAdmin && (
                                        <button onClick={(e) => { e.stopPropagation(); setShowStreakMenu(false); advanceTime(); }} className={`w-full flex items-center justify-between px-3 py-2 mt-1 text-[11px] font-black uppercase tracking-tighter rounded-xl transition-all bg-amber-400 text-black hover:bg-amber-500`}>
                                            +1 GÜN İLERİ (PASS) <Zap size={14} fill="currentColor" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 opacity-30">
                        <h4 className={`text-[9px] font-black uppercase tracking-[0.15em]`}>{t.weeklyActivity || "Haftalık Aktivite"}</h4>
                        <TrendingUp size={11} />
                    </div>
                    <div className="relative pt-6">
                        <div className={`absolute bottom-2 left-0 w-full h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        <div className={`absolute bottom-2 left-0 h-1 rounded-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`} style={{ width: `${Math.min(100, (streak % 7 === 0 && streak > 0 ? 100 : (streak % 7) / 6 * 100))}%` }}></div>

                        <div className="flex justify-between items-end relative z-10 px-1">
                            {(t.days || ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']).map((day, i) => {
                                const isCurrentDay = i === (streak % 7);
                                const isDone = i < (streak % 7);
                                const dayDiff = i - (streak % 7);
                                const targetDate = new Date();
                                targetDate.setDate(targetDate.getDate() + dayDiff);
                                const targetDateStr = targetDate.toDateString();
                                const stats = dailyStats[targetDateStr] || { swiped: 0, correct: 0, wrong: 0, quiz: 0, hourlyActions: new Array(24).fill(0) };

                                return (
                                    <div
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setSelectedDayStats({ day, date: targetDateStr, stats }); }}
                                        className="flex flex-col items-center gap-2 relative group cursor-pointer"
                                    >
                                        <div className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${isCurrentDay ? 'opacity-100 text-emerald-500' : 'opacity-30 group-hover:opacity-60'}`}>{day}</div>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 relative ${isCurrentDay ? 'bg-emerald-500 text-white shadow-glow-emerald scale-110' : isDone ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600') : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400')}`}>
                                            {isDone || isCurrentDay ? <Check size={14} strokeWidth={4} /> : <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>}
                                            {(stats.correct > 0 || stats.wrong > 0) && (
                                                <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                                                    {stats.correct > 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" title={`${stats.correct} Doğru`} />}
                                                    {stats.wrong > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 border border-white dark:border-slate-900" title={`${stats.wrong} Tekrar`} />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Metro Layout Stats */}
                <div className="flex flex-col gap-4 mb-6">
                    <div
                        onClick={() => setShowFocusHistory(true)}
                        className={`w-full p-6 rounded-[2rem] flex justify-between items-center relative overflow-hidden shadow-sm border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group ${isDark ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}
                    >
                        <div className="absolute right-0 bottom-0 opacity-10 blur-[2px] transform translate-y-4 group-hover:scale-110 transition-transform">
                            <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                                <path d="M0,50 Q50,0 100,50 T200,50" stroke={isDark ? "white" : "currentColor"} strokeWidth="15" fill="none" className="text-indigo-500" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70 flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                {t.focusTime || "Odaklanılan Süre"} <TrendingUp size={10} />
                            </h4>
                            <div className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{hours}<span className="text-xl opacity-60 font-medium">{t.hoursShort || "s"}</span> {mins}<span className="text-xl opacity-60 font-medium">{t.minsShort || "d"}</span></div>
                            <div className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-1 flex items-center gap-1">Geçmiş Analizi İçin Tıkla <ChevronRight size={8} /></div>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all group-hover:rotate-12 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-500 shadow-sm'}`}>
                            <Hourglass size={24} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div
                            onClick={() => onVaultClick && onVaultClick('Mastered')}
                            className={`p-4 rounded-[2rem] flex flex-col items-center justify-between aspect-square border cursor-pointer transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                <Brain size={20} />
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-black tracking-tighter">{strongCount}</div>
                                <div className="text-[7px] font-black uppercase tracking-widest opacity-40 text-center">{t.mastered || "UZMANLAŞILDI"}</div>
                            </div>
                        </div>
                        <div
                            onClick={() => onVaultClick && onVaultClick('Learning')}
                            className={`p-4 rounded-[2rem] flex flex-col items-center justify-between aspect-square border cursor-pointer transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-500'}`}>
                                <Zap size={20} />
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-black tracking-tighter">{learnedCount}</div>
                                <div className="text-[7px] font-black uppercase tracking-widest opacity-40 text-center">{t.learned || "ÖĞRENİLENLER"}</div>
                            </div>
                        </div>
                        <div
                            onClick={() => setShowQuizHistory && setShowQuizHistory(true)}
                            className={`p-4 rounded-[2rem] flex flex-col items-center justify-between aspect-square border cursor-pointer transition-all hover:scale-105 active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${isDark ? 'bg-indigo-500/10 text-indigo-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Trophy size={20} />
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-black tracking-tighter">{quizLog.total}</div>
                                <div className="text-[7px] font-black uppercase tracking-widest opacity-40 text-center">QUIZ ({quizLog.total === 0 ? 0 : Math.round((quizLog.correct / quizLog.total) * 100)}%)</div>
                            </div>
                        </div>
                    </div>

                    {/* Mind Bonds Ecosystem Section */}
                    <div className="mb-10 px-2">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 flex items-center gap-2">
                                {t.mindBonds || "Zihin Bağları"} <Feather size={11} className="text-amber-400" />
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { id: 'stranger', name: t.bond_stranger || 'Yabancı', count: bondStats.stranger, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
                                { id: 'acquaintance', name: t.bond_acquaintance || 'Tanış', count: bondStats.acquaintance, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
                                { id: 'confidant', name: t.bond_confidant || 'Sırdaş', count: bondStats.confidant, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
                                { id: 'companion', name: t.bond_companion || 'Yoldaş', count: bondStats.companion, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
                            ].map((bond) => (
                                <div
                                    key={bond.id}
                                    className={`p-5 rounded-[2.2rem] border transition-all hover:scale-[1.03] active:scale-95 flex flex-col items-center justify-center text-center shadow-sm ${bond.bg} ${bond.border}`}
                                >
                                    <Feather size={18} className={`mb-3 ${bond.color}`} />
                                    <div className={`text-2xl font-black mb-0.5 ${bond.color}`}>{bond.count}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-tight">{bond.name}</div>
                                </div>
                            ))}
                        </div>

                        {/* Special Stubborn Row */}
                        <div
                            className={`p-5 rounded-[2.2rem] border transition-all hover:scale-[1.01] flex items-center justify-between px-8 bg-rose-400/5 border-rose-400/10 group`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-400 rounded-2xl text-white shadow-glow-rose relative">
                                    <RotateCcw size={18} strokeWidth={3} />
                                    <div className="absolute -top-4 -left-4 scale-[0.6] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <Mascot isDark={isDark} size="sm" variant="3d" look="tired" animated={true} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-sm font-black text-rose-500 uppercase tracking-tight">{t.bond_stubborn || 'Dirençli Kelimeler'}</div>
                                    <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Sana Meydan Okuyanlar</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-black text-rose-500">{bondStats.stubborn}</div>
                                <div className="opacity-40 animate-float-subtle">
                                    <Mascot isDark={isDark} size="sm" variant="3d" look="tired" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Practice & Library Section */}
                    <div className="mb-14 px-2">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 flex items-center gap-2">
                                GELİŞİM & ANTRENMAN <Zap size={11} className="text-indigo-400" />
                            </h4>
                        </div>

                        {/* ARENA - Principal Growth Mode */}
                        <div
                            onClick={(e) => { e.stopPropagation(); if (onVaultClick) onVaultClick('Learning'); }}
                            className={`p-7 rounded-[2.8rem] border mb-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] relative overflow-hidden group ${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 shadow-glow-indigo/5' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-sm'}`}
                        >
                            {/* Background Mascot - Arena Variant */}
                            <div className="absolute -top-4 -right-2 opacity-[0.12] group-hover:opacity-25 transition-all duration-700 group-hover:scale-125 origin-center group-hover:rotate-6 pointer-events-none">
                                <Mascot isDark={isDark} size="logo" variant="3d" look="arena" />
                            </div>

                            <div className="relative z-10 flex flex-col items-start gap-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-glow-indigo group-hover:rotate-[15deg] transition-all duration-500">
                                        <Target size={28} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-black text-3xl uppercase tracking-tighter mb-0.5 leading-none select-none italic text-indigo-500 dark:text-indigo-400">{t.practiceArena}</h5>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.15em]">{t.practiceArenaDesc}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Arena Sub-Modes System */}
                                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                                    <div className={`p-4 rounded-[1.8rem] flex flex-col items-center justify-center border transition-all hover:bg-indigo-500/10 ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-white/80 border-indigo-100'}`}>
                                        <Zap size={16} className="text-indigo-500 mb-2" />
                                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">SPEED BLITZ</div>
                                        <div className="text-[7px] font-bold opacity-30 mt-0.5">ZAMANA KARŞI</div>
                                    </div>
                                    <div className={`p-4 rounded-[1.8rem] flex flex-col items-center justify-center border transition-all hover:bg-emerald-500/10 ${isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/80 border-emerald-100'}`}>
                                        <Trophy size={16} className="text-emerald-500 mb-2" />
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">STREAK RUN</div>
                                        <div className="text-[7px] font-bold opacity-30 mt-0.5">HATASIZ SERİ</div>
                                    </div>
                                </div>

                                <button className={`w-full py-4 rounded-[1.8rem] text-[11px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
                                    ARENAYA GİRİŞ YAP <ArrowRight size={14} className="inline ml-1" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Exercise Library System */}
                            <div
                                onClick={(e) => { e.stopPropagation(); setShowLibrary(true); }}
                                className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all hover:scale-[1.03] active:scale-95 flex flex-col items-center text-center relative overflow-hidden group ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 shadow-glow-emerald/5' : 'bg-emerald-50 border-emerald-100 shadow-sm'}`}
                            >
                                <div className="absolute -top-4 -right-4 opacity-[0.08] group-hover:opacity-20 transition-all duration-700 group-hover:scale-125">
                                    <Mascot isDark={isDark} size="lg" variant="3d" look="book" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-glow-emerald mb-4 relative z-10 group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <h5 className="font-black text-xs uppercase tracking-tight mb-1 relative z-10 text-emerald-600 dark:text-emerald-400 italic">{t.exerciseLibrary}</h5>
                                <div className="space-y-1 mt-1">
                                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[7px] font-black text-emerald-500 uppercase tracking-widest">{t.lib_grammar}</div>
                                    <div className="px-2 py-0.5 rounded-full bg-slate-500/5 text-[7px] font-black opacity-30 uppercase tracking-widest">{t.lib_wisdom}</div>
                                </div>
                            </div>

                            {/* Enhanced Level Test Portal */}
                            <div
                                onClick={(e) => { e.stopPropagation(); onLevelTestClick && onLevelTestClick(); }}
                                className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all hover:scale-[1.03] active:scale-95 flex flex-col items-center text-center relative overflow-hidden group ${isDark ? 'bg-amber-500/10 border-amber-500/20 shadow-glow-amber/5' : 'bg-amber-50 border-amber-100 shadow-sm'}`}
                            >
                                <div className="absolute -top-4 -right-4 opacity-[0.08] group-hover:opacity-20 transition-all duration-700 group-hover:scale-125">
                                    <Mascot isDark={isDark} size="lg" variant="3d" look="glasses" />
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-glow-amber mb-4 relative z-10 group-hover:scale-110 transition-transform">
                                    <Trophy size={24} />
                                </div>
                                <h5 className="font-black text-xs uppercase tracking-tight mb-1 relative z-10 text-amber-600 dark:text-amber-500 italic">SEVİYE TESTİ</h5>
                                <div className="mt-1 flex flex-col gap-1 items-center">
                                    <div className="text-[10px] font-black text-amber-600 dark:text-amber-500">20 SORULUK TEST</div>
                                    <div className="h-0.5 w-8 bg-amber-500/30 rounded-full group-hover:w-12 transition-all"></div>
                                    <p className="text-[7px] font-bold opacity-40 uppercase tracking-widest">ŞİMDİ ÖLÇ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-0">
                    <div className="flex flex-col mb-4 px-2">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 flex items-center gap-2">
                                {t.achievementsTitle || "Başarımlar"} <Trophy size={11} />
                            </h4>
                            <button
                                onClick={(e) => { e.stopPropagation(); setAchievementsExpanded(!achievementsExpanded); }}
                                className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <ChevronDown size={14} className={`transition-transform duration-300 ${achievementsExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <div className={`flex p-1 rounded-2xl border transition-all ${isDark ? 'bg-[#1a1a20]/60 border-slate-800/50' : 'bg-slate-100/80 border-slate-200'}`}>
                            {[
                                { id: 'all', label: t.achFilterAll || 'Tümü' },
                                { id: 'unlocked', label: t.achFilterUnlocked || 'Açılan' },
                                { id: 'locked', label: t.achFilterLocked || 'Kilitli' }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={(e) => { e.stopPropagation(); setAchFilter(btn.id); }}
                                    className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${achFilter === btn.id ? (isDark ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-indigo-600 shadow-sm') : 'opacity-40 hover:opacity-100'}`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 ${achievementsExpanded ? 'flex-wrap' : ''}`}>
                        {[
                            { id: 'first_word', title: t.ach_first_word_title, desc: t.ach_first_word_desc, requirement: 1, progress: learnedCount, barColor: 'bg-emerald-500' },
                            { id: 'consistent_3', title: t.ach_consistent_3_title, desc: t.ach_consistent_3_desc, requirement: 3, progress: streak, barColor: 'bg-orange-500' },
                            { id: 'hard_worker', title: t.ach_hard_worker_title, desc: t.ach_hard_worker_desc, requirement: 50, progress: totalReviewsAll, barColor: 'bg-indigo-500' },
                            { id: 'consistent_7', title: t.ach_consistent_7_title, desc: t.ach_consistent_7_desc, requirement: 7, progress: streak, barColor: 'bg-amber-500' },
                            { id: 'master_1', title: t.ach_master_1_title, desc: t.ach_master_1_desc, requirement: 10, progress: strongCount, barColor: 'bg-emerald-500' },
                            { id: 'consistent_15', title: t.ach_consistent_15_title, desc: t.ach_consistent_15_desc, requirement: 15, progress: streak, barColor: 'bg-amber-500' },
                            { id: 'quiz_expert', title: t.ach_quiz_expert_title, desc: t.ach_quiz_expert_desc, requirement: 10, progress: quizLog.total, barColor: 'bg-indigo-500' },
                            { id: 'mastery_focus', title: t.ach_mastery_focus_title, desc: t.ach_mastery_focus_desc, requirement: 50, progress: strongCount, barColor: 'bg-emerald-500' },
                            { id: 'focus_guru', title: t.ach_focus_guru_title, desc: t.ach_focus_guru_desc, requirement: 10800, progress: totalSecondsSpent, barColor: 'bg-amber-400' },
                        ].filter(ach => {
                            if (achFilter === 'unlocked' && ach.progress < ach.requirement) return false;
                            if (achFilter === 'locked' && ach.progress >= ach.requirement) return false;
                            return true;
                        }).map((ach) => {
                            const isUnlocked = ach.progress >= ach.requirement;
                            return (
                                <div key={ach.id} className={`${achievementsExpanded ? 'w-[calc(50%-0.375rem)]' : 'w-36 flex-shrink-0'} p-4 rounded-3xl flex flex-col justify-between aspect-square relative shadow-sm border transition-all ${isUnlocked ? (isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white border-slate-200') : (isDark ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-100 opacity-70 grayscale')}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <AbstractIcon type={ach.id} isLocked={!isUnlocked} className="w-10 h-10" />
                                        {!isUnlocked && <Lock size={14} className={isDark ? 'text-slate-600' : 'text-slate-400'} />}
                                    </div>
                                    <div>
                                        <div className={`font-black text-[13px] leading-tight mb-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{ach.title}</div>
                                        <div className={`text-[9.5px] font-bold opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ach.desc}</div>
                                    </div>
                                    <div className="mt-3">
                                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                                            <div className={`h-full ${isUnlocked ? ach.barColor : 'bg-slate-400'} transition-all`} style={{ width: `${Math.min(100, (ach.progress / ach.requirement) * 100)}%` }}></div>
                                        </div>
                                        <div className="text-[8px] font-black text-right mt-1 opacity-50">{Math.min(ach.progress, ach.requirement)}/{ach.requirement}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {selectedDayStats && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedDayStats(null)}>
                    <div className={`w-full max-w-[280px] p-6 rounded-[2.5rem] border shadow-2xl animate-scale-in ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-xl font-black tracking-tight">{selectedDayStats.day} Günü</h4>
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{new Date(selectedDayStats.date).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedDayStats(null)} className={`p-2 rounded-full ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Aktivite</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-5 rounded-[1.8rem] border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <div className="text-2xl font-black text-indigo-500">{selectedDayStats.stats.swiped}</div>
                                        <div className="text-[9px] font-bold uppercase opacity-50 tracking-wider">Kart Kaydı</div>
                                    </div>
                                    <div className={`p-5 rounded-[1.8rem] border ${isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <div className="text-2xl font-black text-amber-500">{selectedDayStats.stats.quiz}</div>
                                        <div className="text-[9px] font-bold uppercase opacity-50 tracking-wider">Quiz Soru</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Genel Performans ({selectedDayStats.stats.swiped + selectedDayStats.stats.quiz} İşlem)</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-5 rounded-[1.8rem] border ${isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/30 border-emerald-100'}`}>
                                        <div className="text-2xl font-black text-emerald-500">{selectedDayStats.stats.correct}</div>
                                        <div className="text-[9px] font-bold uppercase opacity-60 tracking-wider">Doğru Karar</div>
                                    </div>
                                    <div className={`p-5 rounded-[1.8rem] border ${isDark ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50/30 border-amber-100'}`}>
                                        <div className="text-2xl font-black text-amber-500">{selectedDayStats.stats.wrong}</div>
                                        <div className="text-[9px] font-bold uppercase opacity-60 tracking-wider">Tekrar İsteği</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Günlük Aktivite Yoğunluğu</div>
                            <div className="flex items-end justify-between h-20 gap-1 px-1 mb-2">
                                {(selectedDayStats.stats.hourlyActions || new Array(24).fill(0)).map((val, i) => {
                                    const mVal = Math.max(...(selectedDayStats.stats.hourlyActions || [1]));
                                    const h = val === 0 ? 4 : (val / mVal) * 60;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center group/chart relative">
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[7px] font-black rounded pointer-events-none opacity-0 group-hover/chart:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl">
                                                {i.toString().padStart(2, '0')}:00 - {val} işlem
                                            </div>
                                            <div className={`w-full rounded-t-sm transition-all group-hover/chart:opacity-80 ${val > 0 ? 'bg-indigo-500' : 'bg-slate-500/10'}`} style={{ height: `${h}px` }} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between px-1 opacity-30 text-[7px] font-black border-t border-slate-500/10 pt-1 uppercase tracking-widest">
                                <span>00:00</span>
                                <span>06:00</span>
                                <span>12:00</span>
                                <span>18:00</span>
                                <span>23:00</span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedDayStats(null)} className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg">Kapat</button>
                    </div>
                </div>
            )}

            {showFocusHistory && (
                <div className="fixed inset-0 z-[200] flex flex-col animate-fade-in bg-black/60 backdrop-blur-md" onClick={() => setShowFocusHistory(false)}>
                    <div className={`w-full max-w-md mx-auto h-[85vh] mt-auto rounded-t-[3rem] p-6 flex flex-col shadow-2xl animate-slide-up ${isDark ? 'bg-slate-900 border-t border-slate-800 text-white' : 'bg-white border-t border-slate-100 text-slate-900'}`} onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-slate-500/20 rounded-full mx-auto mb-6 flex-shrink-0" />
                        <div className="flex justify-between items-center mb-8">
                            <div><h2 className="text-3xl font-black tracking-tighter">Odak İstatistikleri</h2></div>
                            <button onClick={() => setShowFocusHistory(false)} className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 pb-10 scrollbar-hide">
                            {Object.entries(dailyStats).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([dateStr, data]) => {
                                const h = Math.floor((data.time || 0) / 3600);
                                const m = Math.floor(((data.time || 0) % 3600) / 60);
                                const active = detailedFocusDay === dateStr;
                                return (
                                    <div key={dateStr} className={`p-5 rounded-[2.5rem] border transition-all ${active ? (isDark ? 'bg-indigo-500/5' : 'bg-indigo-50') : ''} ${isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`} onClick={() => setDetailedFocusDay(active ? null : dateStr)}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-black">{new Date(dateStr).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                                <div className="text-[10px] opacity-40 uppercase font-black">Aktivite: {data.swiped + data.quiz} işlem</div>
                                            </div>
                                            <div className="text-right"><div className="text-lg font-black text-indigo-500">{h}s {m}d</div></div>
                                        </div>
                                        {active && (
                                            <div className="mt-6">
                                                <div className="flex items-end justify-between h-20 gap-1 px-2 animate-fade-in mb-2">
                                                    {(data.hourlyTime || new Array(24).fill(0)).map((v, i) => {
                                                        const mv = Math.max(...(data.hourlyTime || [1]));
                                                        const ht = v === 0 ? 4 : (v / mv) * 60;
                                                        const mm = Math.floor(v / 60);
                                                        const ss = v % 60;
                                                        return (
                                                            <div key={i} className="flex-1 flex flex-col items-center group/focus-chart relative">
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[7px] font-black rounded pointer-events-none opacity-0 group-hover/focus-chart:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl">
                                                                    {i.toString().padStart(2, '0')}:00 - {mm}dk {ss}sn
                                                                </div>
                                                                <div className={`w-full rounded-full transition-all group-hover/focus-chart:opacity-80 ${v > 0 ? 'bg-indigo-500' : 'bg-slate-500/10'}`} style={{ height: `${ht}px` }} />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex justify-between px-4 opacity-30 text-[7px] font-black border-t border-slate-500/10 pt-1 uppercase tracking-widest">
                                                    <span>00:00</span>
                                                    <span>06:00</span>
                                                    <span>12:00</span>
                                                    <span>18:00</span>
                                                    <span>23:00</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={() => setShowFocusHistory(false)} className="w-full py-5 rounded-[2.5rem] bg-indigo-600 text-white font-black uppercase text-sm">Anladım</button>
                    </div>
                </div>
            )}

            {showQuizHistory && (
                <div className={`fixed inset-0 z-[100] flex flex-col animate-fade-in ${isDark ? 'bg-[#0a0a0c]' : 'bg-[#fcfcfd]'}`}>
                    <div className="w-full max-w-md mx-auto p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8 pt-4">
                            <h2 className="text-3xl font-black tracking-tighter">Quiz Geçmişi</h2>
                            <button onClick={() => setShowQuizHistory(false)} className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-lg'}`}><X size={24} /></button>
                        </div>

                        <div className="flex items-center gap-8 mb-8 px-4">
                            <div><div className="text-xl font-black">{quizLog.total}</div><div className="text-[8px] font-bold uppercase opacity-40">Total</div></div>
                            <div><div className="text-xl font-black text-emerald-500">{quizLog.correct}</div><div className="text-[8px] font-bold uppercase opacity-40">Doğru</div></div>
                            <div><div className="text-xl font-black text-amber-500">{quizLog.total - quizLog.correct}</div><div className="text-[8px] font-bold uppercase opacity-40">Tekrar</div></div>
                        </div>

                        <div className={`p-1 rounded-2xl mb-4 grid grid-cols-4 gap-1 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                            {['all', 'correct', 'wrong', 'reviewed'].map(tab => (
                                <button key={tab} onClick={() => setQuizHistoryTab(tab)} className={`py-2 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${quizHistoryTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'opacity-40'}`}>
                                    {tab === 'all' ? t.all : tab === 'correct' ? 'DOĞRU' : tab === 'wrong' ? 'TEKRAR' : t.reviewedTab}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pb-32 scrollbar-hide">
                            {quizLog.history.filter(h => {
                                if (quizHistoryTab === 'correct') return h.isCorrect;
                                if (quizHistoryTab === 'wrong') return !h.isCorrect;
                                if (quizHistoryTab === 'reviewed') return h.reviewed;
                                return true;
                            }).map(entry => (
                                <div key={entry.id} className={`p-4 rounded-3xl flex items-center justify-between border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${entry.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {entry.isCorrect ? <Check size={18} /> : <RotateCcw size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold capitalize flex items-center gap-1">
                                                {typeof entry.word === 'string' ? entry.word : (entry.word?.en || JSON.stringify(entry.word))}
                                                {entry.reviewed && <Check size={12} />}
                                            </div>
                                            <div className="text-[10px] opacity-40 uppercase font-black">{entry.type}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => { onRetryQuiz && onRetryQuiz(entry); setShowQuizHistory(false); setShowDashboard(false); }} className={`p-2 rounded-xl ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><RefreshCw size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
