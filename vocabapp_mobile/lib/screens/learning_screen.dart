import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/translations.dart';
import '../data/vocabulary.dart';
import '../utils/sm2.dart';
import '../components/dashboard_widget.dart';
import '../components/vault_widget.dart';
import '../components/chill_mode_widget.dart';
import '../components/quiz_widget.dart';
import '../components/mascot_widget.dart';
import '../components/bookmark_button.dart';
import '../components/community_hub_widget.dart';
import '../components/admin_panel.dart';
import '../components/swipeable_card.dart';
import '../components/level_assessment_widget.dart';
import 'dart:async';

class LearningScreen extends StatefulWidget {
  final bool isDark;
  final VoidCallback onThemeToggle;
  final int currentIndex;
  final Function(int) onIndexChanged;

  const LearningScreen({
    super.key,
    required this.isDark,
    required this.onThemeToggle,
    required this.currentIndex,
    required this.onIndexChanged,
  });

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen> with SingleTickerProviderStateMixin {
  int streak = 8;
  int totalSecondsSpent = 3660;
  bool isRevealed = false;
  String appLang = 'tr';
  int currentWordIndex = 0;
  String appMode = 'swipe'; 
  String vocabMode = 'words';
  QuizQuestion? quizQuestion;
  int cardsSwipedSinceQuiz = 0;
  List<Word> learningWords = [];
  final Map<String, bool> _wordTranslationVisible = {};
  Map<String, dynamic>? _hocaFeedback;
  bool _isEvaluating = false;
  bool _showCommunityHub = false;
  bool isAdmin = false;
  bool showAdminPanel = false;
  int _moonClicks = 0;
  Timer? _moonClickTimer;
  String? _activePanel; 
  double sm2Multiplier = 1.0;

  late AnimationController _controller;
  final TextEditingController _writingController = TextEditingController();

  final List<Word> deck = initialVocabulary;
  List<Word> get savedWords => deck.where((w) => w.isSaved).toList();
  List<String> vaultFolders = ["General", "TOEFL", "Daily Life"];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(milliseconds: 600), vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    _writingController.dispose();
    _moonClickTimer?.cancel();
    super.dispose();
  }

  void _handleSM2(int quality, {String mode = 'recall'}) {
    final currentWord = deck[currentWordIndex];
    if (!learningWords.contains(currentWord)) {
      learningWords.add(currentWord);
    }
    setState(() {
      SM2Calculator.calculate(currentWord, quality, mode, globalMultiplier: sm2Multiplier);
      cardsSwipedSinceQuiz++;
      _nextCard();
    });
  }

  void _nextCard() {
    setState(() {
      isRevealed = false;
      _hocaFeedback = null;
      _isEvaluating = false;
      if (cardsSwipedSinceQuiz >= 3 && learningWords.length >= 2) {
        _generateQuiz();
      } else {
        currentWordIndex = (currentWordIndex + 1) % deck.length;
        _writingController.clear();
      }
    });
  }

  void _generateQuiz() {
    final target = learningWords[DateTime.now().millisecond % learningWords.length];
    final types = ['mc', 'tf', 'sentence'];
    final type = types[DateTime.now().millisecond % 3];
    List<Word>? options;
    if (type == 'mc') {
      options = [target];
      final others = deck.where((w) => w.id != target.id).toList()..shuffle();
      options.addAll(others.take(3));
      options.shuffle();
    }
    bool? isCorrectPair;
    String? displayedEngDef;
    String? displayedTrDef;
    if (type == 'tf') {
      isCorrectPair = DateTime.now().millisecond % 2 == 0;
      final displayWord = isCorrectPair ? target : deck[DateTime.now().millisecond % deck.length];
      displayedEngDef = displayWord.engDef;
      displayedTrDef = displayWord.trDef;
    }
    List<String>? tokens;
    if (type == 'sentence') tokens = target.engExample.split(' ');
    setState(() {
      quizQuestion = QuizQuestion(type: type, target: target, options: options, correctTokens: tokens, isCorrectPair: isCorrectPair, displayedEngDef: displayedEngDef, displayedTrDef: displayedTrDef);
      appMode = 'quiz_$type';
      cardsSwipedSinceQuiz = 0;
    });
  }

  void _toggleReveal() => setState(() => isRevealed = !isRevealed);
  String _t(String key) => Translations.data[appLang]?[key] ?? key;

  void _showMasterKeyDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF161618),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        title: Text("MASTER KEY REQUIRED", style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18, letterSpacing: 2)),
        content: TextField(
          controller: controller,
          obscureText: true,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(hintText: "Enter Master Key...", hintStyle: TextStyle(color: Colors.white.withOpacity(0.2))),
        ),
        actions: [
          TextButton(
            onPressed: () {
              if (controller.text == "1453") {
                setState(() { isAdmin = true; showAdminPanel = true; });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("ADMIN OVERDRIVE ACTIVATED")));
              } else {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("INVALID MASTER KEY")));
              }
            },
            child: Text("VERIFY", style: GoogleFonts.outfit(color: const Color(0xFF10B981), fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }

  bool _showLevelAssessment = false;

  void _showLevelTest() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (_, controller) => LevelAssessmentWidget(
          t: _t,
          onClose: () => Navigator.pop(context),
          streak: streak,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          switchInCurve: Curves.easeInOutQuart,
          switchOutCurve: Curves.easeInOutQuart,
          child: showAdminPanel 
               ? AdminPanel(
                   key: const ValueKey('admin'),
                   isAdmin: isAdmin,
                   sm2Multiplier: sm2Multiplier,
                   onMultiplierChanged: (val) => setState(() => sm2Multiplier = val),
                   onClose: () => setState(() => showAdminPanel = false),
                 )
               : _buildCurrentBody(),
        ),
        
        if (_showCommunityHub) 
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: CommunityHubWidget(
              key: const ValueKey('community'),
              appLang: appLang,
              t: _t,
              onClose: () => setState(() => _showCommunityHub = false),
            ),
          ),
        // Community Hub Trigger
        Positioned(
          top: 60, right: 20,
          child: FloatingActionButton.small(
            backgroundColor: const Color(0xFF6366F1),
            onPressed: () => setState(() => _showCommunityHub = true),
            child: const Icon(LucideIcons.users, size: 18, color: Colors.white),
          ),
        ),
      ],
    );
  }

  Widget _buildCurrentBody() {
    final idx = widget.currentIndex;
    if (appMode.startsWith('quiz')) {
      return Container(key: const ValueKey('quiz'), child: QuizWidget(question: quizQuestion!, appLang: appLang, onResult: (correct) {
        setState(() {
          int quality = correct ? 4 : 1;
          _handleSM2(quality, mode: 'recognition');
          appMode = 'swipe';
        });
      }));
    }
    if (currentWordIndex >= deck.length) return _buildDeckFinishedScreen();

    switch (idx) {
      case 0:
        if (vocabMode == 'chill') return ChillModeWidget(vocab: deck, isDark: true, appLang: appLang, t: _t);
        return Stack(children: [_buildLearningScreen(), _buildModeSelector()]);
      case 1:
        return VaultWidget(savedWords: savedWords, vaultFolders: vaultFolders, appLang: appLang, t: _t, isDark: true);
      case 3:
        return DashboardWidget(
          streak: streak, 
          totalReviews: 124, 
          strongCount: 42, 
          totalSecondsSpent: totalSecondsSpent, 
          appLang: appLang, 
          t: _t, 
          isDark: true,
          onLevelTestTap: _showLevelTest,
        );
      case 4:
        return _buildMenuScreen();
      default:
        return _buildLearningScreen();
    }
  }

  Widget _buildMenuScreen() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 80),
      child: Column(
        children: [
          Row(children: [
            Text(_t('settings'), style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
          ]),
          const SizedBox(height: 24),
          _buildSettingsTile(LucideIcons.languages, Colors.indigo, _t('appLanguage'), appLang == 'tr' ? 'Türkçe' : 'English', () => setState(() => appLang = appLang == 'tr' ? 'en' : 'tr')),
          _buildSettingsTile(LucideIcons.moon, Colors.orange, _t('themeMode'), widget.isDark ? 'KOYU MOD' : 'AÇIK MOD', widget.onThemeToggle),
          const SizedBox(height: 48),
          _buildVersionInfo(),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, Color color, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      onTap: onTap,
      leading: Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)), child: Icon(icon, color: color)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.white38, fontSize: 12)),
    );
  }

  Widget _buildVersionInfo() {
    return GestureDetector(
      onTap: () {
        _moonClicks++;
        if (_moonClicks >= 5) { _moonClicks = 0; _showMasterKeyDialog(); }
      },
      child: Text("VocabApp v1.0.0 (Premium)", style: GoogleFonts.outfit(fontSize: 10, color: Colors.white24)),
    );
  }

  Widget _buildModeSelector() {
    return Positioned(
      top: 100, left: 0, right: 0,
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(color: Colors.black.withOpacity(0.4), borderRadius: BorderRadius.circular(30)),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildModeTab('words', LucideIcons.bookOpen, _t('modeWords')),
              _buildModeTab('phrasal', LucideIcons.layers, _t('modePhrasal')),
              _buildModeTab('chill', LucideIcons.coffee, _t('modeChill')),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModeTab(String mode, IconData icon, String label) {
    final isActive = vocabMode == mode;
    return GestureDetector(
      onTap: () => setState(() { vocabMode = mode; }),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(color: isActive ? const Color(0xFF6366F1) : Colors.transparent, borderRadius: BorderRadius.circular(20)),
        child: Row(children: [
          Icon(icon, size: 12, color: isActive ? Colors.white : Colors.white38),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.white)),
        ]),
      ),
    );
  }

  Widget _buildDeckFinishedScreen() {
    return Center(child: Text(_t('congrats'), style: const TextStyle(color: Colors.white, fontSize: 32)));
  }

  Widget _buildLearningScreen() {
    final currentWord = deck[currentWordIndex];
    return Stack(
      alignment: Alignment.center,
      children: [
        // Mascot Peering from behind
        Positioned(
          top: 80,
          child: Opacity(
            opacity: 0.8,
            child: MascotWidget(
              isDark: true,
              size: MascotSize.xl,
              look: isRevealed ? MascotLook.happy : MascotLook.neutral,
              animated: true,
            ),
          ),
        ),
        
        // The Swipeable Card
        Padding(
          padding: const EdgeInsets.only(top: 180, bottom: 40),
          child: SwipeableCard(
            onSwipe: (isRight) => _handleSM2(isRight ? 4 : 1),
            rightBackground: Container(
              decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(32)),
              child: const Center(child: Icon(LucideIcons.check, color: Color(0xFF10B981), size: 80)),
            ),
            leftBackground: Container(
              decoration: BoxDecoration(color: const Color(0xFFF43F5E).withOpacity(0.1), borderRadius: BorderRadius.circular(32)),
              child: const Center(child: Icon(LucideIcons.x, color: Color(0xFFF43F5E), size: 80)),
            ),
            child: _buildCardContent(currentWord),
          ),
        ),
      ],
    );
  }

  Widget _buildCardContent(Word word) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: const Color(0xFF16161B),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 30, offset: const Offset(0, 15)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 500),
            transitionBuilder: (child, animation) => FadeTransition(opacity: animation, child: ScaleTransition(scale: Tween<double>(begin: 0.95, end: 1.0).animate(animation), child: child)),
            child: !isRevealed 
              ? GestureDetector(
                  key: const ValueKey('front'),
                  onTap: _toggleReveal,
                  child: Container(
                    height: 420,
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(word.text, style: GoogleFonts.outfit(fontSize: 48, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -1.5)),
                        const SizedBox(height: 12),
                        Text(_t('tapToReveal').toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white24, letterSpacing: 2)),
                      ],
                    ),
                  ),
                )
              : _buildRevealedContent(word),
          ),
        ),
      ),
    );
  }

  Widget _buildRevealedContent(Word word) {
    return Container(
      key: const ValueKey('back'),
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(word.text, style: GoogleFonts.outfit(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -1)),
                    Text(word.trWord, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.bold, color: const Color(0xFF818CF8))),
                  ],
                ),
              ),
              BookmarkButton(word: word),
            ],
          ),
          const SizedBox(height: 32),
          _buildAccordionSection(_t('def'), word.engDef, word.trDef, 'def_${word.id}'),
          const SizedBox(height: 16),
          _buildAccordionSection(_t('ex'), word.engExample, word.trExample, 'ex_${word.id}'),
          const SizedBox(height: 32),
          
          // Action Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildPanelToggle(LucideIcons.pencil, _t('write'), 'writing'),
              const SizedBox(width: 12),
              _buildPanelToggle(LucideIcons.sparkles, _t('analyze'), 'ai'),
              const SizedBox(width: 12),
              _buildPanelToggle(LucideIcons.info, _t('details'), 'details'),
            ],
          ),

          if (_activePanel != null) _buildActivePanel(word),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildPanelToggle(IconData icon, String label, String panelId) {
    bool isActive = _activePanel == panelId;
    return GestureDetector(
      onTap: () => setState(() => _activePanel = isActive ? null : panelId),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFF6366F1) : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isActive ? Colors.transparent : Colors.white.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: isActive ? Colors.white : Colors.white38),
            const SizedBox(width: 8),
            Text(label, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: isActive ? Colors.white : Colors.white38)),
          ],
        ),
      ),
    );
  }

  Widget _buildAccordionSection(String label, String eng, String tr, String key) {
    final bool isTr = _wordTranslationVisible[key] ?? false;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white24, letterSpacing: 2)),
        const SizedBox(height: 10),
        GestureDetector(
          onTap: () => setState(() => _wordTranslationVisible[key] = !isTr),
          child: AnimatedSize(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.03),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Text(
                isTr ? tr : eng,
                style: GoogleFonts.outfit(color: isTr ? const Color(0xFFA5B4FC) : Colors.white70, height: 1.5, fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActivePanel(Word word) {
    return AnimatedPadding(
      duration: const Duration(milliseconds: 300),
      padding: const EdgeInsets.only(top: 24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
        ),
        child: _activePanel == 'writing' 
          ? _buildWritingPanel(word)
          : _activePanel == 'ai' ? _buildAiPanel(word) : _buildDetailsPanel(word),
      ),
    );
  }

  Widget _buildWritingPanel(Word word) {
    return Column(
      children: [
        TextField(
          controller: _writingController,
          style: const TextStyle(color: Colors.white),
          maxLines: 2,
          decoration: InputDecoration(hintText: _t('writingPlaceholder'), hintStyle: const TextStyle(color: Colors.white12), border: InputBorder.none),
        ),
        const SizedBox(height: 16),
        InkWell(
          onTap: () => setState(() => _activePanel = null),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12), width: double.infinity,
            decoration: BoxDecoration(color: const Color(0xFF6366F1), borderRadius: BorderRadius.circular(16)),
            child: Center(child: Text(_t('checkAnswer').toUpperCase(), style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white))),
          ),
        ),
      ],
    );
  }

  Widget _buildAiPanel(Word word) {
    return Column(children: [const Icon(LucideIcons.sparkles, color: Color(0xFF818CF8), size: 32), const SizedBox(height: 12), Text(_t('aiLoading'), style: const TextStyle(color: Colors.white38, fontSize: 12))]);
  }

  Widget _buildDetailsPanel(Word word) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildDetailRow(LucideIcons.type, "Part of Speech", word.pos.toUpperCase()),
        _buildDetailRow(LucideIcons.clock, "Retention", "${(word.sm2.interval ?? 0).toString()} Days"),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [Icon(icon, size: 14, color: Colors.white24), const SizedBox(width: 12), Text(label, style: const TextStyle(color: Colors.white24, fontSize: 12)), const Spacer(), Text(value, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold))]),
    );
  }
}
}
