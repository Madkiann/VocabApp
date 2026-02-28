class LevelTestQuestion {
  final int id;
  final String level;
  final String question;
  final List<String> options;
  final int correct;
  final String explanation;

  LevelTestQuestion({
    required this.id,
    required this.level,
    required this.question,
    required this.options,
    required this.correct,
    required this.explanation,
  });
}

final List<LevelTestQuestion> levelTestQuestions = [
  // A1: Beginner
  LevelTestQuestion(
    id: 1,
    level: "A1",
    question: "I ____ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    explanation: "'I' takes the 'am' form of the verb 'to be'.",
  ),
  LevelTestQuestion(
    id: 2,
    level: "A1",
    question: "Where ____ you from?",
    options: ["is", "do", "are", "did"],
    correct: 2,
    explanation: "We use 'are' with 'you' for origin questions.",
  ),
  LevelTestQuestion(
    id: 3,
    level: "A1",
    question: "She ____ coffee every morning.",
    options: ["drink", "drinks", "drinking", "is drink"],
    correct: 1,
    explanation: "Present Simple 3rd person singular takes '-s'.",
  ),
  // A2: Elementary
  LevelTestQuestion(
    id: 4,
    level: "A2",
    question: "I ____ to the cinema yesterday.",
    options: ["go", "goes", "went", "gone"],
    correct: 2,
    explanation: "Past Simple of 'go' is 'went'.",
  ),
  LevelTestQuestion(
    id: 5,
    level: "A2",
    question: "Have you ____ London?",
    options: ["ever visit", "ever visited", "never visit", "visit"],
    correct: 1,
    explanation: "Present Perfect uses 'have/has + past participle'.",
  ),
  LevelTestQuestion(
    id: 6,
    level: "A2",
    question: "This book is ____ than that one.",
    options: ["good", "gooder", "better", "best"],
    correct: 2,
    explanation: "Comparative form of 'good' is 'better'.",
  ),
  // B1: Intermediate
  LevelTestQuestion(
    id: 7,
    level: "B1",
    question: "If it ____ tomorrow, we will stay at home.",
    options: ["rain", "rains", "will rain", "rained"],
    correct: 1,
    explanation: "First Conditional: If + Present Simple, will + verb.",
  ),
  LevelTestQuestion(
    id: 8,
    level: "B1",
    question: "He asked me where I ____.",
    options: ["live", "did live", "lived", "am living"],
    correct: 2,
    explanation: "Reported speech: 'Where do you live?' becomes 'asked where I lived'.",
  ),
  LevelTestQuestion(
    id: 9,
    level: "B1",
    question: "The car ____ by my father last week.",
    options: ["was repaired", "is repaired", "repaired", "has repaired"],
    correct: 0,
    explanation: "Passive voice: 'was/were + past participle' for past actions.",
  ),
  // B2: Upper-Intermediate
  LevelTestQuestion(
    id: 10,
    level: "B2",
    question: "I wish I ____ more time to study.",
    options: ["have", "had", "would have", "am having"],
    correct: 1,
    explanation: "Wish + Past Simple for present regrets.",
  ),
  LevelTestQuestion(
    id: 11,
    level: "B2",
    question: "By next year, I ____ my degree.",
    options: ["will finish", "finish", "will have finished", "am finishing"],
    correct: 2,
    explanation: "Future Perfect for actions completed by a certain future time.",
  ),
  LevelTestQuestion(
    id: 12,
    level: "B2",
    question: "Despite ____ hard, he failed the exam.",
    options: ["study", "studying", "of studying", "he studied"],
    correct: 1,
    explanation: "'Despite' is followed by a gerund (-ing form).",
  ),
  // C1: Advanced
  LevelTestQuestion(
    id: 13,
    level: "C1",
    question: "Hardly ____ the office when the phone rang.",
    options: ["I had left", "had I left", "left I", "I left"],
    correct: 1,
    explanation: "Inversion with negative adverbs: 'Hardly had I left...'",
  ),
  LevelTestQuestion(
    id: 14,
    level: "C1",
    question: "It is essential that he ____ here on time.",
    options: ["is", "be", "was", "will be"],
    correct: 1,
    explanation: "Subjunctive mood: 'It is essential that + subject + base form'.",
  ),
  LevelTestQuestion(
    id: 15,
    level: "C1",
    question: "____ for your help, I wouldn't have succeeded.",
    options: ["Had it not been", "Were it not", "If it wasn't", "If it shouldn't be"],
    correct: 0,
    explanation: "Third conditional inversion: 'Had it not been for...' (If it hadn't been...)",
  ),
];

class LevelTestResult {
  final String level;
  final String feedback;

  LevelTestResult(this.level, this.feedback);
}

LevelTestResult getLevelFromScore(int score) {
  if (score >= 14) return LevelTestResult("C1 - Advanced", "Truly impressive! You have a near-native command of English.");
  if (score >= 11) return LevelTestResult("B2 - Upper Intermediate", "Very strong! You can express yourself clearly on most topics.");
  if (score >= 8) return LevelTestResult("B1 - Intermediate", "Good base! You're ready for more complex structures.");
  if (score >= 5) return LevelTestResult("A2 - Elementary", "Solid start! Keep building your vocabulary.");
  return LevelTestResult("A1 - Beginner", "Keep going! Consistency is the key to learning English.");
}
