
import React, { useState, useMemo } from 'react';
import { Book, Quote, BookOpen, ChevronRight, X, Languages, Shuffle, Plus, ChevronDown, Feather, LayoutGrid, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarCases, quotes, readingPassages } from '../data/libraryData';
import { useSettings } from '../context/SettingsContext';
import { useApp } from '../context/AppContext';

export const Library = () => {
    const { isDark, t } = useSettings();
    const { setShowLibrary } = useApp();
    const [activeTab, setActiveTab] = useState('cases'); // cases, quotes, reading

    // Drill-down states for Cases
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTitleId, setSelectedTitleId] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState('core');
    const [expandedCategory, setExpandedCategory] = useState(null);

    const modules = [
        { id: 'core', name: 'İSİMLEŞTİRME & PASİF', description: 'Eylemden kavrama, temel dil sistemi.', color: 'indigo', categories: ['İsimleştirme', 'Pasif & Ettirgen'], icon: LayoutGrid },
        { id: 'architecture', name: 'CÜMLE MİMARİSİ (CLAUSES)', description: 'Yan cümlecikler ve kompleks yapılar.', color: 'emerald', categories: ['Clauses'], icon: BookOpen },
        { id: 'advanced', name: 'KISALTMALAR & EDATLAR', description: 'Akademik akıcılık ve Reduction.', color: 'emerald', categories: ['Kısaltma (Reduction)', 'Prepositions'], icon: Feather },
        { id: 'patterns', name: 'MODALLAR & ÖZEL İFADELER', description: 'Duygu tonlamaları ve özel kalıplar.', color: 'rose', categories: ['Modals', 'Özel Kalıplar'], icon: Quote }
    ];

    const [randomQuote, setRandomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
    const [readingList, setReadingList] = useState(readingPassages);
    const [showAddReading, setShowAddReading] = useState(false);
    const [newReading, setNewReading] = useState({ title: '', engText: '', trText: '', difficulty: 'Beginner' });

    // Reading states
    const [activeReadingLevel, setActiveReadingLevel] = useState('Beginner');

    const readingLevels = [
        { id: 'Beginner', label: 'BAŞLANGIÇ', color: 'emerald', description: 'Temel yapılar ve günlük dil.' },
        { id: 'Intermediate', label: 'ORTA SEVİYE', color: 'indigo', description: 'Akıcı hikayeler ve diyaloglar.' },
        { id: 'Advanced', label: 'İLERİ SEVİYE', color: 'rose', description: 'Akademik ve karmaşık analizler.' }
    ];

    const currentModule = modules.find(m => m.id === activeModuleId);

    const shuffleQuote = () => {
        let next;
        do {
            next = quotes[Math.floor(Math.random() * quotes.length)];
        } while (next === randomQuote && quotes.length > 1);
        setRandomQuote(next);
    };

    const handleAddReading = () => {
        if (!newReading.title || !newReading.engText) return;
        const item = {
            id: Date.now(),
            ...newReading,
            author: 'Kullanıcı'
        };
        setReadingList([item, ...readingList]);
        setNewReading({ title: '', engText: '', trText: '', difficulty: 'Beginner' });
        setShowAddReading(false);
    };

    const categories = useMemo(() => {
        const cats = {};
        grammarCases.forEach(item => {
            if (!cats[item.category]) cats[item.category] = [];
            cats[item.category].push(item);
        });
        return cats;
    }, []);

    const selectedCaseTitle = useMemo(() => {
        if (!selectedTitleId) return null;
        return grammarCases.find(c => c.id === selectedTitleId);
    }, [selectedTitleId]);

    const resetHierarchy = () => {
        setSelectedCategory(null);
        setSelectedTitleId(null);
        setExpandedCategory(null);
    };

    const onClose = () => setShowLibrary(false);

    return (
        <div className={`fixed inset-0 z-[600] flex flex-col pt-safe animate-fade-in ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#fcfcfd] text-slate-900'}`}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-transparent shrink-0">
                <div className="flex items-center gap-3">
                    {(selectedCategory || activeTab !== 'cases') ? (
                        <button
                            onClick={() => {
                                if (selectedTitleId) setSelectedTitleId(null);
                                else if (selectedCategory) {
                                    setSelectedCategory(null);
                                    setExpandedCategory(null);
                                }
                                else setActiveTab('cases');
                            }}
                            className={`p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-indigo-600'}`}
                        >
                            <ArrowLeft size={18} strokeWidth={3} />
                        </button>
                    ) : (
                        <div className="p-2.5 rounded-2xl bg-indigo-500 text-white shadow-glow-indigo text-indigo-100">
                            <Book size={24} strokeWidth={2.5} />
                        </div>
                    )}
                    <div>
                        <h1 className={`text-xl font-black tracking-tighter uppercase italic ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                            {selectedTitleId ? selectedCaseTitle?.title : (selectedCategory || 'KÜTÜPHANE')}
                        </h1>
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] -mt-1 ${isDark ? 'opacity-40' : 'opacity-60 text-slate-500'}`}>
                            {selectedCategory ? 'Vaka Çalışmaları' : 'Referans & Pasif Öğrenme'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2.5 rounded-2xl transition-all hover:rotate-90 active:scale-95 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                >
                    <X size={20} strokeWidth={3} />
                </button>
            </div>

            {/* Main Tabs (Only shown at top level) */}
            {!selectedCategory && (
                <div className="px-4 mt-2 shrink-0">
                    <div className={`flex p-1.5 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#1a1a20]/60 border-slate-800/50' : 'bg-slate-100/80 border-slate-200'}`}>
                        {[
                            { id: 'cases', label: 'CASELER', icon: LayoutGrid },
                            { id: 'quotes', label: 'BİLGELİK', icon: Quote },
                            { id: 'reading', label: 'OKUMA', icon: Feather }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); resetHierarchy(); }}
                                className={`flex-1 flex flex-col items-center py-3 rounded-[2rem] transition-all duration-300 relative ${activeTab === tab.id ? (isDark ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white text-indigo-600 shadow-md') : 'opacity-40 hover:opacity-100'}`}
                            >
                                <tab.icon size={16} strokeWidth={activeTab === tab.id ? 3 : 2} className="mb-1" />
                                <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Breadcrumb Path (Small) */}
            {selectedCategory && (
                <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide shrink-0">
                    <button
                        onClick={() => { setSelectedCategory(null); setSelectedTitleId(null); }}
                        className={`text-[8px] font-black uppercase tracking-widest transition-all ${isDark ? 'opacity-40 hover:opacity-100' : 'text-slate-400 hover:text-indigo-600'}`}
                    >
                        CASELER
                    </button>
                    <ChevronRight size={10} className={isDark ? 'opacity-20' : 'opacity-40'} />
                    <button
                        onClick={() => setSelectedTitleId(null)}
                        className={`text-[8px] font-black uppercase tracking-widest transition-all ${!selectedTitleId ? (isDark ? 'text-indigo-400' : 'text-indigo-600 font-black') : (isDark ? 'opacity-40' : 'text-slate-400')}`}
                    >
                        {selectedCategory}
                    </button>
                    {selectedTitleId && (
                        <>
                            <ChevronRight size={10} className={isDark ? 'opacity-20' : 'opacity-40'} />
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>{selectedCaseTitle?.title}</span>
                        </>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 scrollbar-hide">

                {/* CASES TAB */}
                {activeTab === 'cases' && (
                    <div className="animate-fade-in h-full">

                        {/* HORIZONTAL MODULE SWIPER */}
                        {!selectedCategory && (
                            <div className="mb-10">
                                <div className="flex items-center justify-between px-2 mb-6">
                                    <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'opacity-40' : 'text-slate-400'}`}>ÖĞRENME MODÜLLERİ</h3>
                                    <div className="flex gap-1.5">
                                        {modules.map(m => (
                                            <div key={m.id} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeModuleId === m.id ? 'bg-indigo-500 w-4' : (isDark ? 'bg-slate-800' : 'bg-slate-200')}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x snap-mandatory">
                                    {modules.map(module => (
                                        <button
                                            key={module.id}
                                            onClick={() => { setActiveModuleId(module.id); setExpandedCategory(null); }}
                                            className={`flex-shrink-0 w-[260px] p-8 rounded-[3.5rem] border transition-all snap-center relative overflow-hidden group ${activeModuleId === module.id
                                                ? (isDark ? `bg-indigo-600 border-transparent shadow-glow-indigo text-white` : `bg-indigo-600 border-transparent shadow-xl text-white`)
                                                : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500 shadow-sm')}`}
                                        >
                                            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                                <module.icon size={120} />
                                            </div>
                                            <h3 className="text-xl font-black italic tracking-tighter leading-tight mb-2 truncate">{module.name}</h3>
                                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">{module.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STACKED ACCORDION CATEGORIES */}
                        {!selectedCategory && (
                            <div className="space-y-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] px-2 mb-2 ${isDark ? 'opacity-40' : 'text-slate-400'}`}>KATEGORİLER</h3>
                                <div className="relative">
                                    {currentModule.categories.map((cat, idx) => {
                                        const isExpanded = expandedCategory === cat;
                                        return (
                                            <motion.div
                                                key={cat}
                                                layout
                                                className={`mb-4 overflow-hidden rounded-[3.5rem] border transition-all ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100 shadow-premium'}`}
                                            >
                                                <button
                                                    onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                                                    className="w-full p-8 flex items-center justify-between text-left group"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={`p-4 rounded-3xl transition-all duration-300 ${isExpanded ? 'bg-indigo-500 text-white shadow-glow-indigo scale-110 rotate-6' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400')}`}>
                                                            <LayoutGrid size={22} strokeWidth={2.5} />
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-xl font-black italic tracking-tighter transition-colors ${isExpanded ? 'text-indigo-500' : (isDark ? 'text-white' : 'text-slate-900')}`}>{cat}</h4>
                                                            <p className="text-[9px] font-black opacity-30 uppercase tracking-widest mt-1">
                                                                {categories[cat]?.length || 0} KONU BAŞLIĞI
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        className={`p-2 rounded-xl transition-colors ${isExpanded ? 'text-indigo-500' : 'opacity-20'}`}
                                                    >
                                                        <ChevronDown size={22} strokeWidth={3} />
                                                    </motion.div>
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="px-6 pb-8 space-y-3"
                                                        >
                                                            <div className={`h-px w-full mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                                                            {categories[cat]?.map(item => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => { setSelectedCategory(cat); setSelectedTitleId(item.id); }}
                                                                    className={`w-full p-6 rounded-[2.5rem] flex items-center justify-between text-left transition-all active:scale-95 border ${isDark ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100'}`}
                                                                >
                                                                    <div className="flex-1 pr-4">
                                                                        <h5 className={`text-base font-black tracking-tight leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</h5>
                                                                        <div className="mt-3 flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/60">{item.examples.length} VAKA</span>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronRight size={18} className="text-indigo-500 opacity-40" />
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* LEVEL 2: Title Selection within Category */}
                        {selectedCategory && !selectedTitleId && (
                            <div className="grid grid-cols-1 gap-3 animate-slide-right">
                                {categories[selectedCategory].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedTitleId(item.id)}
                                        className={`p-6 rounded-[2.5rem] border text-left flex items-center justify-between group transition-all hover:scale-[1.01] active:scale-95 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                                    >
                                        <div className="flex-1">
                                            <h5 className={`text-lg font-black tracking-tight leading-tight transition-colors ${isDark ? 'text-indigo-100/90' : 'text-slate-800'}`}>{item.title}</h5>
                                            <p className={`text-[11px] font-bold mt-1 ${isDark ? 'opacity-60' : 'text-slate-500'}`}>{item.description}</p>

                                            <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">{item.examples.length} VAKA MEVCUT</span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-indigo-500/5 group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-500">
                                            <ChevronRight size={18} strokeWidth={3} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* LEVEL 3: Examples List for selected Title */}
                        {selectedTitleId && (
                            <div className="space-y-4 animate-slide-up">
                                <div className="flex items-center gap-3 px-2 mb-6 opacity-30">
                                    <div className="h-px flex-grow bg-current" />
                                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">TOPLAM {selectedCaseTitle?.examples.length} VAKA</span>
                                    <div className="h-px flex-grow bg-current" />
                                </div>

                                {selectedCaseTitle?.examples.map((ex, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-6 rounded-[3rem] border-l-[6px] transition-all ${isDark ? 'bg-slate-900 border-slate-800 border-l-indigo-600 shadow-xl' : 'bg-white border-slate-100 border-l-indigo-500 shadow-md'}`}
                                    >
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-[10px] font-black">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest opacity-30">VAKA ÖRNEĞİ</span>
                                            </div>

                                            <ExampleToggle eng={ex.eng} tr={ex.tr} isDark={isDark} initialTr={true} />

                                            <div className="flex items-start gap-3 mt-2 p-4 rounded-2xl bg-indigo-500/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0 animate-pulse" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-0.5 opacity-60">STRATEJİ / NOT</span>
                                                    <p className="text-[11px] font-bold opacity-70 leading-relaxed italic">{ex.point}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* QUOTES TAB */}
                {activeTab === 'quotes' && (
                    <div className="h-full flex flex-col items-center justify-center px-4 animate-fade-in py-12">
                        <div className={`w-full max-w-sm p-10 rounded-[4rem] border relative overflow-hidden text-center shadow-premium flex flex-col items-center group transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl'}`}>
                            <div className="absolute top-10 left-10 opacity-5 scale-[4] rotate-12 pointer-events-none">
                                <Quote size={40} className="text-indigo-500" />
                            </div>

                            <div className="bg-amber-400 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-glow-amber scale-110">
                                GÜNÜN SÖZÜ
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={randomQuote.text}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="space-y-8"
                                >
                                    <ExampleToggle
                                        eng={randomQuote.text}
                                        tr={randomQuote.trText}
                                        isDark={isDark}
                                        large={true}
                                    />

                                    <div className="flex flex-col items-center mt-8">
                                        <div className="h-1.5 w-12 bg-indigo-500/20 rounded-full mb-4" />
                                        <h6 className="text-2xl font-black italic tracking-tighter text-indigo-500">{randomQuote.author}</h6>
                                        {randomQuote.source && <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] mt-1">{randomQuote.source}</p>}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <button
                                onClick={shuffleQuote}
                                className={`mt-14 w-16 h-16 rounded-3xl flex items-center justify-center transition-all hover:rotate-[120deg] active:scale-95 text-amber-500 ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-50 shadow-sm'}`}
                            >
                                <Shuffle size={28} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}

                {/* READING TAB */}
                {activeTab === 'reading' && (
                    <div className="space-y-10 animate-fade-in h-full flex flex-col">

                        {/* 1. SEVİYE SEÇİMİ (Horizontal Carousel) */}
                        <div className="shrink-0 mb-4 px-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'opacity-40' : 'text-slate-400'}`}>ZORLUK SEVİYESİ</h3>
                                <div className="flex gap-1.5">
                                    {readingLevels.map(rl => (
                                        <div key={rl.id} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeReadingLevel === rl.id ? 'bg-indigo-500 w-4' : (isDark ? 'bg-slate-800' : 'bg-slate-200')}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                                {readingLevels.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => setActiveReadingLevel(level.id)}
                                        className={`flex-shrink-0 w-[240px] p-6 rounded-[3rem] border transition-all snap-center relative overflow-hidden group ${activeReadingLevel === level.id
                                            ? (isDark ? `bg-indigo-600 border-transparent shadow-glow-indigo text-white` : `bg-indigo-600 border-transparent shadow-xl text-white`)
                                            : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500 shadow-sm')}`}
                                    >
                                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                            <Layers size={80} />
                                        </div>
                                        <h3 className="text-lg font-black italic tracking-tighter leading-tight mb-1">{level.label}</h3>
                                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter leading-tight">{level.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. OKUMA LİSTESİ */}
                        <div className="space-y-6 flex-1">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'opacity-40' : 'text-slate-400'} px-2`}>PARÇALAR</h3>

                            {/* ADD NEW BUTTON */}
                            <button
                                onClick={() => setShowAddReading(true)}
                                className={`w-full p-8 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 mb-8 ${isDark ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400' : 'border-indigo-100 bg-indigo-50/30 text-indigo-600'}`}
                            >
                                <Plus size={24} strokeWidth={3} />
                                <span className="text-[11px] font-black uppercase tracking-widest">KENDİ METNİNİ EKLE</span>
                            </button>

                            {readingList.filter(p => p.difficulty === activeReadingLevel).map(passage => (
                                <motion.div
                                    key={passage.id}
                                    layout
                                    className={`p-10 rounded-[4rem] border flex flex-col gap-8 relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-slate-900/40 border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-premium'}`}
                                >
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                                    <BookOpen size={20} strokeWidth={2.5} />
                                                </div>
                                                <h5 className={`font-black text-2xl tracking-tighter leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{passage.title}</h5>
                                            </div>
                                            <div className="flex gap-2 ml-14">
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    BY {passage.author.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 relative z-10 leading-relaxed font-medium">
                                        <ExampleToggle
                                            eng={passage.engText}
                                            tr={passage.trText}
                                            isDark={isDark}
                                            italic={false}
                                            longText={true}
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            {readingList.filter(p => p.difficulty === activeReadingLevel).length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center opacity-40 italic font-bold">
                                    <Sparkles size={40} className="mb-4 text-indigo-500" />
                                    <p className="text-sm">Bu seviyede henüz parça yok.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Reading Modal */}
            <AnimatePresence>
                {showAddReading && (
                    <div className="fixed inset-0 z-[700] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-12" onClick={() => setShowAddReading(false)}>
                        <motion.div
                            initial={{ y: '100%', borderRadius: '4rem 4rem 0 0' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className={`w-full max-w-md p-10 rounded-[4rem] shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-3xl font-black tracking-tighter">Yeni Okuma</h3>
                                <button onClick={() => setShowAddReading(false)} className="p-3 rounded-2xl bg-slate-500/10"><X size={24} strokeWidth={3} /></button>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Zorluk Seviyesi</label>
                                    <div className="flex gap-2">
                                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setNewReading({ ...newReading, difficulty: lvl })}
                                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${newReading.difficulty === lvl ? 'bg-indigo-600 text-white shadow-lg' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')}`}
                                            >
                                                {lvl === 'Beginner' ? 'BAŞLANGIÇ' : lvl === 'Intermediate' ? 'ORTA' : 'İLERİ'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Başlık</label>
                                    <input
                                        type="text"
                                        value={newReading.title}
                                        onChange={e => setNewReading({ ...newReading, title: e.target.value })}
                                        placeholder="Parçanın adı..."
                                        className={`w-full px-6 py-5 rounded-[2rem] border outline-none font-bold placeholder:opacity-30 transition-all focus:border-indigo-500 text-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">İngilizce Metin</label>
                                    <textarea
                                        rows={6}
                                        value={newReading.engText}
                                        onChange={e => setNewReading({ ...newReading, engText: e.target.value })}
                                        placeholder="Metni buraya yazın veya yapıştırın..."
                                        className={`w-full px-6 py-5 rounded-[2.5rem] border outline-none font-bold placeholder:opacity-30 transition-all focus:border-indigo-500 resize-none leading-relaxed ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddReading}
                                className="w-full py-6 rounded-[2.5rem] bg-indigo-600 text-white font-black uppercase tracking-widest text-sm shadow-glow-indigo active:scale-95 transition-all"
                            >
                                ARŞİVE EKLE
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ExampleToggle = ({ eng, tr, isDark, large = false, italic = true, longText = false, initialTr = false }) => {
    const [showAlt, setShowAlt] = useState(false);

    const primaryText = initialTr ? tr : eng;
    const secondaryText = initialTr ? eng : tr;
    const secondaryLabel = initialTr ? 'İNGİLİZCEYE ÇEVİR' : 'TÜRKÇE';

    return (
        <div
            onClick={() => setShowAlt(!showAlt)}
            className={`cursor-pointer group relative select-none`}
        >
            <AnimatePresence mode="wait">
                {!showAlt ? (
                    <motion.div
                        key="primary"
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }}
                        className={`font-bold leading-relaxed ${large ? 'text-2xl tracking-tighter' : (longText ? 'text-lg' : 'text-base')} ${italic ? 'italic' : ''}`}
                    >
                        {primaryText}
                    </motion.div>
                ) : (
                    <motion.div
                        key="secondary"
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }}
                        className={`font-black leading-relaxed transition-colors ${large ? 'text-2xl tracking-tighter text-indigo-500' : (longText ? 'text-lg text-indigo-500' : 'text-base text-indigo-500')} ${italic ? 'italic' : ''}`}
                    >
                        {secondaryText || "Çeviri bulunamadı."}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className={`mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-premium transition-all ${showAlt ? 'bg-indigo-500 text-white opacity-100' : 'bg-slate-500/10 text-indigo-500 group-hover:bg-indigo-500/20'}`}>
                <Languages size={12} />
                {showAlt ? (initialTr ? 'ASIL METIN (TR)' : 'ENGLISH') : secondaryLabel}
            </div>
        </div>
    );
};
