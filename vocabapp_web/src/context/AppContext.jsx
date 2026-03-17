
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { safeJsonParse } from '../utils/helpers';

export const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // 1. App Navigation / Mode States
    const [appMode, setAppMode] = useState('swipe');
    const [isLogoVisible, setIsLogoVisible] = useState(true);
    const [currentDate, setCurrentDate] = useState(Date.now());
    const [appStartDate] = useState(() => {
        const stored = localStorage.getItem('vocabapp_start_date');
        if (stored) return parseInt(stored, 10);
        const now = Date.now();
        localStorage.setItem('vocabapp_start_date', now.toString());
        return now;
    });

    // 2. Global Stats States
    const [totalSwipes, setTotalSwipes] = useState(() => parseInt(localStorage.getItem('vocabapp_total_swipes') || '0', 10));
    const [streak, setStreak] = useState(1);
    const [maxStreak, setMaxStreak] = useState(() => parseInt(localStorage.getItem('vocabapp_max_streak') || '0', 10));
    const [totalSecondsSpent, setTotalSecondsSpent] = useState(() => parseInt(localStorage.getItem('vocabapp_total_time') || '0', 10));
    
    const [modeSwipes, setModeSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_mode_swipes')) }));
    const [rightSwipes, setRightSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_right_swipes')) }));
    const [leftSwipes, setLeftSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_left_swipes')) }));
    const [modeTime, setModeTime] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_mode_time')) }));
    const [hourlySwipes, setHourlySwipes] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_hourly_swipes')) || new Array(24).fill(0));
    const [dailyStats, setDailyStats] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_daily_stats')) || {});
    const [difficultWords, setDifficultWords] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_difficult_words')) || []);
    const [systemLogs, setSystemLogs] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_system_logs')) || []);

    // 3. Achievements States
    const [unlockedAchievements, setUnlockedAchievements] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_achievements')) || []);
    const [achievementQueue, setAchievementQueue] = useState([]);

    // 4. UI Temporary States
    const [lastActionStatus, setLastActionStatus] = useState(null);
    const [isRevealed, setIsRevealed] = useState(true);
    const [isRetryMode, setIsRetryMode] = useState(false);
    const [cardsSwipedSinceQuiz, setCardsSwipedSinceQuiz] = useState(0);
    const [isQuizReview, setIsQuizReview] = useState(false);
    const [reviewingEntryId, setReviewingEntryId] = useState(null);
    const [quizLog, setQuizLog] = useState(() => {
        const stored = safeJsonParse(localStorage.getItem('vocabapp_quiz_log'));
        return { total: 0, correct: 0, history: [], ...(stored || {}) };
    });
    const [swipeLog, setSwipeLog] = useState(() => {
        const stored = safeJsonParse(localStorage.getItem('vocabapp_swipe_log'));
        return { correctIds: [], wrongIds: [], ...(stored || {}) };
    });

    // 5. Visibility / Navigation States
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showVault, setShowVault] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showLevelTest, setShowLevelTest] = useState(false);
    const [showArenaGate, setShowArenaGate] = useState(false);
    const [showStreakRun, setShowStreakRun] = useState(false);
    const [showSpeedBlitz, setShowSpeedBlitz] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showCommunityHub, setShowCommunityHub] = useState(false);
    const [showQuizHistory, setShowQuizHistory] = useState(false);
    const [activeVaultFolder, setActiveVaultFolder] = useState(null);
    const [selectedVaultWord, setSelectedVaultWord] = useState(null);
    const [editingWord, setEditingWord] = useState(null);

    // 6. Quiz States
    const [quizQuestion, setQuizQuestion] = useState(null);
    const [quizFeedback, setQuizFeedback] = useState(null);
    const [quizExplanation, setQuizExplanation] = useState(null);
    const [availableTokens, setAvailableTokens] = useState([]);
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [lastQuizType, setLastQuizType] = useState(null);

    // 5. Persistence Effects
    useEffect(() => localStorage.setItem('vocabapp_total_swipes', totalSwipes.toString()), [totalSwipes]);
    useEffect(() => localStorage.setItem('vocabapp_max_streak', maxStreak.toString()), [maxStreak]);
    useEffect(() => localStorage.setItem('vocabapp_total_time', totalSecondsSpent.toString()), [totalSecondsSpent]);
    useEffect(() => localStorage.setItem('vocabapp_mode_swipes', JSON.stringify(modeSwipes)), [modeSwipes]);
    useEffect(() => localStorage.setItem('vocabapp_right_swipes', JSON.stringify(rightSwipes)), [rightSwipes]);
    useEffect(() => localStorage.setItem('vocabapp_left_swipes', JSON.stringify(leftSwipes)), [leftSwipes]);
    useEffect(() => localStorage.setItem('vocabapp_mode_time', JSON.stringify(modeTime)), [modeTime]);
    useEffect(() => localStorage.setItem('vocabapp_hourly_swipes', JSON.stringify(hourlySwipes)), [hourlySwipes]);
    useEffect(() => localStorage.setItem('vocabapp_daily_stats', JSON.stringify(dailyStats)), [dailyStats]);
    useEffect(() => localStorage.setItem('vocabapp_difficult_words', JSON.stringify(difficultWords)), [difficultWords]);
    useEffect(() => localStorage.setItem('vocabapp_system_logs', JSON.stringify(systemLogs)), [systemLogs]);
    useEffect(() => localStorage.setItem('vocabapp_achievements', JSON.stringify(unlockedAchievements)), [unlockedAchievements]);
    useEffect(() => localStorage.setItem('vocabapp_quiz_log', JSON.stringify(quizLog)), [quizLog]);
    useEffect(() => localStorage.setItem('vocabapp_swipe_log', JSON.stringify(swipeLog)), [swipeLog]);

    const advanceTime = useCallback(() => {
        setCurrentDate(prev => prev + 24 * 60 * 60 * 1000);
        setStreak(prev => prev + 1);
    }, []);

    const handleAchievementComplete = useCallback((id) => {
        setAchievementQueue(prev => prev.filter(a => a.id !== id));
    }, []);

    const value = {
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
        unlockedAchievements, setUnlockedAchievements,
        achievementQueue, setAchievementQueue,
        lastActionStatus, setLastActionStatus,
        isRevealed, setIsRevealed,
        isRetryMode, setIsRetryMode,
        cardsSwipedSinceQuiz, setCardsSwipedSinceQuiz,
        isQuizReview, setIsQuizReview,
        reviewingEntryId, setReviewingEntryId,
        quizLog, setQuizLog,
        swipeLog, setSwipeLog,
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
        editingWord, setEditingWord,
        quizQuestion, setQuizQuestion,
        quizFeedback, setQuizFeedback,
        quizExplanation, setQuizExplanation,
        availableTokens, setAvailableTokens,
        selectedTokens, setSelectedTokens,
        lastQuizType, setLastQuizType,
        advanceTime, handleAchievementComplete
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
