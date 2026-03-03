import { useState, useMemo } from 'react';
import { initialVocabulary, initialPhrasalVerbs } from '../data/vocabulary';
import { shuffleArray } from '../utils/helpers';

export const useVocabEngine = ({
    customWords,
    deletedWords,
    chillSortMode,
    appDay,
    // Analytics setters from useAppStorage:
    setTotalSwipes,
    setModeSwipes,
    setRightSwipes,
    setLeftSwipes,
    setLastActionStatus,
    setHourlySwipes,
    setDifficultWords,
    setDailyStats,
    currentDate,
    isRetryMode,
    // Admin
    setCustomWords,
    setDeletedWords,
    setEditingWord,
    setShowAdminPanel
}) => {
    const [wordVocab, setWordVocab] = useState([...initialVocabulary]);
    const [phrasalVocab, setPhrasalVocab] = useState([...initialPhrasalVerbs]);
    const [chillVocab, setChillVocab] = useState([...initialVocabulary].map(w => ({ ...w, sm2: { ...w.sm2, ef: 3.0 } })));

    const computedWords = useMemo(() => {
        const custom = customWords.filter(w => w.targetMode === 'words');
        const overrideIds = new Set(custom.map(w => w.id));
        const deletedIds = new Set(deletedWords);
        const dayLimit = 36;
        const baseWords = wordVocab.filter(w => !overrideIds.has(w.id) && !deletedIds.has(w.id));
        const limitedWords = baseWords.slice(0, dayLimit);
        return [...limitedWords, ...custom].filter(w => !deletedIds.has(w.id));
    }, [wordVocab, customWords, deletedWords, appDay]);

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
    }, [chillVocab, customWords, deletedWords, chillSortMode]);

    const trackSwipe = (wordText, quality, modeParam = 'words', isSuccess = true) => {
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
                const idx = prev.findIndex(w => w.text === wordText);
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
            const h = new Date().getHours();
            const dayData = prev[todayStr] || {
                swiped: 0, correct: 0, wrong: 0, quiz: 0, time: 0,
                hourlyActions: new Array(24).fill(0),
                hourlyTime: new Array(24).fill(0),
                swipedIds: []
            };

            const isQuiz = modeParam === 'quiz';
            const newHourlyActions = [...(dayData.hourlyActions || new Array(24).fill(0))];
            newHourlyActions[h] = (newHourlyActions[h] || 0) + 1;

            const allPossibleVocab = [...wordVocab, ...phrasalVocab, ...chillVocab, ...customWords];
            const card = allPossibleVocab.find(w => (w.text || w.eng) === wordText || w.word === wordText);
            const cardId = card?.id;

            const alreadySwiped = cardId && (dayData.swipedIds || []).includes(cardId);
            const newSwipedIds = (cardId && !alreadySwiped) ? [...(dayData.swipedIds || []), cardId] : (dayData.swipedIds || []);

            const isReview = card && card.sm2 && card.sm2.rep > 0;
            const isStranger = card && card.sm2 && card.sm2.rep === 0;
            const isDiscovery = !alreadySwiped && isStranger && !isReview && !isRetryMode;

            return {
                ...prev,
                [todayStr]: {
                    ...dayData,
                    swiped: dayData.swiped + (isDiscovery ? 1 : 0),
                    correct: dayData.correct + (isSuccess ? 1 : 0),
                    wrong: dayData.wrong + (!isSuccess ? 1 : 0),
                    quiz: dayData.quiz + (isQuiz ? 1 : 0),
                    hourlyActions: newHourlyActions,
                    swipedIds: newSwipedIds
                }
            };
        });

        localStorage.setItem('vocabapp_last_active_date', new Date(currentDate).toDateString());
    };

    const deleteWord = (wordId) => {
        if (!window.confirm("Bu kelimeyi silmek istediğine emin misin?")) return;
        setCustomWords(prev => prev.filter(w => w.id !== wordId));
        setWordVocab(prev => prev.filter(w => w.id !== wordId));
        setPhrasalVocab(prev => prev.filter(w => w.id !== wordId));
        setChillVocab(prev => prev.filter(w => w.id !== wordId));
        setDeletedWords(prev => {
            if (!prev.includes(wordId)) return [...prev, wordId];
            return prev;
        });
    };

    const editWord = (wordObj) => {
        setEditingWord(wordObj);
        setShowAdminPanel(true);
    };

    return {
        wordVocab, setWordVocab,
        phrasalVocab, setPhrasalVocab,
        chillVocab, setChillVocab,
        computedWords,
        computedPhrasals,
        computedChill,
        trackSwipe,
        deleteWord,
        editWord
    };
};
