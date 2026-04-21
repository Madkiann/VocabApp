
import React, { useState, useMemo, useEffect } from 'react';
import {
    X, TrendingUp, Settings, Bell, BarChart3,
    ArrowRight, ChevronRight, Zap, AlertCircle,
    User, Brain, Flame, Sparkles, RefreshCw,
    ShieldCheck, Database, Sliders, Clock,
    Terminal, FileText, Lock, Unlock, Power, Activity, MousePointer2, Code, Plus,
    Upload, Download, AlertTriangle, CheckCircle2, Search, Edit, Trash2, Library, SortAsc,
    RotateCcw, ThumbsUp, ThumbsDown, Timer, Layout, Copy, FileCode, Check, Info,
    Bookmark, Wand2, Save, History, FileUp, Volume2, Layers, Target,
    Square, CheckSquare, ListChecks
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';
import { useVocab } from '../context/VocabContext';
import { useVocabStats } from '../hooks/useVocabStats';


export const AdminPanel = ({
    onClose,
    onResetSystem,
    editingWord,
    setEditingWord
}) => {
    const { isDark, appLang, t, sm2Multiplier, setSm2Multiplier, globalAnnouncement, setGlobalAnnouncement, maintenanceMode, setMaintenanceMode } = useSettings();
    const { 
        totalSwipes, difficultWords, hourlySwipes, modeSwipes, rightSwipes, leftSwipes, 
        modeTime, systemLogs, advanceTime, setCustomWords, 
    } = useApp();
    const { computedWords, computedPhrasals, computedChill, deleteWord, jumpToCard, customWords } = useVocab();

    const [activeTab, setActiveTab] = useState(editingWord ? 'cms' : 'insights');
    const [templateInput, setTemplateInput] = useState('');
    const stats = useVocabStats();

    const capitalize = (s) => s ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : '';

    const handleReformSystem = () => {
        if (!window.confirm("Bu işlem tüm özel kelimelerinizi (Custom Words) reforme ederek standart büyük harf formatına getirecektir. Emin misiniz?")) return;
        setCustomWords(prev => prev.map(w => ({
            ...w,
            word: capitalize(w.word || w.eng),
            trWord: capitalize(w.trWord || w.tr),
            engDef: capitalize(w.engDef),
            trDef: capitalize(w.trDef),
            engExample: capitalize(w.engExample),
            trExample: capitalize(w.trExample),
            details: {
                ...(w.details || {}),
                miniCase: capitalize(w.details?.miniCase),
                trMiniCase: capitalize(w.details?.trMiniCase)
            },
            wordFamily: {
                noun: capitalize(w.wordFamily?.noun),
                verb: capitalize(w.wordFamily?.verb),
                adjective: capitalize(w.wordFamily?.adjective),
                adverb: capitalize(w.wordFamily?.adverb)
            }
        })));
        alert("Sistem Veri Reformu Başarıyla Tamamlandı.");
    };

    // Gallery States
    const [gallerySearch, setGallerySearch] = useState('');
    const [galleryMode, setGalleryMode] = useState('words'); // words, phrasal, chill
    const [gallerySort, setGallerySort] = useState('newest'); // a-z, newest
    const [galleryTypeFilter, setGalleryTypeFilter] = useState(null); // new state for POS filter

    // CMS States
    const initialCms = useMemo(() => ({
        eng: editingWord?.word || '',
        tr: editingWord?.trWord || '',
        pos: editingWord?.pos || 'noun',
        posTr: editingWord?.posTr || 'isim',
        phonetic: editingWord?.phonetic || '',
        engDef: editingWord?.engDef || '',
        trDef: editingWord?.trDef || '',
        engEx: editingWord?.engExample || '',
        trEx: editingWord?.trExample || '',
        miniCase: editingWord?.details?.miniCase || '',
        trMiniCase: editingWord?.details?.trMiniCase || '',
        target: editingWord?.targetMode || 'words',
        root: editingWord?.details?.root || editingWord?.details?.origin?.root || '',
        prefix: editingWord?.details?.prefix || editingWord?.details?.origin?.prefix || '',
        suffix: editingWord?.details?.suffix || editingWord?.details?.origin?.suffix || '',
        synonyms: editingWord?.details?.synonyms?.join(', ') || editingWord?.details?.similarWords?.synonyms?.join(', ') || '',
        antonyms: editingWord?.details?.antonyms?.join(', ') || editingWord?.details?.similarWords?.antonyms?.join(', ') || '',
        forms: editingWord?.wordForms ? JSON.stringify(editingWord.wordForms, null, 2) : '[]',
        noun: editingWord?.wordFamily?.noun || '',
        verb: editingWord?.wordFamily?.verb || '',
        adjective: editingWord?.wordFamily?.adjective || '',
        adverb: editingWord?.wordFamily?.adverb || '',
        moreExJson: editingWord?.details?.moreExamples ? JSON.stringify(editingWord.details.moreExamples, null, 2) : '[]',
        trMiniCaseEx: editingWord?.details?.trMiniCaseExamples ? JSON.stringify(editingWord.details.trMiniCaseExamples, null, 2) : '[]'
    }), [editingWord]);

    const [cmsDraft, setCmsDraft] = useState(initialCms);

    useEffect(() => {
        if (editingWord) {
            setCmsDraft(initialCms);
            setActiveTab('cms');
        }
    }, [editingWord, initialCms]);

    const handleCmsAction = (e) => {
        e.preventDefault();
        let formsObj = [];
        try { formsObj = JSON.parse(cmsDraft.forms); } catch (e) { console.error("Invalid Forms JSON"); }

        let moreExParsed = [];
        try { moreExParsed = JSON.parse(cmsDraft.moreExJson); } catch (e) { console.error("Invalid moreExamples JSON"); }

        let trMiniCaseExParsed = [];
        try { trMiniCaseExParsed = JSON.parse(cmsDraft.trMiniCaseEx || '[]'); } catch (e) { console.error("Invalid trMiniCaseExamples JSON"); }

        const processedWord = {
            id: editingWord ? editingWord.id : ('custom-' + Date.now()),
            word: capitalize(cmsDraft.eng),
            trWord: capitalize(cmsDraft.tr),
            pos: cmsDraft.pos || 'noun',
            posTr: cmsDraft.posTr || 'isim',
            phonetic: cmsDraft.phonetic,
            engDef: capitalize(cmsDraft.engDef),
            trDef: capitalize(cmsDraft.trDef),
            engExample: capitalize(cmsDraft.engEx),
            trExample: capitalize(cmsDraft.trEx),
            targetMode: cmsDraft.target,
            wordForms: formsObj,
            details: {
                origin: {
                    root: capitalize(cmsDraft.root),
                    prefix: cmsDraft.prefix,
                    suffix: cmsDraft.suffix,
                },
                synonyms: cmsDraft.synonyms.split(',').map(s => capitalize(s.trim())).filter(Boolean),
                antonyms: cmsDraft.antonyms.split(',').map(s => capitalize(s.trim())).filter(Boolean),
                caseExamples: moreExParsed,
                miniCase: capitalize(cmsDraft.miniCase),
                trMiniCase: capitalize(cmsDraft.trMiniCase)
            },
            wordFamily: {
                noun: capitalize(cmsDraft.noun),
                verb: capitalize(cmsDraft.verb),
                adjective: capitalize(cmsDraft.adjective),
                adverb: capitalize(cmsDraft.adverb)
            },
            sm2: editingWord ? editingWord.sm2 : { rep: 0, int: 1, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0 },
            createdAt: editingWord?.createdAt || new Date().toISOString(),
            syncToChill: true
        };

        setCustomWords(prev => {
            const next = [...prev];
            const existingIdx = next.findIndex(w =>
                w.id === processedWord.id ||
                (w.word.toLowerCase() === processedWord.word.toLowerCase() && w.targetMode === processedWord.targetMode)
            );

            if (existingIdx > -1) {
                const existing = next[existingIdx];
                next[existingIdx] = {
                    ...existing,
                    ...processedWord,
                    id: existing.id,
                    details: {
                        ...(existing.details || {}),
                        ...(processedWord.details || {}),
                        origin: { ...(existing.details?.origin || {}), ...(processedWord.details?.origin || {}) },
                        similarWords: { ...(existing.details?.similarWords || {}), ...(processedWord.details?.similarWords || {}) }
                    },
                    wordFamily: {
                        ...(existing.wordFamily || {}),
                        ...(processedWord.wordFamily || {})
                    }
                };
            } else {
                next.unshift(processedWord);
            }
            return next;
        });

        setEditingWord(null);
        setCmsDraft({
            eng: '', tr: '', pos: 'noun', posTr: 'isim', phonetic: '',
            engDef: '', trDef: '', engEx: '', trEx: '',
            miniCase: '', trMiniCase: '', trMiniCaseEx: '[]', target: 'words',
            root: '', prefix: '', suffix: '', synonyms: '', antonyms: '', forms: '[]',
            noun: '', verb: '', adjective: '', adverb: '', moreExJson: '[]'
        });
        alert(`Artifact "${processedWord.word}" Has Been Injected & Synchronized.`);
    };

    const mostPopularMode = useMemo(() => {
        const entries = Object.entries(modeSwipes || {});
        if (entries.length === 0) return 'None';
        return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    }, [modeSwipes]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const handleApplyTemplate = (data) => {
        try {
            const parsed = JSON.parse(data);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            
            if (items.length > 1) {
                // Batch Ingestion Flow
                const processedItems = items.map(item => {
                    const isPhrasal = item.targetMode === 'Phrasal Verbs' || item.pos === 'phrasal verb' || item.posTr === 'deyimsel fiil' || item.targetMode === 'phrasal';
                    const examples = item.details?.caseExamples || item.details?.moreExamples || item.details?.trMiniCaseExamples || item.caseExamples || [];
                    
                    return {
                        id: item.id || `${isPhrasal ? 'pv' : 'word'}_batch_${Math.random().toString(36).substr(2, 9)}`,
                        word: capitalize(item.word || ''),
                        trWord: capitalize(item.trWord || ''),
                        pos: item.pos || item.type || (isPhrasal ? 'phrasal verb' : 'noun'),
                        posTr: item.posTr || (isPhrasal ? 'deyimsel fiil' : 'isim'),
                        phonetic: item.phonetic || '',
                        engDef: capitalize(item.engDef || ''),
                        trDef: capitalize(item.trDef || ''),
                        engExample: capitalize(item.engExample || item.engEx || ''),
                        trExample: capitalize(item.trExample || item.trEx || ''),
                        targetMode: isPhrasal ? 'Phrasal Verbs' : 'words',
                        details: {
                            synonyms: Array.isArray(item.details?.synonyms || item.details?.similarWords?.synonyms) ? (item.details?.synonyms || item.details?.similarWords?.synonyms) : [],
                            antonyms: Array.isArray(item.details?.antonyms || item.details?.similarWords?.antonyms) ? (item.details?.antonyms || item.details?.similarWords?.antonyms) : [],
                            origin: item.details?.origin || { root: '', prefix: '', suffix: '' },
                            caseExamples: examples,
                            miniCase: capitalize(item.details?.miniCase || ''),
                            trMiniCase: capitalize(item.details?.trMiniCase || '')
                        },
                        wordFamily: item.wordFamily || {},
                        sm2: { rep: 0, int: 1, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0 },
                        createdAt: new Date().toISOString(),
                        syncToChill: true
                    };
                });

                setCustomWords(prev => {
                    let next = [...prev];
                    processedItems.forEach(newItem => {
                        const idx = next.findIndex(w => w.word.toLowerCase() === newItem.word.toLowerCase() && w.targetMode === newItem.targetMode);
                        if (idx > -1) next[idx] = { ...next[idx], ...newItem };
                        else next.unshift(newItem);
                    });
                    return next;
                });
                alert(`${items.length} artifacts have been batch-injected into the core memory.`);
                setActiveTab('gallery');
            } else if (items.length === 1) {
                // Single Item Form-Filling Flow
                const item = items[0];
                const isPhrasal = item.targetMode === 'Phrasal Verbs' || item.pos === 'phrasal verb' || item.posTr === 'deyimsel fiil' || item.targetMode === 'phrasal';
                const cleanTarget = isPhrasal ? 'phrasal' : 'words';
                const examples = item.details?.caseExamples || item.details?.moreExamples || item.details?.trMiniCaseExamples || item.caseExamples || [];

                setCmsDraft({
                    eng: capitalize(item.word || ''),
                    tr: capitalize(item.trWord || ''),
                    pos: item.pos || item.type || (isPhrasal ? 'phrasal verb' : 'noun'),
                    posTr: item.posTr || (isPhrasal ? 'deyimsel fiil' : 'isim'),
                    phonetic: item.phonetic || '',
                    engDef: capitalize(item.engDef || ''),
                    trDef: capitalize(item.trDef || ''),
                    engEx: capitalize(item.engExample || item.engEx || ''),
                    trEx: capitalize(item.trExample || item.trEx || ''),
                    miniCase: capitalize(item.details?.miniCase || ''),
                    trMiniCase: capitalize(item.details?.trMiniCase || ''),
                    target: cleanTarget,
                    root: item.details?.origin?.root || item.details?.root || '',
                    prefix: item.details?.origin?.prefix || item.details?.prefix || '',
                    suffix: item.details?.origin?.suffix || item.details?.suffix || '',
                    synonyms: Array.isArray(item.details?.synonyms || item.details?.similarWords?.synonyms) ? (item.details?.synonyms || item.details?.similarWords?.synonyms).join(', ') : '',
                    antonyms: Array.isArray(item.details?.antonyms || item.details?.similarWords?.antonyms) ? (item.details?.antonyms || item.details?.similarWords?.antonyms).join(', ') : '',
                    noun: item.wordFamily?.noun || '',
                    verb: item.wordFamily?.verb || '',
                    adjective: item.wordFamily?.adjective || '',
                    adverb: item.wordFamily?.adverb || '',
                    moreExJson: JSON.stringify(examples, null, 2)
                });
                setActiveTab('cms');
            }
        } catch (e) {
            console.error("Template parse failed for core sync", e);
            alert("Sync Failed: JSON format is invalid.");
        }
    };

    const [promptWord, setPromptWord] = useState('');
    const [promptMode, setPromptMode] = useState('words'); // words or phrasal
    const [copySuccess, setCopySuccess] = useState(false);

    const generatePrompt = () => {
        if (!promptWord) return;
        const words = promptWord.split(',').map(w => w.trim()).filter(Boolean);
        const isMultiple = words.length > 1;
        
        const coreSchema = promptMode === 'words' 
            ? `{
      "id": "unique_id",
      "word": "Word",
      "trWord": "Çeviri",
      "phonetic": "/.../",
      "pos": "noun/verb/...",
      "posTr": "isim/fiil/...",
      "engDef": "Definition",
      "trDef": "Tanım",
      "engExample": "Context sentence",
      "trExample": "Cümle çevirisi",
      "details": {
        "synonyms": [], "antonyms": [],
        "origin": { "root": "", "prefix": "", "suffix": "" },
        "caseExamples": [
          { "tr": "Vaka örneği 1", "en": "Case example 1" },
          { "tr": "Vaka örneği 2", "en": "Case example 2" }
        ]
      },
      "wordFamily": { "noun": "", "verb": "", "adjective": "", "adverb": "" }
    }`
            : `{
      "id": "unique_id",
      "word": "Phrasal Verb",
      "trWord": "Çeviri",
      "phonetic": "/.../",
      "pos": "phrasal verb",
      "posTr": "deyimsel fiil",
      "targetMode": "Phrasal Verbs",
      "engDef": "Definition",
      "trDef": "Tanım",
      "engExample": "Context sentence",
      "trExample": "Cümle çevirisi",
      "details": {
        "miniCase": "A short, engaging mini story using the phrasal verb to make it memorable",
        "trMiniCase": "Mini story'nin Türkçe çevirisi",
        "caseExamples": [
          { "tr": "Vaka örneği 1", "en": "Case example 1" },
          { "tr": "Vaka örneği 2", "en": "Case example 2" }
        ]
      }
    }`;

        const prompt = promptMode === 'words'
            ? `Act as an Expert Lexicographer. I need high-quality vocabulary data for the following ${words.length} items: ${words.join(', ')}.

Return ONLY a RAW JSON ${isMultiple ? 'ARRAY of objects' : 'OBJECT'} following this EXACT schema for each item:
${coreSchema}

Rules:
1. ${isMultiple ? 'Return a single JSON ARRAY containing all objects.' : 'Return one JSON object.'}
2. Ensure high-quality context sentences and academic definitions.
3. Completely fill "wordFamily" (noun, verb, adj, adv forms if they exist).
4. Provide at least 2 strong "caseExamples" (with EN and TR mapping).`
            : `Act as a Specialist in English Phrasal Verbs. I need high-quality data for the following ${words.length} items: ${words.join(', ')}.

Return ONLY a RAW JSON ${isMultiple ? 'ARRAY of objects' : 'OBJECT'} following this EXACT schema for each item:
${coreSchema}

Rules:
1. ${isMultiple ? 'Return a single JSON ARRAY containing all objects.' : 'Return one JSON object.'}
2. Ensure natural context sentences and clear definitions.
3. For "miniCase", write a short, engaging mini story that makes the phrasal verb easy to remember.
4. Provide at least 2 strong "caseExamples" (with EN and TR mapping).`;

        navigator.clipboard.writeText(prompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };


    const galleryList = useMemo(() => {
        let list = [];
        if (galleryMode === 'words') list = computedWords;
        else if (galleryMode === 'phrasal') list = computedPhrasals;
        else if (galleryMode === 'chill') list = computedChill;

        let filtered = list.filter(w => {
            const matchesSearch = (w.word || w.eng || '').toLowerCase().includes(gallerySearch.toLowerCase()) ||
                                 (w.trWord || w.tr || '').toLowerCase().includes(gallerySearch.toLowerCase());
            
            const currentPos = w.posTr || (w.pos === 'noun' ? 'isim' : w.pos === 'verb' ? 'fiil' : w.pos === 'adjective' ? 'sıfat' : w.pos === 'adverb' ? 'zarf' : w.pos) || 'Diğer';
            const matchesType = !galleryTypeFilter || currentPos === galleryTypeFilter;

            return matchesSearch && matchesType;
        });

        if (gallerySort === 'a-z') {
            filtered.sort((a, b) => (a.word || a.eng).localeCompare(b.word || b.eng));
        } else {
            filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return filtered;
    }, [galleryMode, gallerySearch, gallerySort, galleryTypeFilter, computedWords, computedPhrasals, computedChill]);

    // Gallery Stats Calculation
    const galleryStats = useMemo(() => {
        const stats = {};
        galleryList.forEach(w => {
            const p = w.posTr || (w.pos === 'noun' ? 'isim' : w.pos === 'verb' ? 'fiil' : w.pos === 'adjective' ? 'sıfat' : w.pos === 'adverb' ? 'zarf' : w.pos) || 'Diğer';
            stats[p] = (stats[p] || 0) + 1;
        });
        return Object.entries(stats).sort((a, b) => b[1] - a[1]);
    }, [galleryList]);

    const handleJumpToCard = (id) => {
        jumpToCard(id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#050506]/95 backdrop-blur-2xl animate-fade-in font-sans text-white">
            {/* Premium Admin Header */}
            <div className={`p-8 pt-12 flex items-center justify-between border-b ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-xl opacity-20 animate-pulse" />
                        <ShieldCheck size={32} className="text-amber-400 relative z-10" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adminTitle || 'COMMAND CENTER'}</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">System Online • v3.0.4</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-3 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                {/* Modern Navigation Tabs */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-[1.2rem] overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'insights', label: 'ANALYTICS', icon: BarChart3 },
                        { id: 'cms', label: 'FORGE', icon: Wand2 },
                        { id: 'templater', label: 'AI TOOLS', icon: Sparkles },
                        { id: 'gallery', label: 'VAULT', icon: Library },
                        { id: 'settings', label: 'CORE', icon: Settings }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-[0.8rem] text-[10px] font-black tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'bg-amber-400 text-black shadow-[0_8px_20px_rgba(251,191,36,0.2)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <tab.icon size={14} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'insights' && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'TOTAL SWIPES', val: totalSwipes, color: 'text-white' },
                                { label: 'RETENTION', val: `%${stats.globalRetention}`, color: 'text-emerald-400' },
                                { label: 'LEARNED', val: stats.learnedCount, color: 'text-indigo-400' },
                                { label: 'DIFFICULTY', val: difficultWords.length, color: 'text-amber-400' }
                            ].map((s, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 group hover:border-amber-400/30 transition-all">
                                    <p className="text-[10px] opacity-40 font-black mb-2 uppercase tracking-widest">{s.label}</p>
                                    <p className={`text-4xl font-black ${s.color} transition-transform group-hover:scale-110 duration-500`}>{s.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Brain size={80} />
                                </div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
                                    <Activity size={14} className="text-indigo-400" />
                                    BRAIN SYNC DISTRIBUTION
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Stranger', count: stats.bondStats.stranger, color: 'bg-slate-500' },
                                        { label: 'Acquaintance', count: stats.bondStats.acquaintance, color: 'bg-indigo-500' },
                                        { label: 'Confidant', count: stats.bondStats.confidant, color: 'bg-purple-500' },
                                        { label: 'Companion', count: stats.bondStats.companion, color: 'bg-amber-400 text-black' }
                                    ].map((b, i) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between px-1">
                                                <span className="text-[10px] font-black uppercase opacity-60">{b.label}</span>
                                                <span className="text-xs font-black">{b.count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${b.color.split(' ')[0]} transition-all duration-1000`} 
                                                    style={{ width: `${(b.count / (totalSwipes || 1)) * 100}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-amber-400/5 border border-amber-400/10">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
                                    <Target size={14} className="text-amber-400" />
                                    ENGAGEMENT METRICS
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Flame size={18} className="text-orange-500" />
                                            <span className="text-xs font-bold opacity-70">Popular Mode</span>
                                        </div>
                                        <span className="text-sm font-black uppercase text-amber-400 tracking-wider font-mono">{mostPopularMode}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Clock size={18} className="text-indigo-400" />
                                            <span className="text-xs font-bold opacity-70">Focus Time</span>
                                        </div>
                                        <span className="text-sm font-black text-white">{formatTime(modeTime[galleryMode] || 0)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                            <span className="text-xs font-bold opacity-70">Accuracy Rate</span>
                                        </div>
                                        <span className="text-sm font-black text-emerald-400 font-mono">
                                            %{Math.round((rightSwipes / (totalSwipes || 1)) * 100)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-8 animate-slide-up">
                        {/* Type Distribution Explorer */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h5 className="text-[11px] font-black italic uppercase tracking-[0.3em] opacity-40">Type Distribution</h5>
                                {galleryTypeFilter && (
                                    <button 
                                        onClick={() => setGalleryTypeFilter(null)}
                                        className="text-[9px] font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full hover:bg-amber-400 hover:text-black transition-all flex items-center gap-2"
                                    >
                                        CLEAR FILTER ({galleryTypeFilter})
                                        <X size={10} />
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                {galleryStats.map(([type, count]) => (
                                    <button 
                                        key={type} 
                                        onClick={() => setGalleryTypeFilter(galleryTypeFilter === type ? null : type)}
                                        className="flex-none snap-start group outline-none"
                                    >
                                        <div className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-2 min-w-[100px] ${galleryTypeFilter === type ? 'bg-amber-400 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50'}`}>
                                            <span className={`text-2xl font-black transition-transform duration-500 ${galleryTypeFilter === type ? 'text-black' : 'text-amber-400 group-hover:scale-125'}`}>{count}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${galleryTypeFilter === type ? 'text-black/60' : 'opacity-40'}`}>{type}</span>
                                        </div>
                                    </button>
                                ))}
                                {galleryStats.length === 0 && (
                                    <p className="text-xs opacity-40 italic py-4">Filtreye uygun veri bulunamadı...</p>
                                )}
                            </div>
                        </div>

                        <div className="sticky top-0 z-20 bg-[#0c0c0e]/80 backdrop-blur-md py-4 -mx-2 px-2 flex flex-col gap-6">
                             {/* Enhanced Control Bar */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative group">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={20} />
                                    <input 
                                        value={gallerySearch}
                                        onChange={(e) => setGallerySearch(e.target.value)}
                                        placeholder="Vault Search..."
                                        className="w-full bg-black/40 pl-14 pr-6 py-4 rounded-[1.5rem] border border-white/10 outline-none focus:border-amber-400 focus:bg-black/60 transition-all text-sm font-medium"
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <div className="flex p-1.5 rounded-[1.5rem] bg-white/5 border border-white/10">
                                        {['words', 'phrasal', 'chill'].map(m => (
                                            <button 
                                                key={m} 
                                                onClick={() => setGalleryMode(m)}
                                                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${galleryMode === m ? 'bg-indigo-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => setGallerySort(gallerySort === 'a-z' ? 'newest' : 'a-z')}
                                        className={`flex items-center gap-3 px-6 rounded-[1.5rem] border transition-all ${gallerySort === 'a-z' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{gallerySort === 'a-z' ? 'A-Z' : 'NEWEST'}</span>
                                        {gallerySort === 'a-z' ? <SortAsc size={18} /> : <Clock size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galleryList.slice(0, 100).map(w => (
                                <div 
                                    key={w.id} 
                                    className="p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 flex flex-col justify-between gap-4 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all group relative overflow-hidden active:scale-95 cursor-pointer"
                                    onClick={() => handleJumpToCard(w.id)}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <ArrowRight size={20} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-xl tracking-tight group-hover:text-amber-400 transition-colors">{w.word || w.eng}</h3>
                                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase tracking-widest opacity-40">{w.pos || 'UNK'}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 line-clamp-1">{w.trWord || w.tr}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">{w.posTr || 'Tanımsız'}</span>
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <button 
                                                onClick={() => setEditingWord(w)} 
                                                className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button 
                                                onClick={() => window.confirm(`${w.word} yok edilecek. Onaylıyor musun?`) && deleteWord(w.id)} 
                                                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-inner"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {galleryList.length > 100 && (
                                <div className="col-span-full p-8 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                                    <p className="text-[11px] opacity-30 font-black uppercase tracking-[0.4em]">Sadece ilk 100 sonuç gösteriliyor • Kalan: {galleryList.length - 100}</p>
                                </div>
                            )}
                            {galleryList.length === 0 && (
                                <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-30">
                                    <Database size={48} />
                                    <p className="font-black uppercase tracking-widest text-xs">Arama sonucu boş</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'cms' && (
                    <div className="max-w-4xl mx-auto space-y-12 animate-slide-up pb-20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase">{editingWord ? 'Refining Artifact' : 'Forging New Data'}</h3>
                                <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">System Memory Injection Unit</p>
                            </div>
                            {editingWord && (
                                <button onClick={() => setEditingWord(null)} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-black text-[10px] uppercase tracking-widest">Discard Edit</button>
                            )}
                        </div>

                        <form onSubmit={handleCmsAction} className="space-y-10">
                            {/* Forge Section: Core */}
                            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/[0.07] to-transparent border border-indigo-500/20 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Activity size={20} className="text-white" />
                                    </div>
                                    <h5 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Linguistic Nucleus</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Target Language (ENG)</label>
                                        <input value={cmsDraft.eng} onChange={e => setCmsDraft({...cmsDraft, eng: e.target.value})} placeholder="e.g. Resilient" className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-indigo-400 outline-none transition-all font-bold" required />
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Equivalent (TR)</label>
                                        <input value={cmsDraft.tr} onChange={e => setCmsDraft({...cmsDraft, tr: e.target.value})} placeholder="e.g. Dayanıklı" className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-indigo-400 outline-none transition-all font-bold" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">POS</label>
                                        <input value={cmsDraft.pos} onChange={e => setCmsDraft({...cmsDraft, pos: e.target.value})} placeholder="Adjective" className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-indigo-400 outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">POS TR</label>
                                        <input value={cmsDraft.posTr} onChange={e => setCmsDraft({...cmsDraft, posTr: e.target.value})} placeholder="Sıfat" className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-indigo-400 outline-none transition-all font-bold" />
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Phonetic</label>
                                        <input value={cmsDraft.phonetic} onChange={e => setCmsDraft({...cmsDraft, phonetic: e.target.value})} placeholder="/rɪˈzɪl.i.ənt/" className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-indigo-400 outline-none transition-all font-mono text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-2 px-1">
                                    <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Injection Vector</label>
                                    <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
                                        {['words', 'phrasal'].map(v => (
                                            <button 
                                                key={v}
                                                type="button"
                                                onClick={() => setCmsDraft({...cmsDraft, target: v})}
                                                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${cmsDraft.target === v ? 'bg-white text-black' : 'opacity-40 hover:opacity-100'}`}
                                            >
                                                {v === 'words' ? 'VOCABULARY MEMORY' : 'PHRASAL INTERFACE'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Forge Section: Context */}
                            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-400/[0.05] to-transparent border border-amber-400/20 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30 text-black">
                                        <Brain size={20} />
                                    </div>
                                    <h5 className="text-xs font-black uppercase tracking-[0.3em] opacity-60">Contextual Matrix</h5>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Global Definition (ENG)</label>
                                        <textarea value={cmsDraft.engDef} onChange={e => setCmsDraft({...cmsDraft, engDef: e.target.value})} placeholder="Comprehensive meaning..." className="w-full h-24 bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-amber-400 outline-none transition-all leading-relaxed" />
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Localized Meaning (TR)</label>
                                        <textarea value={cmsDraft.trDef} onChange={e => setCmsDraft({...cmsDraft, trDef: e.target.value})} placeholder="Detaylı karşılığı..." className="w-full h-24 bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-amber-400 outline-none transition-all leading-relaxed" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Live Example (ENG)</label>
                                        <textarea value={cmsDraft.engEx} onChange={e => setCmsDraft({...cmsDraft, engEx: e.target.value})} placeholder="Sentence usage..." className="w-full h-20 bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-amber-400 outline-none transition-all leading-relaxed" />
                                    </div>
                                    <div className="space-y-2 px-1">
                                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest ml-1">Live Translation (TR)</label>
                                        <textarea value={cmsDraft.trEx} onChange={e => setCmsDraft({...cmsDraft, trEx: e.target.value})} placeholder="Cümle çevirisi..." className="w-full h-20 bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-amber-400 outline-none transition-all leading-relaxed" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-8">
                                <div className="max-w-4xl w-full flex gap-4">
                                    <button type="submit" className="flex-1 py-5 rounded-[1.5rem] bg-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-2xl shadow-amber-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                        <Plus size={18} />
                                        {editingWord ? 'UPDATE ARTIFACT' : 'INJECT INTO SYSTEM'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'templater' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-20">
                         {/* AI Forge Assistant */}
                         <div className="p-10 rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 relative overflow-hidden group">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-1000" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter">AI PROMPT ARCHITECT</h4>
                                    <div className="flex gap-4 mt-2">
                                        {['words', 'phrasal'].map(m => (
                                            <button 
                                                key={m}
                                                onClick={() => setPromptMode(m)}
                                                className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border transition-all ${promptMode === m ? 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/30' : 'border-white/10 text-slate-500 hover:text-white'}`}
                                            >
                                                {m === 'words' ? 'Standard Vocab' : 'Phrasal Interface'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="relative">
                                    <input 
                                        value={promptWord}
                                        onChange={(e) => setPromptWord(e.target.value)}
                                        placeholder={promptMode === 'words' ? "Target Lexeme (e.g. Ephemeral)" : "Target Phrasal (e.g. Get along)"}
                                        className="w-full bg-black/40 p-6 rounded-2xl border border-white/10 outline-none focus:border-purple-400 font-bold transition-all text-lg"
                                    />
                                    <button 
                                        onClick={generatePrompt}
                                        disabled={!promptWord}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copySuccess ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-xl shadow-purple-900/40 active:scale-95'}`}
                                    >
                                        {copySuccess ? 'COPIED TO CLIPBOARD' : 'EXTRACT PROMPT'}
                                    </button>
                                </div>
                                <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
                                    <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">
                                        "Bu araç, Gemini veya diğer LLM'ler için optimize edilmiş bir komut seti oluşturur. Kopyaladıktan sonra yapay zekaya yapıştırın ve gelen JSON çıktısını aşağıdaki üniteye aktarın."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Artifact Synchronizer */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden group">
                             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />
                             <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                                    <Database size={24} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter">ARTIFACT SYNCHRONIZER</h4>
                                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">Pure JSON Ingestion Flow</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <textarea 
                                    value={templateInput}
                                    onChange={(e) => setTemplateInput(e.target.value)}
                                    placeholder='Paste AI-Generated JSON here...' 
                                    className="w-full h-64 bg-black/60 p-6 rounded-[2rem] border border-white/10 font-mono text-[11px] outline-none focus:border-indigo-400 transition-all scrollbar-hide focus:bg-black/80"
                                />
                                <button 
                                    onClick={() => { handleApplyTemplate(templateInput); setTemplateInput(''); }}
                                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/30 active:scale-[0.98] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                                >
                                    <RefreshCw size={18} />
                                    SYNC WITH CORE MEMORY
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
                        <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">SYSTEM MODIFIERS</h4>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={() => handleReformSystem()}
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/40 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                                            <RefreshCw size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest">Global Data Reform</p>
                                            <p className="text-[10px] opacity-40 font-bold uppercase">Uppercase Synchronization</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => advanceTime()}
                                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-400/40 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                            <Clock size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest">Time Simulation</p>
                                            <p className="text-[10px] opacity-40 font-bold uppercase">Advance system +24H</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                                
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest">Maintenance Mode</p>
                                            <p className="text-[10px] opacity-40 font-bold uppercase">Security Lockdown</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${maintenanceMode ? 'bg-orange-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-10 rounded-[3rem] bg-rose-500/5 border border-rose-500/10 space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 opacity-60 mb-2">CRITICAL DISRUPTION ZONE</h4>
                            <button 
                                onClick={onResetSystem}
                                className="w-full py-5 bg-rose-600/10 text-rose-500 border border-rose-600/30 hover:bg-rose-600 hover:text-white font-black rounded-[1.5rem] text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-rose-900/10 transition-all active:scale-95"
                            >
                                FACTORY RESET MEMORY CORE
                            </button>
                            <p className="text-[9px] text-center opacity-30 font-bold uppercase leading-relaxed px-4">Warning: This action is irreversible and will purge all local artifacts and user session data from the environment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
