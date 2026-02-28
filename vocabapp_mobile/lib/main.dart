import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/learning_screen.dart';
import 'components/bottom_navigation_bar.dart';
import 'data/translations.dart';

void main() {
  runApp(const VocabApp());
}

class VocabApp extends StatefulWidget {
  const VocabApp({super.key});

  @override
  State<VocabApp> createState() => _VocabAppState();
}

class _VocabAppState extends State<VocabApp> {
  bool isDark = true;
  int _currentIndex = 0;
  String appLang = 'tr';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'VocabApp',
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      theme: _buildTheme(Brightness.light),
      darkTheme: _buildTheme(Brightness.dark),
      home: Scaffold(
        body: LearningScreen(
          isDark: isDark,
          onThemeToggle: () => setState(() => isDark = !isDark),
          currentIndex: _currentIndex,
          onIndexChanged: (i) => setState(() => _currentIndex = i),
        ),
        bottomNavigationBar: CustomBottomNav(
          currentIndex: _currentIndex,
          onTap: (i) => setState(() => _currentIndex = i),
          streak: 8, // Could be stateful if exported
          onSpecialTap: () => setState(() => _currentIndex = 0),
          t: (key) => Translations.data[appLang]?[key] ?? key,
        ),
      ),
    );
  }

  ThemeData _buildTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ThemeData(
      brightness: brightness,
      primaryColor: const Color(0xFF6366F1),
      scaffoldBackgroundColor: isDark ? const Color(0xFF0F1012) : const Color(0xFFF8FAFC),
      textTheme: GoogleFonts.outfitTextTheme(
        isDark ? ThemeData.dark().textTheme : ThemeData.light().textTheme,
      ),
      useMaterial3: true,
    );
  }
}
