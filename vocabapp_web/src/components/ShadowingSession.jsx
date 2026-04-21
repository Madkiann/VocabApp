import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Mic, MicOff, RefreshCw, Trophy, Play, Square, SkipForward, Flame, Target, Save, Check, EyeOff, Eye, Volume2, Book, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { useApp } from '../context/AppContext';
import { useVocab } from '../context/VocabContext';
import { sounds } from '../utils/sounds';

export const ShadowingSession = () => {
    const { isDark } = useSettings();
    const { setShowShadowing, activeShadowingPassage, setActiveShadowingPassage, setTotalSecondsSpent, setDailyStats, currentDate } = useApp();
    const { setCustomWords, wordVocab } = useVocab();

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [matchedWordsCount, setMatchedWordsCount] = useState(0);
    const [wordStatuses, setWordStatuses] = useState({}); // { [index]: 'correct' | 'skipped' }
    const [isFinished, setIsFinished] = useState(false);
    const [finalAccuracy, setFinalAccuracy] = useState(100);
    
    // Feature States
    const [isPlayingTTS, setIsPlayingTTS] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [comboCount, setComboCount] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [savedWeakWords, setSavedWeakWords] = useState({});
    
    // Premium Features
    const [isGhostMode, setIsGhostMode] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [perfectHit, setPerfectHit] = useState(null); // High confidence visual
    const [audioUrl, setAudioUrl] = useState(null);
    const [dictWord, setDictWord] = useState(null);
    const [dictTranslation, setDictTranslation] = useState('');
    const [isFetchingDict, setIsFetchingDict] = useState(false);
    
    // Refs
    const containerRef = useRef(null);
    const recognitionRef = useRef(null);
    const lastSpokenWordsRef = useRef([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const myAudioRef = useRef(null);
    const [isPlayingMyAudio, setIsPlayingMyAudio] = useState(false);
    
    const lastPerfectTimeRef = useRef(0);

    // Normalize text and expand common contractions
    const normalize = (text) => {
        let t = text.toLowerCase();
        t = t.replace(/i'm/g, "i am");
        t = t.replace(/you're/g, "you are");
        t = t.replace(/he's/g, "he is"); 
        t = t.replace(/she's/g, "she is");
        t = t.replace(/it's/g, "it is");
        t = t.replace(/we're/g, "we are");
        t = t.replace(/they're/g, "they are");
        t = t.replace(/that's/g, "that is");
        t = t.replace(/there's/g, "there is");
        t = t.replace(/what's/g, "what is");
        t = t.replace(/who's/g, "who is");
        t = t.replace(/let's/g, "let us");
        t = t.replace(/don't/g, "do not");
        t = t.replace(/doesn't/g, "does not");
        t = t.replace(/didn't/g, "did not");
        t = t.replace(/isn't/g, "is not");
        t = t.replace(/aren't/g, "are not");
        t = t.replace(/wasn't/g, "was not");
        t = t.replace(/weren't/g, "were not");
        t = t.replace(/can't/g, "can not");
        t = t.replace(/cannot/g, "can not");
        t = t.replace(/couldn't/g, "could not");
        t = t.replace(/won't/g, "will not");
        t = t.replace(/wouldn't/g, "would not");
        t = t.replace(/haven't/g, "have not");
        t = t.replace(/hasn't/g, "has not");
        t = t.replace(/hadn't/g, "had not");
        t = t.replace(/mustn't/g, "must not");
        t = t.replace(/[.,:;!?()"'[\]]/g, '');
        return t.trim();
    };

    // Prepare passage data
    const passageWords = useMemo(() => {
        if (!activeShadowingPassage) return [];
        return activeShadowingPassage.engText.split(/\s+/).map((word, index) => ({
            id: index,
            original: word,
            clean: normalize(word)
        }));
    }, [activeShadowingPassage]);

    // Prepare Dynamic Sentences for Subtitles
    const sentenceRanges = useMemo(() => {
        if (!activeShadowingPassage) return [];
        // Attempt to split by punctuation. Fallback to whole text if no punctuation found.
        const engSentences = activeShadowingPassage.engText.match(/[^.?!]+[.?!]+/g) || [activeShadowingPassage.engText];
        const trSentences = activeShadowingPassage.trText.match(/[^.?!]+[.?!]+/g) || [activeShadowingPassage.trText];
        
        let currentWordIndex = 0;
        return engSentences.map((engS, idx) => {
            const wordCount = engS.trim().split(/\s+/).length;
            const start = currentWordIndex;
            const end = currentWordIndex + wordCount - 1;
            currentWordIndex += wordCount;
            return {
                start,
                end: end >= passageWords.length ? passageWords.length - 1 : end,
                tr: trSentences[idx] ? trSentences[idx].trim() : (idx === engSentences.length - 1 ? trSentences[trSentences.length - 1] : '')
            };
        });
    }, [activeShadowingPassage, passageWords.length]);

    const activeSentenceTranslation = useMemo(() => {
        if (!showSubtitle || sentenceRanges.length === 0) return '';
        const currentRange = sentenceRanges.find(r => matchedWordsCount >= r.start && matchedWordsCount <= r.end);
        if (currentRange) return currentRange.tr;
        if (matchedWordsCount >= passageWords.length) return sentenceRanges[sentenceRanges.length - 1]?.tr || '';
        return sentenceRanges[0]?.tr || '';
    }, [showSubtitle, sentenceRanges, matchedWordsCount, passageWords.length]);

    // Setup MediaRecorder
    useEffect(() => {
        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunksRef.current.push(e.data);
                };
                mediaRecorderRef.current.onstop = () => {
                    if (audioChunksRef.current.length > 0) {
                        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                        setAudioUrl(URL.createObjectURL(blob));
                        audioChunksRef.current = [];
                    }
                };
            } catch (err) {
                console.warn("Mikrofon kayıt izni alınamadı:", err);
            }
        };
        initAudio();
        
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition is not supported in this browser.");
            alert("Üzgünüm, tarayıcın ses tanıma özelliğini desteklemiyor. Lütfen Chrome kullan.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        // We need continuous for long passages, and interimResults for fast UI updates.
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
            setStartTime(prev => {
                if (!prev) return Date.now();
                return prev;
            });
            // Start Audio Recorder if inactive
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
                audioChunksRef.current = [];
                mediaRecorderRef.current.start();
            }
            if (isPlayingTTS) {
                window.speechSynthesis.cancel();
                setIsPlayingTTS(false);
            }
        };

        recognition.onresult = (event) => {
            let fullStr = '';
            let highConf = false;
            
            for (let i = 0; i < event.results.length; ++i) {
                const res = event.results[i][0];
                fullStr += res.transcript + ' ';
                
                // Perfect Pronunciation Analyzer (Guitar Hero style)
                // Constraints: Must be a final result chunk (not interim hesitation), high confidence (say, 0.96+), 
                // and a chunk of at least 3 words to avoid spamming on simple words like "the" or "is".
                if (event.results[i].isFinal && res.confidence >= 0.96 && res.transcript.trim().split(/\s+/).length >= 3) {
                    highConf = true;
                }
            }
            
            setTranscript(fullStr.trim());
            
            if (highConf) {
                const now = Date.now();
                // Cooldown constraint: at least 4 seconds between perfect hits to make it rare and rewarding
                if (now - lastPerfectTimeRef.current > 4000) {
                    setPerfectHit(now);
                    lastPerfectTimeRef.current = now;
                }
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                alert("Mikrofon izni verilmedi.");
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            if (isListening && !isFinished) {
                try {
                    recognition.start(); // Restart engine to clear buffers silently
                } catch(e) { /* ignore */ }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    // Clear perfect hit text after animation
    useEffect(() => {
        if (perfectHit) {
            const timer = setTimeout(() => setPerfectHit(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [perfectHit]);

    // TTS
    const handleTTS = () => {
        if (!activeShadowingPassage) return;
        if (isPlayingTTS) {
            window.speechSynthesis.cancel();
            setIsPlayingTTS(false);
            return;
        }
        
        setIsPlayingTTS(true);
        const utterance = new SpeechSynthesisUtterance(activeShadowingPassage.engText);
        utterance.lang = 'en-US';
        
        const voices = window.speechSynthesis.getVoices();
        const engVoices = voices.filter(v => v.lang.startsWith('en'));
        const googleVoice = engVoices.find(v => v.name.includes('Google')); 
        if (googleVoice) utterance.voice = googleVoice;
        else if (engVoices.length > 0) utterance.voice = engVoices[0];
        
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingTTS(false);
        utterance.onerror = () => setIsPlayingTTS(false);
        window.speechSynthesis.speak(utterance);
    };

    // Tracking & Word Matching Logic
    useEffect(() => {
        if (!transcript || isFinished) return;

        const spokenWords = normalize(transcript).split(/\s+/).filter(w => w);
        let diffIdx = 0;
        while (diffIdx < lastSpokenWordsRef.current.length && diffIdx < spokenWords.length) {
            if (lastSpokenWordsRef.current[diffIdx] === spokenWords[diffIdx]) diffIdx++;
            else break;
        }

        const newWords = spokenWords.slice(diffIdx);
        lastSpokenWordsRef.current = spokenWords;

        let newMatched = matchedWordsCount;
        let didMatch = false;
        let newlyCorrect = 0;
        let didSkip = false;
        const newStatuses = {};
        
        for (let i = 0; i < newWords.length; i++) {
            const word = newWords[i];
            for (let j = 0; j < 3; j++) {
                const targetIdx = newMatched + j;
                if (targetIdx < passageWords.length && passageWords[targetIdx].clean === word) {
                    for (let k = newMatched; k < targetIdx; k++) {
                        newStatuses[k] = 'skipped';
                        didSkip = true;
                    }
                    newStatuses[targetIdx] = 'correct';
                    newlyCorrect++;
                    newMatched = targetIdx + 1;
                    didMatch = true;
                    setDictWord(null); // auto close dictionary if open
                    break;
                }
            }
        }

        if (didMatch) {
            setWordStatuses(prev => ({ ...prev, ...newStatuses }));
            setMatchedWordsCount(newMatched);
            
            if (didSkip) {
                setComboCount(newlyCorrect);
            } else {
                setComboCount(prev => {
                    const next = prev + newlyCorrect;
                    setMaxCombo(m => Math.max(m, next));
                    return next;
                });
            }

            if (containerRef.current) {
                const activeEl = containerRef.current.querySelector('.word-active');
                if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [transcript, passageWords, matchedWordsCount, isFinished]);

    // Finish Condition & Analytics
    useEffect(() => {
        if (matchedWordsCount >= passageWords.length && passageWords.length > 0 && !isFinished) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                setIsListening(false);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop(); // Stops audio recording
            }
            window.speechSynthesis.cancel();
            setIsPlayingTTS(false);
            
            setWordStatuses(prev => {
                const correctCount = Object.values(prev).filter(v => v === 'correct').length;
                const accuracy = Math.round((correctCount / passageWords.length) * 100);
                setFinalAccuracy(accuracy);
                
                if (startTime) {
                    const durationSec = (Date.now() - startTime) / 1000;
                    const calculatedWpm = Math.round(passageWords.length / (durationSec / 60));
                    setWpm(isFinite(calculatedWpm) ? calculatedWpm : 0);
                    setTotalSecondsSpent(sec => sec + Math.round(durationSec)); 
                    
                    setDailyStats(stats => {
                        const todayStr = new Date(currentDate).toDateString();
                        const prevDay = stats[todayStr] || {};
                        const prevShadow = prevDay.shadowing || [];
                        return {
                            ...stats,
                            [todayStr]: {
                                ...prevDay,
                                shadowing: [...prevShadow, { wpm: calculatedWpm, accuracy, title: activeShadowingPassage.title, time: new Date().toLocaleTimeString() }]
                            }
                        };
                    });
                }
                return prev;
            });
            
            setIsFinished(true);
            sounds.playMastery?.();
        }
    }, [matchedWordsCount, passageWords.length, isFinished, startTime, setTotalSecondsSpent, setDailyStats]);

    // Handlers
    const toggleListening = () => {
        if (!recognitionRef.current) return;
        setDictWord(null);
        if (isListening) {
            recognitionRef.current.stop();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            setIsListening(false);
        } else {
            if (isPlayingTTS) {
                window.speechSynthesis.cancel();
            }
            setTranscript('');
            try { recognitionRef.current.start(); } catch (e) { console.error(e); }
        }
    };

    const handleReset = () => {
        if (recognitionRef.current && isListening) recognitionRef.current.stop();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
        window.speechSynthesis.cancel();
        setIsPlayingTTS(false);
        setIsListening(false);
        setMatchedWordsCount(0);
        setWordStatuses({});
        setTranscript('');
        setIsFinished(false);
        setFinalAccuracy(100);
        setStartTime(null);
        setWpm(0);
        setComboCount(0);
        setAudioUrl(null);
        setDictWord(null);
        setPerfectHit(null);
        lastSpokenWordsRef.current = [];
        lastPerfectTimeRef.current = 0;
    };

    const handleClose = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
        window.speechSynthesis.cancel();
        setIsListening(false);
        setActiveShadowingPassage(null);
        setShowShadowing(false);
    };
    
    const skipNextWord = () => {
        if (matchedWordsCount < passageWords.length) {
            setWordStatuses(prev => ({ ...prev, [matchedWordsCount]: 'skipped' }));
            setMatchedWordsCount(prev => prev + 1);
            setComboCount(0);
            setStartTime(prev => prev || Date.now());
            setDictWord(null);
        }
    };

    const lookupDictionary = async (wordToLookup) => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
            setIsListening(false);
        }

        const localMatch = wordVocab.find(vw => vw.word.toLowerCase() === wordToLookup);
        if (localMatch && localMatch.trWord) {
            setDictWord(wordToLookup);
            setDictTranslation(localMatch.trWord);
            return;
        }

        setDictWord(wordToLookup);
        setIsFetchingDict(true);
        setDictTranslation('Anlam aranıyor...');
        
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToLookup}`);
            if (res.ok) {
                const data = await res.json();
                const def = data[0]?.meanings[0]?.definitions[0]?.definition;
                setDictTranslation(def ? def : "Bulunamadı");
            } else {
                setDictTranslation("Sözlükte bulunamadı. Kasaya ekle!");
            }
        } catch (e) {
            setDictTranslation("Bağlantı hatası");
        } finally {
            setIsFetchingDict(false);
        }
    };

    const weakWordsList = useMemo(() => {
        if (!isFinished) return [];
        const words = [];
        passageWords.forEach(w => {
            if (wordStatuses[w.id] === 'skipped') words.push(w.clean);
        });
        return [...new Set(words)]; 
    }, [isFinished, passageWords, wordStatuses]);

    const addToVault = (wordStr) => {
        setCustomWords(prev => {
            if (prev.some(w => w.word === wordStr)) return prev;
            return [...prev, {
                id: Date.now().toString() + Math.random(),
                word: wordStr,
                targetMode: "words",
                trWord: 'Shadowing Pratiğinden',
                engDef: '', trDef: '',
                level: 'B1',
                tags: ['shadowing-missed'],
                sm2: { rep: 0, int: 0, nextDate: Date.now(), ef: 2.5, history: [] }
            }];
        });
        setSavedWeakWords(prev => ({ ...prev, [wordStr]: true }));
    };

    if (!activeShadowingPassage) return null;

    const progressPercent = Math.min((matchedWordsCount / (passageWords.length || 1)) * 100, 100);
    const isFireMode = comboCount >= 10;
    
    let feedbackHeading = "MÜKEMMEL!";
    if (finalAccuracy < 70) feedbackHeading = "İYİ DENEME!";
    else if (finalAccuracy < 90) feedbackHeading = "HARİKA!";

    return (
        <div className={`fixed inset-0 z-[700] flex flex-col pt-safe animate-fade-in ${isDark ? 'bg-[#0a0a0c] text-white' : 'bg-[#fcfcfd] text-slate-900'}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-500 text-white shadow-glow-indigo">
                        <Mic size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-indigo-500">
                            SHADOWING
                        </h1>
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] -mt-1 ${isDark ? 'opacity-40' : 'text-slate-500'}`}>
                            {audioUrl ? 'Oturum Bitti' : 'Yüksek Sesle Oku'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isFinished && (
                        <>
                            <button 
                                onClick={() => setShowSubtitle(!showSubtitle)}
                                className={`p-2.5 rounded-xl transition-all ${showSubtitle ? 'bg-indigo-500 text-white shadow-glow-indigo' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}
                                title="Çeviri (Altyazı) Modu"
                            >
                                <Languages size={16} />
                            </button>
                            <button 
                                onClick={() => setIsGhostMode(!isGhostMode)}
                                className={`p-2.5 rounded-xl transition-all ${isGhostMode ? 'bg-indigo-500 text-white shadow-glow-indigo' : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}
                                title="Hayalet Modu"
                            >
                                {isGhostMode ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button 
                                onClick={handleTTS}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest hidden sm:flex ${isPlayingTTS ? 'bg-amber-500 text-white shadow-glow-amber scale-105' : (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600')}`}
                            >
                                {isPlayingTTS ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                {isPlayingTTS ? 'Dur' : 'Native Dinle'}
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleClose}
                        className={`p-2.5 rounded-2xl transition-all hover:rotate-90 active:scale-95 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Progress Bar & Combo Header */}
            <div className={`w-full h-1.5 flex items-center relative z-40 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                    className={`h-full transition-all duration-300 ${isFinished && finalAccuracy < 70 ? 'bg-amber-400' : (isFireMode ? 'bg-amber-500 shadow-glow-amber' : 'bg-indigo-500')}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            
            {/* Guitar Hero style "Perfect" popup float */}
            <AnimatePresence>
                {perfectHit && !isFinished && (
                    <motion.div
                        key={perfectHit}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -20, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 1.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute right-6 top-24 pointer-events-none z-50 text-amber-500 font-black text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] italic uppercase tracking-widest rotate-12"
                    >
                        PERFECT!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dynamic Subtitle Translation Banner */}
            <AnimatePresence>
                {showSubtitle && !isFinished && activeSentenceTranslation && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className={`w-full px-6 py-4 border-b ${isDark ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50/80 border-indigo-100'} overflow-hidden shrink-0 shadow-inner z-30 transition-all`}
                    >
                        <motion.p 
                            key={activeSentenceTranslation}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-sm italic text-center font-bold opacity-80 ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}
                        >
                            "{activeSentenceTranslation}"
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dictionary Popup overlay */}
            <AnimatePresence>
                {dictWord && !isFinished && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className={`absolute top-36 left-0 right-0 mx-auto w-11/12 max-w-sm p-4 rounded-2xl z-50 shadow-2xl flex flex-col ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <Book size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Sözlük</span>
                            </div>
                            <button onClick={() => setDictWord(null)} className="opacity-50 hover:opacity-100"><X size={16}/></button>
                        </div>
                        <h4 className="text-xl font-bold capitalize mb-1">{dictWord}</h4>
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} ${isFetchingDict ? 'animate-pulse' : ''}`}>{dictTranslation}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Passage Title & Meta */}
                <div className="px-6 pt-6 pb-2 shrink-0 text-center relative z-20 flex flex-col items-center">
                    <h2 className="text-2xl font-black mb-1">{activeShadowingPassage.title}</h2>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {activeShadowingPassage.difficulty} • By {activeShadowingPassage.author}
                    </span>
                    
                    <div className="min-h-8 mt-2 flex items-center justify-center">
                        <AnimatePresence>
                            {isFireMode && !isFinished && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                    className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-full shadow-glow-amber uppercase text-[9px] tracking-[0.2em] flex items-center gap-1.5"
                                >
                                    <Flame size={12} fill="currentColor" /> ALEV MODU x{comboCount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Text View (Karaoke) */}
                <div 
                    ref={containerRef}
                    className="flex-1 overflow-y-auto px-6 py-2 pb-16 text-center scrollbar-hide relative"
                    style={{ scrollPaddingTop: '50%' }}
                >
                    <div className="max-w-3xl mx-auto space-x-2 space-y-3 leading-relaxed relative">
                        {passageWords.map((w, i) => {
                            const isRead = i < matchedWordsCount;
                            const isCurrent = i === matchedWordsCount;
                            
                            let textColorClass = isDark ? 'text-slate-600 opacity-50' : 'text-slate-300 opacity-60';
                            let scaleClass = '';
                            
                            if (isRead) {
                                if (wordStatuses[i] === 'skipped') {
                                    textColorClass = isDark ? 'text-rose-500 opacity-80' : 'text-rose-600 opacity-90';
                                    if (isGhostMode) textColorClass += ' blur-sm opacity-20 pointer-events-none transition-all duration-1000';
                                } else {
                                    textColorClass = 'text-indigo-500 opacity-100';
                                    if (isGhostMode) textColorClass += ' opacity-0 blur-sm pointer-events-none transition-all duration-1000';
                                }
                            } else if (isCurrent) {
                                if (isFireMode) {
                                    textColorClass = 'word-active !text-amber-500 drop-shadow-md underline decoration-2 underline-offset-8 decoration-amber-500/50';
                                    scaleClass = 'scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)]';
                                } else {
                                    textColorClass = 'word-active !text-amber-400 drop-shadow-md underline decoration-2 underline-offset-8 decoration-amber-400/50';
                                    scaleClass = 'scale-110 shadow-glow-amber';
                                }
                            } else {
                                textColorClass += ' hover:opacity-100 cursor-pointer transition-opacity text-slate-400 dark:text-slate-500';
                            }
                            
                            return (
                                <span 
                                    key={w.id} 
                                    onClick={() => lookupDictionary(w.clean)}
                                    className={`inline-block py-1 px-1 text-[2.5rem] md:text-5xl font-bold transition-all duration-300 ${textColorClass} ${scaleClass}`}
                                >
                                    {w.original}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Finished Overlay */}
                <AnimatePresence>
                    {isFinished && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl ${isDark ? 'bg-slate-950/80' : 'bg-white/80'}`}
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className={`w-full max-w-4xl max-h-full overflow-y-auto scrollbar-hide flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-10 rounded-[3rem] border shadow-2xl relative ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                            >
                                {/* Skor Alanı */}
                                <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4 border-b md:border-b-0 md:border-r border-slate-500/10">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="p-5 bg-amber-400 rounded-[2rem] text-slate-900 shadow-glow-amber mb-6 shrink-0 relative">
                                            <Trophy size={48} strokeWidth={2} />
                                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg">Bitti</div>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black mb-8 italic">{feedbackHeading}</h3>
                                        
                                        <div className="flex gap-4 md:gap-6">
                                            <div className="text-center"><div className="text-2xl md:text-3xl font-black text-emerald-500">%{finalAccuracy}</div><div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Başarı</div></div>
                                            <div className="w-px bg-slate-500/20"></div>
                                            <div className="text-center"><div className="text-2xl md:text-3xl font-black text-indigo-500">{wpm}</div><div className="text-[10px] uppercase tracking-widest font-bold opacity-50">WPM Hız</div></div>
                                            <div className="w-px bg-slate-500/20"></div>
                                            <div className="text-center"><div className="text-2xl md:text-3xl font-black text-amber-500">x{maxCombo}</div><div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Kombo</div></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Oynatıcı & Kelimeler & Butonlar */}
                                <div className="flex-[1.2] flex flex-col justify-center gap-4 min-h-[300px]">
                                    {/* AUDIO PLAYER */}
                                    <div className={`w-full p-4 rounded-3xl border flex flex-col gap-3 shrink-0 ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                                        <h4 className="text-[9px] font-black uppercase tracking-widest opacity-60 px-1 border-b border-black/5 dark:border-white/5 pb-2">Seslendirmeyi Kıyasla</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-2xl">
                                                <div className="flex items-center gap-2 pl-2">
                                                    <Volume2 size={16} className="text-indigo-500" />
                                                    <span className="text-xs font-bold">Orijinal (Native)</span>
                                                </div>
                                                <button 
                                                    onClick={handleTTS}
                                                    className={`p-2 rounded-xl transition-all ${isPlayingTTS ? 'bg-indigo-500 text-white shadow-glow-indigo' : 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white'}`}
                                                >
                                                    {isPlayingTTS ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                </button>
                                            </div>
                                            {audioUrl && (
                                                <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-2xl">
                                                    <div className="flex items-center gap-2 pl-2">
                                                        <Mic size={16} className="text-emerald-500" />
                                                        <span className="text-xs font-bold">Senin Sesin</span>
                                                    </div>
                                                    <audio ref={myAudioRef} src={audioUrl} onEnded={() => setIsPlayingMyAudio(false)} onPause={() => setIsPlayingMyAudio(false)} onPlay={() => setIsPlayingMyAudio(true)} className="hidden" />
                                                    <button 
                                                        onClick={() => {
                                                            if (isPlayingMyAudio) myAudioRef.current?.pause();
                                                            else {
                                                                if (isPlayingTTS) {
                                                                    window.speechSynthesis.cancel();
                                                                    setIsPlayingTTS(false);
                                                                }
                                                                myAudioRef.current?.play();
                                                            }
                                                        }}
                                                        className={`p-2 rounded-xl transition-all ${isPlayingMyAudio ? 'bg-emerald-500 text-white shadow-glow-emerald' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                                    >
                                                        {isPlayingMyAudio ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {weakWordsList.length > 0 && (
                                        <div className={`w-full p-2 rounded-3xl border overflow-hidden flex flex-col shrink-0 flex-[1_1_0%] min-h-[140px] max-h-[180px] ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex justify-between items-center px-4 py-2 border-b border-black/5 dark:border-white/5 shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <Target size={14} className="text-rose-500" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Zorlanılan Kelimeler</span>
                                                </div>
                                                <span className="text-[9px] font-black bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-md">{weakWordsList.length} Kelime</span>
                                            </div>
                                            <div className="overflow-y-auto scrollbar-hide flex-1 p-2 bg-black/5 dark:bg-white/5 rounded-2xl mt-2 mx-1">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                    {weakWordsList.map(word => (
                                                        <div key={word} className="flex justify-between items-center py-1.5 px-3 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5">
                                                            <span className="font-bold text-sm capitalize truncate max-w-[100px]">{word}</span>
                                                            <button 
                                                                onClick={() => addToVault(word)}
                                                                disabled={savedWeakWords[word]}
                                                                className={`p-1.5 px-2 rounded-lg transition-all flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest shrink-0 ${savedWeakWords[word] ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white hover:shadow-glow-indigo'}`}
                                                            >
                                                                {savedWeakWords[word] ? <><Check size={10} /> Alındı</> : <><Save size={10} /> Kasa</>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 w-full shrink-0 mt-2">
                                        <button 
                                            onClick={handleReset}
                                            className={`flex-1 py-4 rounded-[2rem] font-black transition-all outline-none text-[10px] md:text-xs uppercase tracking-widest border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Tekrarla
                                        </button>
                                        <button 
                                            onClick={handleClose}
                                            className="flex-[1.5] py-4 rounded-[2rem] font-black bg-indigo-600 text-white shadow-glow-indigo hover:scale-[1.02] active:scale-95 transition-all outline-none text-[10px] md:text-xs uppercase tracking-widest border border-indigo-500"
                                        >
                                            Kütüphaneye Dön
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            {!isFinished && (
                <div className={`p-6 pb-8 border-t shrink-0 flex items-center justify-between relative z-20 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    
                    <button 
                        onClick={handleReset}
                        className={`p-4 rounded-2xl transition-all hover:rotate-180 active:scale-95 flex flex-col items-center gap-1 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}
                        title="Baştan Başla"
                    >
                        <RefreshCw size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Baştan</span>
                    </button>

                    <button 
                        onClick={toggleListening}
                        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-xl active:scale-95 border-4 relative z-30 ${
                            isListening ? 'bg-rose-500 border-rose-500/20 text-white shadow-[0_0_40px_rgba(244,63,94,0.5)] animate-pulse scale-105' : (isDark ? 'bg-indigo-600 border-indigo-600/20 text-white shadow-glow-indigo' : 'bg-indigo-600 border-indigo-200 text-white')
                        }`}
                    >
                        {isListening ? <Mic size={32} strokeWidth={2.5} /> : <MicOff size={32} strokeWidth={2.5} />}
                    </button>

                    <button 
                        onClick={skipNextWord}
                        className={`p-4 rounded-2xl transition-all active:scale-95 flex flex-col items-center gap-1 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-500 shadow-sm hover:text-indigo-600'}`}
                        title="Sonraki kelimeye atla"
                    >
                        <SkipForward size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Atla</span>
                    </button>

                </div>
            )}
        </div>
    );
};
