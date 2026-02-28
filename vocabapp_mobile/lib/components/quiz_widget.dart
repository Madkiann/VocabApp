import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/vocabulary.dart';
import '../data/translations.dart';
import 'mascot_widget.dart';

class QuizQuestion {
  final String type; // 'mc', 'tf', 'sentence'
  final Word target;
  final List<Word>? options; // for mc
  final List<String>? correctTokens; // for sentence
  final String? displayedEngDef; // for tf
  final String? displayedTrDef; // for tf
  final bool? isCorrectPair; // for tf

  QuizQuestion({
    required this.type,
    required this.target,
    this.options,
    this.correctTokens,
    this.displayedEngDef,
    this.displayedTrDef,
    this.isCorrectPair,
  });
}

class QuizWidget extends StatefulWidget {
  final QuizQuestion question;
  final String appLang;
  final Function(bool isCorrect) onResult;

  const QuizWidget({
    super.key,
    required this.question,
    required this.appLang,
    required this.onResult,
  });

  @override
  State<QuizWidget> createState() => _QuizWidgetState();
}

class _QuizWidgetState extends State<QuizWidget> {
  bool isTranslated = false;
  String? feedback;
  bool? isCorrect;
  List<String> selectedTokens = [];
  List<String> availableTokens = [];

  @override
  void initState() {
    super.initState();
    if (widget.question.type == 'sentence') {
      _initSentenceQuiz();
    }
  }

  void _initSentenceQuiz() {
    final correct = widget.question.correctTokens ?? [];
    // Just a simple shuffle of correct tokens + some distractors for now
    final tokens = [...correct];
    tokens.shuffle();
    availableTokens = tokens;
  }

  String _t(String key) {
    return Translations.data[widget.appLang]?[key] ?? key;
  }

  void _handleAnswer(bool correct) {
    setState(() {
      isCorrect = correct;
      feedback = correct ? _t('perfect') : _t('incorrectCorrect');
    });
    
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) {
        widget.onResult(correct);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildHeader(),
          const SizedBox(height: 24),
          _buildQuestionBody(),
          const SizedBox(height: 32),
          if (isCorrect == null) _buildOptions() else _buildFeedback(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    IconData icon;
    String title;
    switch (widget.question.type) {
      case 'mc':
        icon = LucideIcons.graduationCap;
        title = _t('meaning');
        break;
      case 'tf':
        icon = LucideIcons.alertCircle;
        title = _t('trueFalse');
        break;
      case 'sentence':
        icon = LucideIcons.target;
        title = _t('buildSentence');
        break;
      default:
        icon = LucideIcons.helpCircle;
        title = "Quiz";
    }

    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: themePrimaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: themePrimaryColor, size: 24),
        ),
        const SizedBox(width: 16),
        Text(
          title.toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            letterSpacing: 1,
          ),
        ),
        const Spacer(),
        IconButton(
          onPressed: () => setState(() => isTranslated = !isTranslated),
          icon: Icon(
            LucideIcons.refreshCw,
            color: Colors.amber.withOpacity(0.7),
            size: 20,
          ),
        ),
      ],
    );
  }

  Widget _buildQuestionBody() {
    if (widget.question.type == 'mc') {
      return Container(
        padding: const EdgeInsets.all(24),
        width: double.infinity,
        decoration: BoxDecoration(
          color: themePrimaryColor.withOpacity(0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: themePrimaryColor.withOpacity(0.1)),
        ),
        child: Text(
          isTranslated ? widget.question.target.trDef : widget.question.target.engDef,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            height: 1.4,
          ),
        ),
      );
    } else if (widget.question.type == 'tf') {
      return Container(
        padding: const EdgeInsets.all(24),
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.03),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          children: [
            Text(
              widget.question.target.text,
              style: GoogleFonts.outfit(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: themePrimaryColor,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              isTranslated ? (widget.question.displayedTrDef ?? "") : (widget.question.displayedEngDef ?? ""),
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontStyle: FontStyle.italic,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
          ],
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.all(24),
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [themePrimaryColor.withOpacity(0.8), themePrimaryColor],
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(color: themePrimaryColor.withOpacity(0.3), blurRadius: 20),
          ],
        ),
        child: Text(
          "\"${widget.question.target.trExample}\"",
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
      );
    }
  }

  Widget _buildOptions() {
    if (widget.question.type == 'mc') {
      return Column(
        children: widget.question.options!.map((opt) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              onTap: () => _handleAnswer(opt.id == widget.question.target.id),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withOpacity(0.05)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      opt.text.toUpperCase(),
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const Icon(LucideIcons.arrowRight, size: 18, color: Colors.white24),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      );
    } else if (widget.question.type == 'tf') {
      return Row(
        children: [
          Expanded(
            child: _buildActionButton(
              _t('trueBtn'),
              const Color(0xFF10B981),
              () => _handleAnswer(widget.question.isCorrectPair == true),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: _buildActionButton(
              _t('falseBtn'),
              const Color(0xFFF43F5E),
              () => _handleAnswer(widget.question.isCorrectPair == false),
            ),
          ),
        ],
      );
    } else {
      return Column(
        children: [
          // Selected Tokens
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: selectedTokens.map((t) => _buildToken(t, true)).toList(),
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white10),
          const SizedBox(height: 16),
          // Available Tokens
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: availableTokens.map((t) => _buildToken(t, false)).toList(),
          ),
          const SizedBox(height: 24),
          _buildActionButton(
            _t('checkAnswer'),
            Colors.amber,
            _handleSentenceCheck,
            textColor: Colors.black,
          ),
        ],
      );
    }
  }

  void _handleSentenceCheck() {
    final userSentence = selectedTokens.join(' ').toLowerCase().replaceAll(RegExp(r'[.,!?]'), '');
    final correctSentence = widget.question.correctTokens!.join(' ').toLowerCase().replaceAll(RegExp(r'[.,!?]'), '');
    _handleAnswer(userSentence == correctSentence);
  }

  Widget _buildToken(String text, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            selectedTokens.remove(text);
            availableTokens.add(text);
          } else {
            availableTokens.remove(text);
            selectedTokens.add(text);
          }
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? themePrimaryColor : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(isSelected ? 0 : 0.1)),
        ),
        child: Text(
          text,
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : Colors.white.withOpacity(0.7),
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(String label, Color color, VoidCallback onTap, {Color textColor = Colors.white}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
          ],
        ),
        child: Center(
          child: Text(
            label.toUpperCase(),
            style: GoogleFonts.outfit(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: textColor,
              letterSpacing: 2,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeedback() {
    final color = isCorrect! ? const Color(0xFF10B981) : const Color(0xFFF43F5E);
    return Column(
      children: [
        MascotWidget(
          isDark: true, 
          size: MascotSize.md, 
          look: isCorrect! ? MascotLook.happy : MascotLook.surprised
        ),
        const SizedBox(height: 24),
        Icon(
          isCorrect! ? LucideIcons.checkCircle : LucideIcons.xCircle,
          color: color,
          size: 64,
        ),
        const SizedBox(height: 16),
        Text(
          feedback!.toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        if (!isCorrect!) ...[
          const SizedBox(height: 16),
          Text(
             _t('correctAnswerIs'),
             style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5)),
          ),
           Text(
             widget.question.target.text.toUpperCase(),
             style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ]
      ],
    );
  }

  Color get themePrimaryColor => const Color(0xFF6366F1);
}
