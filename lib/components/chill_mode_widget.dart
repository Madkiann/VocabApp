import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/painting.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/vocabulary.dart';
import 'mascot_widget.dart';

class ChillModeWidget extends StatefulWidget {
  final List<Word> vocab;
  final bool isDark;
  final String appLang;
  final Function(String) t;

  const ChillModeWidget({
    super.key,
    required this.vocab,
    required this.isDark,
    required this.appLang,
    required this.t,
  });

  @override
  State<ChillModeWidget> createState() => _ChillModeWidgetState();
}

class _ChillModeWidgetState extends State<ChillModeWidget> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: widget.isDark ? const Color(0xFF0A0A0C) : const Color(0xFFF8F9FA),
      body: Stack(
        children: [
          // Background Glow
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // Faint Large Mascot Background
          Positioned(
            bottom: -50,
            right: -50,
            child: Opacity(
              opacity: 0.03,
              child: MascotWidget(
                isDark: widget.isDark,
                size: MascotSize.logo,
              ),
            ),
          ),
          
          PageView.builder(
            controller: _pageController,
            scrollDirection: Axis.vertical,
            onPageChanged: (v) => setState(() => _currentIndex = v),
            itemCount: widget.vocab.length,
            itemBuilder: (context, index) {
              return _ChillCard(
                word: widget.vocab[index],
                isDark: widget.isDark,
                appLang: widget.appLang,
                t: widget.t,
                index: index + 1,
                total: widget.vocab.length,
              );
            },
          ),
          
          // Stats Overlay (Floating at bottom center)
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(LucideIcons.bookOpen, color: Color(0xFF6366F1), size: 16),
                    const SizedBox(width: 8),
                    Text(
                      "${_currentIndex + 1} / ${widget.vocab.length}",
                      style: GoogleFonts.outfit(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Icon(LucideIcons.clock, color: Colors.amber, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      "${(widget.vocab.length - _currentIndex) * 0.25.ceil()} ${widget.t('minsShort')}",
                      style: GoogleFonts.outfit(
                        fontSize: 12,
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
      ),
    );
  }
}

class _ChillCard extends StatefulWidget {
  final Word word;
  final bool isDark;
  final String appLang;
  final Function(String) t;
  final int index;
  final int total;

  const _ChillCard({
    required this.word,
    required this.isDark,
    required this.appLang,
    required this.t,
    required this.index,
    required this.total,
  });

  @override
  State<_ChillCard> createState() => _ChillCardState();
}

class _ChillCardState extends State<_ChillCard> {
  bool isRevealed = false;
  bool showTranslation = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => isRevealed = !isRevealed),
      child: Container(
        padding: const EdgeInsets.all(40),
        child: Center(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 500),
            child: !isRevealed ? _buildFront() : _buildBack(),
          ),
        ),
      ),
    );
  }

  Widget _buildFront() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            widget.word.pos.toUpperCase(),
            style: GoogleFonts.outfit(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 2,
              color: const Color(0xFF6366F1),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          widget.word.text,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontSize: 56,
            fontWeight: FontWeight.w900,
            color: widget.isDark ? Colors.white : Colors.black,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.volume2, color: Colors.indigo, size: 24),
            const SizedBox(width: 12),
            Text(
              widget.word.phonetic,
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontStyle: FontStyle.italic,
                color: Colors.white24,
              ),
            ),
          ],
        ),
        const SizedBox(height: 60),
        const Icon(LucideIcons.hand, color: Color(0xFF6366F1), size: 36),
        const SizedBox(height: 12),
        Text(
          widget.t('activeRecallTap').toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            color: const Color(0xFF6366F1),
          ),
        ),
      ],
    );
  }

  Widget _buildBack() {
    return Container(
      constraints: const BoxConstraints(maxWidth: 400),
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: widget.isDark ? const Color(0xFF161618).withOpacity(0.8) : Colors.white,
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: SingleChildScrollView(
        child: Column(
          children: [
            Text(
              widget.word.text,
              style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900),
            ),
            Text(
              widget.word.trWord,
              style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF6366F1)),
            ),
            const SizedBox(height: 24),
            
            _buildInfoCard(
              title: widget.t('def'),
              content: widget.appLang == 'tr' ? widget.word.trDef : widget.word.engDef,
              color: Colors.indigo,
            ),
            
            _buildInfoCard(
              title: "EXAMPLE",
              content: showTranslation ? widget.word.trExample : widget.word.engExample,
              color: Colors.amber,
              isExample: true,
              onToggleTranslate: () => setState(() => showTranslation = !showTranslation),
              isTranslated: showTranslation,
            ),
            
            const SizedBox(height: 16),
            
            if (widget.word.wordForms.isNotEmpty)
              _buildDetailSection(
                title: widget.t('wordForms'),
                children: widget.word.wordForms.map((wf) => Container(
                  margin: const EdgeInsets.only(right: 8, bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(wf.form, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 8),
                      Text(
                        (widget.appLang == 'tr' ? wf.posTr : wf.pos).toUpperCase(), 
                        style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white24)
                      ),
                    ],
                  ),
                )).toList(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard({
    required String title, 
    required String content, 
    String? subContent, 
    required Color color, 
    bool isExample = false,
    VoidCallback? onToggleTranslate,
    bool isTranslated = false,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: widget.isDark ? Colors.black.withOpacity(0.3) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(title.toUpperCase(), style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: color.withOpacity(0.6), letterSpacing: 1.5)),
              if (onToggleTranslate != null) ...[
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: onToggleTranslate,
                  child: Icon(LucideIcons.languages, size: 12, color: color.withOpacity(0.4)),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),
          Text(
            content, 
            textAlign: TextAlign.center, 
            style: TextStyle(
              fontSize: isExample ? 18 : 14, 
              fontWeight: isExample ? FontWeight.bold : FontWeight.normal, 
              fontStyle: isExample && !isTranslated ? FontStyle.italic : FontStyle.normal, 
              color: isExample ? Colors.amber[600] : Colors.white70
            )
          ),
          if (subContent != null) ...[
            const SizedBox(height: 8),
            Text(subContent, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: Colors.white38)),
          ]
        ],
      ),
    );
  }

  Widget _buildDetailSection({required String title, required List<Widget> children}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 8, bottom: 8),
          child: Text(title.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white38, letterSpacing: 1.5)),
        ),
        Wrap(children: children),
      ],
    );
  }
}
