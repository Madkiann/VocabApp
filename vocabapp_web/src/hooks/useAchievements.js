import { useState, useCallback } from 'react';

export const useAchievements = ({ learnedCount, streak, totalReviewsAll, strongCount, t }) => {
    const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
        try {
            const stored = localStorage.getItem('vocabapp_achievements');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [achievementQueue, setAchievementQueue] = useState([]);

    // We intentionally run this check inline (not useEffect) because we need
    // the calling component to control when this runs via the deps passed in.
    // The parent should call this hook and pass a stable deps array.
    const checkAchievements = useCallback(() => {
        const achievementsList = [
            { id: 'first_word', title: t?.ach_first_word_title || 'İlk Adım', requirement: 1, current: learnedCount },
            { id: 'consistent_3', title: t?.ach_consistent_3_title || 'Isınma Turu', requirement: 3, current: streak },
            { id: 'hard_worker', title: t?.ach_hard_worker_title || 'Çalışkan', requirement: 50, current: totalReviewsAll },
            { id: 'consistent_7', title: t?.ach_consistent_7_title || 'İstikrarlı', requirement: 7, current: streak },
            { id: 'master_1', title: t?.ach_master_1_title || 'Uzman Adayı', requirement: 10, current: strongCount },
        ];

        const newUnlocked = achievementsList.filter(
            ach => ach.current >= ach.requirement && !unlockedAchievements.includes(ach.id)
        );

        if (newUnlocked.length > 0) {
            setUnlockedAchievements(prev => [...prev, ...newUnlocked.map(a => a.id)]);
            setAchievementQueue(prev => [...prev, ...newUnlocked]);
            localStorage.setItem('vocabapp_achievements', JSON.stringify([
                ...unlockedAchievements,
                ...newUnlocked.map(a => a.id)
            ]));
        }
    }, [learnedCount, streak, totalReviewsAll, strongCount, unlockedAchievements, t]);

    const handleAchievementComplete = useCallback((id) => {
        setAchievementQueue(prev => prev.filter(a => a.id !== id));
    }, []);

    return {
        unlockedAchievements,
        achievementQueue,
        checkAchievements,
        handleAchievementComplete,
    };
};
