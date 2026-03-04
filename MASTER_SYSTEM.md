# MASTER_SYSTEM.md - Mind Bonds Constitution

## 11. Animation Guard Rules
- **Anti-Snapback**: Kart çıkış animasyonuna (`isSwipingOut`) girdiğinde, parent'tan gelen state güncellemeleri kartın pozisyonunu (x, y) asla resetlememelidir. [cite: 2026-03-02]
- **Entry Dynamics**: Yeni kart girişleri her zaman `y` ekseninde hafif bir yükselme (+40px) ve `scale` büyümesiyle yapılmalı; aşırı sekmeleri önlemek için `mass: 1` ayarı korunmalıdır. [cite: 2026-03-02]

## 12. Viewport-First Design Rules
- **No Static Overflow**: Ana kaydırma ekranında (Swipe Mode) asla `min-height` piksel bazlı verilmemelidir; bunun yerine `dvh` (Dynamic Viewport Height) kullanılmalıdır. [cite: 2026-03-02]
- **Padding Scalability**: Üst padding değerleri (pt-xx), ekran yüksekliğine göre (vh) veya mobile özel breakpointler ile dinamik olarak küçültülmelidir. [cite: 2026-03-02]
- **Zero-Scroll Policy**: Aktif çalışma modunda (Vocab/Phrasal) kullanıcının aşağı kaydırma yapma zorunluluğu %0'a indirilmelidir. [cite: 2026-03-02]

## 13. Premium Interaction Rules
- **Gentle Throw**: Kart fırlatma mesafesi 600px ile sınırlandırılmalı ve 0.5s süreyle yavaşlatılarak (Cubic-Bezier [0.32, 0.72, 0, 1]) "süzülme" hissi verilmelidir. [cite: 2026-03-02]
- **Fixed Viewport Structure**: Uygulama ana sarmalayıcısı her zaman `h-dvh` olmalı ve dikeyde taşmaları engellemek için `flex-col` + `overflow-hidden` yapısı kullanılmalıdır. [cite: 2026-03-02]

## 14. Zero-Overlap Layout Rules
- **Vertical Header Stack**: Achievements, Discovery Bar ve Mode Selector birbirini ezmeyecek şekilde `flex flex-col` içinde dikey olarak istiflenmelidir. [cite: 2026-03-04]
- **Main Content Separation**: Orta gövde (`main`), alt navigasyondan (`nav`) net bir şekilde ayrılmalı; kartın navbar'a yapışmasını önlemek için `pb-24` (mobile) güvenlik boşluğu korunmalıdır. [cite: 2026-03-04]
- **Semantic Hierarchy**: Layout yapısı `header`, `main` ve `nav` etiketleri ile hiyerarşik olarak bölünmeli, z-index çakışmaları bu katmanlarda yönetilmelidir. [cite: 2026-03-04]
