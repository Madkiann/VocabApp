import { useState, useEffect, useCallback } from 'react';
import { calculateAdvancedSM2 } from '../utils/helpers';
import { sounds } from '../utils/sounds';

export const useQuizEngine = ({
    vocab, setVocab,
    learningWords, setLearningWords,
    deck, currentWordIndex,
    currentDate, sm2Multiplier, appLang, t,
    trackSwipe,
    setAppMode,
    setIsRevealed,
    setCardsSwipedSinceQuiz,
    setIsTranslated, setShowForms, setShowAi, setShowWriting, setShowDetails,
    setAiData, setQuizExplanation, setQuickTx,
    // from useQuizState
    lastQuizType, setLastQuizType,
    quizQuestion, setQuizQuestion,
    quizFeedback, setQuizFeedback,
    setAvailableTokens, setSelectedTokens,
    setShowQuizHistory,
    // quiz review state
}) => {
    const [isQuizReview, setIsQuizReview] = useState(false);
    const [reviewingEntryId, setReviewingEntryId] = useState(null);
    const cardsSwipedSinceQuizRef = { current: 0 };

    const generateQuiz = useCallback((forcedTargetWord = null, forcedType = null) => {
        setIsTranslated(false); setShowForms(false); setShowAi(false);
        setShowWriting(false); setShowDetails(false);
        setAiData(null); setQuizExplanation(null);
        setQuickTx({ visible: false, text: '', x: 0, y: 0 });

        if (!forcedTargetWord) {
            setIsQuizReview(false);
            setReviewingEntryId(null);
        }

        const targetWord = forcedTargetWord || learningWords[Math.floor(Math.random() * learningWords.length)];
        if (!targetWord) return;

        const availableTypes = ['mc', 'sentence', 'tf'].filter(type => type !== lastQuizType) || ['mc', 'tf'];
        const selectedType = forcedType || availableTypes[Math.floor(Math.random() * availableTypes.length)] || 'mc';
        setLastQuizType(selectedType);

        if (selectedType === 'mc') {
            const options = [targetWord];
            let failsafe = 0;
            while (options.length < 4 && failsafe < 100) {
                failsafe++;
                const randomOption = vocab[Math.floor(Math.random() * vocab.length)];
                if (!options.find(opt => opt.id == randomOption.id)) options.push(randomOption);
            }
            setQuizQuestion({ type: 'mc', target: targetWord, options: options.sort(() => Math.random() - 0.5) });
            setAppMode('quiz_mc');
        } else if (selectedType === 'sentence') {
            const targetExample = targetWord.engExample || targetWord.eng || 'Sample Sentence.';
            const cleanSentence = targetExample.replace(/[.,:;!?()\"'[\]""'']/g, '');
            const correctTokens = cleanSentence.split(/\s+/).filter(tk => tk.trim());
            const distractors = [];
            let failsafe = 0;
            while (distractors.length < 3 && failsafe < 100) {
                failsafe++;
                const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
                const randomExample = randomWord.engExample || randomWord.eng || '';
                const randomTokens = randomExample.replace(/[.,:;!?()\"'[\]""'']/g, '').split(/\s+/).filter(tk => tk.trim());
                if (randomTokens.length > 0) {
                    const randomToken = randomTokens[Math.floor(Math.random() * randomTokens.length)].toLowerCase();
                    if (!correctTokens.map(tk => tk.toLowerCase()).includes(randomToken) && !distractors.includes(randomToken)) {
                        distractors.push(randomToken);
                    }
                }
            }
            const allTokens = [...correctTokens, ...distractors]
                .sort(() => Math.random() - 0.5)
                .map((text, index) => ({ id: index, text }));
            setQuizQuestion({ type: 'sentence', target: targetWord, correctTokens });
            setAvailableTokens(allTokens);
            setSelectedTokens([]);
            setAppMode('quiz_sentence');
        } else if (selectedType === 'tf') {
            let isTrue = Math.random() > 0.5;
            let displayWord = targetWord;
            if (!isTrue) {
                const decoys = vocab.filter(w => w.id != targetWord.id && w.pos === targetWord.pos);
                if (decoys.length > 0) {
                    displayWord = decoys[Math.floor(Math.random() * decoys.length)];
                } else {
                    isTrue = true;
                    displayWord = targetWord;
                }
            }
            setQuizQuestion({
                type: 'tf', target: targetWord,
                displayedEngDef: displayWord.engDef || displayWord.meaning,
                displayedTrDef: displayWord.trDef || displayWord.trMeaning,
                isCorrectPair: isTrue
            });
            setAppMode('quiz_tf');
        }
        setQuizFeedback(null);
    }, [vocab, learningWords, lastQuizType]);

    const handleRetryQuiz = useCallback((entry) => {
        const target = vocab.find(w => (w.word || w.eng) === entry.word);
        if (!target) return;
        setIsQuizReview(true);
        setReviewingEntryId(entry.id);
        generateQuiz(target, entry.type);
    }, [vocab, generateQuiz]);

    const handleQuizAction = useCallback((isCorrect, wrongMessage, correctValueLocal, userValueLocal, quizType, quizLog, setQuizLog, setShowDashboard) => {
        if (isQuizReview) {
            if (isCorrect) {
                sounds.playSuccess();
                if (reviewingEntryId) {
                    setQuizLog(prev => ({
                        ...prev,
                        history: prev.history.map(h => h.id === reviewingEntryId ? { ...h, reviewed: true } : h)
                    }));
                }
                const successMessage = (quizType === 'sentence') ? (wrongMessage || t.correctAwesome) : t.correctAwesome;
                setQuizFeedback({ type: 'success', message: successMessage, correctValueLocal: null, userValueLocal: null });
                setTimeout(() => {
                    setAppMode('swipe');
                    setShowDashboard(true);
                    setShowQuizHistory(true);
                    setIsQuizReview(false);
                    setReviewingEntryId(null);
                }, 1500);
            } else {
                sounds.playError();
                setQuizFeedback({ type: 'error', message: wrongMessage, correctValueLocal, userValueLocal });
            }
            return;
        }

        let mode = 'recognition';
        let quality = isCorrect ? 4 : 1;
        if (quizType === 'sentence') { mode = 'production'; quality = isCorrect ? 5 : 1; }

        const updatedWord = calculateAdvancedSM2(quizQuestion.target, quality, mode, currentDate, sm2Multiplier);
        setVocab(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
        trackSwipe(quizQuestion.target.word || quizQuestion.target.text || quizQuestion.target.eng, quality, 'quiz', isCorrect);

        setQuizLog(prev => ({
            total: prev.total + 1,
            correct: prev.correct + (isCorrect ? 1 : 0),
            history: [{
                id: currentDate + Math.random(),
                date: new Date(currentDate).toISOString(),
                word: quizQuestion.target.word || quizQuestion.target.eng,
                type: quizType,
                isCorrect
            }, ...prev.history].slice(0, 50)
        }));

        if (isCorrect) {
            sounds.playSuccess();
            setLearningWords(prev => prev.filter(w => w.id !== updatedWord.id));
            const successMessage = (quizType === 'sentence') ? (wrongMessage || t.correctAwesome) : t.correctAwesome;
            setQuizFeedback({ type: 'success', message: successMessage, correctValueLocal: null, userValueLocal: null });
            setCardsSwipedSinceQuiz(0);
            setTimeout(() => {
                setAppMode('swipe');
                if (deck[currentWordIndex]) setIsRevealed(false);
            }, 1500);
        } else {
            sounds.playError();
            setQuizFeedback({ type: 'error', message: wrongMessage, correctValueLocal, userValueLocal });
        }
    }, [isQuizReview, reviewingEntryId, quizQuestion, currentDate, sm2Multiplier, deck, currentWordIndex, t]);

    return {
        isQuizReview, setIsQuizReview,
        reviewingEntryId, setReviewingEntryId,
        generateQuiz,
        handleRetryQuiz,
        handleQuizAction,
    };
};
