import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/translations.dart';
import 'dart:math' as math;

class DashboardWidget extends StatelessWidget {
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
  Widget build(BuildContext context) {
    int hours = totalSecondsSpent ~/ 3600;
    int mins = (totalSecondsSpent % 3600) ~/ 60;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        children: [
          // Streak Banner
          _buildStreakBanner(context),
          const SizedBox(height: 24),
          
          // Focus Time Stat (Big) with Wave Animation
          _buildBigStat(
            context,
            title: t('focusTime'),
            value: "${hours}h ${mins}m",
            icon: LucideIcons.hourglass,
            color: const Color(0xFF6366F1),
            showWave: true,
          ),
          const SizedBox(height: 16),

          // Weekly Activity Chart
          _buildWeeklyChart(context),
          const SizedBox(height: 24),

          // Two-column Stats
          Row(
            children: [
              Expanded(
                child: _buildSmallStat(
                  context,
                  title: t('mastered'),
                  value: strongCount.toString(),
                  icon: LucideIcons.brain,
                  color: const Color(0xFF10B981),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSmallStat(
                  context,
                  title: t('progress'),
                  value: totalReviews.toString(),
                  icon: LucideIcons.trendingUp,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Level Test CTA
          _buildLevelTestCTA(context),
          
          const SizedBox(height: 24),
          
          // Achievements Section
          _buildSectionHeader(t('achievementsTitle'), Colors.amber),
          const SizedBox(height: 16),
          _buildAchievementsGrid(context),
          
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildStreakBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark 
            ? [const Color(0xFF1E1E24), const Color(0xFF16161B)]
            : [Colors.white, const Color(0xFFF8FAFC)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(LucideIcons.moon, color: Color(0xFF10B981), size: 30),
              ),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(
                          text: "$streak ",
                          style: GoogleFonts.outfit(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: isDark ? Colors.white : Colors.black,
                          ),
                        ),
                        TextSpan(
                          text: t('dayWord').toUpperCase(),
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Colors.white38,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    t('continuousStreak').toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: Colors.white24,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Weekly Dots
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(7, (index) {
              bool isDone = index < (streak % 7);
              bool isCurrent = index == (streak % 7);
              return Column(
                children: [
                  Text(
                    Translations.data[appLang]!['days'][index].toUpperCase(),
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: isDone || isCurrent ? const Color(0xFF10B981) : Colors.white10,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDone ? const Color(0xFF10B981) : Colors.transparent,
                      border: Border.all(
                        color: isCurrent ? const Color(0xFF10B981) : Colors.white12,
                        width: 2,
                      ),
                    ),
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyChart(BuildContext context) {
    final List<double> data = [0.8, 0.4, 0.9, 0.2, 0.6, 0.3, 0.0];
    final days = Translations.data[appLang]!['days'];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                t('todayTrend').toUpperCase(),
                style: GoogleFonts.outfit(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: Colors.white24,
                ),
              ),
              const Icon(LucideIcons.calendar, size: 14, color: Colors.white24),
            ],
          ),
          const SizedBox(height: 24),
          Column(
            children: List.generate(7, (index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    SizedBox(
                      width: 30,
                      child: Text(
                        days[index].toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: index == 0 ? const Color(0xFF10B981) : Colors.white24,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Stack(
                        children: [
                          Container(
                            height: 6,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                          FractionallySizedBox(
                            widthFactor: data[index],
                            child: Container(
                              height: 6,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    const Color(0xFF10B981).withOpacity(0.8),
                                    const Color(0xFF10B981),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(3),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF10B981).withOpacity(0.2),
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      "${(data[index] * 100).toInt()}%",
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Colors.white24,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildBigStat(BuildContext context, {required String title, required String value, required IconData icon, required Color color, bool showWave = false}) {
    return Container(
      clipBehavior: Clip.antiAlias,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Stack(
        children: [
          if (showWave)
            Positioned.fill(
              child: Opacity(
                opacity: 0.1,
                child: const _WaveWidget(),
              ),
            ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title.toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: color.withOpacity(0.6),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    value,
                    style: GoogleFonts.outfit(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                ],
              ),
              Icon(icon, color: color, size: 32),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSmallStat(BuildContext context, {required String title, required String value, required IconData icon, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 20),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.w900,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Colors.white38,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLevelTestCTA(BuildContext context) {
    return GestureDetector(
      onTap: onLevelTestTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.indigo.withOpacity(0.05),
          borderRadius: BorderRadius.circular(36),
          border: Border.all(color: Colors.indigo.withOpacity(0.1), style: BorderStyle.none),
        ),
        child: Row(
          children: [
            const Icon(LucideIcons.barChart3, color: Colors.indigo, size: 40),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        t('levelTestTitle').toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: Colors.indigo,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.indigo,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text("BETA", style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ],
                  ),
                  Text(
                    t('levelTestDesc'),
                    style: const TextStyle(fontSize: 11, color: Colors.white38),
                  ),
                ],
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
        Icon(LucideIcons.trophy, color: color, size: 18),
        const SizedBox(width: 12),
        Text(
          title.toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            color: isDark ? Colors.white : Colors.black,
          ),
        ),
      ],
    );
  }

  Widget _buildAchievementsGrid(BuildContext context) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: [
        _buildAchievementCard(t('ach_first_word_title'), Colors.blue, true),
        _buildAchievementCard(t('ach_consistent_3_title'), Colors.orange, true),
        _buildAchievementCard(t('ach_hard_worker_title'), Colors.indigo, false),
        _buildAchievementCard(t('ach_master_1_title'), const Color(0xFF10B981), false),
      ],
    );
  }

  Widget _buildAchievementCard(String title, Color color, bool unlocked) {
    return Opacity(
      opacity: unlocked ? 1.0 : 0.4,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF161618),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(unlocked ? LucideIcons.checkCircle : LucideIcons.lock, color: color, size: 30),
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 12,
                fontWeight: FontWeight.w900,
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
