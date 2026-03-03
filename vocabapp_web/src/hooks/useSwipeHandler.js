import { useState, useCallback } from 'react';
import { calculateAdvancedSM2 } from '../utils/helpers';
import { sounds } from '../utils/sounds';

export const useSwipeHandler = ({
    deck, currentWordIndex, setCurrentWordIndex,
    vocab, setVocab,
    swipeDirection, setSwipeDirection,
    vocabMode, isRetryMode, isRevealed,
    dailyStats, currentDate,
    learningWords, setLearningWords,
    swipeLog, setSwipeLog,
    sm2Multiplier,
    trackSwipe,
    setIsRevealed, setIsTranslated,
    setShowForms, setShowAi, setShowWriting, setShowDetails, setShowCaseExamples,
    setUserSentence, setWritingFeedback, setAiData, setQuickTx,
    setCardsSwipedSinceQuiz,
    setDailyStats,
}) => {
    const [history, setHistory] = useState([]);

    const handleSwipe = (direction, isComplete = false) => {
        if (swipeDirection && !isComplete) return;
        if (currentWordIndex >= deck.length) return;

        if (!isComplete) {
            const todayStr = new Date(currentDate).toDateString();
            const stats = dailyStats[todayStr] || { swiped: 0, swipedIds: [] };
            const currentWord = deck[currentWordIndex];
            const isReview = currentWord && currentWord.sm2.rep > 0;
            const alreadySwipedToday = currentWord && (stats.swipedIds || []).includes(currentWord.id);

            if (vocabMode !== 'chill' && !isReview && !alreadySwipedToday && stats.swiped >= 12 && !isRetryMode) {
                alert('Günlük yeni keşif kotana ulaştın (12/12). Daha önce gördüğün kelimelere (Tanış/Sırdaş) sınırsız devam edebilirsin ama yeni kelime için yarını bekle!');
                return;
            }
            setSwipeDirection(direction);
            return;
        }

        const currentWord = deck[currentWordIndex];
        if (!currentWord) return null;

        const isCorrect = direction === 'right';
        let quality;
        let mode = 'recall';

        if (isCorrect) {
            if (!isRevealed) {
                quality = 5;
                mode = 'perfect';
                sounds.playMastery();
            } else {
                quality = 4;
                sounds.playSuccess();
            }
        } else {
            if (isRevealed) {
                quality = 2;
                sounds.playError();
            } else {
                quality = 0;
                sounds.playError();
            }
        }

        if (vocabMode !== 'chill') {
            const updatedWord = calculateAdvancedSM2(currentWord, quality, mode, currentDate, sm2Multiplier, false);
            setVocab(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
            trackSwipe(currentWord.word || currentWord.text || currentWord.eng, quality, vocabMode, isCorrect);

            if (!isCorrect) {
                setLearningWords(prev => {
                    if (!prev.find(w => w.id === updatedWord.id)) return [...prev, updatedWord];
                    return prev;
                });
            } else {
                setLearningWords(prev => prev.filter(w => w.id !== updatedWord.id));
            }
        } else {
            trackSwipe(currentWord.text || currentWord.eng, quality, 'chill', isCorrect);
        }

        // Push to history for Undo
        setHistory(prev => [...prev, {
            vocab: [...vocab],
            learningWords: [...learningWords],
            currentWordIndex,
            isRevealed,
            currentWord: { ...currentWord }
        }].slice(-10));

        setSwipeDirection(null);
        setIsTranslated(false);
        setShowForms(false); setShowAi(false); setShowWriting(false);
        setShowDetails(false); setShowCaseExamples(false);
        setUserSentence(''); setWritingFeedback(null); setAiData(null);
        setQuickTx({ visible: false, text: '', x: 0, y: 0 });

        setSwipeLog(prev => {
            const newLog = { ...prev };
            if (isCorrect) {
                newLog.correctIds = [currentWord.id, ...newLog.correctIds.filter(id => id !== currentWord.id)].slice(0, 50);
                newLog.wrongIds = newLog.wrongIds.filter(id => id !== currentWord.id);
            } else {
                newLog.wrongIds = [currentWord.id, ...newLog.wrongIds.filter(id => id !== currentWord.id)].slice(0, 50);
                newLog.correctIds = newLog.correctIds.filter(id => id !== currentWord.id);
            }
            return newLog;
        });

        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setCardsSwipedSinceQuiz(prev => prev + 1);

        if (nextIndex < deck.length) setIsRevealed(false);
    };

    const handleUndo = useCallback(() => {
        if (history.length === 0) return;
        const prevState = history[history.length - 1];

        if (prevState.currentWord) {
            const todayStr = new Date(currentDate).toDateString();
            setDailyStats(prev => {
                const dayData = prev[todayStr];
                if (!dayData) return prev;
                const card = prevState.currentWord;
                const existsInSwiped = (dayData.swipedIds || []).includes(card.id);
                if (existsInSwiped) {
                    return {
                        ...prev,
                        [todayStr]: {
                            ...dayData,
                            swiped: Math.max(0, dayData.swiped - 1),
                            swipedIds: (dayData.swipedIds || []).filter(id => id !== card.id)
                        }
                    };
                }
                return prev;
            });
        }

        setVocab(prevState.vocab);
        setLearningWords(prevState.learningWords);
        setCurrentWordIndex(prevState.currentWordIndex);
        setIsRevealed(prevState.isRevealed);
        setHistory(prev => prev.slice(0, -1));
    }, [history, currentDate]);

    return { history, handleSwipe, handleUndo };
};
