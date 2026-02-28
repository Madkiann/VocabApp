import React from 'react';
import { motion } from 'framer-motion';

export const MascotIcon = ({ isLocked, className = "" }) => {
    // Abstract geometric chameleon mask for SaaS looks
    const modernPath = "M18.667 8.356c3.08-1.5 6.78-2 10.6-1.2 16.3 3.4 20.5 19.3 12.8 30.6-5.8 8.6-18 10.6-26.6 4.8C5.526 35.8 4 23.3 10.8 15.6c.884-.964 1.876-1.83 2.96-2.583a15.8 15.8 0 0 1 4.907-2.06v-2.6zM28.4 4.5l3.2 7.1h-4.8L28.4 4.5zM12 40a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM42 28a6 6 0 1 0 0-12 6 6 0 0 0 0 12z";

    if (isLocked) {
        return (
            <motion.div
                className={`w-12 h-12 flex items-center justify-center relative overflow-hidden rounded-full border-2 ${className} border-slate-700/50 bg-slate-800`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Stone Silhouette */}
                <svg viewBox="0 0 50 50" className="w-8 h-8 text-slate-600 fill-current opacity-60 grayscale filter drop-shadow-md">
                    <path d={modernPath} />
                </svg>
                {/* Dust effect inside stone */}
                <div className="absolute inset-0 bg-slate-900/30 mix-blend-overlay"></div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`w-12 h-12 flex items-center justify-center relative rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden ${className}`}
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-150%', '150%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            ></motion.div>

            <motion.svg
                viewBox="0 0 50 50"
                className="w-8 h-8 text-white fill-current relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                animate={{
                    filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(180deg)', 'hue-rotate(270deg)', 'hue-rotate(360deg)']
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
                <path d={modernPath} />
            </motion.svg>

            {/* Sparkles */}
            <motion.div
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], top: ['10%', '0%'], left: ['70%', '80%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.div
                className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
                animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], top: ['80%', '90%'], left: ['20%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />
        </motion.div>
    );
};
