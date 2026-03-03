import { safeJsonParse } from '../utils/helpers';

export const useAiTutor = (apiKey, appLang, t) => {

    const getSystemLang = () => appLang === 'tr' ? "Türkçe" : "English";

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

    const fetchAiData = async (word, isAiLoading, setIsAiLoading, setShowAi, setAiData) => {
        if (isAiLoading || !apiKey) return;
        setIsAiLoading(true); setShowAi(true);
        const systemPrompt = `You are Ferhat Hoca. Provide feedback in ${getSystemLang()}. 
        STRICTLY return ONLY a valid raw JSON object. Do NOT wrap it in markdown. Do NOT use \`\`\`json.
        {
          "sentences": [{"type": "Professional", "eng": "...", "tr": "..."}, {"type": "Casual", "eng": "...", "tr": "..."}, {"type": "Academic", "eng": "...", "tr": "..."}],
          "mnemonic": "A creative memory tactic.",
          "scenario": "A short 2-line dialogue."
        }`;
        try {
            const text = await geminiFetch(`Analyze: "${word}"`, systemPrompt, true);
            setAiData(safeJsonParse(text));
        } catch { setAiData({ error: t.aiError }); }
        finally { setIsAiLoading(false); }
    };

    const evaluateSentence = async (targetWordStr, userSentence, isEvaluating, setIsEvaluating, setWritingFeedback) => {
        if (!userSentence.trim() || isEvaluating || !apiKey) return;
        setIsEvaluating(true);
        const systemPrompt = `Sen Ferhat Hoca'sın. Dilin: ${getSystemLang()}. Hedef kelime: "${targetWordStr}". Öğrenci Girdisi: "${userSentence}".
        DURUM 1: Öğrenci İngilizce bir cümle kurmaya çalışmış.
        DURUM 2: Öğrenci Türkçe yardım istiyor veya mazeret bildiriyor.
        Eğer DURUM 2 ise: Score kısmına motivasyon amaçlı 10 ver. Feedback kısmında özne/yüklem dizilimini çok samimi bir dille adım adım öğret. CorrectedSentence kısmına çevirisini yaz.
        SADECE AŞAĞIDAKİ RAW JSON FORMATINDA DÖN:
        { "score": 10, "feedback": "Hoca'nın samimi geri bildirimi.", "correctedSentence": "Doğru İngilizce cümle." }`;
        try {
            const text = await geminiFetch(`Kelime: "${targetWordStr}", Öğrenci: "${userSentence}"`, systemPrompt, true);
            setWritingFeedback(safeJsonParse(text));
        } catch { setWritingFeedback({ error: t.aiError }); }
        finally { setIsEvaluating(false); }
    };

    const explainMistake = async (quizQuestion, isExplaining, setIsExplaining, setQuizExplanation) => {
        if (isExplaining || !apiKey || !quizQuestion) return;
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

    return {
        geminiFetch,
        fetchAiData,
        evaluateSentence,
        explainMistake
    };
};
