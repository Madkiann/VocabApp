import FlamingoImg from '../assets/Mascot/Flamingoo.png';
import Flamingo3D from '../assets/Mascot/Flamingo3D.png';

const drawText = (ctx, text, x, y, maxWidth, lineHeight, font, color, align = 'center') => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    let words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
};

export const shareWordToCanvas = async (wordObj, appLang, t, isDark, showPractice = false) => {
    try {
        const textToShare = `✨ Öğrendiğim kelime: ${wordObj.word} (${wordObj.phonetic})\n` +
            `📖 Anlamı: ${appLang === 'tr' ? wordObj.trWord || wordObj.trDef : wordObj.engDef}\n\n` +
            `Ferhat Hoca ile İngilizce öğreniyorum! 🎯\nhttps://ferhathocaingilizce.com`;

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        const cx = 540;

        // Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
        if (isDark) { grad.addColorStop(0, '#1e1b4b'); grad.addColorStop(1, '#0f172a'); }
        else { grad.addColorStop(0, '#f8fafc'); grad.addColorStop(1, '#e0e7ff'); }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Card Container
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetY = 20;
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(80, 250, 920, 1450, 80); ctx.fill();
        } else {
            ctx.fillRect(80, 250, 920, 1450);
        }

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.textAlign = 'center';

        let y = 450;
        // Word
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 130px "Segoe UI", Roboto, sans-serif';
        if (wordObj.word.length > 10) ctx.font = 'bold 90px "Segoe UI", Roboto, sans-serif';
        ctx.fillText(wordObj.word, cx, y);
        y += 100;

        // Phonetic
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = 'italic 50px "Arial Unicode MS", sans-serif';
        ctx.fillText(wordObj.phonetic, cx, y);
        y += 80;

        // Header Meaning
        ctx.fillStyle = isDark ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText(appLang === 'tr' ? "ANLAMI" : "MEANING", cx, y);
        y += 80;

        // Meaning Text
        const meaning = appLang === 'tr' ? (wordObj.trWord || wordObj.trDef) : wordObj.engDef;
        y = drawText(ctx, meaning, cx, y, 780, 65, 'bold 55px "Segoe UI"', isDark ? '#e2e8f0' : '#1e293b');
        y += 40;

        // Header Example
        ctx.fillStyle = isDark ? '#fcd34d' : '#d97706';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText("EXAMPLE", cx, y);
        y += 80;

        // Example Text
        y = drawText(ctx, `"${wordObj.engExample}"`, cx, y, 800, 60, 'italic 48px "Segoe UI"', isDark ? '#cbd5e1' : '#475569');
        y += 60;

        // Practice Section (Optional / Add-ready)
        const practice = wordObj.details?.examples || [];
        if (showPractice && practice.length > 0) {
            ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
            ctx.font = 'bold 36px "Segoe UI", sans-serif';
            ctx.fillText("PRACTICE", cx, y);
            y += 80;
            ctx.font = 'italic 34px "Segoe UI"';
            ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
            practice.slice(0, 2).forEach(p => {
                y = drawText(ctx, p, cx, y, 800, 48, 'italic 34px "Segoe UI"', isDark ? '#94a3b8' : '#64748b');
                y += 20;
            });
        }

        // Mascot Placement - Anchored to bottom right of the card
        const mascotImg = new Image();
        mascotImg.src = Flamingo3D;
        await new Promise(r => { mascotImg.onload = r; mascotImg.onerror = r; });
        if (mascotImg.complete && mascotImg.naturalWidth > 0) {
            const mSize = 320;
            // Anchor to the bottom right corner of the card (ends at 1700)
            const mascotX = 760;
            const mascotY = 1380;
            ctx.drawImage(mascotImg, mascotX, mascotY, mSize, mSize);
        }

        // Footer
        ctx.fillText("ferhathocaingilizce.com", cx, 1860);

        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    reject(new Error("Blob creation failed"));
                    return;
                }
                try {
                    await shareImage(blob, wordObj.word, textToShare);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 'image/png', 0.95);
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const sharePhrasalToCanvas = async (wordObj, appLang, isDark, showPractice = false) => {
    try {
        const textToShare = `🔥 Phrasal Verb: ${wordObj.word}\n📖: ${appLang === 'tr' ? wordObj.trWord : wordObj.engDef}\n✨ Vaka Örnekleri Dahil!\n\n🎯 Ferhat Hoca ile İngilizce`;
        const canvas = document.createElement('canvas');
        canvas.width = 1080; canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        const cx = 540;

        // Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
        grad.addColorStop(0, isDark ? '#0f172a' : '#f8fafc');
        grad.addColorStop(1, isDark ? '#1e1e24' : '#f1f5f9');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Core Card
        ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60;
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(60, 240, 960, 1460, 80), ctx.fill();
        ctx.shadowBlur = 0;

        let y = 420;
        // Word
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 115px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(wordObj.word, cx, y);
        y += 110;

        // Meaning (Tr for all as per user context usually prefers visual clear tr)
        ctx.fillStyle = isDark ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 50px "Segoe UI"';
        ctx.fillText(wordObj.trWord, cx, y);
        y += 80;

        // Def
        y = drawText(ctx, wordObj.trDef || wordObj.engDef, cx, y, 820, 52, '500 42px "Segoe UI"', isDark ? '#cbd5e1' : '#334155');
        y += 60;

        // Example
        y = drawText(ctx, `"${wordObj.engExample}"`, cx, y, 840, 65, 'italic bold 50px "Segoe UI"', isDark ? '#fcd34d' : '#d97706');
        y += 100;

        // Mini Case (Floating Box) with Intelligent Truncation
        if (wordObj.details?.miniCase) {
            const caseStartY = y;
            ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
            ctx.font = 'bold 38px "Segoe UI"'; ctx.textAlign = 'left';
            ctx.fillText("Mini Case Story", 140, y);
            y += 65;

            let miniEng = wordObj.details.miniCase || "";
            let miniTr = wordObj.details.trMiniCase || "";

            // If we have Vaka Örnekleri, we must ensure the story box doesn't push them out
            const caseExs = wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples || [];
            const needsSpace = caseExs.length > 0;
            const maxStoryHeight = needsSpace ? 400 : 700; // Target height budget for story box

            // Truncate by sentence if needed
            const truncateSentences = (textEn, textTr) => {
                let enS = textEn.split('.').filter(s => s.trim().length > 0);
                let trS = textTr.split('.').filter(s => s.trim().length > 0);

                // Keep removing last sentences while either text is too long (over 300 chars usually means 3+ lines)
                // or if we strictly need to fit in a box and text looks too full
                while (enS.length > 1 && (textEn.length > 300 || enS.length > trS.length)) {
                    enS.pop();
                    textEn = enS.join('.') + '.';
                }
                while (trS.length > 1 && (textTr.length > 250 || trS.length > enS.length)) {
                    trS.pop();
                    textTr = trS.join('.') + '.';
                }
                // Sync lengths
                while (enS.length > trS.length && enS.length > 1) { enS.pop(); textEn = enS.join('.') + '.'; }
                while (trS.length > enS.length && trS.length > 1) { trS.pop(); textTr = trS.join('.') + '.'; }

                return [textEn, textTr];
            };

            if (miniEng.length > 250 || miniTr.length > 200) {
                [miniEng, miniTr] = truncateSentences(miniEng, miniTr);
            }

            // Drawing text and tracking height
            y = drawText(ctx, miniEng, 140, y, 800, 44, '500 34px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
            y += 25;
            y = drawText(ctx, miniTr, 140, y, 800, 34, 'italic 500 28px "Segoe UI"', isDark ? '#94a3b8' : '#64748b', 'left');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(100, caseStartY - 45, 880, (y - caseStartY) + 80, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 80;
        }

        // Case Examples (Vaka Örnekleri) - Only Turkish
        const caseExs = wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples || [];
        if (caseExs.length > 0 && y < 1680) {
            const caseStartY = y;
            ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
            ctx.font = 'bold 38px "Segoe UI"'; ctx.textAlign = 'left';
            ctx.fillText("Vaka Örnekleri", 140, y);
            y += 65;

            caseExs.slice(0, 2).forEach((item, i) => {
                const tr = typeof item === 'string' ? item : item.tr;
                if (y < 1780) {
                    y = drawText(ctx, `• ${tr}`, 140, y, 800, 40, '500 32px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
                    y += 12;
                }
            });

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(217, 119, 6, 0.05)' : 'rgba(251, 191, 36, 0.1)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(100, caseStartY - 45, 880, (y - caseStartY) + 70, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 80;
        }

        // Practice (Optional / Add-ready)
        const practice = wordObj.details?.examples || [];
        if (showPractice && practice.length > 0) {
            ctx.textAlign = 'center';
            ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
            ctx.font = 'bold 34px "Segoe UI"';
            ctx.fillText("PRACTICE", cx, y);
            y += 65;
            practice.slice(0, 2).forEach(p => {
                y = drawText(ctx, p, cx, y, 850, 48, 'italic 34px "Segoe UI"', isDark ? '#94a3b8' : '#64748b');
                y += 25;
            });
        }

        // Mascot Placement - Anchored to bottom right of the card
        const mascotImg = new Image(); mascotImg.src = Flamingo3D;
        await new Promise(r => { mascotImg.onload = r; mascotImg.onerror = r; });
        if (mascotImg.complete) {
            const mSize = 320;
            // Anchor to the bottom right corner of the card (ends at 1700)
            const mascotX = 760;
            const mascotY = 1380;
            ctx.drawImage(mascotImg, mascotX, mascotY, mSize, mSize);
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
        ctx.font = '900 65px "Segoe UI"'; ctx.fillText("Ferhat Hoca ile İngilizce", cx, 1780);
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '500 40px "Segoe UI"'; ctx.fillText("ferhathocaingilizce.com", cx, 1860);

        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    reject(new Error("Blob creation failed"));
                    return;
                }
                try {
                    await shareImage(blob, wordObj.word, textToShare);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 'image/png', 0.95);
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const shareImage = async (blob, word, textToShare) => {
    try {
        const file = new File([blob], `vocab-${word}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: word, text: textToShare, files: [file] });
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vocab-${word}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Delay revocation to ensure download starts
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    } catch (err) {
        console.error("shareImage failed:", err);
        throw err;
    }
};
