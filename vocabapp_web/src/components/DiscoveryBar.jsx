import React from 'react';
import { motion } from 'framer-motion';

export const DiscoveryBar = ({ current, total = 12, isDark }) => (
    <div className="w-full flex justify-center items-center gap-2 mb-6 pointer-events-none select-none">
        <div className="flex gap-1.5">
            {[...Array(total)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={false}
                    animate={{
                        scale: i < current ? [1, 1.4, 1] : 1,
                        backgroundColor: i < current ? '#fbbf24' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i < current ? 'shadow-[0_0_10px_rgba(251,191,36,0.8)]' : ''
                        }`}
                />
            ))}
        </div>
        <span className="text-[10px] font-black ml-2 opacity-30 uppercase tracking-tighter tabular-nums">
            {current}/{total}
        </span>
    </div>
);
