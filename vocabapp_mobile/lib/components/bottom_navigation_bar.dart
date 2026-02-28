import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomBottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  final int streak;
  final VoidCallback onSpecialTap;
  final String Function(String) t;

  const CustomBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.streak,
    required this.onSpecialTap,
    required this.t,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 90,
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 30),
      decoration: BoxDecoration(
        color: const Color(0xFF16161B).withOpacity(0.95),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(LucideIcons.home, 0, t('review')),
          _buildNavItem(LucideIcons.archive, 1, t('vault')),
          _buildSpecialNavItem(),
          _buildNavItem(LucideIcons.barChart3, 3, t('panel')),
          _buildNavItem(LucideIcons.menu, 4, t('menu')),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, int index, String label) {
    bool isActive = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: isActive ? const Color(0xFF6366F1) : Colors.white24,
            size: 24,
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

  Widget _buildSpecialNavItem() {
    return GestureDetector(
      onTap: onSpecialTap,
      child: Container(
        width: 60,
        height: 60,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF10B981), Color(0xFF14B8A6)],
          ),
          shape: BoxShape.circle,
        ),
        child: Center(
          child: Text(
            "$streak",
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
