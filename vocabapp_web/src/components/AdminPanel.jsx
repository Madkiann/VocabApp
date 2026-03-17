import React, { useState, useMemo } from 'react';
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

export const AdminPanel = ({
    isDark,
    appLang,
    t,
    onClose,
    stats,
    difficultWords = [],
    hourlySwipes = [],
    modeSwipes = { words: 0, chill: 0, phrasal: 0, quiz: 0 },
    rightSwipes = { words: 0, chill: 0, phrasal: 0, quiz: 0 },
    leftSwipes = { words: 0, chill: 0, phrasal: 0, quiz: 0 },
    modeTime = { words: 0, chill: 0, phrasal: 0, quiz: 0 },
    sm2Multiplier,
    setSm2Multiplier,
    globalAnnouncement,
    setGlobalAnnouncement,
    advanceTime,
    systemLogs = [],
    maintenanceMode,
    setMaintenanceMode,
    customWords,
    setCustomWords,
    editingWord,
    setEditingWord,
    allWords = [],
    allPhrasals = [],
    allChill = [],
    onEditWord,
    onDeleteWord,
    onJumpToCard,
    onResetSystem
}) => {
    const [activeTab, setActiveTab] = useState(editingWord ? 'cms' : 'insights');
    const [bannerDraft, setBannerDraft] = useState(globalAnnouncement || '');

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
    const [galleryFilter, setGalleryFilter] = useState('all'); // POS Filter
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedCardIds, setSelectedCardIds] = useState(new Set());

    const handleToggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        setSelectedCardIds(new Set());
    };

    const handleSelectAll = (items) => {
        if (selectedCardIds.size === items.length) {
            setSelectedCardIds(new Set());
        } else {
            setSelectedCardIds(new Set(items.map(i => i.id)));
        }
    };

    const handleGalleryItemClick = (item, galleryMode) => {
        if (isSelectMode) {
            const next = new Set(selectedCardIds);
            if (next.has(item.id)) {
                next.delete(item.id);
            } else {
                next.add(item.id);
            }
            setSelectedCardIds(next);
        } else {
            onJumpToCard && onJumpToCard(item.id, galleryMode);
        }
    };

    const handleBulkDelete = () => {
        if (selectedCardIds.size === 0) return;
        if (!window.confirm(`${selectedCardIds.size} adet kartı silmek istediğinize emin misiniz?`)) return;

        selectedCardIds.forEach(id => {
            onDeleteWord && onDeleteWord(id);
        });

        setSelectedCardIds(new Set());
        setIsSelectMode(false);
        alert(`${selectedCardIds.size} kart başarıyla silindi.`);
    };

    // Template Manager & Library States
    const [templateKeyword, setTemplateKeyword] = useState('');
    const [templateMode, setTemplateMode] = useState('words');
    const [templateName, setTemplateName] = useState('');
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [libSearch, setLibSearch] = useState('');
    const [libSort, setLibSort] = useState('newest'); // a-z, newest
    const [savedTemplates, setSavedTemplates] = useState(() => {
        const local = localStorage.getItem('vocab_templates');
        return local ? JSON.parse(local) : [];
    });

    // Save to LocalStorage whenever savedTemplates changes
    React.useEffect(() => {
        localStorage.setItem('vocab_templates', JSON.stringify(savedTemplates));
    }, [savedTemplates]);

    // CMS States - Comprehensive version
    const initialCms = {
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
        trMiniCaseEx: editingWord?.details?.trMiniCaseExamples ? JSON.stringify(editingWord.details.trMiniCaseExamples, null, 2) : '["Türkçe örnek cümle 1", "Türkçe örnek cümle 2"]'
    };

    const [cmsDraft, setCmsDraft] = useState(initialCms);
    const [cmsExpanded, setCmsExpanded] = useState(null); // 'details', 'family', null
    const [activeCmsInput, setActiveCmsInput] = useState(null); // 'word', 'trWord', 'engDef', etc
    const [bulkText, setBulkText] = useState('');
    const [bulkStatus, setBulkStatus] = useState({ type: null, message: '', errors: [] });

    // Sync if editingWord changes while panel is open
    React.useEffect(() => {
        if (editingWord) {
            setCmsDraft({
                eng: editingWord.word || '',
                tr: editingWord.trWord || '',
                pos: editingWord.pos || 'noun',
                posTr: editingWord.posTr || 'isim',
                phonetic: editingWord.phonetic || '',
                engDef: editingWord.engDef || '',
                trDef: editingWord.trDef || '',
                engEx: editingWord.engExample || '',
                trEx: editingWord.trExample || '',
                miniCase: editingWord.details?.miniCase || '',
                trMiniCase: editingWord.details?.trMiniCase || '',
                target: editingWord.targetMode || 'words',
                root: editingWord.details?.root || '',
                prefix: editingWord.details?.prefix || '',
                suffix: editingWord.details?.suffix || '',
                synonyms: editingWord.details?.synonyms?.join(', ') || editingWord.details?.similarWords?.synonyms?.join(', ') || '',
                antonyms: editingWord.details?.antonyms?.join(', ') || editingWord.details?.similarWords?.antonyms?.join(', ') || '',
                forms: editingWord.wordForms ? JSON.stringify(editingWord.wordForms, null, 2) : '[]',
                noun: editingWord.wordFamily?.noun || '',
                verb: editingWord.wordFamily?.verb || '',
                adjective: editingWord.wordFamily?.adjective || '',
                adverb: editingWord.wordFamily?.adverb || '',
                moreExJson: editingWord.details?.moreExamples ? JSON.stringify(editingWord.details.moreExamples, null, 2) : '[]',
                trMiniCaseEx: editingWord.details?.trMiniCaseExamples ? JSON.stringify(editingWord.details.trMiniCaseExamples, null, 2) : '[]'
            });
            setActiveTab('cms');
        }
    }, [editingWord]);

    const handleBannerSave = () => {
        setGlobalAnnouncement(bannerDraft);
    };

    const handleCmsAction = (e) => {
        e.preventDefault();

        // Process complex fields
        let formsObj = [];
        try { formsObj = JSON.parse(cmsDraft.forms); } catch (e) { console.error("Invalid Forms JSON"); }

        let moreExParsed = [];
        try { moreExParsed = JSON.parse(cmsDraft.moreExJson); } catch (e) {
            console.error("Invalid moreExamples JSON");
        }

        let trMiniCaseExParsed = [];
        try { trMiniCaseExParsed = JSON.parse(cmsDraft.trMiniCaseEx || '[]'); } catch (e) {
            console.error("Invalid trMiniCaseExamples JSON");
        }

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
                similarWords: {
                    synonyms: cmsDraft.synonyms.split(',').map(s => capitalize(s.trim())).filter(Boolean),
                    antonyms: cmsDraft.antonyms.split(',').map(s => capitalize(s.trim())).filter(Boolean),
                },
                moreExamples: moreExParsed,
                miniCase: capitalize(cmsDraft.miniCase),
                trMiniCase: capitalize(cmsDraft.trMiniCase),
                trMiniCaseExamples: trMiniCaseExParsed
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
                // Smart Merge
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

    const downloadJsonFile = (json, filename) => {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateTemplate = () => {
        const skeleton = templateMode === 'words' ? {
            id: `word_${Date.now()}`,
            word: capitalize(templateKeyword) || "Keyword",
            trWord: "Çeviri",
            phonetic: "/.../",
            type: "Noun/Adj/Verb",
            targetMode: "vocabulary",
            engDef: "English definition here.",
            trDef: "Türkçe tanım buraya.",
            engEx: "Main example sentence.",
            trEx: "Main example translation.",
            details: {
                origin: { root: "", prefix: "", suffix: "" },
                similarWords: { synonyms: [], antonyms: [] },
                moreExamples: [
                    { en: "Extra example 1", tr: "Ekstra örnek 1" }
                ],
                caseExamples: [
                    { "tr": "Vaka örneği Türkçe cümle 1", "en": "Case example English sentence 1" },
                    { "tr": "Vaka örneği Türkçe cümle 2", "en": "Case example English sentence 2" }
                ]
            },
            wordFamily: { noun: "", verb: "", adjective: "", adverb: "" },
            syncToChill: true
        } : {
            id: `pv_${Date.now()}`,
            word: capitalize(templateKeyword) || "Phrasal Verb",
            trWord: "Çeviri",
            phonetic: "/.../",
            pos: "phrasal verb",
            posTr: "deyimsel fiil",
            targetMode: "Phrasal Verbs",
            engDef: "A clear and concise definition of the phrasal verb in English.",
            trDef: "Phrasal verb'ün Türkçe karşılığı ve kısa açıklaması.",
            engExample: "A natural sentence showing how the phrasal verb is used in context.",
            trExample: "İngilizce örnek cümlenin doğal bir Türkçe tercümesi.",
            details: {
                miniCase: "This is a detailed placeholder for a mini story. It should consist of at least 2-3 sentences to provide enough context for the student to understand the nuance of the phrasal verb in a real-life scenario.",
                trMiniCase: "Bu, mini bir hikaye için detaylı bir yer tutucudur. Öğrencinin phrasal verb'ün gerçek hayat senaryosundaki nüanslarını anlaması için en az 2-3 cümleden oluşmalıdır.",
                caseExamples: [
                    { "tr": "Vaka örneği Türkçe cümle 1", "en": "Case example English sentence 1" },
                    { "tr": "Vaka örneği Türkçe cümle 2", "en": "Case example English sentence 2" }
                ]
            },
            syncToChill: true
        };
        return JSON.stringify(skeleton, null, 2);
    };



    const handleSaveTemplate = () => {
        if (!templateName.trim()) return;
        if (editingTemplateId) {
            setSavedTemplates(prev => prev.map(t => t.id === editingTemplateId ? { ...t, name: templateName, data: handleGenerateTemplate() } : t));
            setEditingTemplateId(null);
        } else {
            const newTemplate = {
                id: Date.now(),
                name: templateName,
                keyword: templateKeyword,
                mode: templateMode,
                data: handleGenerateTemplate(),
                createdAt: new Date().toISOString()
            };
            setSavedTemplates([newTemplate, ...savedTemplates]);
        }
        setTemplateName('');
    };

    const handleRenameTemplate = (id, oldName) => {
        const newName = prompt("Enter new name for template:", oldName);
        if (newName && newName.trim()) {
            setSavedTemplates(prev => prev.map(t => t.id === id ? { ...t, name: newName.trim() } : t));
        }
    };

    const handleEditTemplate = (tpl) => {
        setTemplateKeyword(tpl.keyword || '');
        setTemplateMode(tpl.mode || 'words');
        setTemplateName(tpl.name);
        setEditingTemplateId(tpl.id);
        const genArea = document.getElementById('generator-hub');
        if (genArea) genArea.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteTemplate = (id) => {
        setSavedTemplates(prev => prev.filter(t => t.id !== id));
        if (editingTemplateId === id) setEditingTemplateId(null);
    };

    const handleApplyTemplate = (data) => {
        setBulkText(data);
        // Also sync to CMS Draft for Live Preview
        try {
            const parsed = JSON.parse(data);
            const item = Array.isArray(parsed) ? parsed[0] : parsed;
            if (item) {
                const cleanTarget = (item.targetMode === 'Kelime' || item.targetMode === 'vocabulary' || item.targetMode === 'words') ? 'words' : 'phrasal';
                setCmsDraft({
                    eng: capitalize(item.word || ''),
                    tr: capitalize(item.trWord || ''),
                    pos: item.pos || item.type || 'noun',
                    posTr: item.posTr || 'isim',
                    phonetic: item.phonetic || '',
                    engDef: capitalize(item.engDef || ''),
                    trDef: capitalize(item.trDef || ''),
                    engEx: capitalize(item.engEx || item.engExample || ''),
                    trEx: capitalize(item.trEx || item.trExample || ''),
                    miniCase: capitalize(item.caseStoryEn || item.details?.miniCase || ''),
                    trMiniCase: capitalize(item.caseStoryTr || item.details?.trMiniCase || ''),
                    target: cleanTarget,
                    root: item.details?.origin?.root || item.details?.root || '',
                    prefix: item.details?.origin?.prefix || item.details?.prefix || '',
                    suffix: item.details?.origin?.suffix || item.details?.suffix || '',
                    synonyms: Array.isArray(item.details?.similarWords?.synonyms) ? item.details.similarWords.synonyms.join(', ') : '',
                    antonyms: Array.isArray(item.details?.similarWords?.antonyms) ? item.details.similarWords.antonyms.join(', ') : '',
                    noun: item.wordFamily?.noun || '',
                    verb: item.wordFamily?.verb || '',
                    adjective: item.wordFamily?.adjective || '',
                    adverb: item.wordFamily?.adverb || '',
                    moreExJson: item.details?.moreExamples ? JSON.stringify(item.details.moreExamples, null, 2) : '[]'
                });
            }
        } catch (e) {
            console.error("Template parse failed for CMS sync", e);
        }

        setActiveTab('cms');
        // Scroll to CMS area
        const cmsArea = document.getElementById('cms-anchor');
        if (cmsArea) cmsArea.scrollIntoView({ behavior: 'smooth' });
    };

    const generateSmartPrompt = () => {
        const word = templateKeyword || "the word";
        const mode = templateMode === 'words' ? 'Vocabulary' : 'Phrasal Verb';
        const structure = templateMode === 'words' ?
            'origin (root, prefix, suffix), word family (noun, verb, adj, adv), synonyms, antonyms, and 2 case examples (Turkish sentences and English translations)' :
            'detailed mini story case in both English and Turkish, AND 2-3 case examples (Turkish sentences and English translations) using the phrasal verb';

        const prompt = `Please fill the following JSON structure for the ${mode} "${word}". 
Rules:
1. Capitalize first letters of English and Turkish words/sentences.
2. Provide accurate ${structure}.
3. Return ONLY the JSON object.

JSON to fill:
${handleGenerateTemplate()}`;

        navigator.clipboard.writeText(prompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        alert("Smart Prompt generated and copied to clipboard! Paste it into Gemini code assistant to get the filled data.");
    };
    const handleBulkProcess = () => {
        try {
            const data = JSON.parse(bulkText);
            const items = Array.isArray(data) ? data : [data];
            const errors = [];
            const validated = [];

            items.forEach((item, idx) => {
                const row = idx + 1;
                if (!item.word) errors.push(`[Item ${row}] 'word' is missing.`);
                if (!item.trWord) errors.push(`[Item ${row}] 'trWord' is missing.`);
                if (!item.engDef) errors.push(`[Item ${row}] 'engDef' (English definition) is missing.`);
                if (!item.trDef) errors.push(`[Item ${row}] 'trDef' (Turkish definition) is missing.`);

                if (errors.length > 50) return; // Cap error reporting

                if (errors.length === 0 || !errors.some(e => e.includes(`[Item ${row}]`))) {
                    const capitalize = (s) => s ? s.trim().charAt(0).toUpperCase() + s.trim().slice(1) : '';
                    const cleanWord = capitalize(item.word);
                    const cleanTargetMode = (item.targetMode === 'Kelime' || item.targetMode === 'words' || item.targetMode === 'Words') ? 'words' :
                        (item.targetMode === 'Phrasal Verbs' || item.type === 'Phrasal Verb' || item.targetMode === 'phrasal') ? 'phrasal' : 'words';

                    const origin = {
                        root: item.details?.origin?.root || item.details?.root || item.root || '',
                        prefix: item.details?.origin?.prefix || item.details?.prefix || item.prefix || '',
                        suffix: item.details?.origin?.suffix || item.details?.suffix || item.suffix || ''
                    };

                    const similarWords = {
                        synonyms: item.details?.similarWords?.synonyms || item.details?.synonyms || item.synonyms || [],
                        antonyms: item.details?.similarWords?.antonyms || item.details?.antonyms || item.antonyms || []
                    };

                    const wordFamily = {
                        noun: capitalize(item.wordFamily?.noun || item.noun || ''),
                        verb: capitalize(item.wordFamily?.verb || item.verb || ''),
                        adjective: capitalize(item.wordFamily?.adjective || item.adjective || ''),
                        adverb: capitalize(item.wordFamily?.adverb || item.adverb || '')
                    };

                    validated.push({
                        id: item.id || ('bulk-' + Date.now() + '-' + idx),
                        word: cleanWord,
                        trWord: capitalize(item.trWord),
                        pos: item.pos || item.type || 'verb',
                        posTr: item.posTr || (item.type === 'Phrasal Verb' ? 'deyimsel fiil' : 'fiil'),
                        phonetic: item.phonetic || '',
                        engDef: capitalize(item.engDef.trim()),
                        trDef: capitalize(item.trDef.trim()),
                        engExample: capitalize((item.engExample || item.engEx || '').trim()),
                        trExample: capitalize((item.trExample || item.trEx || '').trim()),
                        targetMode: cleanTargetMode,
                        wordForms: Array.isArray(item.wordForms) ? item.wordForms : [],
                        details: {
                            origin,
                            similarWords,
                            moreExamples: item.details?.moreExamples || item.moreExamples || [],
                            miniCase: capitalize((item.details?.miniCase || item.caseStoryEn || '').trim()),
                            trMiniCase: capitalize((item.details?.trMiniCase || item.caseStoryTr || '').trim()),
                            caseExamples: item.details?.caseExamples || item.caseExamples || item.details?.trMiniCaseExamples || []
                        },
                        wordFamily,
                        sm2: item.sm2 || { rep: 0, int: 1, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0 },
                        createdAt: item.createdAt || new Date().toISOString(),
                        syncToChill: item.syncToChill !== undefined ? item.syncToChill : true
                    });
                }
            });

            if (errors.length > 0) {
                setBulkStatus({ type: 'error', message: `Validation failed with ${errors.length} errors.`, errors });
            } else {
                setCustomWords(prev => {
                    const next = [...prev];
                    validated.forEach(newItem => {
                        // Smart Search: Match by ID OR Word+Mode combo
                        const existingIdx = next.findIndex(w =>
                            w.id === newItem.id ||
                            (w.word.toLowerCase() === newItem.word.toLowerCase() && w.targetMode === newItem.targetMode)
                        );

                        if (existingIdx > -1) {
                            // Deep Merge for details and wordFamily
                            const existing = next[existingIdx];
                            next[existingIdx] = {
                                ...existing,
                                ...newItem,
                                id: existing.id, // Keep original ID
                                details: {
                                    ...(existing.details || {}),
                                    ...(newItem.details || {}),
                                    origin: { ...(existing.details?.origin || {}), ...(newItem.details?.origin || {}) },
                                    similarWords: { ...(existing.details?.similarWords || {}), ...(newItem.details?.similarWords || {}) },
                                    caseExamples: newItem.details?.caseExamples || existing.details?.caseExamples || []
                                },
                                wordFamily: {
                                    ...(existing.wordFamily || {}),
                                    ...(newItem.wordFamily || {})
                                }
                            };
                        } else {
                            // Add new to front
                            next.unshift(newItem);
                        }
                    });
                    return next;
                });
                setBulkStatus({ type: 'success', message: `Successfully processed ${validated.length} items (Smart Upsert enabled)!`, errors: [] });
                setBulkText('');
            }
        } catch (e) {
            setBulkStatus({ type: 'error', message: 'Invalid JSON format. Please check your syntax.', errors: [e.message] });
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                word: "Resilience",
                trWord: "Dayanıklılık",
                pos: "noun",
                posTr: "isim",
                phonetic: "/rɪˈzɪliəns/",
                engDef: "The capacity to recover quickly from difficulties.",
                trDef: "Zorluklardan çabuk kurtulma kapasitesi.",
                engExample: "The community showed great resilience after the storm.",
                trExample: "Topluluk fırtınadan sonra büyük dayanıklılık gösterdi.",
                targetMode: "words",
                details: {
                    miniCase: "Despite many failures, the team stayed resilient.",
                    trMiniCase: "Birçok başarısızlığa rağmen ekip dayanıklı kaldı.",
                    synonyms: ["toughness", "flexibility"],
                    antonyms: ["fragility"]
                }
            }
        ];
        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vocab_template.json';
        a.click();
    };

    const mostPopularMode = useMemo(() => {
        const entries = Object.entries(modeSwipes);
        if (entries.length === 0) return 'None';
        return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    }, [modeSwipes]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const tabs = [
        { id: 'insights', label: t.adminInsights, icon: <BarChart3 size={16} /> },
        { id: 'cms', label: t.adminCms, icon: <Database size={16} /> },
        { id: 'gallery', label: 'Gallery', icon: <Library size={16} /> },
        { id: 'shadow', label: t.adminLogs, icon: <Terminal size={16} /> },
        { id: 'settings', label: t.adminSettings, icon: <Sliders size={16} /> },
        { id: 'templates', label: 'Templates', icon: <FileCode size={16} /> },
        { id: 'broadcast', label: t.adminBroadcast, icon: <Bell size={16} /> }
    ];

    const getModeColor = (mode) => {
        switch (mode) {
            case 'words': return 'bg-indigo-500';
            case 'chill': return 'bg-teal-400';
            case 'phrasal': return 'bg-amber-400';
            case 'quiz': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black animate-fade-in font-sans">
            {/* Admin Header */}
            <div className={`p-6 pt-10 flex items-center justify-between border-b ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
                        <ShieldCheck size={28} className="text-black" />
                    </div>
                    <div>
                        <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Overdrive</h2>
                        <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>System Management & Intelligence</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-3 rounded-full hover:bg-slate-500/10 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    <X size={24} />
                </button>
            </div>

            {/* Admin Tabs */}
            <div className={`flex p-2 gap-1 border-b overflow-x-auto scrollbar-hide ${isDark ? 'bg-[#0f0f11] border-slate-800' : 'bg-white border-slate-100'}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-wider ${activeTab === tab.id ? (isDark ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'bg-slate-900 text-white shadow-lg') : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto scroll-y p-6 pb-32 ${isDark ? 'bg-[#0a0a0c]' : 'bg-[#fcfcfd]'}`}>
                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        {/* DAU & Main Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <User size={18} className="text-indigo-500 mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">DAU</p>
                                <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.dau}</p>
                            </div>
                            <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <Activity size={18} className="text-amber-400 mb-3" />
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{t.bestMode}</p>
                                <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{mostPopularMode}</p>
                            </div>
                        </div>

                        {/* Mode Usage Distribution (Swipes) */}
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <RotateCcw size={20} className="text-indigo-500" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.modeDistribution}</h3>
                            </div>
                            <div className="space-y-5">
                                {Object.entries(modeSwipes).map(([mode, count]) => {
                                    const percentage = stats.totalSwipes > 0 ? (count / stats.totalSwipes) * 100 : 0;
                                    return (
                                        <div key={mode} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase opacity-40">
                                                <span>{mode}</span>
                                                <span>{count} swipes ({Math.round(percentage)}%)</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-800/10 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${getModeColor(mode)}`} style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Swipe Success/Fail Distribution (Right/Left) */}
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp size={20} className="text-emerald-500" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.swipeStats}</h3>
                            </div>
                            <div className="space-y-6">
                                {['words', 'chill', 'phrasal', 'quiz'].map(mode => {
                                    const right = rightSwipes[mode] || 0;
                                    const left = leftSwipes[mode] || 0;
                                    const total = right + left;
                                    const rightPercent = total > 0 ? (right / total) * 100 : 0;
                                    return (
                                        <div key={mode} className="space-y-2">
                                            <p className="text-[10px] font-black uppercase opacity-40">{mode}</p>
                                            <div className="flex h-6 w-full rounded-lg overflow-hidden gap-0.5">
                                                <div className="h-full bg-emerald-500 transition-all duration-1000 flex items-center px-2" style={{ width: `${rightPercent}%` }}>
                                                    {rightPercent > 15 && <ThumbsUp size={10} className="text-white" />}
                                                </div>
                                                <div className="h-full bg-rose-500 transition-all duration-1000 flex items-center justify-end px-2" style={{ width: `${100 - rightPercent}%` }}>
                                                    {(100 - rightPercent) > 15 && <ThumbsDown size={10} className="text-white" />}
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-[9px] font-black opacity-30 px-1">
                                                <span>{right} RIGHT</span>
                                                <span>{left} LEFT</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Per Mode */}
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Timer size={20} className="text-purple-500" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.timeSpentMode}</h3>
                            </div>
                            <div className="space-y-4">
                                {Object.entries(modeTime).map(([mode, seconds]) => (
                                    <div key={mode} className={`flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-black/30' : 'bg-slate-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${getModeColor(mode)}`}></div>
                                            <span className="text-xs font-black uppercase opacity-60">{mode}</span>
                                        </div>
                                        <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatTime(seconds)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cms' && (
                    <div id="cms-anchor" className="space-y-12 pb-32 animate-fade-in px-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    <Database size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingWord ? 'Update Artifact' : 'X-DNA Live Editor'}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Interactive Schema Injection</p>
                                </div>
                            </div>
                            <div className="flex items-center p-1 rounded-2xl border bg-slate-500/5">
                                {['words', 'phrasal'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setCmsDraft({ ...cmsDraft, target: m })}
                                        className={`flex-1 px-4 sm:px-6 py-2 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${cmsDraft.target === m ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500'}`}
                                    >
                                        {m === 'words' ? 'Vocab' : 'Phrasal'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Live Card Container */}
                        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
                            {/* THE LIVE CARD */}
                            <div className={`relative w-full max-w-[420px] rounded-[2.5rem] sm:rounded-[3.5rem] border-[6px] sm:border-[10px] p-6 sm:p-8 transition-all duration-700 ${cmsExpanded ? 'min-h-[800px]' : 'min-h-[600px]'} ${isDark ? 'bg-[#0f1012] border-slate-800' : 'bg-white border-slate-50 shadow-2xl'}`}>

                                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] z-20 ${isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {cmsDraft.target === 'words' ? 'Vocabulary' : 'Phrasal Verb'}
                                </div>

                                <div className="h-full flex flex-col pt-12 space-y-8">
                                    {/* Titles */}
                                    <div className="space-y-2 pt-4">
                                        <div className="space-y-1">
                                            <input
                                                value={cmsDraft.eng}
                                                placeholder="English Word..."
                                                onChange={e => setCmsDraft({ ...cmsDraft, eng: capitalize(e.target.value) })}
                                                className={`text-4xl font-black bg-transparent outline-none w-full placeholder:opacity-20 ${isDark ? 'text-white' : 'text-slate-900'}`}
                                            />
                                            <input
                                                value={cmsDraft.tr}
                                                placeholder="Türkçe Çeviri..."
                                                onChange={e => setCmsDraft({ ...cmsDraft, tr: capitalize(e.target.value) })}
                                                className={`text-2xl font-bold bg-transparent outline-none w-full placeholder:opacity-20 ${isDark ? 'text-indigo-400 opacity-80' : 'text-indigo-600 opacity-60'}`}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Volume2 size={16} className="opacity-20" />
                                            <input
                                                value={cmsDraft.phonetic}
                                                placeholder="/phonetic/"
                                                onChange={e => setCmsDraft({ ...cmsDraft, phonetic: e.target.value })}
                                                className={`bg-transparent outline-none font-medium italic text-sm w-32 placeholder:opacity-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                                            />
                                            <input
                                                value={cmsDraft.pos}
                                                placeholder="verb"
                                                onChange={e => setCmsDraft({ ...cmsDraft, pos: e.target.value })}
                                                className={`bg-transparent outline-none font-black uppercase text-[8px] tracking-[0.2em] px-2 py-1 rounded-md ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Definitions */}
                                    <div className={`p-8 rounded-[2.5rem] space-y-4 border-2 transition-all ${isDark ? 'bg-indigo-950/20 border-indigo-500/10' : 'bg-indigo-50/50 border-indigo-100/30'}`}>
                                        <div className="space-y-1">
                                            <textarea
                                                value={cmsDraft.engDef}
                                                placeholder="Meaning in English..."
                                                onChange={e => setCmsDraft({ ...cmsDraft, engDef: capitalize(e.target.value) })}
                                                className={`w-full bg-transparent outline-none font-bold text-lg resize-none leading-tight placeholder:opacity-20 ${isDark ? 'text-white' : 'text-slate-900'}`}
                                                rows={2}
                                            />
                                        </div>
                                        <div className="h-px w-full bg-indigo-500/10" />
                                        <textarea
                                            value={cmsDraft.trDef}
                                            placeholder="Türkçe tanımı..."
                                            onChange={e => setCmsDraft({ ...cmsDraft, trDef: capitalize(e.target.value) })}
                                            className={`w-full bg-transparent outline-none font-medium text-sm italic resize-none placeholder:opacity-20 ${isDark ? 'text-indigo-300 opacity-70' : 'text-indigo-900 opacity-60'}`}
                                            rows={2}
                                        />
                                    </div>

                                    {/* Examples */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 opacity-40">
                                            <Target size={14} className="text-amber-500" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Master Example</span>
                                        </div>
                                        <div className="space-y-3">
                                            <textarea
                                                value={cmsDraft.engEx}
                                                placeholder="Example sentence with this word..."
                                                onChange={e => setCmsDraft({ ...cmsDraft, engEx: capitalize(e.target.value) })}
                                                className={`w-full bg-transparent outline-none font-bold text-base resize-none placeholder:opacity-20 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                                                rows={2}
                                            />
                                            <textarea
                                                value={cmsDraft.trEx}
                                                placeholder="Cümle çevirisi..."
                                                onChange={e => setCmsDraft({ ...cmsDraft, trEx: capitalize(e.target.value) })}
                                                className={`p-4 rounded-2xl w-full bg-transparent outline-none font-medium text-xs italic border-l-4 border-indigo-500/20 ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    {/* Dynamic Panels */}
                                    {cmsDraft.target === 'words' && (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setCmsExpanded(cmsExpanded === 'details' ? null : 'details')}
                                                    className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${cmsExpanded === 'details' ? 'bg-indigo-500 text-white shadow-lg' : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                >
                                                    <Layers size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                                                </button>
                                                <button
                                                    onClick={() => setCmsExpanded(cmsExpanded === 'family' ? null : 'family')}
                                                    className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${cmsExpanded === 'family' ? 'bg-indigo-500 text-white shadow-lg' : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                >
                                                    <Activity size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Family</span>
                                                </button>
                                            </div>

                                            {cmsExpanded === 'details' && (
                                                <div className="p-6 rounded-[2rem] border-2 border-indigo-500/10 bg-indigo-500/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex gap-2">
                                                        <div className="flex-1"><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Root</label><input value={cmsDraft.root} onChange={e => setCmsDraft({ ...cmsDraft, root: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] font-bold" placeholder="root" /></div>
                                                        <div className="flex-1"><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Pre</label><input value={cmsDraft.prefix} onChange={e => setCmsDraft({ ...cmsDraft, prefix: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] font-bold" placeholder="re-" /></div>
                                                        <div className="flex-1"><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Suf</label><input value={cmsDraft.suffix} onChange={e => setCmsDraft({ ...cmsDraft, suffix: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] font-bold" placeholder="-ience" /></div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Synonyms</label><input value={cmsDraft.synonyms} onChange={e => setCmsDraft({ ...cmsDraft, synonyms: e.target.value })} className="w-full bg-transparent outline-none text-[10px] font-bold" placeholder="Comma separated..." /></div>
                                                        <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Antonyms</label><input value={cmsDraft.antonyms} onChange={e => setCmsDraft({ ...cmsDraft, antonyms: e.target.value })} className="w-full bg-transparent outline-none text-[10px] font-bold" placeholder="Opposites..." /></div>
                                                    </div>
                                                </div>
                                            )}

                                            {cmsExpanded === 'family' && (
                                                <div className="p-4 sm:p-6 rounded-[2rem] border-2 border-indigo-500/10 bg-indigo-500/5 grid grid-cols-1 xs:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                                    <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Noun</label><input value={cmsDraft.noun} onChange={e => setCmsDraft({ ...cmsDraft, noun: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] sm:text-xs font-bold" /></div>
                                                    <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Verb</label><input value={cmsDraft.verb} onChange={e => setCmsDraft({ ...cmsDraft, verb: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] sm:text-xs font-bold" /></div>
                                                    <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Adj</label><input value={cmsDraft.adjective} onChange={e => setCmsDraft({ ...cmsDraft, adjective: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] sm:text-xs font-bold" /></div>
                                                    <div><label className="text-[7px] font-black opacity-30 uppercase block mb-1">Adv</label><input value={cmsDraft.adverb} onChange={e => setCmsDraft({ ...cmsDraft, adverb: capitalize(e.target.value) })} className="w-full bg-transparent outline-none text-[10px] sm:text-xs font-bold" /></div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {cmsDraft.target === 'phrasal' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-500/10">
                                            <div className="flex items-center gap-2 opacity-40">
                                                <Sparkles size={14} className="text-amber-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Mini Case Story</span>
                                            </div>
                                            <div className="space-y-4">
                                                <textarea
                                                    value={cmsDraft.miniCase}
                                                    placeholder="Immersive story in English..."
                                                    onChange={e => setCmsDraft({ ...cmsDraft, miniCase: capitalize(e.target.value) })}
                                                    className={`w-full p-4 rounded-2xl outline-none font-bold text-xs resize-none leading-relaxed ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-700'}`}
                                                    rows={4}
                                                />
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Turkish Case Sentences (JSON Array)</label>
                                                    <textarea
                                                        value={cmsDraft.trMiniCaseEx}
                                                        placeholder='["Türkçe cümle 1", "Türkçe cümle 2"]'
                                                        onChange={e => setCmsDraft({ ...cmsDraft, trMiniCaseEx: e.target.value })}
                                                        className={`w-full p-4 rounded-2xl outline-none font-mono text-[10px] resize-none ${isDark ? 'bg-black/50 text-emerald-400' : 'bg-slate-900 text-emerald-300'}`}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 mt-auto">
                                        <button
                                            onClick={handleCmsAction}
                                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${editingWord ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-500 text-white shadow-indigo-500/20'}`}
                                        >
                                            <Zap size={18} fill="currentColor" />
                                            {editingWord ? 'SYNCHRONIZE UPDATES' : 'INJECT INTO DATABASE'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar / Quick Links */}
                            <div className="hidden xl:flex flex-col gap-6 w-72">
                                <div className={`p-6 rounded-[2.5rem] border-2 border-dashed ${isDark ? 'bg-black/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 flex items-center gap-2">
                                        <Bookmark size={12} /> Recent Blueprints
                                    </h4>
                                    <div className="space-y-2">
                                        {savedTemplates.slice(0, 4).map(tpl => (
                                            <button
                                                key={tpl.id}
                                                onClick={() => handleApplyTemplate(tpl.data)}
                                                className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all hover:translate-x-1 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-white shadow-sm'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tpl.mode === 'words' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    <FileCode size={16} />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-[9px] font-black truncate">{tpl.name}</p>
                                                    <p className="text-[8px] opacity-40 uppercase">{tpl.mode === 'words' ? 'Vocab' : 'Phrasal'}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-8 rounded-[2.5rem] ${isDark ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
                                    <div className="flex items-center gap-3 mb-3 text-emerald-500">
                                        <Target size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Logic Info</h4>
                                    </div>
                                    <p className="text-[10px] font-bold leading-relaxed opacity-60 italic mb-4">"The Infiltrator" auto-formats every keystroke to maintain a consistent UI across all platforms.</p>
                                    <button
                                        onClick={handleReformSystem}
                                        className={`w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
                                    >
                                        <RefreshCw size={14} />
                                        Reform All Records
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Library size={20} className="text-teal-500" />
                                    <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Card Gallery</h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    {[
                                        { id: 'words', label: 'Words', count: allWords.length },
                                        { id: 'phrasal', label: 'Phrasal', count: allPhrasals.length },
                                        { id: 'chill', label: 'Chill', count: allChill.length }
                                    ].map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setGalleryMode(m.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex flex-col items-center ${galleryMode === m.id ? 'bg-teal-500 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            <span>{m.label}</span>
                                            <span className="opacity-60 text-[8px] font-mono">{m.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <div className="relative flex-1 min-w-[200px]">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Search size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                                    </div>
                                    <input
                                        type="text"
                                        value={gallerySearch}
                                        onChange={e => setGallerySearch(e.target.value)}
                                        placeholder="Search word..."
                                        className={`w-full pl-10 h-10 rounded-xl border text-sm font-bold outline-none focus:ring-2 ring-teal-500/50 ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    />
                                </div>

                                <select
                                    value={galleryFilter}
                                    onChange={e => setGalleryFilter(e.target.value)}
                                    className={`h-10 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest outline-none transition-all active:scale-95 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    <option value="all">ALL TYPES</option>
                                    {([...new Set((galleryMode === 'words' ? allWords : galleryMode === 'phrasal' ? allPhrasals : allChill).map(w => w.pos).filter(Boolean).map(p => p.toLowerCase()))]).sort().map(p => (
                                        <option key={p} value={p}>{p.toUpperCase()}</option>
                                    ))}
                                </select>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setGallerySort(prev => prev === 'a-z' ? 'newest' : 'a-z')}
                                        className={`px-4 h-10 rounded-xl border flex items-center gap-2 transition-all active:scale-95 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                                        title="Toggle Sorting"
                                    >
                                        <SortAsc size={16} className={gallerySort === 'a-z' ? 'text-teal-500' : ''} />
                                        <span className="text-[10px] uppercase font-black tracking-widest hidden xs:block">{gallerySort === 'a-z' ? 'A-Z' : 'NEW'}</span>
                                    </button>
                                    <button
                                        onClick={handleToggleSelectMode}
                                        className={`px-4 h-10 rounded-xl border flex items-center gap-2 transition-all active:scale-95 ${isSelectMode ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                                        title="Toggle Selection Mode"
                                    >
                                        <ListChecks size={16} />
                                        <span className="text-[10px] uppercase font-black tracking-widest hidden xs:block">{isSelectMode ? 'CANCEL' : 'SELECT'}</span>
                                    </button>
                                </div>
                            </div>

                            {(() => {
                                let items = galleryMode === 'words' ? [...allWords] : galleryMode === 'phrasal' ? [...allPhrasals] : [...allChill];
                                // Apply Search
                                const searchLower = gallerySearch.toLowerCase();
                                if (searchLower) {
                                    items = items.filter(w =>
                                        w.word?.toLowerCase().includes(searchLower) ||
                                        w.trWord?.toLowerCase().includes(searchLower) ||
                                        w.eng?.toLowerCase().includes(searchLower) ||
                                        w.tr?.toLowerCase().includes(searchLower)
                                    );
                                }
                                // Apply Type Filter
                                if (galleryFilter !== 'all') {
                                    items = items.filter(w => (w.pos || "").toLowerCase() === galleryFilter.toLowerCase());
                                }
                                // Apply Sort
                                if (gallerySort === 'a-z') {
                                    items.sort((a, b) => (a.word || a.eng || '').localeCompare(b.word || b.eng || ''));
                                }

                                return isSelectMode && (
                                    <div className="flex flex-col xs:flex-row items-baseline xs:items-center justify-between gap-4 mb-4 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 animate-slide-up">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleSelectAll(items)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedCardIds.size === items.length && items.length > 0 ? 'bg-teal-500 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                            >
                                                <ListChecks size={16} />
                                                {selectedCardIds.size === items.length && items.length > 0 ? 'Deselect All' : 'Select All'}
                                            </button>
                                            <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">
                                                {selectedCardIds.size} Selected
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={selectedCardIds.size === 0}
                                            className={`w-full xs:w-auto px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30 disabled:grayscale ${isDark ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
                                        >
                                            <Trash2 size={16} />
                                            Delete Selected
                                        </button>
                                    </div>
                                );
                            })()}

                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {(() => {
                                    let items = galleryMode === 'words' ? [...allWords] : galleryMode === 'phrasal' ? [...allPhrasals] : [...allChill];

                                    // Apply Search
                                    const searchLower = gallerySearch.toLowerCase();
                                    if (searchLower) {
                                        items = items.filter(w =>
                                            w.word?.toLowerCase().includes(searchLower) ||
                                            w.trWord?.toLowerCase().includes(searchLower) ||
                                            w.eng?.toLowerCase().includes(searchLower) ||
                                            w.tr?.toLowerCase().includes(searchLower)
                                        );
                                    }

                                    // Apply Type Filter
                                    if (galleryFilter !== 'all') {
                                        items = items.filter(w => (w.pos || "").toLowerCase() === galleryFilter.toLowerCase());
                                    }

                                    // Apply Sort
                                    if (gallerySort === 'a-z') {
                                        items.sort((a, b) => (a.word || a.eng || '').localeCompare(b.word || b.eng || ''));
                                    } else {
                                        // Default newest (reorders back to original uncurated or custom words first)
                                        // Since our custom words are unshifted, they are at the top usually.
                                    }

                                    return items.map(item => {
                                        const displayWord = item.word || item.eng || '';
                                        const displayTr = item.trWord || item.tr || '';
                                        const capWord = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
                                        const capTr = displayTr.charAt(0).toUpperCase() + displayTr.slice(1);
                                        const isSelected = selectedCardIds.has(item.id);

                                        return (
                                            <div
                                                key={item.id}
                                                className={`group p-4 rounded-xl flex items-center justify-between gap-4 border transition-all cursor-pointer hover:scale-[1.01] ${isSelectMode && isSelected ? 'bg-teal-500/10 border-teal-500 shadow-lg shadow-teal-500/10' : isDark ? 'bg-slate-900/50 border-slate-800 hover:border-teal-500/30' : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/20'}`}
                                                onClick={() => handleGalleryItemClick(item, galleryMode)}
                                            >
                                                {isSelectMode && (
                                                    <div className={`mr-2 transition-all ${isSelected ? 'text-teal-500 scale-110' : 'text-slate-400 opacity-40'}`}>
                                                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <h4 className={`text-base font-black truncate group-hover:text-teal-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{capWord}</h4>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                                                            {item.pos || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{capTr} • {item.engDef || item.targetMode}</p>
                                                </div>
                                                {!isSelectMode && (
                                                    <div className="flex items-center gap-2 flex-none" onClick={e => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => {
                                                                const editItem = { ...item, eng: item.word || item.eng, tr: item.trWord || item.tr };
                                                                onEditWord && onEditWord(editItem);
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteWord && onDeleteWord(item.id)}
                                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-slate-700' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                                {galleryMode === 'words' && allWords.length === 0 && <p className="text-center opacity-50 py-10 font-bold">No items found.</p>}
                                {galleryMode === 'phrasal' && allPhrasals.length === 0 && <p className="text-center opacity-50 py-10 font-bold">No items found.</p>}
                                {galleryMode === 'chill' && allChill.length === 0 && <p className="text-center opacity-50 py-10 font-bold">No items found.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'shadow' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Terminal size={20} className="text-rose-500" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adminLogs}</h3>
                            </div>
                            <div className="space-y-2">
                                {systemLogs.length === 0 ? (
                                    <p className="text-xs font-black opacity-30 text-center py-8 italic">{t.logsEmpty}</p>
                                ) : (
                                    systemLogs.map((log, i) => (
                                        <div key={i} className="p-3 bg-black/50 rounded-lg border border-white/5 font-mono text-[10px] overflow-hidden">
                                            <span className="text-rose-500">[{log.time}]</span> {log.message}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <RefreshCw size={20} className="text-indigo-500" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adminSettings}</h3>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Global Interval Multiplier</label>
                                        <span className="text-sm font-black text-indigo-500 px-3 py-1 bg-indigo-500/10 rounded-full">{sm2Multiplier}x</span>
                                    </div>
                                    <input
                                        type="range" min="0.5" max="2.0" step="0.1" value={sm2Multiplier}
                                        onChange={(e) => setSm2Multiplier(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between mt-2 text-[8px] font-black opacity-30 tracking-widest">
                                        <span>AGGRESSIVE</span><span>DEFAULT</span><span>RELAXED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-red-500/10 text-red-500' : 'bg-white text-red-600 shadow-sm'}`}>
                                        <Power size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-red-500">{t.maintenanceActive}</h4>
                                        <p className="text-[10px] font-bold opacity-40 mt-1 max-w-[200px]">{t.maintenanceDesc}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                                    <div className={`w-14 h-7 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${isDark ? 'bg-slate-700' : 'bg-slate-300'} peer-checked:bg-red-500`}></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="space-y-8 pb-32">
                        {/* 1. Template Library */}
                        <div className={`p-8 rounded-[3rem] border-4 ${isDark ? 'bg-[#161618] border-indigo-500/10' : 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5'}`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <History size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Template Library</h3>
                                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Your saved structures</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                                        <input
                                            value={libSearch}
                                            onChange={e => setLibSearch(e.target.value)}
                                            placeholder="Search templates..."
                                            className={`pl-9 pr-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setLibSort(libSort === 'newest' ? 'a-z' : 'newest')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
                                    >
                                        <SortAsc size={14} /> {libSort === 'newest' ? 'NEWEST' : 'A-Z'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedTemplates
                                    .filter(t => t.name.toLowerCase().includes(libSearch.toLowerCase()))
                                    .sort((a, b) => libSort === 'newest' ? b.id - a.id : a.name.localeCompare(b.name))
                                    .map(tpl => (
                                        <div key={tpl.id} className={`group relative p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] ${isDark ? 'bg-black/40 border-slate-800 hover:border-indigo-500/40' : 'bg-slate-50/50 border-slate-100 hover:border-indigo-500/20 shadow-sm'}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{tpl.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${tpl.mode === 'words' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                                            {tpl.mode === 'words' ? 'Vocab' : 'Phrasal'}
                                                        </span>
                                                        <span className="text-[8px] font-bold opacity-30">{new Date(tpl.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleRenameTemplate(tpl.id, tpl.name)}
                                                        className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500 hover:bg-teal-500/20"
                                                        title="Rename"
                                                    >
                                                        <Edit size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTemplate(tpl)}
                                                        className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
                                                        title="Modify / Edit"
                                                    >
                                                        <RefreshCw size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTemplate(tpl.id)}
                                                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleApplyTemplate(tpl.data)}
                                                className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white'}`}
                                            >
                                                Use Template
                                            </button>
                                        </div>
                                    ))}
                                {savedTemplates.length === 0 && (
                                    <div className="col-span-full py-12 text-center opacity-30 italic text-xs font-bold border-2 border-dashed rounded-3xl">
                                        Your library is empty. Generate and save a template below!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Template Generator Hub */}
                        <div id="generator-hub" className={`p-8 rounded-[3rem] border-4 ${isDark ? 'bg-[#161618] border-emerald-500/10' : 'bg-white border-emerald-50 shadow-2xl shadow-emerald-500/5'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <FileCode size={32} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Template Generator</h3>
                                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Architect your JSON</p>
                                </div>
                                {editingTemplateId && (
                                    <button
                                        onClick={() => { setEditingTemplateId(null); setTemplateName(''); setTemplateKeyword(''); }}
                                        className="ml-auto text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Select Type</label>
                                        <div className="flex gap-2">
                                            {['words', 'phrasal'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setTemplateMode(m)}
                                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${templateMode === m ? 'bg-emerald-500 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                                >
                                                    {m === 'words' ? 'Vocabulary' : 'Phrasal Verb'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-end gap-3">
                                        <div className="flex-1 space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Target Word</label>
                                            <input
                                                value={templateKeyword}
                                                onChange={e => setTemplateKeyword(e.target.value)}
                                                placeholder="e.g. Persistence"
                                                className={`w-full p-4 rounded-2xl border font-bold text-sm ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            />
                                        </div>
                                        <button
                                            onClick={generateSmartPrompt}
                                            disabled={!templateKeyword}
                                            className={`p-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2 group ${templateKeyword ? 'bg-amber-400 text-black shadow-amber-400/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                            title="Auto-Fill with Gemini"
                                        >
                                            <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />
                                            <span className="text-[10px] font-black uppercase">Fill</span>
                                        </button>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-slate-800/10">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">{editingTemplateId ? 'Rename / Update Name' : 'Save to Library'}</label>
                                        <div className="flex gap-3">
                                            <input
                                                value={templateName}
                                                onChange={e => setTemplateName(e.target.value)}
                                                placeholder="Template name (e.g. Master Vocab 2024)"
                                                className={`flex-1 p-4 rounded-2xl border font-bold text-xs ${isDark ? 'bg-black border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            />
                                            <button
                                                onClick={handleSaveTemplate}
                                                disabled={!templateName.trim()}
                                                className={`px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${templateName.trim() ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-400'}`}
                                            >
                                                {editingTemplateId ? <Save size={18} /> : <Plus size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(handleGenerateTemplate());
                                                setCopySuccess(true);
                                                setTimeout(() => setCopySuccess(false), 2000);
                                            }}
                                            className={`p-2 rounded-lg transition-all ${copySuccess ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
                                        >
                                            {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                        <button
                                            onClick={() => downloadJsonFile(handleGenerateTemplate(), `template_${templateKeyword || templateMode}.json`)}
                                            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all shadow-lg"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Architecture Preview</label>
                                        <pre className={`w-full h-[350px] overflow-auto p-8 pt-16 rounded-[2.5rem] font-mono text-[10px] leading-relaxed border-4 ${isDark ? 'bg-[#0a0a0c] border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300 shadow-inner'}`}>
                                            {handleGenerateTemplate()}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Bulk Upload Section */}
                        <div id="bulk-upload-section" className={`p-8 rounded-[3rem] border-4 ${isDark ? 'bg-[#161618] border-indigo-500/10' : 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <FileUp size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Bulk Injection</h3>
                                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Execute JSON updates</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                    Smart Upsert Active
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="group relative">
                                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg opacity-0 group-focus-within:opacity-100 transition-opacity z-10">
                                        JSON DATA STREAM
                                    </div>
                                    <textarea
                                        id="bulk-textarea"
                                        value={bulkText}
                                        onChange={(e) => setBulkText(e.target.value)}
                                        placeholder='Paste your JSON array or object here...'
                                        className={`w-full h-64 p-8 rounded-[2.5rem] border-2 font-mono text-xs transition-all outline-none focus:ring-8 ${isDark ? 'bg-black border-slate-800 text-indigo-400 ring-indigo-500/5 focus:border-indigo-500/40' : 'bg-slate-50 border-slate-100 text-indigo-900 ring-indigo-500/5 focus:border-indigo-500/20 shadow-inner'}`}
                                    />
                                    {bulkText && (
                                        <button
                                            onClick={() => setBulkText('')}
                                            className="absolute top-6 right-6 p-2 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                {bulkStatus.type && (
                                    <div className={`p-6 rounded-[2rem] flex flex-col gap-4 animate-slide-up border-2 ${bulkStatus.type === 'error' ? 'bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5' : 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bulkStatus.type === 'error' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                                {bulkStatus.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black ${bulkStatus.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>{bulkStatus.message}</p>
                                                {bulkStatus.type === 'success' && <p className="text-[10px] font-bold opacity-40">System database updated successfully.</p>}
                                            </div>
                                        </div>
                                        {bulkStatus.errors.length > 0 && (
                                            <div className="max-h-32 overflow-y-auto space-y-2 pr-2 bg-black/10 rounded-xl p-3">
                                                {bulkStatus.errors.map((error, i) => (
                                                    <div key={i} className="text-[9px] font-mono font-bold text-rose-400/80 pl-3 border-l-2 border-rose-500/20">
                                                        {error}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleBulkProcess}
                                    disabled={!bulkText.trim()}
                                    className={`group relative overflow-hidden w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale ${isDark ? 'bg-white text-black' : 'bg-indigo-600 text-white'}`}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        <Zap size={18} className="fill-current" />
                                        Infiltrate System & Inject Data
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'broadcast' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#161618] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Bell size={20} className="text-amber-400" />
                                <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adminBroadcast}</h3>
                            </div>
                            <div className="space-y-4">
                                <textarea
                                    rows={4} value={bannerDraft} onChange={(e) => setBannerDraft(e.target.value)}
                                    placeholder="Type global message..."
                                    className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:ring-4 ring-amber-400/20 transition-all ${isDark ? 'bg-black border-slate-800 text-white shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                />
                                <button
                                    onClick={handleBannerSave}
                                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-amber-400 text-black shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
                                >
                                    {t.submit}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className={`p-8 rounded-[3rem] border-4 border-dashed ${isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                    <RotateCcw size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Tehlikeli Bölge</h3>
                                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Sistemi Fabrika Ayarlarına Döndür</p>
                                </div>
                            </div>
                            <p className={`text-sm font-medium mb-8 leading-relaxed opacity-60 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                Sistemi sıfırladığınızda tüm ilerleme, klasörler ve özel kelimeler kalıcı olarak silinecektir. Sadece kaynak koddaki kelimeler kalacaktır.
                            </p>
                            <button
                                onClick={onResetSystem}
                                className="w-full py-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/30 transition-all active:scale-95"
                            >
                                SİSTEMİ REFORME ET VE SIFIRLA
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
