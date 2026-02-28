import 'package:flutter/material.dart';

enum MascotLook { neutral, happy, surprised }
enum MascotSize { sm, md, lg, xl, logo }

class MascotWidget extends StatelessWidget {
  final bool isDark;
  final MascotSize size;
  final bool animated;
  final bool glow;
  final MascotLook look;
  final bool isAdmin;

  const MascotWidget({
    super.key,
    required this.isDark,
    this.size = MascotSize.md,
    this.animated = false,
    this.glow = false,
    this.look = MascotLook.neutral,
    this.isAdmin = false,
  });

  double get _sizeDimension {
    switch (size) {
      case MascotSize.sm: return 40;
      case MascotSize.md: return 64;
      case MascotSize.lg: return 96;
      case MascotSize.xl: return 128;
      case MascotSize.logo: return 160;
    }
  }

  String get _assetPath {
    if (look == MascotLook.happy) {
      return 'assets/mascot/Flamingohappy3D.png';
    }
    return 'assets/mascot/Flamingo3D.png';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: _sizeDimension,
      height: _sizeDimension,
      child: Stack(
        alignment: Alignment.center,
        children: [
          if (glow || isAdmin)
            Container(
              width: _sizeDimension * 1.5,
              height: _sizeDimension * 1.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: isAdmin 
                        ? Colors.amber.withOpacity(0.4)
                        : (isDark ? Colors.indigo.withOpacity(0.2) : Colors.blue.withOpacity(0.2)),
                    blurRadius: 40,
                    spreadRadius: 10,
                  ),
                ],
              ),
            ),
          Image.asset(
            _assetPath,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isAdmin ? Colors.amber.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                  border: Border.all(
                    color: isAdmin ? Colors.amber : Colors.grey,
                    style: BorderStyle.solid,
                    width: 2,
                  ),
                ),
                child: Center(
                  child: Text(
                    isAdmin ? "ADMIN" : "HI",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: isAdmin ? Colors.amber : Colors.grey,
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
