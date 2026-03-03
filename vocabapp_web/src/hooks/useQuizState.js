import { useState } from 'react';

export const useQuizState = () => {
    // Sentence Evaluator States
    const [showWriting, setShowWriting] = useState(false);
    const [userSentence, setUserSentence] = useState("");
    const [writingFeedback, setWritingFeedback] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isRetryMode, setIsRetryMode] = useState(false);
    const [showCaseExamples, setShowCaseExamples] = useState(false);

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

    // AI & Details States
    const [showAi, setShowAi] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Sentence Builder States
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [availableTokens, setAvailableTokens] = useState([]);

    return {
        showWriting, setShowWriting,
        userSentence, setUserSentence,
        writingFeedback, setWritingFeedback,
        isEvaluating, setIsEvaluating,
        isRetryMode, setIsRetryMode,
        showCaseExamples, setShowCaseExamples,
        quizExplanation, setQuizExplanation,
        isExplaining, setIsExplaining,
        swipeDirection, setSwipeDirection,
        swipeDelta, setSwipeDelta,
        dragStartPos, setDragStartPos,
        isDragging, setIsDragging,
        lastQuizType, setLastQuizType,
        quizQuestion, setQuizQuestion,
        quizFeedback, setQuizFeedback,
        showAi, setShowAi,
        aiData, setAiData,
        isAiLoading, setIsAiLoading,
        showDetails, setShowDetails,
        selectedTokens, setSelectedTokens,
        availableTokens, setAvailableTokens
    };
};
