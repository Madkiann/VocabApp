import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

enum MascotLook { neutral, happy, surprised }
enum MascotSize { sm, md, lg, xl, logo }

class MascotWidget extends StatefulWidget {
  final bool isDark;
  final MascotSize size;
  final bool animated;
  final bool glow;
  final MascotLook look;
  final bool isAdmin;
  final String? className; // For consistency, not used in Flutter

  const MascotWidget({
    super.key,
    required this.isDark,
    this.size = MascotSize.md,
    this.animated = false,
    this.glow = false,
    this.look = MascotLook.neutral,
    this.isAdmin = false,
    this.className,
  });

  @override
  State<MascotWidget> createState() => _MascotWidgetState();
}

class _MascotWidgetState extends State<MascotWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 1.0, end: 1.05).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  double get _sizeDimension {
    switch (widget.size) {
      case MascotSize.sm: return 40;
      case MascotSize.md: return 64;
      case MascotSize.lg: return 96;
      case MascotSize.xl: return 128;
      case MascotSize.logo: return 160;
    }
  }

  String get _assetPath {
    if (widget.look == MascotLook.happy) {
      return 'assets/mascot/Flamingohappy3D.png';
    }
    return 'assets/mascot/Flamingo3D.png';
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: widget.animated ? _animation : const AlwaysStoppedAnimation(1.0),
      child: SizedBox(
        width: _sizeDimension,
        height: _sizeDimension,
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            // Premium Glow
            if (widget.glow || widget.isAdmin)
              Container(
                width: _sizeDimension * 0.8,
                height: _sizeDimension * 0.8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: widget.isAdmin 
                          ? Colors.amber.withOpacity(0.3)
                          : (widget.isDark ? Colors.indigo.withOpacity(0.15) : Colors.blue.withOpacity(0.1)),
                      blurRadius: 40,
                      spreadRadius: 10,
                    ),
                  ],
                ),
              ),

            // Admin Sparkles
            if (widget.isAdmin)
              Positioned(
                top: -10,
                child: const Icon(LucideIcons.sparkles, color: Colors.amber, size: 24),
              ),

            // The Mascot Image with smooth cross-fade between expressions
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 700),
              child: Image.asset(
                _assetPath,
                key: ValueKey(_assetPath),
                fit: BoxFit.contain,
                opacity: const AlwaysStoppedAnimation(0.95),
                filterQuality: FilterQuality.high,
                errorBuilder: (context, error, stackTrace) => _buildFallback(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFallback() {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: widget.isAdmin ? Colors.amber.withOpacity(0.1) : (widget.isDark ? Colors.slate[800] : Colors.slate[200]),
        border: Border.all(color: widget.isAdmin ? Colors.amber : (widget.isDark ? Colors.slate[700]! : Colors.slate[300]!), width: 2),
      ),
      child: Center(
        child: Text(
          widget.isAdmin ? "ADMIN" : "HI",
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: widget.isAdmin ? Colors.amber : (widget.isDark ? Colors.slate[400] : Colors.slate[600]),
          ),
        ),
      ),
    );
  }
}
