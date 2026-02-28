import 'dart:math';
import '../data/vocabulary.dart';

class SM2Calculator {
  static Word calculate(Word word, int quality, String mode, {double globalIntervalMultiplier = 1.0}) {
    int rep = word.sm2.repetition;
    double intv = word.sm2.interval.toDouble();
    double ef = word.sm2.efactor;
    int totalReviews = word.sm2.totalReviews + 1;
    int correctReviews = word.sm2.correctReviews + (quality >= 3 ? 1 : 0);

    double modeMultiplier = {
      'recognition': 0.8,
      'recall': 1.2,
      'perfect': 1.5,
      'production': 1.5
    }[mode] ?? 1.0;

    double baseMultiplier = modeMultiplier * globalIntervalMultiplier;

    if (quality >= 3) {
      if (rep == 0) {
        intv = 1 * baseMultiplier;
      } else if (rep == 1) {
        intv = 6 * baseMultiplier;
      } else {
        intv = (intv * ef * baseMultiplier);
      }
      rep += 1;
    } else {
      rep = 0;
      intv = 1;
    }

    // EF calculation: ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;

    int safeIntv = max(1, intv.round());
    int nextDate = DateTime.now().millisecondsSinceEpoch + safeIntv * 24 * 60 * 60 * 1000;

    word.sm2.repetition = rep;
    word.sm2.interval = safeIntv;
    word.sm2.efactor = ef;
    word.sm2.totalReviews = totalReviews;
    word.sm2.correctReviews = correctReviews;
    word.sm2.nextDate = nextDate;

    return word;
  }
}
