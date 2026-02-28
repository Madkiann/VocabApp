import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminPanel extends StatelessWidget {
  final bool isAdmin;
  final double sm2Multiplier;
  final Function(double) onMultiplierChanged;
  final VoidCallback onClose;

  const AdminPanel({
    super.key,
    required this.isAdmin,
    required this.sm2Multiplier,
    required this.onMultiplierChanged,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: const Color(0xFF161618),
        title: Text(
          "ADMIN OVERDRIVE",
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
          ),
        ),
        leading: IconButton(
          icon: const Icon(LucideIcons.x),
          onPressed: onClose,
        ),
      ),
      body: DefaultTabController(
        length: 4,
        child: Column(
          children: [
            const TabBar(
              isScrollable: true,
              indicatorColor: Color(0xFF10B981),
              tabs: [
                Tab(text: "INSIGHTS"),
                Tab(text: "CMS"),
                Tab(text: "GALLERY"),
                Tab(text: "LOGS"),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildAdminInsights(),
                  _buildAdminCms(),
                  const Center(child: Text("Gallery Work in Progress")),
                  _buildAdminLogs(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminInsights() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        _buildStatCard("DAU", "1,240", LucideIcons.user, Colors.indigo),
        _buildStatCard(
          "MOST POPULAR",
          "CHILL MODE",
          LucideIcons.activity,
          Colors.amber,
        ),
        const SizedBox(height: 24),
        Text(
          "MODE DISTRIBUTION",
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            fontSize: 12,
            color: Colors.white24,
          ),
        ),
        const SizedBox(height: 12),
        _buildProgressStat("Words", 0.45, Colors.indigo),
        _buildProgressStat("Chill", 0.30, Colors.teal),
        _buildProgressStat("Phrasal", 0.15, Colors.amber),
        _buildProgressStat("Quiz", 0.10, Colors.pink),
        const SizedBox(height: 32),
        Text(
          "ALGORITHM CONTROL",
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            fontSize: 12,
            color: Colors.white24,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFF161618),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.05)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "SM-2 Multiplier",
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  Text(
                    "${sm2Multiplier.toStringAsFixed(1)}x",
                    style: const TextStyle(
                      color: Color(0xFF6366F1),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Slider(
                value: sm2Multiplier,
                min: 0.5,
                max: 3.0,
                divisions: 25,
                activeColor: const Color(0xFF6366F1),
                onChanged: onMultiplierChanged,
              ),
              const Text(
                "Adjusts how fast intervals grow",
                style: TextStyle(fontSize: 10, color: Colors.white24),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white38,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProgressStat(String label, double value, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                "${(value * 100).toInt()}%",
                style: const TextStyle(color: Colors.white38, fontSize: 10),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: value,
            color: color,
            backgroundColor: Colors.white.withOpacity(0.05),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildAdminCms() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text(
          "VOCABULARY INJECTION",
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            fontSize: 12,
            color: Colors.white24,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 16),
        _buildCmsItem("Resilience", "Dayanıklılık", "vocabulary"),
        _buildCmsItem("Break a leg", "Başarılar", "phrasal"),
        _buildCmsItem("Ephemeral", "Geçici", "vocabulary"),
        const SizedBox(height: 32),
        ElevatedButton.icon(
          onPressed: () {},
          icon: const Icon(LucideIcons.plus, size: 16),
          label: const Text(
            "ADD NEW RECORD",
            style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.2),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF10B981),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCmsItem(String word, String tr, String category) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF161618),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                word,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Colors.white,
                ),
              ),
              Text(
                tr,
                style: const TextStyle(color: Colors.white38, fontSize: 12),
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.indigo.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              category.toUpperCase(),
              style: const TextStyle(
                color: Colors.indigo,
                fontSize: 8,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdminLogs() {
    final logs = [
      {
        "time": "12:50",
        "type": "AUTH",
        "msg": "Admin access granted using MasterKey",
        "color": Colors.green,
      },
      {
        "time": "12:44",
        "type": "SYS",
        "msg": "System Heartbeat: OK",
        "color": Colors.white70,
      },
      {
        "time": "12:40",
        "type": "USER",
        "msg": "New User Registered: @omermirza",
        "color": Colors.indigo,
      },
      {
        "time": "12:35",
        "type": "DATA",
        "msg": "SM-2 Matrix Recalculated (n=145)",
        "color": Colors.blue,
      },
      {
        "time": "12:30",
        "type": "CMS",
        "msg": "Added word 'Ethereal' to vocabulary bank",
        "color": Colors.amber,
      },
      {
        "time": "12:25",
        "type": "ERR",
        "msg": "Failed to fetch remote translations (Retry: 1)",
        "color": Colors.red,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(24),
      itemCount: logs.length,
      itemBuilder: (context, index) {
        final log = logs[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "[${log['time']}]",
                style: const TextStyle(
                  fontFamily: "monospace",
                  color: Colors.white24,
                  fontSize: 11,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: (log['color'] as Color).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  log['type'] as String,
                  style: TextStyle(
                    color: log['color'] as Color,
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  log['msg'] as String,
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
