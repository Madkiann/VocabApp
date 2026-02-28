import React, { useState } from 'react';
import { Archive, Trash2, ArrowLeft, Folder, Plus, Move, Sparkles, Bookmark, Heart, History, Search, ArrowDownUp, Pin, X } from 'lucide-react';
import { Mascot } from './Mascot';

export const Vault = ({
    t,
    isDark,
    bgMain,
    textMain,
    cardBg,
    savedWords,
    setSelectedVaultWord,
    setIsRevealed,
    setIsTranslated,
    setShowForms,
    setShowAi,
    setShowWriting,
    toggleSaveWord,
    setShowVault,
    selectedVaultWord,
    renderCardContent,
    quickTx,
    setQuickTx,
    appLang,
    vaultFolders,
    setVaultFolders,
    updateWordFolder,
    deleteVaultFolder,
    renameVaultFolder,
    isAdmin = false
}) => {
    const [activeFolder, setActiveFolder] = useState(null); // null means showing Deck List
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [innerSearchQuery, setInnerSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [sortMode, setSortMode] = useState('alpha'); // alpha, count_desc, count_asc
    const [innerSortMode, setInnerSortMode] = useState('latest'); // latest, alpha, retention
    const [filterMode, setFilterMode] = useState('all'); // all, created, saved
    const [editingFolder, setEditingFolder] = useState(null);
    const [editFolderName, setEditFolderName] = useState('');

    const handleAddFolder = () => {
        if (newFolderName.trim() && !vaultFolders.includes(newFolderName.trim())) {
            setVaultFolders([...vaultFolders, newFolderName.trim()]);
            setActiveFolder(newFolderName.trim());
        }
        setNewFolderName('');
        setIsAdding(false);
    };

    const handleRenameFolder = (oldName) => {
        if (renameVaultFolder) renameVaultFolder(oldName, editFolderName);
        setEditingFolder(null);
    };

    // Card Detail View
    if (selectedVaultWord) {
        return (
            <div className={`min-h-[100dvh] mesh-bg ${textMain} flex flex-col items-center justify-center p-4 font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? 'dark' : ''}`} onClick={() => setQuickTx(prev => ({ ...prev, visible: false }))}>
                {quickTx.visible && (
                    <div className="fixed z-50 pointer-events-none" style={{ left: `${quickTx.x}px`, top: `${quickTx.y - 12}px` }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-5 py-3 bg-indigo-600 text-white text-base font-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.4)] animate-fade-in whitespace-nowrap">
                            {quickTx.text}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-indigo-600" />
                        </div>
                    </div>
                )}
                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => { setSelectedVaultWord(null); setIsTranslated(false); setShowForms(false); setShowAi(false); setShowWriting(false); setQuickTx(prev => ({ ...prev, visible: false })); }} className={`px-5 py-2.5 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-premium ${isDark ? 'glass-dark text-slate-300' : 'glass text-slate-700'}`}>
                        <ArrowLeft size={20} /> {t.backToVault || "Geri"}
                    </button>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center w-full mt-10 pb-20">
                    <div className="relative w-full max-w-sm aspect-[3/4]">
                        {/* 3D Mascot peering from behind the card - more subtle */}
                        <div className="absolute -top-16 -right-12 w-32 h-32 pointer-events-none drop-shadow-xl z-20 opacity-80">
                            <Mascot isDark={isDark} size="lg" look="happy" animated={false} isAdmin={isAdmin} />
                        </div>
                        <div className={`absolute inset-0 ${cardBg} rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border ${isDark ? 'border-slate-800' : 'border-slate-200'} p-7 flex flex-col origin-center overflow-hidden animate-fade-in select-none`}>
                            {renderCardContent(selectedVaultWord, true)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List of words inside a folder view
    if (activeFolder !== null) {
        let wordsInFolder = savedWords.filter(w => (w.folder || 'General') === activeFolder);

        if (innerSearchQuery) {
            wordsInFolder = wordsInFolder.filter(w =>
                w.word.toLowerCase().includes(innerSearchQuery.toLowerCase()) ||
                (w.trWord && w.trWord.toLowerCase().includes(innerSearchQuery.toLowerCase()))
            );
        }

        if (innerSortMode === 'alpha') {
            wordsInFolder.sort((a, b) => a.word.localeCompare(b.word));
        } else if (innerSortMode === 'retention') {
            wordsInFolder.sort((a, b) => (b.retention || 0) - (a.retention || 0));
        } else {
            // Latest (assumes order in savedWords is chronological)
            // No action needed or reverse
        }

        return (
            <div className={`min-h-[100dvh] mesh-bg ${textMain} flex flex-col items-center p-4 font-sans transition-colors duration-500 pb-32 ${isDark ? 'dark' : ''}`}>
                <div className="w-full max-w-md mt-6 animate-fade-in px-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} truncate mr-4`}>
                            {activeFolder === 'General' ? t.generalFolder || 'General' : activeFolder}
                        </h2>
                        <button onClick={() => { setActiveFolder(null); setInnerSearchQuery(''); }} className={`p-3 rounded-2xl font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-premium ${isDark ? 'glass-dark text-slate-300' : 'glass text-slate-700'}`}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={`flex items-center gap-3 px-4 py-2.5 mb-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-slate-900/50 border-slate-800 focus-within:border-indigo-500/50' : 'bg-white border-slate-200 focus-within:border-indigo-500/50'}`}>
                        <Search size={16} className="text-slate-500" />
                        <input
                            value={innerSearchQuery}
                            onChange={e => setInnerSearchQuery(e.target.value)}
                            placeholder={t.searchWords}
                            className={`flex-1 bg-transparent border-none outline-none text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
                        />
                        <div className="flex items-center gap-2 border-l border-slate-700/30 pl-3 ml-1">
                            <button onClick={() => setInnerSortMode(prev => prev === 'alpha' ? 'latest' : 'alpha')} className={`transition-colors ${innerSortMode === 'alpha' ? 'text-indigo-500' : 'text-slate-400'}`} title="Alfabetik">
                                <ArrowDownUp size={16} />
                            </button>
                        </div>
                    </div>

                    {wordsInFolder.length === 0 ? (
                        <div className={`p-12 mt-4 text-center rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-4 ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            <Archive size={48} className="opacity-20" />
                            <p className="font-bold">{t.vaultEmpty}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {wordsInFolder.map(w => (
                                <div key={w.id} onClick={() => { setSelectedVaultWord(w); setIsRevealed(true); setIsTranslated(false); setShowForms(false); setShowAi(false); setShowWriting(false); }} className={`p-5 rounded-[2rem] flex justify-between items-center shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white border border-slate-100'}`}>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h3 className={`text-2xl font-black tracking-tighter capitalize truncate ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>{w.word}</h3>
                                            <span className={`text-[9px] uppercase font-black tracking-[0.2em] px-2 py-0.5 rounded-full flex-shrink-0 ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {appLang === 'tr' ? w.posTr : w.pos}
                                            </span>
                                        </div>
                                        <p className={`text-xs font-semibold truncate ${isDark ? 'opacity-50 text-slate-300' : 'opacity-60 text-slate-600'}`}>
                                            {appLang === 'tr' ? w.trWord : w.engDef.split(';')[0]}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                                        <div className="relative group/select z-10 bg-transparent rounded-lg flex items-center justify-center border border-dashed border-slate-400/30">
                                            <select
                                                className={`appearance-none bg-transparent outline-none cursor-pointer w-full h-full text-center text-xs font-bold text-transparent absolute inset-0 z-20`}
                                                value={w.folder || 'General'}
                                                onClick={e => e.stopPropagation()}
                                                onChange={(e) => { e.stopPropagation(); updateWordFolder(w.id, e.target.value); }}
                                            >
                                                {vaultFolders.map(f => <option key={f} value={f}>{f === 'General' ? t.generalFolder || 'Sana Özel' : f}</option>)}
                                            </select>
                                            <Move size={14} className={`m-2 opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-500'}`} />
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); toggleSaveWord(w); }} className={`p-2 rounded-lg transition-all border border-transparent hover:border-rose-500 hover:text-rose-500 group z-10 relative ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-500'}`}>
                                            <Trash2 size={14} className="group-hover:animate-shake" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // MY DECKS (Vault Overview) View
    const folderColors = [
        { bg: 'bg-blue-500', icon: Sparkles },
        { bg: 'bg-purple-500', icon: Bookmark },
        { bg: 'bg-rose-500', icon: Heart },
        { bg: 'bg-emerald-500', icon: History },
        { bg: 'bg-amber-500', icon: Folder },
        { bg: 'bg-cyan-500', icon: Folder }
    ];

    const renderDeck = (folderName, idx) => {
        const c = folderColors[idx % folderColors.length];
        const folderWords = savedWords.filter(w => (w.folder || 'General') === folderName);
        const count = folderWords.length;

        if (searchQuery && !folderName.toLowerCase().includes(searchQuery.toLowerCase())) return null;

        // Filter created vs saved (pseudo-logic based on name or presence in initialVocab)
        if (filterMode === 'created' && folderName === 'General') return null;
        if (filterMode === 'saved' && folderName !== 'General') return null;

        const learned = folderWords.filter(w => (w.retention || 0) > 50).length;
        const progress = count > 0 ? Math.round((learned / count) * 100) : 0;

        const radius = 22;
        const circ = 2 * Math.PI * radius;
        const offset = circ - (progress / 100) * circ;

        const Icon = folderName === 'General' ? History : c.icon;
        const title = folderName === 'General' ? (t.generalFolder || 'Sana Özel') : folderName;

        return (
            <div key={folderName} onClick={() => setActiveFolder(folderName)} className={`flex justify-between items-center py-5 px-1 group cursor-pointer border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex gap-5 items-center">
                    <div className="relative w-16 h-20 perspective-[1000px] -mt-2">
                        {/* Back card */}
                        <div className={`absolute top-0 left-1 w-full h-full rounded-2xl ${c.bg} opacity-20 -z-20 scale-[0.80] translate-y-3 transition-transform group-hover:translate-y-2`}></div>
                        {/* Middle card */}
                        <div className={`absolute top-0 left-0.5 w-full h-full rounded-2xl ${c.bg} opacity-50 -z-10 scale-[0.90] translate-y-1.5 transition-transform group-hover:translate-y-1`}></div>
                        {/* Front card */}
                        <div className={`absolute top-0 left-0 w-full h-full rounded-2xl ${c.bg} flex items-center justify-center text-white shadow-xl group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-shadow`}>
                            <Icon size={28} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        {editingFolder === folderName ? (
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <input
                                    autoFocus
                                    value={editFolderName}
                                    onChange={e => setEditFolderName(e.target.value)}
                                    onBlur={() => handleRenameFolder(folderName)}
                                    onKeyDown={e => e.key === 'Enter' && handleRenameFolder(folderName)}
                                    className={`w-32 px-2 py-1 text-sm font-bold rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50 bg-transparent ${isDark ? 'text-white border border-slate-700' : 'text-slate-900 border border-slate-300'}`}
                                />
                            </div>
                        ) : (
                            <h4 className={`text-xl font-bold tracking-tight leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{title}</h4>
                        )}
                        <p className={`text-[11px] uppercase font-bold tracking-[0.1em] flex items-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {count} {t.words || "kelime"} <Pin size={10} className={`ml-1.5 opacity-60 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    {folderName !== 'General' && editingFolder !== folderName && (
                        <div className="flex flex-col gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setEditFolderName(folderName); setEditingFolder(folderName); }} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <Search size={14} className="opacity-0 w-0 h-0" /> {/* Spacer */}
                                <span className="text-[10px] font-bold underline">{t.edit}</span>
                            </button>
                            <button onClick={() => deleteVaultFolder && deleteVaultFolder(folderName)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-rose-900/30 text-rose-400' : 'hover:bg-rose-100 text-rose-500'}`}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}

                    <div className="relative flex items-center justify-center w-[54px] h-[54px] mr-2 flex-shrink-0">
                        {/* Background Circle */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none">
                            <circle cx="27" cy="27" r={radius} stroke="currentColor" strokeWidth="4" fill="none" className={`opacity-20 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                        </svg>
                        {/* Progress Circle */}
                        {progress > 0 && (
                            <svg className={`absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none transition-all duration-500 ease-out ${c.bg.replace('bg-', 'text-')}`}>
                                <circle cx="27" cy="27" r={radius} stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                            </svg>
                        )}
                        <span className={`text-[10px] font-black tracking-tighter ${isDark ? 'opacity-80 text-white' : 'opacity-80 text-slate-800'}`}>
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-[100dvh] transition-all duration-500 pb-32 overflow-x-hidden relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`}>
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.12] ${isDark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                <div className={`absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-[0.08] ${isDark ? 'bg-emerald-600' : 'bg-emerald-300'}`}></div>
            </div>

            <div className="w-full max-w-md mx-auto pt-4 animate-fade-in relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className={`text-[2rem] font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.vault || "Kasa"}</h2>
                    <div className="flex gap-4 opacity-70">
                        <Search size={22} onClick={() => setIsSearching(!isSearching)} className={`cursor-pointer transition-transform hover:scale-110 ${isSearching ? 'text-indigo-500' : (isDark ? 'text-slate-200' : 'text-slate-800')}`} />
                        <div className="relative group">
                            <ArrowDownUp size={22} className={`cursor-pointer transition-transform hover:scale-110 ${sortMode !== 'alpha' ? 'text-indigo-500' : (isDark ? 'text-slate-200' : 'text-slate-800')}`} />
                            <div className={`absolute top-full right-0 mt-2 w-40 rounded-xl shadow-xl border p-2 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <button onClick={() => setSortMode('alpha')} className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-lg ${sortMode === 'alpha' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-700/10'}`}>{t.alpha}</button>
                                <button onClick={() => setSortMode('count_desc')} className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-lg ${sortMode === 'count_desc' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-700/10'}`}>{t.desc}</button>
                                <button onClick={() => setSortMode('count_asc')} className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded-lg ${sortMode === 'count_asc' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-700/10'}`}>{t.asc}</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar (Expandable) */}
                {isSearching && (
                    <div className="px-2 mb-6 animate-slide-up">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm border ${isDark ? 'bg-[#1e1e1e] border-slate-700/50' : 'bg-white border-slate-200'}`}>
                            <Search size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={t.searchFolders}
                                className={`flex-1 bg-transparent border-none outline-none text-sm font-semibold ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                            />
                            {searchQuery && <X size={16} onClick={() => setSearchQuery('')} className={`cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />}
                        </div>
                    </div>
                )}

                {/* Filter / Category Pills */}
                <div className={`flex gap-2.5 overflow-x-auto scrollbar-hide px-2 pb-2 ${isSearching ? 'mb-4' : 'mb-6'}`}>
                    <span onClick={() => setFilterMode('all')} className={`px-5 py-2 rounded-full text-[13px] font-bold shadow-sm whitespace-nowrap cursor-pointer transition-all ${filterMode === 'all' ? (isDark ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white') : (isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-200/50 text-slate-600')}`}>{t.all}</span>
                    <span onClick={() => setFilterMode('created')} className={`px-5 py-2 rounded-full text-[13px] font-bold shadow-sm whitespace-nowrap cursor-pointer transition-all ${filterMode === 'created' ? (isDark ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white') : (isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-200/50 text-slate-600')}`}>{t.created}</span>
                    <span onClick={() => setFilterMode('saved')} className={`px-5 py-2 rounded-full text-[13px] font-bold shadow-sm whitespace-nowrap cursor-pointer transition-all ${filterMode === 'saved' ? (isDark ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white') : (isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-200/50 text-slate-600')}`}>{t.savedWordsTab}</span>
                </div>

                {/* Decks Layout */}
                <div className="flex flex-col px-2 mb-10 gap-1">
                    {[...vaultFolders]
                        .sort((a, b) => {
                            if (sortMode === 'count_desc') {
                                return savedWords.filter(w => (w.folder || 'General') === b).length - savedWords.filter(w => (w.folder || 'General') === a).length;
                            } else if (sortMode === 'count_asc') {
                                return savedWords.filter(w => (w.folder || 'General') === a).length - savedWords.filter(w => (w.folder || 'General') === b).length;
                            }
                            return a.localeCompare(b);
                        })
                        .map((folder, idx) => (
                            <div key={folder} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                                {renderDeck(folder, vaultFolders.indexOf(folder))}
                            </div>
                        ))}
                </div>

                {/* Add Folder Section / Floating Action */}
                <div className="flex justify-center mt-4 px-2">
                    {isAdding ? (
                        <div className={`p-4 rounded-[2rem] flex items-center gap-3 w-full animate-slide-up shadow-premium ${isDark ? 'glass-dark border border-slate-700' : 'glass border border-slate-200'}`}>
                            <input
                                autoFocus
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
                                className={`flex-1 px-4 py-3 text-sm font-bold rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 bg-transparent ${isDark ? 'text-white border border-slate-700 placeholder:text-slate-500' : 'text-slate-900 border border-slate-200 placeholder:text-slate-400'}`}
                                placeholder={t.folderNamePlaceholder}
                            />
                            <button onClick={handleAddFolder} className="p-3 bg-indigo-500 text-white rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-md">
                                <Plus size={24} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAdding(true)} className={`w-16 h-16 flex items-center justify-center font-black rounded-full transition-transform hover:scale-110 active:scale-95 shadow-[0_10px_25px_-5px_var(--tw-shadow-color)] shadow-indigo-500/30 ${isDark ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>
                            <Plus size={32} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
