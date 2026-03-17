import React from 'react';
import { X, Zap, Trophy, Flame, ChevronRight, Swords, Sparkles, Target } from 'lucide-react';
import { Mascot } from './Mascot';

export const ArenaGate = ({ isDark, t, onClose, onModeSelect, isAdmin }) => {
    return (
        <div className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md transition-all duration-500 ${isDark ? 'bg-black/80' : 'bg-slate-900/40'}`}>
            <div className={`relative w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border transition-all duration-500 animate-pop ${isDark ? 'bg-[#0a0a0c] border-white/10' : 'bg-white border-slate-200'
                }`}>

                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-glow-blue">
                            <Swords size={24} />
                        </div>
                        <div>
                            <h2 className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>PRACTICE ARENA</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Challenge your limits</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-3 rounded-2xl transition-all hover:rotate-90 active:scale-95 ${isDark ? 'bg-white/5 text-white/50 hover:text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modes Content */}
                <div className="p-8 pt-4 space-y-4">

                    {/* Mode 1: Streak Case Run */}
                    <div
                        onClick={() => onModeSelect('streak')}
                        className={`group relative p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 overflow-hidden ${isDark ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/50' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-500'
                            }`}
                    >
                        <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:rotate-12 group-hover:scale-125">
                            <Trophy size={160} className="text-emerald-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                <Flame size={18} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Most Popular</span>
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>STREAK CASE RUN</h3>
                            <p className="text-xs font-bold opacity-50 mb-6 leading-relaxed max-w-[200px]">Kütüphanedeki tüm gramer vakalarını seri yaparak hatasız geçmeye çalış.</p>

                            <div className="flex items-center gap-2">
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white shadow-lg'}`}>
                                    PLAY NOW <ChevronRight size={14} />
                                </div>
                                <div className="px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest opacity-30">Difficulty: Adaptive</div>
                            </div>
                        </div>
                    </div>

                    {/* Mode 2: Speed Blitz */}
                    <div
                        onClick={() => onModeSelect('blitz')}
                        className={`group relative p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 overflow-hidden ${isDark ? 'bg-indigo-500/5 border-indigo-500/10 hover:border-indigo-500/50' : 'bg-indigo-50 border-indigo-100 hover:border-indigo-500'
                            }`}
                    >
                        <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:-rotate-12 group-hover:scale-125">
                            <Zap size={160} className="text-indigo-500" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-indigo-500">
                                <Zap size={18} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Time Attack</span>
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>SPEED BLITZ</h3>
                            <p className="text-xs font-bold opacity-50 mb-6 leading-relaxed max-w-[200px]">60 saniyede kaç kelime bilebileceğini kanıtla. Hızlı olan kazanır!</p>

                            <div className="flex items-center gap-2">
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white shadow-lg'}`}>
                                    START DASH <ChevronRight size={14} />
                                </div>
                                <div className="px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest opacity-30">Goal: 20+ words</div>
                            </div>
                        </div>
                    </div>

                    {/* Mode 3: Pattern Match (Coming Soon) */}
                    <div className={`relative p-6 rounded-[2.5rem] border-2 border-dashed opacity-40 filter grayscale ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-amber-500">
                                <Target size={18} />
                                <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>PATTERN MATCH</h3>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-500/20">Locked</span>
                        </div>
                    </div>

                </div>

                {/* Footer Tip */}
                <div className={`p-6 border-t mt-auto flex items-center gap-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <Mascot isDark={isDark} size="xs" look="glasses" isAdmin={isAdmin} />
                    <p className="text-[10px] font-bold italic opacity-40 leading-tight">"Arena modları kütüphanedeki gerçek ventaları test etmek içindir. Hazır mısın?"</p>
                </div>

            </div>
        </div>
    );
};
