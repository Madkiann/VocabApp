export const grammarCases = [
    {
        id: 'gi-01',
        category: 'İsimleştirme',
        title: 'Gerund & Infinitive (Temel)',
        description: 'Bir eylemi isimlendirmenin en yaygın yolları.',
        examples: [
            { eng: "Walking in the rain makes me feel peaceful.", tr: "Yağmurda yürümek beni huzurlu hissettiriyor.", point: "Gerund (-ing) cümlenin öznesi olarak 'yürümek' anlamında kullanıldı." },
            { eng: "I decided to learn English to change my life.", tr: "Hayatımı değiştirmek için İngilizce öğrenmeye karar verdim.", point: "Decide fiilinden sonra Infinitive (to + verb) kullanımı." },
            { eng: "Enjoying the little things is the secret to a happy life.", tr: "Küçük şeylerden zevk almak, mutlu bir hayatın sırrıdır.", point: "Eylem (-ing) ile bir kavram haline getirildi." },
            { eng: "To be honest is always the best policy.", tr: "Dürüst olmak her zaman en iyi politikadır.", point: "Infinitive yapısı burada cümlenin öznesi görevinde." },
            { eng: "Cycling is a great way to stay fit.", tr: "Bisiklete binmek formda kalmak için harika bir yoldur.", point: "Eylem ismi (Gerund) genel bir aktiviteyi tanımlıyor." },
            { eng: "Reading books expands your horizons.", tr: "Kitap okumak ufkunuzu genişletir.", point: "Okuma eylemi cümlenin ana öznesi yapıldı." },
            { eng: "Keeping a journal helps process emotions.", tr: "Günlük tutmak duyguları işlemeye yardımcı olur.", point: "Gerund cümlenin öznesi olarak 'işlem' adı oldu." },
            { eng: "They planned to travel across Europe next summer.", tr: "Gelecek yaz Avrupa'yı boydan boya gezmeyi planladılar.", point: "Plan fiili 'to' ile takip edilir." },
            { eng: "Smoking is strictly prohibited in this area.", tr: "Bu alanda sigara içmek kesinlikle yasaktır.", point: "Yasaklanan eylem -ing ile isimleştirildi." },
            { eng: "I hope to see you at the ceremony.", tr: "Seni törende görmeyi umuyorum.", point: "Hope fiili kendisinden sonra 'to' gerektirir." },
            { eng: "Teaching others is the best way to learn.", tr: "Başkalarına öğretmek öğrenmenin en iyi yoludur.", point: "Özne konumunda Gerund kullanımı." },
            { eng: "She loves baking cakes for her friends.", tr: "Arkadaşları için kek pişirmeyi çok seviyor.", point: "Love fiili hem -ing hem to alabilir, burada -ing tercih edildi." },
            { eng: "To travel is to live.", tr: "Gezmek yaşamaktır.", point: "Şiirsel/Vurgulu kullanımda iki taraflı Infinitive." },
            { eng: "Skipping breakfast can decrease your energy.", tr: "Kahvaltıyı atlamak enerjinizi düşürebilir.", point: "Gerund özne yapılarak durum anlatıldı." },
            { eng: "I want to become a successful architect.", tr: "Başarılı bir mimar olmak istiyorum.", point: "Want + to + V1 yapısı." },
            { eng: "Climbing that mountain was a huge challenge.", tr: "O dağa tırmanmak büyük bir meydan okumaydı.", point: "Zorlu bir eylem -ing ile tanımlandı." },
            { eng: "He forgot to turn off the lights.", tr: "Işıkları kapatmayı unuttu.", point: "Forget + to (Bir şeyi yapmayı unutmak)." },
            { eng: "Learning from mistakes is essential.", tr: "Hatalardan öğrenmek esastır.", point: "Özne konumundaki eylem ismi." },
            { eng: "I would like to invite you to dinner.", tr: "Seni akşam yemeğine davet etmek isterim.", point: "Would like her zaman 'to' ile devam eder." },
            { eng: "Swimming in the ocean can be dangerous.", tr: "Okyanusta yüzmek tehlikeli olabilir.", point: "Gerund ile yetenek veya aktivite isimleştirildi." }
        ]
    },
    {
        id: 'gi-02',
        category: 'İsimleştirme',
        title: 'Fiillerden Sonra Gelenler',
        description: 'Hangi fiil -ing alır, hangisi to+V1 alır?',
        examples: [
            { eng: "Avoid making excuses when you fail.", tr: "Başarısız olduğunda bahane üretmekten kaçın.", point: "Avoid fiili her zaman Gerund (-ing) ile takip edilir." },
            { eng: "He refused to accept the outcome.", tr: "Sonucu kabul etmeyi reddetti.", point: "Refuse fiili Infinitive (to + V1) ile kullanılır." },
            { eng: "I look forward to meeting you soon.", tr: "Yakında seninle tanışmayı dört gözle bekliyorum.", point: "Buradaki 'to' bir edattır, bu yüzden fiil -ing alır." },
            { eng: "She suggested going to the cinema tonight.", tr: "Bu akşam sinemaya gitmeyi önerdi.", point: "Suggest fiili kendisinden sonra gelen eylemi -ing ile ister." },
            { eng: "I managed to finish the project on time.", tr: "Projeyi zamanında bitirmeyi başardım.", point: "Manage fiili çaba gerektiren bir başarının ardından 'to' alır." },
            { eng: "Do you mind opening the window?", tr: "Pencereyi açmanızın bir mahzuru var mı?", point: "Mind fiili her zaman -ing ile kullanılır." },
            { eng: "They agreed to join our team.", tr: "Ekibimize katılmayı kabul ettiler.", point: "Agree fiili Infinitive (to + V1) gerektirir." },
            { eng: "I miss spending time with my family.", tr: "Ailemle vakit geçirmeyi özlüyorum.", point: "Miss (özlemek) fiili -ing ile kullanılır." },
            { eng: "He promised to stay by her side.", tr: "Onun yanında kalacağına söz verdi.", point: "Promise + to kullanımı." },
            { eng: "Imagine winning the lottery tomorrow.", tr: "Yarın piyangoyu kazandığını hayal et.", point: "Imagine fiili -ing ile devam eder." },
            { eng: "We decided to renovate the kitchen.", tr: "Mutfağı yenilemeye karar verdik.", point: "Decide + to yapısı." },
            { eng: "Keep practicing if you want to improve.", tr: "Gelişmek istiyorsan pratik yapmaya devam et.", point: "Keep fiili süreklilik için -ing alır." },
            { eng: "She offered to help us with the move.", tr: "Taşınma işinde bize yardım etmeyi teklif etti.", point: "Offer + to kullanımı." },
            { eng: "Avoid touching the wet paint.", tr: "Islak boyaya dokunmaktan kaçının.", point: "Avoid + -ing kuralı." },
            { eng: "He denied stealing the money.", tr: "Parayı çaldığını reddetti.", point: "Deny fiili -ing ile kullanılır." },
            { eng: "I expect to receive an answer by Friday.", tr: "Cumaya kadar bir cevap almayı bekliyorum.", point: "Expect + to yapısı." },
            { eng: "Would you consider working abroad?", tr: "Yurt dışında çalışmayı düşünür müydünüz?", point: "Consider + -ing kullanımı." },
            { eng: "She failed to convince the jury.", tr: "Jüriyi ikna etmeyi başaramadı.", point: "Fail + to yapısı." },
            { eng: "I finish reading this book tonight.", tr: "Bu kitabı okumayı bu gece bitiririm.", point: "Finish + -ing kullanımı." },
            { eng: "They chose to ignore the warning.", tr: "Uyarıyı görmezden gelmeyi seçtiler.", point: "Choose + to kuralı." }
        ]
    },
    {
        id: 'ft-01',
        category: 'İsimleştirme',
        title: 'The Fact That Serisi',
        description: "Bir cümleyi paketleyip 'gerçeği' vurgusuyla isimleştirmek.",
        examples: [
            { eng: "The fact that he survived the accident is a miracle.", tr: "Onun kazadan sağ kurtulmuş olması bir mucizedir.", point: "Cümlenin tamamı 'özne' haline getirildi." },
            { eng: "I am worried about the fact that she hasn't called yet.", tr: "Onun henüz aramamış olması gerçeğinden endişeleniyorum.", point: "Preposition (about) sonrası tüm cümle isimleştirildi." },
            { eng: "Despite the fact that it was raining, they went for a walk.", tr: "Yağmur yağıyor olmasına rağmen yürüyüşe çıktılar.", point: "Zıtlık bağlacı ile kompleks bir cümle yapısı." },
            { eng: "Due to the fact that the meeting was canceled, I stayed home.", tr: "Toplantının iptal edilmiş olması nedeniyle evde kaldım.", point: "Sebep-sonuç ilişkisinde tüm bir cümleyi isimleştirme." },
            { eng: "The fact that you are here means a lot to me.", tr: "Senin burada olman benim için çok şey ifade ediyor.", point: "Bir durumun tamamını vurgulu bir özne yapma stratejisi." },
            { eng: "I ignore the fact that he lied to me.", tr: "Onun bana yalan söylediği gerçeğini görmezden geliyorum.", point: "Nesne konumunda tüm bir cümleyi paketleme." },
            { eng: "Apart from the fact that it's expensive, I like the car.", tr: "Pahalı olması dışında, arabayı seviyorum.", point: "Prepositional phrase ile 'the fact that' kullanımı." },
            { eng: "I am aware of the fact that time is limited.", tr: "Zamanın sınırlı olduğu gerçeğinin farkındayım.", point: "Aware of + the fact that yapısı." },
            { eng: "Does the fact that she is younger bother you?", tr: "Onun daha genç olması gerçeği seni rahatsız ediyor mu?", point: "Soru cümlesinde özne paketi." },
            { eng: "He was upset by the fact that he was forgotten.", tr: "Unutulmuş olması gerçeği onu üzdü.", point: "By + the fact that ile pasif bir cümleyi isimleştirme." },
            { eng: "The fact that they lost the game was disappointing.", tr: "Maçı kaybetmiş olmaları hayal kırıklığı yaratıcıydı.", point: "Geçmiş zamanlı bir cümleyi özne yapma." },
            { eng: "I rely on the fact that you will help me.", tr: "Bana yardım edeceğin gerçeğine güveniyorum.", point: "Rely on + isim paketi." },
            { eng: "The fact that she speaks four languages is impressive.", tr: "Onun dört dil konuşuyor olması etkileyici.", point: "Durum tespiti yapan bir özne." },
            { eng: "Have you considered the fact that he might be right?", tr: "Onun haklı olabileceği gerçeğini düşündün mü?", point: "İhtimal bildiren bir cümleyi nesne yapma." },
            { eng: "She was angry about the fact that he forgot her birthday.", tr: "Onun doğum gününü unutmuş olması gerçeğine kızgındı.", point: "Geçmişteki bir eylemi isimleştirerek sebep gösterme." },
            { eng: "The fact that we are early is a good sign.", tr: "Erken olmamız iyi bir işaret.", point: "Mevcut durumu özne yapma." },
            { eng: "I can't get over the fact that he betrayed us.", tr: "Bize ihanet etmiş olması gerçeğini aşamıyorum.", point: "Get over + isim paketi." },
            { eng: "Because of the fact that the road was blocked, we were late.", tr: "Yolun kapalı olması gerçeği yüzünden geç kaldık.", point: "Because of + paket yapı." },
            { eng: "The fact that technology is evolving so fast is scary.", tr: "Teknolojinin bu kadar hızlı gelişiyor olması korkutucu.", point: "Geniş zamanlı bir süreci özne yapma." },
            { eng: "In spite of the fact that he was tired, he kept working.", tr: "Yorgun olmasına rağmen çalışmaya devam etti.", point: "Zıtlık vurgusu ile isim paketi." }
        ]
    },
    {
        id: 'cl-01',
        category: 'Clauses',
        title: 'Relative Clause (Sıfat Cümlecikleri)',
        description: 'İsimleri nitelemek için kullanılan yapılar.',
        examples: [
            { eng: "The book that I bought yesterday is fascinating.", tr: "Dün satın aldığım kitap büyüleyici.", point: "'That' ile başlayan yan cümlecik kitabı niteliyor." },
            { eng: "The man who is standing over there is my teacher.", tr: "Orada duran adam benim öğretmenim.", point: "'Who' kullanılarak özne konumundaki kişi nitelendi." },
            { eng: "This is the car whose engine was repaired.", tr: "İşte motoru tamir edilen araba bu.", point: "Sahiplik bildiren 'whose' yapısı." },
            { eng: "The city where I was born is very historical.", tr: "Doğduğum şehir çok tarihidir.", point: "Yer bildiren 'where' nitelemesi." },
            { eng: "The reason why I am late is simple.", tr: "Geç kalmamın sebebi basittir.", point: "Neden bildiren kelimeyi niteleyen yan cümle." },
            { eng: "The woman to whom I spoke was very kind.", tr: "Kendisiyle konuştuğum kadın çok nazikti.", point: "Resmî (formal) preposition + whom kullanımı." },
            { eng: "Summer is the time when I feel most energetic.", tr: "Yaz, kendimi en enerjik hissettiğim zamandır.", point: "Zaman niteleyen 'when' yapısı." },
            { eng: "The mobile phone, which I bought last year, is already broken.", tr: "Geçen yıl aldığım cep telefonu şimdiden bozuldu.", point: "Virgüllü (Non-defining) bilgi ekleme." },
            { eng: "The students whose results are high will get a scholarship.", tr: "Sonuçları yüksek olan öğrenciler burs alacak.", point: "Sahiplik 'whose' kullanımı." },
            { eng: "The hotel at which we stayed was very luxurious.", tr: "Kaldığımız otel çok lükstü.", point: "At which = where (Formal kullanım)." },
            { eng: "The person that you recommended was hired.", tr: "Önerdiğin kişi işe alındı.", point: "Nesne konumundaki 'that' (Who da olabilirdi)." },
            { eng: "He is the man for whom I work.", tr: "O, kendisi için çalıştığım adamdır.", point: "Formal preposition + whom." },
            { eng: "Paris, which is the capital of France, is beautiful.", tr: "Fransa'nın başkenti olan Paris çok güzeldir.", point: "Özel ismi niteleyen (Non-defining) yapı." },
            { eng: "All the things that he said were lies.", tr: "Söylediği her şey yalandı.", point: "Genel kavramı niteleyen 'that'." },
            { eng: "The year when the war broke out was 1914.", tr: "Savaşın çıktığı yıl 1914'tü.", point: "Zaman niteleyen clause." },
            { eng: "This is the spot where the accident happened.", tr: "Burası kazanın olduğu noktadır.", point: "Yer niteleyen clause." },
            { eng: "A doctor is someone who treats sick people.", tr: "Doktor, hasta insanları tedavi eden kimsedir.", point: "Tanım cümlesinde 'who'." },
            { eng: "The cake which she made was delicious.", tr: "Onun yaptığı kek lezzetliydi.", point: "Eşyayı niteleyen 'which/that'." },
            { eng: "My brother, who lives in New York, is coming today.", tr: "New York'ta yaşayan kardeşim bugün geliyor.", point: "Belirli bir kişiye ek bilgi verme." },
            { eng: "The idea that you suggested is brilliant.", tr: "Önerdiğin fikir dahice.", point: "Soyut kavramı (idea) niteleyen 'that'." }
        ]
    },
    {
        id: 'cl-02',
        category: 'Clauses',
        title: 'Noun Clause (İsim Cümlecikleri)',
        description: 'Cümle içinde isim görevinde kullanılan yapılar.',
        examples: [
            { eng: "I don't know where he lives.", tr: "Onun nerede yaşadığını bilmiyorum.", point: "'Where he lives' kısmı 'know' fiilinin nesnesi oldu." },
            { eng: "What you said really hurt me.", tr: "Söylediğin şey beni gerçekten incitti.", point: "'What you said' yapısı cümlenin öznesi olarak kullanıldı." },
            { eng: "It is obvious that he will win the election.", tr: "Onun seçimi kazanacağı aşikar.", point: "'That-clause' cümlenin gerçek öznesidir." },
            { eng: "Whether he comes or not doesn't matter.", tr: "Gelse de gelmese de fark etmez.", point: "İkili ihtimal bildiren 'whether' yapısı." },
            { eng: "I wonder if she knows the truth.", tr: "Onun gerçeği bilip bilmediğini merak ediyorum.", point: "Evet/Hayır sorularının isim cümleciğine dönüşmesi." },
            { eng: "Whichever you choose will be perfect.", tr: "Hangisini seçersen seç mükemmel olacak.", point: "Belirsiz özne olarak Noun Clause." },
            { eng: "The problem is how we will find the money.", tr: "Sorun, parayı nasıl bulacağımızdır.", point: "Complement (tamamlayıcı) görevinde Noun Clause." },
            { eng: "I hope that you are enjoying the journey.", tr: "Yolculuktan zevk aldığınızı umuyorum.", point: "Fiilin nesnesi olarak 'that clause'." },
            { eng: "He asked why the shop was closed.", tr: "Dükkanın neden kapalı olduğunu sordu.", point: "Soru kelimesiyle başlayan isim cümleciği." },
            { eng: "That she is successful surprises no one.", tr: "Onun başarılı olması kimseyi şaşırtmıyor.", point: "'That clause' cümlenin başında özne olarak kullanıldı." },
            { eng: "I am confident that we will succeed.", tr: "Başarılı olacağımızdan eminim.", point: "Adjective + Noun Clause." },
            { eng: "Can you explain how this works?", tr: "Bunun nasıl çalıştığını açıklayabilir misin?", point: "Nesne konumunda 'how'." },
            { eng: "Whoever broke the window must pay for it.", tr: "Pencereyi her kim kırdıysa bedelini ödemeli.", point: "Belirsiz kişi öznesi." },
            { eng: "I don't care what they think.", tr: "Onların ne düşündüğü umurumda değil.", point: "Nesne konumunda 'what clause'." },
            { eng: "His suggestion was that we should wait.", tr: "Onun önerisi beklememiz gerektiğiydi.", point: "Be fiilinden sonra gelen tamamlayıcı." },
            { eng: "I can't imagine how she feels.", tr: "Nasıl hissettiğini hayal edemiyorum.", point: "Nesne olarak Noun Clause." },
            { eng: "It is important what you do today.", tr: "Bugün ne yaptığın önemlidir.", point: "Özne konumundaki 'what clause'." },
            { eng: "Tell me when you are ready.", tr: "Hazır olduğunda bana söyle.", point: "Zaman bildiren isim cümleciği." },
            { eng: "She didn't mention where she was going.", tr: "Nereye gittiğinden bahsetmedi.", point: "Nesne olarak yer bildiren clause." },
            { eng: "I believe that every child is special.", tr: "Her çocuğun özel olduğuna inanıyorum.", point: "İnanç/Opinion bildiren 'that'." }
        ]
    },
    {
        id: 'pe-01',
        category: 'Pasif & Ettirgen',
        title: 'Passive Voice Stratejileri',
        description: "Eylemin kim tarafından yapıldığından çok, eyleme odaklanın.",
        examples: [
            { eng: "The report was finished on time.", tr: "Rapor zamanında bitirildi.", point: "Eylemin nesnesi (rapor) özne konumuna getirildi." },
            { eng: "English is spoken all over the world.", tr: "İngilizce dünyanın her yerinde konuşulur.", point: "Genel bir gerçeği pasif yapıyla anlatmak." },
            { eng: "The decision will be made tomorrow.", tr: "Karar yarın verilecek.", point: "Gelecek zaman pasif yapısı (will be + V3)." },
            { eng: "Mistakes should be seen as opportunities.", tr: "Hatalar fırsat olarak görülmelidir.", point: "Modal (should) ile pasif kullanımı." },
            { eng: "The stolen jewelry has been found.", tr: "Çalınan mücevherler bulundu.", point: "Present Perfect Passive yapısı (has been + V3)." },
            { eng: "He is said to be very rich.", tr: "Onun çok zengin olduğu söyleniyor.", point: "Personal Passive (Is said to be) yapısı." },
            { eng: "Wait while your room is being cleaned.", tr: "Odanız temizlenirken bekleyin.", point: "Present Continuous Passive (is being + V3)." },
            { eng: "The bridge was built in 1950.", tr: "Köprü 1950'de inşa edildi.", point: "Geçmiş zaman (was) pasif." },
            { eng: "Rules are made to be followed.", tr: "Kurallar takip edilmek için yapılır.", point: "Geniş zaman genel kural." },
            { eng: "The letter has already been sent.", tr: "Mektup çoktan gönderildi.", point: "Zamanın vurgulandığı (Present Perfect) pasif." },
            { eng: "A new stadium is being constructed.", tr: "Yeni bir stadyum inşa ediliyor.", point: "Şu an devam eden pasif eylem." },
            { eng: "He was given a second chance.", tr: "Ona ikinci bir şans verildi.", point: "He was given -> Ona verildi." },
            { eng: "The car must be washed by tomorrow.", tr: "Araba yarına kadar yıkanmalı.", point: "Zorunluluk (must) pasif." },
            { eng: "It is believed that he is lying.", tr: "Onun yalan söylediğine inanılıyor.", point: "It is believed that... (Genel kanı)." },
            { eng: "The flowers were being watered when it started to rain.", tr: "Yağmur başladığında çiçekler sulanıyordu.", point: "Past Continuous Passive." },
            { eng: "I was told to wait here.", tr: "Burada beklemem söylendi.", point: "Bana söylendi (Was told)." },
            { eng: "The house was destroyed by the storm.", tr: "Ev fırtına tarafından yıkıldı.", point: "Eylemi yapanı (by storm) belirtme." },
            { eng: "All the tickets have been sold out.", tr: "Tüm biletler tükendi.", point: "Present Perfect pasif." },
            { eng: "He was seen leaving the bank.", tr: "Bankadan ayrılırken görüldü.", point: "Görüldü (Was seen)." },
            { eng: "Your order will be delivered soon.", tr: "Siparişiniz yakında teslim edilecek.", point: "Gelecek zaman pasif." }
        ]
    },
    {
        id: 'pe-02',
        category: 'Pasif & Ettirgen',
        title: 'Causative (Ettirgen Yapılar)',
        description: 'Bir işi başkasına yaptırmak.',
        examples: [
            { eng: "I had my car repaired last week.", tr: "Geçen hafta arabamı tamir ettirdim.", point: "Have + object + V3 yapısı." },
            { eng: "She got her hair cut yesterday.", tr: "Dün saçını kestirdi.", point: "Get + object + V3 yapısı." },
            { eng: "I will make him finish the work.", tr: "İşi ona bitirteceğim.", point: "Make + person + V1 (zorunluluk bildiren ettirgen)." },
            { eng: "The teacher let the students leave early.", tr: "Öğretmen öğrencilerin erken çıkmasına izin verdi.", point: "Let + person + V1 (izin/serbest bırakma)." },
            { eng: "He helped me carry the bags.", tr: "Çantaları taşımama yardım etti.", point: "Help + person + (to) V1 yapısı." },
            { eng: "I got my brother to wash the dishes.", tr: "Erkek kardeşimi bulaşıkları yıkamaya ikna ettim/yıkattım.", point: "Get + person + TO + V1 (ikna yoluyla ettirgen)." },
            { eng: "We had the house painted before moving in.", tr: "Taşınmadan önce evi boyattık.", point: "Have + object + V3 (hizmet alma)." },
            { eng: "I will have the secretary send the email.", tr: "E-postayı sekretere gönderteceğim.", point: "Have + person + V1 (Aktif ettirgen)." },
            { eng: "She got the mechanic to check the brakes.", tr: "Frenleri tamirciye kontrol ettirdi.", point: "Get + person + to + V1." },
            { eng: "The movie made me cry.", tr: "Film beni ağlattı.", point: "Duygusal ettirgenlik (Make + person + V1)." },
            { eng: "He let me use his computer.", tr: "Bilgisayarını kullanmama izin verdi.", point: "Let (İzin vermek)." },
            { eng: "I had my teeth cleaned by the dentist.", tr: "Dişlerimi dişçiye temizlettim.", point: "Have + object + V3." },
            { eng: "They got the work done quickly.", tr: "İşi hızlıca bitirttiler.", point: "Get + object + V3." },
            { eng: "I helped him solve the problem.", tr: "Sorunu çözmesine yardım ettim.", point: "Help kuralı." },
            { eng: "She made her kids clean their rooms.", tr: "Çocuklarına odalarını temizletti.", point: "Zorunluluk ettirgeni." },
            { eng: "I'll have my assistant call you.", tr: "Asistanıma seni aratacağım.", point: "Have person V1." },
            { eng: "We finally got the car to start.", tr: "Sonunda arabayı çalıştırtmayı başardık.", point: "Zorlukla başarma/ikna 'get'." },
            { eng: "The boss had us sign the documents.", tr: "Patron bize belgeleri imzalattı.", point: "Have person V1." },
            { eng: "She got her dress shortened.", tr: "Elbisesini kısalttırdı.", point: "Get object V3." },
            { eng: "Don't let him trick you.", tr: "Seni kandırmasına izin verme.", point: "Let + person + V1." }
        ]
    },
    {
        id: 'ad-01',
        category: 'İleri Seviye (Complex)',
        title: 'Reduction (Kısaltmalar)',
        description: "Cümleleri daha akıcı ve kısa hale getirme teknikleri.",
        examples: [
            { eng: "Having finished my homework, I went out.", tr: "Ödevimi bitirince (bitirdikten sonra) dışarı çıktım.", point: "Perfect Participle ile zaman uyumlu kısaltma." },
            { eng: "The bridge built last year is very strong.", tr: "Geçen yıl inşa edilen köprü çok sağlamdır.", point: "Relative Clause kısaltması (Pasif)." },
            { eng: "While walking down the street, I saw an old friend.", tr: "Caddede yürürken eski bir arkadaşımı gördüm.", point: "Zaman bağlacı kısaltması (Aktif)." },
            { eng: "Not knowing what to do, she asked for help.", tr: "Ne yapacağını bilemeyerek yardım istedi.", point: "Sebep bildiren (-ing) kısaltması." },
            { eng: "If invited, I will attend the party.", tr: "Davet edilirsem partiye katılacağım.", point: "Koşul cümlesi pasif kısaltması." },
            { eng: "Seen from space, the Earth is beautiful.", tr: "Uzaydan bakıldığında, Dünya çok güzeldir.", point: "Pasif durum kısaltması (V3 ile başlama)." },
            { eng: "He entered the room, shouting with joy.", tr: "Odaya sevinçle bağırarak girdi.", point: "Eş zamanlı eylem kısaltması." },
            { eng: "Encouraged by his parents, he studied harder.", tr: "Ailesi tarafından cesaretlendirilince daha çok çalıştı.", point: "Pasif sebep kısaltması." },
            { eng: "The man standing there is my uncle.", tr: "Orada duran adam benim amcam.", point: "Relative clause aktif kısaltma." },
            { eng: "Before leaving, please turn off the lights.", tr: "Ayrılmadan önce lütfen ışıkları kapatın.", point: "Zaman kuralı kısaltması." },
            { eng: "Deeply moved by the story, she started to cry.", tr: "Hikayeden derinden etkilenince ağlamaya başladı.", point: "V3 ile pasif başlangıç." },
            { eng: "Having lost his key, he couldn't enter the house.", tr: "Anahtarını kaybettiği için eve giremedi.", point: "Having + V3 (Perfect Participle)." },
            { eng: "Avoid running near the pool.", tr: "Havuzun yanında koşmaktan kaçının.", point: "Emir kipi kısaltması." },
            { eng: "Once finished, let me know.", tr: "Bittiğinde (bitince) bana haber ver.", point: "Zaman bağlacı (once) kısaltması." },
            { eng: "Born in 1990, he is now 36 years old.", tr: "1990'da doğan (doğmuş olan), şu an 36 yaşında.", point: "Doğum/Zaman kısaltması." },
            { eng: "Trying to be careful, he walked slowly.", tr: "Dikkatli olmaya çalışarak yavaşça yürüdü.", point: "Aktif hal kısaltması." },
            { eng: "Inspired by nature, he painted a masterpiece.", tr: "Doğadan ilham alarak bir şaheser boyadı.", point: "Pasif ilham/sebep." },
            { eng: "The books chosen for the class are difficult.", tr: "Sınıf için seçilen kitaplar zordur.", point: "V3 ile Relative Clause kısaltması." },
            { eng: "After seeing the movie, I slept.", tr: "Filmi izledikten sonra uyudum.", point: "Zaman bağlacı + ing." },
            { eng: "Worried about the future, he saved money.", tr: "Gelecekten endişe duyarak para biriktirdi.", point: "Sıfat/Durum başlangıç kısaltması." }
        ]
    }
];

export const quotes = [
    {
        author: "Seneca",
        text: "Luck is what happens when preparation meets opportunity.",
        trText: "Şans, hazırlık fırsatla karşılaştığında olan şeydir.",
        source: "Letters on Ethics"
    },
    {
        author: "Marcus Aurelius",
        text: "The happiness of your life depends upon the quality of your thoughts.",
        trText: "Hayatının mutluluğu, düküncelerinin kalitesine bağlıdır.",
        source: "Meditations"
    },
    {
        author: "Hadis-i Şerif",
        text: "Two blessings are many people deceived in them: health and free time.",
        trText: "İki nimet vardır ki, insanların çoğu onlarda aldanmıştır: Sağlık ve boş vakit.",
        source: "Buhari, Rikak, 1"
    },
    {
        author: "Seneca",
        text: "While we wait for life, life passes.",
        trText: "Biz hayatı beklerken, hayat geçer.",
        source: "Letters on Ethics"
    },
    {
        author: "Marcus Aurelius",
        text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
        trText: "Mutlu bir hayat sürmek için çok az şeye ihtiyaç vardır; hepsi senin içinde, düşünme biçimindedir.",
        source: "Meditations"
    }
];

export const readingPassages = [
    {
        id: 'read-01',
        title: "The Art of Resilience",
        author: "Zihin Ustası",
        difficulty: "Advanced",
        engText: "True wisdom is not about suppressing your emotions, but rather understanding them with deep clarity. When you understand why you feel a certain way, you can respond more rationally to the external world. This mental discipline is extremely beneficial in language learning too. Many students feel frustrated when they cannot express themselves perfectly. However, frustration is just an emotional response to a perceived failure. If you shift your perspective and realize that every mistake is a data point for growth, the fear of failure vanishes. Remember, a child does not get angry at its first attempt to walk. They simply try again. Language is the same; it is a muscle that grows through resistance and repetition. Don't be afraid of mistakes; see them as your greatest teachers on this long journey. The path to fluency is not a straight line, but a series of curves that ultimately lead you to your destination. Furthermore, the ability to bounce back from setbacks determines who succeeds and who stays in the crowd. In our modern age, we are constantly bombarded by distractions that seek to erode our focus. Developing a strong internal foundation allows us to navigate these storms without losing sight of our ultimate goals. Resilience is not a trait that people are born with; it involves behaviors, thoughts, and actions that can be learned and developed in anyone. To build resilience, one must foster healthy thinking patterns and maintain a hopeful outlook even in the face of adversity. This quality is the primary differentiator between those who overcome challenges and those who are overcome by them.",
        trText: "Gerçek bilgelik, duygularınızı bastırmak değil, onları derin bir netlikle anlamakla ilgilidir. Neden belirli bir şekilde hissettiğinizi anladığınızda, dış dünyaya karşı daha rasyonel tepki verebilirsiniz. Bu zihinsel disiplin, dil öğreniminde de son derece faydalıdır. Birçok öğrenci kendilerini mükemmel bir şekilde ifade edemediklerinde hayal kırıklığına uğrar. Ancak hayal kırıklığı, sadece algılanan bir başarısızlığa verilen duygusal bir tepkidir. Bakış açınızı değiştirir ve her hatanın gelişim için bir veri noktası olduğunu fark ederseniz, başarısızlık korkusu ortadan kalkar. Unutmayın, bir çocuk yürümeye yönelik ilk girişiminde öfkelenmez. Sadece tekrar dener. Dil de aynıdır; direnç ve tekrar yoluyla büyüyen bir kastır. Hatalardan korkmayın; onları bu uzun yolculuktaki en büyük öğretmenleriniz olarak görün. Akıcılığa giden yol düz bir çizgi değil, sizi nihayetinde hedefinize ulaştıran bir dizi kavisli yoldur. Dahası, aksiliklerden sonra ayağa kalkma yeteneği kimin başarılı olacağını, kimin ise kalabalıkta kalacağını belirler. Modern çağımızda, odak noktamızı aşındırmak isteyen dikkat dağıtıcı unsurlar tarafından sürekli bombardımana tutuluyoruz. Güçlü bir iç temel geliştirmek, bu fırtınalarda nihai hedeflerimizi gözden kaçırmadan yol almamızı sağlar. Dayanıklılık, insanların doğuştan sahip olduğu bir özellik değildir; herkeste öğrenilebilen ve geliştirilebilen davranışlar, düşünceler ve eylemler içerir. Dayanıklılık inşa etmek için, sağlıklı düşünme kalıpları teşvik edilmeli ve zorluklar karşısında bile umutlu bir bakış açısı korunmalıdır. Bu nitelik, zorlukların üstesinden gelenler ile zorluklar tarafından alt edilenler arasındaki temel farktır."
    },
    {
        id: 'read-02',
        title: "Cultural Immersion and Language",
        author: "Bilgelik Arşivi",
        difficulty: "Upper-Intermediate",
        engText: "Learning a new language is more than just memorizing a vocabulary list or mastering complex grammar rules. It is an exploration of a different culture and a new way of seeing the world. When you learn a new word, you are not just finding an equivalent for a concept in your native language; you are opening a window to a different thought process. For instance, some languages have words that describe emotions that don't exist in others. This tells us that the way we speak actually shapes our perception of reality. Therefore, to become fluent, one must immerse themselves in the sounds and rhythms of the language. Listen to music, watch movies, and most importantly, speak without hesitation. Perfection should never be the goal. Instead, focus on communication and the joy of being understood. The more you use the language in real-life contexts, the more natural it will become. Consistency is the key to mastery. Even fifteen minutes of daily practice can lead to significant progress over time if maintained regularly. Beyond the linguistic benefits, language learning fosters empathy and global understanding, allowing us to build bridges between diverse communities that might otherwise remain isolated from one another. By understanding the nuances of how others express their thoughts, we gain insight into their values and worldviews, fostering a more harmonious global society.",
        trText: "Yeni bir dil öğrenmek, sadece bir kelime listesini ezberlemekten veya karmaşık dil bilgisi kurallarında uzmanlaşmaktan daha fazlasıdır. Farklı bir kültürün keşfi ve dünyayı görmenin yeni bir yoludur. Yeni bir kelime öğrendiğinizde, sadece ana dilinizdeki bir kavramın karşılığını bulmakla kalmazsınız; farklı bir düşünce sürecine bir pencere açarsınız. Örneğin, bazı dillerin diğerlerinde var olmayan duyguları tanımlayan kelimeleri vardır. Bu bize, konuşma şeklimizin aslında gerçeklik algımızı şekillendirdiğini söyler. Bu nedenle, akıcı hale gelmek için kişi kendini dilin seslerine ve ritimlerine bırakmalıdır. Müzik dinleyin, film izleyin ve en önemlisi, çekinmeden konuşun. Mükemmellik asla hedef olmamalıdır. Bunun yerine, iletişime ve anlaşılmanın verdiği sevince odaklanın. Dili gerçek hayat bağlamlarında ne kadar çok kullanırsanız, o kadar doğal hale gelecektir. İstikrar, uzmanlığın anahtarıdır. Düzenli olarak sürdürülürse, günlük on beş dakikalık pratik bile zamanla önemli bir ilerlemeye yol açabilir. Dilbilimsel faydaların ötesinde, dil öğrenimi empatiyi ve küresel anlayışı teşvik eder ve aksi takdirde birbirinden izole kalabilecek çeşitli topluluklar arasında köprüler kurmamıza olanak tanır. Başkalarının düşüncelerini nasıl ifade ettiğinin inceliklerini anlayarak, onların değerleri ve dünya görüşleri hakkında fikir sahibi olur, daha uyumlu bir küresel toplumu teşvik ederiz."
    },
    {
        id: 'read-03',
        title: "The Compound Effect of Daily Habits",
        author: "Zihin Atölyesi",
        difficulty: "Advanced",
        engText: "Success is often the result of small, seemingly insignificant decisions made every single day. We tend to focus on major breakthroughs, but true transformation happens in the quiet moments of consistency. A habit is essentially a neurological loop that consists of a cue, a routine, and a reward. To change a bad habit or build a new one, you must first identify these three components. In the context of self-improvement, the hardest part is usually the beginning. We start with high motivation, but motivation is a fluctuating resource. Discipline is a muscle. The more you use it, the stronger it becomes. When you show up every day, regardless of how you feel, you are training your brain to prioritize long-term growth over short-term comfort. This is true for any skill, whether it's learning a musical instrument, mastering a profession, or acquiring a new language. The compound effect of these small actions is enormous. Over a year, a 1% improvement every day leads to being 37 times better than when you started. Don't underestimate the power of showing up. Furthermore, as we deepen our commitment, we discover that the journey itself provides far more value than the destination. The challenges we face along the way are not obstacles but essential components of our evolution, shaping our character and refining our purpose. Each day presents a new opportunity to choose growth over stagnancy. The true power of the compound effect lies in its stealthy nature; its results are invisible in the short term, but undeniable in the long run. By the time the results manifest, the habits responsible for them have become an inseparable part of your identity.",
        trText: "Başarı genellikle her gün verilen küçük, görünüşte önemsiz kararların sonucudur. Büyük kırılmalara odaklanma eğilimindeyizdir, ancak gerçek dönüşüm istikrarın sessiz anlarında gerçekleşir. Alışkanlık, esasen bir işaret, bir rutin ve bir ödülden oluşan nörolojik bir döngüdür. Kötü bir alışkanlığı değiştirmek veya yeni bir tane oluşturmak için önce bu üç bileşeni belirlemelisiniz. Kişisel gelişim bağlamında, en zor kısım genellikle başlangıçtır. Yüksek bir motivasyonla başlarız, ancak motivasyon dalgalanan bir kaynaktır. Disiplin bir kastır. Onu ne kadar çok kullanırsanız, o kadar güçlenir. Nasıl hissettiğinizden bağımsız olarak her gün orada olduğunuzda, beyninizi kısa vadeli konfor yerine uzun vadeli gelişime öncelik vermesi için eğitiyorsunuzdur. Bu, ister bir enstrüman öğrenmek, ister bir meslekte uzmanlaşmak, ister yeni bir dil edinmek olsun, her yetenek için geçerlidir. Bu küçük eylemlerin bileşik etkisi muazzamdır. Bir yıl boyunca her gün %1'lik bir gelişim, başladığınız noktadan 37 kat daha iyi olmanızı sağlar. Orada bulunmanın (istikrarın) gücünü hafife almayın. Dahası, bağlılığımızı derinleştirdikçe, yolculuğun kendisinin hedeften çok daha fazla değer sunduğunu keşfederiz. Yol boyunca karşılaştığımız zorluklar engel değil, evrimimizin temel bileşenleridir; karakterimizi şekillendirir ve amacımızı arındırırlar. Her gün, durağanlık yerine gelişimi seçmek için yeni bir fırsat sunar. Bileşik etkinin gerçek gücü gizli doğasında yatar; sonuçları kısa vadede görünmezdir, ancak uzun vadede inkar edilemezdir. Sonuçlar tezahür ettiğinde, onlardan sorumlu olan alışkanlıklar kimliğinizin ayrılmaz bir parçası haline gelmiştir."
    },
    {
        id: 'read-04',
        title: "The Future of Artificial Intelligence",
        author: "Gelecek Analizi",
        difficulty: "Advanced",
        engText: "The rapid evolution of artificial intelligence is fundamentally altering the landscape of human society. From healthcare and transportation to education and creative arts, no sector remains untouched by these technological advancements. However, as we integrate AI more deeply into our daily lives, we must also confront complex ethical questions regarding privacy, autonomy, and the future of work. The potential for AI to augment human capabilities is immense, allowing us to solve problems that were once deemed insurmountable. Yet, this power comes with a responsibility to ensure that technology serves the collective good rather than deepening existing inequalities. Some experts argue that we are on the verge of a technological singularity, a point where AI will surpass human intelligence. While this prospect is both exciting and terrifying, our focus must remain on creating alignment between machine goals and human values. Education will play a critical role in this transition, as literacy in digital logic becomes as essential as traditional reading and writing. We must prepare for a future where collaboration between humans and machines is the norm, leveraging the strengths of both to create a more prosperous and equitable world for all. This requires not only technical proficiency but also a deep understanding of what it means to be human in an increasingly automated world. We must preserve the qualities that make us unique—empathy, creativity, and moral judgment—while embracing the efficiency and analytical power that AI provides. The synthesis of human intuition and robotic precision could lead to an era of unprecedented progress and discovery.",
        trText: "Yapay zekanın hızlı evrimi, insan toplumu manzarasını kökten değiştiriyor. Sağlık ve ulaşımdan eğitim ve yaratıcı sanatlara kadar hiçbir sektör bu teknolojik gelişmelerden nasibini almamış değil. Ancak yapay zekayı günlük hayatımıza daha derinlemesine entrege ederken, gizlilik, özerklik ve işin geleceği ile ilgili karmaşık etik sorularla da yüzleşmek zorundayız. Yapay zekanın insan yeteneklerini artırma potansiyeli muazzamdır ve bir zamanlar aşılamaz olduğu düşünülen sorunları çözmemize olanak tanır. Ancak bu güç, teknolojinin mevcut eşitsizlikleri derinleştirmek yerine kolektif faydaya hizmet etmesini sağlama sorumluluğuyla birlikte gelir. Bazı uzmanlar, yapay zekanın insan zekasını geride bırakacağı bir nokta olan teknolojik tekilliğin eşiğinde olduğumuzu savunuyor. Bu olasılık hem heyecan verici hem de korkutucu olsa da, odağımız makine hedefleri ile insani değerler arasında bir hizalanma yaratmak üzerinde kalmalıdır. Dijital mantık okuryazarlığı geleneksel okuma yazma kadar temel hale geldikçe, eğitim bu geçişte kritik bir rol oynayacaktır. Herkes için daha müreffeh ve adil bir dünya yaratmak için her ikisinin de güçlü yanlarından yararlanarak, insanlar ve makineler arasındaki işbirliğinin norm olduğu bir geleceğe hazırlanmalıyız. Bu sadece teknik yeterlilik değil, aynı zamanda giderek otomatikleşen bir dünyada insan olmanın ne anlama geldiğine dair derin bir anlayış gerektirir. Bizi benzersiz kılan nitelikleri -empati, yaratıcılık ve ahlaki yargı- korurken, yapay zekanın sunduğu verimliliği ve analitik gücü benimsemeliyiz. İnsan sezgisi ile robotik hassasiyetin sentezi, benzeri görülmemiş bir ilerleme ve keşif çağına yol açabilir."
    },
    {
        id: 'read-05',
        title: "Environmental Stewardship in the Modern Era",
        author: "Eko-Ufuklar",
        difficulty: "Upper-Intermediate",
        engText: "In our interconnected world, environmental stewardship has evolved from a niche concern into a global imperative. The challenges of climate change, biodiversity loss, and resource depletion require a coordinated and sustained effort from governments, corporations, and individuals alike. It is no longer sufficient to simply reduce our negative impact; we must actively seek ways to regenerate and restore the natural systems upon which all life depends. Sustainable development is not merely about finding cleaner energy sources but also about rethinking our patterns of consumption and production. This shift requires a profound change in our collective mindset, moving away from a linear model of 'take-make-waste' toward a circular economy that mimics the efficiency of nature. Individual actions, while small on their own, possess incredible power when multiplied across millions of people. Choosing to support ethical businesses, reducing personal waste, and advocating for policy changes are all vital steps in this journey. Furthermore, reconnecting with the natural world can provide us with the clarity and motivation needed to protect it. When we realize that we are part of nature, not separate from it, our desire to safeguard the planet becomes an act of self-preservation. The choices we make today will echo through the centuries, determining the quality of life for all future generations. Education must emphasize the intrinsic value of nature, moving beyond a purely utilitarian view of the environment. By fostering a sense of wonder and respect for the Earth, we ensure that the next generation is equipped with the heart and the mind to lead the way toward a truly sustainable future.",
        trText: "Birbirine bağlı dünyamızda, çevresel yönetim niş bir kaygıdan küresel bir zorunluluğa dönüştü. İklim değişikliği, biyolojik çeşitlilik kaybı ve kaynak tükenmesi zorlukları; hükümetlerin, şirketlerin ve bireylerin koordineli ve sürdürülebilir bir çabasını gerektirir. Sadece olumsuz etkimizi azaltmamız artık yeterli değil; tüm yaşamın bağlı olduğu doğal sistemleri aktif olarak yenilemenin ve eski haline getirmenin yollarını aramalıyız. Sürdürülebilir kalkınma sadece daha temiz enerji kaynakları bulmakla ilgili değil, aynı zamanda tüketim ve üretim kalıplarımızı yeniden düşünmekle ilgilidir. Bu dönüşüm, 'al-yap-at' şeklindeki lineer modelden uzaklaşıp doğanın verimliliğini taklit eden bir döngüsel ekonomiye geçerek kolektif zihniyetimizde derin bir değişiklik gerektirir. Bireysel eylemler kendi başlarına küçük olsalar da, milyonlarca insana yayıldıklarında inanılmaz bir güce sahip olurlar. Etik işletmeleri desteklemeyi seçmek, kişisel atığı azaltmak ve politika değişikliklerini savunmak bu yolculuktaki hayati adımlardır. Dahası, doğal dünyayla yeniden bağ kurmak, onu korumak için gereken netlik ve motivasyonu sağlayabilir. Doğanın bir parçası olduğumuzu, ondan ayrı olmadığımızı fark ettiğimizde, gezegeni koruma arzumuz bir kendini koruma eylemine dönüşür. Bugün yaptığımız seçimler yüzyıllar boyunca yankılanacak ve gelecek tüm nesillerin yaşam kalitesini belirleyecektir. Eğitim, çevrenin tamamen faydacı görünümünün ötesine geçerek doğanın içsel değerini vurgulamalıdır. Dünyaya karşı bir hayranlık ve saygı duygusu geliştirerek, gelecek neslin gerçekten sürdürülebilir bir geleceğe giden yolda liderlik edecek kalbe ve zihne sahip olmasını sağlarız."
    }
];
