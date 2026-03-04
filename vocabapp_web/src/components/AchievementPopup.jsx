import React, { useEffect, useState } from 'react';
import AbstractIcon from './AchievementIcons';
import { Mascot } from './Mascot';

export const AchievementPopup = ({ queue, onComplete, isDark, t, isAdmin = false }) => {
    const current = queue.length > 0 ? queue[0] : null;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (current) {
            setIsVisible(false);
            const showTimer = setTimeout(() => {
                setIsVisible(true);
            }, 50);

            const hideTimer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onComplete(current.id), 300);
            }, 4000);

            return () => {
                clearTimeout(showTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [current, onComplete]);

    if (!current) return null;

    return (
        <div className="relative w-full flex justify-center z-[700] mb-2">
            <div
                className={`transition-all duration-300 transform pointer-events-auto cursor-pointer flex items-center gap-4 p-4 pr-6 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border backdrop-blur-xl ${isDark ? 'bg-indigo-900/90 text-white border-indigo-500/30' : 'bg-white/95 text-slate-900 border-indigo-500/20'} ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95'}`}
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onComplete(current.id), 300);
                }}
            >
                <div className="relative">
                    <AbstractIcon type={current.id} isLocked={false} className="w-12 h-12 drop-shadow-md" />
                    <div className="absolute -top-3 -left-3 scale-75 opacity-90">
                        <Mascot isDark={isDark} size="sm" look="happy" animated={false} isAdmin={isAdmin} />
                    </div>
                </div>
                <div className="flex flex-col select-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 animate-pulse">
                        {t?.achUnlocked || "Başarım Açıldı!"}
                    </span>
                    <span className="text-lg font-black tracking-tight mt-0.5">
                        {current.title}
                    </span>
                </div>
            </div>
        </div>
    );
};
