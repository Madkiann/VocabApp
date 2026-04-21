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

## 🎙️ Shadowing (Pratik Yap / Gölgeleme) Modülü

**Erişim Yolu:** Gösterge Paneli -> Kütüphane -> (Herhangi bir okuma parçasına giriş) -> Alt menüden "🎙️ Pratik Yap" Butonu.

Shadowing özelliği, kullanıcının gerçek zamanlı okuma yeteneğini analiz etmek, kelime başarım oranını WPM (Kelime/Dakika) ve anadil yüzdesi ile ölçmek için tasarlanmış bir **oyunlaştırılmış telaffuz modülüdür**. Yalnızca yerel tarayıcı (Web Speech API ve MediaRecorder API) donanımları kullanılarak çalışır, dışarıdan backend veya sunucu tarafı ses işleme istemez.

### Akıllı Karşılaştırma Motoru (Holistic Anchor Engine)
Daha çok mobil (iOS Safari, Android Chrome) tarayıcıların "parçalı (chunk)" ve "geriye dönük düzeltmeli (retroactive)" konuşma çıktılarını stabilce yönetebilmek için özel olarak yazılmış kompleks bir motordur (`src/components/ShadowingSession.jsx`):
* Geleneksel yan yana (differansiyel) kelime takibi, mobil tarayıcıların algıladıkları kısmı silip baştan yapılandırma şeklindeki API doğası yüzünden devasa "kelime atlamalarına" yol açıyordu.
* Çözüm olarak **Sabit Çıpa (Anchor) Algoritması** uygulanır: Ses motoru her mikrofon takıldığında (`onend` sonrası sessiz auto-restart) veya kelimeler silindiğinde, durulan güncel indeksi referans alır (`sessionStartIdxRef`). Her yeni veri saniyesinde, kelimeleri önceki ilerlemeyle toplamak yerine bağlandığı çıpadan *(anchor)* itibaren sıfırdan simüle ederek hatalı algılama veya hayali atlamaları imkansızlaştırır.
* Kesin İleri Atlama Sınırı (`j <= 2`), sistemin benzer sese sahip çok ilerideki bir cümleye ışınlanarak metni kaybetmesini (jump-skip) engeller.

### Mobil Konfor Düzeltmeleri
1. **Fuzzy Matching Algoritması:** Mobilde oluşan arka plan gürültüleri ve düşük performans, katı birebir kelime eşleşmesini sekteye uğratır. Sözcüklerin köküne veya harf benzerliğine (prefix/substring) toleranslı esnek bir analiz (`checkMatch`) sistemi aktiftir.
2. **WakeLock API Güvenliği:** Pratik yaparken okumaya odaklanan kullanıcının ekranı otomatik kapanıp kararmasın diye mikrofonla birlikte eşzamanlı `navigator.wakeLock` devreye alınır.
3. **Dinamik Kaydırma (Scroll Offset):** Kullanıcının sayfayı manuel kaydırmasına gerek kalmadan cümlenin akışını okuyabilmesi adına, okunmakta olan nesnenin DOM offsetleri manipüle edilmiş ve aktif satır ekranın daima üst%20 (`container.clientHeight * 0.2`) sınırına sabitlenerek mükemmel bir görüş alanı yaratılmıştır.

### ⚠️ İnceleyecek Geliştirici İçin Önemli Not (Kontrol ve Geliştirme)
> [!WARNING]  
> Modül şu an yerel tarayıcılardaki kısıtlı **Web Speech API** mimarisini son sınırına kadar zorlayarak (hackleyerek) kusursuza yakın bir noktada çalışmaktadır. Ancak Apple ve Google'ın kendi mobil asistan algoritmalarındaki güncellemeler, API'nin `interimResults` esnekliği üzerinden uygulamaya sapmalar olarak yansıyabilir. İlerleyen süreçlerde **arayüzü test ederken ses algılama motorundaki Fuzzy Match (tolerans katsayılarını) monitor etmek ve gerekiyorsa güncellemek** kritik önem taşır. Uygulama ileri düzey bir projeye dönüşüyorsa, `SpeechRecognition`'ı tamamen çöpe atıp cihazdan bağımsız bulut tabanlı profesyonel bir transkripsiyon motoruna (örn: OpenAI Whisper API veya Azure Speech-to-Text) geçiş yapılması planlanmalıdır.

---

## 👨‍💻 Gelecek Geliştirmeler İçin Notlar
- `syncStorage` sistemi oldukça sağlam çalışıyor ancak büyük veri setlerinde indexedDB yapısına geçiş düşünülebilir.
- Admin Panel içerisindeki grafik yapısı şu an localStorage istatistikleri üzerinden anlık okuma yapıyor.
- Shadowing modülünde anadil benzerliği eşiği (Guitar Hero tipi Perfect! göstergesi) için duyarlılık testleri farklı donanımlarla artırılmalı ve izlenmelidir.
