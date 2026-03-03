import { useState, useEffect } from 'react';
import { safeJsonParse } from '../utils/helpers';

export const useAppStorage = () => {
    const [themePref, setThemePref] = useState(() => localStorage.getItem('vocabapp_theme') || 'system');
    const [maxStreak, setMaxStreak] = useState(() => parseInt(localStorage.getItem('vocabapp_max_streak') || '0', 10));

    const [quizLog, setQuizLog] = useState(() => {
        const stored = safeJsonParse(localStorage.getItem('vocabapp_quiz_log'));
        return { total: 0, correct: 0, history: [], ...(stored || {}) };
    });

    const [swipeLog, setSwipeLog] = useState(() => {
        const stored = safeJsonParse(localStorage.getItem('vocabapp_swipe_log'));
        return { correctIds: [], wrongIds: [], ...(stored || {}) };
    });

    const [sm2Multiplier, setSm2Multiplier] = useState(() => parseFloat(localStorage.getItem('vocabapp_sm2_multiplier') || '1.0'));
    const [globalAnnouncement, setGlobalAnnouncement] = useState(() => localStorage.getItem('vocabapp_announcement') || '');
    const [difficultWords, setDifficultWords] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_difficult_words')) || []);
    const [totalSwipes, setTotalSwipes] = useState(() => parseInt(localStorage.getItem('vocabapp_total_swipes') || '0', 10));
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('vocabapp_sound_enabled') !== 'false');

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

    const [maintenanceMode, setMaintenanceMode] = useState(() => localStorage.getItem('vocabapp_maintenance') === 'true');

    const [customWords, setCustomWords] = useState(() => {
        const stored = safeJsonParse(localStorage.getItem('vocabapp_custom_words'));
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

    const [deletedWords, setDeletedWords] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_deleted_words')) || []);
    const [rightSwipes, setRightSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_right_swipes')) }));
    const [leftSwipes, setLeftSwipes] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_left_swipes')) }));
    const [modeTime, setModeTime] = useState(() => ({ words: 0, chill: 0, phrasal: 0, quiz: 0, ...safeJsonParse(localStorage.getItem('vocabapp_mode_time')) }));
    const [dailyStats, setDailyStats] = useState(() => safeJsonParse(localStorage.getItem('vocabapp_daily_stats')) || {});

    // Effect triggers
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

    return {
        themePref, setThemePref,
        maxStreak, setMaxStreak,
        quizLog, setQuizLog,
        swipeLog, setSwipeLog,
        sm2Multiplier, setSm2Multiplier,
        globalAnnouncement, setGlobalAnnouncement,
        difficultWords, setDifficultWords,
        totalSwipes, setTotalSwipes,
        soundEnabled, setSoundEnabled,
        modeSwipes, setModeSwipes,
        hourlySwipes, setHourlySwipes,
        systemLogs, setSystemLogs,
        appStartDate,
        maintenanceMode, setMaintenanceMode,
        customWords, setCustomWords,
        deletedWords, setDeletedWords,
        rightSwipes, setRightSwipes,
        leftSwipes, setLeftSwipes,
        modeTime, setModeTime,
        dailyStats, setDailyStats
    };
};
