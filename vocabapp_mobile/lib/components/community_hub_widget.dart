import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'mascot_widget.dart';

class CommunityHubWidget extends StatefulWidget {
  final String appLang;
  final String Function(String) t;
  final VoidCallback onClose;

  const CommunityHubWidget({
    super.key,
    required this.appLang,
    required this.t,
    required this.onClose,
  });

  @override
  State<CommunityHubWidget> createState() => _CommunityHubWidgetState();
}

class _CommunityHubWidgetState extends State<CommunityHubWidget> {
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
