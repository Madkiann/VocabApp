import fs from 'fs';

const phrasalData = `

export const rawPhrasalVerbs = [
    {
        id: 101,
        word: "Take care of",
        trWord: "İlgilenmek / Bakmak",
        phonetic: "/teɪk keər əv/",
        pos: "phrasal verb",
        posTr: "deyimsel fiil",
        engDef: "Keep someone or something safe and provided for; handle or deal with a task.",
        trDef: "Birinin bakımını üstlenmek; bir konuyla veya görevle ilgilenmek.",
        engExample: "Could you take care of my cat while I'm away?",
        trExample: "Ben yokken kedime bakar mısın?",
        details: {
            miniCase: "The company's server went down during the night. Sarah was the only developer awake. She immediately took care of the situation before the clients noticed.",
            trMiniCase: "Gece şirketin sunucusu çöktü. Uyanık tek geliştirici Sarah'ydı. Müşteriler fark etmeden durumu derhal halletti."
        }
    },
    {
        id: 102,
        word: "Look after someone",
        trWord: "Birisinin bakımını üstlenmek",
        phonetic: "/lʊk ˈɑːftər/",
        pos: "phrasal verb",
        posTr: "deyimsel fiil",
        engDef: "Take care of someone, make sure they are well and have what they need.",
        trDef: "Birine bakmak, onların iyi olduğundan ve ihtiyaçları olan şeylere sahip olduklarından emin olmak.",
        engExample: "I have to look after my little brother today.",
        trExample: "Bugün küçük kardeşime bakmak zorundayım.",
        details: {
            miniCase: "Mark's neighbour was very old and lived alone. Mark promised to look after him during the harsh winter. He visited him every day to bring hot food.",
            trMiniCase: "Mark'ın komşusu çok yaşlıydı ve yalnız yaşıyordu. Mark zorlu kış boyunca ona bakmaya söz verdi. Sıcak yemek getirmek için onu her gün ziyaret etti."
        }
    },
    {
        id: 103,
        word: "Make something done",
        trWord: "Bir şeyi halletmek / Oldurtmak",
        phonetic: "/meɪk ˈsʌmθɪŋ dʌn/",
        pos: "phrasal verb / expression",
        posTr: "deyim",
        engDef: "To cause a task or action to be completed, often despite difficulties.",
        trDef: "Genellikle zorluklara rağmen bir görevin veya eylemin tamamlanmasını sağlamak.",
        engExample: "I don't care how hard it is, just make it done by Friday.",
        trExample: "Ne kadar zor olduğu umurumda değil, sadece Cuma gününe kadar hallet.",
        details: {
            miniCase: "The project deadline was extremely tight. The manager gathered the team and demanded extra hours. Through determination and teamwork, they made it done right on time.",
            trMiniCase: "Projenin teslim tarihi son derece sınırlıydı. Yönetici ekibi topladı ve ek mesai talep etti. Kararlılık ve ekip çalışması ile tam zamanında hallettiler."
        }
    },
    {
        id: 104,
        word: "Go through",
        trWord: "Yaşamak (zorlu bir süreci) / İncelemek",
        phonetic: "/ɡəʊ θruː/",
        pos: "phrasal verb",
        posTr: "deyimsel fiil",
        engDef: "Experience a difficult or unpleasant situation or event; examine something systematically.",
        trDef: "Zor veya nahoş bir durumu / olayı tecrübe etmek; bir şeyi sistematik olarak incelemek.",
        engExample: "She is going through a very difficult time right now.",
        trExample: "Şu anda çok zor bir dönemden geçiyor.",
        details: {
            miniCase: "Jason lost his job perfectly out of the blue. He went through a terrible depression for a month. Eventually, he started applying for new roles and regained his confidence.",
            trMiniCase: "Jason tamamen beklenmedik bir şekilde işini kaybetti. Bir ay boyunca korkunç bir depresyondan geçti. Sonunda, yeni rollere başvurmaya başladı ve özgüvenini geri kazandı."
        }
    }
];

export const initialPhrasalVerbs = rawPhrasalVerbs.map(w => ({
    ...w,
    sm2: { rep: 0, int: 0, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0, lastQualityScore: 0 }
}));
`;

fs.appendFileSync('src/data/vocabulary.js', phrasalData);
console.log("Appended successfully");
