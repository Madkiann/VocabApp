import React from 'react';
import { motion } from 'framer-motion';

export const ChillModeAudio = ({ isDark, activeSound, toggleSound, sounds }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {sounds.map((sound) => (
                <button
                    key={sound.id}
                    onClick={() => toggleSound(sound.id)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${activeSound === sound.id
                        ? 'bg-indigo-500 border-indigo-400 text-white shadow-glow-indigo'
                        : (isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 shadow-sm')}`}
                >
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${activeSound === sound.id ? 'bg-white/20' : (isDark ? 'bg-slate-800' : 'bg-slate-50')}`}>
                        {React.cloneElement(sound.icon, {
                            className: activeSound === sound.id ? 'text-white' : sound.color,
                            size: 24
                        })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{sound.label}</span>

                    {activeSound === sound.id && (
                        <div className="absolute bottom-2 flex gap-1">
                            <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white/60 rounded-full" />
                            <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-white/60 rounded-full" />
                            <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-white/60 rounded-full" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};
