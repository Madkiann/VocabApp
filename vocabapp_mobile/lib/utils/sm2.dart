import 'dart:math';
import '../data/vocabulary.dart';

class SM2Calculator {
  static void calculate(Word word, int quality, String mode, {double globalMultiplier = 1.0}) {
    int rep = word.sm2.repetition;
    int intv = word.sm2.interval;
    double ef = word.sm2.efactor;
    int totalReviews = word.sm2.totalReviews;
    int correctReviews = word.sm2.correctReviews;

    totalReviews += 1;
    if (quality >= 3) correctReviews += 1;

    double modeMultiplier;
    switch (mode) {
      case 'recognition':
        modeMultiplier = 0.8;
        break;
      case 'recall':
        modeMultiplier = 1.2;
        break;
      case 'perfect':
      case 'production':
        modeMultiplier = 1.5;
        break;
      default:
        modeMultiplier = 1.0;
    }

    double baseMultiplier = modeMultiplier * globalMultiplier;

    if (quality >= 3) {
      if (rep == 0) {
        intv = (1 * baseMultiplier).round();
      } else if (rep == 1) {
        intv = (6 * baseMultiplier).round();
      } else {
        intv = (intv * ef * baseMultiplier).round();
      }
      rep += 1;
    } else {
      rep = 0;
      intv = 1;
    }

    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;

    int safeInt = max(1, intv);
    int nextDate = DateTime.now().millisecondsSinceEpoch + (safeInt * 24 * 60 * 60 * 1000);

    // Update the word's SM2 data
    word.sm2.repetition = rep;
    word.sm2.interval = safeInt;
    word.sm2.efactor = ef;
    word.sm2.nextDate = nextDate;
    word.sm2.totalReviews = totalReviews;
    word.sm2.correctReviews = correctReviews;
    word.sm2.lastQualityScore = quality;
  }
}
