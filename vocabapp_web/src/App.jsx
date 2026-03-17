import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Check, X, Sun, Moon, Instagram, Globe, Archive, Languages, Hourglass, BarChart3, Brain, Flame, Clock, Sparkles, ArrowRight, Menu, Settings, Layers, Coffee, BookOpen, ServerCrash, Undo2 } from 'lucide-react';
import { initialVocabulary, initialPhrasalVerbs, localDict } from './data/vocabulary';
import { safeJsonParse, calculateAdvancedSM2, shuffleArray } from './utils/helpers';

// Contexts
import { useApp } from './context/AppContext';
import { useSettings } from './context/SettingsContext';
import { useVocab } from './context/VocabContext';

// Components
import { BrandLogo } from './components/BrandLogo';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Vault } from './components/Vault';
import { Card } from './components/Card';
import { PhrasalCard } from './components/PhrasalCard';
import { ChillMode } from './components/ChillMode';
import { CommunityHub } from './components/CommunityHub';
import { BottomNav } from './components/BottomNav';
import { SettingsModal } from './components/SettingsModal';
import { AchievementPopup } from './components/AchievementPopup';
import { Mascot } from './components/Mascot';
import { SwipeableCard } from './components/SwipeableCard';
import { AdminPanel } from './components/AdminPanel';
import { LevelTestModal } from './components/LevelTestModal';
import { ArenaGate } from './components/ArenaGate';

import { Library } from './components/Library';
import { StreakRunArena } from './components/StreakRunArena';
import { SpeedBlitzArena } from './components/SpeedBlitzArena';

// Hooks
import { useVocabStats } from './hooks/useVocabStats';
import { useAchievements } from './hooks/useAchievements';

// Sounds
import { sounds } from './utils/sounds';

export default function App() {
  const { 
    appLang, setAppLang, t, 
    isAdmin, handleVersionClick, verifyMasterKey, userEmail, setUserEmail,
    themePref, setThemePref, isDark, cycleTheme, getThemeText,
    soundEnabled, setSoundEnabled,
    maintenanceMode, setMaintenanceMode,
    sm2Multiplier, setSm2Multiplier,
    globalAnnouncement, setGlobalAnnouncement
  } = useSettings();

  const {
    appMode, setAppMode,
    isLogoVisible, setIsLogoVisible,
    currentDate, setCurrentDate,
    totalSwipes, setTotalSwipes,
    streak, setStreak,
    maxStreak, setMaxStreak,
    totalSecondsSpent, setTotalSecondsSpent,
    modeSwipes, setModeSwipes,
    rightSwipes, setRightSwipes,
    leftSwipes, setLeftSwipes,
    modeTime, setModeTime,
    hourlySwipes, setHourlySwipes,
    dailyStats, setDailyStats,
    difficultWords, setDifficultWords,
    systemLogs, setSystemLogs,
    lastActionStatus, setLastActionStatus,
    isRevealed, setIsRevealed,
    isRetryMode, setIsRetryMode,
    cardsSwipedSinceQuiz, setCardsSwipedSinceQuiz,
    advanceTime,
    isQuizReview, setIsQuizReview,
    reviewingEntryId, setReviewingEntryId,
    quizLog, setQuizLog,
    swipeLog, setSwipeLog,
    quizQuestion, setQuizQuestion,
    quizFeedback, setQuizFeedback,
    quizExplanation, setQuizExplanation,
    availableTokens, setAvailableTokens,
    selectedTokens, setSelectedTokens,
    lastQuizType, setLastQuizType,
    showAdminPanel, setShowAdminPanel,
    showVault, setShowVault,
    showDashboard, setShowDashboard,
    showLevelTest, setShowLevelTest,
    showArenaGate, setShowArenaGate,
    showStreakRun, setShowStreakRun,
    showSpeedBlitz, setShowSpeedBlitz,
    showLibrary, setShowLibrary,
    showSettings, setShowSettings,
    showCommunityHub, setShowCommunityHub,
    showQuizHistory, setShowQuizHistory,
    activeVaultFolder, setActiveVaultFolder,
    selectedVaultWord, setSelectedVaultWord,
    editingWord, setEditingWord
  } = useApp();

  const {
    wordVocab, setWordVocab,
    phrasalVocab, setPhrasalVocab,
    chillVocab, setChillVocab,
    customWords, setCustomWords,
    deletedWords, setDeletedWords,
    vocabMode, setVocabMode,
    chillSortMode, setChillSortMode,
    computedWords, computedPhrasals, computedChill, vocab,
    savedWords, setSavedWords,
    vaultFolders, setVaultFolders,
    deck, setDeck,
    currentWordIndex, setCurrentWordIndex,
    learningWords, setLearningWords,
    history, setHistory,
    deleteWord, toggleSaveWord, updateWordFolder, deleteVaultFolder, renameVaultFolder,
    trackSwipe, refreshDeck, jumpToCard, evolveBond, setVocab
  } = useVocab();

  const {
    totalReviewsAll, globalRetention, bondStats, learnedCount, strongCount,
    swipedToday: swipedTodayTotal, dueTodayCount, dueTodayMins, dueTomorrowCount, dueTomorrowMins,
    dailyProgress, weakWordsArray
  } = useVocabStats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, [setIsLogoVisible]);

  // UI Local States
  const [dauDisplay, setDauDisplay] = useState(1);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      const log = { time: new Date().toLocaleTimeString(), message: msg.substring(0, 150) };
      setSystemLogs(prev => [log, ...prev].slice(0, 50));
      originalError(...args);
    };
    return () => console.error = originalError;
  }, [setSystemLogs]);



  const editWord = (wordObj) => {
    setEditingWord(wordObj);
    setShowAdminPanel(true);
  };







  // UI States
  const [isTranslated, setIsTranslated] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showAi, setShowAi] = useState(false);

  // AI States
  const [aiData, setAiData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Details State
  const [showDetails, setShowDetails] = useState(false);
  const [showCaseExamples, setShowCaseExamples] = useState(false);

  // Quick Translate State
  const [quickTx, setQuickTx] = useState({ text: '', visible: false, x: 0, y: 0 });

  // Sentence Evaluator States
  const [showWriting, setShowWriting] = useState(false);
  const [userSentence, setUserSentence] = useState("");
  const [writingFeedback, setWritingFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showMiniStory, setShowMiniStory] = useState(false);

  // Quiz & Swipe States
  const [isExplaining, setIsExplaining] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeDelta, setSwipeDelta] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, isTop: true });
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 100;
  const apiKey = "";


  useEffect(() => {
    const handleGlobalScroll = () => {
      setQuickTx(prev => prev.visible ? { ...prev, visible: false } : prev);
    };
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    window.addEventListener('touchmove', handleGlobalScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleGlobalScroll);
      window.removeEventListener('touchmove', handleGlobalScroll);
    };
  }, []);



  const geminiFetch = async (userQuery, systemPrompt, isJson = true) => {
    if (!apiKey) {
      console.warn("API Key is missing!");
      throw new Error("API Key is missing!");
    }
    let retries = 0;
    const maxRetries = 3;
    const execute = async () => {
      try {
        const payload = {
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        };
        if (isJson) payload.generationConfig = { responseMimeType: "application/json" };
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          await new Promise(res => setTimeout(res, Math.pow(2, retries) * 500));
          return execute();
        }
        throw error;
      }
    };
    return execute();
  };

  const getSystemLang = () => appLang === 'tr' ? "T├╝rk├ğe" : "English";

  const handleWordClick = (e, cleanWord) => {
    e.stopPropagation();
    const translation = localDict[cleanWord];
    if (!translation) return;
    const rect = e.target.getBoundingClientRect();
    setQuickTx({ text: translation, visible: true, x: rect.left + (rect.width / 2), y: rect.top });
  };

  const renderClickableText = (text) => {
    if (!text) return "";
    if (!isRevealed) return "ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó";
    return text.split(' ').map((word, i) => {
      const cleanWord = word.replace(/^[.,:;!?()"'[\]]+|[.,:;!?()"'[\]]+$/g, '').toLowerCase();
      const hasTranslation = !!localDict[cleanWord];

      if (hasTranslation) {
        return (
          <span
            key={i}
            onClick={(e) => handleWordClick(e, cleanWord)}
            className={`cursor-pointer transition-colors border-b border-dashed ${isDark ? 'border-slate-500 hover:text-amber-400 hover:border-amber-400' : 'border-slate-300 hover:text-blue-600 hover:border-blue-600'}`}
          >
            {word}{' '}
          </span>
        );
      } else {
        return <span key={i}>{word} </span>;
      }
    });
  };

  const fetchAiData = async (word) => {
    if (isAiLoading || !apiKey) return;
    setIsAiLoading(true); setShowAi(true);
    const systemPrompt = `You are Ferhat Hoca. Provide feedback in ${getSystemLang()}. 
      STRICTLY return ONLY a valid raw JSON object. Do NOT wrap it in markdown. Do NOT use \`\`\`json.
      {
        "sentences": [{"type": "Professional", "eng": "...", "tr": "..."}, {"type": "Casual", "eng": "...", "tr": "..."}, {"type": "Academic", "eng": "...", "tr": "..."}],
        "mnemonic": "A creative memory tactic.",
        "scenario": "A short 2-line dialogue."
      }
      `;
    try {
      const text = await geminiFetch(`Analyze: "${word}"`, systemPrompt, true);
      setAiData(safeJsonParse(text));
    } catch { setAiData({ error: t.aiError }); }
    finally { setIsAiLoading(false); }
  };


  const evaluateSentence = async (targetWordStr) => {
    if (!userSentence.trim() || isEvaluating || !apiKey) return;
    setIsEvaluating(true);
    const systemPrompt = `Sen Ferhat Hoca's─▒n. Dilin: ${getSystemLang()}. Hedef kelime: "${targetWordStr}". ├û─şrenci Girdisi: "${userSentence}".
      DURUM 1: ├û─şrenci ─░ngilizce bir c├╝mle kurmaya ├ğal─▒┼şm─▒┼ş.
      DURUM 2: ├û─şrenci T├╝rk├ğe yard─▒m istiyor veya mazeret bildiriyor.
      E─şer DURUM 2 ise: Score k─▒sm─▒na motivasyon ama├ğl─▒ 10 ver. Feedback k─▒sm─▒nda ├Âzne/y├╝klem dizilimini ├ğok samimi bir dille ad─▒m ad─▒m ├Â─şret. CorrectedSentence k─▒sm─▒na ├ğevirisini yaz.
      SADECE A┼ŞA─ŞIDAK─░ RAW JSON FORMATINDA D├ûN:
      { "score": 10, "feedback": "Hoca'n─▒n samimi geri bildirimi.", "correctedSentence": "Do─şru ─░ngilizce c├╝mle." }`;
    try {
      const text = await geminiFetch(`Kelime: "${targetWordStr}", ├û─şrenci: "${userSentence}"`, systemPrompt, true);
      setWritingFeedback(safeJsonParse(text));
    } catch { setWritingFeedback({ error: t.aiError }); }
    finally { setIsEvaluating(false); }
  };

  const explainMistake = async () => {
    if (isExplaining || !apiKey) return;
    setIsExplaining(true);
    const questionText = quizQuestion.type === 'mc' ? quizQuestion.target.engDef : quizQuestion.type === 'tf' ? `${quizQuestion.target.word} = ${quizQuestion.displayedEngDef}` : quizQuestion.target.trExample;
    const systemPrompt = `You are Ferhat Hoca. Explain why the answer to this English question is "${quizQuestion.target.word}". Respond in ${getSystemLang()}. 
      STRICTLY return ONLY a valid raw JSON object.
      { "explanation": "..." }`;
    try {
      const text = await geminiFetch(`Question: ${questionText}, Answer: ${quizQuestion.target.word}`, systemPrompt, true);
      setQuizExplanation(safeJsonParse(text).explanation);
    } catch { setQuizExplanation(t.aiError); }
    finally { setIsExplaining(false); }
  };

  useEffect(() => {
    if (appMode === 'swipe') {
      // 1. Mastery Check: Quiz triggers when the deck is finished (if there are missed words)
      const isDeckEnd = currentWordIndex >= deck.length && deck.length > 0;

      // 2. Regular Interval: Quiz triggers every 5 swiped cards
      const isIntervalHit = cardsSwipedSinceQuiz >= 5;

      if ((isIntervalHit || isDeckEnd) && learningWords.length > 0) {
        generateQuiz();
      }
    }
  }, [currentWordIndex, deck.length, learningWords.length, appMode, cardsSwipedSinceQuiz]);

  const handleRetryQuiz = (entry) => {
    const target = vocab.find(w => (w.word || w.eng) === entry.word);
    if (!target) return;
    setIsQuizReview(true);
    setReviewingEntryId(entry.id);
    generateQuiz(target, entry.type);
    setShowDashboard(false);
  };

  const generateQuiz = (forcedTargetWord = null, forcedType = null) => {
    setIsTranslated(false); setShowForms(false); setShowAi(false); setShowWriting(false); setShowDetails(false);
    setAiData(null); setQuizExplanation(null); setQuickTx({ visible: false, text: '', x: 0, y: 0 });
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
        if (!options.find(opt => opt.id == randomOption.id)) options.push(randomOption); // Loose equality for ID safety
      }
      setQuizQuestion({ type: 'mc', target: targetWord, options: options.sort(() => Math.random() - 0.5) });
      setAppMode('quiz_mc');
    } else if (selectedType === 'sentence') {
      const targetExample = targetWord.engExample || targetWord.eng || "Sample Sentence.";
      // Better normalization for tokenization: removes smart quotes and all basic punctuation
      const cleanSentence = targetExample.replace(/[.,:;!?()"'[\]ÔÇ£ÔÇØÔÇİÔÇÖ]/g, '');
      const correctTokens = cleanSentence.split(/\s+/).filter(t => t.trim());

      const distractors = [];
      let failsafe = 0;
      while (distractors.length < 3 && failsafe < 100) {
        failsafe++;
        const randomWord = vocab[Math.floor(Math.random() * vocab.length)];
        const randomExample = randomWord.engExample || randomWord.eng || "";
        const randomTokens = randomExample.replace(/[.,:;!?()"'[\]ÔÇ£ÔÇØÔÇİÔÇÖ]/g, '').split(/\s+/).filter(t => t.trim());
        if (randomTokens.length > 0) {
          const randomToken = randomTokens[Math.floor(Math.random() * randomTokens.length)].toLowerCase();
          if (!correctTokens.map(t => t.toLowerCase()).includes(randomToken) && !distractors.includes(randomToken)) distractors.push(randomToken);
        }
      }
      const allTokens = [...correctTokens, ...distractors].sort(() => Math.random() - 0.5).map((text, index) => ({ id: index, text }));
      setQuizQuestion({ type: 'sentence', target: targetWord, correctTokens: correctTokens });
      setAvailableTokens(allTokens); setSelectedTokens([]);
      setAppMode('quiz_sentence');
    } else if (selectedType === 'tf') {
      let isTrue = Math.random() > 0.5;
      let displayWord = targetWord;

      if (!isTrue) {
        const decoys = vocab.filter(w => w.id != targetWord.id && w.pos === targetWord.pos);
        if (decoys.length > 0) {
          displayWord = decoys[Math.floor(Math.random() * decoys.length)];
        } else {
          isTrue = true; // Fallback if no decoy found
          displayWord = targetWord;
        }
      }

      setQuizQuestion({
        type: 'tf',
        target: targetWord,
        displayedEngDef: displayWord.engDef || displayWord.meaning,
        displayedTrDef: displayWord.trDef || displayWord.trMeaning,
        isCorrectPair: isTrue
      });
      setAppMode('quiz_tf');
    }
    setQuizFeedback(null);
  };

  const handleSwipe = (direction, isComplete = false) => {
    if (swipeDirection) return;
    if (currentWordIndex >= deck.length) return;

    if (!isComplete) {
      const todayStr = new Date(currentDate).toDateString();
      const stats = dailyStats[todayStr] || { swiped: 0, swipedIds: [] };
      const currentWord = deck[currentWordIndex];
      const isReview = currentWord && currentWord.sm2.rep > 0;
      const alreadySwipedToday = currentWord && (stats.swipedIds || []).includes(currentWord.id);

      // Only block if it's a NEW discovery (Stranger) and quota is met for that mode
      // Chill mode is exempt from daily limits
      const currentSwipedInMode = vocabMode === 'phrasal' ? (stats.swiped_phrasal || 0) : (stats.swiped_words || 0);
      if (vocabMode !== 'chill' && !isReview && !alreadySwipedToday && currentSwipedInMode >= 12 && !isRetryMode) {
        alert("G├╝nl├╝k yeni ke┼şif kotana ula┼şt─▒n (12/12). Daha ├Ânce g├Ârd├╝─ş├╝n kelimelere (Tan─▒┼ş/S─▒rda┼ş) s─▒n─▒rs─▒z devam edebilirsin ama yeni kelime i├ğin yar─▒n─▒ bekle!");
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
        quality = 5; // Mastered
        mode = 'perfect';
        sounds.playMastery();
      } else {
        quality = 4; // Got it
        sounds.playSuccess();
      }
    } else {
      if (isRevealed) {
        quality = 2; // Remind Me (Stubborn)
        sounds.playError();
      } else {
        quality = 0; // New to Me (Stranger)
        sounds.playError();
      }
    }

    if (vocabMode !== 'chill') {
      // We now allow scientific SM-2 progress during "Retry" to satisfy "review not working"
      // but isDiscovery logic in trackSwipe will still protect the daily visual limit/quota
      const updatedWord = calculateAdvancedSM2(currentWord, quality, mode, currentDate, sm2Multiplier, false);
      setVocab(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
      trackSwipe(currentWord.word || currentWord.text || currentWord.eng, quality, vocabMode, isCorrect);

      if (!isCorrect) {
        setLearningWords(prev => {
          if (!prev.find(w => w.id === updatedWord.id)) {
            return [...prev, updatedWord];
          }
          return prev;
        });
      } else {
        setLearningWords(prev => prev.filter(w => w.id !== updatedWord.id));
      }
    } else {
      // Chill Mode Passive Track
      trackSwipe(currentWord.text || currentWord.eng, quality, 'chill', isCorrect);
    }

    // Push to history for Undo
    setHistory(prev => [...prev, {
      vocab: [...vocab],
      learningWords: [...learningWords],
      currentWordIndex,
      isRevealed,
      currentWord: { ...currentWord }
    }].slice(-10)); // Keep last 10 for safety

    setSwipeDirection(null);
    setIsTranslated(false);
    setShowForms(false); setShowAi(false); setShowWriting(false); setShowDetails(false); setShowCaseExamples(false);
    setUserSentence(""); setWritingFeedback(null); setAiData(null);
    setQuickTx({ visible: false, text: '', x: 0, y: 0 });

    // Track Swipe Log for Vault
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

  const handleUndo = () => {
    if (history.length === 0) return;
    const prevState = history[history.length - 1];

    // Revert daily stats if necessary
    if (prevState.currentWord) {
      const todayStr = new Date(currentDate).toDateString();
      setDailyStats(prev => {
        const dayData = prev[todayStr];
        if (!dayData) return prev;

        const card = prevState.currentWord;
        const existsInSwiped = (dayData.swipedIds || []).includes(card.id);

        if (existsInSwiped) {
          // If we had swiped it today, we need to know if it was ALREADY swiped before this action
          // We'll simplify: if we undo, and the word is in the swiped list, we remove it and decrement
          // This might be slightly aggressive but fits the 12-quota UX
          const newSwipedIds = (dayData.swipedIds || []).filter(id => id !== card.id);
          return {
            ...prev,
            [todayStr]: {
              ...dayData,
              swiped: Math.max(0, dayData.swiped - 1),
              swipedIds: newSwipedIds
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
  };

  const handleQuizAction = (isCorrect, wrongMessage, correctValueLocal, userValueLocal, quizType) => {
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

    if (quizType === 'sentence') {
      mode = 'production';
      quality = isCorrect ? 5 : 1;
    }

    const updatedWord = calculateAdvancedSM2(quizQuestion.target, quality, mode, currentDate, sm2Multiplier);
    setVocab(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
    trackSwipe(quizQuestion.target.word || quizQuestion.target.text || quizQuestion.target.eng, quality, 'quiz', isCorrect);

    setQuizLog(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      history: [{
        id: currentDate + Math.random(), // Unique key based on sim time
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
        if (isQuizReview) {
          setShowDashboard(true);
          setShowQuizHistory(true);
          setIsQuizReview(false);
          setReviewingEntryId(null);
        }
        setAppMode('swipe');
        if (deck[currentWordIndex]) setIsRevealed(false);
      }, 1500);
    } else {
      sounds.playError();
      setQuizFeedback({ type: 'error', message: wrongMessage, correctValueLocal, userValueLocal });
    }
  };

  const handleSentenceCheck = () => {
    const normalize = (str) => {
      if (!str) return "";
      return str
        .replace(/[.,:;!?()"'[\]ÔÇ£ÔÇØÔÇİÔÇÖ]/g, '')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
    };

    const userTokens = selectedTokens.map(tok => normalize(tok.text));
    const targetTokens = quizQuestion.correctTokens.map(tok => normalize(tok));

    const userSentenceStr = userTokens.join(' ');
    const mainCorrectSentenceStr = targetTokens.join(' ');

    const altExamples = (quizQuestion.target.altExamples || []).map(alt => normalize(alt));

    // 1. Exact Match (Normalized)
    const isExactMatch = (userSentenceStr === mainCorrectSentenceStr) || altExamples.includes(userSentenceStr);

    // 2. Fuzzy Match (Bag of Words)
    // If all required words are present, we check if the grammar is likely correct.
    // For this context, we'll allow any permutation of the target tokens as long as all are used.
    const isBagOfWordsMatch = userTokens.length === targetTokens.length &&
      [...userTokens].sort().join('|') === [...targetTokens].sort().join('|');

    let isCorrect = isExactMatch || isBagOfWordsMatch;
    let feedbackMessage = isExactMatch ? t.correctAwesome : (appLang === 'tr' ? `Do─şru! Alternatif kullan─▒m: "${quizQuestion.target.engExample || quizQuestion.target.eng}"` : `Correct! Alternative usage: "${quizQuestion.target.engExample || quizQuestion.target.eng}"`);

    const userDisplay = selectedTokens.map(tok => tok.text).join(' ');

    handleQuizAction(isCorrect, isCorrect ? feedbackMessage : t.wrongOrder, quizQuestion.target.engExample || quizQuestion.target.eng, userDisplay, 'sentence');
  };

  const toggleToken = (token, from) => {
    if (quizFeedback) return;
    if (from === 'available') {
      setAvailableTokens(prev => prev.filter(tok => tok.id !== token.id));
      setSelectedTokens(prev => [...prev, token]);
    } else {
      setSelectedTokens(prev => prev.filter(tok => tok.id !== token.id));
      setAvailableTokens(prev => [...prev, token]);
    }
  };

  const onDragStart = (e, index) => {
    dragItemIndex.current = index; e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode); e.target.style.opacity = "0.5";
  };
  const onDragEnter = (e, index) => { dragOverItemIndex.current = index; };
  const onDragEnd = (e) => {
    e.target.style.opacity = "1";
    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null && dragItemIndex.current !== dragOverItemIndex.current) {
      const _selectedTokens = [...selectedTokens];
      const draggedItemContent = _selectedTokens.splice(dragItemIndex.current, 1)[0];
      _selectedTokens.splice(dragOverItemIndex.current, 0, draggedItemContent);
      setSelectedTokens(_selectedTokens);
    }
    dragItemIndex.current = null; dragOverItemIndex.current = null;
  };


  const bgMain = 'mesh-bg';
  const textMain = isDark ? 'text-slate-100' : 'text-slate-900';
  const cardBg = isDark ? 'glass-dark border-transparent shadow-premium' : 'glass border-transparent shadow-premium';

  const swipedToday = vocabMode === 'phrasal' ? (dailyStats[new Date(currentDate).toDateString()]?.swiped_phrasal || 0) : (dailyStats[new Date(currentDate).toDateString()]?.swiped_words || 0);
  const isDeckFinished = deck.length === 0 || currentWordIndex >= deck.length || (!isRetryMode && swipedToday >= 12);
  useAchievements(learnedCount, totalReviewsAll, strongCount);

  const { unlockedAchievements, achievementQueue, handleAchievementComplete } = useApp();



  const renderCardContentWrapper = (word, isSaved, isSystem = false) => {
    const todayStr = new Date(currentDate).toDateString();
    const modeSwiped = vocabMode === 'phrasal' ? (dailyStats[todayStr]?.swiped_phrasal || 0) : (dailyStats[todayStr]?.swiped_words || 0);
    const swipedToday = modeSwiped;
    const isStranger = word && word.sm2.rep === 0;

    const cardBgClass = isDark ? 'glass-dark border-transparent shadow-premium' : 'glass border-transparent shadow-premium';

    // Stats for the Discovery Bar (Shared Discovery Count)
    const stats = {
      isStranger,
      currentDiscovery: isRetryMode ? currentWordIndex : Math.min(swipedToday, 12), // Global count of NEW cards today
      totalDiscovery: 12,
      current: currentWordIndex + 1,
      total: deck.length,
      overallCurrent: learnedCount + 1,
      overallTotal: vocab.length,
      timeRemaining: Math.max(1, Math.ceil((deck.length - currentWordIndex) * 0.25))
    };

    const commonProps = {
      onUndo: handleUndo,
      canUndo: history.length > 0 && !isSystem,
      isSystem
    };

    if (vocabMode === 'phrasal') {
      return (
        <PhrasalCard
          wordObj={word}
          isSavedStatus={isSaved}
          toggleSaveWord={toggleSaveWord}
          showCaseExamples={showCaseExamples}
          setShowCaseExamples={setShowCaseExamples}
          showMiniStory={showMiniStory}
          setShowMiniStory={setShowMiniStory}
          isDark={isDark}
          t={t}
          appLang={appLang}
          isRevealed={isRevealed}
          setIsRevealed={setIsRevealed}
          renderClickableText={renderClickableText}
          stats={stats}
          isAdmin={isAdmin}
          isTranslated={isTranslated}
          setIsTranslated={setIsTranslated}
          onDeleteWord={deleteWord}
          onEditWord={editWord}
          cardBg={cardBgClass}
          onEvolveBond={evolveBond}
          {...commonProps}
        />
      );
    }
    return (
      <Card
        wordObj={word}
        isSavedStatus={isSaved}
        toggleSaveWord={toggleSaveWord}
        showWriting={showWriting}
        setShowWriting={setShowWriting}
        userSentence={userSentence}
        setUserSentence={setUserSentence}
        writingFeedback={writingFeedback}
        setWritingFeedback={setWritingFeedback}
        isEvaluating={isEvaluating}
        evaluateSentence={evaluateSentence}
        showAi={showAi}
        setShowAi={setShowAi}
        aiData={aiData}
        isAiLoading={isAiLoading}
        fetchAiData={fetchAiData}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        showForms={showForms}
        setShowForms={setShowForms}
        showCaseExamples={showCaseExamples}
        setShowCaseExamples={setShowCaseExamples}
        showMiniStory={showMiniStory}
        setShowMiniStory={setShowMiniStory}
        isDark={isDark}
        t={t}
        appLang={appLang}
        isAdmin={isAdmin}
        isTranslated={isTranslated}
        setIsTranslated={setIsTranslated}
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        renderClickableText={renderClickableText}
        setQuickTx={setQuickTx}
        stats={stats}
        onDeleteWord={deleteWord}
        onEditWord={editWord}
        cardBg={cardBgClass}
        onEvolveBond={evolveBond}
        {...commonProps}
      />
    );
  };

  // Common UI Wrapper variables
  // Common UI components that should be globally accessible and appear on top
  const globalModals = (
    <>
      <SettingsModal />

      <LevelTestModal
        isOpen={showLevelTest}
        onClose={() => setShowLevelTest(false)}
        t={t}
        isDark={isDark}
        streak={streak}
      />

      {showAdminPanel && (
        <AdminPanel
          onResetSystem={() => {
            if (!window.confirm("DİKKAT: Tüm çalışma verilerin, klasörlerin ve özel eklediğin kelimeler silinecek. Sadece sistem kelimeleri kalacak. Emin misin?")) return;
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('vocabapp_')) {
                localStorage.removeItem(key);
              }
            });
            window.location.reload();
          }}
          onClose={() => { setShowAdminPanel(false); setEditingWord(null); }}
          editingWord={editingWord}
          setEditingWord={setEditingWord}
        />
      )}

      {showCommunityHub && (
        <CommunityHub
          isDark={isDark}
          t={t}
          isAdmin={isAdmin}
          appLang={appLang}
          onClose={() => setShowCommunityHub(false)}
        />
      )}

      {showLibrary && <Library />}

      {showArenaGate && (
        <ArenaGate
          isDark={isDark}
          t={t}
          isAdmin={isAdmin}
          onClose={() => setShowArenaGate(false)}
          onModeSelect={(mode) => {
            setShowArenaGate(false);
            if (mode === 'streak') setShowStreakRun(true);
            if (mode === 'blitz') setShowSpeedBlitz(true);
          }}
        />
      )}

      {showStreakRun && (
        <StreakRunArena
          isDark={isDark}
          t={t}
          isAdmin={isAdmin}
          onClose={() => setShowStreakRun(false)}
        />
      )}

      {showSpeedBlitz && (
        <SpeedBlitzArena
          isDark={isDark}
          t={t}
          onClose={() => setShowSpeedBlitz(false)}
        />
      )}
    </>
  );

  const bottomNavigation = (
    <BottomNav
      isDark={isDark}
      showVault={showVault}
      onVaultClick={() => {
        sounds.playClick();
        if (showVault) setActiveVaultFolder(null);
        else { setShowVault(true); setShowDashboard(false); setShowSettings(false); }
      }}
      showDashboard={showDashboard}
      onDashboardClick={() => {
        sounds.playClick();
        if (showDashboard) setShowQuizHistory(false);
        else { setShowDashboard(true); setShowVault(false); setShowSettings(false); }
      }}
      onHomeClick={() => {
        sounds.playClick();
        if (!showVault && !showDashboard) setAppMode('swipe');
        else { setShowVault(false); setShowDashboard(false); setShowSettings(false); }
      }}
      streak={streak}
      setShowSettings={(val) => { sounds.playClick(); setShowSettings(val); }}
      t={t}
      onSecretClick={() => { sounds.playClick(); setShowAdminPanel(true); }}
      isAdmin={isAdmin}
      dailyProgress={dailyProgress * 100}
      lastActionStatus={lastActionStatus}
    />
  );


  const modeSelector = (
    <div className="flex justify-center w-full z-[600] pointer-events-none">
      <div className={`flex w-auto p-1.5 rounded-full border shadow-2xl pointer-events-auto transition-all ${isDark ? 'bg-slate-900/60 border-slate-700/50 backdrop-blur-2xl' : 'bg-white/60 border-slate-200/50 backdrop-blur-2xl'}`}>
        {[
          { id: 'words', label: t.modeWords, icon: BookOpen },
          { id: 'phrasal', label: t.modePhrasal, icon: Layers },
          { id: 'chill', label: t.modeChill, icon: Coffee }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => { sounds.playClick(); setVocabMode(mode.id); }}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${vocabMode === mode.id ? (isDark ? 'bg-indigo-500 text-white shadow-lg scale-105' : 'bg-indigo-600 text-white shadow-md scale-105') : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
          >
            <mode.icon size={12} strokeWidth={3} />
            <span className="hidden xs:inline">{mode.label}</span>
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => { sounds.playClick(); advanceTime(); }}
            className="ml-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black shadow-lg hover:bg-amber-500 transition-all flex items-center gap-2 scale-95"
            title="Simüle Et: Yarın"
          >
            <Clock size={12} strokeWidth={3} />
            <span>+1 GÜN</span>
          </button>
        )}
      </div>
    </div>
  );



  if (maintenanceMode) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 z-[999] text-center">
        <ServerCrash size={64} className="text-red-500 mb-6 animate-pulse" />
        <h1 className="text-2xl font-black text-white mb-2">{t.maintenanceTitle || 'Sistem Bakımda'}</h1>
        <p className="text-slate-400 font-bold max-w-sm mb-8">{globalAnnouncement || t.maintenanceDesc || 'Size daha iyi bir deneyim sunmak için güncellemeler yapıyoruz. Lütfen biraz sonra tekrar deneyin.'}</p>

        {isAdmin ? (
          <button
            onClick={() => setMaintenanceMode(false)}
            className="px-8 py-4 bg-amber-400 text-slate-900 font-black rounded-2xl shadow-glow-amber hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
          >
            Admin Geçişi (Panelden Kapatabilirsin)
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button onClick={() => {
              const reached = handleVersionClick();
              if (reached) {
                const key = window.prompt("Master Key?");
                if (verifyMasterKey(key)) {
                  setMaintenanceMode(false);
                }
              }
            }} className="text-[10px] uppercase font-black tracking-widest text-slate-700">Attempt Admin Login</button>
          </div>
        )}
      </div>
    );
  }

  if (showDashboard) {
    return (
      <>
        <Dashboard
          onRetryQuiz={handleRetryQuiz}
        />
        {bottomNavigation}
        {globalModals}
      </>
    );
  }

  if (showVault) {
    return (
      <>
        <Vault
          renderCardContent={renderCardContentWrapper}
          quickTx={quickTx}
          setQuickTx={setQuickTx}
        />
        {bottomNavigation}
        {globalModals}
      </>
    );
  }

  if (vocabMode === 'chill') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-start font-sans overflow-hidden transition-all duration-300 relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`}>
        <ChillMode
          onDeleteWord={deleteWord}
          onEditWord={editWord}
        />
        {modeSelector}
        <div className="relative z-[500] w-full">
          {bottomNavigation}
        </div>
        {globalModals}
      </div>
    );
  }

  const currentWord = deck[currentWordIndex];
  const isSaved = currentWord && savedWords.some(w => w.id === currentWord.id);

  return (
    <div className={`h-dvh w-full overflow-hidden flex flex-col font-sans transition-all duration-300 relative ${isDark ? 'dark text-slate-100' : 'text-slate-900'}`} onClick={() => setQuickTx(prev => ({ ...prev, visible: false }))}>

      {quickTx.visible && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: `${quickTx.x}px`, top: `${quickTx.y - 12}px` }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-5 py-3 bg-indigo-600 text-white text-base font-black rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.4)] animate-fade-in whitespace-nowrap">
            {quickTx.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-indigo-600" />
          </div>
        </div>
      )}

      {/* ÜST: Dynamic Island / Çentik güvenli başlık */}
      <header className="w-full z-[600] flex flex-col items-center" style={{ paddingTop: 'calc(env(safe-area-inset-top, 20px) + 16px)' }}>
        <AchievementPopup queue={achievementQueue} onComplete={handleAchievementComplete} isDark={isDark} t={t} isAdmin={isAdmin} />
        <div className="scale-90 transform origin-top pointer-events-auto">
          {modeSelector}
        </div>
      </header>

      {/* ORTA: Kart alanı (Boşluğu kapatan esnek yapı) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 md:pb-28 relative overflow-hidden min-h-0">
        <div className="relative w-full max-w-[420px] h-full max-h-[620px] flex flex-col items-center justify-center">
          {isLogoVisible ? (
            <div
              className="flex flex-col items-center animate-fade-out"
              style={{ animationDelay: '2s' }}
            >
              <BrandLogo isDark={isDark} isAdmin={isAdmin} />
              {isAdmin && <div className="mt-2 px-3 py-1 bg-amber-400 text-black text-[8px] font-black rounded-full shadow-lg shadow-amber-400/20 animate-pulse">ADMIN OVERDRIVE</div>}
            </div>
          ) : (
            <div className="animate-fade-in w-full h-full flex flex-col items-center justify-center">

              {/* Global Announcement Banner (Space-efficient) */}
              {globalAnnouncement && (
                <div className="w-full max-w-sm mb-4 animate-slide-up group shrink-0">
                  <div className="relative p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-lg overflow-hidden">
                    <div className="relative z-10 flex items-center gap-3">
                      <Sparkles size={14} className="text-amber-600 animate-pulse" />
                      <p className="text-[10px] font-black tracking-tight leading-tight">{globalAnnouncement}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative w-full h-full">
                {appMode.startsWith('quiz_') ? (
                  <Quiz
                    handleQuizAction={handleQuizAction}
                    toggleToken={toggleToken}
                    handleSentenceCheck={handleSentenceCheck}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragEnd={onDragEnd}
                    explainMistake={explainMistake}
                    isExplaining={isExplaining}
                  />
                ) : isDeckFinished ? (
                  <div className={`text-center w-full h-full ${cardBg} p-8 pt-16 rounded-[3.5rem] shadow-premium border animate-fade-in relative overflow-visible flex flex-col items-center justify-center`}>
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 z-0 pointer-events-none drop-shadow-2xl opacity-90 scale-110">
                      <Mascot look="happy" size="xl" isDark={isDark} />
                    </div>
                    <h2 className={`text-4xl font-black mb-4 tracking-tighter relative z-10 drop-shadow-md ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{t.congrats}</h2>
                    <p className="mb-6 font-bold opacity-60 uppercase tracking-widest text-[10px]">{t.deckFinished}</p>
                    <div className={`w-full mb-8 p-5 rounded-2xl border-2 border-dashed ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <input type="hidden" value="reassurance" />
                      <div className="flex items-center justify-center gap-2 mb-3 text-indigo-500">
                        <Brain size={24} />
                        <p className="font-black uppercase tracking-widest text-xs">SM-2 Motoru Aktif</p>
                      </div>
                      <p className="font-bold text-lg">{t.dueTomorrowMins.replace('{words}', dueTomorrowCount).replace('{mins}', dueTomorrowMins)}</p>
                    </div>
                    <button onClick={() => refreshDeck(true)} className="w-full py-4 rounded-2xl font-black text-slate-900 bg-amber-400 hover:bg-amber-500 transition-transform active:scale-95 shadow-lg">
                      <RefreshCw size={20} className="inline mr-2" /> {t.continueTraining}
                    </button>
                  </div>
                ) : (
                  <SwipeableCard
                    key={currentWordIndex}
                    isDark={isDark}
                    appMode={appMode}
                    onSwipe={handleSwipe}
                    swipeDirection={swipeDirection}
                    isRevealed={isRevealed}
                  >
                    {renderCardContentWrapper(currentWord, isSaved)}
                  </SwipeableCard>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ALT: Navbar (Safe area ile uyumlu) */}
      <footer className="w-full flex-col items-center gap-2 opacity-60 hidden md:flex mb-4">
        <div className="flex gap-6">
          <a href="https://www.instagram.com/ferhat_hoca_ingilizce/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"><Instagram size={12} /> instagram</a>
          <a href="https://ferhathocaingilizce.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"><Globe size={12} /> ferhathocaingilizce.com</a>
        </div>
      </footer>

      {/* Fixed nav + iOS Safari bottom gap filler */}
      <nav className={`fixed bottom-0 left-0 right-0 z-[500] backdrop-blur-xl ${isDark ? 'bg-slate-900/80' : 'bg-white/80'}`}
           style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {bottomNavigation}
      </nav>
      {/* Safari URL-bar-gizlenince oluşan siyah boşluğu kapatır */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[499] ${isDark ? 'bg-slate-900' : 'bg-white'}`}
        style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
        aria-hidden="true"
      />
      {globalModals}
    </div>
  );
}
