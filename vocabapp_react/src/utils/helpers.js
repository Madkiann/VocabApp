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

export const calculateAdvancedSM2 = (word, quality, mode, simulatedNow, globalIntervalMultiplier = 1.0) => {
    let { rep, int, ef, totalReviews, correctReviews } = word.sm2;

    totalReviews += 1;
    if (quality >= 3) correctReviews += 1;

    const modeMultiplier = {
        'recognition': 0.8,
        'recall': 1.2,
        'perfect': 1.5,
        'production': 1.5
    }[mode] || 1.0;

    const baseMultiplier = modeMultiplier * globalIntervalMultiplier;

    if (quality >= 3) {
        if (rep === 0) {
            int = 1 * baseMultiplier;
        } else if (rep === 1) {
            int = 6 * baseMultiplier;
        } else {
            int = Math.round(int * ef * baseMultiplier);
        }
        rep += 1;
    } else {
        rep = 0;
        int = 1;
    }

    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;

    const safeInt = Math.max(1, Math.round(int));
    const nextDate = simulatedNow + safeInt * 24 * 60 * 60 * 1000;

    return { ...word, sm2: { rep, int: safeInt, ef, nextDate, totalReviews, correctReviews, lastQualityScore: quality } };
};
