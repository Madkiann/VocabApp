
import React, { useState } from 'react';
import { Archive, Trash2, ArrowLeft, Folder, Plus, Move, Sparkles, Bookmark, Heart, History, Search, ArrowDownUp, Pin, X, Lock, BookOpen, Layers, CheckCircle2, ChevronRight, CheckCircle, AlertCircle, List } from 'lucide-react';
import { Mascot } from './Mascot';
import { useVocab } from '../context/VocabContext';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';

export const Vault = ({
    renderCardContent,
    quickTx,
    setQuickTx
}) => {
    const { t, isDark, isAdmin, appLang } = useSettings();
    const { 
        vocab, savedWords, vaultFolders, setVaultFolders, 
        toggleSaveWord, updateWordFolder, deleteVaultFolder, renameVaultFolder 
    } = useVocab();
    const { 
        showVault, setShowVault, swipeLog, activeVaultFolder: activeFolder, setActiveVaultFolder: setActiveFolder,
        selectedVaultWord, setSelectedVaultWord, setIsRevealed, setAppMode, setIsRetryMode
    } = useApp();

    const cardBg = isDark ? 'glass-dark border-transparent shadow-premium' : 'glass border-transparent shadow-premium';

    const [learningTab, setLearningTab] = useState('all'); // 'all', 'success', 'wrong'
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [innerSearchQuery, setInnerSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [sortMode, setSortMode] = useState('alpha');
    const [innerSortMode, setInnerSortMode] = useState('latest');
    const [filterMode, setFilterMode] = useState('all');
    const [editingFolder, setEditingFolder] = useState(null);
    const [editFolderName, setEditFolderName] = useState('');

    const calculateMastery = (sm2) => {
        if (!sm2 || sm2.rep === 0) return 0;
        const mastery = Math.min(100, Math.round((sm2.int / 60) * 100));
        return mastery;
    };

    const handleAddFolder = () => {
        if (newFolderName.trim() && !vaultFolders.includes(newFolderName.trim()) && newFolderName !== 'Learning' && newFolderName !== 'Mastered') {
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

    // System Folders Definitions
    const systemDecks = [
        {
            id: 'Learning',
            title: t.learningSection || 'Learning',
            icon: Layers,
            color: 'from-blue-500 to-indigo-600',
            words: vocab.filter(w => w.sm2.rep > 0 && w.sm2.int < 21)
        },
        {
            id: 'Mastered',
            title: t.masteredSection || 'Mastered',
            icon: CheckCircle2,
            color: 'from-emerald-500 to-teal-600',
            words: vocab.filter(w => w.sm2.int >= 21)
        }
    ];

    // Card Detail View
    if (selectedVaultWord) {
        return (
            <div className={`h-dvh w-full flex flex-col items-center p-4 font-sans transition-all duration-500 pb-32 overflow-y-auto scroll-y overflow-x-hidden relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`} onClick={() => { if (setQuickTx) setQuickTx(prev => ({ ...prev, visible: false })); }}>
                {quickTx.visible && (
                    <div className="fixed z-50 pointer-events-none" style={{ left: `${quickTx.x}px`, top: `${quickTx.y - 12}px` }}>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-5 py-3 bg-indigo-600 text-white text-base font-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.4)] animate-fade-in whitespace-nowrap">
                            {quickTx.text}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-indigo-600" />
                        </div>
                    </div>
                )}
                <div className="absolute top-safe left-6 z-20 mt-6">
                    <button onClick={() => { setSelectedVaultWord(null); setQuickTx(prev => ({ ...prev, visible: false })); }} className={`px-5 py-2.5 rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-premium ${isDark ? 'glass-dark text-slate-300' : 'glass text-slate-700'}`}>
                        <ArrowLeft size={20} /> {t.backToVault || "Geri"}
                    </button>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center w-full mt-10 pb-20">
                    <div className="relative w-full max-w-sm aspect-[3/4]">
                        <div className="absolute -top-16 -right-12 w-32 h-32 pointer-events-none drop-shadow-xl z-20 opacity-80">
                            <Mascot isDark={isDark} size="lg" look="happy" animated={false} isAdmin={isAdmin} />
                        </div>
                        <div className={`absolute inset-0 ${cardBg} rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border ${isDark ? 'border-slate-800' : 'border-slate-200'} p-7 flex flex-col origin-center overflow-hidden animate-fade-in select-none`}>
                            {renderCardContent(selectedVaultWord, true, activeFolder === 'Learning' || activeFolder === 'Mastered')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List of words view
    if (activeFolder !== null) {
        let wordsInFolder = [];
        const isSystem = systemDecks.find(d => d.id === activeFolder);

        if (isSystem) {
            wordsInFolder = isSystem.words;
        } else {
            wordsInFolder = savedWords.filter(w => (w.folder || 'General') === activeFolder);
        }

        if (innerSearchQuery) {
            wordsInFolder = wordsInFolder.filter(w =>
                (w.word || w.eng || "").toLowerCase().includes(innerSearchQuery.toLowerCase()) ||
                (w.trWord && w.trWord.toLowerCase().includes(innerSearchQuery.toLowerCase()))
            );
        }

        if (filterMode !== 'all') {
            wordsInFolder = wordsInFolder.filter(w => (w.pos || "").toLowerCase() === filterMode.toLowerCase());
        }

        if (activeFolder === 'Learning') {
            const correctIds = swipeLog?.correctIds || [];
            const wrongIds = swipeLog?.wrongIds || [];
            if (learningTab === 'success') {
                wordsInFolder = wordsInFolder.filter(w => correctIds.includes(w.id));
            } else if (learningTab === 'wrong') {
                wordsInFolder = wordsInFolder.filter(w => wrongIds.includes(w.id));
            }
        }

        if (innerSortMode === 'alpha') {
            wordsInFolder.sort((a, b) => (a.word || a.eng || "").localeCompare(b.word || b.eng || ""));
        } else if (innerSortMode === 'retention') {
            wordsInFolder.sort((a, b) => calculateMastery(b.sm2) - calculateMastery(a.sm2));
        }

        return (
            <div className={`h-dvh w-full transition-colors duration-500 pb-32 flex flex-col items-center p-4 pt-safe overflow-y-auto scroll-y font-sans ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`}>
                <div className="w-full max-w-md mt-4 animate-fade-in px-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} truncate max-w-[200px]`}>
                                {activeFolder === 'General' ? (t.generalFolder || 'Kasa') : activeFolder}
                            </h2>
                            {isSystem && <Lock size={16} className="opacity-30" />}
                        </div>
                        <button onClick={() => { setActiveFolder(null); setInnerSearchQuery(''); setFilterMode('all'); setLearningTab('all'); }} className={`p-3 rounded-2xl font-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-premium ${isDark ? 'glass-dark text-slate-300' : 'glass text-slate-700'}`}>
                            <X size={20} />
                        </button>
                    </div>

                    {activeFolder === 'Learning' && (
                        <div className={`grid grid-cols-3 gap-2 mb-6 p-1 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
                            {[
                                { id: 'all', icon: List, label: 'Tümü' },
                                { id: 'success', icon: CheckCircle, label: 'Doğru' },
                                { id: 'wrong', icon: AlertCircle, label: 'Yanlış' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setLearningTab(tab.id)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${learningTab === tab.id ? 'bg-indigo-500 text-white shadow-lg scale-[1.02]' : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                                >
                                    <tab.icon size={14} />
                                    <span className="hidden xs:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={`flex items-center gap-3 px-4 py-2.5 mb-6 rounded-2xl shadow-sm border transition-all ${isDark ? 'bg-slate-900/50 border-slate-800 focus-within:border-indigo-500/50' : 'bg-white border-slate-200 focus-within:border-indigo-500/50'}`}>
                        <Search size={16} className="text-slate-500" />
                        <input
                            value={innerSearchQuery}
                            onChange={e => setInnerSearchQuery(e.target.value)}
                            placeholder={t.searchWords}
                            className={`flex-1 bg-transparent border-none outline-none text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
                        />
                        <div className="flex items-center gap-2 border-l border-slate-700/30 pl-3 ml-1">
                            <select
                                value={filterMode}
                                onChange={e => setFilterMode(e.target.value)}
                                className={`bg-transparent outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer max-w-[80px] ${filterMode !== 'all' ? 'text-indigo-500' : 'text-slate-500'}`}
                            >
                                <option value="all">Tip</option>
                                {[...new Set(wordsInFolder.map(w => w.pos).filter(Boolean).map(p => p.toLowerCase()))].sort().map(p => (
                                    <option key={p} value={p}>{p.toUpperCase()}</option>
                                ))}
                            </select>
                            <button onClick={() => setInnerSortMode(prev => prev === 'alpha' ? 'retention' : 'alpha')} className={`transition-colors ${innerSortMode === 'alpha' || innerSortMode === 'retention' ? 'text-indigo-500' : 'text-slate-400'}`} title="Sırala">
                                <ArrowDownUp size={16} />
                            </button>
                        </div>
                    </div>

                    {wordsInFolder.length === 0 ? (
                        <div className={`p-12 mt-4 text-center rounded-[3rem] border-2 border-dashed flex flex-col items-center gap-4 ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            <Archive size={48} className="opacity-20" />
                            <p className="font-bold">{t.vaultEmpty || "Kasa Henüz Boş"}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {wordsInFolder.map(w => {
                                const mastery = calculateMastery(w.sm2);
                                return (
                                    <div key={w.id} onClick={() => { setSelectedVaultWord(w); setIsRevealed(true); }} className={`p-5 rounded-[2rem] flex justify-between items-center shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white border border-slate-100'}`}>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <h3 className={`text-xl font-black tracking-tighter capitalize truncate ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                                    {typeof (w.word || w.eng) === 'object' ? (w.word || w.eng).en : (w.word || w.eng)}
                                                </h3>
                                                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${mastery >= 80 ? 'bg-emerald-500/10 text-emerald-500' : mastery >= 40 ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    %{mastery} Mastered
                                                </div>
                                            </div>
                                            <p className={`text-xs font-semibold truncate ${isDark ? 'opacity-50 text-slate-300' : 'opacity-60 text-slate-600'}`}>
                                                {appLang === 'tr'
                                                    ? (typeof w.trWord === 'object' ? w.trWord.tr : w.trWord)
                                                    : (typeof (w.engDef || w.meaning) === 'object' ? (w.engDef || w.meaning).en : (w.engDef || w.meaning || "").split(';')[0])}
                                            </p>
                                        </div>
                                        {!isSystem && (
                                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                                                <div className="relative group/select z-10 bg-transparent rounded-lg flex items-center justify-center border border-dashed border-slate-400/30">
                                                    <select
                                                        className={`appearance-none bg-transparent outline-none cursor-pointer w-full h-full text-center text-xs font-bold text-transparent absolute inset-0 z-20`}
                                                        value={w.folder || 'General'}
                                                        onClick={e => e.stopPropagation()}
                                                        onChange={(e) => { e.stopPropagation(); updateWordFolder(w.id, e.target.value); }}
                                                    >
                                                        {vaultFolders.map(f => <option key={f} value={f}>{f === 'General' ? t.generalFolder || 'Kasa' : f}</option>)}
                                                    </select>
                                                    <Move size={14} className={`m-2 opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-500'}`} />
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); toggleSaveWord(w); }} className={`p-2 rounded-lg transition-all border border-transparent hover:border-rose-500 hover:text-rose-500 group z-10 relative ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-500'}`}>
                                                    <Trash2 size={14} className="group-hover:animate-shake" />
                                                </button>
                                            </div>
                                        )}
                                        {isSystem && (
                                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                                                <div className={`p-2 rounded-lg opacity-40 transition-all border border-transparent ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Lock size={14} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const renderDeckCard = (folderName, type = 'user', idx = 0) => {
        let count = 0;
        let icon = Folder;
        let colorClasses = "from-blue-500 to-indigo-600";
        let isSystem = type === 'system';
        let progress = 0;

        if (isSystem) {
            const systemDeck = systemDecks.find(d => d.id === folderName);
            count = systemDeck.words.length;
            icon = systemDeck.icon;
            colorClasses = systemDeck.color;
            const mastered = systemDeck.words.filter(w => calculateMastery(w.sm2) >= 80).length;
            progress = count > 0 ? Math.round((mastered / count) * 100) : 0;
        } else {
            const folderWords = savedWords.filter(w => (w.folder || 'General') === folderName);
            count = folderWords.length;
            const folderColors = [
                "from-blue-500 to-indigo-600",
                "from-purple-500 to-indigo-600",
                "from-rose-500 to-pink-600",
                "from-amber-500 to-orange-600",
                "from-cyan-500 to-blue-600"
            ];
            colorClasses = folderColors[idx % folderColors.length];
            if (folderName === 'General') icon = History;
            const mastered = folderWords.filter(w => calculateMastery(w.sm2) >= 80).length;
            progress = count > 0 ? Math.round((mastered / count) * 100) : 0;
        }

        if (searchQuery && !folderName.toLowerCase().includes(searchQuery.toLowerCase())) return null;

        const radius = 22;
        const circ = 2 * Math.PI * radius;
        const offset = circ - (progress / 100) * circ;
        const IconComponent = icon;

        return (
            <div key={folderName} onClick={() => setActiveFolder(folderName)} className={`flex justify-between items-center py-6 px-4 group cursor-pointer border rounded-3xl transition-all duration-300 mb-3 ${isDark ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700' : 'bg-white border-slate-100 hover:shadow-xl hover:border-slate-200'}`}>
                <div className="flex gap-5 items-center">
                    <div className="relative w-14 h-18 perspective-[1000px]">
                        <div className={`absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform origin-bottom`}>
                            <IconComponent size={24} />
                            {isSystem && <div className="absolute -top-1.5 -right-1.5 p-1 bg-white rounded-full text-slate-900 shadow-sm border border-slate-100"><Lock size={8} /></div>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <h4 className={`text-lg font-black tracking-tight leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{folderName === 'General' ? (t.generalFolder || 'Kasa') : folderName}</h4>
                        </div>
                        <p className={`text-[10px] uppercase font-black tracking-[0.15em] opacity-40`}>
                            {count} {t.words || "words"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!isSystem && folderName !== 'General' && (
                        <button onClick={(e) => { e.stopPropagation(); deleteVaultFolder && deleteVaultFolder(folderName); }} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 rounded-xl">
                            <Trash2 size={16} />
                        </button>
                    )}
                    <div className="relative flex items-center justify-center w-[54px] h-[54px] flex-shrink-0">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="27" cy="27" r={radius} stroke="currentColor" strokeWidth="4" fill="none" className={`opacity-10 ${isDark ? 'text-slate-600' : 'text-slate-200'}`} />
                        </svg>
                        {progress > 0 && (
                            <svg className={`absolute inset-0 w-full h-full transform -rotate-90 transition-all duration-1000 ease-out text-indigo-500`}>
                                <circle cx="27" cy="27" r={radius} stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                            </svg>
                        )}
                        <span className={`text-[9px] font-black ${isDark ? 'text-white' : 'text-slate-800 text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-600'}`}>
                            %{progress}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`h-dvh w-full transition-all duration-500 p-4 pt-safe pb-32 overflow-y-auto scroll-y overflow-x-hidden relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`}>
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className={`absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.08] ${isDark ? 'bg-indigo-600' : 'bg-indigo-300'}`}></div>
                <div className={`absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-[0.05] ${isDark ? 'bg-emerald-600' : 'bg-emerald-300'}`}></div>
            </div>

            <div className="w-full max-w-md mx-auto pt-6 animate-fade-in relative z-10 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-1 px-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-sm transition-all duration-300 hover:scale-105`}>
                            <Mascot isDark={isDark} size="md" variant="3d" look="book" animated={true} />
                        </div>
                        <div>
                            <h2 className="text-[2.5rem] font-bold tracking-tighter leading-none mb-1">Library</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Personal Archives</p>
                        </div>
                    </div>
                    <Search size={22} onClick={() => setIsSearching(!isSearching)} className={`cursor-pointer transition-transform hover:scale-110 ${isSearching ? 'text-indigo-500' : 'opacity-40'}`} />
                </div>

                {isSearching && (
                    <div className="mb-6 animate-slide-up">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${isDark ? 'bg-[#1e1e1e] border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <Search size={18} className="opacity-40" />
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search library..."
                                className="flex-1 bg-transparent border-none outline-none text-sm font-semibold"
                            />
                        </div>
                    </div>
                )}

                {/* SYSTEM LIBRARY SECTION */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 opacity-40 px-1">
                        <Lock size={12} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{t.systemLibrary || "System Library"}</h3>
                    </div>
                    {systemDecks.map((deck) => renderDeckCard(deck.id, 'system'))}
                </div>

                {/* PERSONAL ARCHIVES SECTION */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4 opacity-40 px-1">
                        <Bookmark size={12} />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{t.personalArchives || "Personal Archives"}</h3>
                    </div>
                    {renderDeckCard('General', 'user', 0)}
                    {vaultFolders.filter(f => f !== 'General').map((folder, idx) => renderDeckCard(folder, 'user', idx + 1))}

                    {isAdding ? (
                        <div className={`p-4 rounded-3xl flex items-center gap-3 mt-4 animate-slide-up border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
                            <input
                                autoFocus
                                value={newFolderName}
                                onChange={e => setNewFolderName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddFolder()}
                                className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:opacity-30"
                                placeholder="Deck name..."
                            />
                            <button onClick={handleAddFolder} className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-lg">
                                <Plus size={20} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAdding(true)} className={`w-full py-5 rounded-3xl border-2 border-dashed flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-95 mt-4 ${isDark ? 'border-slate-800 text-slate-500 hover:border-slate-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                            <Plus size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">{t.createArchive || "Create Archive"}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
