import React, { useState } from 'react';
import { Home, Archive, Moon, BarChart3, Menu } from 'lucide-react'; // RAMADAN UPDATE: Replaced Flame with Moon

export const BottomNav = ({
    isDark,
    showVault, onVaultClick,
    showDashboard, onDashboardClick,
    onHomeClick,
    streak,
    setShowSettings,
    t,
    onSecretClick,
    isAdmin,
    dailyProgress = 0,
    lastActionStatus = null
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
            onHomeClick && onHomeClick();
        }, 120);
        setTimeout(() => setIsFlameBlue(false), 250);

        return () => clearTimeout(timer);
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[100] px-2 pt-5 pb-[max(12px,env(safe-area-inset-bottom,20px))] flex items-center justify-around shadow-[0_-15px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl rounded-t-[2.5rem] border-t-2 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
            {/* Daily Module Progress Bar - Living Fluid Version */}
            <div className="absolute top-0 left-12 right-12 h-[4px] overflow-hidden pointer-events-none mt-4 rounded-full">
                <div className={`w-full h-full relative ${isDark ? 'bg-slate-800/30' : 'bg-slate-500/10'}`}>
                    {/* Living Gradient Fill */}
                    <div
                        className={`h-full relative rounded-full bg-[length:200%_100%] animate-[liquid_3s_linear_infinite] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)] ${lastActionStatus ? 'scale-y-[2.5]' : 'scale-y-100'} ${lastActionStatus === 'correct' ? 'bg-emerald-400 shadow-[0_0_20px_#10b981]' : lastActionStatus === 'wrong' ? 'bg-purple-500 shadow-[0_0_20px_#a855f7]' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'}`}
                        style={{ width: `${dailyProgress}%` }}
                    >
                        {/* Rapid Shimmer */}
                        <div className="absolute inset-0 w-full h-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes liquid {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
            `}} />

            <button
                onClick={() => onHomeClick && onHomeClick()}
                className={`flex flex-col items-center gap-1 transition-all duration-150 w-14 sm:w-16 ${(!showVault && !showDashboard) ? (isDark ? 'text-indigo-400 scale-110 drop-shadow-md' : 'text-indigo-600 scale-110 drop-shadow-md') : 'text-slate-400 hover:text-indigo-400 hover:scale-[1.05]'} active:scale-95`}
            >
                <div className={`${(!showVault && !showDashboard) ? 'bg-indigo-500/10 p-2 rounded-xl' : ''} transition-colors`}>
                    <Home size={22} strokeWidth={(!showVault && !showDashboard) ? 3 : 2} />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold -mt-1">{t.review || "Gözden Geçir"}</span>
            </button>


            <button
                onClick={() => onVaultClick && onVaultClick()}
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
                <div className={`flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full text-white font-black text-2xl border-4 transition-all duration-300 ease-out 
                    ${isDark ? 'border-[#0a0f1c]' : 'border-[#f8f9fc]'} 
                    ${lastActionStatus === 'correct' ? 'bg-emerald-500 scale-[1.02] shadow-[0_0_30px_#10b981]' :
                        lastActionStatus === 'wrong' ? 'bg-purple-600 scale-[1.02] shadow-[0_0_30px_#a855f7]' :
                            isFlameBlue ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_35px_rgba(52,211,153,0.7)] scale-110' :
                                (isDark ? 'bg-gradient-to-tr from-emerald-700 to-teal-500 shadow-glow-emerald hover:scale-105 active:scale-95' : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95')}`}>
                    {isFlameBlue && <Moon size={28} className="absolute animate-ping text-white" style={{ opacity: 0.6, transform: 'scale(1.5)' }} />}
                    <Moon size={28} className={`absolute transition-all duration-200 ${isFlameBlue || lastActionStatus ? 'text-white' : 'scale-100'} ${isFlameBlue ? 'scale-125' : ''} ${isFlameBlue || lastActionStatus ? '' : 'animate-pulse'}`} style={{ opacity: (isFlameBlue || lastActionStatus) ? 0.9 : 0.4, transform: isFlameBlue ? 'scale(2.3)' : (lastActionStatus ? 'scale(1.9)' : 'scale(1.8)'), filter: (isFlameBlue || lastActionStatus) ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none' }} />
                    <span className="relative z-10 drop-shadow-md">{streak}</span>
                </div>
            </div>

            <button
                onClick={() => onDashboardClick && onDashboardClick()}
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
