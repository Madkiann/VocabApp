# Changelog / Değişiklik Günlüğü

All notable changes to this project will be documented in this file.
Bu projedeki tüm önemli değişiklikler bu dosyada belgelenecektir.

## [2026-02-27]

### Mobile Interaction & Gestures / Mobil Etkileşim ve Hareketler
- **EN**: Added `dragDirectionLock` to `SwipeableCard` to prevent accidental horizontal swipes while scrolling vertically.
- **TR**: Dikey kaydırma (scroll) yaparken yanlışlıkla yatay sürüklemeyi (swipe) önlemek için `SwipeableCard` bileşenine `dragDirectionLock` özelliği eklendi.
- **EN**: Refined `touchAction` and `dragElastic` settings based on card state (`isRevealed`) for a more responsive feel.
- **TR**: Daha tepkisel bir his için kartın durumuna (`isRevealed`) bağlı olarak `touchAction` ve `dragElastic` ayarları optimize edildi.
- **EN**: Removed `stopPropagation` from reveal overlays in `Card` and `PhrasalCard` to allow immediate swipe interaction.
- **TR**: Sürükleme etkileşiminin hemen başlayabilmesi için `Card` ve `PhrasalCard` bileşenlerindeki "açma" katmanlarından `stopPropagation` kaldırıldı.

### UI & Layout Fixes / Arayüz ve Yerleşim Düzeltmeleri
- **EN**: Increased top padding and adjusted `z-index` for Mode Selector and Stats capsules to prevent overlapping.
- **TR**: Mod Seçici ve İstatistik kapsülleri arasındaki çakışmaları önlemek için üst boşluklar artırıldı ve `z-index` değerleri güncellendi.
- **EN**: Optimized Admin Panel with responsive grid layouts for better mobile viewing.
- **TR**: Admin paneli, mobil cihazlarda daha iyi görünmesi için yanıt veren (responsive) grid yapısıyla optimize edildi.
- **EN**: Fixed Chill Mode layout where it was obscuring navigation elements. Added internal scrolling to Chill Mode cards to prevent accidental card switching while reading details.
- **TR**: Chill Mode'un navigasyon elemanlarını kapattığı yerleşim hatası giderildi. Detayları okurken yanlışlıkla kart geçilmesini önlemek için Chill Mode kartlarına iç kaydırma (internal scroll) eklendi.
- **EN**: Reallocated Stats capsule to the bottom of the screen to eliminate overlap with the Mode Selector.
- **TR**: Mod Seçici ile çakışmayı önlemek için İstatistik kapsülü ekranın altına taşındı.

### Documentation & UI / Dokümantasyon & Arayüz
- **EN**: Created `CHANGELOG.md` and updated the in-app Community Hub changelog with recent mobile optimizations.
- **TR**: `CHANGELOG.md` dosyası oluşturuldu ve uygulama içi Topluluk Merkezi (Community Hub) yenilikler kısmı mobil optimizasyonlarla güncellendi.

### Bug Fixes / Hata Düzeltmeleri
- **EN**: Fixed "Argument name clash" error in `SwipeableCard.jsx` caused by duplicate props.
- **TR**: `SwipeableCard.jsx` dosyasındaki mükerrer prop kullanımından kaynaklanan "Argument name clash" hatası giderildi.
- **EN**: Resolved `@theme` block error in CSS by moving transitions to `@layer base`.
- **TR**: CSS'deki `@theme` bloğu hatası, geçiş özelliklerini `@layer base` kısmına taşıyarak çözüldü.
