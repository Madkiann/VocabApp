import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../data/vocabulary.dart';

class BookmarkButton extends StatefulWidget {
  final Word word;
  const BookmarkButton({super.key, required this.word});

  @override
  State<BookmarkButton> createState() => _BookmarkButtonState();
}

class _BookmarkButtonState extends State<BookmarkButton> {
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
