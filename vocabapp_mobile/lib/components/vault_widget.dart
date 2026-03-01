import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/vocabulary.dart';
import '../data/translations.dart';

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
  String innerSearchQuery = '';
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _innerSearchController = TextEditingController();
  final TextEditingController _newFolderController = TextEditingController();
  int _activeTab = 0; // 0: All, 1: Saved, 2: Created
  bool isAdding = false;
  bool isSearching = false;
  String sortMode = 'alpha'; // alpha, count_desc, count_asc

  @override
  void dispose() {
    _searchController.dispose();
    _innerSearchController.dispose();
    _newFolderController.dispose();
    super.dispose();
  }

  void _addFolder() {
    if (_newFolderController.text.trim().isNotEmpty) {
      setState(() {
        if (!widget.vaultFolders.contains(_newFolderController.text.trim())) {
          widget.vaultFolders.add(_newFolderController.text.trim());
        }
        _newFolderController.clear();
        isAdding = false;
        activeFolder = widget.vaultFolders.last;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background Glows
        Positioned(
          top: -100, right: -100,
          child: Container(
            width: 300, height: 300,
            decoration: BoxDecoration(
              color: widget.isDark ? Colors.blue.withOpacity(0.12) : Colors.blue.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
          ),
        ),
        Positioned(
          bottom: -50, left: -50,
          child: Container(
            width: 250, height: 250,
            decoration: BoxDecoration(
              color: widget.isDark ? Colors.emerald.withOpacity(0.08) : Colors.emerald.withOpacity(0.04),
              shape: BoxShape.circle,
            ),
          ),
        ),

        AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(opacity: animation, child: SlideTransition(
              position: Tween<Offset>(begin: const Offset(0.05, 0), end: Offset.zero).animate(animation),
              child: child,
            ));
          },
          child: activeFolder != null ? _buildFolderView() : _buildOverview(),
        ),
      ],
    );
  }

  Widget _buildOverview() {
    final List<String> sortedFolders = [...widget.vaultFolders];
    if (sortMode == 'count_desc') {
      sortedFolders.sort((a, b) => widget.savedWords.where((w) => (w.folder ?? 'General') == b).length.compareTo(widget.savedWords.where((w) => (w.folder ?? 'General') == a).length));
    } else if (sortMode == 'count_asc') {
      sortedFolders.sort((a, b) => widget.savedWords.where((w) => (w.folder ?? 'General') == a).length.compareTo(widget.savedWords.where((w) => (w.folder ?? 'General') == b).length));
    } else {
      sortedFolders.sort((a, b) => a.compareTo(b));
    }

    final filteredFolders = sortedFolders.where((f) {
      if (searchQuery.isNotEmpty && !f.toLowerCase().contains(searchQuery.toLowerCase())) return false;
      if (_activeTab == 1 && f != 'General') return false;
      if (_activeTab == 2 && f == 'General') return false;
      return true;
    }).toList();

    return SingleChildScrollView(
      key: const ValueKey('overview'),
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 40),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                widget.t('vault'),
                style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black),
              ),
              Row(
                children: [
                  IconButton(
                    onPressed: () => setState(() => isSearching = !isSearching),
                    icon: Icon(LucideIcons.search, color: isSearching ? const Color(0xFF6366F1) : (widget.isDark ? Colors.white24 : Colors.black26), size: 24),
                  ),
                  PopupMenuButton<String>(
                    icon: Icon(LucideIcons.arrowDownUp, color: sortMode != 'alpha' ? const Color(0xFF6366F1) : (widget.isDark ? Colors.white24 : Colors.black26), size: 24),
                    onPressed: null, // Just to show the menu
                    itemBuilder: (context) => [
                      PopupMenuItem(value: 'alpha', child: Text(widget.t('alpha'))),
                      PopupMenuItem(value: 'count_desc', child: Text(widget.t('desc'))),
                      PopupMenuItem(value: 'count_asc', child: Text(widget.t('asc'))),
                    ],
                    onSelected: (val) => setState(() => sortMode = val),
                  ),
                ],
              ),
            ],
          ),
          
          if (isSearching) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(color: widget.isDark ? const Color(0xFF1E1E1E) : Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white.withOpacity(0.05))),
              child: TextField(
                controller: _searchController,
                onChanged: (val) => setState(() => searchQuery = val),
                style: TextStyle(color: widget.isDark ? Colors.white : Colors.black, fontSize: 14),
                decoration: InputDecoration(hintText: widget.t('searchFolders'), hintStyle: const TextStyle(color: Colors.white24), border: InputBorder.none, icon: const Icon(LucideIcons.search, color: Colors.white24, size: 18)),
              ),
            ),
          ],

          const SizedBox(height: 24),
          Row(
            children: [
              _buildFilterTab(widget.t('all'), 0),
              const SizedBox(width: 8),
              _buildFilterTab(widget.t('savedWordsTab'), 1),
              const SizedBox(width: 8),
              _buildFilterTab(widget.t('created'), 2),
            ],
          ),

          const SizedBox(height: 32),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: filteredFolders.length,
            itemBuilder: (context, index) => _buildDeckItem(filteredFolders[index], index),
          ),

          const SizedBox(height: 32),
          if (isAdding)
            _buildAddFolderInput()
          else
            Center(
              child: GestureDetector(
                onTap: () => setState(() => isAdding = true),
                child: Container(
                  width: 64, height: 64,
                  decoration: BoxDecoration(color: const Color(0xFF6366F1), shape: BoxShape.circle, boxShadow: [BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10))]),
                  child: const Icon(LucideIcons.plus, color: Colors.white, size: 32),
                ),
              ),
            ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildDeckItem(String name, int index) {
    final colors = [Colors.blue, Colors.purple, const Color(0xFFF43F5E), const Color(0xFF10B981), Colors.amber, Colors.cyan];
    final color = colors[index % colors.length];
    final folderWords = widget.savedWords.where((w) => (w.folder ?? 'General') == name).toList();
    final count = folderWords.length;
    final learned = folderWords.where((w) => (w.sm2.interval ?? 0) >= 3).length;
    final double progress = count > 0 ? learned / count : 0.0;

    return GestureDetector(
      onTap: () => setState(() => activeFolder = name),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)))),
        child: Row(
          children: [
            // Stacked Card Look
            SizedBox(
              width: 70, height: 85,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(top: 10, child: Container(width: 55, height: 75, decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(16)))),
                  Positioned(top: 5, child: Container(width: 60, height: 75, decoration: BoxDecoration(color: color.withOpacity(0.5), borderRadius: BorderRadius.circular(16)))),
                  Container(
                    width: 65, height: 75,
                    decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: color.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5))]),
                    child: Icon(name == 'General' ? LucideIcons.history : LucideIcons.bookmark, color: Colors.white, size: 28),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Text(name == 'General' ? (widget.t('generalFolder')) : name, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: widget.isDark ? Colors.white : Colors.black)),
                   const SizedBox(height: 4),
                   Row(
                     children: [
                       Text("$count ", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white38 : Colors.black38)),
                       Text(widget.t('words'), style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white24 : Colors.black26, letterSpacing: 1)),
                     ],
                   ),
                ],
              ),
            ),
            _buildCircularProgress(progress, color),
          ],
        ),
      ),
    );
  }

  Widget _buildCircularProgress(double progress, Color color) {
    return Container(
      width: 50, height: 50,
      padding: const EdgeInsets.all(4),
      child: Stack(
        alignment: Alignment.center,
        children: [
          CircularProgressIndicator(value: 1, strokeWidth: 4, valueColor: AlwaysStoppedAnimation<Color>(widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05))),
          CircularProgressIndicator(value: progress, strokeWidth: 4, valueColor: AlwaysStoppedAnimation<Color>(color), strokeCap: StrokeCap.round),
          Text("${(progress * 100).toInt()}%", style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white38 : Colors.black38)),
        ],
      ),
    );
  }

  Widget _buildFolderView() {
    final filteredWords = widget.savedWords.where((w) {
      if ((w.folder ?? 'General') != activeFolder) return false;
      if (innerSearchQuery.isNotEmpty && !w.text.toLowerCase().contains(innerSearchQuery.toLowerCase())) return false;
      return true;
    }).toList();

    return Column(
      key: const ValueKey('folderView'),
      children: [
        const SizedBox(height: 48),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(activeFolder == 'General' ? widget.t('generalFolder') : activeFolder!, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: widget.isDark ? Colors.white : Colors.black)),
                  ],
                ),
              ),
              IconButton(onPressed: () => setState(() { activeFolder = null; innerSearchQuery = ''; }), icon: Icon(LucideIcons.x, color: widget.isDark ? Colors.white38 : Colors.black38)),
            ],
          ),
        ),
        const SizedBox(height: 20),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(color: widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05), borderRadius: BorderRadius.circular(16)),
            child: TextField(
              controller: _innerSearchController,
              onChanged: (val) => setState(() => innerSearchQuery = val),
              style: TextStyle(color: widget.isDark ? Colors.white : Colors.black, fontSize: 14),
              decoration: InputDecoration(hintText: widget.t('searchWords'), hintStyle: const TextStyle(color: Colors.white24), border: InputBorder.none, icon: const Icon(LucideIcons.search, color: Colors.white24, size: 18)),
            ),
          ),
        ),
        const SizedBox(height: 20),
        Expanded(
          child: filteredWords.isEmpty 
            ? Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(LucideIcons.archive, size: 48, color: widget.isDark ? Colors.white12 : Colors.black12), const SizedBox(height: 16), Text(widget.t('vaultEmpty'), style: TextStyle(color: widget.isDark ? Colors.white24 : Colors.black26, fontWeight: FontWeight.bold))]))
            : ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                itemCount: filteredWords.length,
                itemBuilder: (context, index) => _buildWordListItem(filteredWords[index]),
              ),
        ),
      ],
    );
  }

  Widget _buildWordListItem(Word w) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: widget.isDark ? const Color(0xFF16161B) : Colors.white, borderRadius: BorderRadius.circular(28), border: Border.all(color: Colors.white.withOpacity(0.03))),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(w.text, style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w900, color: const Color(0xFF818CF8))),
                    const SizedBox(width: 12),
                    Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05), borderRadius: BorderRadius.circular(6)), child: Text((widget.appLang == 'tr' ? w.posTr : w.pos).toUpperCase(), style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: widget.isDark ? Colors.white38 : Colors.black38))),
                  ],
                ),
                const SizedBox(height: 4),
                Text(widget.appLang == 'tr' ? w.trWord : w.engDef, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, color: widget.isDark ? Colors.white38 : Colors.black38, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          PopupMenuButton<String>(
            icon: Icon(LucideIcons.move, color: widget.isDark ? Colors.white24 : Colors.black26, size: 16),
            onSelected: (String folder) { setState(() { w.folder = folder; }); },
            itemBuilder: (context) => widget.vaultFolders.map((f) => PopupMenuItem(value: f, child: Text(f, style: const TextStyle(fontSize: 12)))).toList(),
          ),
          IconButton(onPressed: () => setState(() => w.isSaved = false), icon: const Icon(LucideIcons.trash2, color: Colors.roseAccent, size: 16)),
        ],
      ),
    );
  }

  Widget _buildFilterTab(String label, int index) {
    bool isActive = _activeTab == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(color: isActive ? (widget.isDark ? const Color(0xFF6366F1) : Colors.black) : (widget.isDark ? Colors.white.withOpacity(0.05) : Colors.black.withOpacity(0.05)), borderRadius: BorderRadius.circular(20)),
        child: Text(label, style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w900, color: isActive ? Colors.white : Colors.white38)),
      ),
    );
  }

  Widget _buildAddFolderInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(gradient: LinearGradient(colors: [const Color(0xFF6366F1).withOpacity(0.8), const Color(0xFF6366F1)]), borderRadius: BorderRadius.circular(28)),
      child: Row(
        children: [
          Expanded(child: TextField(controller: _newFolderController, autofocus: true, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold), decoration: InputDecoration(hintText: widget.t('folderNamePlaceholder'), hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)), border: InputBorder.none), onSubmitted: (_) => _addFolder())),
          IconButton(onPressed: _addFolder, icon: const Icon(LucideIcons.plus, color: Colors.white, size: 28)),
        ],
      ),
    );
  }
}
