/**
 * English Proficiency Test Questions (15 Questions, A1 to C1)
 * These questions are designed to categorize users into levels.
 */

export const levelTestQuestions = [
    // A1: Beginner (Questions 1-3)
    {
        id: 1,
        level: "A1",
        question: "I ____ a student.",
        options: ["am", "is", "are", "be"],
        correct: 0,
        explanation: "'I' takes the 'am' form of the verb 'to be'."
    },
    {
        id: 2,
        level: "A1",
        question: "Where ____ you from?",
        options: ["is", "do", "are", "did"],
        correct: 2,
        explanation: "We use 'are' with 'you' for origin questions."
    },
    {
        id: 3,
        level: "A1",
        question: "She ____ coffee every morning.",
        options: ["drink", "drinks", "drinking", "is drink"],
        correct: 1,
        explanation: "Present Simple 3rd person singular takes '-s'."
    },
    // A2: Elementary (Questions 4-6)
    {
        id: 4,
        level: "A2",
        question: "I ____ to the cinema yesterday.",
        options: ["go", "goes", "went", "gone"],
        correct: 2,
        explanation: "Past Simple of 'go' is 'went'."
    },
    {
        id: 5,
        level: "A2",
        question: "Have you ____ London?",
        options: ["ever visit", "ever visited", "never visit", "visit"],
        correct: 1,
        explanation: "Present Perfect uses 'have/has + past participle'."
    },
    {
        id: 6,
        level: "A2",
        question: "This book is ____ than that one.",
        options: ["good", "gooder", "better", "best"],
        correct: 2,
        explanation: "Comparative form of 'good' is 'better'."
    },
    // B1: Intermediate (Questions 7-9)
    {
        id: 7,
        level: "B1",
        question: "If it ____ tomorrow, we will stay at home.",
        options: ["rain", "rains", "will rain", "rained"],
        correct: 1,
        explanation: "First Conditional: If + Present Simple, will + verb."
    },
    {
        id: 8,
        level: "B1",
        question: "He asked me where I ____.",
        options: ["live", "did live", "lived", "am living"],
        correct: 2,
        explanation: "Reported speech: 'Where do you live?' becomes 'asked where I lived'."
    },
    {
        id: 9,
        level: "B1",
        question: "The car ____ by my father last week.",
        options: ["was repaired", "is repaired", "repaired", "has repaired"],
        correct: 0,
        explanation: "Passive voice: 'was/were + past participle' for past actions."
    },
    // B2: Upper-Intermediate (Questions 10-12)
    {
        id: 10,
        level: "B2",
        question: "I wish I ____ more time to study.",
        options: ["have", "had", "would have", "am having"],
        correct: 1,
        explanation: "Wish + Past Simple for present regrets."
    },
    {
        id: 11,
        level: "B2",
        question: "By next year, I ____ my degree.",
        options: ["will finish", "finish", "will have finished", "am finishing"],
        correct: 2,
        explanation: "Future Perfect for actions completed by a certain future time."
    },
    {
        id: 12,
        level: "B2",
        question: "Despite ____ hard, he failed the exam.",
        options: ["study", "studying", "of studying", "he studied"],
        correct: 1,
        explanation: "'Despite' is followed by a gerund (-ing form)."
    },
    // C1: Advanced (Questions 13-15)
    {
        id: 13,
        level: "C1",
        question: "Hardly ____ the office when the phone rang.",
        options: ["I had left", "had I left", "left I", "I left"],
        correct: 1,
        explanation: "Inversion with negative adverbs: 'Hardly had I left...'"
    },
    {
        id: 14,
        level: "C1",
        question: "It is essential that he ____ here on time.",
        options: ["is", "be", "was", "will be"],
        correct: 1,
        explanation: "Subjunctive mood: 'It is essential that + subject + base form'."
    },
    {
        id: 15,
        level: "C1",
        question: "____ for your help, I wouldn't have succeeded.",
        options: ["Had it not been", "Were it not", "If it wasn't", "If it shouldn't be"],
        correct: 0,
        explanation: "Third conditional inversion: 'Had it not been for...' (If it hadn't been...)"
    }
];

export const getLevelFromScore = (score) => {
    if (score >= 14) return { level: "C1 - Advanced", feedback: "Truly impressive! You have a near-native command of English." };
    if (score >= 11) return { level: "B2 - Upper Intermediate", feedback: "Very strong! You can express yourself clearly on most topics." };
    if (score >= 8) return { level: "B1 - Intermediate", feedback: "Good base! You're ready for more complex structures." };
    if (score >= 5) return { level: "A2 - Elementary", feedback: "Solid start! Keep building your vocabulary." };
    return { level: "A1 - Beginner", feedback: "Keep going! Consistency is the key to learning English." };
};
