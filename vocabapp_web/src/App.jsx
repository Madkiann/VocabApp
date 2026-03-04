import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RefreshCw, Check, X, Sun, Moon, Instagram, Globe, Archive, Languages, Hourglass, BarChart3, Brain, Flame, Clock, Sparkles, ArrowRight, Menu, Settings, Layers, Coffee, BookOpen, ServerCrash, Undo2 } from 'lucide-react';
import { rawVocabulary, initialVocabulary, initialPhrasalVerbs, localDict } from './data/vocabulary';
import { translations } from './data/translations';
import { safeJsonParse, calculateAdvancedSM2, shuffleArray } from './utils/helpers';

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

// Hooks
import { useAdmin } from './hooks/useAdmin';
import { useTheme } from './hooks/useTheme';
import { useVocabStats } from './hooks/useVocabStats';
import { useAchievements } from './hooks/useAchievements';

// Sounds
import { sounds } from './utils/sounds';

export default function App() {
  const [appLang, setAppLang] = useState('tr');
  const t = translations[appLang];

  // Auth / Admin State
  const [userEmail, setUserEmail] = useState(null);
  const { isAdmin, handleVersionClick, verifyMasterKey } = useAdmin(userEmail);

  const [appMode, setAppMode] = useState('swipe');
  const [cardsSwipedSinceQuiz, setCardsSwipedSinceQuiz] = useState(0);
  const [vocabMode, setVocabMode] = useState('words'); // words, phrasal, chill

  const [themePref, setThemePref] = useState(() => localStorage.getItem('vocabapp_theme') || 'system');
  const [systemIsDark, setSystemIsDark] = useState(window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [streak, setStreak] = useState(1);
  const [history, setHistory] = useState([]);
  const [isQuizReview, setIsQuizReview] = useState(false);
  const [reviewingEntryId, setReviewingEntryId] = useState(null);
  const [maxStreak, setMaxStreak] = useState(() => parseInt(localStorage.getItem('vocabapp_max_streak') || '0', 10));
  const [quizLog, setQuizLog] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem('vocabapp_quiz_log'));
    return { total: 0, correct: 0, history: [], ...(stored || {}) };
  });
  const [swipeLog, setSwipeLog] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem('vocabapp_swipe_log'));
    return { correctIds: [], wrongIds: [], ...(stored || {}) };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Admin Features States
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [sm2Multiplier, setSm2Multiplier] = useState(() => parseFloat(localStorage.getItem('vocabapp_sm2_multiplier') || '1.0'));
  const [globalAnnouncement, setGlobalAnnouncement] = useState(() => localStorage.getItem('vocabapp_announcement') || '');
  const [difficultWords, setDifficultWords] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_difficult_words')) || []);
  const [totalSwipes, setTotalSwipes] = useState(() => parseInt(localStorage.getItem('vocabapp_total_swipes') || '0', 10));
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('vocabapp_sound_enabled') !== 'false');

  useEffect(() => {
    sounds.enabled = soundEnabled;
    localStorage.setItem('vocabapp_sound_enabled', soundEnabled);
  }, [soundEnabled]);


  // Advanced System States
  const [modeSwipes, setModeSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_mode_swipes')) }));
  const [hourlySwipes, setHourlySwipes] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_hourly_swipes')) || new Array(24).fill(0));
  const [systemLogs, setSystemLogs] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_system_logs')) || []);
  const [appStartDate] = useState(() => {
    const stored = localStorage.getItem('vocabapp_start_date');
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem('vocabapp_start_date', now.toString());
    return now;
  });

  const appDay = Math.min(3, Math.floor((currentDate - appStartDate) / (24 * 60 * 60 * 1000)) + 1);

  const [maintenanceMode, setMaintenanceMode] = useState(() => localStorage.getItem('vocabapp_maintenance') === 'true');
  const [customWords, setCustomWords] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem('vocabapp_custom_words'));
    if (!stored) return [];
    // Migration for schema change: eng/tr -> word/trWord
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

  const [editingWord, setEditingWord] = useState(null);
  const [deletedWords, setDeletedWords] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_deleted_words')) || []);

  // Analytics Enhancement
  const [rightSwipes, setRightSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_right_swipes')) }));
  const [leftSwipes, setLeftSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_left_swipes')) }));
  const [modeTime, setModeTime] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_mode_time')) }));
  const [dailyStats, setDailyStats] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_daily_stats')) || {});

  const [lastActionStatus, setLastActionStatus] = useState(null); // 'correct', 'wrong', null
  const [dauDisplay, setDauDisplay] = useState(1); // Set to exact usage counter
  const [chillSortMode, setChillSortMode] = useState('random'); // Default to random discovery

  useEffect(() => {
    // Intercept console.error to log to User Shadowing system
    const originalError = console.error;
    console.error = (...args) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      const log = { time: new Date().toLocaleTimeString(), message: msg.substring(0, 150) };
      setSystemLogs(prev => [log, ...prev].slice(0, 50));
      originalError(...args);
    };
    return () => console.error = originalError;
  }, []);

  useEffect(() => localStorage.setItem('vocabapp_sm2_multiplier', sm2Multiplier.toString()), [sm2Multiplier]);
  useEffect(() => localStorage.setItem('vocabapp_announcement', globalAnnouncement), [globalAnnouncement]);
  useEffect(() => localStorage.setItem('vocabapp_difficult_words', JSON.stringify(difficultWords)), [difficultWords]);
  useEffect(() => localStorage.setItem('vocabapp_total_swipes', totalSwipes.toString()), [totalSwipes]);
  useEffect(() => localStorage.setItem('vocabapp_mode_swipes', JSON.stringify(modeSwipes)), [modeSwipes]);
  useEffect(() => localStorage.setItem('vocabapp_hourly_swipes', JSON.stringify(hourlySwipes)), [hourlySwipes]);
  useEffect(() => localStorage.setItem('vocabapp_system_logs', JSON.stringify(systemLogs)), [systemLogs]);
  useEffect(() => localStorage.setItem('vocabapp_maintenance', String(maintenanceMode)), [maintenanceMode]);
  useEffect(() => localStorage.setItem('vocabapp_custom_words', JSON.stringify(customWords)), [customWords]);
  useEffect(() => localStorage.setItem('vocabapp_right_swipes', JSON.stringify(rightSwipes)), [rightSwipes]);
  useEffect(() => localStorage.setItem('vocabapp_left_swipes', JSON.stringify(leftSwipes)), [leftSwipes]);
  useEffect(() => localStorage.setItem('vocabapp_mode_time', JSON.stringify(modeTime)), [modeTime]);
  useEffect(() => localStorage.setItem('vocabapp_deleted_words', JSON.stringify(deletedWords)), [deletedWords]);
  useEffect(() => localStorage.setItem('vocabapp_daily_stats', JSON.stringify(dailyStats)), [dailyStats]);

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
        swipedIds: [] // Track unique words swiped today
      };

      const isQuiz = modeParam === 'quiz';
      const newHourlyActions = [...(dayData.hourlyActions || new Array(24).fill(0))];
      newHourlyActions[hour] = (newHourlyActions[hour] || 0) + 1;

      // Find the card ID to track unique swipes - search all possible sources
      const allPossibleVocab = [...wordVocab, ...phrasalVocab, ...chillVocab, ...customWords];
      const card = allPossibleVocab.find(w => (w.text || w.eng) === wordText || w.word === wordText);
      const cardId = card?.id;

      const alreadySwiped = cardId && (dayData.swipedIds || []).includes(cardId);
      const newSwipedIds = (cardId && !alreadySwiped) ? [...(dayData.swipedIds || []), cardId] : (dayData.swipedIds || []);

      // Discovery Logic (Mode-specific 12 Quota)
      const isReview = card && card.sm2 && card.sm2.rep > 0;
      const isStranger = card && card.sm2 && card.sm2.rep === 0;
      const isDiscovery = !alreadySwiped && isStranger && !isReview && !isRetryMode;

      // Determine which counter to increment
      let actualMode = modeParam;
      if (isQuiz && card) {
        // If it's a quiz, infer mode from card
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

    localStorage.setItem('vocabapp_last_active_date', new Date(currentDate).toDateString());
  };

  const deleteWord = (wordId) => {
    if (!window.confirm("Bu kelimeyi silmek istedi─şine emin misin?")) return;
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

  useEffect(() => {
    localStorage.setItem('vocabapp_theme', themePref);

    // Force immediate check on mount/pref change
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e) => setSystemIsDark(e.matches);

    // Modern way
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Legacy way (Safari/Old Chrome)
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [themePref]);

  const isDark = themePref === 'system' ? systemIsDark : themePref === 'dark';

  // Sync theme class to root for better CSS targeting (fixes Android background)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Update theme-color meta tag for mobile browser UI
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = isDark ? '#051025' : '#f1f5f9';
  }, [isDark]);

  const cycleTheme = () => {
    if (themePref === 'system') setThemePref('light');
    else if (themePref === 'light') setThemePref('dark');
    else setThemePref('system');
  };

  const getThemeText = () => {
    if (themePref === 'system') return 'Sistem';
    return themePref === 'dark' ? 'Karanlık' : 'Aydınlık';
  };

  const [wordVocab, setWordVocab] = useState([...initialVocabulary]);
  const [phrasalVocab, setPhrasalVocab] = useState([...initialPhrasalVerbs]);
  const [chillVocab, setChillVocab] = useState([...initialVocabulary].map(w => ({ ...w, sm2: { ...w.sm2, ef: 3.0 } })));

  const computedWords = useMemo(() => {
    const custom = customWords.filter(w => w.targetMode === 'words');
    const overrideIds = new Set(custom.map(w => w.id));
    const deletedIds = new Set(deletedWords);

    // Show up to 36 words for the vocab tab as requested
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
      return [...baseChill].reverse(); // Assuming original order is chronological
    }
    // Default: Random Discovery (Fisher-Yates)
    return shuffleArray(baseChill);
  }, [chillVocab, customWords, deletedWords, chillSortMode]);

  // Compute active vocab based on mode
  const vocab = useMemo(() => {
    if (vocabMode === 'words') return computedWords;
    if (vocabMode === 'phrasal') return computedPhrasals;
    return computedChill;
  }, [vocabMode, computedWords, computedPhrasals, computedChill]);

  const setVocab = (setter) => {
    if (vocabMode === 'words') setWordVocab(setter);
    else if (vocabMode === 'phrasal') setPhrasalVocab(setter);
    else setChillVocab(setter);
  };


  const [deck, setDeck] = useState([]);
  const [learningWords, setLearningWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(() => {
    const saved = localStorage.getItem('vocabapp_current_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [vaultFolders, setVaultFolders] = useState(['General']);
  const [activeVaultFolder, setActiveVaultFolder] = useState(null);
  const [showQuizHistory, setShowQuizHistory] = useState(false);

  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
      localStorage.setItem('vocabapp_max_streak', streak.toString());
    }
  }, [streak, maxStreak]);

  useEffect(() => {
    localStorage.setItem('vocabapp_current_index', currentWordIndex.toString());
  }, [currentWordIndex]);

  useEffect(() => {
    localStorage.setItem('vocabapp_quiz_log', JSON.stringify(quizLog));
  }, [quizLog]);

  useEffect(() => {
    localStorage.setItem('vocabapp_swipe_log', JSON.stringify(swipeLog));
  }, [swipeLog]);

  const toggleSaveWord = (word) => {
    let newSaved;
    if (savedWords.some(w => w.id === word.id)) {
      newSaved = savedWords.filter(w => w.id !== word.id);
    } else {
      newSaved = [...savedWords, { ...word, folder: 'General' }];
    }
    setSavedWords(newSaved);
  };

  const updateWordFolder = (wordId, folderName) => {
    setSavedWords(prev => prev.map(w => w.id === wordId ? { ...w, folder: folderName } : w));
  };

  const deleteVaultFolder = (folderName) => {
    if (folderName === 'General') return;
    setVaultFolders(prev => prev.filter(f => f !== folderName));
    setSavedWords(prev => prev.map(w => w.folder === folderName ? { ...w, folder: 'General' } : w));
  };

  const renameVaultFolder = (oldName, newName) => {
    const trimmed = newName.trim();
    if (oldName === 'General' || !trimmed || vaultFolders.includes(trimmed)) return;
    setVaultFolders(prev => prev.map(f => f === oldName ? trimmed : f));
    setSavedWords(prev => prev.map(w => w.folder === oldName ? { ...w, folder: trimmed } : w));
  };

  const jumpToCard = (cardId, targetMode) => {
    setVocabMode(targetMode);
    setShowAdminPanel(false);
    setShowDashboard(false);
    setShowVault(false);
    setAppMode('swipe');
    // We need the index in the deck. Since deck is derived from vocab, 
    // we find it in the vocab for that mode.
    let targetVocab;
    if (targetMode === 'words') targetVocab = computedWords;
    else if (targetMode === 'phrasal') targetVocab = computedPhrasals;
    else targetVocab = computedChill;

    const idx = targetVocab.findIndex(w => w.id === cardId);
    if (idx > -1) {
      // Create a temporary deck with this word at the start if it's not due
      // or just refresh deck and hope? Better to force it into the current deck.
      setDeck(targetVocab.slice(idx, idx + 1)); // Solo deck for jump
      setCurrentWordIndex(0);
    }
  };


  // Initialize total time from localStorage
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(() => {
    const saved = localStorage.getItem('vocabapp_total_time');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSecondsSpent(prev => {
        const newValue = prev + 1;
        localStorage.setItem('vocabapp_total_time', newValue.toString());
        return newValue;
      });

      const todayStr = new Date(currentDate).toDateString();
      const hour = new Date().getHours();
      setDailyStats(prev => {
        const dayData = prev[todayStr] || { swiped: 0, correct: 0, wrong: 0, quiz: 0, time: 0, hourlyActions: new Array(24).fill(0), hourlyTime: new Array(24).fill(0) };
        const newHourlyTime = [...(dayData.hourlyTime || new Array(24).fill(0))];
        newHourlyTime[hour] = (newHourlyTime[hour] || 0) + 1;

        return {
          ...prev,
          [todayStr]: {
            ...dayData,
            time: (dayData.time || 0) + 1,
            hourlyTime: newHourlyTime
          }
        };
      });

      // Track time per mode
      setModeTime(prev => {
        let activeKey = vocabMode;
        if (appMode.startsWith('quiz')) activeKey = 'quiz';
        return { ...prev, [activeKey]: (prev[activeKey] || 0) + 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [vocabMode, appMode]); // Added modes to ensure correct tracking if they change

  // UI States
  const [isTranslated, setIsTranslated] = useState(false);
  const [showForms, setShowForms] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLevelTest, setShowLevelTest] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVaultWord, setSelectedVaultWord] = useState(null);

  // Active Recall State
  const [isRevealed, setIsRevealed] = useState(true);

  // AI States
  const [showAi, setShowAi] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Details State
  const [showDetails, setShowDetails] = useState(false);

  // Community Hub State
  const [showCommunityHub, setShowCommunityHub] = useState(false);

  // Quick Translate State
  const [quickTx, setQuickTx] = useState({ text: '', visible: false, x: 0, y: 0 });

  // Sentence Evaluator States
  const [showWriting, setShowWriting] = useState(false);
  const [userSentence, setUserSentence] = useState("");
  const [writingFeedback, setWritingFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [showCaseExamples, setShowCaseExamples] = useState(false);
  const [showMiniStory, setShowMiniStory] = useState(false);

  // Quiz States
  const [quizExplanation, setQuizExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeDelta, setSwipeDelta] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0, isTop: true });
  const [isDragging, setIsDragging] = useState(false);
  const [lastQuizType, setLastQuizType] = useState(null);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Achievements State
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const stored = localStorage.getItem('vocabapp_achievements');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [achievementQueue, setAchievementQueue] = useState([]);

  // Sentence Builder States
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [availableTokens, setAvailableTokens] = useState([]);

  // Refs
  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 100;
  const apiKey = "";

  useEffect(() => {
    refreshDeck();
  }, [currentDate, vocabMode]);

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


  const refreshDeck = (isRetry = false) => {
    let newDeck = [];
    if (isRetry) {
      // "Tekrar Yap" (isRetryMode) focuses on what we did today + any missed reviews
      const todayStr = new Date(currentDate).toDateString();
      const stats = dailyStats[todayStr] || { swipedIds: [] };
      const swipedTodayIds = new Set(stats.swipedIds || []);

      const sessionContent = vocab.filter(w =>
        swipedTodayIds.has(w.id) ||
        (w.sm2.nextDate <= currentDate && w.sm2.rep > 0)
      );

      // Limit to 12 for consistent UI and session feel
      newDeck = shuffleArray(sessionContent).slice(0, 12);
      setIsRetryMode(true);
    } else if (vocabMode !== 'chill') {
      const todayStr = new Date(currentDate).toDateString();
      const stats = dailyStats[todayStr] || { swiped: 0, swipedIds: [] };

      // 1. Due Cards: Reviews coming from the SM-2 engine
      const dueCards = vocab.filter(w => w.sm2.nextDate <= currentDate && w.sm2.rep > 0);

      // Stochastic approach: We don't necessarily show all due cards at once, 
      // but we pull a random selection (0-20 as requested) or just shuffle all.
      // Let's take up to 20 random due cards for a better "Mix".
      const shuffledDue = shuffleArray(dueCards).slice(0, Math.floor(Math.random() * 21));

      // 2. Stranger Cards: New discoveries for today. 
      // CRITICAL: Pull from the FULL wordVocab/phrasalVocab instead of the limited 'vocab' 
      // so we don't run out of strangers after a few days.
      const pool = vocabMode === 'phrasal' ? phrasalVocab : wordVocab;
      const alreadySwipedToday = new Set(stats.swipedIds || []);
      const strangerCards = pool.filter(w => w.sm2.rep === 0 && !alreadySwipedToday.has(w.id));
      const shuffledStrangers = shuffleArray(strangerCards);

      // Rule: Take until daily limit (12) is reached for the specific mode
      const currentSwiped = vocabMode === 'phrasal' ? (stats.swiped_phrasal || 0) : (stats.swiped_words || 0);
      const remainingDiscoveryQuota = Math.max(0, 12 - currentSwiped);
      const discoveriesForDeck = shuffledStrangers.slice(0, remainingDiscoveryQuota);

      // MIX: Shuffle Due + Discoveries for a truly stochastic feel
      newDeck = shuffleArray([...shuffledDue, ...discoveriesForDeck]);
      setIsRetryMode(false);
    } else {
      newDeck = vocab; // ChillMode handles its own sorting via computedChill
      setIsRetryMode(false);
    }

    setDeck(newDeck);
    setCurrentWordIndex(0);
    setCardsSwipedSinceQuiz(0);
    setAppMode('swipe');
    if (newDeck.length > 0) {
      setIsRevealed(false);
    }
  };

  const advanceTime = () => {
    setCurrentDate(prev => prev + 24 * 60 * 60 * 1000);
    setStreak(prev => prev + 1);
  };

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

  const totalReviewsAll = vocab.reduce((acc, curr) => acc + curr.sm2.totalReviews, 0);
  const correctReviewsAll = vocab.reduce((acc, curr) => acc + curr.sm2.correctReviews, 0);
  const globalRetention = totalReviewsAll === 0 ? 0 : Math.round((correctReviewsAll / totalReviewsAll) * 100);

  const bondStats = {
    stranger: vocab.filter(w => !w.sm2.bondXP || w.sm2.bondXP === 0).length,
    acquaintance: vocab.filter(w => w.sm2.bondXP > 0 && w.sm2.bondXP < 100).length,
    confidant: vocab.filter(w => w.sm2.bondXP >= 100 && w.sm2.bondXP < 250).length,
    companion: vocab.filter(w => w.sm2.bondXP >= 250).length,
    stubborn: vocab.filter(w => w.sm2.lastQualityScore === 2).length
  };
  const learnedCount = vocab.filter(w => w.sm2.rep > 0).length;
  const strongCount = bondStats.companion; // For backward compatibility with some dashboard logic or achievements

  const todayStats = dailyStats[new Date(currentDate).toDateString()] || { swiped: 0, swiped_words: 0, swiped_phrasal: 0 };
  const swipedToday = vocabMode === 'phrasal' ? (todayStats.swiped_phrasal || 0) : (todayStats.swiped_words || 0);
  const isDeckFinished = deck.length === 0 || currentWordIndex >= deck.length || (!isRetryMode && swipedToday >= 12);

  const dueTodayCount = vocab.filter(w => w.sm2.nextDate <= currentDate).length;
  const dueTodayMins = Math.max(1, Math.round((dueTodayCount * 15) / 60));

  const dueTomorrowCount = vocab.filter(w => w.sm2.nextDate > currentDate && w.sm2.nextDate <= currentDate + 24 * 60 * 60 * 1000).length;
  const dueTomorrowMins = Math.max(1, Math.round((dueTomorrowCount * 15) / 60));

  const dailyProgress = Math.min(1, learnedCount / Math.max(1, vocab.length));

  // Achievement Check Logic
  useEffect(() => {
    const achievementsList = [
      { id: 'first_word', title: t.ach_first_word_title || '─░lk Ad─▒m', requirement: 1, current: learnedCount },
      { id: 'consistent_3', title: t.ach_consistent_3_title || 'Is─▒nma Turu', requirement: 3, current: streak },
      { id: 'hard_worker', title: t.ach_hard_worker_title || '├çal─▒┼şkan', requirement: 50, current: totalReviewsAll },
      { id: 'consistent_7', title: t.ach_consistent_7_title || '─░stikrarl─▒', requirement: 7, current: streak },
      { id: 'master_1', title: t.ach_master_1_title || 'Uzman Aday─▒', requirement: 10, current: strongCount },
    ];

    let newUnlocked = [];
    achievementsList.forEach(ach => {
      if (ach.current >= ach.requirement && !unlockedAchievements.includes(ach.id)) {
        newUnlocked.push(ach);
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedAchievements(prev => {
        const next = [...prev, ...newUnlocked.map(a => a.id)];
        return next;
      });
      setAchievementQueue(prev => [...prev, ...newUnlocked]);
    }
  }, [learnedCount, streak, totalReviewsAll, strongCount, unlockedAchievements]);

  const handleAchievementComplete = useCallback((id) => {
    setAchievementQueue(prev => prev.filter(a => a.id !== id));
  }, []);

  const evolveBond = useCallback((wordId) => {
    if (!isAdmin) return;
    const updateFn = w => {
      if (String(w.id) === String(wordId)) {
        let currentXp = w.sm2.bondXP || 0;
        let nextXp, nextInt;

        if (currentXp === 0) { nextXp = 50; nextInt = 1; } // Stranger -> Acquaintance
        else if (currentXp < 100) { nextXp = 100; nextInt = 7; } // Acquaintance -> Confidant
        else if (currentXp < 250) { nextXp = 250; nextInt = 21; } // Confidant -> Companion
        else { nextXp = currentXp + 100; nextInt = Math.max(w.sm2.int || 0, 30); } // Beyond Companion, just add XP

        return {
          ...w,
          sm2: {
            ...w.sm2,
            bondXP: nextXp,
            int: nextInt,
            rep: Math.max(w.sm2.rep, 1)
          }
        };
      }
      return w;
    };

    setWordVocab(prev => prev.map(updateFn));
    setPhrasalVocab(prev => prev.map(updateFn));
    setDeck(prev => prev.map(updateFn));
  }, [isAdmin]);


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
  const bottomNavigation = (
    <>
      <BottomNav
        isDark={isDark}
        showVault={showVault}
        onVaultClick={() => {
          sounds.playClick();
          if (showVault) setActiveVaultFolder(null); // Re-click reset
          else { setShowVault(true); setShowDashboard(false); setShowSettings(false); }
        }}
        showDashboard={showDashboard}
        onDashboardClick={() => {
          sounds.playClick();
          if (showDashboard) setShowQuizHistory(false); // Re-click reset
          else { setShowDashboard(true); setShowVault(false); setShowSettings(false); }
        }}
        onHomeClick={() => {
          sounds.playClick();
          if (!showVault && !showDashboard) setAppMode('swipe'); // Re-click reset
          else { setShowVault(false); setShowDashboard(false); setShowSettings(false); }
        }}
        streak={streak}
        setShowSettings={(val) => { sounds.playClick(); setShowSettings(val); }}
        t={t}
        onSecretClick={() => { sounds.playClick(); setShowAdminPanel(true); }}
        isAdmin={isAdmin}
        dailyProgress={dailyProgress * 100} // Pass as percentage
        lastActionStatus={lastActionStatus}
      />
      <SettingsModal
        t={t}
        isDark={isDark}
        themePref={themePref}
        cycleTheme={cycleTheme}
        getThemeText={getThemeText}
        appLang={appLang}
        setAppLang={setAppLang}
        advanceTime={advanceTime}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setThemePref={setThemePref}
        setShowCommunityHub={setShowCommunityHub}
        isAdmin={isAdmin}
        handleVersionClick={handleVersionClick}
        verifyMasterKey={verifyMasterKey}
        setShowAdminPanel={setShowAdminPanel}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
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
            // Prefix protected clear
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('vocabapp_')) {
                localStorage.removeItem(key);
              }
            });
            window.location.reload();
          }}
          isDark={isDark}
          appLang={appLang}
          t={t}
          onClose={() => { setShowAdminPanel(false); setEditingWord(null); }}
          stats={{ dau: dauDisplay, totalSwipes }}
          difficultWords={difficultWords}
          sm2Multiplier={sm2Multiplier}
          setSm2Multiplier={setSm2Multiplier}
          globalAnnouncement={globalAnnouncement}
          setGlobalAnnouncement={setGlobalAnnouncement}
          advanceTime={advanceTime}
          hourlySwipes={hourlySwipes}
          modeSwipes={modeSwipes}
          systemLogs={systemLogs}
          maintenanceMode={maintenanceMode}
          setMaintenanceMode={setMaintenanceMode}
          customWords={customWords}
          setCustomWords={setCustomWords}
          rightSwipes={rightSwipes}
          leftSwipes={leftSwipes}
          modeTime={modeTime}
          editingWord={editingWord}
          setEditingWord={setEditingWord}
          allWords={computedWords}
          allPhrasals={computedPhrasals}
          allChill={computedChill}
          onEditWord={editWord}
          onDeleteWord={deleteWord}
          onJumpToCard={jumpToCard}
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
    </>
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

  const weakWordsArray = useMemo(() => {
    return (difficultWords || []).map(dw => {
      const card = (vocab || []).find(v => (v.text || v.eng) === dw.text);
      return card ? { ...card, fails: dw.fails } : null;
    }).filter(Boolean).slice(0, 8);
  }, [difficultWords, vocab]);

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
          <button onClick={handleVersionClick} className="mt-12 text-[10px] uppercase font-black tracking-widest text-slate-700">Attempt Admin Login</button>
        )}
      </div>
    );
  }

  if (showDashboard) {
    return (
      <>
        <Dashboard
          isDark={isDark}
          stats={{
            totalTime: totalSecondsSpent,
            totalSwipes: totalSwipes,
            streak: streak,
            maxStreak: maxStreak,
            quizLog: quizLog,
            modeSwipes: modeSwipes,
            rightSwipes: rightSwipes,
            leftSwipes: leftSwipes,
            dailyProgress: dailyProgress,
            difficultWords: difficultWords,
            dailyStats: dailyStats
          }}
          t={t}
          setShowDashboard={setShowDashboard}
          streak={streak}
          dueTodayCount={dueTodayCount}
          dueTodayMins={dueTodayMins}
          learnedCount={learnedCount}
          vocab={vocab}
          totalReviewsAll={totalReviewsAll}
          globalRetention={globalRetention}
          bondStats={bondStats}
          strongCount={strongCount}
          weakWordsArray={weakWordsArray}
          bgMain={bgMain}
          textMain={textMain}
          totalSecondsSpent={totalSecondsSpent}
          setQuickTx={setQuickTx}
          vocabMode={vocabMode}
          setVocabMode={setVocabMode}
          onLevelTestClick={() => setShowLevelTest(true)}
          maxStreak={maxStreak}
          quizLog={quizLog}
          onVaultClick={(folder) => {
            setShowVault(true);
            setActiveVaultFolder(folder);
            setShowDashboard(false);
          }}
          onRetryQuiz={handleRetryQuiz}
          showQuizHistory={showQuizHistory}
          setShowQuizHistory={setShowQuizHistory}
          dailyStats={dailyStats}
          isAdmin={isAdmin}
          advanceTime={advanceTime}
          onJumpToCard={jumpToCard}
        />
        {bottomNavigation}
      </>
    );
  }

  if (showVault) {
    return (
      <>
        <Vault
          t={t}
          isDark={isDark}
          isAdmin={isAdmin}
          bgMain={bgMain}
          textMain={textMain}
          cardBg={cardBg}
          vocab={vocab} // Added full vocab for systemic tracking
          savedWords={savedWords}
          setSelectedVaultWord={setSelectedVaultWord}
          setIsRevealed={setIsRevealed}
          setIsTranslated={setIsTranslated}
          setShowForms={setShowForms}
          setShowAi={setShowAi}
          setShowWriting={setShowWriting}
          toggleSaveWord={toggleSaveWord}
          setShowVault={setShowVault}
          selectedVaultWord={selectedVaultWord}
          renderCardContent={renderCardContentWrapper}
          quickTx={quickTx}
          setQuickTx={setQuickTx}
          appLang={appLang}
          vaultFolders={vaultFolders}
          setVaultFolders={setVaultFolders}
          updateWordFolder={updateWordFolder}
          deleteVaultFolder={deleteVaultFolder}
          renameVaultFolder={renameVaultFolder}
          swipeLog={swipeLog}
          activeFolder={activeVaultFolder}
          setActiveFolder={setActiveVaultFolder}
        />
        {bottomNavigation}
      </>
    );
  }

  if (vocabMode === 'chill') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-start font-sans overflow-hidden transition-all duration-300 relative ${isDark ? 'dark bg-[#0a0a0c] text-slate-100' : 'bg-[#fcfcfd] text-slate-900'}`}>
        <ChillMode
          vocab={vocab}
          isDark={isDark}
          appLang={appLang}
          t={t}
          dueTodayCount={dueTodayCount}
          dueTodayMins={dueTodayMins}
          isAdmin={isAdmin}
          onDeleteWord={deleteWord}
          onEditWord={editWord}
          chillSortMode={chillSortMode}
          setChillSortMode={setChillSortMode}
        />
        {modeSelector}
        <div className="relative z-[500] w-full">
          {bottomNavigation}
        </div>
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

      {/* ÜST BÖLÜM: Minimalist & Sabit Header */}
      <header className="fixed top-0 left-0 right-0 flex flex-col items-center pt-6 z-[600] pointer-events-none">
        <div className="w-full flex flex-col items-center pointer-events-auto">
          <AchievementPopup queue={achievementQueue} onComplete={handleAchievementComplete} isDark={isDark} t={t} isAdmin={isAdmin} />

          <div className="scale-90 opacity-80 hover:opacity-100 transition-all duration-300 transform origin-top">
            {modeSelector}
          </div>
        </div>
      </header>

      {/* ORTA BÖLÜM: Kart Arenası (Yukarı Çapa) */}
      <main className={`flex-grow w-full flex flex-col items-center justify-start ${appMode.startsWith('quiz_') ? 'pt-4' : 'pt-16'} px-4 relative overflow-hidden min-h-0`}>

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
            <div className={`relative w-full max-w-[400px] ${appMode.startsWith('quiz_') ? 'h-[75vh]' : 'aspect-[3/4] max-h-[70vh]'} mb-20`}>
              {appMode.startsWith('quiz_') ? (
                <Quiz
                  t={t}
                  isDark={isDark}
                  isAdmin={isAdmin}
                  appMode={appMode}
                  quizQuestion={quizQuestion}
                  isTranslated={isTranslated}
                  setIsTranslated={setIsTranslated}
                  quizFeedback={quizFeedback}
                  handleQuizAction={handleQuizAction}
                  selectedTokens={selectedTokens}
                  availableTokens={availableTokens}
                  toggleToken={toggleToken}
                  handleSentenceCheck={handleSentenceCheck}
                  onDragStart={onDragStart}
                  onDragEnter={onDragEnter}
                  onDragEnd={onDragEnd}
                  quizExplanation={quizExplanation}
                  explainMistake={explainMistake}
                  isExplaining={isExplaining}
                  setAppMode={setAppMode}
                  deck={deck}
                  currentWordIndex={currentWordIndex}
                  setIsRevealed={setIsRevealed}
                  cardBg={cardBg}
                  bgMain={bgMain}
                  textMain={textMain}
                  isQuizReview={isQuizReview}
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
      </main>

      {/* ALT BÖLÜM: Sabit Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[500] pb-safe bg-background/80 backdrop-blur-lg">
        <footer className="w-full flex-col items-center gap-2 opacity-60 hidden md:flex mb-4">
          <div className="flex gap-6">
            <a href="https://www.instagram.com/ferhat_hoca_ingilizce/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"><Instagram size={12} /> instagram</a>
            <a href="https://ferhathocaingilizce.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"><Globe size={12} /> ferhathocaingilizce.com</a>
          </div>
        </footer>
        {bottomNavigation}
      </nav>
    </div>
  );
}
