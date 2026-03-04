import React from 'react';
import { Feather } from 'lucide-react';
import { motion } from 'framer-motion';

export const DiscoveryBar = ({ current, total = 12, isDark, t, isRetry = false, label = null }) => {
    return (
        <div className={`flex flex-col items-center gap-2 p-3 px-5 rounded-3xl border backdrop-blur-md shadow-lg ${isDark ? 'bg-slate-900/40 border-slate-700/50' : 'bg-white/40 border-slate-200/50'}`}>
            <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isRetry ? (isDark ? 'text-purple-400 opacity-80' : 'text-purple-600') : 'opacity-50'}`}>
                    {label || (isRetry ? (t?.retryMode || 'TEKRAR MODU') : (t?.dailyDiscovery || 'GÜNLÜK KEŞİF'))}
                </span>
                <span className={`text-[9px] font-black ${isRetry ? (isDark ? 'text-purple-300' : 'text-purple-700') : 'opacity-80'}`}>{current} / {total}</span>
            </div>
            <div className="flex gap-1">
                {Array.from({ length: total }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={false}
                        animate={{
                            scale: i < current ? [1, 1.3, 1] : 1,
                            opacity: i < current ? 1 : 0.2
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Feather
                            size={12}
                            className={`${i < current
                                ? (isRetry ? 'text-purple-500 fill-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'text-amber-400 fill-amber-400 shadow-glow-amber')
                                : (isDark ? 'text-slate-600' : 'text-slate-400')}`}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
