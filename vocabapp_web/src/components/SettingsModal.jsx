
import React from 'react';
import { ArrowLeft, Settings, X, Languages, Moon, Sun, Hourglass, Share, Instagram, Globe, Heart, Sparkles, MessageSquare, ChevronRight } from 'lucide-react';
import { Mascot } from './Mascot';
import FlamingooImg from '../assets/Mascot/Flamingoo.png';
import { useSettings } from '../context/SettingsContext';
import { useApp } from '../context/AppContext';

export const SettingsModal = () => {
    const { 
        t, isDark, themePref, cycleTheme, getThemeText, appLang, setAppLang, 
        setThemePref, soundEnabled, setSoundEnabled, handleVersionClick, verifyMasterKey 
    } = useSettings();
    const { advanceTime, isAdmin, showSettings, setShowSettings, setShowCommunityHub, setShowAdminPanel } = useApp();

    const [themeDragStartX, setThemeDragStartX] = React.useState(0);
    const [isDraggingTheme, setIsDraggingTheme] = React.useState(false);
    const [showKeyModal, setShowKeyModal] = React.useState(false);
    const [masterKey, setMasterKey] = React.useState('');
    const [keyError, setKeyError] = React.useState(false);
    const [dragStartY, setDragStartY] = React.useState(0);
    const [dragCurrentY, setDragCurrentY] = React.useState(0);
    const [isDraggingPage, setIsDraggingPage] = React.useState(false);

    const onVersionClick = () => {
        const reachedTarget = handleVersionClick();
        if (reachedTarget) {
            setShowKeyModal(true);
        }
    };

    const onKeySubmit = (e) => {
        e.preventDefault();
        const success = verifyMasterKey(masterKey);
        if (success) {
            setShowKeyModal(false);
            setMasterKey('');
        } else {
            setKeyError(true);
            setTimeout(() => setKeyError(false), 500);
        }
    };

    const handleThemePointerDown = (e) => {
        setIsDraggingTheme(true);
        setThemeDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
        if (e.currentTarget.setPointerCapture) {
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    const handleThemePointerMove = (e) => {
        if (!isDraggingTheme) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const delta = currentX - themeDragStartX;

        if (delta > 25) { // swiped right
            if (themePref === 'light') setThemePref('system');
            else if (themePref === 'system') setThemePref('dark');
            setThemeDragStartX(currentX);
        } else if (delta < -25) { // swiped left
            if (themePref === 'dark') setThemePref('system');
            else if (themePref === 'system') setThemePref('light');
            setThemeDragStartX(currentX);
        }
    };

    const handleThemePointerUp = (e) => {
        if (!isDraggingTheme) return;
        setIsDraggingTheme(false);
        if (e.currentTarget.releasePointerCapture) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        const currentX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
        if (themeDragStartX && Math.abs(currentX - themeDragStartX) < 5) {
            cycleTheme();
        }
    };

    const handlePagePointerDown = (e) => {
        if (e.target.closest('.overflow-y-auto')) return; // Don't drag if scrolling content
        setIsDraggingPage(true);
        setDragStartY(e.clientY || (e.touches && e.touches[0].clientY) || 0);
    };

    const handlePagePointerMove = (e) => {
        if (!isDraggingPage) return;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const delta = currentY - dragStartY;
        // Apply resistance if pulling up, otherwise follow
        setDragCurrentY(delta > 0 ? delta : delta * 0.2);
    };

    const handlePagePointerUp = () => {
        if (!isDraggingPage) return;
        if (dragCurrentY > 80) setShowSettings(false);
        setIsDraggingPage(false);
        setDragCurrentY(0);
    };

    if (!showSettings) return null;

    return (
        <>
            <div className={`fixed inset-0 z-[120] flex flex-col justify-end bg-black/70 animate-fade-in`} onClick={() => setShowSettings(false)}>
                <div
                    className={`w-full h-[90vh] p-4 pt-4 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${isDark ? 'bg-[#121212] border-t border-slate-800' : 'bg-[#f4f4f5] border-t border-slate-200'} transform transition-transform flex flex-col`}
                    onClick={e => e.stopPropagation()}
                    onPointerDown={handlePagePointerDown}
                    onPointerMove={handlePagePointerMove}
                    onPointerUp={handlePagePointerUp}
                    onPointerCancel={handlePagePointerUp}
                    style={{ transform: `translateY(${dragCurrentY}px)`, transition: isDraggingPage ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                    {/* Drag Handle */}
                    <div className="w-full pt-1 pb-4 cursor-grab active:cursor-grabbing touch-none" onPointerDown={handlePagePointerDown}>
                        <div className="w-12 h-1.5 bg-slate-500/30 rounded-full mx-auto flex-shrink-0" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 px-4">
                        <button onClick={() => setShowSettings(false)} className={`p-2 -ml-2 rounded-full hover:bg-slate-800/10 active:bg-slate-800/20 transition-all duration-100 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <ArrowLeft size={24} />
                        </button>
                        <h3 className={`text-[2rem] font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t.settings || 'Ayarlar'}</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-1">
                        {/* Group 1: App Settings */}
                        <div className="flex flex-col gap-2 mb-6">
                            <div className={`rounded-[2rem] border overflow-hidden shadow-sm ${isDark ? 'bg-[#1e1e1e] border-slate-700/50' : 'bg-white border-slate-200'}`}>
                                <button onClick={() => setAppLang(appLang === 'tr' ? 'en' : 'tr')} className={`w-full flex items-center justify-between p-4 px-5 hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 transition-all duration-100 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><Languages size={22} /></div>
                                        <div className="text-left py-1">
                                            <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.appLanguage || 'Uygulama Dili'}</h4>
                                            <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase opacity-70 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{appLang === 'tr' ? 'Türkçe' : 'English'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest bg-indigo-500 text-white px-3 py-1.5 rounded-full">{appLang.toUpperCase()}</span>
                                </button>

                                <div
                                    onPointerDown={handleThemePointerDown}
                                    onPointerMove={handleThemePointerMove}
                                    onPointerUp={handleThemePointerUp}
                                    onPointerCancel={handleThemePointerUp}
                                    className={`w-full flex items-center justify-between p-4 px-5 hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 transition-all duration-100 border-b cursor-pointer touch-none select-none ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}
                                >
                                    <div className="flex items-center gap-4 pointer-events-none">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-amber-50 text-amber-600'}`}>{isDark ? <Moon size={22} /> : <Sun size={22} />}</div>
                                        <div className="text-left py-1">
                                            <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.themeMode || 'Tema'}</h4>
                                            <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase opacity-70 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getThemeText()} <span className="lowercase opacity-50">(kaydır)</span></p>
                                        </div>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full p-1 transition-colors relative pointer-events-none shadow-inner ${themePref === 'system' ? 'bg-indigo-400' : isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 flex items-center justify-center ${!isDraggingTheme ? 'transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)' : ''} ${themePref === 'system' ? 'left-1/2 -translate-x-1/2' : isDark ? 'left-[calc(100%-1.5rem)]' : 'left-1'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-slate-400'}`}></div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setSoundEnabled(!soundEnabled)} className={`w-full flex items-center justify-between p-4 px-5 hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20 transition-all duration-100 cursor-pointer ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><Sparkles size={22} /></div>
                                        <div className="text-left py-1">
                                            <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.soundEffects || 'Ses Efektleri'}</h4>
                                            <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase opacity-70 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{soundEnabled ? (appLang === 'tr' ? 'Açık' : 'On') : (appLang === 'tr' ? 'Kapalı' : 'Off')}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors relative shadow-inner ${soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-1 transition-all duration-300 ${soundEnabled ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Group: Community Hub */}
                        <div className="flex flex-col gap-2 mb-6">
                            <button
                                onClick={() => { setShowCommunityHub(true); setShowSettings(false); }}
                                className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all active:scale-[0.98] ${isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/50 border-indigo-200 shadow-sm'}`}
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${isDark ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white shadow-md'}`}>
                                            <Mascot variant="3d" look="glasses" size="sm" isDark={isDark} animated={true} />
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                                <Sparkles size={10} className="text-white fill-white" />
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.communityHub}</h4>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{t.feedbackRoadmap}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase transition-colors ${isAdmin ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : isDark ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-white group-hover:bg-indigo-600'}`}>
                                        {isAdmin ? 'ADMIN' : 'BETA'}
                                    </div>
                                </div>

                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => { setShowAdminPanel(true); setShowSettings(false); }}
                                    className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all active:scale-[0.98] ${isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50/50 border-amber-200 shadow-sm'}`}
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${isDark ? 'bg-amber-500/20' : 'bg-white shadow-md'}`}>
                                                <Settings size={26} className="text-amber-500 animate-spin-slow" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Panel</h4>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-60 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>Insights & Configuration</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-amber-500" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                </button>
                            )}
                        </div>

                        {/* Group 2: Social & Web */}
                        <div className="flex flex-col gap-2 mb-6">
                            <div className={`rounded-[2rem] border overflow-hidden shadow-sm ${isDark ? 'bg-[#1e1e1e] border-slate-700/50' : 'bg-white border-slate-200'}`}>
                                <a href="https://www.instagram.com/ferhat_hoca_ingilizce/" target="_blank" rel="noreferrer" className={`w-full flex items-center justify-between p-4 px-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-50 text-pink-600'}`}><Instagram size={22} /></div>
                                        <div className="text-left py-1">
                                            <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Instagram'da Takip Et</h4>
                                            <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase opacity-70 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Yeni kelimeler öğren</p>
                                        </div>
                                    </div>
                                    <div className="opacity-30"><Share size={16} /></div>
                                </a>

                                <a href="https://ferhathocaingilizce.com" target="_blank" rel="noreferrer" className={`w-full flex items-center justify-between p-4 px-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Globe size={22} /></div>
                                        <div className="text-left py-1">
                                            <h4 className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Websiteyi Ziyaret Et</h4>
                                            <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase opacity-70 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Daha fazla kaynak</p>
                                        </div>
                                    </div>
                                    <div className="opacity-30"><Share size={16} /></div>
                                </a>
                            </div>
                        </div>

                        {/* Footer Logo */}
                        <div className="mt-8 flex flex-col items-center gap-2 opacity-50 pb-10">
                            <button
                                onClick={onVersionClick}
                                className={`text-[11px] font-bold tracking-widest uppercase transition-all active:scale-95 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                            >
                                v1.0.2 (Beta) {isAdmin && '✨'}
                            </button>
                            <p className={`text-[10px] font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Made with <Heart size={10} className="inline text-rose-500 fill-rose-500 mx-1" /> in Türkiye</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Master Key Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className={`w-full max-w-sm p-8 rounded-[3rem] border transition-all ${keyError ? 'animate-shake' : ''} ${isDark ? 'bg-[#1a1a1a] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-2xl'}`}>
                        <div className="flex flex-col items-center text-center gap-4 mb-8">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                                <Settings size={40} className="text-indigo-500 animate-spin-slow" />
                            </div>
                            <div>
                                <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Access</h3>
                                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Enter Master Key</p>
                            </div>
                        </div>

                        <form onSubmit={onKeySubmit} className="space-y-6">
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="password"
                                    placeholder="•••••"
                                    className={`w-full p-5 text-center text-2xl font-black tracking-[0.5em] rounded-2xl border outline-none focus:ring-4 transition-all ${isDark ? 'bg-black border-slate-800 text-white focus:ring-indigo-500/30' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-indigo-500/20'}`}
                                    value={masterKey}
                                    onChange={(e) => { setMasterKey(e.target.value); setKeyError(false); }}
                                    maxLength={5}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowKeyModal(false)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Unlock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
