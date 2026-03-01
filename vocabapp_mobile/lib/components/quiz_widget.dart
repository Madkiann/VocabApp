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
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      switchInCurve: Curves.easeOutQuart,
      switchOutCurve: Curves.easeInQuart,
      child: isCorrect == null ? _buildQuestionCard() : _buildFeedbackCard(),
    );
  }

  Widget _buildQuestionCard() {
    return Container(
      key: const ValueKey('question'),
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF16161B),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildHeader(),
          const SizedBox(height: 32),
          _buildQuestionBody(),
          const SizedBox(height: 40),
          _buildOptions(),
        ],
      ),
    );
  }

  Widget _buildFeedbackCard() {
    final type = isCorrect! ? 'success' : 'error';
    final color = isCorrect! ? const Color(0xFF10B981) : const Color(0xFFF43F5E);
    
    return Container(
      key: const ValueKey('feedback'),
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF16161B),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: color.withOpacity(0.3), width: 2),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          MascotWidget(
            isDark: true,
            size: MascotSize.xl,
            look: isCorrect! ? MascotLook.happy : MascotLook.neutral,
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                child: Icon(isCorrect! ? LucideIcons.check : LucideIcons.x, color: Colors.white, size: 28, strokeWidth: 3.5),
              ),
              const SizedBox(width: 16),
              Text(
                feedback!.toUpperCase(),
                style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: color, letterSpacing: -0.5),
              ),
            ],
          ),
          if (!isCorrect!) ...[
             const SizedBox(height: 40),
             Container(
               padding: const EdgeInsets.all(24),
               width: double.infinity,
               decoration: BoxDecoration(
                 color: Colors.white.withOpacity(0.05),
                 borderRadius: BorderRadius.circular(32),
                 border: Border.all(color: Colors.white.withOpacity(0.05)),
               ),
               child: Column(
                 children: [
                   Text(_t('correctAnswerIs').toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: const Color(0xFF6366F1), letterSpacing: 2)),
                   const SizedBox(height: 12),
                   Text(
                     widget.question.target.text.toUpperCase(),
                     style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: const Color(0xFF818CF8), letterSpacing: -1),
                   ),
                 ],
               ),
             ),
          ],
          const SizedBox(height: 40),
          InkWell(
            onTap: () => widget.onResult(isCorrect!),
            borderRadius: BorderRadius.circular(24),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(_t('gotIt').toUpperCase(), style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2)),
                  const SizedBox(width: 12),
                  const Icon(LucideIcons.arrowRight, color: Colors.white, size: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    IconData icon;
    String title;
    switch (widget.question.type) {
      case 'mc': icon = LucideIcons.graduationCap; title = _t('meaning'); break;
      case 'tf': icon = LucideIcons.alertCircle; title = _t('trueFalse'); break;
      case 'sentence': icon = LucideIcons.target; title = _t('buildSentence'); break;
      default: icon = LucideIcons.helpCircle; title = "Quiz";
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: themePrimaryColor.withOpacity(0.1), borderRadius: BorderRadius.circular(16)), child: Icon(icon, color: themePrimaryColor, size: 24)),
            const SizedBox(width: 16),
            Text(title.toUpperCase(), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 1, color: widget.isDark ? Colors.white : Colors.black)),
          ],
        ),
        IconButton(onPressed: () => setState(() => isTranslated = !isTranslated), icon: Icon(LucideIcons.refreshCw, color: Colors.amber.withOpacity(0.7), size: 20)),
      ],
    );
  }

  Widget _buildQuestionBody() {
    if (widget.question.type == 'mc') {
      return Container(
        padding: const EdgeInsets.all(32),
        width: double.infinity,
        decoration: BoxDecoration(color: themePrimaryColor.withOpacity(0.05), borderRadius: BorderRadius.circular(32), border: Border.all(color: themePrimaryColor.withOpacity(0.1))),
        child: Text(isTranslated ? widget.question.target.trDef : widget.question.target.engDef, textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4, color: widget.isDark ? Colors.white : Colors.black)),
      );
    } else if (widget.question.type == 'tf') {
      return Container(
        padding: const EdgeInsets.all(32),
        width: double.infinity,
        decoration: BoxDecoration(color: Colors.white.withOpacity(0.03), borderRadius: BorderRadius.circular(32), border: Border.all(color: Colors.white.withOpacity(0.05))),
        child: Column(
          children: [
            Text(widget.question.target.text, style: GoogleFonts.outfit(fontSize: 40, fontWeight: FontWeight.w900, color: themePrimaryColor, letterSpacing: -1.5)),
            const SizedBox(height: 16),
            Text("\"${isTranslated ? (widget.question.displayedTrDef ?? "") : (widget.question.displayedEngDef ?? "")}\"", textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 18, fontStyle: FontStyle.italic, color: Colors.white38, fontWeight: FontWeight.bold)),
          ],
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.all(32),
        width: double.infinity,
        decoration: BoxDecoration(gradient: LinearGradient(colors: [themePrimaryColor.withOpacity(0.8), themePrimaryColor]), borderRadius: BorderRadius.circular(32), boxShadow: [BoxShadow(color: themePrimaryColor.withOpacity(0.3), blurRadius: 20)]),
        child: Text("\"${widget.question.target.trExample}\"", textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white, height: 1.4)),
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
              borderRadius: BorderRadius.circular(24),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 22),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.03), borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.white.withOpacity(0.05))),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(opt.text.toUpperCase(), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black, letterSpacing: -0.5)),
                    Container(width: 32, height: 32, decoration: BoxDecoration(border: Border.all(color: Colors.white12, width: 2), shape: BoxShape.circle), child: const Icon(LucideIcons.arrowRight, size: 14, color: Colors.white24)),
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
          Expanded(child: _buildActionButton(_t('trueBtn'), const Color(0xFF10B981), () => _handleAnswer(widget.question.isCorrectPair == true))),
          const SizedBox(width: 16),
          Expanded(child: _buildActionButton(_t('falseBtn'), const Color(0xFFF43F5E), () => _handleAnswer(widget.question.isCorrectPair == false))),
        ],
      );
    } else {
      return Column(
        children: [
          Container(
            minHeight: 140,
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.03), borderRadius: BorderRadius.circular(32), border: Border.all(color: Colors.white.withOpacity(0.05), style: BorderStyle.none)),
            child: Wrap(
              spacing: 10,
              runSpacing: 10,
              children: selectedTokens.isEmpty 
                ? [Center(child: Padding(padding: const EdgeInsets.all(20), child: Text(_t('dragTokens').toUpperCase(), textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white10, letterSpacing: 2))))]
                : selectedTokens.map((t) => _buildToken(t, true)).toList(),
            ),
          ),
          const SizedBox(height: 32),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: availableTokens.map((t) => _buildToken(t, false)).toList(),
          ),
          const SizedBox(height: 48),
          _buildActionButton(_t('checkAnswer'), Colors.amber, _handleSentenceCheck, textColor: Colors.black),
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
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF6366F1) : (widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
          borderRadius: BorderRadius.circular(16),
          boxShadow: isSelected ? [BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.3), blurRadius: 10)] : [],
        ),
        child: Text(text, style: GoogleFonts.outfit(fontWeight: FontWeight.w900, color: isSelected ? Colors.white : Colors.white60, fontSize: 14)),
      ),
    );
  }

  Widget _buildActionButton(String label, Color color, VoidCallback onTap, {Color textColor = Colors.white}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(28), boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))]),
        child: Center(child: Text(label.toUpperCase(), style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: textColor, letterSpacing: 2))),
      ),
    );
  }

  Color get themePrimaryColor => const Color(0xFF6366F1);
}

  Color get themePrimaryColor => const Color(0xFF6366F1);
}
