export const safeJsonParse = (text) => {
    try {
        return JSON.parse(text);
    } catch (e) {
        try {
            const cleaned = text.replace(/^```(json)?|```$/gi, '').trim();
            return JSON.parse(cleaned);
        } catch {
            console.error("JSON Parse Error:", text);
            throw new Error("Invalid format");
        }
    }
};

export function calculateAdvancedSM2(word, q, mode = 'recall', now = Date.now(), multiplier = 1.0, skipIntervalUpdate = false) {
    let { rep, int, ef, nextDate, totalReviews = 0, correctReviews = 0 } = word.sm2;
    let bondXP = word.sm2.bondXP || 0;

    // XP Gain Matrix (Mastered: 5, Got it: 4, Remind Me: 2, New: 0)
    const xpGain = { 5: 15, 4: 10, 2: 5, 0: 0 };
    bondXP += xpGain[q] || 0;

    if (skipIntervalUpdate) {
        return {
            ...word,
            sm2: {
                ...word.sm2,
                bondXP,
                lastQualityScore: q
            }
        };
    }

    if (q >= 3) {
        if (rep === 0) int = 1;
        else if (rep === 1) int = 6;
        else int = Math.round(int * ef * multiplier);
        rep++;
        correctReviews++;
    } else {
        rep = 0;
        int = 1;
    }

    totalReviews++;
    ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    nextDate = now + int * 24 * 60 * 60 * 1000;

    return {
        ...word,
        sm2: {
            rep,
            int,
            ef,
            nextDate,
            totalReviews,
            correctReviews,
            bondXP,
            lastQualityScore: q
        }
    };
}
export const shuffleArray = (array) => {
    const next = [...array];
    for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
};
