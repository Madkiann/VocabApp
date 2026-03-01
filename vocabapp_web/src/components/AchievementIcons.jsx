import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AbstractIcon = ({ type, isLocked, className }) => {
    // Basic SaaS style geometric paths for each niche
    const paths = {
        first_word: "M25 4L12 11V23L25 31L38 23V11L25 4Z M25 7.5L34 12V21L25 26.5L16 21V12L25 7.5Z M25 15C22.24 15 20 17.24 20 20C20 22.76 22.24 25 25 25C27.76 25 30 22.76 30 20C30 17.24 27.76 15 25 15Z",
        consistent_3: "M25 5C25 5 15 15 15 25C15 30.52 19.48 35 25 35C30.52 35 35 30.52 35 25C35 18 29.5 13.5 29.5 13.5C29.5 13.5 30 18 27.5 22C27.5 22 25 10 25 5ZM25 21C27.21 21 29 22.79 29 25C29 27.21 27.21 29 25 29C22.79 29 21 27.21 21 25C21 23.5 22 22 22 22C22 22 21 24 23.5 24C24.5 24 24 21 25 21Z",
        hard_worker: "M25 6L21 13L13 15L19 21L17 29L25 25L33 29L31 21L37 15L29 13L25 6Z M25 12.5L27 16L31 17L28 20L29 24L25 22L21 24L22 20L19 17L23 16L25 12.5Z",
        consistent_7: "M28 5L15 22H25V35L38 18H28V5ZM26 10V18H31L23 29V21H18L26 10Z",
        master_1: "M25 4C20 4 15 9 15 15C15 17 16 19 18 21C18 25 15 28 15 28H35C35 28 32 25 32 21C34 19 35 17 35 15C35 9 30 4 25 4ZM25 9C28 9 30 11 30 14C30 16 28 18 25 18C22 18 20 16 20 14C20 11 22 9 25 9ZM12 18V21C10 21 9 22 9 24C9 26 10 27 12 27V30H38V27C40 27 41 26 41 24C41 22 40 21 38 21V18H12Z",
        consistent_15: "M25 5L28 15H38L30 21L33 31L25 25L17 31L20 21L12 15H22L25 5Z M25 10L32 25L10 15H40L18 25L25 10Z",
        quiz_expert: "M25 5L10 12V22C10 30 25 35 25 35C25 35 40 30 40 22V12L25 5ZM25 10L36 15V22C36 28 25 32 25 32C25 32 14 28 14 22V15L25 10ZM25 15L22 25H28L25 15Z",
        mastery_focus: "M25 5C14 5 5 14 5 25S14 45 25 45S45 36 45 25S36 5 25 5ZM25 40C16.7 40 10 33.3 10 25S16.7 10 25 10S40 16.7 40 25S33.3 40 25 40ZM32 22L28 26L22 22V15H18V25L25 32L32 25V22Z",
        focus_guru: "M25 4C20 4 16 8 16 13C16 17 19 21 23 22V28H18V31H32V28H27V22C31 21 34 17 34 13C34 8 30 4 25 4ZM25 8C27.8 8 30 10.2 30 13C30 15.8 27.8 18 25 18C22.2 18 20 15.8 20 13C20 10.2 22.2 8 25 8Z"
    };

    const gradientMap = {
        first_word: "from-blue-500 to-cyan-400",
        consistent_3: "from-orange-500 to-amber-400",
        hard_worker: "from-purple-500 to-pink-500",
        consistent_7: "from-yellow-400 to-orange-400",
        master_1: "from-emerald-500 to-teal-400",
        consistent_15: "from-rose-500 to-pink-500",
        quiz_expert: "from-indigo-600 to-blue-500",
        mastery_focus: "from-emerald-600 to-green-400",
        focus_guru: "from-amber-400 to-orange-400"
    };

    const modernPath = paths[type] || paths.first_word;
    const gradient = gradientMap[type] || gradientMap.first_word;

    if (isLocked) {
        return (
            <motion.div
                className={`w-12 h-12 flex items-center justify-center relative overflow-hidden rounded-full border-2 ${className} border-slate-700/50 bg-slate-800`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg viewBox="0 0 50 40" className="w-8 h-8 text-slate-600 fill-current opacity-60 grayscale filter drop-shadow-md">
                    <path d={modernPath} />
                </svg>
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-overlay"></div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`w-12 h-12 flex items-center justify-center relative rounded-full shadow-lg border-2 border-transparent bg-gradient-to-br ${gradient} overflow-hidden ${className}`}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
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
                viewBox="0 0 50 40"
                className="w-8 h-8 text-white fill-current relative z-10 filter drop-shadow-md"
                animate={{
                    filter: ['hue-rotate(0deg)', 'hue-rotate(15deg)', 'hue-rotate(-15deg)', 'hue-rotate(0deg)']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
                <path d={modernPath} />
            </motion.svg>
        </motion.div>
    );
};

export default AbstractIcon;
