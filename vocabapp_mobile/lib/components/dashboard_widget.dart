import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/translations.dart';
import '../data/vocabulary.dart';
import 'dart:math' as math;

class DashboardWidget extends StatefulWidget {
  final int streak;
  final int totalReviews;
  final int strongCount;
  final int totalSecondsSpent;
  final String appLang;
  final Function(String) t;
  final bool isDark;
  final VoidCallback onLevelTestTap;

  const DashboardWidget({
    super.key,
    required this.streak,
    required this.totalReviews,
    required this.strongCount,
    required this.totalSecondsSpent,
    required this.appLang,
    required this.t,
    required this.isDark,
    required this.onLevelTestTap,
  });

  @override
  State<DashboardWidget> createState() => _DashboardWidgetState();
}

class _DashboardWidgetState extends State<DashboardWidget> {
  String _achFilter = 'all'; // all, unlocked, locked
  final List<Word> _weakWords = initialVocabulary.take(5).toList(); // Mock data for now

  @override
  Widget build(BuildContext context) {
    int hours = widget.totalSecondsSpent ~/ 3600;
    int mins = (widget.totalSecondsSpent % 3600) ~/ 60;

    return Stack(
      children: [
        // Background Glows
        Positioned(
          top: -100, left: -100,
          child: Container(
            width: 300, height: 300,
            decoration: BoxDecoration(
              color: widget.isDark ? Colors.indigo.withOpacity(0.15) : Colors.indigo.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const DecoratedBox(decoration: BoxDecoration(shape: BoxShape.circle)),
          ),
        ),
        Positioned(
          bottom: -50, right: -50,
          child: Container(
            width: 250, height: 250,
            decoration: BoxDecoration(
              color: widget.isDark ? Colors.emerald.withOpacity(0.1) : Colors.emerald.withOpacity(0.05),
              shape: BoxShape.circle,
            ),
          ),
        ),

        SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const SizedBox(height: 40),
              // Unique Fluid Streak Banner
              _buildStreakBanner(context),
              const SizedBox(height: 24),
              
              // Metro Layout Stats
              _buildBigStat(
                context,
                title: widget.t('focusTime'),
                value: "${hours}${widget.t('hoursShort')} ${mins}${widget.t('minsShort')}",
                icon: LucideIcons.hourglass,
                color: const Color(0xFF6366F1),
                showWave: true,
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _buildSmallStat(
                      context,
                      title: widget.t('mastered'),
                      value: widget.strongCount.toString(),
                      icon: LucideIcons.brain,
                      color: const Color(0xFF10B981),
                      pillText: "Bilinen",
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildSmallStat(
                      context,
                      title: widget.t('progress'),
                      value: widget.totalReviews.toString(),
                      icon: LucideIcons.trendingUp,
                      color: Colors.blue,
                      pillText: "Tekrar",
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // Level Test card
              _buildLevelTestCTA(context),
              
              const SizedBox(height: 24),

              // Weak Words Section
              if (_weakWords.isNotEmpty) _buildWeakWordsSection(),

              const SizedBox(height: 24),
              
              // Achievements Section
              _buildAchievementsSection(context),
              
              const SizedBox(height: 100),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStreakBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: widget.isDark 
            ? [const Color(0xFF0F172A), const Color(0xFF1E293B)]
            : [Colors.white, const Color(0xFFF8FAFC)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(widget.isDark ? 0.05 : 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(widget.isDark ? 0.3 : 0.05),
            blurRadius: 30,
            offset: const Offset(0, 15),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 64, height: 64,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF2DD4BF)]),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.5), blurRadius: 20)],
                        ),
                      ),
                      Container(
                        width: 60, height: 60,
                        decoration: BoxDecoration(
                          color: widget.isDark ? const Color(0xFF0F172A) : Colors.white,
                          borderRadius: BorderRadius.circular(22),
                        ),
                        child: const Icon(LucideIcons.moon, color: Color(0xFF10B981), size: 32),
                      ),
                    ],
                  ),
                  const SizedBox(width: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: "${widget.streak} ",
                              style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black),
                            ),
                            TextSpan(
                              text: widget.t('dayWord'),
                              style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white38),
                            ),
                          ],
                        ),
                      ),
                      Text(widget.t('continuousStreak').toUpperCase(), style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 2, color: Colors.white24)),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(LucideIcons.moon, size: 10, color: Color(0xFF10B981)),
                            const SizedBox(width: 6),
                            Text(widget.t('ramadanUpdate').toUpperCase(), style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: const Color(0xFF10B981))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                onPressed: () {},
                icon: Icon(LucideIcons.share2, color: widget.isDark ? Colors.white38 : Colors.black38),
              ),
            ],
          ),
          const SizedBox(height: 32),
          // Timeline Flow
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                height: 4,
                width: double.infinity,
                decoration: BoxDecoration(color: widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05), borderRadius: BorderRadius.circular(2)),
              ),
              FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: widget.streak % 7 / 7,
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF2DD4BF)]),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(7, (index) {
                  bool isDone = index < (widget.streak % 7);
                  bool isCurrent = index == (widget.streak % 7);
                  return Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        Translations.data[widget.appLang]!['days'][index].toUpperCase(),
                        style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: isDone || isCurrent ? const Color(0xFF10B981) : Colors.white10),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDone ? const Color(0xFF10B981) : (isCurrent ? (widget.isDark ? Colors.black : Colors.white) : Colors.transparent),
                          border: Border.all(color: isDone || isCurrent ? const Color(0xFF10B981) : Colors.white12, width: 2),
                          boxShadow: isCurrent ? [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.5), blurRadius: 10)] : [],
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWeakWordsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            children: [
              const Icon(LucideIcons.zap, color: Colors.roseAccent, size: 18),
              const SizedBox(width: 12),
              Text(widget.t('wordsToFocus').toUpperCase(), style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black, letterSpacing: 1)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: _weakWords.length,
            itemBuilder: (context, index) {
              final w = _weakWords[index];
              return Container(
                width: 140, margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: widget.isDark ? const Color(0xFF16161B) : Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Colors.white.withOpacity(widget.isDark ? 0.05 : 0.1)),
                  boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.roseAccent.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                      child: Text("90% BAŞARI", style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.roseAccent)),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(w.text, style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black)),
                        Text(w.trWord, style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white38)),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAchievementsSection(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(LucideIcons.trophy, color: Colors.amber, size: 18),
                const SizedBox(width: 12),
                Text(widget.t('achievementsTitle').toUpperCase(), style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black, letterSpacing: 1)),
              ],
            ),
            IconButton(onPressed: () {}, icon: const Icon(LucideIcons.chevronDown, color: Colors.white24, size: 20)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: ['all', 'unlocked', 'locked'].map((f) {
            final isActive = _achFilter == f;
            return GestureDetector(
              onTap: () => setState(() => _achFilter = f),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFF6366F1) : (widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  f == 'all' ? widget.t('achFilterAll') : (f == 'unlocked' ? widget.t('achFilterUnlocked') : widget.t('achFilterLocked')),
                  style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: isActive ? Colors.white : Colors.white38),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 20),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1,
          children: _getFilteredAchievements().map((ach) => _buildAchievementCard(ach)).toList(),
        ),
      ],
    );
  }

  List<Map<String, dynamic>> _getFilteredAchievements() {
    final achs = [
      {'id': 'first_word', 'title': widget.t('ach_first_word_title'), 'color': Colors.blue, 'done': true},
      {'id': 'consistent_3', 'title': widget.t('ach_consistent_3_title'), 'color': Colors.orange, 'done': true},
      {'id': 'hard_worker', 'title': widget.t('ach_hard_worker_title'), 'color': Colors.indigo, 'done': false},
      {'id': 'master_1', 'title': widget.t('ach_master_1_title'), 'color': const Color(0xFF10B981), 'done': false},
    ];
    if (_achFilter == 'unlocked') return achs.where((a) => a['done'] == true).toList();
    if (_achFilter == 'locked') return achs.where((a) => a['done'] == false).toList();
    return achs;
  }

  Widget _buildAchievementCard(Map<String, dynamic> ach) {
    bool unlocked = ach['done'];
    Color color = ach['color'];
    return Opacity(
      opacity: unlocked ? 1.0 : 0.5,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: widget.isDark ? const Color(0xFF16161B) : Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: Colors.white.withOpacity(widget.isDark ? 0.05 : 0.1)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(unlocked ? LucideIcons.checkCircle : LucideIcons.lock, color: color, size: 32),
            const SizedBox(height: 16),
            Text(ach['title'], textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black)),
          ],
        ),
      ),
    );
  }

  Widget _buildBigStat(BuildContext context, {required String title, required String value, required IconData icon, required Color color, bool showWave = false}) {
    return Container(
      clipBehavior: Clip.antiAlias,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Stack(
        children: [
          if (showWave) Positioned.fill(child: Opacity(opacity: 0.1, child: const _WaveWidget())),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title.toUpperCase(), style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2, color: color.withOpacity(0.6))),
                  const SizedBox(height: 8),
                  Text(value, style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black)),
                ],
              ),
              Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: color, size: 32)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSmallStat(BuildContext context, {required String title, required String value, required IconData icon, required Color color, required String pillText}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: widget.isDark ? const Color(0xFF161618) : Colors.white,
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 24),
              Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: widget.isDark ? Colors.white10 : Colors.black10, borderRadius: BorderRadius.circular(10)), child: Text(pillText.toUpperCase(), style: GoogleFonts.outfit(fontSize: 8, fontWeight: FontWeight.w900, color: Colors.white60))),
            ],
          ),
          const SizedBox(height: 20),
          Text(value, style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black)),
          Text(title, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white24)),
        ],
      ),
    );
  }

  Widget _buildLevelTestCTA(BuildContext context) {
    return GestureDetector(
      onTap: widget.onLevelTestTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.indigo.withOpacity(0.05),
          borderRadius: BorderRadius.circular(40),
          border: Border.all(color: Colors.indigo.withOpacity(0.2), style: BorderStyle.none),
        ),
        child: Row(
          children: [
            Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: widget.isDark ? Colors.indigo.withOpacity(0.1) : Colors.indigo.withOpacity(0.05), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]), child: const Icon(LucideIcons.barChart3, color: Colors.indigo, size: 32)),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(widget.t('levelTestTitle').toUpperCase(), style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.indigo, letterSpacing: 1.5)),
                      const SizedBox(width: 8),
                      Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: Colors.indigo, borderRadius: BorderRadius.circular(4)), child: const Text("BETA", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white))),
                    ],
                  ),
                  Text(widget.t('levelTestDesc'), style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.white38)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _WaveWidget extends StatefulWidget {
  const _WaveWidget();

  @override
  State<_WaveWidget> createState() => _WaveWidgetState();
}

class _WaveWidgetState extends State<_WaveWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(painter: _WavePainter(_controller.value));
      },
    );
  }
}

class _WavePainter extends CustomPainter {
  final double progress;
  _WavePainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF6366F1)..style = PaintingStyle.fill;
    final path = Path();
    final y = size.height * 0.5;
    path.moveTo(0, y);
    for (double i = 0; i <= size.width; i++) {
      path.lineTo(i, y + 10 * math.sin((i / size.width * 2 * math.pi) + (progress * 2 * math.pi)));
    }
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class _WaveWidget extends StatefulWidget {
  const _WaveWidget();

  @override
  State<_WaveWidget> createState() => _WaveWidgetState();
}

class _WaveWidgetState extends State<_WaveWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _WavePainter(_controller.value),
        );
      },
    );
  }
}

class _WavePainter extends CustomPainter {
  final double progress;
  _WavePainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF6366F1)
      ..style = PaintingStyle.fill;

    final path = Path();
    final y = size.height * 0.5;
    
    path.moveTo(0, y);
    for (double i = 0; i <= size.width; i++) {
      path.lineTo(i, y + 10 * math.sin((i / size.width * 2 * math.pi) + (progress * 2 * math.pi)));
    }
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
