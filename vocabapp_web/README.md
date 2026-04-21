# VocabApp (v1.0.2 - Beta)

VocabApp, dil öğrenimini oyunlaştıran, kişiselleştirilmiş bir kelime kartı (flashcard) uygulamasıdır. SM-2 aralıklı tekrarlama algoritmasını kullanır ve entegre Gemini AI sayesinde kullanıcının cümle kurma becerilerini puanlar.

Bu proje **React + Vite** altyapısıyla geliştirilmiş ve **Capacitor** ile hem Android hem de iOS platformlarında yerel (native) uygulama olarak çalışmak üzere tasarlanmıştır.

> [!NOTE]
> **Klasör Yapısı Hakkında:** Ana ve aktif proje `vocabapp_web` klasöründe yer almaktadır. Üst dizindeki ihtimal dahilinde görebileceğiniz `vocabapp_mobile` klasörü, uygulamanın eski ve yarım kalmış tarihi bir Flutter versiyonudur. Geliştirme yaparken tamamen `vocabapp_web` klasörünü dikkate alınız.

---

## 🏗️ Mimari ve Proje Yapısı

Proje genel olarak modern React pratiklerini (Hooks ve Context API) kullanır. Kodun okunabilirliği ve ayrıştırılması için durum yönetimi (state management) parçalanmıştır.

```text
src/
├── components/       # Tekrar kullanılabilir UI parçaları (Kartlar, Modallar vb.)
├── context/          # Global State Yönetimi (AppContext, VocabContext, SettingsContext)
├── hooks/            # Özel Custom Hooks (useVocabEngine, useAppStorage vs.)
├── data/             # Başlangıç kelime ve phrasal verb setleri
├── utils/            # SM-2 algoritması, Storage asenkron sarmalayıcıları
├── App.jsx           # Ana Navigasyon ve Ekran Yönlendirmesi
└── main.jsx          # React Bootloader (Storage okuma ve Splash Screen gizleme)
```

### Durum Yönetimi (State Management)

Dışarıdan bir Redux/Mobx paketi yerine yerel **Context API** kullanılmıştır.
1. **AppContext.jsx:** Kullanıcının hangi ekranda olduğu (Admin Panel, Öğrenme Ekranı vs.) ve günlük kotaları gibi genel UI durumlarını tutar.
2. **SettingsContext.jsx:** Tema, renk, ses efektleri ve dil tercihi gibi uygulama ayarlarını yönetir. Ayrıca Gemini API Key barındırır.
3. **VocabContext.jsx:** Uygulamanın kalbidir. Hafızadaki kelimeleri, ezber durumlarını, destede çıkacak sıradaki kelimeleri yönetir.
4. **useVocabEngine.js:** SM-2 aralıklı tekrarlama (Spaced Repetition) mantığının uygulandığı yerdir (kelime doğru/yanlış bilindiğinde puanlama yapar).

---

## 💾 Veri Saklama (Storage) ve Capacitor Entegrasyonu

Mobil uygulamaya çıkış (production) standartlarını karşılamak için geleneksel *senkron* `localStorage` yapısından çıkılarak Capacitor'ün sağladığı yerel/güvenli `Preferences` eklentisine geçilmiştir. 

**BootLoader Stratejisi (`src/utils/storage.js`):**
Capacitor Preferences `await` gerektiren asenkron bir kütüphanedir. Ancak React componentleri içerisinde bunu doğrudan kullanmak uygulamada titremelere (flickering) sebep olur.  
**Çözüm:** Uygulama `main.jsx` dosyasında ayağa kalkmadan hemen önce, tüm veriler RAM'de saklanan bir `Map` nesnesine (Cache) aktarılır. Bileşenler `syncStorage.getItem('key')` ile verilere anında erişirken, kaydetme işlemleri arka planda asenkron olarak yerel depolama alanına (`Preferences.set()`) yansıtılır. Bu sayede uygulamanın akıcılığı %100 korunmuştur.

---

## 🤖 Yapay Zeka Entegrasyonu (Gemini)

Uygulamanın `App.jsx` içerisindeki cümle oluşturma bölümünde doğrudan Google Gemini API kullanılmaktadır.  

**Güvenlik (BYOK - Bring Your Own Key):**
API anahtarının çalınmaması için kaynak koda doğrudan gizlenmemiş (hardcode edilmemiş) aksine kullanıcının Ayarlar -> "Gemini API Key" sekmesinden kendi anahtarını girmesine dayalı bir yapı kurulmuştur.

---

## 📱 Yerel Mobil Çıkış (Local Build) Nasıl Alınır?

Bilgisayarınızda (Windows/Mac) bir IDE (Android Studio, Xcode) ve Java (JDK) hazırsa şu komutlarla mobil dosyaları üretebilirsiniz:

```bash
# 1. Projeyi yayın (production) modunda inşa et
npm run build 

# 2. Üretilen dosyaları Capacitor ile Android/iOS klasörlerine taşı
npx cap sync

# 3. İkon ve Açılış Ekranlarını (Splash) Üretmek İçin (Eğer assets eklendiyse)
npx capacitor-assets generate

# 4. Android Studio'yu açıp uygulamayı derleyin
npx cap open android
```

Splash Ekranı ayarları `capacitor.config.json` dosyasında tanımlanmıştır. `main.jsx`'de ReactDOM.render işlemi bittikten hemen sonra ekran otomatik olarak kaldırılır.

---

## 👨‍💻 Gelecek Geliştirmeler İçin Notlar
- `syncStorage` sistemi oldukça sağlam çalışıyor ancak büyük veri setlerinde indexedDB yapısına geçiş düşünülebilir.
- Admin Panel içerisindeki grafik yapısı şu an localStorage istatistikleri üzerinden anlık okuma yapıyor.
