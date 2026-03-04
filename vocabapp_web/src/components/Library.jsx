import React, { useState, useMemo } from 'react';
import { Book, Quote, BookOpen, ChevronRight, X, Languages, Shuffle, Plus, ChevronDown, Feather, LayoutGrid, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { grammarCases, quotes, readingPassages } from '../data/libraryData';

export const Library = ({ isDark, t, onClose }) => {
    const [activeTab, setActiveTab] = useState('cases'); // cases, quotes, reading

    // Drill-down states for Cases
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTitleId, setSelectedTitleId] = useState(null);

    const [randomQuote, setRandomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
    const [readingList, setReadingList] = useState(readingPassages);
    const [showAddReading, setShowAddReading] = useState(false);
    const [newReading, setNewReading] = useState({ title: '', engText: '', trText: '' });

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
            author: 'Kullanıcı',
            difficulty: 'Özel'
        };
        setReadingList([item, ...readingList]);
        setNewReading({ title: '', engText: '', trText: '' });
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

    const categoryList = Object.keys(categories);
    const selectedCaseTitle = useMemo(() => {
        if (!selectedTitleId) return null;
        return grammarCases.find(c => c.id === selectedTitleId);
    }, [selectedTitleId]);

    const resetHierarchy = () => {
        setSelectedCategory(null);
        setSelectedTitleId(null);
    };

    return (
        <div className={`fixed inset-0 z-[600] flex flex-col pt-safe animate-fade-in ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#fcfcfd] text-slate-900'}`}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-transparent shrink-0">
                <div className="flex items-center gap-3">
                    {(selectedCategory || activeTab !== 'cases') ? (
                        <button
                            onClick={() => {
                                if (selectedTitleId) setSelectedTitleId(null);
                                else if (selectedCategory) setSelectedCategory(null);
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
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-indigo-500 dark:text-indigo-400">
                            {selectedTitleId ? selectedCaseTitle?.title : (selectedCategory || 'KÜTÜPHANE')}
                        </h1>
                        <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] -mt-1">
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
                        className="text-[8px] font-black uppercase tracking-widest opacity-40 hover:opacity-100"
                    >
                        CASELER
                    </button>
                    <ChevronRight size={10} className="opacity-20" />
                    <button
                        onClick={() => setSelectedTitleId(null)}
                        className={`text-[8px] font-black uppercase tracking-widest ${!selectedTitleId ? 'text-indigo-500' : 'opacity-40'}`}
                    >
                        {selectedCategory}
                    </button>
                    {selectedTitleId && (
                        <>
                            <ChevronRight size={10} className="opacity-20" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">{selectedCaseTitle?.title}</span>
                        </>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 scrollbar-hide">

                {/* CASES TAB: 3-Level Hierarchy */}
                {activeTab === 'cases' && (
                    <div className="animate-fade-in h-full">

                        {/* LEVEL 1: Category Selection */}
                        {!selectedCategory && (
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                {categoryList.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`p-6 rounded-[2.5rem] border text-left flex items-center justify-between group transition-all hover:scale-[1.02] active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                                    >
                                        <div>
                                            <h4 className="text-xl font-black italic tracking-tighter text-indigo-500 leading-tight">{cat}</h4>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
                                                {categories[cat].length} KONU BAŞLIĞI
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-500/5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <ChevronRight size={20} strokeWidth={3} />
                                        </div>
                                    </button>
                                ))}
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
                                            <h5 className="text-lg font-black tracking-tight text-white dark:text-white dark:opacity-90 light:text-slate-900 leading-tight">{item.title}</h5>
                                            <p className="text-[11px] font-bold opacity-60 mt-1">{item.description}</p>

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
                    <div className="space-y-8 animate-fade-in">
                        <button
                            onClick={() => setShowAddReading(true)}
                            className={`w-full p-8 rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors ${isDark ? 'border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-500' : 'border-slate-200 hover:border-indigo-500/50 hover:bg-slate-50 text-slate-400'}`}
                        >
                            <div className="p-3 rounded-2xl bg-slate-500/10"><Plus size={24} strokeWidth={3} /></div>
                            <span className="text-[11px] font-black uppercase tracking-widest">Kendi Metnini Ekle</span>
                        </button>

                        {readingList.map(passage => (
                            <div
                                key={passage.id}
                                className={`p-10 rounded-[4rem] border flex flex-col gap-8 relative overflow-hidden transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-premium'}`}
                            >
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <BookOpen size={20} className="text-indigo-500" />
                                            <h5 className="font-black text-2xl tracking-tighter text-indigo-500 leading-tight">{passage.title}</h5>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[9px] font-black tracking-widest shadow-sm">BY {passage.author}</div>
                                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black tracking-widest shadow-sm">{passage.difficulty}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <ExampleToggle eng={passage.engText} tr={passage.trText} isDark={isDark} italic={false} longText={true} />
                                </div>
                            </div>
                        ))}
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
                            className={`w-full max-w-md p-10 rounded-[4rem] shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-3xl font-black tracking-tighter">Yeni Okuma</h3>
                                <button onClick={() => setShowAddReading(false)} className="p-3 rounded-2xl bg-slate-500/10"><X size={24} strokeWidth={3} /></button>
                            </div>

                            <div className="space-y-6 mb-10">
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
