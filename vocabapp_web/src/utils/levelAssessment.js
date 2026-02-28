/**
 * English Level Assessment Engine
 * Hem Flutter (JS Bridge) hem React tarafında çalışır.
 */

export const evaluateEnglishLevel = (quizScore, writingSample) => {
  const words = writingSample.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const sentences = writingSample.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  const advancedKeywords = [
    "however", "therefore", "although", "consequently", "furthermore", 
    "nevertheless", "moreover", "despite", "whereas", "nonetheless",
    "significant", "essential", "fundamental", "perspective", "analysis"
  ];
  
  const keywordCount = words.filter(w => advancedKeywords.includes(w.toLowerCase())).length;
  
  // Writing Score Hesaplama (Max: 15)
  let writingScore = 0;
  
  if (wordCount > 50) writingScore += 5;
  else if (wordCount > 35) writingScore += 4;
  else if (wordCount > 25) writingScore += 3;
  else if (wordCount > 15) writingScore += 2;
  else if (wordCount > 5) writingScore += 1;
  
  const diversity = wordCount > 0 ? uniqueWords / wordCount : 0;
  if (diversity > 0.8) writingScore += 4;
  else if (diversity > 0.6) writingScore += 3;
  else if (diversity > 0.4) writingScore += 2;
  else if (diversity > 0.2) writingScore += 1;
  
  if (sentenceCount >= 3 && wordCount / sentenceCount > 10) writingScore += 3;
  else if (sentenceCount >= 2) writingScore += 2;
  else if (sentenceCount >= 1) writingScore += 1;
  
  if (keywordCount >= 3) writingScore += 3;
  else if (keywordCount >= 2) writingScore += 2;
  else if (keywordCount >= 1) writingScore += 1;

  const totalScore = quizScore + writingScore;
  let result = { level: "Beginner", feedback: "", analysis: "", score: totalScore };

  if (totalScore >= 25) {
    result.level = "Advanced";
    result.feedback = "Excellent proficiency!";
    result.analysis = "Complex structures detected.";
  } else if (totalScore >= 19) {
    result.level = "Upper Intermediate";
    result.feedback = "Strong grasp of grammar.";
    result.analysis = "Clear organization of ideas.";
  } else if (totalScore >= 13) {
    result.level = "Intermediate";
    result.feedback = "Solid foundation.";
    result.analysis = "Effective communication, try more varied structures.";
  } else if (totalScore >= 7) {
    result.level = "Lower Intermediate";
    result.feedback = "Making progress.";
    result.analysis = "Try using more varied vocabulary.";
  } else {
    result.level = "Beginner";
    result.feedback = "Keep learning!";
    result.analysis = "Focus on basic grammar and simple sentences.";
  }

  return result;
};
