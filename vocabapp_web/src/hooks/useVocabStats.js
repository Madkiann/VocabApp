import { useMemo } from 'react';

export const useVocabStats = (vocab, dailyStats, currentDate, difficultWords) => {
    const totalReviewsAll = useMemo(
        () => vocab.reduce((acc, curr) => acc + (curr.sm2.totalReviews || 0), 0),
        [vocab]
    );

    const correctReviewsAll = useMemo(
        () => vocab.reduce((acc, curr) => acc + (curr.sm2.correctReviews || 0), 0),
        [vocab]
    );

    const globalRetention = totalReviewsAll === 0
        ? 0
        : Math.round((correctReviewsAll / totalReviewsAll) * 100);

    const bondStats = useMemo(() => ({
        stranger: vocab.filter(w => !w.sm2.bondXP || w.sm2.bondXP === 0).length,
        acquaintance: vocab.filter(w => w.sm2.bondXP > 0 && w.sm2.bondXP < 100).length,
        confidant: vocab.filter(w => w.sm2.bondXP >= 100 && w.sm2.bondXP < 250).length,
        companion: vocab.filter(w => w.sm2.bondXP >= 250).length,
        stubborn: vocab.filter(w => w.sm2.lastQualityScore === 2).length
    }), [vocab]);

    const learnedCount = useMemo(() => vocab.filter(w => w.sm2.rep > 0).length, [vocab]);
    const strongCount = bondStats.companion;

    const todayStats = dailyStats[new Date(currentDate).toDateString()] || { swiped: 0 };
    const swipedToday = todayStats.swiped || 0;

    const dueTodayCount = useMemo(
        () => vocab.filter(w => w.sm2.nextDate <= currentDate).length,
        [vocab, currentDate]
    );
    const dueTodayMins = Math.max(1, Math.round((dueTodayCount * 15) / 60));

    const dueTomorrowCount = useMemo(
        () => vocab.filter(w => w.sm2.nextDate > currentDate && w.sm2.nextDate <= currentDate + 24 * 60 * 60 * 1000).length,
        [vocab, currentDate]
    );
    const dueTomorrowMins = Math.max(1, Math.round((dueTomorrowCount * 15) / 60));

    const dailyProgress = Math.min(1, learnedCount / Math.max(1, vocab.length));

    const weakWordsArray = useMemo(() => {
        return (difficultWords || []).map(dw => {
            const card = (vocab || []).find(v => (v.text || v.eng) === dw.text);
            return card ? { ...card, fails: dw.fails } : null;
        }).filter(Boolean).slice(0, 8);
    }, [difficultWords, vocab]);

    return {
        totalReviewsAll,
        correctReviewsAll,
        globalRetention,
        bondStats,
        learnedCount,
        strongCount,
        swipedToday,
        dueTodayCount,
        dueTodayMins,
        dueTomorrowCount,
        dueTomorrowMins,
        dailyProgress,
        weakWordsArray,
    };
};
