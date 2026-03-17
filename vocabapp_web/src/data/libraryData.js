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
        category: 'Kısaltma (Reduction)',
        title: 'İsim + to V1 & Ving',
        description: "İsimleri nitelemek için 'that' veya 'who' kullanmadan yapılan pratik kısaltmalar.",
        examples: [
            { eng: "The decision to leave early was wise.", tr: "Erken ayrılma kararı akıllıcaydı.", point: "Noun (decision) + to V1 yapısı." },
            { eng: "I have no desire to argue with you.", tr: "Seninle tartışma isteğim yok.", point: "Noun (desire) + to V1." },
            { eng: "The ability to speak English is a huge advantage.", tr: "İngilizce konuşabilme yeteneği büyük bir avantajdır.", point: "Noun (ability) + to V1." },
            { eng: "The man working in the garden is my father.", tr: "Bahçede çalışan adam benim babamdır.", point: "Active Reduction (who is working -> working)." },
            { eng: "The books lying on the table are mine.", tr: "Masada duran (yatan) kitaplar benimkiler.", point: "Active Reduction with Ving." },
            { eng: "She has the tendency to overthink everything.", tr: "Her şeyi gereğinden fazla düşünme eğilimi var.", point: "Noun (tendency) + to V1." },
            { eng: "The students waiting outside are cold.", tr: "Dışarıda bekleyen öğrenciler üşüyor.", point: "Relative Clause kısaltması (Ving)." },
            { eng: "It's time to go home.", tr: "Eve gitme vakti geldi.", point: "It's time + to V1." },
            { eng: "The first person to arrive will get a prize.", tr: "Varacak olan ilk kişi ödül alacak.", point: "The first/last + Noun + to V1 kısaltması." },
            { eng: "He has a lot of work to do.", tr: "Yapacak çok işi var.", point: "Noun + to V1 (Sıfat görevinde)." },
            { eng: "The road leading to the village is narrow.", tr: "Köye giden yol dardır.", point: "Noun + Ving (yolu niteliyor)." },
            { eng: "There is no reason to worry.", tr: "Endişelenmek için bir sebep yok.", point: "No reason + to V1." },
            { eng: "The girl singing on the stage is famous.", tr: "Sahnede şarkı söyleyen kız ünlüdür.", point: "Active Reduction (Ving)." },
            { eng: "I need a place to stay tonight.", tr: "Bu gece kalacak bir yere ihtiyacım var.", point: "Noun (place) + to V1." },
            { eng: "His effort to explain the situation failed.", tr: "Durumu açıklama çabası başarısız oldu.", point: "Noun (effort) + to V1." },
            { eng: "The people living next door are noisy.", tr: "Yandaki kapıda (yan komşu) yaşayan insanlar gürültücü.", point: "Noun + Ving nitelemesi." },
            { eng: "It's an honor to meet you.", tr: "Sizinle tanışmak bir onurdur.", point: "It's an honor + to V1." },
            { eng: "The train arriving at platform 3 is late.", tr: "3. perona varan tren gecikti.", point: "Noun + Ving (varan)." },
            { eng: "Do you have the courage to tell the truth?", tr: "Gerçeği söyleyecek cesaretin var mı?", point: "Noun (courage) + to V1." },
            { eng: "The children playing in the park are happy.", tr: "Parkta oyun oynayan çocuklar mutlular.", point: "Noun + Ving (oynayan)." }
        ]
    },
    {
        id: 'kp-01',
        category: 'Özel Kalıplar',
        title: 'Be + Adjective + to V1 Yapıları',
        description: 'Yaygın kullanılan "be willing to, be about to" gibi kalıplar.',
        examples: [
            { eng: "I am about to leave the house.", tr: "Evden çıkmak üzereyim.", point: "Be about to: Bir şeyin hemen gerçekleşecek olması." },
            { eng: "She is willing to help us.", tr: "Bize yardım etmeye istekli.", point: "Be willing to: Bir şeyi yapmaya gönüllü/istekli olmak." },
            { eng: "He is likely to win the race.", tr: "Yarışı kazanması muhtemel.", point: "Be likely to: Olasılık belirtir." },
            { eng: "You are supposed to be here at 9.", tr: "Saat 9'da burada olman gerekiyor.", point: "Be supposed to: Gereklilik/Beklenti." },
            { eng: "They are proud to announce the news.", tr: "Haberi duyurmaktan gurur duyuyorlar.", point: "Be proud to: Bir şeyden gurur duymak." },
            { eng: "We are ready to start the meeting.", tr: "Toplantıya başlamaya hazırız.", point: "Be ready to: Hazır olmak." },
            { eng: "It is bound to happen sooner or later.", tr: "Er ya da geç olması kaçınılmaz.", point: "Be bound to: Kesinlik/Kaçınılmazlık." },
            { eng: "She is reluctant to share her secrets.", tr: "Sırlarını paylaşmaya isteksiz.", point: "Be reluctant to: Gönülsüz olmak." },
            { eng: "I am determined to pass the exam.", tr: "Sınavı geçmeye kararlıyım.", point: "Be determined to: Kararlı olmak." },
            { eng: "He is free to go whenever he wants.", tr: "İstediği zaman gitmekte özgürdür.", point: "Be free to: Özgür olmak." },
            { eng: "You are lucky to have such friends.", tr: "Böyle arkadaşlara sahip olduğun için şanslısın.", point: "Be lucky to: Şanslı olmak." },
            { eng: "She is afraid to tell her parents.", tr: "Ailesine söylemekten korkuyor.", point: "Be afraid to: Korkmak." },
            { eng: "We were fortunate to find a parking spot.", tr: "Park yeri bulduğumuz için şanslıydık.", point: "Be fortunate to: Şanslı/Kısmetli olmak." },
            { eng: "He is slow to react in emergencies.", tr: "Acil durumlarda tepki vermekte yavaştır.", point: "Be slow/fast to: Hız belirtir." },
            { eng: "I am eager to learn new things.", tr: "Yeni şeyler öğrenmeye hevesliyim.", point: "Be eager to: Hevesli/Can atan." },
            { eng: "It is easy to solve this problem.", tr: "Bu problemi çözmek kolaydır.", point: "It is easy/hard to: Kolaylık/Zorluk." },
            { eng: "She is certain to succeed.", tr: "Başaracağı kesin.", point: "Be certain to: Eminlik." },
            { eng: "They are hesitant to invest in this company.", tr: "Bu şirkete yatırım yapmakta tereddütlüler.", point: "Be hesitant to: Tereddütlü olmak." },
            { eng: "He is eligible to apply for the job.", tr: "İşe başvurmak için uygun/niteliklidir.", point: "Be eligible to: Uygun olmak." },
            { eng: "I am delighted to meet you.", tr: "Sizinle tanıştığıma memnun oldum.", point: "Be delighted to: Çok memnun olmak." }
        ]
    },
    {
        id: 'md-01',
        category: 'Modals',
        title: 'Yardımcı Fiiller (Kiplikler)',
        description: 'Olasılık, yetenek, tavsiye ve zorunluluk anlatan yapıların derinlikleri.',
        examples: [
            { eng: "You must wear a seatbelt while driving.", tr: "Araba sürerken emniyet kemeri takmalısın.", point: "Must: Güçlü zorunluluk." },
            { eng: "She can speak three languages fluently.", tr: "Üç dili akıcı bir şekilde konuşabiliyor.", point: "Can: Yetenek." },
            { eng: "You should see a doctor as soon as possible.", tr: "En kısa sürede bir doktora görünmelisin.", point: "Should: Tavsiye." },
            { eng: "It might rain in the afternoon.", tr: "Öğleden sonra yağmur yağabilir.", point: "Might: Düşük olasılık." },
            { eng: "We don't have to finish this today.", tr: "Bunu bugün bitirmek zorunda değiliz.", point: "Don't have to: Zorunluluk yokluğu." },
            { eng: "You mustn't smoke in this building.", tr: "Bu binada sigara içmemelisin (yasak).", point: "Mustn't: Yasak." },
            { eng: "Could you please pass the salt?", tr: "Tuzu uzatabilir misiniz lütfen?", point: "Could: Nazik rica." },
            { eng: "I used to play tennis every weekend.", tr: "Her hafta sonu tenis oynardım (eskiden).", point: "Used to: Geçmişteki alışkanlık." },
            { eng: "She may be at work right now.", tr: "Şu an işte olabilir.", point: "May: Olasılık/İzin." },
            { eng: "You ought to study harder for your exams.", tr: "Sınavların için daha çok çalışmalısın.", point: "Ought to: Moral/Genel tavsiye." },
            { eng: "He would like to talk to you.", tr: "Sizinle konuşmak istiyor.", point: "Would like: İstek." },
            { eng: "I was able to find the keys eventually.", tr: "Sonunda anahtarları bulabildim.", point: "Be able to: Belirli bir andaki yetenek/başarı." },
            { eng: "You had better leave now or you'll miss the train.", tr: "Şimdi çıksan iyi edersin yoksa treni kaçıracaksın.", point: "Had better: Tehditvari tavsiye." },
            { eng: "May I borrow your pen?", tr: "Kalemini ödünç alabilir miyim?", point: "May (İzin isteme)." },
            { eng: "He can't be at home; he's at the office.", tr: "Evde olamaz; ofiste.", point: "Can't: İmkansızlık/Güçlü çıkarım." },
            { eng: "She must have forgotten our meeting.", tr: "Toplantımızı unutmuş olmalı.", point: "Must have V3: Geçmişe yönelik güçlü çıkarım." },
            { eng: "They might have arrived by now.", tr: "Şimdiye kadar varmış olabilirler.", point: "Might have V3: Geçmiş olasılık." },
            { eng: "You shouldn't have said that to her.", tr: "Ona bunu söylememeliydin.", point: "Shouldn't have V3: Geçmişe yönelik pişmanlık/eleştiri." },
            { eng: "I would rather stay home than go out tonight.", tr: "Bu gece dışarı çıkmaktansa evde kalmayı tercih ederim.", point: "Would rather: Tercih." },
            { eng: "Need I tell you the whole story?", tr: "Sana bütün hikayeyi anlatmam gerekiyor mu?", point: "Need (Modal kullanımı)." }
        ]
    },
    {
        id: 'pr-01',
        category: 'Prepositions',
        title: 'Preposition + Ving Kullanımları',
        description: 'Hangi edattan sonra hangi fiil nasıl gelir?',
        examples: [
            { eng: "You can improve your English by reading every day.", tr: "Her gün kitap okuyarak İngilizceni geliştirebilirsin.", point: "By + Ving: -erek, -arak anlamı katar." },
            { eng: "He achieved success through working hard.", tr: "Çok çalışarak (çalışma yoluyla) başarıya ulaştı.", point: "Through + Ving: Aracılığıyla/Yoluyla." },
            { eng: "She is afraid of flying.", tr: "Uçmaktan korkuyor.", point: "Of + Ving: İsimleşme." },
            { eng: "They are interested in learning photography.", tr: "Fotoğrafçılık öğrenmekle ilgileniyorlar.", point: "In + Ving: İlgi alanı." },
            { eng: "Instead of staying home, we went to the beach.", tr: "Evde kalmak yerine sahile gittik.", point: "Instead of + Ving: Yerine." },
            { eng: "In spite of being tired, he finished the project.", tr: "Yorgun olmasına rağmen projeyi bitirdi.", point: "In spite of + Ving: -e rağmen." },
            { eng: "Despite losing the game, they were happy.", tr: "Maçı kaybetmelerine rağmen mutlulardı.", point: "Despite + Ving: Zıtlık." },
            { eng: "He left without saying goodbye.", tr: "Hoşça kal demeden ayrıldı.", point: "Without + Ving: -madan, -meden." },
            { eng: "Think about joining our club.", tr: "Kulübümüze katılmayı bir düşün.", point: "About + Ving: Hakkında/Düşünce." },
            { eng: "I am fed up with waiting for you.", tr: "Seni beklemekten bıktım.", point: "With + Ving: Bir durumdan bıkkınlık." },
            { eng: "This tool is used for opening cans.", tr: "Bu araç kutu açmak için kullanılır.", point: "For + Ving: Amaç/Kullanım amacı." },
            { eng: "She apologized for being late.", tr: "Geç kaldığı için özür diledi.", point: "For + Ving: Sebep belirtir." },
            { eng: "He succeeded in solving the puzzle.", tr: "Bulmacayı çözmede başarılı oldu.", point: "In + Ving: Başarı alanı." },
            { eng: "Before entering the room, please knock.", tr: "Odaya girmeden önce lütfen vurun.", point: "Before + Ving: Zaman." },
            { eng: "After winning the award, she gave a speech.", tr: "Ödülü kazandıktan sonra bir konuşma yaptı.", point: "After + Ving: Zaman." },
            { eng: "I look forward to meeting you.", tr: "Sizinle tanışmayı dört gözle bekliyorum.", point: "To (Prep) + Ving: Beklenti." },
            { eng: "They are used to living in a cold climate.", tr: "Soğuk bir iklimde yaşamaya alışkınlar.", point: "Be used to + Ving: Alışkın olmak." },
            { eng: "He prevented the window from breaking.", tr: "Pencerenin kırılmasını engelledi.", point: "From + Ving: Engelleme." },
            { eng: "She is good at drawing.", tr: "Resim çizmekte iyidir.", point: "At + Ving: Yetenek." },
            { eng: "She broke the glass by accident while washing it.", tr: "Yıkarken bardağı kazayla kırdı.", point: "While + Ving: Eş zamanlılık." }
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
        id: 'read-beg-01',
        title: "A Day at the Park",
        author: "Zihin Atölyesi",
        difficulty: "Beginner",
        engText: "The sun is shining today. It is a beautiful morning. People are walking their dogs in the park. Children are playing on the swings. I like to sit on the grass and read a book. Sometimes, I see birds in the trees. The air is fresh and clean. Life is simple and happy here.",
        trText: "Bugün güneş parlıyor. Güzel bir sabah. İnsanlar parkta köpeklerini gezdiriyorlar. Çocuklar salıncaklarda oynuyorlar. Çimlerin üzerine oturup kitap okumayı seviyorum. Bazen ağaçlarda kuşlar görüyorum. Hava taze ve temiz. Burada hayat basit ve mutlu."
    },
    {
        id: 'read-beg-02',
        title: "My Family",
        author: "Dil Akademisi",
        difficulty: "Beginner",
        engText: "I have a small family. There are four people in my house: my father, my mother, my sister, and me. My father is a doctor. My mother is a teacher. My sister is a student. We like to eat dinner together every evening. We are very happy.",
        trText: "Küçük bir ailem var. Evimde dört kişi var: babam, annem, kız kardeşim ve ben. Babam bir doktor. Annem bir öğretmen. Kız kardeşim bir öğrenci. Her akşam birlikte yemek yemeyi severiz. Çok mutluyuz."
    },
    {
        id: 'read-beg-03',
        title: "The Grocery Store",
        author: "Günlük Yaşam",
        difficulty: "Beginner",
        engText: "I go to the grocery store on Saturdays. I need milk, bread, and eggs. I also buy some fruit. I like apples and bananas. The store is very big. I pay at the counter and go home. I love fresh fruit.",
        trText: "Cumartesi günleri markete giderim. Süt, ekmek ve yumurtaya ihtiyacım var. Ayrıca biraz meyve alırım. Elma ve muzu severim. Market çok büyük. Kasada ödeme yaparım ve eve giderim. Taze meyveyi severim."
    },
    {
        id: 'read-beg-04',
        title: "My Morning Routine",
        author: "Zihin Atölyesi",
        difficulty: "Beginner",
        engText: "I wake up at seven o'clock. I wash my face and brush my teeth. Then, I have breakfast. I usually eat bread and honey. After breakfast, I go to work. I take the bus. My work starts at nine o'clock.",
        trText: "Saat yedide uyanırım. Yüzümü yıkarım ve dişlerimi fırçalarım. Sonra kahvaltı yaparım. Genellikle ekmek ve bal yerim. Kahvaltıdan sonra işe giderim. Otobüse binerim. İşim saat dokuzda başlıyor."
    },
    {
        id: 'read-beg-05',
        title: "The Seasons",
        author: "Doğa Gezgini",
        difficulty: "Beginner",
        engText: "There are four seasons in a year: spring, summer, autumn, and winter. In spring, flowers grow. In summer, it is very hot. I go to the beach. In autumn, leaves fall from trees. In winter, it is cold and sometimes it snows.",
        trText: "Bir yılda dört mevsim vardır: ilkbahar, yaz, sonbahar ve kış. İlkbaharda çiçekler büyür. Yazın hava çok sıcaktır. Plaja giderim. Sonbaharda yapraklar ağaçlardan düşer. Kışın hava soğuktur ve bazen kar yağar."
    },
    {
        id: 'read-beg-06',
        title: "A Visit to the Zoo",
        author: "Macera Defteri",
        difficulty: "Beginner",
        engText: "Yesterday, I went to the zoo with my friends. We saw many animals. The lions were very big. The monkeys were funny. I liked the elephants. They have long trunks. We took many photos. It was a great day.",
        trText: "Dün arkadaşlarımla hayvanat bahçesine gittim. Birçok hayvan gördük. Aslanlar çok büyüktü. Maymunlar komikti. Fillere bayıldım. Uzun hortumları var. Birçok fotoğraf çektik. Harika bir gündü."
    },
    {
        id: 'read-beg-07',
        title: "My Best Friend",
        author: "Sosyal Günlük",
        difficulty: "Beginner",
        engText: "My best friend's name is Mark. He is very kind. We play football together. He lives in a small apartment. We also study English together. Mark wants to be a pilot. I hope he achieves his dream.",
        trText: "En iyi arkadaşımın adı Mark. O çok nazik. Birlikte futbol oynuyoruz. Küçük bir apartmanda yaşıyor. Ayrıca birlikte İngilizce çalışıyoruz. Mark pilot olmak istiyor. Umarım hayaline ulaşır."
    },
    {
        id: 'read-beg-08',
        title: "Cooking Lunch",
        author: "Mutfak Sırları",
        difficulty: "Beginner",
        engText: "Today, I am cooking lunch for my family. I am making pasta. I need water, salt, and tomato sauce. I boil the water first. Then, I add the pasta. It is easy to cook. My mother says my pasta is delicious.",
        trText: "Bugün ailem için öğle yemeği pişiriyorum. Makarna yapıyorum. Su, tuz ve domates sosuna ihtiyacım var. Önce suyu kaynatırım. Sonra makarnayı eklerim. Pişirmesi kolaydır. Annem makarnamın lezzetli olduğunu söylüyor."
    },
    {
        id: 'read-beg-09',
        title: "The Library",
        author: "Bilgi Yolu",
        difficulty: "Beginner",
        engText: "The library is a quiet place. There are many books on the shelves. People come here to read and study. I like history books. I borrow two books every week. You must be quiet in the library. I enjoy reading.",
        trText: "Kütüphane sessiz bir yerdir. Raflarda birçok kitap var. İnsanlar buraya okumak ve çalışmak için gelirler. Tarih kitaplarını severim. Her hafta iki kitap ödünç alırım. Kütüphanede sessiz olmalısınız. Okumaktan keyif alıyorum."
    },
    {
        id: 'read-beg-10',
        title: "A Trip to London",
        author: "Seyahat Rehberi",
        difficulty: "Beginner",
        engText: "Last year, I went to London. It is a famous city. I saw the Big Ben. It is very tall. The weather was rainy but I didn't mind. I visited some museums. I liked the British Museum. London is very expensive but beautiful.",
        trText: "Geçen yıl Londra'ya gittim. Ünlü bir şehir. Big Ben'i gördüm. Çok uzun. Hava yağmurluydu ama aldırmadım. Bazı müzeleri ziyaret ettim. British Museum'u çok sevdim. Londra çok pahalı ama güzel."
    },
    {
        id: 'read-beg-11',
        title: "My New Car",
        author: "Oto Dünyası",
        difficulty: "Beginner",
        engText: "I have a new car. It is blue and very fast. I drive my car to work. My friends like my car. It is comfortable and safe. I always wash it on Sundays. I am very proud of my new car.",
        trText: "Yeni bir arabam var. Mavi ve çok hızlı. Arabamı işe sürerim. Arkadaşlarım arabamı seviyor. Konforlu ve güvenli. Onu her zaman pazar günleri yıkarım. Yeni arabamla gurur duyuyorum."
    },
    {
        id: 'read-beg-12',
        title: "The Birthday Party",
        author: "Kutlama Zamanı",
        difficulty: "Beginner",
        engText: "Today is my birthday. I am having a party. My friends are coming. There is a big cake on the table. We are singing 'Happy Birthday'. I am getting many presents. I am very excited and happy today.",
        trText: "Bugün benim doğum günüm. Bir parti veriyorum. Arkadaşlarım geliyor. Masanın üzerinde büyük bir pasta var. 'İyi ki Doğdun' şarkısını söylüyoruz. Birçok hediye alıyorum. Bugün çok heyecanlı ve mutluyum."
    },
    {
        id: 'read-beg-13',
        title: "Living in the Countryside",
        author: "Doğa Günlüğü",
        difficulty: "Beginner",
        engText: "I live in a small village. It is in the countryside. There are many green fields and trees. I have a garden. I grow tomatoes and peppers. It is very quiet at night. I like the fresh air of the countryside.",
        trText: "Küçük bir köyde yaşıyorum. Kırsal kesimde. Birçok yeşil alan ve ağaç var. Bir bahçem var. Domates ve biber yetiştiriyorum. Geceleri çok sessiz. Kırsalın taze havasını seviyorum."
    },
    {
        id: 'read-beg-14',
        title: "Learning to Swim",
        author: "Spor Akademisi",
        difficulty: "Beginner",
        engText: "I am learning to swim. I go to the pool twice a week. At first, I was afraid of water. But now, I am getting better. My coach is very helpful. Swimming is good for my health. I want to swim in the ocean.",
        trText: "Yüzmeyi öğreniyorum. Haftada iki kez havuza giderim. İlk başta sudan korkuyordum. Ama şimdi daha iyiye gidiyorum. Antrenörüm çok yardımcı oluyor. Yüzmek sağlığım için iyidir. Okyanusta yüzmek istiyorum."
    },
    {
        id: 'read-beg-15',
        title: "The New Student",
        author: "Okul Hayatı",
        difficulty: "Beginner",
        engText: "There is a new student in our class. Her name is Nina. She comes from Italy. She is very friendly. Nina speaks Italian and a little English. We are helping her with her lessons. We are glad to have her in our class.",
        trText: "Sınıfımızda yeni bir öğrenci var. Adı Nina. İtalya'dan geliyor. Çok cana yakın. Nina İtalyanca ve biraz İngilizce konuşuyor. Derslerinde ona yardımcı oluyoruz. Sınıfımızda olduğu için memnunuz."
    },
    {
        id: 'read-beg-16',
        title: "A Rainy Afternoon",
        author: "Zihin Atölyesi",
        difficulty: "Beginner",
        engText: "It is raining outside. I am staying at home. I am drinking hot chocolate. I am watching a movie on TV. I like the sound of rain on the roof. It is a relaxing afternoon. I don't want to go out today.",
        trText: "Dışarıda yağmur yağıyor. Evde kalıyorum. Sıcak çikolata içiyorum. Televizyonda bir film izliyorum. Çatıdaki yağmurun sesini seviyorum. Rahatlatıcı bir öğleden sonra. Bugün dışarı çıkmak istemiyorum."
    },
    {
        id: 'read-beg-17',
        title: "Getting a Pet",
        author: "Hayvan Dostları",
        difficulty: "Beginner",
        engText: "I want a pet. I like dogs and cats. My parents say I can have a cat. I am very happy. We are going to the animal shelter. I want a small kitten. I will take good care of my new friend.",
        trText: "Bir evcil hayvan istiyorum. Köpekleri ve kedileri severim. Ailem bir kedim olabileceğini söylüyor. Çok mutluyuz. Hayvan barınağına gidiyoruz. Küçük bir yavru kedi istiyorum. Yeni arkadaşıma çok iyi bakacağım."
    },
    {
        id: 'read-beg-18',
        title: "Playing the Piano",
        author: "Sanat Köşesi",
        difficulty: "Beginner",
        engText: "My sister plays the piano. She practices every day. The music is very beautiful. Sometimes, I sing while she plays. She wants to be a famous musician. I think she is very talented. I love listening to her.",
        trText: "Kız kardeşim piyano çalıyor. Her gün pratik yapıyor. Müzik çok güzel. Bazen o çalarken ben şarkı söylüyorum. Ünlü bir müzisyen olmak istiyor. Bence çok yetenekli. Onu dinlemeyi seviyorum."
    },
    {
        id: 'read-beg-19',
        title: "Watching the Stars",
        author: "Gökbilimci",
        difficulty: "Beginner",
        engText: "At night, the sky is full of stars. I like to sit outside and look up. The stars are very bright. Sometimes, I see the moon too. The universe is very big. I want to learn more about space. It is mysterious.",
        trText: "Geceleri gökyüzü yıldızlarla dolu. Dışarıda oturup yukarı bakmayı seviyorum. Yıldızlar çok parlak. Bazen ayı da görüyorum. Evren çok büyük. Uzay hakkında daha fazla şey öğrenmek istiyorum. Çok gizemli."
    },
    {
        id: 'read-beg-20',
        title: "My Favorite Food",
        author: "Lezzet Yolculuğu",
        difficulty: "Beginner",
        engText: "My favorite food is pizza. I like it with cheese and tomatoes. I often eat pizza on Fridays. My mother makes the best pizza at home. I also like hamburgers, but pizza is always number one for me.",
        trText: "En sevdiğim yemek pizzadır. Onu peynirli ve domatesli severim. Genellikle cuma günleri pizza yerim. Annem evde en iyi pizzayı yapar. Hamburgere de bayılırım ama pizza benim için her zaman bir numaradır."
    },
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
        difficulty: "Intermediate",
        engText: "Learning a new language is more than just memorizing a vocabulary list or mastering complex grammar rules. It is an exploration of a different culture and a new way of seeing the world. When you learn a new word, you are not just finding an equivalent for a concept in your native language; you are opening a window to a different thought process. For instance, some languages have words that describe emotions that don't exist in others. This tells us that the way we speak actually shapes our perception of reality. Therefore, to become fluent, one must immerse themselves in the sounds and rhythms of the language. Listen to music, watch movies, and most importantly, speak without hesitation. Perfection should never be the goal. Instead, focus on communication and the joy of being understood. The more you use the language in real-life contexts, the more natural it will become. Consistency is the key to mastery. Even fifteen minutes of daily practice can lead to significant progress over time if maintained regularly. Beyond the linguistic benefits, language learning fosters empathy and global understanding, allowing us to build bridges between diverse communities that might otherwise remain isolated from one another. By understanding the nuances of how others express their thoughts, we gain insight into their values and worldviews, fostering a more harmonious global society.",
        trText: "Yeni bir dil öğrenmek, sadece bir kelime listesini ezberlemekten veya karmaşık dil bilgisi kurallarında uzmanlaşmaktan daha fazlasıdır. Farklı bir kültürün keşfi ve dünyayı görmenin yeni bir yoludur. Yeni bir kelime öğrendiğinizde, sadece ana dilinizdeki bir kavramın karşılığını bulmakla kalmazsınız; farklı bir düşünce sürecine bir pencere açarsınız. Örneğin, bazı dillerin diğerlerinde var olmayan duyguları tanımlayan kelimeleri vardır. Bu bize, konuşma şeklimizin aslında gerçeklik algımızı şekillendirdiğini söyler. Bu nedenle, akıcı hale gelmek için kişi kendini dilin seslerine ve ritimlerine bırakmalıdır. Müzik dinleyin, film izleyin ve en önemlisi, çekinmeden konuşun. Mükemmellik asla hedef olmamalıdır. Bunun yerine, iletişime ve anlaşılmanın verdiği sevince odaklanın. Dili gerçek hayat bağlamlarında ne kadar çok kullanırsanız, o kadar doğal hale gelecektir. İstikrar, uzmanlığın anahtarıdır. Düzenli olarak sürdürülürse, günlük on beş dakikalık pratik bile zamanla önemli bir ilerlemeye yol açabilir. Dilbilimsel faydaların ötesinde, dil öğrenimi empatiyi ve küresel anlayışı teşvik eder ve aksi takdirde birbirinden izole kalabilecek çeşitli topluluklar arasında köprüler kurmamıza olanak tanır. Başkalarının düşüncelerini nasıl ifade ettiğinin inceliklerini anlayarak, onların değerleri ve dünya görüşleri hakkında fikir sahibi olur, daha uyumlu bir küresel toplumu teşvik ederiz."
    },
    {
        id: 'read-int-01',
        title: "The Mystery of the Mary Celeste",
        author: "Tarih Avcısı",
        difficulty: "Intermediate",
        engText: "The Mary Celeste was an American merchant brigantine discovered adrift and deserted in the Atlantic Ocean in 1872. The ship was in good condition and still under sail, but the crew was nowhere to be found. The cargo was mostly intact and the crew's personal belongings were still in their places. Many theories have been proposed over the years, ranging from pirate attacks to giant squids, but none have been proven. To this day, the disappearance of the crew remain one of the most famous maritime mysteries in history.",
        trText: "Mary Celeste, 1872'de Atlantik Okyanusu'nda sürüklenirken ve terk edilmiş halde bulunan bir Amerikan ticaret gemisiydi. Gemi iyi durumdaydı ve hala yelken açıyordu ancak mürettebat hiçbir yerde yoktu. Kargo büyük ölçüde bozulmamıştı ve mürettebatın kişisel eşyaları hala yerlerindeydi. Korsan saldırılarından dev mürekkep balıklarına kadar yıllar boyunca birçok teori öne sürüldü ancak hiçbiri kanıtlanamadı. Mürettebatın ortadan kaybolması bugüne kadar tarihin en ünlü denizcilik gizemlerinden biri olmaya devam ediyor."
    },
    {
        id: 'read-int-02',
        title: "The Benefits of Regular Exercise",
        author: "Sağlık Rehberi",
        difficulty: "Intermediate",
        engText: "Regular physical activity is vital for maintaining both physical and mental 건강. It helps in controlling weight, reducing the risk of chronic diseases, and strengthening bones and muscles. Beyond physical benefits, exercise is also known to improve mood and reduce feelings of anxiety and depression by releasing endorphins, often called feel-good hormones. Experts recommend at least 150 minutes of moderate activity per week for adults. Finding an activity you enjoy, like swimming or dancing, makes it easier to stay consistent.",
        trText: "Düzenli fiziksel aktivite, hem fiziksel hem de zihinsel sağlığı korumak için hayati önem taşır. Kilo kontrolünde, kronik hastalık riskinin azaltılmasında, kemik ve kasların güçlendirilmesinde yardımcı olur. Fiziksel faydalarının ötesinde, egzersizin 'mutluluk hormonları' olarak adlandırılan endorfinleri salgılayarak ruh halini iyileştirdiği, kaygı ve depresyon duygularını azalttığı bilinmektedir. Uzmanlar yetişkinler için haftada en az 150 dakikalık orta dereceli aktivite önermektedir. Yüzme veya dans gibi sevdiğiniz bir aktiviteyi bulmak, istikrarlı kalmayı kolaylaştırır."
    },
    {
        id: 'read-int-03',
        title: "The History of Chocolate",
        author: "Kültür Kaşifi",
        difficulty: "Intermediate",
        engText: "Chocolate's history begins in ancient Mesoamerica, where the Maya and Aztecs used cacao beans to create a bitter, spicy drink. They believed cacao was a gift from the gods and used it in sacred ceremonies. When Spanish explorers brought cacao to Europe in the 16th century, it became a luxury for the wealthy. It wasn't until the 19th century that modern technology allowed for the creation of solid milk chocolate. Today, chocolate is enjoyed worldwide in many forms, from bars to hot cocoa.",
        trText: "Çikolatanın tarihi, Maya ve Azteklerin acı ve baharatlı bir içecek hazırlamak için kakao çekirdeklerini kullandığı antik Mezoamerika'da başlar. Kakaonun tanrılardan bir hediye olduğuna inanıyorlar ve onu kutsal törenlerde kullanıyorlardı. 16. yüzyılda İspanyol kaşifler kakaoyu Avrupa'ya getirdiğinde, zenginler için bir lüks haline geldi. Modern teknolojinin katı sütlü çikolatanın yapılmasına izin vermesi ancak 19. yüzyılda gerçekleşti. Bugün çikolata, barlardan sıcak kakaoya kadar pek çok biçimde dünya çapında beğeniliyor."
    },
    {
        id: 'read-int-04',
        title: "Urban Farming",
        author: "Eko-Yaşam",
        difficulty: "Intermediate",
        engText: "Urban farming is the practice of growing food within a city environment. This can include rooftop gardens, community plots, or even vertical farms. The goal is to provide fresh, local produce to city dwellers while reducing the carbon footprint associated with transporting food over long distances. Urban farms also help improve local air quality and provide green spaces in crowded cities. As the world's population grows, urban farming is becoming an increasingly important part of sustainable city planning.",
        trText: "Kentsel tarım, şehir ortamında gıda yetiştirme uygulamasıdır. Bu, çatı bahçelerini, topluluk arsalarını veya hatta dikey çiftlikleri içerebilir. Amaç, gıdanın uzun mesafelere taşınmasıyla ilişkili karbon ayak izini azaltırken şehir sakinlerine taze, yerel ürünler sağlamaktır. Kentsel çiftlikler ayrıca yerel hava kalitesini iyileştirmeye yardımcı olur ve kalabalık şehirlerde yeşil alanlar sağlar. Dünya nüfusu arttıkça kentsel tarım, sürdürülebilir şehir planlamasının giderek daha önemli bir parçası haline geliyor."
    },
    {
        id: 'read-int-05',
        title: "The Psychological Power of Colors",
        author: "Zihin Atölyesi",
        difficulty: "Intermediate",
        engText: "Colors have a significant impact on our emotions and behaviors. For example, blue is often associated with calmness and productivity, which is why it's a popular choice for office walls. Red, on the other hand, can stimulate excitement and even increase heart rate, often used in restaurants to encourage appetite. Yellow is typically linked to happiness and energy, while green represents nature and balance. Understanding color psychology is a powerful tool for designers, marketers, and even individuals trying to decorate their homes.",
        trText: "Renklerin duygularımız ve davranışlarımız üzerinde önemli bir etkisi vardır. Örneğin mavi genellikle sakinlik ve üretkenlikle ilişkilendirilir, bu yüzden ofis duvarları için popüler bir seçimdir. Öte yandan kırmızı, heyecanı canlandırabilir ve hatta kalp atış hızını artırabilir; iştahı artırmak için genellikle restoranlarda kullanılır. Sarı tipik olarak mutluluk ve enerji ile bağlantılıyken, yeşil doğayı ve dengeyi temsil eder. Renk psikolojisini anlamak tasarımcılar, pazarlamacılar ve hatta evlerini dekore etmeye çalışan bireyler için güçlü bir araçtır."
    },
    {
        id: 'read-int-06',
        title: "The Evolution of Video Games",
        author: "Teknoloji Günlüğü",
        difficulty: "Intermediate",
        engText: "Video games have come a long way since the days of simple pixels and basic sounds. In the 1970s, games like Pong were revolutionary despite their simplicity. By the 1990s, 3D graphics transformed the industry, allowing for more immersive worlds. Today, virtual reality and ray-tracing technology provide lifelike experiences that were once unimaginable. Beyond entertainment, video games are now used for education, surgical training, and even as a professional sport. The industry continues to push the boundaries of technology and storytelling.",
        trText: "Video oyunları, basit piksellerin ve temel seslerin olduğu günlerden bu yana çok yol kat etti. 1970'lerde Pong gibi oyunlar basitliklerine rağmen devrim niteliğindeydi. 1990'lara gelindiğinde, 3D grafikler sektörü dönüştürerek daha sürükleyici dünyalara olanak sağladı. Bugün sanal gerçeklik ve ışın izleme teknolojisi, bir zamanlar hayal bile edilemeyen gerçekçi deneyimler sunuyor. Eğlencenin ötesinde, video oyunları artık eğitimde, cerrahi eğitimde ve hatta profesyonel bir spor olarak kullanılıyor. Sektör, teknolojinin ve hikaye anlatımının sınırlarını zorlamaya devam ediyor."
    },
    {
        id: 'read-int-07',
        title: "The Great Barrier Reef",
        author: "Doğa Gezgini",
        difficulty: "Intermediate",
        engText: "Located off the coast of Australia, the Great Barrier Reef is the world's largest coral reef system. It is so large that it can be seen from outer space. The reef is home to thousands of species of fish, turtles, sharks, and vibrant corals. However, it faces serious threats from climate change and pollution. Rising ocean temperatures cause coral bleaching, which can lead to the death of the reef ecosystem. Modern conservation efforts are working to protect this natural wonder for future generations.",
        trText: "Avustralya açıklarında bulunan Büyük Set Resifi, dünyanın en büyük mercan resifi sistemidir. O kadar büyüktür ki uzaydan bile görülebilir. Resif binlerce balık türüne, kaplumbağaya, köpekbalığına ve canlı mercanlara ev sahipliği yapar. Ancak iklim değişikliği ve kirlilik gibi ciddi tehditlerle karşı karşıyadır. Yükselen okyanus sıcaklıkları, resif ekosisteminin ölümüne yol açabilen mercan beyazlamasına neden olur. Modern koruma çabaları, bu doğa harikasını gelecek nesiller için korumaya çalışıyor."
    },
    {
        id: 'read-int-08',
        title: "The Importance of Sleep",
        author: "Zihin Atölyesi",
        difficulty: "Intermediate",
        engText: "Sleep is as essential to our health as food and water. During sleep, the brain processes information from the day and clear out toxins. For students, a good night's sleep is crucial for memory consolidation and focus. Lack of sleep can lead to mood swings, decreased productivity, and a weakened immune system. Most adults need 7 to 9 hours of quality sleep per night. Establishing a regular sleep schedule and avoiding screens before bed are common tips for improving sleep quality and overall well-being.",
        trText: "Uyku, sağlığımız için yiyecek ve su kadar temeldir. Uyku sırasında beyin gün içindeki bilgileri işler ve toksinleri temizler. Öğrenciler için hafızanın güçlenmesi ve odaklanma için iyi bir gece uykusu çok önemlidir. Uyku eksikliği ruh hali değişimlerine, üretkenliğin azalmasına ve bağışıklık sisteminin zayıflamasına yol açabilir. Çoğu yetişkinin gece başına 7 ila 9 saatlik kaliteli uykuya ihtiyacı vardır. Düzenli bir uyku programı oluşturmak ve yatmadan önce ekranlardan kaçınmak, uyku kalitesini ve genel refahı artırmak için yaygın ipuçlarıdır."
    },
    {
        id: 'read-int-09',
        title: "The Rise of Electric Vehicles",
        author: "Gelecek Analizi",
        difficulty: "Intermediate",
        engText: "Electric vehicles (EVs) are becoming increasingly popular as the world looks for ways to reduce carbon emissions. Unlike traditional cars that run on gasoline, EVs are powered by batteries and produce zero tailpipe emissions. Many governments are offering incentives to encourage people to switch to electric cars, and manufacturers are investing billions in new technology. While challenges like charging infrastructure and battery production remain, the shift toward electric transportation is seen as a key step in fighting global warming.",
        trText: "Dünya karbon emisyonlarını azaltmanın yollarını aradıkça elektrikli araçlar (EV'ler) giderek daha popüler hale geliyor. Benzinle çalışan geleneksel arabaların aksine, elektrikli araçlar pillerle çalışır ve egzoz emisyonu üretmez. Birçok hükümet, insanları elektrikli arabalara geçmeye teşvik etmek için teşvikler sunuyor ve üreticiler yeni teknolojiye milyarlarca yatırım yapıyor. Şarj altyapısı ve pil üretimi gibi zorluklar devam etse de, elektrikli taşımacılığa geçiş, küresel ısınmayla mücadelede kilit bir adım olarak görülüyor."
    },
    {
        id: 'read-int-10',
        title: "The Great Wall of China",
        author: "Tarih Avcısı",
        difficulty: "Intermediate",
        engText: "The Great Wall of China is one of the most impressive architectural feats in human history. Built over many centuries by various dynasties, its primary purpose was protection against invasions from northern tribes. Contrary to popular belief, it is not a single continuous wall but a series of walls and fortifications. Thousands of workers contributed to its construction, and many lost their lives. Today, it is a UNESCO World Heritage site and attracts millions of tourists from all over the world every year.",
        trText: "Çin Seddi, insanlık tarihinin en etkileyici mimari başarılarından biridir. Çeşitli hanedanlar tarafından yüzyıllar boyunca inşa edilen temel amacı, kuzeydeki kabilelerden gelecek istilalara karşı korunmaktı. Yaygın inanışın aksine, tek bir kesintisiz duvar değil, bir dizi duvar ve tahkimattan oluşur. İnşasına binlerce işçi katıldı ve birçoğu hayatını kaybetti. Bugün UNESCO Dünya Mirası Listesi'ndedir ve her yıl dünyanın her yerinden milyonlarca turisti kendine çekmektedir."
    },
    {
        id: 'read-int-11',
        title: "The Benefits of Reading Fiction",
        author: "Edebiyat Köşesi",
        difficulty: "Intermediate",
        engText: "Reading fiction is not just a form of entertainment; it also offers numerous cognitive benefits. Immersing oneself in a story can improve empathy by allowing the reader to experience life through others' perspectives. Studies have shown that reading regularly can reduce stress levels and improve vocabulary and language skills. Furthermore, it stimulates the imagination and can even improve critical thinking as readers try to predict plot twists. In a busy world, getting lost in a good book is a great way to sharpen the mind.",
        trText: "Kurgu okumak sadece bir eğlence biçimi değildir; aynı zamanda sayısız bilişsel fayda sunar. Bir hikayeye dalmak, okuyucunun hayatı başkalarının bakış açısıyla deneyimlemesine izin vererek empatiyi artırabilir. Araştırmalar, düzenli okumanın stres seviyelerini azaltabileceğini, kelime dağarcığını ve dil becerilerini geliştirebileceğini göstermiştir. Dahası, okuyucular olay örgüsündeki ters köşeleri tahmin etmeye çalışırken hayal gücünü canlandırır ve hatta eleştirel düşünmeyi geliştirebilir. Meşgul bir dünyada, iyi bir kitapta kaybolmak zihni keskinleştirmenin harika bir yoludur."
    },
    {
        id: 'read-int-12',
        title: "Renewable Energy Sources",
        author: "Eko-Ufuklar",
        difficulty: "Intermediate",
        engText: "Renewable energy comes from sources that don't run out, such as the sun, wind, and water. Unlike fossil fuels like coal and oil, renewable energy produces little to no pollution. Solar panels convert sunlight into electricity, while wind turbines harness the power of the wind. Hydropower uses the energy of moving water from rivers or dams. These technologies are becoming cheaper and more efficient. Transitioning to renewable energy is vital for protecting our environment and ensuring a sustainable future for our planet.",
        trText: "Yenilenebilir enerji; güneş, rüzgar ve su gibi tükenmeyen kaynaklardan gelir. Kömür ve petrol gibi fosil yakıtların aksine, yenilenebilir enerji çok az kirlilik üretir veya hiç üretmez. Güneş panelleri güneş ışığını elektriğe dönüştürürken, rüzgar türbinleri rüzgarın gücünden yararlanar. Hidroelektrik, nehirlerden veya barajlardan gelen hareketli suyun enerjisini kullanır. Bu teknolojiler daha ucuz ve daha verimli hale geliyor. Yenilenebilir enerjiye geçiş, çevremizi korumak ve gezegenimiz için sürdürülebilir bir gelecek sağlamak için hayati önem taşır."
    },
    {
        id: 'read-int-13',
        title: "Social Media and Mental Health",
        author: "Modern Psikoloji",
        difficulty: "Intermediate",
        engText: "While social media allows us to stay connected with friends and family, it can also have negative effects on mental health. Constant scrolling can lead to 'fomo' (fear of missing out) and lower self-esteem as people compare their daily lives to the carefully curated photos of others. It is important to remember that most people only share their best moments online. Taking regular breaks from social media and focusing on face-to-face interactions can help maintain a healthy perspective. Balance is the key to using these digital tools effectively.",
        trText: "Sosyal medya arkadaşlarımızla ve ailemizle bağlantıda kalmamızı sağlarken, ruh sağlığı üzerinde olumsuz etkileri de olabilir. Sürekli gezinme, insanlar günlük yaşamlarını başkalarının özenle seçilmiş fotoğraflarıyla karşılaştırdıkça 'fomo' (bir şeyleri kaçırma korkusu) ve daha düşük özgüvene yol açabilir. Çoğu insanın çevrimiçi ortamda yalnızca en iyi anlarını paylaştığını unutmamak önemlidir. Sosyal medyadan düzenli molalar vermek ve yüz yüze etkileşimlere odaklanmak sağlıklı bir perspektif sürdürmeye yardımcı olabilir. Bu dijital araçları etkili bir şekilde kullanmanın anahtarı dengedir."
    },
    {
        id: 'read-int-14',
        title: "The Internet of Things",
        author: "Teknoloji Geleceği",
        difficulty: "Intermediate",
        engText: "The Internet of Things (IoT) refers to the network of everyday objects connected to the internet. This includes smart fridges that can tell you when you're low on milk, or thermostats that you can control from your phone. The goal of IoT is to make our lives more convenient and efficient by allowing devices to communicate with each other. For example, a smart city could use IoT sensors to manage traffic flow or reduce energy usage. However, this increased connectivity also raises concerns about data privacy and security.",
        trText: "Nesnelerin İnterneti (IoT), internete bağlı günlük nesneler ağını ifade eder. Buna sütünüz azaldığında size söyleyebilen akıllı buzdolapları veya telefonunuzdan kontrol edebileceğiniz termostatlar dahildir. IoT'nin amacı, cihazların birbirleriyle iletişim kurmasına izin vererek hayatımızı daha rahat ve verimli hale getirmektir. Örneğin, akıllı bir şehir trafik akışını yönetmek veya enerji kullanımını azaltmak için IoT sensörlerini kullanabilir. Ancak bu artan bağlantı, veri gizliliği ve güvenliği konusundaki endişeleri de artırıyor."
    },
    {
        id: 'read-int-15',
        title: "The Wonders of the Amazon Rainforest",
        author: "Doğa Gezgini",
        difficulty: "Intermediate",
        engText: "The Amazon Rainforest is often called the 'lungs of the planet' because it produces a significant portion of the Earth's oxygen. It is the world's largest tropical rainforest and is home to an incredible diversity of plants and animals. Many of the medicines we use today were originally discovered in the Amazon. However, deforestation for agriculture and mining is destroying vast areas every year. Protecting the Amazon is not just about saving trees; it is about maintaining the global climate and preserving life-saving biological diversity.",
        trText: "Amazon Yağmur Ormanları, Dünya'nın oksijeninin önemli bir kısmını ürettiği için genellikle 'gezegenin akciğerleri' olarak adlandırılır. Dünyanın en büyük tropikal yağmur ormanıdır ve inanılmaz bir bitki ve hayvan çeşitliliğine ev sahipliği yapar. Bugün kullandığımız ilaçların birçoğu başlangıçta Amazonlarda keşfedilmiştir. Ancak tarım ve madencilik için ormansızlaştırma her yıl geniş alanları yok ediyor. Amazon'u korumak sadece ağaçları kurtarmakla ilgili değildir; küresel iklimi korumak ve hayat kurtaran biyolojik çeşitliliği sürdürmekle ilgilidir."
    },
    {
        id: 'read-int-16',
        title: "The History of the Olympic Games",
        author: "Spor Tarihi",
        difficulty: "Intermediate",
        engText: "The Olympic Games began in ancient Greece nearly 3,000 years ago as a festival to honor Zeus. Athletes from different city-states would compete in sports like running and wrestling. The modern Olympics were revived in 1896 in Athens. Today, thousands of athletes from almost every country participate in the Summer and Winter Games every four years. The games are a symbol of international unity and sportsmanship. Winning an Olympic medal remains the highest achievement for many athletes around the world.",
        trText: "Olimpiyat Oyunları, yaklaşık 3.000 yıl önce antik Yunanistan'da Zeus'u onurlandırmak için bir festival olarak başladı. Farklı şehir devletlerinden sporcular koşu ve güreş gibi sporlarda yarışırlardı. Modern Olimpiyatlar 1896'da Atina'da yeniden canlandırıldı. Bugün, hemen hemen her ülkeden binlerce sporcu her dört yılda bir Yaz ve Kış Oyunlarına katılıyor. Oyunlar uluslararası birliğin ve sportmenliğin sembolüdür. Olimpiyat madalyası kazanmak, dünya çapındaki birçok sporcu için en yüksek başarı olmaya devam ediyor."
    },
    {
        id: 'read-int-17',
        title: "The Future of Space Tourism",
        author: "Gökbilimci",
        difficulty: "Intermediate",
        engText: "For a long time, space travel was only for highly trained astronauts. However, private companies are now working to make space tourism a reality for ordinary people. Soon, wealthy tourists might be able to visit a space station or even fly around the moon. While current tickets are extremely expensive, technology is expected to become cheaper in the future. Space tourism could lead to more scientific research and a better understanding of our place in the universe. Is the final frontier ready for tourists? Only time will tell.",
        trText: "Uzun bir süre boyunca uzay yolculuğu sadece son derece eğitimli astronotlar içindi. Ancak özel şirketler artık uzay turizmini sıradan insanlar için bir gerçeklik haline getirmeye çalışıyor. Yakında zengin turistler bir uzay istasyonunu ziyaret edebilir ve hatta ayın etrafında uçabilir. Mevcut biletler son derece pahalı olsa da, teknolojinin gelecekte daha ucuz hale gelmesi bekleniyor. Uzay turizmi daha fazla bilimsel araştırmaya ve evrendeki yerimizin daha iyi anlaşılmasına yol açabilir. Son sınır turistler için hazır mı? Bunu sadece zaman gösterecek."
    },
    {
        id: 'read-int-18',
        title: "The Discovery of Penicillin",
        author: "Bilim Tarihi",
        difficulty: "Intermediate",
        engText: "In 1928, Alexander Fleming accidentally discovered penicillin, the world's first antibiotic. He noticed that a certain mold was killing bacteria in his lab. This discovery revolutionized medicine, as it allowed doctors to treat infections that were previously fatal. Before penicillin, even a simple wound could lead to death. Fleming's 'accidental' discovery has saved millions of lives over the last century. It reminds us that sometimes, the greatest scientific breakthroughs happen when things don't go exactly as planned.",
        trText: "1928'de Alexander Fleming, dünyanın ilk antibiyotiği olan penisilini kazara keşfetti. Laboratuvarındaki belirli bir küfün bakterileri öldürdüğünü fark etti. Bu keşif, doktorların daha önce ölümcül olan enfeksiyonları tedavi etmesine olanak tanıdığı için tıpta devrim yarattı. Penisilin öncesinde basit bir yara bile ölüme yol açabiliyordu. Fleming'in 'kazara' yaptığı keşif, son yüzyılda milyonlarca hayat kurtardı. Bize bazen en büyük bilimsel atılımların her şey tam olarak planlandığı gibi gitmediğinde gerçekleştiğini hatırlatıyor."
    },
    {
        id: 'read-int-19',
        title: "The Impact of Fast Fashion",
        author: "Modern Yaşam",
        difficulty: "Intermediate",
        engText: "Fast fashion refers to the rapid production of cheap, trendy clothing. While it allows people to buy new styles frequently, it has a significant environmental and social cost. The industry consumes vast amounts of water and often uses toxic chemicals. Furthermore, workers in many clothing factories face poor conditions and low wages. As consumers become more aware of these issues, there is a growing movement toward 'slow fashion'—buying high-quality pieces that last longer. Choosing sustainable clothing is a way to look good while doing good.",
        trText: "Hızlı moda, ucuz ve modaya uygun giysilerin hızlı üretimine atıfta bulunur. İnsanların sık sık yeni stiller almasına izin verse de, önemli bir çevresel ve sosyal maliyeti vardır. Endüstri muazzam miktarda su tüketir ve genellikle toksik kimyasallar kullanır. Dahası, birçok giyim fabrikasındaki işçiler kötü koşullar ve düşük ücretlerle karşı karşıyadır. Tüketiciler bu sorunların daha fazla farkına vardıkça, 'yavaş moda'ya, yani daha uzun süre dayanan yüksek kaliteli parçalar almaya yönelik büyüyen bir hareket var. Sürdürülebilir giysiler seçmek, iyi görünürken iyi şeyler yapmanın bir yoludur."
    },
    {
        id: 'read-int-20',
        title: "The Importance of Bee Conservation",
        author: "Doğa Günlüğü",
        difficulty: "Intermediate",
        engText: "Bees play a crucial role in our environment as pollinators. They are responsible for pollinating many of the crops we eat every day, including fruits, vegetables, and nuts. Without bees, our food supply would be in serious trouble. Unfortunately, bee populations are declining due to habitat loss and pesticide use. Gardens with native flowers and chemical-free environments can help support local bee populations. Protecting bees is essential for maintaining biodiversity and ensuring that our dinner tables remain full of healthy, natural food.",
        trText: "Arılar tozlaştırıvı olarak çevremizde çok önemli bir rol oynarlar. Meyveler, sebzeler ve kuruyemişler de dahil olmak üzere her gün yediğimiz mahsullerin çoğunun tozlaşmasından sorumludurlar. Arılar olmadan gıda arzımız ciddi tehlikeye girerdi. Ne yazık ki yaşam alanı kaybı ve pestisit kullanımı nedeniyle arı popülasyonları azalıyor. Yerli çiçeklerin olduğu bahçeler ve kimyasaldan arınmış ortamlar yerel arı popülasyonlarını desteklemeye yardımcı olabilir. Arıları korumak, biyolojik çeşitliliği sürdürmek ve yemek masalarımızın sağlıklı, doğal gıdalarla dolu kalmasını sağlamak için çok önemlidir."
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
        trText: "Yapay zekanın hızlı evrimi, insan toplumu manzarasını kökten değiştiriyor. Sağlık ve ulaşımdan eğitim ve yaratıcı sanatlara kadar hiçbir sektör bu teknolojik gelişmelerden nasibini almamış değil. Ancak yapay zekayı günlük hayatımıza daha derinlemesine entrege ederken, gizlilik, özerklik ve işin geleceği ile ilgili karmaşık etik sorularla da yüzleşmek zorundayız. Yapay zekanın insan yeteneklerini artırma potansiyeli muazzamdır ve bir zamanlar aşılamaz olduğu düşünülen sorunları çözmemize olanak tanır. Ancak bu güç, teknolojinin mevcut eşitsizlikleri derinleştirmek yerine kolektif faydaya hizmet etmesini sağlama sorumluluğuyla birlikte gelir. Bazı uzmanlar, yapay zekanın insan zekasını geride bırakacağı bir nokta olan teknolojik tekilliğin eşiğinde olduğumuzu savunuyor. Bu olasılık hem heyecan verici hem de korkutucu olsa da, odağımız makine hedefleri ile insani değerler arasında bir hizalanma yaratmak üzerinde kalmalıdır. Dijital mantık okuryazarlığı geleneksel okuma yazma kadar temel hale geldikçe, eğitim bu geçişte kritik bir rol oynayacaktır. Herkes için daha müreffeh ve adil bir dünya yaratmak için her ikisinin de güçlü yanlarından yararlanarak, insanlar ve makineler arasındaki işbirliğinin norm olduğu bir geleceğe hazırlanmalıyız. Bu sadece teknik yeterlilik değil, aynı zamanda giderek otomatikleşen bir dünyada insan olmanın ne anlama geldiğine dair derin bir anlayış gerektirir. Bizi benzersiz kılan nitelikleri -empati, yaratıcılık ve ahlaki yargı- korurken, yapay zekanın sunduğu verimliliği ve analitik gücü benimsemeliyiz. İnsan sezgisi ile robotik hassasiyetin sentezi, benzeri uygulaması görülmemiş bir ilerleme ve keşif çağına yol açabilir."
    },
    {
        id: 'read-adv-01',
        title: "The Existential Risks of Biotechnology",
        author: "Bilim ve Etik",
        difficulty: "Advanced",
        engText: "While biotechnology promises to eradicate diseases and enhance human longevity, it simultaneously introduces unprecedented existential risks. The democratization of gene-editing tools like CRISPR means that the ability to engineer pathogens is no longer confined to state-sponsored laboratories. A single malevolent actor or an accidental laboratory leak could trigger a global pandemic far more lethal than any naturally occurring virus. Furthermore, the prospect of germline editing raises profound questions about the essence of human nature and the potential for a new era of eugenics. As we stand at this biological crossroads, the necessity for robust international frameworks and ethical oversight cannot be overstated. We must balance the drive for innovation with a cautionary principle that prioritizes the long-term survival of the species over short-term medical gains.",
        trText: "Biyoteknoloji hastalıkları yok etme ve insan ömrünü uzatma vaadinde bulunurken, aynı zamanda eşi benzeri görülmemiş varoluşsal riskleri de beraberinde getiriyor. CRISPR gibi gen düzenleme araçlarının demokratikleşmesi, patojenleri mühendislik yoluyla tasarlama yeteneğinin artık devlet destekli laboratuvarlarla sınırlı olmadığı anlamına geliyor. Tek bir kötü niyetli aktör veya kazara bir laboratuvar sızıntısı, doğal olarak oluşan herhangi bir virüsten çok daha öldürücü küresel bir pandemiyi tetikleyebilir. Dahası, eşey hücre dizisi düzenleme beklentisi, insan doğasının özü ve yeni bir öjeni çağı potansiyeli hakkında derin sorular uyandırıyor. Bu biyolojik dönüm noktasında dururken, sağlam uluslararası çerçevelere ve etik denetime olan ihtiyaç ne kadar vurgulansa azdır. İnovasyon dürtüsünü, kısa vadeli tıbbi kazanımlar yerine türün uzun vadeli hayatta kalmasına öncelik veren ihtiyatlı bir ilke ile dengelemeliyiz."
    },
    {
        id: 'read-adv-02',
        title: "The Architecture of Consciousness",
        author: "Nöro-Felsefe",
        difficulty: "Advanced",
        engText: "Consciousness remains the most elusive frontier in both neuroscience and philosophy. The 'hard problem'—how subjective experience arises from physical processes in the brain—continues to defy a purely reductionist explanation. Some scholars propose integrated information theory, suggesting that consciousness is a fundamental property of complex systems. Others argue for a quantum basis of cognition, postulating that microtubules within neurons facilitate non-computable processes. Regardless of the underlying mechanism, the implications of understanding consciousness are profound accurately, potentially redefining our concepts of legal responsibility, animal rights, and the possibility of silicon-based sentience.",
        trText: "Bilinç, hem sinirbilimde hem de felsefede en gizemli sınır olmaya devam ediyor. 'Zor problem' -öznel deneyimin beyindeki fiziksel süreçlerden nasıl ortaya çıktığı- tamamen indirgemeci bir açıklamaya meydan okumaya devam ediyor. Bazı akademisyenler, bilincin karmaşık sistemlerin temel bir özelliği olduğunu öne süren bütünleşik bilgi teorisini teklif ediyor. Diğerleri ise nöronlar içindeki mikrotübüllerin hesaplanamaz süreçleri kolaylaştırdığını varsayarak bilişin kuantum temelli olduğunu savunuyor. Altta yatan mekanizma ne olursa olsun, bilinci doğru bir şekilde anlamanın sonuçları derindir; yasal sorumluluk, hayvan hakları ve silikon tabanlı duyarlılık olasılığı kavramlarımızı potansiyel olarak yeniden tanımlayabilir."
    },
    {
        id: 'read-adv-03',
        title: "The Geopolitics of Quantum Computing",
        author: "Stratejik Analiz",
        difficulty: "Advanced",
        engText: "The race for quantum supremacy is not merely a scientific endeavor but a high-stakes geopolitical struggle. Quantum computers, capable of performing calculations at speeds orders of magnitude faster than current supercomputers, threaten to render existing cryptographic standards obsolete. The nation that first masters this technology will possess the ability to decrypt state secrets, financial records, and secure communications, potentially shifting the global balance of power overnight. Consequently, massive investments are being funneled into quantum research, accompanied by stringent export controls and intellectual property protections. The 'Quantum Cold War' reflects a broader trend where technological dominance is inextricably linked to national security and economic sovereignty.",
        trText: "Kuantum üstünlüğü yarışı sadece bilimsel bir çaba değil, aynı zamanda yüksek riskli bir jeopolitik mücadeledir. Mevcut süper bilgisayarlardan kat kat daha hızlı hesaplamalar yapabilen kuantum bilgisayarlar, mevcut kriptografik standartları geçersiz kılma tehdidini taşımaktadır. Bu teknolojide ilk uzmanlaşan ulus, devlet sırlarını, finansal kayıtları ve güvenli iletişimleri çözme yeteneğine sahip olacak ve potansiyel olarak küresel güç dengesini bir gecede değiştirecektir. Sonuç olarak, kuantum araştırmalarına büyük yatırımlar kanalize edilmekte, buna katı ihracat kontrolleri ve fikri mülkiyet korumaları eşlik etmektedir. 'Kuantum Soğuk Savaşı', teknolojik hakimiyetin ulusal güvenlik ve ekonomik egemenlikle ayrılmaz bir şekilde bağlantılı olduğu daha geniş bir eğilimi yansıtmaktadır."
    },
    {
        id: 'read-adv-04',
        title: "The Paradox of Choice in Late Capitalism",
        author: "Sosyolojik Perspektif",
        difficulty: "Advanced",
        engText: "In our contemporary hyper-consumerist society, we are presented with an unprecedented array of choices in every aspect of our lives. While this is often framed as a triumph of individual liberty, psychological research suggests it frequently leads to 'decision paralysis' and profound dissatisfaction. The constant pressure to optimize every choice—from the mundane to the life-altering—creates a pervasive sense of anxiety that we might be missing out on a superior alternative. This phenomenon is exacerbated by social media, which provides a constant stream of idealized lifestyles for comparison. Ultimately, the abundance of choice may not be liberating but rather a sophisticated form of psychological burden that erodes our sense of contentment.",
        trText: "Gündelik hayatımızın her alanında eşi benzeri görülmemiş bir seçenek yelpazesiyle karşı karşıya kaldığımız günümüz hiper-tüketim toplumunda, bu durum genellikle bireysel özgürlüğün bir zaferi olarak sunulsa da, psikolojik araştırmalar bunun sıklıkla 'karar felci' ve derin bir memnuniyetsizliğe yol açtığını göstermektedir. Sıradan olanlardan hayat değiştireceklere kadar her seçimi optimize etme konusundaki sürekli baskı, daha üstün bir alternatifi kaçırıyor olabileceğimize dair yaygın bir kaygı duygusu yaratır. Bu fenomen, karşılaştırma için sürekli idealize edilmiş yaşam tarzları sunan sosyal medya tarafından daha da kötüleştirilmektedir. Sonuç olarak, seçenek bolluğu özgürleştirici değil, aksine memnuniyet duygumuzu aşındıran sofistike bir psikolojik yük biçimi olabilir."
    },
    {
        id: 'read-adv-05',
        title: "The Thermodynamics of Life",
        author: "Biyofizik",
        difficulty: "Advanced",
        engText: "Life is a remarkable phenomenon that appears to defy the second law of thermodynamics, which states that entropy, or disorder, in a closed system always increases. Organisms maintain a highly ordered state by constantly consuming energy from their environment and exporting entropy in the form of heat. This process, known as metabolism, allows life to persist as localized pockets of complexity in a universe tending toward cold uniformity. Understanding the physical principles that allow for the emergence of such self-sustaining systems is crucial for our search for extraterrestrial life and our efforts to create synthetic biological entities that mimic the resilience of natural organisms.",
        trText: "Yaşam, kapalı bir sistemdeki entropinin veya düzensizliğin her zaman arttığını belirten termodinamiğin ikinci yasasına meydan okuyor gibi görünen dikkate değer bir fenomendir. Organizmalar, çevrelerinden sürekli enerji tüketerek ve ısı şeklinde entropi dışarı atarak yüksek düzeyde düzenli bir durumu korurlar. Metabolizma olarak bilinen bu süreç, yaşamın, soğuk tekdüzeliğe yönelen bir evrende yerelleşmiş karmaşıklık cepleri olarak varlığını sürdürmesine olanak tanır. Bu tür kendi kendini idame ettiren sistemlerin ortaya çıkmasına izin veren fiziksel ilkeleri anlamak, dünya dışı yaşam arayışımız ve doğal organizmaların dayanıklılığını taklit eden sentetik biyolojik varlıklar yaratma çabalarımız için kritik öneme sahiptir."
    },
    {
        id: 'read-adv-06',
        title: "The Epistemology of Deepfakes",
        author: "Medya Eleştirisi",
        difficulty: "Advanced",
        engText: "The advent of generative adversarial networks has ushered in an era where audiovisual evidence can be manipulated with alarming precision. Deepfakes threaten to undermine the very foundations of our shared reality, as the distinction between authentic and fabricated content becomes increasingly indiscernible to the naked eye. This technological capability poses a dual threat: first, the potential to spread misinformation and manipulate public opinion; and second, the 'liar’s dividend,' where actual evidence of wrongdoing can be dismissed as a fake. Navigating this post-truth landscape requires a radical shift in our approach to information literacy, prioritizing verification protocols over intuitive belief.",
        trText: "Üretken çekişmeli ağların gelişi, görsel-işitsel kanıtların endişe verici bir hassasiyetle manipüle edilebildiği bir çağı başlattı. Deepfake'ler, özgün ve uydurma içerik arasındaki ayrım çıplak gözle giderek daha ayırt edilemez hale geldikçe, paylaşılan gerçekliğimizin temellerini sarsma tehdidi taşıyor. Bu teknolojik yetenek ikili bir tehdit oluşturuyor: İlki, dezenformasyon yayma ve kamuoyunu manipüle etme potansiyeli; ikincisi ise, gerçek bir yanlış yapma kanıtının sahte olduğu söylenerek reddedilebildiği 'yalancının temettüsü'. Bu hakikat sonrası manzarada yol almak, sezgisel inanç yerine doğrulama protokollerine öncelik veren bilgi okuryazarlığı yaklaşımımızda radikal bir değişim gerektiriyor."
    },
    {
        id: 'read-adv-07',
        title: "The Neuroplasticity of Bilingualism",
        author: "Kognitif Bilim",
        difficulty: "Advanced",
        engText: "Long-term bilingualism induces structural and functional changes in the brain that extend far beyond simple language processing areas. The constant necessity to manage two competing linguistic systems enhances executive functions, such as inhibitory control and task-switching, mediated by the prefrontal cortex. Furthermore, bilingual individuals exhibit increased gray matter density in the inferior parietal lobule and enhanced white matter integrity. These neuroplastic adaptations have been linked to a significant delay in the onset of neurodegenerative symptoms, such as those associated with Alzheimer's disease, suggesting that linguistic diversity serves as a form of cognitive reserve that buffers the brain against age-related decline.",
        trText: "Uzun süreli iki dillilik, beyinde basit dil işleme alanlarının çok ötesine geçen yapısal ve işlevsel değişikliklere neden olur. İki rakip dil sistemini yönetme konusundaki sürekli gereklilik, prefrontal korteks tarafından yönetilen engelleyici kontrol ve görev değiştirme gibi yürütücü işlevleri geliştirir. Dahası, iki dilli bireyler alt paryetal lobda artan gri madde yoğunluğu ve gelişmiş beyaz madde bütünlüğü sergilerler. Bu nöroplastik adaptasyonlar, Alzheimer hastalığı ile ilişkili olanlar gibi nörodejeneratif semptomların başlamasında önemli bir gecikme ile ilişkilendirilmiştir; bu da dilsel çeşitliliğin, beyni yaşa bağlı gerilemeye karşı koruyan bir bilişsel rezerv biçimi olarak hizmet ettiğini göstermektedir."
    },
    {
        id: 'read-adv-08',
        title: "The Ethics of Space Colonization",
        author: "Uygulamalı Etik",
        difficulty: "Advanced",
        engText: "As humanity contemplates permanent settlements on Mars and beyond, we must address the ethical dimensions of planetary protection and resource extraction. Do we have a moral obligation to preserve the pristine environments of other celestial bodies, or is it our destiny to utilize these resources for the survival of terrestrial life? Furthermore, the social structure of space colonies raises questions about governance, justice, and the rights of future generations born off-Earth. If we export our existing socioeconomic inequalities into the cosmos, we risk repeating the mistakes of our colonial past on an interplanetary scale. A truly enlightened approach to space exploration requires a foundational commitment to egalitarianism and environmental stewardship.",
        trText: "İnsanlık Mars'ta ve ötesinde kalıcı yerleşimler kurmayı tasarlarken, gezegen koruması ve kaynak çıkarımının etik boyutlarını ele almalıyız. Diğer gök cisimlerinin bozulmamış ortamlarını korumakla ilgili ahlaki bir yükümlülüğümüz mü var, yoksa bu kaynakları dünya hayatının devamı için kullanmak bizim kaderimiz mi? Dahası, uzay kolonilerinin sosyal yapısı; yönetim, adalet ve Dünya dışında doğan gelecek nesillerin hakları hakkında sorular uyandırıyor. Mevcut sosyoekonomik eşitsizliklerimizi kozmosa ihraç edersek, sömürgeci geçmişimizin hatalarını gezegenler arası ölçekte tekrarlama riskiyle karşı karşıya kalırız. Uzay keşfine gerçekten aydınlanmış bir yaklaşım, eşitlikçilik ve çevre korumacılığına temel bir bağlılık gerektirir."
    },
    {
        id: 'read-adv-09',
        title: "The Semantics of Silence",
        author: "Felsefi Dilbilim",
        difficulty: "Advanced",
        engText: "Silence is frequently misinterpreted as a mere absence of communication, yet in a linguistic and social context, it functions as a potent communicative act. The meaning of silence is radically contingent upon the cultural norms and shared expectations of the interlocutors. In some traditions, silence signifies profound respect or spiritual contemplation, while in others, it may serve as an instrument of social exclusion or a marker of power dynamics. Analyzing the 'grammar' of silence reveals the subtle ways in which unstated meanings shape human interaction. To truly understand a conversation, one must become attuned to what is left unsaid, acknowledging that the pauses between words are often as significant as the words themselves.",
        trText: "Sessizlik sıklıkla sadece bir iletişim eksikliği olarak yanlış yorumlanır, oysa dilsel ve sosyal bir bağlamda güçlü bir iletişimsel eylem olarak işlev görür. Sessizliğin anlamı, radikal bir şekilde kültürel normlara ve muhatapların paylaşılan beklentilerine bağlıdır. Bazı geleneklerde sessizlik derin bir saygıyı veya ruhsal derinliği ifade ederken, diğerlerinde sosyal dışlanma enstrümanı veya güç dinamiklerinin bir göstergesi olarak hizmet edebilir. Sessizliğin 'dilbilgisini' analiz etmek, ifade edilmemiş anlamların insan etkileşimini şekillendirdiği ince yolları ortaya çıkarır. Bir konuşmayı gerçekten anlamak için kişi söylenmemiş olana uyum sağlamalı, kelimeler arasındaki boşlukların genellikle kelimelerin kendisi kadar önemli olduğunu kabul etmelidir."
    },
    {
        id: 'read-adv-10',
        title: "The Algorithmic Self",
        author: "Dijital Antropoloji",
        difficulty: "Advanced",
        engText: "The integration of predictive algorithms into our digital infrastructure has fundamentally altered the process of identity formation. As platforms curate our feeds and recommend content based on past behavior, we are increasingly confined within 'algorithmic echo chambers' that reinforce our existing beliefs and preferences. This narrowing of experience limits our exposure to serendipity and diverse perspectives, potentially stunting our personal and intellectual growth. The self, once seen as an autonomous project, is now co-constructed by opaque mathematical models that prioritize engagement over enlightenment. Reclaiming our agency in the digital age requires a conscious effort to resist algorithmic tribalism and seek out meaningful friction in our online experiences.",
        trText: "Tahmin algoritmalarının dijital altyapımıza entegrasyonu, kimlik oluşum sürecini temelden değiştirdi. Platformlar akışlarımızı düzenledikçe ve geçmiş davranışlara dayalı içerik önerdikçe, mevcut inançlarımızı ve tercihlerimizi pekiştiren 'algoritmik yankı odaları' içine giderek daha fazla hapsoluyoruz. Deneyimin bu şekilde daralması, tesadüflere ve farklı bakış açılarına maruz kalmamızı sınırlayarak potansiyel olarak kişisel ve entelektüel gelişimimizi durdurur. Bir zamanlar özerk bir proje olarak görülen benlik, artık aydınlanmadan ziyade etkileşimi önceleyen opak matematiksel modeller tarafından birlikte inşa ediliyor. Dijital çağda irademizi geri kazanmak, algoritmik kabileciliğe direnmek ve çevrimiçi deneyimlerimizde anlamlı zorluklar aramak için bilinçli bir çaba gerektirir."
    },
    {
        id: 'read-adv-11',
        title: "The Sociology of Urban Solitude",
        author: "Kentsel Çalışmalar",
        difficulty: "Advanced",
        engText: "Urban environments, despite their high population density, frequently foster a unique form of social isolation characterized by the 'lonely crowd' phenomenon. The transient nature of city life and the fragmentation of traditional community structures can lead to a sense of profound alienation among inhabitants. However, urban solitude is not inherently pathological; it also provides a space for anonymity and individual expression free from the surveillance of small-town norms. The challenge for modern urban planning is to create 'third places'—communal spaces that facilitate organic interaction without imposing rigid social expectations. Balancing the need for privacy with the human necessity for belonging is essential for the psychological health of our growing megacities.",
        trText: "Kentsel ortamlar, yüksek nüfus yoğunluklarına rağmen sıklıkla 'yalnız kalabalık' fenomeni ile karakterize edilen benzersiz bir sosyal izolasyon biçimi geliştirirler. Şehir hayatının geçici doğası ve geleneksel topluluk yapılarının parçalanması, sakinler arasında derin bir yabancılaşma duygusuna yol açabilir. Ancak kentsel yalnızlık doğası gereği patolojik değildir; aynı zamanda anonimlik ve kasaba normlarının gözetiminden uzak bireysel ifade için bir alan sağlar. Modern şehir planlaması için zorluk, katı sosyal beklentiler dayatmadan organik etkileşimi kolaylaştıran toplumsal alanlar olan 'üçüncü yerler' yaratmaktır. Mahremiyet ihtiyacı ile insanların aidiyet gereksinimi arasındaki dengeyi kurmak, büyüyen mega şehirlerimizin psikolojik sağlığı için temeldir."
    },
    {
        id: 'read-adv-12',
        title: "The Evolutionary Roots of Altruism",
        author: "Biyolojik Teori",
        difficulty: "Advanced",
        engText: "Altruism, the act of aiding others at a cost to oneself, has long puzzled evolutionary biologists operating under the 'survival of the fittest' paradigm. However, theories such as kin selection and reciprocal altruism provide a robust mathematical basis for how self-sacrificing behaviors can flourish. Kin selection suggests that individuals promote the survival of their own genes by assisting relatives, while reciprocal altruism posits that cooperation emerges when individuals anticipate future benefits from their peers. These biological foundations suggest that our capacity for empathy and collaboration is not a cultural veneer but a deeply ingrained survival strategy that has allowed the human species to dominate various ecological niches through collective effort.",
        trText: "Kendine bir maliyet yükleyerek başkalarına yardım etme eylemi olan özgecilik (altruizm), 'en güçlünün hayatta kalması' paradigması altında çalışan evrimsel biyologların uzun süredir kafasını karıştırmaktadır. Ancak akraba seçilimi ve karşılıklı özgecilik gibi teoriler, özverili davranışların nasıl gelişebileceğine dair sağlam bir matematiksel temel sunar. Akraba seçilimi, bireylerin akrabalarına yardım ederek kendi genlerinin hayatta kalmasını teşvik ettiğini öne sürerken; karşılıklı özgecilik, bireylerin akranlarından gelecekte fayda bekledikleri zaman işbirliğinin ortaya çıktığını varsayar. Bu biyolojik temeller, empati ve işbirliği kapasitemizin kültürel bir cila değil, insan türünün kolektif çaba yoluyla çeşitli ekolojik nişlere hakim olmasını sağlayan derinlere yerleşmiş bir hayatta kalma stratejisi olduğunu göstermektedir."
    },
    {
        id: 'read-adv-13',
        title: "The Philosophy of Artistic Forgery",
        author: "Estetik Kuramı",
        difficulty: "Advanced",
        engText: "Does the aesthetic value of a painting diminish if it is revealed to be a perfect forgery rather than an original masterwork? This question challenges our assumptions about the relationship between artistic merit and historical authenticity. If a forgery is visually indistinguishable from an original, its formal qualities remain identical, yet our appreciation often evaporates upon the revelation of its true origin. This suggests that our evaluation of art is inextricably linked to the 'aura' of the creator and the narrative of genius. However, some argue that if a forger can replicate the technique and vision of a master, they possess a unique form of artistic prowess that deserves its own recognition. Defining art thus becomes as much about the context of production as the visual stimulus itself.",
        trText: "Bir tablonun estetik değeri, orijinal bir başyapıt yerine mükemmel bir sahtecilik olduğu ortaya çıkarsa azalır mı? Bu soru, sanatsal değer ile tarihsel özgünlük arasındaki ilişkiye dair varsayımlarımıza meydan okur. Eğer bir sahtecilik orijinalinden görsel olarak ayırt edilemiyorsa biçimsel nitelikleri aynı kalır, ancak gerçek kökeninin açıklanmasıyla takdirimiz genellikle buharlaşır. Bu durum, sanatı değerlendirmemizin yaratıcının 'aurası' ve deha anlatısıyla ayrılmaz bir şekilde bağlantılı olduğunu göstermektedir. Ancak bazıları, bir taklitçi bir ustanın tekniğini ve vizyonunu kopyalayabiliyorsa, kendi takdirini hak eden benzersiz bir sanatsal yeteneğe sahip olduğunu savunmaktadır. Sanatı tanımlamak, görsel uyaranın kendisi kadar üretim bağlamıyla da ilgili hale gelir."
    },
    {
        id: 'read-adv-14',
        title: "The Linguistic Relativity of Time",
        author: "Bilişsel Dilbilim",
        difficulty: "Advanced",
        engText: "The Sapir-Whorf hypothesis proposes that the structure of a language influences its speakers' conceptualization of the world, with time being a primary example. Some languages conceptualize time horizontally, while others perceive it as a vertical or even stationary container. For instance, speakers of languages that lack future-tense markers often exhibit higher rates of long-term saving behavior, as the absence of a linguistic divide between 'now' and 'then' makes future consequences feel more immediate. These findings suggest that our very experience of temporal flow is not a universal constant but is partially constructed by the cognitive tools provided by our native tongue, highlighting the profound role of language in shaping our mental reality.",
        trText: "Sapir-Whorf hipotezi, bir dilin yapısının konuşmacılarının dünyayı kavramsallaştırmasını etkilediğini ve zamanın bunun başlıca örneği olduğunu öne sürer. Bazı diller zamanı yatay olarak kavramsallaştırırken, diğerleri onu dikey veya hatta sabit bir kap olarak algılar. Örneğin, gelecek zaman ekleri olmayan dilleri konuşanlar, 'şimdi' ve 'o zaman' arasındaki dilsel ayrımın olmaması gelecek sonuçları daha yakın hissettirdiği için sıklıkla daha yüksek oranlarda uzun vadeli tasarruf davranışı sergilerler. Bu bulgular, zamansal akış deneyimimizin evrensel bir sabit olmadığını, ana dilimizin sağladığı bilişsel araçlar tarafından kısmen inşa edildiğini göstererek dilin zihinsel gerçekliğimizi şekillendirmedeki derin rolünü vurgulamaktadır."
    },
    {
        id: 'read-adv-15',
        title: "The Ethics of Life Extension",
        author: "Biyoetik",
        difficulty: "Advanced",
        engText: "Technological advancements that promise to radically extend human lifespan raise profound questions about social equity and the meaning of a 'natural' life. If immortality or extreme longevity becomes a commodity available only to the wealthy, we risk creating a biological caste system that fundamental transforms the nature of human inequality. Furthermore, if the cycle of birth and death is disrupted, we must consider the impact on population growth, resource management, and the potential for generational stagnation. Is the finitude of life what gives it urgency and value, or is the drive to transcend biological limits the ultimate expression of human potential? Balancing the desire for more time with the collective needs of a finite planet is one of the most significant challenges of the 21st century.",
        trText: "İnsan ömrünü radikal bir şekilde uzatmayı vaat eden teknolojik gelişmeler, sosyal eşitlik ve 'doğal' bir yaşamın anlamı hakkında derin soruları gündeme getiriyor. Eğer ölümsüzlük veya aşırı uzun ömür sadece zenginlerin erişebileceği bir meta haline gelirse, insan eşitsizliğinin doğasını temelden değiştiren biyolojik bir kast sistemi yaratma riskiyle karşı karşıya kalırız. Dahası, doğum ve ölüm döngüsü bozulursa nüfus artışı, kaynak yönetimi ve nesiller arası durağanlık potansiyeli üzerindeki etkisini düşünmeliyiz. Yaşamın sonluluğu mu ona aciliyet ve değer katıyor, yoksa biyolojik sınırları aşma dürtüsü insan potansiyelinin en üst düzey ifadesi mi? Daha fazla zaman arzusunu sonlu bir gezegenin kolektif ihtiyaçlarıyla dengelemek, 21. yüzyılın en önemli zorluklarından biridir."
    },
    {
        id: 'read-adv-16',
        title: "The Crisis of Trust in the Digital Age",
        author: "Sosyal Teori",
        difficulty: "Advanced",
        engText: "Trust is the fundamental glue that holds complex societies together, yet in our digital age, this social contract is under severe strain. The fragmentation of media, the rise of anonymous online harassment, and the erosion of expert authority have created an environment of pervasive skepticism. When we can no longer agree on a shared set of facts, democratic discourse becomes increasingly impossible, replaced by tribal vitriol and conspiracy theories. Restoring trust requires not just technological solutions like blockchain for verification, but a fundamental recommitment to transparency, accountability, and the cultivation of empathy across ideological divides. Without a foundation of mutual trust, the collective action necessary to address global challenges becomes unattainable.",
        trText: "Güven, karmaşık toplumları bir arada tutan temel yapıştırıcıdır, ancak dijital çağımızda bu toplumsal sözleşme ciddi bir baskı altındadır. Medyanın parçalanması, anonim çevrimiçi tacizlerin artışı ve uzman otoritesinin aşınması, yaygın bir şüphecilik ortamı yarattı. Artık ortak bir gerçekler kümesi üzerinde anlaşamadığımızda, demokratik söylem giderek imkansız hale gelir; yerini kabile nefreti ve komplo teorileri alır. Güveni yeniden tesis etmek sadece doğrulama için blok zinciri gibi teknolojik çözümler değil, şeffaflığa, hesap verebilirliğe ve ideolojik ayrımlar arasında empati geliştirilmesine temel bir yeniden bağlılık gerektirir. Karşılıklı güven temeli olmadan, küresel zorlukları ele almak için gerekli olan kolektif eylem ulaşılmaz hale gelir."
    },
    {
        id: 'read-adv-17',
        title: "The Epigenetics of Trauma",
        author: "Biyolojik Psikoloji",
        difficulty: "Advanced",
        engText: "Emerging research in epigenetics suggest that the effects of extreme trauma can be transmitted across generations through chemical modifications to DNA that alter gene expression without changing the genetic code itself. This transgenerational inheritance of stress responses means that the experiences of our ancestors can influence our own susceptibility to anxiety and depression. Understanding the biological mechanisms of inherited trauma provides a new lens through which to view social justice and the long-term impacts of historical oppression. It also offers hope for interventions that can 'reset' these epigenetic markers, potentially breaking the cycle of suffering and fostering resilience in future generations.",
        trText: "Epigenetik alanında yeni ortaya çıkan araştırmalar, aşırı travmanın etkilerinin, genetik kodun kendisini değiştirmeden gen ifadesini değiştiren DNA üzerindeki kimyasal modifikasyonlar yoluyla nesiller boyu aktarılabileceğini göstermektedir. Stres tepkilerinin bu nesiller arası mirası, atalarımızın deneyimlerinin bizim kaygı ve depresyona olan duyarlılığımızı etkileyebileceği anlamına gelir. Kalıtsal travmanın biyolojik mekanizmalarını anlamak, sosyal adalete ve tarihsel baskının uzun vadeli etkilerine bakmak için yeni bir pencere sunar. Ayrıca, bu epigenetik işaretleri 'sıfırlayabilen' müdahaleler için umut vaat ederek, gelecekteki nesillerde acı çekme döngüsünü kırma ve dayanıklılık geliştirme potansiyeli taşır."
    },
];
