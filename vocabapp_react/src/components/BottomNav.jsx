import React, { useState } from 'react';
import { Home, Archive, Moon, BarChart3, Menu } from 'lucide-react'; // RAMADAN UPDATE: Replaced Flame with Moon

export const BottomNav = ({
    isDark,
    showVault, setShowVault,
    showDashboard, setShowDashboard,
    streak,
    setShowSettings,
    t,
    onSecretClick,
    isAdmin
}) => {
    const [isFlameBlue, setIsFlameBlue] = useState(false);
    const [logoClicks, setLogoClicks] = useState(0);

    const handleFlameClick = () => {
        setIsFlameBlue(true);

        // Secret Admin Access (3 Clicks) - Restricted to Admins
        if (isAdmin) {
            const nextClicks = logoClicks + 1;
            if (nextClicks >= 3) {
                onSecretClick && onSecretClick();
                setLogoClicks(0);
            } else {
                setLogoClicks(nextClicks);
            }
        }

        // Reset secret clicks after 2 seconds
        const timer = setTimeout(() => setLogoClicks(0), 2000);

        setTimeout(() => {
            setShowVault(false);
            setShowDashboard(false);
            setShowSettings(false);
        }, 120);
        setTimeout(() => setIsFlameBlue(false), 250);

        return () => clearTimeout(timer);
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[100] px-2 py-3 flex items-center justify-around shadow-[0_-15px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl rounded-t-[2.5rem] border-t-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
            <button
                onClick={() => { setShowVault(false); setShowDashboard(false); setShowSettings(false); }}
                className={`flex flex-col items-center gap-1 transition-all duration-150 w-14 sm:w-16 ${(!showVault && !showDashboard) ? (isDark ? 'text-indigo-400 scale-110 drop-shadow-md' : 'text-indigo-600 scale-110 drop-shadow-md') : 'text-slate-400 hover:text-indigo-400 hover:scale-[1.05]'} active:scale-95`}
            >
                <div className={`${(!showVault && !showDashboard) ? 'bg-indigo-500/10 p-2 rounded-xl' : ''} transition-colors`}>
                    <Home size={22} strokeWidth={(!showVault && !showDashboard) ? 3 : 2} />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold -mt-1">{t.review || "Gözden Geçir"}</span>
            </button>


            <button
                onClick={() => { setShowVault(true); setShowDashboard(false); setShowSettings(false); }}
                className={`flex flex-col items-center gap-1 transition-all duration-150 w-14 sm:w-16 ${showVault ? (isDark ? 'text-indigo-400 scale-110 drop-shadow-md' : 'text-indigo-600 scale-110 drop-shadow-md') : 'text-slate-400 hover:text-indigo-400 hover:scale-[1.05]'} active:scale-95`}
            >
                <div className={`${showVault ? 'bg-indigo-500/10 p-2 rounded-xl' : ''} transition-colors`}>
                    <Archive size={22} strokeWidth={showVault ? 3 : 2} />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold -mt-1">{t.vault || "Kasa"}</span>
            </button>

            <div
                className="relative -top-6 flex flex-col items-center z-10 cursor-pointer"
                onClick={handleFlameClick}
            >
                {/* RAMADAN UPDATE: Changed colors to Emerald/Teal and icon to Moon */}
                <div className={`flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full text-white font-black text-2xl border-4 transition-all duration-200 ease-out ${isDark ? 'border-[#0a0f1c]' : 'border-[#f8f9fc]'} ${isFlameBlue ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_35px_rgba(52,211,153,0.7)] scale-110' : (isDark ? 'bg-gradient-to-tr from-emerald-700 to-teal-500 shadow-glow-emerald hover:scale-105 active:scale-95' : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95')}`}>
                    {isFlameBlue && <Moon size={28} className="absolute animate-ping text-white" style={{ opacity: 0.6, transform: 'scale(1.5)' }} />}
                    <Moon size={28} className={`absolute transition-all duration-200 ${isFlameBlue ? 'text-white scale-125' : 'scale-100'} ${isFlameBlue ? '' : 'animate-pulse'}`} style={{ opacity: isFlameBlue ? 0.9 : 0.4, transform: isFlameBlue ? 'scale(2.3)' : 'scale(1.8)', filter: isFlameBlue ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none' }} />
                    <span className="relative z-10 drop-shadow-md">{streak}</span>
                </div>
            </div>

            <button
                onClick={() => { setShowDashboard(true); setShowVault(false); setShowSettings(false); }}
                className={`flex flex-col items-center gap-1 transition-all duration-150 w-14 sm:w-16 ${showDashboard ? (isDark ? 'text-indigo-400 scale-110 drop-shadow-md' : 'text-indigo-600 scale-110 drop-shadow-md') : 'text-slate-400 hover:text-indigo-400 hover:scale-[1.05]'} active:scale-95`}
            >
                <div className={`${showDashboard ? 'bg-indigo-500/10 p-2 rounded-xl' : ''} transition-colors`}>
                    <BarChart3 size={22} strokeWidth={showDashboard ? 3 : 2} />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold -mt-1">{t.panel || "Panel"}</span>
            </button>

            <button
                onClick={() => setShowSettings(true)}
                className={`flex flex-col items-center gap-1 transition-all duration-150 w-14 sm:w-16 text-slate-400 hover:text-indigo-400 hover:scale-[1.05] active:scale-95`}
            >
                <div className="p-2">
                    <Menu size={22} strokeWidth={2} />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold -mt-1">{t.menu || "Menü"}</span>
            </button>
        </div >
    );
};
