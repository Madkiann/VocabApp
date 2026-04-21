
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { initialVocabulary, initialPhrasalVerbs } from '../data/vocabulary';
import { safeJsonParse, shuffleArray } from '../utils/helpers';
import { useApp } from './AppContext';
import { useSettings } from './SettingsContext';
import { syncStorage } from '../utils/storage';

export const VocabContext = createContext();

export const useVocab = () => {
    const context = useContext(VocabContext);
    if (!context) {
        throw new Error('useVocab must be used within a VocabProvider');
    }
    return context;
};

export const VocabProvider = ({ children }) => {
    const { 
        currentDate, setTotalSwipes, setModeSwipes, setRightSwipes, setLeftSwipes, 
        setHourlySwipes, setLastActionStatus, setDailyStats, setDifficultWords, 
        setIsRevealed, setAppMode, setCardsSwipedSinceQuiz, setIsRetryMode, isRetryMode 
    } = useApp();

    const { isAdmin } = useSettings();

    // 1. Core Vocabulary States
    const [wordVocab, setWordVocab] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_word_vocab')) || [...initialVocabulary]);
    const [phrasalVocab, setPhrasalVocab] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_phrasal_vocab')) || [...initialPhrasalVerbs]);
    const [chillVocab, setChillVocab] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_chill_vocab')) || [...initialVocabulary].map(w => ({ ...w, sm2: { ...w.sm2, ef: 3.0 } })));
    
    const [customWords, setCustomWords] = useState(() => {
        const stored = safeJsonParse(syncStorage.getItem('vocabapp_custom_words'));
        if (!stored) return [];
        return stored.map(w => {
            if (w.eng && !w.word) {
                return {
                    ...w,
                    word: w.eng,
                    trWord: w.tr || w.trWord,
                    engDef: w.engDef || '',
                    trDef: w.trDef || '',
                    engExample: w.engExample || '',
                    trExample: w.trExample || ''
                };
            }
            return w;
        });
    });

    const [deletedWords, setDeletedWords] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_deleted_words')) || []);
    const [vocabMode, setVocabMode] = useState('words'); // words, phrasal, chill
    const [chillSortMode, setChillSortMode] = useState('random');
    const [savedWords, setSavedWords] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_saved_words')) || []);
    const [vaultFolders, setVaultFolders] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_vault_folders')) || ['General']);
    const [deck, setDeck] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(() => {
        const saved = syncStorage.getItem('vocabapp_current_index');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [learningWords, setLearningWords] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_learning_words')) || []);
    const [history, setHistory] = useState(() => safeJsonParse(syncStorage.getItem('vocabapp_history')) || []);

    // 2. Computed (Derived) State
    const computedWords = useMemo(() => {
        const custom = customWords.filter(w => w.targetMode === 'words');
        const overrideIds = new Set(custom.map(w => w.id));
        const deletedIds = new Set(deletedWords);
        const baseWords = wordVocab.filter(w => !overrideIds.has(w.id) && !deletedIds.has(w.id));
        return [...baseWords, ...custom].filter(w => !deletedIds.has(w.id));
    }, [wordVocab, customWords, deletedWords]);

    const computedPhrasals = useMemo(() => {
        const custom = customWords.filter(w => w.targetMode === 'phrasal');
        const overrideIds = new Set(custom.map(w => w.id));
        const deletedIds = new Set(deletedWords);
        return [...phrasalVocab.filter(w => !overrideIds.has(w.id) && !deletedIds.has(w.id)), ...custom].filter(w => !deletedIds.has(w.id));
    }, [phrasalVocab, customWords, deletedWords]);

    const computedChill = useMemo(() => {
        const wordsForChill = customWords.filter(w => w.targetMode === 'words' || w.targetMode === 'chill');
        const phrasalsForChill = phrasalVocab.map(w => ({ ...w, sm2: { ...w.sm2, ef: 3.0 } }));
        const overrideIds = new Set(wordsForChill.map(w => w.id));
        const deletedIds = new Set(deletedWords);
        
        let baseChill = [
            ...chillVocab.filter(w => !overrideIds.has(w.id) && !deletedIds.has(w.id)),
            ...wordsForChill.map(w => ({ ...w, sm2: { ...w.sm2, ef: 3.0 } })),
            ...phrasalsForChill
        ].filter(w => !deletedIds.has(w.id));

        if (chillSortMode === 'alphabetical') {
            return [...baseChill].sort((a, b) => (a.word || '').localeCompare(b.word || ''));
        } else if (chillSortMode === 'newest') {
            return [...baseChill].reverse();
        }
        return shuffleArray(baseChill);
    }, [chillVocab, customWords, deletedWords, chillSortMode, phrasalVocab]);

    const vocab = useMemo(() => {
        if (vocabMode === 'words') return computedWords;
        if (vocabMode === 'phrasal') return computedPhrasals;
        return computedChill;
    }, [vocabMode, computedWords, computedPhrasals, computedChill]);

    const setVocab = useCallback((setter) => {
        if (vocabMode === 'words') setWordVocab(setter);
        else if (vocabMode === 'phrasal') setPhrasalVocab(setter);
        else setChillVocab(setter);
    }, [vocabMode]);

    // 3. Persistence Effects
    useEffect(() => syncStorage.setItem('vocabapp_word_vocab', JSON.stringify(wordVocab)), [wordVocab]);
    useEffect(() => syncStorage.setItem('vocabapp_phrasal_vocab', JSON.stringify(phrasalVocab)), [phrasalVocab]);
    useEffect(() => syncStorage.setItem('vocabapp_chill_vocab', JSON.stringify(chillVocab)), [chillVocab]);
    useEffect(() => syncStorage.setItem('vocabapp_custom_words', JSON.stringify(customWords)), [customWords]);
    useEffect(() => syncStorage.setItem('vocabapp_deleted_words', JSON.stringify(deletedWords)), [deletedWords]);
    useEffect(() => syncStorage.setItem('vocabapp_current_index', currentWordIndex.toString()), [currentWordIndex]);
    useEffect(() => syncStorage.setItem('vocabapp_saved_words', JSON.stringify(savedWords)), [savedWords]);
    useEffect(() => syncStorage.setItem('vocabapp_vault_folders', JSON.stringify(vaultFolders)), [vaultFolders]);
    useEffect(() => syncStorage.setItem('vocabapp_learning_words', JSON.stringify(learningWords)), [learningWords]);
    useEffect(() => syncStorage.setItem('vocabapp_history', JSON.stringify(history)), [history]);

    // 4. Shared Logic (Functions)
    const deleteWord = useCallback((wordId) => {
        if (!window.confirm("Bu kelimeyi silmek istediğine emin misin?")) return;
        setCustomWords(prev => prev.filter(w => w.id !== wordId));
        setWordVocab(prev => prev.filter(w => w.id !== wordId));
        setPhrasalVocab(prev => prev.filter(w => w.id !== wordId));
        setChillVocab(prev => prev.filter(w => w.id !== wordId));
        setDeletedWords(prev => prev.includes(wordId) ? prev : [...prev, wordId]);
    }, []);

    const toggleSaveWord = useCallback((word) => {
        setSavedWords(prev => {
            if (prev.some(w => w.id === word.id)) {
                return prev.filter(w => w.id !== word.id);
            }
            return [...prev, { ...word, folder: 'General' }];
        });
    }, []);

    const updateWordFolder = useCallback((wordId, folderName) => {
        setSavedWords(prev => prev.map(w => w.id === wordId ? { ...w, folder: folderName } : w));
    }, []);

    const deleteVaultFolder = useCallback((folderName) => {
        if (folderName === 'General') return;
        setVaultFolders(prev => prev.filter(f => f !== folderName));
        setSavedWords(prev => prev.map(w => w.folder === folderName ? { ...w, folder: 'General' } : w));
    }, []);

    const renameVaultFolder = useCallback((oldName, newName) => {
        const trimmed = newName.trim();
        if (oldName === 'General' || !trimmed || vaultFolders.includes(trimmed)) return;
        setVaultFolders(prev => prev.map(f => f === oldName ? trimmed : f));
        setSavedWords(prev => prev.map(w => w.folder === oldName ? { ...w, folder: trimmed } : w));
    }, []);

    const trackSwipe = useCallback((wordText, quality, modeParam = 'words', isSuccess = true) => {
        setTotalSwipes(prev => prev + 1);
        setModeSwipes(prev => ({ ...prev, [modeParam]: (prev[modeParam] || 0) + 1 }));

        if (isSuccess) {
            setRightSwipes(prev => ({ ...prev, [modeParam]: (prev[modeParam] || 0) + 1 }));
        } else {
            setLeftSwipes(prev => ({ ...prev, [modeParam]: (prev[modeParam] || 0) + 1 }));
        }

        const hour = new Date().getHours();
        setLastActionStatus(isSuccess ? 'correct' : 'wrong');
        setTimeout(() => setLastActionStatus(null), 400);

        setHourlySwipes(prev => {
            const next = [...prev];
            next[hour] += 1;
            return next;
        });

        if (quality === 1) {
            setDifficultWords(prev => {
                const idx = prev.findIndex(w => (w.text || w.word) === wordText);
                if (idx > -1) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], fails: updated[idx].fails + 1 };
                    return updated.sort((a, b) => b.fails - a.fails);
                }
                return [...prev, { text: wordText, fails: 1 }].sort((a, b) => b.fails - a.fails);
            });
        }

        setDailyStats(prev => {
            const todayStr = new Date(currentDate).toDateString();
            const hour = new Date().getHours();
            const dayData = prev[todayStr] || {
                swiped: 0,
                swiped_words: 0,
                swiped_phrasal: 0,
                correct: 0,
                wrong: 0,
                quiz: 0,
                time: 0,
                hourlyActions: new Array(24).fill(0),
                hourlyTime: new Array(24).fill(0),
                swipedIds: []
            };

            const isQuiz = modeParam === 'quiz';
            const newHourlyActions = [...(dayData.hourlyActions || new Array(24).fill(0))];
            newHourlyActions[hour] = (newHourlyActions[hour] || 0) + 1;

            const allPossibleVocab = [...wordVocab, ...phrasalVocab, ...chillVocab, ...customWords];
            const card = allPossibleVocab.find(w => w.word === wordText || (w.text || w.eng) === wordText);
            const cardId = card?.id;

            const alreadySwiped = cardId && (dayData.swipedIds || []).includes(cardId);
            const newSwipedIds = (cardId && !alreadySwiped) ? [...(dayData.swipedIds || []), cardId] : (dayData.swipedIds || []);

            const isReview = card && card.sm2 && card.sm2.rep > 0;
            const isStranger = card && card.sm2 && card.sm2.rep === 0;
            const isDiscovery = !alreadySwiped && isStranger && !isReview && !isRetryMode;

            let actualMode = modeParam;
            if (isQuiz && card) {
                actualMode = phrasalVocab.some(pw => pw.id === card.id) ? 'phrasal' : 'words';
            }

            return {
                ...prev,
                [todayStr]: {
                    ...dayData,
                    swiped: (dayData.swiped || 0) + (isDiscovery ? 1 : 0),
                    swiped_words: (dayData.swiped_words || 0) + (isDiscovery && actualMode === 'words' ? 1 : 0),
                    swiped_phrasal: (dayData.swiped_phrasal || 0) + (isDiscovery && actualMode === 'phrasal' ? 1 : 0),
                    correct: (dayData.correct || 0) + (isSuccess ? 1 : 0),
                    wrong: (dayData.wrong || 0) + (!isSuccess ? 1 : 0),
                    quiz: (dayData.quiz || 0) + (isQuiz ? 1 : 0),
                    hourlyActions: newHourlyActions,
                    swipedIds: newSwipedIds
                }
            };
        });

        syncStorage.setItem('vocabapp_last_active_date', new Date(currentDate).toDateString());
    }, [currentDate, isRetryMode, phrasalVocab, wordVocab, chillVocab, customWords, setTotalSwipes, setModeSwipes, setRightSwipes, setLeftSwipes, setHourlySwipes, setLastActionStatus, setDailyStats, setDifficultWords]);

    const refreshDeck = useCallback((isRetry = false) => {
        let newDeck = [];
        if (isRetry) {
            const todayStr = new Date(currentDate).toDateString();
            const storedStats = safeJsonParse(syncStorage.getItem('vocabapp_daily_stats')) || {};
            const stats = storedStats[todayStr] || { swipedIds: [] };
            const swipedTodayIds = new Set(stats.swipedIds || []);

            const sessionContent = vocab.filter(w =>
                swipedTodayIds.has(w.id) ||
                (w.sm2.nextDate <= currentDate && w.sm2.rep > 0)
            );

            newDeck = shuffleArray(sessionContent).slice(0, 12);
            setIsRetryMode(true);
        } else if (vocabMode !== 'chill') {
            const todayStr = new Date(currentDate).toDateString();
            const storedStats = safeJsonParse(syncStorage.getItem('vocabapp_daily_stats')) || {};
            const stats = storedStats[todayStr] || { swiped: 0, swipedIds: [] };

            const dueCards = vocab.filter(w => w.sm2.nextDate <= currentDate && w.sm2.rep > 0);
            const shuffledDue = shuffleArray(dueCards).slice(0, Math.floor(Math.random() * 21));

            const pool = vocabMode === 'phrasal' ? phrasalVocab : wordVocab;
            const alreadySwipedToday = new Set(stats.swipedIds || []);
            const strangerCards = pool.filter(w => w.sm2.rep === 0 && !alreadySwipedToday.has(w.id));
            const shuffledStrangers = shuffleArray(strangerCards);

            const currentSwiped = vocabMode === 'phrasal' ? (stats.swiped_phrasal || 0) : (stats.swiped_words || 0);
            const remainingDiscoveryQuota = Math.max(0, 12 - currentSwiped);
            const discoveriesForDeck = shuffledStrangers.slice(0, remainingDiscoveryQuota);

            newDeck = shuffleArray([...shuffledDue, ...discoveriesForDeck]);
            setIsRetryMode(false);
        } else {
            newDeck = vocab;
            setIsRetryMode(false);
        }

        setDeck(newDeck);
        setCurrentWordIndex(0);
        setCardsSwipedSinceQuiz(0);
        setAppMode('swipe');
        if (newDeck.length > 0) {
            setIsRevealed(false);
        }
    }, [currentDate, vocab, vocabMode, phrasalVocab, wordVocab, setIsRetryMode, setAppMode, setCardsSwipedSinceQuiz, setIsRevealed]);

    // Uygulama ilk açıldığında veya kelime modu değiştiğinde desteyi yenile
    useEffect(() => {
        refreshDeck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vocabMode]);

    const jumpToCard = useCallback((cardId, targetMode) => {
        setVocabMode(targetMode);
        setAppMode('swipe');
        
        let targetVocab;
        if (targetMode === 'words') targetVocab = computedWords;
        else if (targetMode === 'phrasal') targetVocab = computedPhrasals;
        else targetVocab = computedChill;

        const idx = targetVocab.findIndex(w => w.id === cardId);
        if (idx > -1) {
            setDeck(targetVocab.slice(idx, idx + 1));
            setCurrentWordIndex(0);
        }
    }, [computedWords, computedPhrasals, computedChill, setAppMode]);

    const evolveBond = useCallback((wordId) => {
        if (!isAdmin) return;
        const updateFn = w => {
            if (String(w.id) === String(wordId)) {
                let currentXp = w.sm2?.bondXP || 0;
                let nextXp, nextInt;
                if (currentXp === 0) { nextXp = 50; nextInt = 1; }
                else if (currentXp < 100) { nextXp = 100; nextInt = 7; }
                else if (currentXp < 250) { nextXp = 250; nextInt = 21; }
                else { nextXp = currentXp + 100; nextInt = Math.max(w.sm2?.int || 0, 30); }

                return {
                    ...w,
                    sm2: { ...(w.sm2 || {}), bondXP: nextXp, int: nextInt, rep: Math.max((w.sm2?.rep || 0), 1) }
                };
            }
            return w;
        };
        setWordVocab(prev => prev.map(updateFn));
        setPhrasalVocab(prev => prev.map(updateFn));
        setChillVocab(prev => prev.map(updateFn));
        setDeck(prev => prev.map(updateFn)); // Update the current view
    }, [isAdmin]);

    const value = {
        wordVocab, setWordVocab,
        phrasalVocab, setPhrasalVocab,
        chillVocab, setChillVocab,
        customWords, setCustomWords,
        deletedWords, setDeletedWords,
        vocabMode, setVocabMode,
        chillSortMode, setChillSortMode,
        computedWords, computedPhrasals, computedChill, vocab,
        setVocab, evolveBond,
        savedWords, setSavedWords,
        vaultFolders, setVaultFolders,
        deck, setDeck,
        currentWordIndex, setCurrentWordIndex,
        learningWords, setLearningWords,
        history, setHistory,
        deleteWord, toggleSaveWord, updateWordFolder, deleteVaultFolder, renameVaultFolder,
        trackSwipe, refreshDeck, jumpToCard
    };

    return <VocabContext.Provider value={value}>{children}</VocabContext.Provider>;
};
