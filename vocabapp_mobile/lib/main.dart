import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'data/translations.dart';
import 'data/vocabulary.dart';
import 'utils/sm2.dart';
import 'components/dashboard_widget.dart';
import 'components/vault_widget.dart';
import 'components/chill_mode_widget.dart';
import 'components/quiz_widget.dart';
import 'components/mascot_widget.dart';

void main() => runApp(const VocabApp());

class VocabApp extends StatelessWidget {
  const VocabApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VocabApp',
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F1012),
        primaryColor: const Color(0xFF6366F1),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
      ),
      home: const LearningScreen(),
    );
  }
}

class LearningScreen extends StatefulWidget {
  const LearningScreen({super.key});

  @override
  State<LearningScreen> createState() => _LearningScreenState();
}

class _LearningScreenState extends State<LearningScreen>
    with SingleTickerProviderStateMixin {
  int _currentIndex =
      0; // 0: Home/Learning, 1: Vault, 2: (center streak), 3: Dashboard, 4: Menu
  int streak = 8;
  int totalSecondsSpent = 3660;
  bool isRevealed = false;
  String appLang = 'tr';
  int currentWordIndex = 0;
  String appMode = 'swipe'; // 'swipe', 'quiz_mc', 'quiz_tf', 'quiz_sentence'
  String vocabMode = 'words'; // 'words', 'phrasal', 'chill'
  QuizQuestion? quizQuestion;
  int cardsSwipedSinceQuiz = 0;
  List<Word> learningWords = [];
  final Map<String, bool> _wordTranslationVisible = {};
  Map<String, dynamic>? _hocaFeedback;
  bool _isEvaluating = false;
  bool _showCommunityHub = false;
  String? _activePanel; // 'writing', 'details', 'ai', 'forms'

  late AnimationController _controller;
  late Animation<double> _animation;
  final TextEditingController _writingController = TextEditingController();

  final List<Word> deck = initialVocabulary;
  List<Word> get savedWords => deck.where((w) => w.isSaved).toList();
  List<String> vaultFolders = ["General", "TOEFL", "Daily Life"];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.elasticOut);
  }

  @override
  void dispose() {
    _controller.dispose();
    _writingController.dispose();
    super.dispose();
  }

  void _handleSM2(int quality) {
    final currentWord = deck[currentWordIndex];
    if (!learningWords.contains(currentWord)) {
      learningWords.add(currentWord);
    }

    setState(() {
      SM2Calculator.calculate(currentWord, quality, 'recall');
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
        _controller.reverse();
        _writingController.clear();
      }
    });
  }

  void _generateQuiz() {
    final target =
        learningWords[DateTime.now().millisecond % learningWords.length];
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
      final displayWord = isCorrectPair
          ? target
          : deck[DateTime.now().millisecond % deck.length];
      displayedEngDef = displayWord.engDef;
      displayedTrDef = displayWord.trDef;
    }

    List<String>? tokens;
    if (type == 'sentence') {
      tokens = target.engExample.split(' ');
    }

    setState(() {
      quizQuestion = QuizQuestion(
        type: type,
        target: target,
        options: options,
        correctTokens: tokens,
        isCorrectPair: isCorrectPair,
        displayedEngDef: displayedEngDef,
        displayedTrDef: displayedTrDef,
      );
      appMode = 'quiz_$type';
      cardsSwipedSinceQuiz = 0;
    });
  }

  void _toggleReveal() {
    setState(() {
      isRevealed = !isRevealed;
      if (isRevealed) {
        _controller.forward(from: 0.0);
      } else {
        _controller.reverse();
      }
    });
  }

  String _t(String key) {
    return Translations.data[appLang]?[key] ?? key;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          _buildCurrentBody(),
          if (_showCommunityHub) _buildCommunityHubOverlay(),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildCurrentBody() {
    if (appMode.startsWith('quiz')) {
      return SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: QuizWidget(
            question: quizQuestion!,
            appLang: appLang,
            onResult: (correct) {
              setState(() {
                appMode = 'swipe';
                currentWordIndex = (currentWordIndex + 1);
                if (currentWordIndex >= deck.length) {
                  // Deck finished
                } else {
                  _controller.reverse();
                  _writingController.clear();
                }
              });
            },
          ),
        ),
      );
    }

    if (currentWordIndex >= deck.length) {
      return _buildDeckFinishedScreen();
    }

    switch (_currentIndex) {
      case 0:
        // If vocabMode is 'chill', show ChillMode; otherwise learning
        if (vocabMode == 'chill') {
          return Stack(
            children: [
              ChillModeWidget(
                vocab: deck,
                isDark: true,
                appLang: appLang,
                t: _t,
              ),
              // Mode selector on top
              _buildModeSelector(),
            ],
          );
        }
        return Stack(children: [_buildLearningScreen(), _buildModeSelector()]);
      case 1:
        return VaultWidget(
          savedWords: savedWords,
          vaultFolders: vaultFolders,
          appLang: appLang,
          t: _t,
          isDark: true,
        );
      case 3:
        return DashboardWidget(
          streak: streak,
          totalReviews: 124,
          strongCount: 42,
          totalSecondsSpent: totalSecondsSpent,
          appLang: appLang,
          t: _t,
          isDark: true,
        );
      case 4:
        return _buildMenuScreen();
      default:
        return _buildLearningScreen();
    }
  }

  Widget _buildMenuScreen() {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              GestureDetector(
                onTap: () => setState(() => _currentIndex = 0),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  child: const Icon(
                    LucideIcons.arrowLeft,
                    size: 24,
                    color: Colors.white70,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _t('settings'),
                style: GoogleFonts.outfit(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Group 1: App Settings
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E1E),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Column(
              children: [
                // Language Switcher
                GestureDetector(
                  onTap: () =>
                      setState(() => appLang = appLang == 'tr' ? 'en' : 'tr'),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          color: Colors.white.withOpacity(0.05),
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(
                            LucideIcons.languages,
                            size: 22,
                            color: theme.primaryColor,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _t('appLanguage'),
                                style: GoogleFonts.outfit(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white.withOpacity(0.85),
                                ),
                              ),
                              Text(
                                appLang == 'tr' ? 'Türkçe' : 'English',
                                style: GoogleFonts.outfit(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 1.5,
                                  color: Colors.white38,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: theme.primaryColor,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            appLang.toUpperCase(),
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Theme Toggle
                Container(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(
                          LucideIcons.moon,
                          size: 22,
                          color: Colors.orange,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _t('themeMode'),
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white.withOpacity(0.85),
                              ),
                            ),
                            Text(
                              'SİSTEM (kaydır)',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 1.5,
                                color: Colors.white38,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 56,
                        height: 28,
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: theme.primaryColor,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Align(
                          alignment: Alignment.center,
                          child: Container(
                            width: 20,
                            height: 20,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Center(
                              child: Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  color: theme.primaryColor,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Community Hub Card
          GestureDetector(
            onTap: () {
              setState(() => _showCommunityHub = true);
            },
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.04),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: theme.primaryColor.withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: theme.primaryColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: const Center(
                      child: MascotWidget(
                        isDark: true,
                        size: MascotSize.sm,
                        look: MascotLook.happy,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _t('communityHub'),
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          _t('feedbackRoadmap').toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: theme.primaryColor.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: theme.primaryColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'BETA',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Social Links
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E1E),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Column(
              children: [
                _buildSettingsLink(
                  icon: LucideIcons.instagram,
                  iconColor: Colors.pink,
                  title: "Instagram'da Takip Et",
                  subtitle: 'YENİ KELİMELER ÖĞREN',
                  hasBorder: true,
                ),
                _buildSettingsLink(
                  icon: LucideIcons.globe,
                  iconColor: Colors.blue,
                  title: 'Websiteyi Ziyaret Et',
                  subtitle: 'DAHA FAZLA KAYNAK',
                  hasBorder: false,
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Version Footer
          Center(
            child: Column(
              children: [
                Text(
                  'V1.0.2 (BETA)',
                  style: GoogleFonts.outfit(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    color: Colors.white24,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Made with ',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2,
                        color: Colors.white24,
                      ),
                    ),
                    const Icon(
                      LucideIcons.heart,
                      size: 10,
                      color: Colors.redAccent,
                    ),
                    Text(
                      ' in Türkiye',
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2,
                        color: Colors.white24,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 120),
        ],
      ),
    );
  }

  Widget _buildSettingsLink({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool hasBorder,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: hasBorder
          ? BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Colors.white.withOpacity(0.05)),
              ),
            )
          : null,
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, size: 22, color: iconColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white.withOpacity(0.85),
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.5,
                    color: Colors.white38,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            LucideIcons.externalLink,
            size: 16,
            color: Colors.white.withOpacity(0.2),
          ),
        ],
      ),
    );
  }

  // Mode Selector (Words / Phrasal / Chill) - matches React
  Widget _buildModeSelector() {
    final theme = Theme.of(context);
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.only(top: 8),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFF0F0F14).withOpacity(0.6),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: Colors.white.withOpacity(0.08)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildModeTab(
                  'words',
                  LucideIcons.bookOpen,
                  _t('modeWords'),
                  theme,
                ),
                _buildModeTab(
                  'phrasal',
                  LucideIcons.layers,
                  _t('modePhrasal'),
                  theme,
                ),
                _buildModeTab(
                  'chill',
                  LucideIcons.coffee,
                  _t('modeChill'),
                  theme,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModeTab(
    String mode,
    IconData icon,
    String label,
    ThemeData theme,
  ) {
    final isActive = vocabMode == mode;
    return GestureDetector(
      onTap: () => setState(() {
        vocabMode = mode;
        isRevealed = false;
        currentWordIndex = 0;
        _activePanel = null;
      }),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? theme.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: theme.primaryColor.withOpacity(0.3),
                    blurRadius: 8,
                  ),
                ]
              : [],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 12,
              color: isActive ? Colors.white : Colors.white38,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: isActive ? Colors.white : Colors.white38,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Community Hub Overlay — matches React CommunityHub.jsx
  Widget _buildCommunityHubOverlay() {
    return _CommunityHubWidget(
      appLang: appLang,
      t: _t,
      onClose: () => setState(() => _showCommunityHub = false),
    );
  }

  Widget _buildDeckFinishedScreen() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            MascotWidget(
              isDark: true,
              size: MascotSize.logo,
              look: MascotLook.happy,
              glow: true,
              animated: true,
            ),
            const SizedBox(height: 40),
            Text(
              _t('congrats').toUpperCase(),
              style: GoogleFonts.outfit(
                fontSize: 32,
                fontWeight: FontWeight.w900,
                color: const Color(0xFF10B981),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _t('deckFinished').toUpperCase(),
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
                color: Colors.white24,
              ),
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => setState(() => currentWordIndex = 0),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 20,
                ),
                shape: RoundedRectangleEdges(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: Text(
                _t('continueTraining').toUpperCase(),
                style: GoogleFonts.outfit(fontWeight: FontWeight.w900),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      height: 100,
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 30),
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF16161B).withOpacity(0.95),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(LucideIcons.home, 0, _t('review')),
          _buildNavItem(LucideIcons.archive, 1, _t('vault')),
          _buildSpecialNavItem(),
          _buildNavItem(LucideIcons.barChart3, 3, _t('panel')),
          _buildNavItem(LucideIcons.menu, 4, _t('menu')),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, int index, String label) {
    bool isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isActive
                  ? const Color(0xFF6366F1).withOpacity(0.1)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              color: isActive ? const Color(0xFF6366F1) : Colors.white24,
              size: 24,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label.toUpperCase(),
            style: GoogleFonts.outfit(
              fontSize: 8,
              fontWeight: FontWeight.w900,
              color: isActive ? const Color(0xFF6366F1) : Colors.white10,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSwipeBackground(bool isLeft) {
    return Container(
      alignment: isLeft ? Alignment.centerLeft : Alignment.centerRight,
      padding: const EdgeInsets.symmetric(horizontal: 40),
      margin: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: isLeft
            ? const Color(0xFF10B981).withOpacity(0.2)
            : const Color(0xFFF43F5E).withOpacity(0.2),
        borderRadius: BorderRadius.circular(44),
      ),
      child: Icon(
        isLeft ? LucideIcons.check : LucideIcons.x,
        color: isLeft ? const Color(0xFF10B981) : const Color(0xFFF43F5E),
        size: 48,
      ),
    );
  }

  Widget _buildSpecialNavItem() {
    return GestureDetector(
      onTap: () {
        // Always navigate to home/review screen
        setState(() {
          _currentIndex = 0;
          appMode = 'swipe';
        });
      },
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFF0F1012),
          shape: BoxShape.circle,
          border: Border.all(
            color: const Color(0xFF14B8A6).withOpacity(0.3),
            width: 2,
          ),
        ),
        child: Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF10B981), Color(0xFF14B8A6)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF10B981).withOpacity(0.4),
                blurRadius: 20,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                const Icon(LucideIcons.moon, color: Colors.white, size: 32),
                Text(
                  "$streak",
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    fontSize: 16,
                    shadows: [
                      const Shadow(color: Colors.black26, blurRadius: 4),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLearningScreen() {
    final theme = Theme.of(context);
    final currentWord = deck[currentWordIndex];
    final timeRemaining = ((deck.length - currentWordIndex) * 0.25).ceil();

    return Stack(
      children: [
        // Main scrollable content
        Dismissible(
          key: ValueKey(currentWordIndex),
          direction: DismissDirection.horizontal,
          onDismissed: (direction) {
            _handleSM2(direction == DismissDirection.endToStart ? 1 : 5);
          },
          background: _buildSwipeBackground(true),
          secondaryBackground: _buildSwipeBackground(false),
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 56, bottom: 20),
              child: Column(
                children: [
                  // --- Not-Revealed State ---
                  if (!isRevealed) ...[
                    GestureDetector(
                      onTap: _toggleReveal,
                      behavior: HitTestBehavior.opaque,
                      child: SizedBox(
                        height: MediaQuery.of(context).size.height * 0.75,
                        child: _buildCardFront(currentWord, theme),
                      ),
                    ),
                  ],

                  // --- Revealed State ---
                  if (isRevealed) ...[
                    // Top actions (Share + Bookmark)
                    Padding(
                      padding: const EdgeInsets.only(right: 24, top: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          _buildIconButton(LucideIcons.share2, () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Paylaşım yakında!'),
                              ),
                            );
                          }, theme),
                          const SizedBox(width: 8),
                          _BookmarkButton(word: currentWord),
                        ],
                      ),
                    ),

                    // Mastered Badge (React: wordObj.sm2.rep > 3)
                    if (currentWord.sm2.repetition > 3)
                      Padding(
                        padding: const EdgeInsets.only(left: 32, top: 8),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: const Color(0xFF10B981).withOpacity(0.2),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  LucideIcons.sparkles,
                                  size: 12,
                                  color: Color(0xFF10B981),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  _t('mastered').toUpperCase(),
                                  style: GoogleFonts.outfit(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1.5,
                                    color: const Color(0xFF10B981),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                    // POS Badge
                    Padding(
                      padding: const EdgeInsets.only(left: 32, top: 16),
                      child: Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: theme.primaryColor.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: theme.primaryColor.withOpacity(0.2),
                            ),
                          ),
                          child: Text(
                            (appLang == 'tr'
                                    ? currentWord.posTr
                                    : currentWord.pos)
                                .toUpperCase(),
                            style: GoogleFonts.outfit(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: theme.primaryColor,
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Word + Translation + Phonetic
                    GestureDetector(
                      onTap: () => setState(() => isRevealed = false),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currentWord.text,
                              style: GoogleFonts.outfit(
                                fontSize: 44,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              currentWord.trWord,
                              style: GoogleFonts.outfit(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: theme.primaryColor,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(
                                  LucideIcons.volume2,
                                  size: 16,
                                  color: Colors.white38,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  currentWord.phonetic,
                                  style: GoogleFonts.outfit(
                                    fontSize: 16,
                                    fontStyle: FontStyle.italic,
                                    color: Colors.white38,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Definition Section
                    _buildDefinitionSection(currentWord, theme),
                    const SizedBox(height: 24),

                    // Example Section
                    _buildExampleSection(currentWord, theme),
                    const SizedBox(height: 32),

                    // 4 Tool Buttons Grid
                    _buildToolButtonsGrid(theme),
                    const SizedBox(height: 16),

                    // Active Panel
                    if (_activePanel != null) ...[
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: _buildActivePanel(currentWord, theme),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Back to front button (React: ChevronDown rotated)
                    Center(
                      child: GestureDetector(
                        onTap: () => setState(() => isRevealed = false),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Transform.rotate(
                                angle: 3.14159,
                                child: const Icon(
                                  LucideIcons.chevronDown,
                                  size: 18,
                                  color: Colors.white24,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                _t('back').toUpperCase(),
                                style: GoogleFonts.outfit(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2,
                                  color: Colors.white24,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // SM2 Buttons
                    _buildSM2Buttons(),
                    const SizedBox(height: 140),
                  ],
                ],
              ),
            ),
          ),
        ),

        // Floating Stats Footer
        Positioned(
          bottom: 16,
          left: 0,
          right: 0,
          child: Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF0A0F1C).withOpacity(0.85),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 20,
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    LucideIcons.bookOpen,
                    size: 14,
                    color: theme.primaryColor,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    "${currentWordIndex + 1} / ${deck.length}",
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  Container(
                    width: 1,
                    height: 14,
                    color: Colors.white.withOpacity(0.15),
                    margin: const EdgeInsets.symmetric(horizontal: 12),
                  ),
                  const Icon(LucideIcons.clock, size: 14, color: Colors.amber),
                  const SizedBox(width: 6),
                  Text(
                    "$timeRemaining ${_t('minsShort')} ${_t('minsLeft')}",
                    style: GoogleFonts.outfit(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildIconButton(IconData icon, VoidCallback onTap, ThemeData theme) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Icon(icon, size: 18, color: Colors.white38),
      ),
    );
  }

  Widget _buildDefinitionSection(Word word, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionLabel(_t('def'), theme.primaryColor),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: theme.primaryColor.withOpacity(0.05),
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: theme.primaryColor.withOpacity(0.15)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _wordTranslationVisible['def_${word.text}'] == true
                      ? word.trDef
                      : word.engDef,
                  style: GoogleFonts.outfit(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    height: 1.3,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      final key = 'def_${word.text}';
                      _wordTranslationVisible[key] =
                          !(_wordTranslationVisible[key] ?? false);
                    });
                  },
                  child: Row(
                    children: [
                      Icon(
                        LucideIcons.refreshCw,
                        size: 14,
                        color: theme.primaryColor,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        (_wordTranslationVisible['def_${word.text}'] == true
                                ? _t('toEn')
                                : _t('toTr'))
                            .toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2,
                          color: theme.primaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExampleSection(Word word, ThemeData theme) {
    bool isExTrVisible = _wordTranslationVisible['ex_${word.text}'] ?? false;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionLabel(_t('ex'), Colors.amber),
          const SizedBox(height: 12),
          Text(
            '"${word.engExample}"',
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              height: 1.5,
              color: Colors.white.withOpacity(0.85),
            ),
          ),
          const SizedBox(height: 12),
          if (!isExTrVisible)
            GestureDetector(
              onTap: () => setState(
                () => _wordTranslationVisible['ex_${word.text}'] = true,
              ),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.refreshCw,
                    size: 14,
                    color: Colors.amber,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    (_t('showTranslation')).toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: Colors.amber,
                    ),
                  ),
                ],
              ),
            )
          else
            GestureDetector(
              onTap: () => setState(
                () => _wordTranslationVisible['ex_${word.text}'] = false,
              ),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.fromBorderSide(
                    BorderSide(
                      color: theme.primaryColor.withOpacity(0.3),
                      width: 0,
                      style: BorderStyle.solid,
                    ),
                  ),
                ),
                child: Text(
                  word.trExample,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontStyle: FontStyle.italic,
                    color: Colors.white60,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSectionLabel(String text, Color color) {
    return Row(
      children: [
        Container(width: 16, height: 2, color: color.withOpacity(0.3)),
        const SizedBox(width: 8),
        Text(
          text.toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 3,
            color: Colors.white30,
          ),
        ),
      ],
    );
  }

  Widget _buildToolButtonsGrid(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.6,
        children: [
          _buildToolButton(
            icon: LucideIcons.pencil,
            label: _t('buildSentence'),
            panelKey: 'writing',
            activeColor: Colors.amber,
            theme: theme,
          ),
          _buildToolButton(
            icon: LucideIcons.bookOpen,
            label: _t('detailsBtn'),
            panelKey: 'details',
            activeColor: const Color(0xFF10B981),
            theme: theme,
          ),
          _buildToolButton(
            icon: LucideIcons.sparkles,
            label: _t('askAiBtn'),
            panelKey: 'ai',
            activeColor: Colors.blue,
            theme: theme,
          ),
          _buildToolButton(
            icon: LucideIcons.layers,
            label: _t('formsBtn'),
            panelKey: 'forms',
            activeColor: theme.primaryColor,
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildToolButton({
    required IconData icon,
    required String label,
    required String panelKey,
    required Color activeColor,
    required ThemeData theme,
  }) {
    final isActive = _activePanel == panelKey;
    return GestureDetector(
      onTap: () => setState(() => _activePanel = isActive ? null : panelKey),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: isActive
              ? activeColor.withOpacity(0.1)
              : Colors.white.withOpacity(0.03),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(
            color: isActive
                ? activeColor.withOpacity(0.4)
                : Colors.white.withOpacity(0.06),
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 24,
              color: isActive ? activeColor : Colors.white38,
            ),
            const SizedBox(height: 8),
            Text(
              label.length > 10 ? label.substring(0, 10) : label,
              style: GoogleFonts.outfit(
                fontSize: 9,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: isActive ? activeColor : Colors.white30,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivePanel(Word word, ThemeData theme) {
    switch (_activePanel) {
      case 'writing':
        return _buildWritingArea(theme);
      case 'details':
        return _buildDetailsPanel(word, theme);
      case 'ai':
        return _buildAiPanel(word, theme);
      case 'forms':
        return _buildFormsPanel(word, theme);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildDetailsPanel(Word word, ThemeData theme) {
    if (word.details == null) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF161618),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFF10B981).withOpacity(0.2)),
        ),
        child: Text(
          _t('noDetails'),
          style: GoogleFonts.outfit(color: Colors.white38),
        ),
      );
    }
    final d = word.details!;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                LucideIcons.bookOpen,
                size: 16,
                color: Color(0xFF10B981),
              ),
              const SizedBox(width: 8),
              Text(
                _t('wordDetails').toUpperCase(),
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: const Color(0xFF10B981),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (d.root != null) _buildDetailChip(_t('root'), d.root!),
          if (d.prefix != null) _buildDetailChip(_t('prefix'), d.prefix!),
          if (d.suffix != null) _buildDetailChip(_t('suffix'), d.suffix!),
          if (d.synonyms.isNotEmpty)
            _buildDetailChip(_t('similarWords'), d.synonyms.join(', ')),
          if (d.mnemonic != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.primaryColor.withOpacity(0.05),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: theme.primaryColor.withOpacity(0.15),
                  style: BorderStyle.solid,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _t('mnemonic').toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: theme.primaryColor,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    appLang == 'tr'
                        ? (d.trMnemonic ?? d.mnemonic!)
                        : d.mnemonic!,
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontStyle: FontStyle.italic,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailChip(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF10B981).withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label.toUpperCase(),
              style: GoogleFonts.outfit(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
                color: const Color(0xFF10B981),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAiPanel(Word word, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.blue.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.sparkles, size: 16, color: Colors.blue),
              const SizedBox(width: 8),
              Text(
                'AI ANALYSIS',
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Center(
            child: Column(
              children: [
                MascotWidget(
                  isDark: true,
                  size: MascotSize.lg,
                  animated: false,
                  glow: false,
                ),
                const SizedBox(height: 12),
                Text(
                  _t('comingSoon').toUpperCase(),
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                    color: Colors.blue.withOpacity(0.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormsPanel(Word word, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: theme.primaryColor.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(LucideIcons.layers, size: 16, color: theme.primaryColor),
              const SizedBox(width: 8),
              Text(
                (_t('wordForms')).toUpperCase(),
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: theme.primaryColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          if (word.wordForms.isEmpty)
            Text(
              _t('noForms'),
              style: GoogleFonts.outfit(color: Colors.white38),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: word.wordForms
                  .map(
                    (wf) => Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: theme.primaryColor.withOpacity(0.15),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            (appLang == 'tr' ? wf.posTr : wf.pos).toUpperCase(),
                            style: GoogleFonts.outfit(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: Colors.white30,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            wf.form,
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: theme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildCardFront(Word word, ThemeData theme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          word.text,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontSize: 52,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.volume2, size: 20, color: Colors.white30),
            const SizedBox(width: 8),
            Text(
              word.phonetic,
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontStyle: FontStyle.italic,
                color: Colors.white24,
              ),
            ),
          ],
        ),
        const SizedBox(height: 80),
        const Icon(LucideIcons.eye, color: Color(0xFF6366F1), size: 36),
        const SizedBox(height: 12),
        Text(
          _t('activeRecallTap').toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 3,
            color: const Color(0xFF6366F1),
          ),
        ),
      ],
    );
  }

  Widget _buildCardBack(Word word, ThemeData theme) {
    // This method is no longer used — kept for compatibility
    return const SizedBox.shrink();
  }

  Widget _buildSM2Buttons() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          Expanded(
            child: _buildSM2Button(
              label: _t('dontKnow'),
              icon: LucideIcons.xCircle,
              color: const Color(0xFFEF4444),
              onTap: () => _handleSM2(1),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: _buildSM2Button(
              label: _t('iKnow'),
              icon: LucideIcons.checkCircle,
              color: const Color(0xFF10B981),
              onTap: () => _handleSM2(5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSM2Button({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(width: 12),
            Text(
              label.toUpperCase(),
              style: GoogleFonts.outfit(
                color: color,
                fontSize: 11,
                fontWeight: FontWeight.w900,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color color) {
    return Row(
      children: [
        Container(width: 3, height: 16, color: color),
        const SizedBox(width: 12),
        Text(
          title,
          style: GoogleFonts.outfit(
            fontSize: 11,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            color: color.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildWordFormsGrid(Word word) {
    return Column(
      children: word.wordForms
          .map(
            (f) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF161618),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.03)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    f.form,
                    style: GoogleFonts.outfit(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    (appLang == 'tr' ? f.posTr : f.pos).toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Colors.white38,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildOriginsBox(WordDetails details) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (details.root != null)
            _buildOriginItem(LucideIcons.anchor, _t('root'), details.root!),
          if (details.prefix != null)
            _buildOriginItem(
              LucideIcons.arrowLeft,
              _t('prefix'),
              details.prefix!,
            ),
          if (details.suffix != null)
            _buildOriginItem(
              LucideIcons.arrowRight,
              _t('suffix'),
              details.suffix!,
            ),
          if (details.synonyms.isNotEmpty)
            _buildOriginItem(
              LucideIcons.copy,
              _t('similarWords'),
              details.synonyms.join(", "),
            ),
        ],
      ),
    );
  }

  Widget _buildOriginItem(IconData icon, String label, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 14, color: Colors.white30),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 10,
                    color: Colors.white30,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  content,
                  style: const TextStyle(fontSize: 14, color: Colors.white70),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailBox({
    required String title,
    required String content,
    required IconData icon,
    required Color color,
    bool isItalic = false,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: color),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: color.withOpacity(0.8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: GoogleFonts.outfit(
              fontSize: 16,
              height: 1.6,
              fontWeight: FontWeight.w500,
              fontStyle: isItalic ? FontStyle.italic : FontStyle.normal,
              color: Colors.white.withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExampleBox(Word word) {
    bool isVisible = _wordTranslationVisible[word.text] ?? false;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    LucideIcons.messageCircle,
                    size: 14,
                    color: Colors.amber,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _t('ex'),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: Colors.amber.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () => setState(
                  () => _wordTranslationVisible[word.text] = !isVisible,
                ),
                child: Text(
                  isVisible
                      ? _t('toEn').toUpperCase()
                      : _t('toTr').toUpperCase(),
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: Colors.blue,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            isVisible ? word.trExample : word.engExample,
            style: GoogleFonts.outfit(
              fontSize: 16,
              height: 1.6,
              fontWeight: FontWeight.w500,
              fontStyle: isVisible ? FontStyle.normal : FontStyle.italic,
              color: Colors.white.withOpacity(0.9),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHocaFeedback(ThemeData theme) {
    final score = _hocaFeedback?['score'] ?? 0;
    final comment = _hocaFeedback?['feedback'] ?? "";
    final corrected = _hocaFeedback?['correctedSentence'] ?? "";

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: theme.primaryColor.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: theme.primaryColor.withOpacity(0.05),
            blurRadius: 40,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const MascotWidget(
                isDark: true,
                size: MascotSize.sm,
                look: MascotLook.happy,
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _t('teacherNotes').toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.5,
                      color: theme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.star,
                        size: 12,
                        color: Colors.amber,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        "${_t('teacherScore')} $score/10",
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            _t('teacherComment'),
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            comment,
            style: GoogleFonts.outfit(
              fontSize: 15,
              height: 1.5,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 24),
          if (corrected.isNotEmpty) ...[
            Text(
              _t('betterVersion'),
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.amber,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.amber.withOpacity(0.1)),
              ),
              child: Text(
                corrected,
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
          ],
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: TextButton.icon(
              onPressed: () => setState(() => _hocaFeedback = null),
              icon: const Icon(LucideIcons.refreshCw, size: 16),
              label: Text(_t('rewrite').toUpperCase()),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.all(16),
                shape: RoundedRectangleEdges(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleSendToTeacher() async {
    if (_writingController.text.isEmpty || _isEvaluating) return;

    setState(() => _isEvaluating = true);

    // Mock response for now, should call LLM later
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isEvaluating = false;
      _hocaFeedback = {
        'score': 8,
        'feedback':
            "Harika bir deneme! Özne ve yüklem uyumun çok iyi. Sadece 'a' yerine 'an' kullanmalıydın.",
        'correctedSentence': "She has an unwavering support for her children.",
      };
    });
  }

  Widget _buildWritingArea(ThemeData theme) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                LucideIcons.pencil,
                size: 14,
                color: Color(0xFF10B981),
              ),
              const SizedBox(width: 8),
              Text(
                _t('writeSentence').toUpperCase(),
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: const Color(0xFF10B981).withOpacity(0.8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _writingController,
            maxLines: 3,
            style: const TextStyle(fontSize: 14),
            decoration: InputDecoration(
              hintText: _t('typeHere'),
              hintStyle: TextStyle(
                color: Colors.white.withOpacity(0.1),
                fontSize: 13,
              ),
              filled: true,
              fillColor: Colors.black.withOpacity(0.15),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _handleSendToTeacher,
              icon: _isEvaluating
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(LucideIcons.sparkles, size: 16),
              label: Text(
                _isEvaluating
                    ? _t('teacherReading').toUpperCase()
                    : _t('sendToTeacher').toUpperCase(),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.all(18),
                shape: RoundedRectangleEdges(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BookmarkButton extends StatefulWidget {
  final Word word;
  const _BookmarkButton({required this.word});

  @override
  State<_BookmarkButton> createState() => _BookmarkButtonState();
}

class _BookmarkButtonState extends State<_BookmarkButton> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          widget.word.isSaved = !widget.word.isSaved;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: widget.word.isSaved
              ? const Color(0xFFF43F5E)
              : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Icon(
          LucideIcons.bookmark,
          size: 20,
          color: widget.word.isSaved
              ? Colors.white
              : Colors.white.withOpacity(0.4),
        ),
      ),
    );
  }
}

class RoundedRectangleEdges extends RoundedRectangleBorder {
  const RoundedRectangleEdges({super.borderRadius});
}

// Community Hub Widget — matches React CommunityHub.jsx
class _CommunityHubWidget extends StatefulWidget {
  final String appLang;
  final String Function(String) t;
  final VoidCallback onClose;

  const _CommunityHubWidget({
    required this.appLang,
    required this.t,
    required this.onClose,
  });

  @override
  State<_CommunityHubWidget> createState() => _CommunityHubWidgetState();
}

class _CommunityHubWidgetState extends State<_CommunityHubWidget> {
  String _activeTab = 'changelog'; // changelog, feedback, bugs

  final List<Map<String, dynamic>> _logs = [
    {
      'id': 3,
      'date': '2026-02-27',
      'tr': {
        'title': 'Mobil Optimizasyon & Jestler',
        'items': [
          'Sürükleme (swipe) ve kaydırma (scroll) çakışmaları giderildi.',
          'Mod seçici ve istatistik kapsüllerindeki yerleşim hataları düzeltildi.',
          'Admin paneli mobil cihazlar için optimize edildi.',
          'Sürükleme hassasiyeti ve tepkiselliği artırıldı.',
        ],
      },
      'en': {
        'title': 'Mobile Optimization & Gestures',
        'items': [
          'Resolved conflicts between swiping and vertical scrolling.',
          'Fixed layout issues with mode selector and stats capsules.',
          'Optimized Admin Panel for mobile devices.',
          'Improved swipe sensitivity and responsiveness.',
        ],
      },
    },
    {
      'id': 1,
      'date': '2026-02-26',
      'tr': {
        'title': 'Yaşam Kalitesi & İstikrar',
        'items': [
          'Uzun kartlar için "Ön Yüze Dön" butonu eklendi.',
          'Chill Mod ve Kelime Modu bilgi yapıları birleştirildi.',
          'Tap to Reveal modundaki kritik çökme giderildi.',
          'Tüm arayüz metinleri yerelleştirildi.',
        ],
      },
      'en': {
        'title': 'Quality of Life & Consistency',
        'items': [
          'Added "Return to Front" button for long cards.',
          'Fused Chill Mode and Vocabulary Mode info structures.',
          'Fixed critical crash in Tap to Reveal mode.',
          'Localized all hardcoded UI strings.',
        ],
      },
    },
    {
      'id': 2,
      'date': '2026-02-24',
      'tr': {
        'title': 'Chill Mod Alfa',
        'items': [
          'Bismillah',
          'SM2 dışı çalışma için Chill Mod eklendi.',
          'Kartların içine istatistik kapsülü eklendi.',
        ],
      },
      'en': {
        'title': 'Chill Mode Alpha',
        'items': [
          'Bismillah',
          'Introduced Chill Mode for non-SM2 studying.',
          'Added embedded stats capsule inside cards.',
        ],
      },
    },
  ];

  final List<Map<String, dynamic>> _tickets = [
    {
      'id': 1,
      'type': 'feedback',
      'title': 'Dark Mode Improvement',
      'desc': 'Add more contrast to the dark theme buttons.',
      'upvotes': 12,
      'status': 'inProgress',
      'author': 'EliteUser',
      'upvoted': false,
    },
    {
      'id': 2,
      'type': 'bug',
      'title': 'Sound Lag on iOS',
      'desc': 'Audio phonetics sometimes takes 2 seconds to play on Safari.',
      'upvotes': 5,
      'status': 'pending',
      'author': 'BetaTester',
      'upvoted': false,
    },
    {
      'id': 3,
      'type': 'feedback',
      'title': 'More Statistics',
      'desc': 'I want to see my weekly learning graph.',
      'upvotes': 45,
      'status': 'resolved',
      'author': 'DataLover',
      'upvoted': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0A0A0C),
      child: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF121212),
                border: Border(
                  bottom: BorderSide(color: Colors.white.withOpacity(0.05)),
                ),
              ),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: widget.onClose,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.05),
                      ),
                      child: const Icon(
                        LucideIcons.arrowLeft,
                        size: 24,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.t('communityHub'),
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          widget.t('feedbackRoadmap').toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: Colors.white24,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const MascotWidget(
                    isDark: true,
                    size: MascotSize.sm,
                    look: MascotLook.happy,
                  ),
                ],
              ),
            ),

            // Tabs
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFF121212),
                border: Border(
                  bottom: BorderSide(color: Colors.white.withOpacity(0.05)),
                ),
              ),
              child: Row(
                children: [
                  _buildHubTab(
                    'changelog',
                    LucideIcons.history,
                    widget.t('changelog'),
                  ),
                  _buildHubTab(
                    'feedback',
                    LucideIcons.messageSquare,
                    widget.t('feedback'),
                  ),
                  _buildHubTab('bugs', LucideIcons.bug, widget.t('bugs')),
                ],
              ),
            ),

            // Content
            Expanded(
              child: _activeTab == 'changelog'
                  ? _buildChangelog()
                  : _buildTickets(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHubTab(String id, IconData icon, String label) {
    final isActive = _activeTab == id;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _activeTab = id),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          margin: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF6366F1) : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: const Color(0xFF6366F1).withOpacity(0.3),
                      blurRadius: 8,
                    ),
                  ]
                : [],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: isActive ? Colors.white : Colors.white38,
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                  color: isActive ? Colors.white : Colors.white38,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChangelog() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: _logs.map((log) {
          final content = widget.appLang == 'tr' ? log['tr'] : log['en'];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF161616),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Text(
                        log['date'],
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          color: Colors.white30,
                        ),
                      ),
                    ),
                    const Icon(
                      LucideIcons.sparkles,
                      size: 16,
                      color: Colors.amber,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  content['title'],
                  style: GoogleFonts.outfit(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                ...((content['items'] as List<String>).map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          margin: const EdgeInsets.only(top: 6, right: 12),
                          decoration: const BoxDecoration(
                            color: Color(0xFF6366F1),
                            shape: BoxShape.circle,
                          ),
                        ),
                        Expanded(
                          child: Text(
                            item,
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.white70,
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                )),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTickets() {
    final filtered = _tickets
        .where((t) => t['type'] == (_activeTab == 'bugs' ? 'bug' : 'feedback'))
        .toList();
    filtered.sort(
      (a, b) => (b['upvotes'] as int).compareTo(a['upvotes'] as int),
    );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${_activeTab == 'bugs' ? widget.t('bugs') : widget.t('feedback')} (${filtered.length})',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: Colors.white24,
                ),
              ),
              GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(widget.t('comingSoon'))),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        LucideIcons.plus,
                        size: 14,
                        color: Colors.black,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        widget.t('addTicket'),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...filtered.map(
            (ticket) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF161616),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(ticket['status']),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                widget.t(ticket['status']),
                                style: GoogleFonts.outfit(
                                  fontSize: 8,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1.5,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'by ${ticket['author']}',
                              style: GoogleFonts.outfit(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5,
                                color: Colors.white24,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          ticket['title'],
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          ticket['desc'],
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white54,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        ticket['upvoted'] = !(ticket['upvoted'] as bool);
                        ticket['upvotes'] =
                            (ticket['upvotes'] as int) +
                            (ticket['upvoted'] as bool ? 1 : -1);
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: (ticket['upvoted'] as bool)
                            ? const Color(0xFF6366F1).withOpacity(0.2)
                            : Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: (ticket['upvoted'] as bool)
                              ? const Color(0xFF6366F1)
                              : Colors.white12,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            LucideIcons.chevronUp,
                            size: 20,
                            color: (ticket['upvoted'] as bool)
                                ? const Color(0xFF6366F1)
                                : Colors.white38,
                          ),
                          Text(
                            '${ticket['upvotes']}',
                            style: GoogleFonts.outfit(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: (ticket['upvoted'] as bool)
                                  ? const Color(0xFF6366F1)
                                  : Colors.white38,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'resolved':
        return const Color(0xFF10B981);
      case 'inProgress':
        return const Color(0xFF6366F1);
      default:
        return Colors.white24;
    }
  }
}
