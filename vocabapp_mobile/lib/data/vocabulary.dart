class WordForms {
  final String form;
  final String pos;
  final String posTr;

  WordForms({required this.form, required this.pos, required this.posTr});
}

class WordDetails {
  final String? root;
  final String? prefix;
  final String? suffix;
  final List<String> synonyms;
  final List<String> antonyms;
  final List<String> moreExamples;
  final String? miniCase; // For Phrasal Verbs
  final String? trMiniCase; // For Phrasal Verbs
  final String? mnemonic; // Memory technique
  final String? trMnemonic; // Memory technique

  WordDetails({
    this.root,
    this.prefix,
    this.suffix,
    this.synonyms = const [],
    this.antonyms = const [],
    this.moreExamples = const [],
    this.miniCase,
    this.trMiniCase,
    this.mnemonic,
    this.trMnemonic,
  });
}

class SM2Data {
  int interval;
  int repetition;
  double efactor;
  int totalReviews;
  int correctReviews;
  int? nextDate;
  int lastQualityScore;

  SM2Data({
    this.interval = 0,
    this.repetition = 0,
    this.efactor = 2.5,
    this.totalReviews = 0,
    this.correctReviews = 0,
    this.nextDate,
    this.lastQualityScore = 0,
  });
}

enum WordMode { vocabulary, phrasalVerb }

class Word {
  final String id;
  final String text;
  final String trWord;
  final String phonetic;
  final String pos;
  final String posTr;
  final String engDef;
  final String trDef;
  final String engExample;
  final String trExample;
  final List<WordForms> wordForms;
  final WordDetails? details;
  final WordMode mode;
  bool isSaved;
  SM2Data sm2;
  String? folder; // Folder field for Vault
  bool isCreatedByUser;

  Word({
    required this.id,
    required this.text,
    required this.trWord,
    required this.phonetic,
    required this.pos,
    required this.posTr,
    required this.engDef,
    required this.trDef,
    required this.engExample,
    required this.trExample,
    this.wordForms = const [],
    this.details,
    this.mode = WordMode.vocabulary,
    this.isSaved = false,
    required this.sm2,
    this.folder,
    this.isCreatedByUser = false,
  });
}

final List<Word> initialVocabulary = [
  Word(
    id: '1',
    text: 'Resilience',
    trWord: 'Dayanıklılık',
    phonetic: '/rɪˈzɪliəns/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The capacity to recover quickly from difficulties; toughness.',
    trDef: 'Zorluklardan çabuk kurtulma kapasitesi; dayanıklılık.',
    engExample: 'His resilience helped him overcome the crisis.',
    trExample: 'Dayanıklılığı krizi atlatmasına yardımcı oldu.',
    wordForms: [
      WordForms(form: "Resilient", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Resiliently", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin resilire (to rebound, recoil).",
      prefix: "re- (back, again)",
      suffix: "-ence (state or quality)",
      synonyms: ["toughness", "flexibility", "endurance"],
      antonyms: ["vulnerability", "weakness", "fragility"],
      mnemonic: "Re-silience: Sounds like 'Re-silent'. After a storm, you are quiet but strong again.",
      trMnemonic: "Re-silience: 'Re' (tekrar) + 'Silence' (sessizlik). Fırtınadan sonra tekrar sessiz ve güçlü bir şekilde ayağa kalkmak.",
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '2',
    text: 'Compassion',
    trWord: 'Şefkat',
    phonetic: '/kəmˈpæʃ.ən/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'Sympathetic pity and concern for the sufferings or misfortunes of others.',
    trDef: 'Başkalarının acılarına veya talihsizliklerine duyulan şefkat ve merhamet.',
    engExample: 'She showed great compassion for the poor.',
    trExample: 'Yoksullara büyük şefkat gösterdi.',
    wordForms: [
      WordForms(form: "Compassionate", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Compassionately", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin compati (to suffer with).",
      prefix: "com- (together with)",
      suffix: "-ion (action, condition)",
      synonyms: ["empathy", "sympathy", "kindness"],
      antonyms: ["cruelty", "indifference", "apathy"],
      mnemonic: "Compassion: Come + Passion. Feeling someone's passion/pain with them.",
      trMnemonic: "Compassion: 'Com' (beraber) + 'Passion' (tutku/acı). Başkasının acısını beraber hissetmek.",
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '3',
    text: 'Diligent',
    trWord: 'Çalışkan',
    phonetic: '/ˈdɪl.ɪ.dʒənt/',
    pos: 'adjective',
    posTr: 'sıfat',
    engDef: 'Having or showing care and conscientiousness in one\'s work or duties.',
    trDef: 'İşinde veya görevlerinde özen ve vicdanlılık gösteren; çalışkan.',
    engExample: 'He was a diligent student who always finished his homework.',
    trExample: 'Her zaman ödevlerini bitiren çalışkan bir öğrenciydi.',
    wordForms: [
      WordForms(form: "Diligence", pos: "noun", posTr: "isim"),
      WordForms(form: "Diligently", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin diligere (to value highly, love, choose).",
      prefix: "di- (apart)",
      suffix: "-ent (performing an action)",
      synonyms: ["hardworking", "industrious", "meticulous"],
      antonyms: ["lazy", "careless", "negligent"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '4',
    text: 'Implement',
    trWord: 'Uygulamak',
    phonetic: '/ˈɪm.plɪ.ment/',
    pos: 'verb',
    posTr: 'fiil',
    engDef: 'Put a decision, plan, agreement, etc. into effect.',
    trDef: 'Bir kararı, planı, anlaşmayı vb. yürürlüğe koymak; uygulamak.',
    engExample: 'The government decided to implement new traffic rules.',
    trExample: 'Hükümet yeni trafik kurallarını uygulamaya karar verdi.',
    wordForms: [
      WordForms(form: "Implementation", pos: "noun", posTr: "isim"),
      WordForms(form: "Implementer", pos: "noun", posTr: "isim"),
    ],
    details: WordDetails(
      root: "From Latin implere (to fill up, complete).",
      prefix: "im- (in, upon)",
      suffix: "-ment (result or product of an action)",
      synonyms: ["execute", "apply", "enforce"],
      antonyms: ["cancel", "halt", "prevent"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '5',
    text: 'Abundant',
    trWord: 'Bol',
    phonetic: '/əˈbʌn.dənt/',
    pos: 'adjective',
    posTr: 'sıfat',
    engDef: 'Existing or available in large quantities; plentiful.',
    trDef: 'Büyük miktarlarda bulunan veya mevcut olan; bol.',
    engExample: 'There is abundant evidence to support the theory.',
    trExample: 'Teoriyi destekleyecek bol miktarda kanıt var.',
    wordForms: [
      WordForms(form: "Abundance", pos: "noun", posTr: "isim"),
      WordForms(form: "Abundantly", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin abundare (to overflow).",
      prefix: "ab- (away, from)",
      suffix: "-ant (characterized by)",
      synonyms: ["plentiful", "copious", "ample"],
      antonyms: ["scarce", "rare", "lacking"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '6',
    text: 'Persist',
    trWord: 'Israr Etmek',
    phonetic: '/pəˈsɪst/',
    pos: 'verb',
    posTr: 'fiil',
    engDef: 'Continue firmly or obstinately in an opinion or a course of action in spite of difficulty.',
    trDef: 'Zorluklara rağmen bir fikirde veya hareket tarzında kararlılıkla devam etmek.',
    engExample: 'If you persist, you will eventually succeed.',
    trExample: 'Israr edersen, sonunda başarırsın.',
    wordForms: [
      WordForms(form: "Persistence", pos: "noun", posTr: "isim"),
      WordForms(form: "Persistent", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Persistently", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin persistere (to continue steadfastly).",
      prefix: "per- (thoroughly)",
      synonyms: ["continue", "persevere", "endure"],
      antonyms: ["quit", "cease", "give up"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '7',
    text: 'Clarify',
    trWord: 'Açıklamak',
    phonetic: '/ˈklær.ɪ.faɪ/',
    pos: 'verb',
    posTr: 'fiil',
    engDef: 'Make a statement or situation less confused and more comprehensible.',
    trDef: 'Bir ifadeyi veya durumu daha az kafa karıştırıcı ve daha anlaşılır hale getirmek.',
    engExample: 'Could you clarify your point, please?',
    trExample: 'Lütfen ne demek istediğinizi açıklar mısınız?',
    wordForms: [
      WordForms(form: "Clarification", pos: "noun", posTr: "isim"),
      WordForms(form: "Clarity", pos: "noun", posTr: "isim"),
    ],
    details: WordDetails(
      root: "From Latin clarificare (to make clear).",
      suffix: "-ify (to make or cause to be)",
      synonyms: ["explain", "elucidate", "simplify"],
      antonyms: ["confuse", "obscure", "complicate"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '8',
    text: 'Sincere',
    trWord: 'İçten',
    phonetic: '/sɪnˈsɪər/',
    pos: 'adjective',
    posTr: 'sıfat',
    engDef: 'Free from pretense or deceit; proceeding from genuine feelings.',
    trDef: 'Gösterişten veya yalandan uzak; içten duygulardan gelen.',
    engExample: 'He offered a sincere apology for his mistake.',
    trExample: 'Hatası için içten bir özür diledi.',
    wordForms: [
      WordForms(form: "Sincerity", pos: "noun", posTr: "isim"),
      WordForms(form: "Sincerely", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin sincerus (clean, pure, sound).",
      synonyms: ["genuine", "honest", "heartfelt"],
      antonyms: ["fake", "insincere", "deceitful"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '9',
    text: 'Gratitude',
    trWord: 'Şükran',
    phonetic: '/ˈɡræt.ɪ.tʃuːd/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The quality of being thankful; readiness to show appreciation.',
    trDef: 'Şükretme hali; minnettarlık ve takdir gösterme isteği.',
    engExample: 'He expressed his gratitude to everyone who helped him.',
    trExample: 'Ona yardım eden herkese minnettarlığını ifade etti.',
    wordForms: [
      WordForms(form: "Grateful", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Gratefully", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin gratus (pleasing, thankful).",
      suffix: "-tude (state or condition)",
      synonyms: ["thankfulness", "appreciation", "recognition"],
      antonyms: ["ingratitude", "unthankfulness", "resentment"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '10',
    text: 'Intention',
    trWord: 'Niyet',
    phonetic: '/ɪnˈten.ʃən/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'A thing intended; an aim or plan.',
    trDef: 'Hedeflenen şey; bir amaç, maksat veya niyet.',
    engExample: 'Actions are judged by their intentions.',
    trExample: 'Ameller niyetlere göre değerlendirilir.',
    wordForms: [
      WordForms(form: "Intend", pos: "verb", posTr: "fiil"),
      WordForms(form: "Intentional", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Intentionally", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin intendere (to turn one's attention to, stretch out).",
      prefix: "in- (towards)",
      suffix: "-tion (action or state)",
      synonyms: ["purpose", "aim", "goal"],
      antonyms: ["accident", "chance", "coincidence"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '11',
    text: 'Modesty',
    trWord: 'Tevazu',
    phonetic: '/ˈmɒd.ɪ.sti/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The quality or state of being unassuming or moderate in the estimation of one\'s abilities.',
    trDef: 'Kişinin yeteneklerini değerlendirirken gösterişsiz ve ölçülü olma durumu; alçakgönüllülük.',
    engExample: 'Despite his massive success, he retained his modesty.',
    trExample: 'Büyük başarısına rağmen tevazusunu korudu.',
    wordForms: [
      WordForms(form: "Modest", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Modestly", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin modestus (keeping due measure).",
      suffix: "-y (quality or state)",
      synonyms: ["humility", "meekness", "shyness"],
      antonyms: ["arrogance", "boasting", "pride"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '12',
    text: 'Integrity',
    trWord: 'Dürüstlük',
    phonetic: "/ɪn'teɡ.rə.ti/",
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The quality of being honest and having strong moral principles.',
    trDef: 'Dürüst olma ve güçlü ahlaki ilkelere sahip olma kalitesi.',
    engExample: 'She is a person of high integrity and respect.',
    trExample: 'O, son derece dürüst ve saygın bir insandır.',
    wordForms: [
      WordForms(form: "Integral", pos: "adjective", posTr: "sıfat"),
    ],
    details: WordDetails(
      root: "From Latin integritas (soundness, wholeness).",
      prefix: "in- (not)",
      suffix: "-ity (state or condition)",
      synonyms: ["honesty", "probity", "rectitude"],
      antonyms: ["dishonesty", "corruption", "deceit"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '13',
    text: 'Patience',
    trWord: 'Sabır',
    phonetic: '/ˈpeɪ.ʃəns/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The capacity to accept or tolerate delay, trouble, or suffering without getting angry.',
    trDef: 'Gecikmeyi, sıkıntıyı veya acıyı sinirlenmeden kabul etme kapasitesi.',
    engExample: 'Patience is a key element in achieving long-term goals.',
    trExample: 'Sabır, uzun vadeli hedeflere ulaşmada kilit bir unsundur.',
    wordForms: [
      WordForms(form: "Patient", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Patiently", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin pati (to suffer, endure).",
      suffix: "-ence (state or quality)",
      synonyms: ["tolerance", "endurance", "forbearance"],
      antonyms: ["impatience", "frustration", "haste"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '14',
    text: 'Contemplate',
    trWord: 'Tefekkür Etmek',
    phonetic: '/ˈkɒn.təm.pleɪt/',
    pos: 'verb',
    posTr: 'fiil',
    engDef: 'Look thoughtfully for a long time at; think deeply and at length.',
    trDef: 'Bir şeye uzun süre düşünceli bir şekilde bakmak; derinlemesine düşünmek.',
    engExample: 'He went to the forest to contemplate the meaning of life.',
    trExample: 'Hayatın anlamını tefekkür etmek için ormana gitti.',
    wordForms: [
      WordForms(form: "Contemplation", pos: "noun", posTr: "isim"),
      WordForms(form: "Contemplative", pos: "adjective", posTr: "sıfat"),
    ],
    details: WordDetails(
      root: "From Latin contemplari (to survey, observe).",
      prefix: "con- (together, thoroughly)",
      suffix: "-ate (having the state of)",
      synonyms: ["ponder", "reflect", "consider"],
      antonyms: ["ignore", "disregard", "neglect"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '15',
    text: 'Justice',
    trWord: 'Adalet',
    phonetic: '/ˈdʒʌs.tɪs/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'Just behavior or treatment; fairness.',
    trDef: 'Adil davranış veya muamele; hakkaniyet.',
    engExample: 'A healthy society is built on the foundation of justice.',
    trExample: 'Sağlıklı bir toplum, adalet temeli üzerine kurulur.',
    wordForms: [
      WordForms(form: "Just", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Justly", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin justitia (righteousness, equity).",
      suffix: "-ice (act or condition)",
      synonyms: ["fairness", "equity", "impartiality"],
      antonyms: ["injustice", "unfairness", "corruption"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '16',
    text: 'Wisdom',
    trWord: 'Bilgelik',
    phonetic: '/ˈwɪz.dəm/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The quality of having experience, knowledge, and good judgment.',
    trDef: 'Tecrübe, bilgi ve iyi yargı yeteneğine sahip olma durumu.',
    engExample: 'He shared his wisdom with the younger generation.',
    trExample: 'Bilgeliğini genç nesille paylaştı.',
    wordForms: [
      WordForms(form: "Wise", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Wisely", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Old English wis (wise) + -dom.",
      suffix: "-dom (state or condition)",
      synonyms: ["sagacity", "intelligence", "insight"],
      antonyms: ["foolishness", "stupidty", "ignorance"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '20',
    text: 'Altruism',
    trWord: 'Diğerkamlık',
    phonetic: '/ˈæl.tru.ɪ.zəm/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The belief in or practice of disinterested and selfless concern for the well-being of others.',
    trDef: 'Başkalarının iyiliği için bencil olmayan ve çıkarsız ilgi duyma inancı veya pratiği.',
    engExample: 'Her life was characterized by extreme altruism.',
    trExample: 'Hayatı aşırı diğerkamlıkla karakterize edilmişti.',
    wordForms: [
      WordForms(form: "Altruistic", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Altruistically", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Latin alter (other).",
      suffix: "-ism (belief or practice)",
      synonyms: ["selflessness", "philanthropy", "charity"],
      antonyms: ["selfishness", "egoism", "greed"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '22',
    text: 'Authenticity',
    trWord: 'Sahicilik',
    phonetic: '/ˌɔː.θenˈtɪs.ə.ti/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The quality of being real or true.',
    trDef: 'Gerçek veya doğru olma niteliği; özgünlük.',
    engExample: 'The authenticity of his character inspired trust.',
    trExample: 'Karakterinin sahiciliği güven ilham etti.',
    wordForms: [
      WordForms(form: "Authentic", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Authentically", pos: "adverb", posTr: "zarf"),
    ],
    details: WordDetails(
      root: "From Greek authentikos (original, genuine).",
      suffix: "-ity (state or condition)",
      synonyms: ["genuineness", "validity", "truthfulness"],
      antonyms: ["fakeness", "falsehood", "forgery"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '24',
    text: 'Meticulous',
    trWord: 'Titiz',
    phonetic: '/məˈtɪk.jə.ləs/',
    pos: 'adjective',
    posTr: 'sıfat',
    engDef: 'Showing great attention to detail; very careful and precise.',
    trDef: 'Detaylara büyük dikkat gösteren; çok dikkatli ve titiz.',
    engExample: 'He was meticulous in his preparation for the project.',
    trExample: 'Proje hazırlığında çok titizdi.',
    wordForms: [
      WordForms(form: "Meticulously", pos: "adverb", posTr: "zarf"),
      WordForms(form: "Meticulousness", pos: "noun", posTr: "isim"),
    ],
    details: WordDetails(
      root: "From Latin meticulosus (fearful).",
      suffix: "-ous (full of)",
      synonyms: ["careful", "precise", "thorough"],
      antonyms: ["careless", "sloppy", "negligent"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '27',
    text: 'Harmony',
    trWord: 'Uyum',
    phonetic: '/ˈhɑː.mə.ni/',
    pos: 'noun',
    posTr: 'isim',
    engDef: 'The state of being in agreement or concord.',
    trDef: 'Anlaşma veya uyum içinde olma durumu; ahenk.',
    engExample: 'They learned to live in perfect harmony with nature.',
    trExample: 'Doğayla mükemmel bir uyum içinde yaşamayı öğrendiler.',
    wordForms: [
      WordForms(form: "Harmonious", pos: "adjective", posTr: "sıfat"),
      WordForms(form: "Harmonize", pos: "verb", posTr: "fiil"),
    ],
    details: WordDetails(
      root: "From Greek harmonia (joint, agreement).",
      suffix: "-y (state or quality)",
      synonyms: ["balance", "peace", "cooperation"],
      antonyms: ["conflict", "discord", "clash"],
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '102',
    text: 'Look after someone',
    trWord: 'Birisinin bakımını üstlenmek',
    phonetic: '/lʊk ˈɑːftər/',
    pos: 'phrasal verb',
    posTr: 'deyimsel fiil',
    engDef: 'Take care of someone, make sure they are well and have what they need.',
    trDef: 'Birine bakmak, onların iyi olduğundan ve ihtiyaçları olan şeylere sahip olduklarından emin olmak.',
    engExample: 'I have to look after my little brother today.',
    trExample: 'Bugün küçük kardeşime bakmak zorundayım.',
    mode: WordMode.phrasalVerb,
    details: WordDetails(
      miniCase: "Mark's neighbour was very old and lived alone. Mark promised to look after him during the harsh winter.",
      trMiniCase: "Mark'ın komşusu çok yaşlıydı ve yalnız yaşıyordu. Mark zorlu kış boyunca ona bakmaya söz verdi."
    ),
    sm2: SM2Data(),
  ),
  Word(
    id: '103',
    text: 'Go through',
    trWord: 'Yaşamak (zorlu bir süreci)',
    phonetic: '/ɡəʊ θruː/',
    pos: 'phrasal verb',
    posTr: 'deyimsel fiil',
    engDef: 'Experience a difficult or unpleasant situation or event; examine something systematically.',
    trDef: 'Zor veya nahoş bir durumu / olayı tecrübe etmek; bir şeyi sistematik olarak incelemek.',
    engExample: 'She is going through a very difficult time right now.',
    trExample: 'Şu anda çok zor bir dönemden geçiyor.',
    mode: WordMode.phrasalVerb,
    details: WordDetails(
      miniCase: "Jason lost his job perfectly out of the blue. He went through a terrible depression for a month.",
      trMiniCase: "Jason tamamen beklenmedik bir şekilde işini kaybetti. Bir ay boyunca korkunç bir depresyondan geçti."
    ),
    sm2: SM2Data(),
  ),
];
