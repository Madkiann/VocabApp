import React, { useState } from 'react';
import MinimalMascot from '../assets/Mascot/Flamingoo.png';
import Neutral3D from '../assets/Mascot/Flamingo3D.png';
import Happy3D from '../assets/Mascot/Flamingohappy3D.png';
import Book3D from '../assets/Mascot/Flamingo3Dbook.png';
import Chill3D from '../assets/Mascot/Flamingo3Dchill.png';
import Glasses3D from '../assets/Mascot/Flamingo3Dglasses.png';
import Tired3D from '../assets/Mascot/Flamingo3Dtired.png';
import { Sparkles } from 'lucide-react';

export const Mascot = ({
    isDark,
    size = 'md',
    className = '',
    animated = false,
    glow = false,
    variant = '3d', // 'minimal' or '3d'
    look = 'neutral', // 'neutral', 'happy', 'book', 'chill', 'glasses', 'tired'
    isAdmin = false
}) => {
    const [imgError, setImgError] = useState(false);

    const sizes = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
        logo: 'w-40 h-40'
    };

    const handleImgError = () => {
        setImgError(true);
    };

    const getMascotAsset = () => {
        if (variant === 'minimal') return MinimalMascot;
        switch (look) {
            case 'happy': return Happy3D;
            case 'book': return Book3D;
            case 'chill': return Chill3D;
            case 'glasses': return Glasses3D;
            case 'tired': return Tired3D;
            default: return Neutral3D;
        }
    };

    const activeMaskot = getMascotAsset();

    return (
        <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
            {!imgError ? (
                <>
                    {/* Glowing background for premium feel - more subtle */}
                    {(glow || isAdmin) && (
                        <div className={`absolute inset-0 rounded-full blur-3xl mix-blend-screen scale-150 transition-all duration-1000 ${isAdmin ? 'bg-amber-400 opacity-40 animate-pulse' : (isDark ? 'bg-indigo-500 opacity-20' : 'bg-blue-300 opacity-20')}`}></div>
                    )}

                    {isAdmin && (
                        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 z-20 animate-bounce group-hover:animate-none">
                            <Sparkles size={size === 'xl' ? 24 : 16} className="text-amber-400 fill-amber-300 shadow-glow-amber" />
                        </div>
                    )}

                    <img
                        src={activeMaskot}
                        alt="Ferhat Hoca Mascot"
                        className={`object-contain w-full h-full relative z-10 transition-all duration-700 ${isAdmin ? 'brightness-125 saturate-150 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]' : (variant === 'minimal' ? 'brightness-110 contrast-125' : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]')} ${animated ? 'hover:scale-110' : ''}`}
                        style={variant === 'minimal' ? { filter: isDark ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 5px rgba(0,0,0,0.1))' } : {
                            opacity: 0.9
                        }}
                        onError={handleImgError}
                    />
                </>
            ) : (
                <div className={`w-full h-full relative rounded-full flex flex-col items-center justify-center text-white border-2 border-dashed ${isAdmin ? 'bg-amber-500/10 border-amber-500/50' : (isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-200 border-slate-400 text-slate-700')} ${animated ? 'animate-pulse' : ''}`}>
                    <span className={`text-[10px] font-black text-center leading-none ${isAdmin ? 'text-amber-500' : ''}`}>ADMIN</span>
                </div>
            )}
        </div>
    );
};
