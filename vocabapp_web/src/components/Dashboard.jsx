import React, { useState } from 'react';
import { BarChart3, Moon, Clock, Brain, RefreshCw, Zap, Hourglass, Share2, MoreHorizontal, Target, TrendingUp, Copy, ArrowRight, Trophy, Lock, ChevronDown } from 'lucide-react'; // RAMADAN UPDATE: Replaced Flame with Moon
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
    familiarCount,
    learningCount,
    strongCount,
    weakWordsArray,
    bgMain,
    textMain,
    totalSecondsSpent,
    setQuickTx,
    vocabMode,
    setVocabMode
}) => {
    const [sortMode, setSortMode] = useState('name');
    const [achievementsExpanded, setAchievementsExpanded] = useState(false);
    const [achFilter, setAchFilter] = useState('all'); // all, locked, unlocked
    const [showOptions, setShowOptions] = useState(false);

    const currentDate = new Date().setHours(0, 0, 0, 0); const hours = Math.floor(totalSecondsSpent / 3600);
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
                return;
            } catch (err) {
                console.log('Share canceled or failed', err);
            }
        }

        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(textToShare);
            if (setQuickTx) setQuickTx({ visible: true, text: 'Panoya kopyalandı! 🎉', x: window.innerWidth / 2, y: window.innerHeight - 100 });
        } catch (e) {
            if (setQuickTx) setQuickTx({ visible: true, text: 'Kopyalanamadı :(', x: window.innerWidth / 2, y: window.innerHeight - 100 });
        }

        setTimeout(() => {
            if (setQuickTx) setQuickTx(prev => ({ ...prev, visible: false }));
        }, 3000);
    };

    return (
        <div className={`min-h-[100dvh] flex flex-col items-center p-4 font-sans transition-all duration-500 pb-32 overflow-x-hidden relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`} onClick={() => { setShowOptions(false); if (setQuickTx) setQuickTx(prev => ({ ...prev, visible: false })); }}>
            {/* Background Glows for Premium Feel - RAMADAN UPDATE: Emerald/Teal glows */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.15] ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
                <div className={`absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-[0.1] ${isDark ? 'bg-emerald-600' : 'bg-emerald-400'}`}></div>
            </div>

            <div className="w-full max-w-md mt-6 animate-fade-in mb-8 relative z-10">

                <div className="flex flex-col items-center justify-center mb-0 px-2 w-full">
                    {/* Mode Tabs moved to App.jsx */}
                </div>

                {/* Unique Fluid Streak Banner - RAMADAN UPDATE */}
                <div className={`relative p-6 rounded-[2.5rem] mb-6 overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 to-[#1e1e24] border border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]'}`}>
                    {/* Background decoration */}
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
                                    {streak} <span className="text-xl font-black mt-2 opacity-60">{t.dayWord || "Gün"}</span>
                                </h3>
                                <p className={`text-[11px] font-bold uppercase tracking-widest opacity-60`}>{t.continuousStreak || "Aralıksız Seri"}</p>
                                <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-max">
                                    <Moon size={10} className="inline" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">{t.ramadanUpdate || "Hayırlı Ramazanlar"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative">

                            <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
                                <Share2 size={18} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }} className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}>
                                <MoreHorizontal size={18} />
                            </button>

                            {/* Options Dropdown */}
                            {showOptions && (
                                <div className={`absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-xl border p-2 z-50 animate-fade-in ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                                    <button onClick={handleShare} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-xl transition-colors ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                        {t.share || "Paylaş"} <Copy size={16} className="opacity-50" />
                                    </button>
                                    <div className={`h-px w-full my-1 opacity-50 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                                    <button onClick={() => { setShowOptions(false); if (setQuickTx) setQuickTx({ visible: true, text: (t.comingSoon || 'Çok Yakında'), x: window.innerWidth / 2, y: window.innerHeight - 100 }); setTimeout(() => setQuickTx(prev => ({ ...prev, visible: false })), 2000); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-bold rounded-xl transition-colors ${isDark ? 'text-emerald-400 hover:bg-slate-700' : 'text-emerald-600 hover:bg-slate-100'}`}>
                                        {t.protectStreak || "Seriyi Koru"} <Target size={16} className="opacity-50" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline Flow (Alternative to the basic pills) - RAMADAN UPDATE */}
                    <div className="relative pt-6">
                        <div className={`absolute bottom-2 left-0 w-full h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        <div className={`absolute bottom-2 left-0 h-1 rounded-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`} style={{ width: `${Math.min(100, (streak % 7 === 0 && streak > 0 ? 100 : (streak % 7) / 6 * 100))}%` }}></div>

                        <div className="flex justify-between items-end relative z-10 px-1">
                            {(t.days || ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']).map((day, i) => {
                                const isCurrentDay = i === (streak % 7);
                                const isDone = i < (streak % 7);
                                return (
                                    <div key={i} className="flex flex-col items-center gap-1.5 h-12 justify-between">
                                        <span className={`text-[9px] font-black uppercase transition-all duration-500 bg-transparent px-1 rounded ${isDark ? (isDone || isCurrentDay ? 'text-teal-400' : 'text-slate-500') : (isDone || isCurrentDay ? 'text-emerald-600' : 'text-slate-400')} ${isCurrentDay ? 'animate-bounce' : ''}`}>{day}</span>
                                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-700 flex-shrink-0 relative z-20 ${isDone ? 'bg-emerald-500 border-emerald-500 scale-100 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : isCurrentDay ? 'bg-slate-900 border-emerald-500 scale-[1.3] animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]' : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300')}`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Metro Layout Stats */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Horizontal Big Stat */}
                    <div className={`w-full p-6 rounded-[2rem] flex justify-between items-center relative overflow-hidden shadow-sm border ${isDark ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                        <div className="absolute right-0 bottom-0 opacity-10 blur-[2px] transform translate-y-4">
                            <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                                <path d="M0,50 Q50,0 100,50 T200,50" stroke={isDark ? "white" : "currentColor"} strokeWidth="15" fill="none" className="text-indigo-500" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{t.focusTime || "Odaklanılan Süre"}</h4>
                            <div className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-indigo-100' : 'text-indigo-900'}`}>{hours}<span className="text-xl opacity-60">{t.hoursShort || "s"}</span> {mins}<span className="text-xl opacity-60">{t.minsShort || "d"}</span></div>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-500 shadow-sm'}`}>
                            <Hourglass size={24} />
                        </div>
                    </div>

                    {/* Horizontal 50/50 Split */}
                    <div className="flex gap-4">
                        <div className={`flex-1 p-5 rounded-[2rem] flex flex-col justify-between aspect-[4/3] shadow-sm border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Brain size={20} />
                                </div>
                                <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Bilinen</span>
                            </div>
                            <div>
                                <div className={`text-3xl font-black leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{strongCount}</div>
                                <p className={`text-[11px] font-bold opacity-50`}>{t.mastered || "Kalıcı hafızada"}</p>
                            </div>
                        </div>

                        <div className={`flex-1 p-5 rounded-[2rem] flex flex-col justify-between aspect-[4/3] shadow-sm border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                    <TrendingUp size={20} />
                                </div>
                                <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Tekrar</span>
                            </div>
                            <div>
                                <div className={`text-3xl font-black leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalReviewsAll}</div>
                                <p className={`text-[11px] font-bold opacity-50`}>{t.progress || "Başarıyla Tamamlandı"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Test card */}
                <div className={`p-6 rounded-[2.5rem] mb-6 border-2 border-dashed relative overflow-hidden group transition-all duration-500 hover:border-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-indigo-950/10 border-slate-800' : 'bg-indigo-50/30 border-slate-200'}`}>
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity rounded-full"></div>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-500 shadow-sm border border-indigo-100/50'}`}>
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{t.levelTestTitle || "Seviye Tespit"}</h4>
                                <span className="px-2 py-0.5 text-[8px] font-black bg-indigo-500 text-white rounded-full animate-pulse">BETA</span>
                            </div>
                            <p className={`text-xs font-bold opacity-60`}>{t.levelTestDesc || "Kelime dağarcığını ölç ve seviyeni öğren!"}</p>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-1.5 transition-all group-hover:translate-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span> {t.comingSoon || "Çok Yakında"} <ArrowRight size={12} className="opacity-60" />
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weak Words Horizontal Scroller */}
                {weakWordsArray.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <Zap className="text-rose-500 fill-rose-500/20" size={18} />
                            <h3 className={`text-base font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.wordsToFocus || "Odaklanılacaklar"}</h3>
                        </div>
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-4 pt-1">
                            {weakWordsArray.slice(0, 10).map((w, i) => (
                                <div key={w.id} className={`flex-shrink-0 w-36 p-4 rounded-3xl flex flex-col justify-between aspect-square relative shadow-lg ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-2 -mt-2 bg-rose-500 opacity-5`}></div>
                                    <span className="text-xs font-black px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-full w-max border border-rose-500/20">
                                        {(t.successRate || "%{rate} Başarı").replace('{rate}', Math.round((w.sm2.correctReviews / w.sm2.totalReviews) * 100))}
                                    </span>
                                    <div>
                                        <div className={`font-black text-xl mb-0.5 capitalize truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{w.word}</div>
                                        <div className={`text-[10px] font-bold truncate opacity-60 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{w.trWord || (t.noTranslation || "Çeviri Yok")}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Achievements Section */}
                <div className="mb-8 mt-2">
                    <div className="flex items-center justify-between gap-2 mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-amber-500 fill-amber-500/20" size={18} />
                            <h3 className={`text-base font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.achievementsTitle || "Başarımlar"}</h3>
                        </div>
                        <button
                            onClick={() => setAchievementsExpanded(!achievementsExpanded)}
                            className={`p-1.5 rounded-full bg-transparent transition-all ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <ChevronDown size={18} className={`transition-transform duration-300 ${achievementsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {achievementsExpanded && (
                        <div className="flex px-2 mt-2 gap-2 mb-4 w-full">
                            {['all', 'unlocked', 'locked'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setAchFilter(f)}
                                    className={`flex-1 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${achFilter === f ? (isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white') : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-500')}`}
                                >
                                    {f === 'all' ? t.achFilterAll : f === 'unlocked' ? t.achFilterUnlocked : t.achFilterLocked}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={`flex gap-3 px-2 pb-4 pt-1 transition-all duration-500 ${achievementsExpanded ? 'flex-wrap' : 'overflow-x-auto scrollbar-hide'}`}>
                        {[
                            {
                                id: 'first_word', title: t.ach_first_word_title, desc: t.ach_first_word_desc, requirement: 1, progress: learnedCount,
                                barColor: 'bg-blue-500'
                            },
                            {
                                id: 'consistent_3', title: t.ach_consistent_3_title, desc: t.ach_consistent_3_desc, requirement: 3, progress: streak,
                                barColor: 'bg-orange-500'
                            },
                            {
                                id: 'hard_worker', title: t.ach_hard_worker_title, desc: t.ach_hard_worker_desc, requirement: 50, progress: totalReviewsAll,
                                barColor: 'bg-indigo-500'
                            },
                            {
                                id: 'consistent_7', title: t.ach_consistent_7_title, desc: t.ach_consistent_7_desc, requirement: 7, progress: streak,
                                barColor: 'bg-amber-500'
                            },
                            {
                                id: 'master_1', title: t.ach_master_1_title, desc: t.ach_master_1_desc, requirement: 10, progress: strongCount,
                                barColor: 'bg-emerald-500'
                            }
                        ].filter(ach => {
                            const isUnlocked = ach.progress >= ach.requirement;
                            if (achFilter === 'unlocked' && !isUnlocked) return false;
                            if (achFilter === 'locked' && isUnlocked) return false;
                            return true;
                        }).map((ach) => {
                            const isUnlocked = ach.progress >= ach.requirement;
                            return (
                                <div key={ach.id} className={`${achievementsExpanded ? 'w-[calc(50%-0.375rem)]' : 'w-36 flex-shrink-0'} p-4 rounded-3xl flex flex-col justify-between aspect-square relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-all ${isUnlocked ? (isDark ? 'bg-slate-800/80 border-slate-700/50 hover:border-indigo-500/30' : 'bg-white border-slate-200/50 hover:border-indigo-200 shadow-md') : (isDark ? 'bg-slate-900 border-slate-800/50 opacity-60' : 'bg-slate-50 border-slate-200/50 opacity-70 grayscale')}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <AbstractIcon type={ach.id} isLocked={!isUnlocked} className="w-10 h-10" />
                                        {!isUnlocked && <Lock size={14} className={isDark ? 'text-slate-600' : 'text-slate-400'} />}
                                    </div>
                                    <div>
                                        <div className={`font-black text-[13px] leading-tight mb-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{ach.title}</div>
                                        <div className={`text-[9.5px] font-bold leading-snug opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ach.desc}</div>
                                    </div>
                                    <div className="mt-3">
                                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                                            <div className={`h-full ${isUnlocked ? ach.barColor : 'bg-slate-400'} transition-all duration-1000`} style={{ width: `${Math.min(100, (ach.progress / ach.requirement) * 100)}%` }}></div>
                                        </div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest text-right mt-1 opacity-50`}>{Math.min(ach.progress, ach.requirement)} / {ach.requirement}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
