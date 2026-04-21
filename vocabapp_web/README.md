# VocabApp (v1.0.3 - Beta)

VocabApp, dil öğrenimini oyunlaştıran, kişiselleştirilmiş bir kelime kartı (flashcard) uygulamasıdır. SM-2 aralıklı tekrarlama algoritmasını kullanır ve entegre Gemini AI sayesinde kullanıcının cümle kurma becerilerini puanlar. İleri seviye konuşma/pratik becerileri için ise entegre bir **Gölgeleme (Shadowing)** motoru barındırır.

Bu proje **React + Vite** altyapısıyla geliştirilmiş ve **Capacitor** ile hem Android hem de iOS platformlarında yerel (native) uygulama olarak çalışmak üzere tasarlanmıştır.

> [!NOTE]
> **Klasör Yapısı Hakkında:** Ana ve aktif proje `vocabapp_web` klasöründe yer almaktadır. Üst dizindeki ihtimal dahilinde görebileceğiniz `vocabapp_mobile` klasörü uygulamanın eski varyasyonudur. Geliştirme yaparken tamamen ve sadece `vocabapp_web` klasörünü dikkate alınız.

---

## 🎙️ Shadowing (Pratik Yap) Özelliği ve Mimari Analizi

**Sisteme Erişim:** `Panel -> Kütüphane -> Okuma (Texts) -> Herhangi bir metin seçin -> Pratik Yap (Shadowing)` menü yoluyla erişilir.

Shadowing modülü, kullanıcıların telaffuzlarını anadil seviyesine çıkarmak için gelişmiş, oyunlaştırılmış ve tam kontrollü bir dijital okuma motoru sağlar.

### Temel Fonksiyonlar & Özellikler:
1. **Dinamik Ses Takibi (Holistic Anchor Motoru):** Kullanıcının sesini gerçek zamanlı okuyup metin üzerindeki kelimeleri yakalar. Yanlış söylenen veya atlanılan kısımlar tolere edilirken, karaoke tarzı akıllı bir ilerleyiş sunulur.
2. **"Perfect!" Gitar Hero Modu:** Kullanıcı bir cümlede 3'ten fazla kelime öbeğini çok net ve yüksek güvenilirlikle (>%96) telaffuz etiğinde tatmin edici bir görsel geri bildirim alır (spam olmaması için 4 saniyelik limitlere bağlanmıştır). 
3. **Ghost Mode (Hayalet Modu):** Kognitif yük oluşturup kısa süreli hafızayı geliştirmek için, halihazırda okuduğun geçmiş kelimeleri siler/gizler, seni hep önündeki cümleye mecbur kılar.
4. **Dinamik Netflix Altyazısı:** Sabit çeviri metni yerine kelime kelime neredeysen sadece o anki geçerli cümlenin çevirisini göstererek odak kaybını engeller.
5. **Kıyaslama Panosu (Grid Layout):** Oturum sonrası; telaffuz hızını (WPM), Başarı oranını (%) gösterirken, kullanıcının kendi ses kaydını yerel TTS (Text-to-Speech) aksanıyla alt alta play/pause yapıp kıyaslamasına izin verir. Tökezlenen tüm kelimeler tek tıkla Kasaya (Vocab Vault) yollanabilir.

### ⚠️ Geliştirici Tarafı & Uyarılar (Developer Notes)
Benden sonra projeyi devralacak veya kodları inceleyecek kişi için kritik notlar ve sorun giderici referanslar:

- **Dosya Kontrolü:** Bütün Gölgeleme modülü `src/components/ShadowingSession.jsx` içindedir.
- **Mobilde Sınırlamalar (Ciddi Kısıtlama):** Bu panel masaüstünde devasa bir verimlilik ve stabilitede çalışır. Ancak özelikle mobil cihazlarda (iOS Safari ve Android Chrome) native ses tanıma donanımı, donanıma iki kere kilit atmasına (aynı anda hem Web Speech hem de MediaRecorder) izin vermez, sistemi kilitler. Bu sebeple **mobilde ses kayıt donanımı bilinçli olarak kapatılmıştır**, mikrofon gücü %100 konuşma tanımaya (Speech Recognition) verilmiştir.
- **Kopukluklar ve "Holistic Anchor Framework":** Yine mobilde ses tanıma API'leri kesik kesik (chunk) çalışıp kendi kendi yeniden bağlandığı için ve daha kötüsü _cümledeki ilk sözcükleri sonradan duyup geriye dönük değiştirdiği için (retroactive patching)_, kelime eşleştirme döngüsü kafayı yiyor / atlıyordu. Bunu engellemek için kodun içinde `sessionStartIdxRef` adında mutlak bir çıpa noktası oluşturuldu. Geçmiş unutularak sadece güncel dinleme parçası simüle edilerek sistem ehlileştirildi. Algılamalar yine de bazen sapıtabilir, referans modül olarak kabul edilmelidir. Çok daha keskin mobil tecrübeleri için gelecekte native Capacitor mikrofon veya ML kit pluginleri gerekebilir. 
- **Mobilde Scroll ve Ekran Uyanıklığı:** Telefon uykuya girmesin diye `navigator.wakeLock` API eklendi. Ayrıca telefon ekranında okunan metin hep en altta ezilmesin, okunacak devasa alan kalsın diye `.scrollIntoView` kaldırılarak elle DOM Offset'i (%20 kaydırma) yazıldı.

---

## 🏗️ Mimari ve Proje Yapısı

Proje genel olarak modern React pratiklerini (Hooks ve Context API) kullanır. Kodun okunabilirliği ve ayrıştırılması için durum yönetimi (state management) parçalanmıştır.

```text
src/
├── components/       # Tekrar kullanılabilir UI parçaları (Kartlar, Modallar vb., ShadowingSession)
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

Uygulamanın `App.jsx` içerisindeki cümle oluşturma bölümünde ve Admin Panel kelime kazıma işlemlerinde Google Gemini API kullanılmaktadır.  

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
- ShadowingSession mobil deneyimi iyileştirilmesi veya refactor edilmesi (Bkz: Shadowing Mimarisi).
