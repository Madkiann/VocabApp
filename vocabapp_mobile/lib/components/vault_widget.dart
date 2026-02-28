import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/vocabulary.dart';

class VaultWidget extends StatefulWidget {
  final List<Word> savedWords;
  final List<String> vaultFolders;
  final String appLang;
  final Function(String) t;
  final bool isDark;

  const VaultWidget({
    super.key,
    required this.savedWords,
    required this.vaultFolders,
    required this.appLang,
    required this.t,
    required this.isDark,
  });

  @override
  State<VaultWidget> createState() => _VaultWidgetState();
}

class _VaultWidgetState extends State<VaultWidget> {
  String? activeFolder; // null = overview, String = folder list
  String searchQuery = '';
  final TextEditingController _searchController = TextEditingController();
  int _activeTab = 0; // 0: All, 1: Saved, 2: Created

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (activeFolder != null) {
      return _buildFolderView();
    }
    return _buildOverview();
  }

  Widget _buildOverview() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.t('vault'),
                style: GoogleFonts.outfit(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: widget.isDark ? Colors.white : Colors.black,
                ),
              ),
              const Icon(LucideIcons.search, color: Colors.white24, size: 24),
            ],
          ),
          const SizedBox(height: 32),
          
          // Folder Grid
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.vaultFolders.length,
            itemBuilder: (context, index) {
              final folder = widget.vaultFolders[index];
              final count = widget.savedWords.where((w) => (w.isSaved)).length; // Simplified for now
              return _buildFolderItem(folder, count, index);
            },
          ),
          
          const SizedBox(height: 24),
          
          // Add Folder Button
          Center(
            child: GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(widget.t('comingSoon') ?? 'Coming Soon!'), duration: const Duration(seconds: 1)),
                );
              },
              child: Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6366F1).withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.plus, color: Colors.white, size: 28),
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildFolderItem(String name, int count, int index) {
    final colors = [Colors.blue, Colors.purple, const Color(0xFFF43F5E), const Color(0xFF10B981), Colors.amber];
    final color = colors[index % colors.length];
    
    return GestureDetector(
      onTap: () => setState(() => activeFolder = name),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF161618),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.white.withOpacity(0.03)),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(LucideIcons.archive, color: color, size: 24),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name == 'General' ? widget.t('generalFolder') : name,
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  Text(
                    "$count ${widget.t('words')}",
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white24,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, color: Colors.white12, size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildFolderView() {
    final list = widget.savedWords; // Simplified filter
    
    return Column(
      children: [
        // Header & Search
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              Row(
                children: [
                  GestureDetector(
                    onTap: () => setState(() => activeFolder = null),
                    child: const Icon(LucideIcons.arrowLeft, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Text(
                      activeFolder == 'General' ? widget.t('generalFolder') : activeFolder!,
                      style: GoogleFonts.outfit(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => searchQuery = val),
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: widget.t('search'),
                    hintStyle: const TextStyle(color: Colors.white24),
                    border: InputBorder.none,
                    icon: const Icon(LucideIcons.search, color: Colors.white24, size: 18),
                  ),
                ),
              ),
            ],
          ),
        ),
        
        // Tabs (All, Saved, Created)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
          child: Row(
            children: [
              _buildFilterTab(widget.t('all'), 0),
              const SizedBox(width: 12),
              _buildFilterTab(widget.t('savedWordsTab'), 1),
              const SizedBox(width: 12),
              _buildFilterTab(widget.t('created'), 2),
            ],
          ),
        ),
        
        const SizedBox(height: 20),
        
        // Word List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            itemCount: list.where((w) {
              if (searchQuery.isNotEmpty && !w.text.toLowerCase().contains(searchQuery.toLowerCase())) return false;
              if (_activeTab == 1 && !w.isSaved) return false;
              // if (_activeTab == 2 && !w.isCreated) return false; // Future property
              return true;
            }).length,
            itemBuilder: (context, index) {
              final filteredList = list.where((w) {
                if (searchQuery.isNotEmpty && !w.text.toLowerCase().contains(searchQuery.toLowerCase())) return false;
                if (_activeTab == 1 && !w.isSaved) return false;
                return true;
              }).toList();
              final w = filteredList[index];
              return _buildWordListItem(w);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFilterTab(String label, int index) {
    bool isActive = _activeTab == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFF6366F1) : const Color(0xFF161618),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isActive ? Colors.transparent : Colors.white.withOpacity(0.05)),
        ),
        child: Text(
          label.toUpperCase(),
          style: GoogleFonts.outfit(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: isActive ? Colors.white : Colors.white38,
            letterSpacing: 1.2,
          ),
        ),
      ),
    );
  }

  Widget _buildWordListItem(Word w) {
    return GestureDetector(
      onTap: () {
        // Show detail or something?
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF161618),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.white.withOpacity(0.03)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        w.text,
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFF6366F1),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          (widget.appLang == 'tr' ? w.posTr : w.pos).toUpperCase(),
                          style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white24),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.appLang == 'tr' ? w.trWord : w.engDef,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12, color: Colors.white38),
                  ),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                setState(() {
                  w.isSaved = !w.isSaved;
                });
              },
              child: Icon(
                LucideIcons.bookmark, 
                color: w.isSaved ? const Color(0xFFF43F5E) : Colors.white10, 
                size: 24
              ),
            ),
          ],
        ),
      ),
    );
  }
}
