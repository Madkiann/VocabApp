import React from 'react';
import { Mascot } from './Mascot';

export const BrandLogo = ({ isDark, isAdmin = false }) => {
    return (
        <div className="flex flex-col items-center justify-center mb-8 select-none transition-transform duration-500 hover:scale-[1.02] group w-full">
            {/* Maskot / Logo */}
            <div className="mb-4 transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
                <Mascot isDark={isDark} size="logo" glow={true} variant="minimal" isAdmin={isAdmin} />
            </div>

            {/* Metin Yapısı */}
            <div className="flex flex-col items-center font-black uppercase text-center drop-shadow-sm w-full relative z-20 mt-1" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
                <span className={`text-xl leading-none tracking-[0.15em] ${isDark ? 'text-blue-400' : 'text-[#18649E]'}`}>
                    FERHAT
                </span>
                <span className={`text-[10px] leading-none tracking-[0.3em] mt-1.5 mb-2 opacity-80 ${isDark ? 'text-blue-400' : 'text-[#18649E]'}`}>
                    HOCA İLE
                </span>
                <span className={`text-2xl leading-none tracking-[0.1em] ml-1 ${isDark ? 'text-amber-400' : 'text-[#F3A125]'}`}>
                    İNGİLİZCE
                </span>
            </div>
        </div>
    );
};
