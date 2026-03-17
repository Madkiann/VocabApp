
import { useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useSettings } from '../context/SettingsContext';

export const useAchievements = (learnedCount, totalReviewsAll, strongCount) => {
    const { streak } = useApp();
    const { t } = useSettings();
    const { unlockedAchievements, setUnlockedAchievements, setAchievementQueue } = useApp();

    useEffect(() => {
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
        }
    }, [learnedCount, streak, totalReviewsAll, strongCount, unlockedAchievements, t, setUnlockedAchievements, setAchievementQueue]);
};
