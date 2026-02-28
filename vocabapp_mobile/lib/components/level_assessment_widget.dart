import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'mascot_widget.dart';
import '../utils/level_test_data.dart';

class LevelAssessmentWidget extends StatefulWidget {
  final String Function(String) t;
  final VoidCallback onClose;
  final int streak;

  const LevelAssessmentWidget({
    super.key,
    required this.t,
    required this.onClose,
    required this.streak,
  });

  @override
  State<LevelAssessmentWidget> createState() => _LevelAssessmentWidgetState();
}

class _LevelAssessmentWidgetState extends State<LevelAssessmentWidget> {
  String _viewState = 'intro'; // intro, testing, analyzing, result
  int _currentQuestionIndex = 0;
  final Map<int, int> _answers = {};
  bool _isMovingToNext = false;

  void _startTest() {
    setState(() {
      _viewState = 'testing';
      _currentQuestionIndex = 0;
      _answers.clear();
    });
  }

  void _handleAnswer(int optionIndex) {
    if (_isMovingToNext) return;

    setState(() {
      _answers[_currentQuestionIndex] = optionIndex;
      _isMovingToNext = true;
    });

    Future.delayed(const Duration(milliseconds: 400), () {
      if (!mounted) return;
      if (_currentQuestionIndex < levelTestQuestions.length - 1) {
        setState(() {
          _currentQuestionIndex++;
          _isMovingToNext = false;
        });
      } else {
        _finishTest();
      }
    });
  }

  void _finishTest() {
    setState(() => _viewState = 'analyzing');
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (!mounted) return;
      setState(() => _viewState = 'result');
    });
  }

  int _calculateScore() {
    int score = 0;
    levelTestQuestions.asMap().forEach((idx, q) {
      if (_answers[idx] == q.correct) score++;
    });
    return score;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF121216),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 400),
              child: _buildBody(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.indigo.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(LucideIcons.barChart3, color: Colors.indigo, size: 22),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.t('levelTestTitle'),
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1,
                    ),
                  ),
                  Text(
                    "ENGLISH CORE ENGINE V2",
                    style: GoogleFonts.outfit(
                      color: Colors.indigo,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ],
          ),
          IconButton(
            onPressed: widget.onClose,
            icon: const Icon(LucideIcons.x, color: Colors.white38),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_viewState) {
      case 'intro':
        return _buildIntro();
      case 'testing':
        return _buildTesting();
      case 'analyzing':
        return _buildAnalyzing();
      case 'result':
        return _buildResult();
      default:
        return const SizedBox();
    }
  }

  Widget _buildIntro() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        key: const ValueKey('intro'),
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const MascotWidget(isDark: true, size: MascotSize.lg, look: MascotLook.happy, glow: true),
          const SizedBox(height: 24),
          Text(
            "Hi, I'm your Hoca! 👋",
            style: GoogleFonts.outfit(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, tracking: -1),
          ),
          const SizedBox(height: 12),
          Text(
            "I've prepared 15 questions ranging from basic to advanced. Let's find your real English level together!",
            textAlign: TextAlign.center,
            style: GoogleFonts.outfit(color: Colors.white60, fontSize: 16, fontWeight: FontWeight.w500, height: 1.5),
          ),
          const SizedBox(height: 32),
          _buildInfoPill(LucideIcons.clock, "Estimated Time", "3-5 Minutes"),
          const SizedBox(height: 32),
          _buildPrimaryButton("TESTE BAŞLA", _startTest, icon: LucideIcons.arrowRight),
        ],
      ),
    );
  }

  Widget _buildTesting() {
    final q = levelTestQuestions[_currentQuestionIndex];
    final progress = (_currentQuestionIndex + 1) / levelTestQuestions.length;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        key: const ValueKey('testing'),
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("QUESTION ${_currentQuestionIndex + 1} OF 15", style: GoogleFonts.outfit(color: Colors.indigo, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(6)),
                    child: Text("${q.level} DIFFICULTY", style: GoogleFonts.outfit(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              Text("${(progress * 100).round()}%", style: GoogleFonts.outfit(color: Colors.white24, fontSize: 12, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withOpacity(0.05),
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.indigo),
              minHeight: 6,
            ),
          ),
          const SizedBox(height: 40),
          Text(
            q.question,
            style: GoogleFonts.outfit(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold, height: 1.3),
          ),
          const SizedBox(height: 40),
          ...q.options.asMap().entries.map((entry) {
            final idx = entry.key;
            final text = entry.value;
            final isSelected = _answers[_currentQuestionIndex] == idx;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: GestureDetector(
                onTap: () => _handleAnswer(idx),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: isSelected ? Colors.indigo : Colors.white.withOpacity(0.03),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: isSelected ? Colors.indigo : Colors.white.withOpacity(0.05), width: 2),
                    boxShadow: isSelected ? [BoxShadow(color: Colors.indigo.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5))] : [],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(text, style: GoogleFonts.outfit(color: isSelected ? Colors.white : Colors.white70, fontSize: 16, fontWeight: FontWeight.bold)),
                      if (isSelected) const Icon(LucideIcons.checkCircle2, color: Colors.white, size: 20),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildAnalyzing() {
    return Center(
      key: const ValueKey('analyzing'),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 80, height: 80,
            child: CircularProgressIndicator(strokeWidth: 6, valueColor: AlwaysStoppedAnimation<Color>(Colors.indigo.withOpacity(0.8))),
          ),
          const SizedBox(height: 32),
          Text("Analyzing Skills...", style: GoogleFonts.outfit(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),
          Text("Evaluating patterns and complexity.", style: GoogleFonts.outfit(color: Colors.white38, fontSize: 14, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final score = _calculateScore();
    final eval = getLevelFromScore(score);
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        key: const ValueKey('result'),
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const MascotWidget(isDark: true, size: MascotSize.lg, look: MascotLook.happy, glow: true),
          const SizedBox(height: 24),
          Text("YOUR VERIFIED LEVEL", style: GoogleFonts.outfit(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 3)),
          const SizedBox(height: 8),
          Text(
            eval.level,
            style: GoogleFonts.outfit(color: Colors.emeraldAccent, fontSize: 36, fontWeight: FontWeight.w900, tracking: -1),
          ),
          const SizedBox(height: 8),
          Text("Correct Answers: $score / 15", style: GoogleFonts.outfit(color: Colors.white24, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.03),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(LucideIcons.award, color: Colors.emerald, size: 20),
                    const SizedBox(width: 10),
                    Text("HOCA'DAN NOT", style: GoogleFonts.outfit(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1)),
                  ],
                ),
                const SizedBox(height: 16),
                Text(eval.feedback, style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, height: 1.4)),
                const SizedBox(height: 16),
                Divider(color: Colors.white.withOpacity(0.05)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(LucideIcons.lightbulb, color: Colors.indigo, size: 16),
                    const SizedBox(width: 8),
                    Text("RECOMMENDATION", style: GoogleFonts.outfit(color: Colors.indigo, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  score < 10 ? "Focus on common irregular verbs and daily practice." : "Try reading advanced articles to polish your structures.",
                  style: GoogleFonts.outfit(color: Colors.white38, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          TextButton.icon(
            onPressed: reset,
            icon: const Icon(LucideIcons.rotateCcw, size: 16),
            label: const Text("RESTART TEST"),
            style: TextButton.styleFrom(foregroundColor: Colors.white38, textStyle: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void reset() => setState(() => _viewState = 'intro');

  Widget _buildInfoPill(IconData icon, String title, String value) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.03), borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.white.withOpacity(0.05))),
      child: Row(
        children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.amber.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: Colors.amber, size: 20)),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.outfit(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
              Text(value, style: GoogleFonts.outfit(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPrimaryButton(String text, VoidCallback onTap, {IconData? icon}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity, padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          gradient: const LinearProgressIndicator().valueColor, // Just a placeholder for indigo gradient
          color: Colors.indigo,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.indigo.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(text, style: GoogleFonts.outfit(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 2)),
            if (icon != null) ...[const SizedBox(width: 12), Icon(icon, color: Colors.white, size: 20)],
          ],
        ),
      ),
    );
  }
}
