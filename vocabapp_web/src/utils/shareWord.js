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
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
};

export const shareWordToCanvas = async (wordObj, appLang, t, isDark, showPractice = false) => {
    try {
        const textToShare = `✨ Öğrendiğim kelime: ${wordObj.word} (${wordObj.phonetic})\n` +
            `📖 Anlamı: ${appLang === 'tr' ? wordObj.trWord || wordObj.trDef : wordObj.trWord}\n` +
            `🔥 Vaka Örnekleri Dahil!\n\n` +
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
            ctx.beginPath(); ctx.roundRect(80, 180, 920, 1580, 80); ctx.fill();
        } else {
            ctx.fillRect(80, 180, 920, 1580);
        }

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.textAlign = 'center';

        let y = 350;
        // Word with dynamic scaling
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        let fontSize = 130;
        const wordText = wordObj.word || "";
        if (wordText.length > 25) fontSize = 65;
        else if (wordText.length > 18) fontSize = 85;
        else if (wordText.length > 12) fontSize = 110;

        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, sans-serif`;
        // Even with scaling, if it's multiple words or very long, wrap it
        if (ctx.measureText(wordText).width > 850) {
            y = drawText(ctx, wordText, cx, y, 850, fontSize * 0.9, `bold ${fontSize}px "Segoe UI"`, isDark ? '#ffffff' : '#0f172a');
        } else {
            ctx.fillText(wordText, cx, y);
            y += (fontSize * 0.8) + 20;
        }

        // Phonetic & POS
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = 'italic 50px "Arial Unicode MS", sans-serif';
        const posText = appLang === 'tr' ? wordObj.posTr : wordObj.pos;
        ctx.fillText(`${wordObj.phonetic || ""} • ${posText || ""}`, cx, y);
        y += 80;

        // Header Meaning
        ctx.fillStyle = isDark ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText(appLang === 'tr' ? "ANLAMI" : "MEANING", cx, y);
        y += 80;

        // Meaning Text (Multi-line)
        const meaning = appLang === 'tr' ? (wordObj.trWord || wordObj.trDef) : wordObj.trWord || wordObj.word;
        y = drawText(ctx, meaning || "", cx, y, 820, 65, 'bold 55px "Segoe UI"', isDark ? '#e2e8f0' : '#1e293b');
        y += 40;

        // Header Example
        ctx.fillStyle = isDark ? '#fcd34d' : '#d97706';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText("EXAMPLE", cx, y);
        y += 80;

        // Example Text
        y = drawText(ctx, `"${wordObj.engExample || ""}"`, cx, y, 840, 60, 'italic bold 48px "Segoe UI"', isDark ? '#fcd34d' : '#d97706');
        y += 30;
        if (wordObj.trExample) {
            y = drawText(ctx, wordObj.trExample, cx, y, 840, 40, 'italic 34px "Segoe UI"', isDark ? '#94a3b8' : '#64748b');
            y += 60;
        } else {
            y += 30;
        }

        // Mini Case (Floating Box)
        if (wordObj.details?.miniCase && y < 1400) {
            const caseStartY = y;
            ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
            ctx.font = 'bold 36px "Segoe UI"'; ctx.textAlign = 'left';
            ctx.fillText("Mini Case Story", 150, y);
            y += 60;

            let miniEng = wordObj.details.miniCase || "";
            let miniTr = wordObj.details.trMiniCase || "";

            // Truncate to avoid footer overlap
            if (miniEng.length > 300) miniEng = miniEng.substring(0, 297) + "...";
            if (miniTr.length > 250) miniTr = miniTr.substring(0, 247) + "...";

            y = drawText(ctx, miniEng, 150, y, 780, 42, '500 32px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
            y += 20;
            y = drawText(ctx, miniTr, 150, y, 780, 32, 'italic 500 28px "Segoe UI"', isDark ? '#94a3b8' : '#64748b', 'left');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(110, caseStartY - 45, 860, (y - caseStartY) + 80, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 80;
        }

        // Case Examples (Vaka Örnekleri)
        const caseExs = wordObj.details?.caseExamples || [];
        if (caseExs.length > 0 && y < 1620) {
            const exStartY = y;
            ctx.textAlign = 'left';
            ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
            ctx.font = 'bold 36px "Segoe UI"';
            ctx.fillText("Vaka Örnekleri", 150, y);
            y += 65;

            caseExs.slice(0, 2).forEach((item, i) => {
                const tr = typeof item === 'string' ? item : item.tr;
                if (y < 1720) {
                    y = drawText(ctx, `• ${tr}`, 150, y, 780, 40, '500 32px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
                    y += 12;
                }
            });

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(217, 119, 6, 0.05)' : 'rgba(251, 191, 36, 0.1)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(110, exStartY - 45, 860, (y - exStartY) + 70, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 60;
        }

        // Mascot Placement
        const mascotImg = new Image();
        mascotImg.src = Flamingo3D;
        await new Promise(r => { mascotImg.onload = r; mascotImg.onerror = r; });
        if (mascotImg.complete && mascotImg.naturalWidth > 0) {
            const mSize = 320;
            const mascotX = 760;
            const mascotY = 1380;
            ctx.drawImage(mascotImg, mascotX, mascotY, mSize, mSize);
        }

        // Footer
        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '500 36px "Segoe UI"';
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
        if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(60, 180, 960, 1580, 80), ctx.fill();
        ctx.shadowBlur = 0;

        let y = 350;
        // Word with dynamic scaling
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        let fontSize = 115;
        const wordText = wordObj.word || "";
        if (wordText.length > 25) fontSize = 60;
        else if (wordText.length > 18) fontSize = 80;
        else if (wordText.length > 12) fontSize = 100;

        ctx.font = `bold ${fontSize}px "Segoe UI"`;
        ctx.textAlign = 'center';
        if (ctx.measureText(wordText).width > 880) {
            y = drawText(ctx, wordText, cx, y, 880, fontSize * 0.9, `bold ${fontSize}px "Segoe UI"`, isDark ? '#ffffff' : '#0f172a');
        } else {
            ctx.fillText(wordText, cx, y);
            y += (fontSize * 0.8) + 20;
        }

        // Meaning Wrapper
        y = drawText(ctx, wordObj.trWord || "", cx, y, 860, 60, 'bold 50px "Segoe UI"', isDark ? '#a5b4fc' : '#4f46e5');
        y += 40;

        // Def
        y = drawText(ctx, wordObj.trDef || wordObj.engDef || "", cx, y, 820, 52, '500 42px "Segoe UI"', isDark ? '#cbd5e1' : '#334155');
        y += 60;

        // Example
        y = drawText(ctx, `"${wordObj.engExample || ""}"`, cx, y, 840, 65, 'italic bold 50px "Segoe UI"', isDark ? '#fcd34d' : '#d97706');
        y += 80;

        // Mini Case
        if (wordObj.details?.miniCase && y < 1400) {
            const caseStartY = y;
            ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
            ctx.font = 'bold 38px "Segoe UI"'; ctx.textAlign = 'left';
            ctx.fillText("Mini Case Story", 140, y);
            y += 65;

            let miniEng = wordObj.details.miniCase || "";
            let miniTr = wordObj.details.trMiniCase || "";

            if (miniEng.length > 300) miniEng = miniEng.substring(0, 297) + "...";
            if (miniTr.length > 250) miniTr = miniTr.substring(0, 247) + "...";

            y = drawText(ctx, miniEng, 140, y, 800, 44, '500 34px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
            y += 25;
            y = drawText(ctx, miniTr, 140, y, 800, 34, 'italic 500 28px "Segoe UI"', isDark ? '#94a3b8' : '#64748b', 'left');

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(100, caseStartY - 45, 880, (y - caseStartY) + 80, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 80;
        }

        // Case Examples
        const caseExs = wordObj.details?.caseExamples || wordObj.details?.trMiniCaseExamples || [];
        if (caseExs.length > 0 && y < 1650) {
            const caseExsStartY = y;
            ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
            ctx.font = 'bold 38px "Segoe UI"'; ctx.textAlign = 'left';
            ctx.fillText("Vaka Örnekleri", 140, y);
            y += 65;

            caseExs.slice(0, 2).forEach((item, i) => {
                const tr = typeof item === 'string' ? item : item.tr;
                if (y < 1720) {
                    y = drawText(ctx, `• ${tr}`, 140, y, 800, 40, '500 32px "Segoe UI"', isDark ? '#e2e8f0' : '#334155', 'left');
                    y += 12;
                }
            });

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = isDark ? 'rgba(217, 119, 6, 0.05)' : 'rgba(251, 191, 36, 0.1)';
            if (ctx.roundRect) ctx.beginPath(), ctx.roundRect(100, caseExsStartY - 45, 880, (y - caseExsStartY) + 70, 40), ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            y += 40;
        }

        // Mascot Placement
        const mascotImg = new Image(); mascotImg.src = Flamingo3D;
        await new Promise(r => { mascotImg.onload = r; mascotImg.onerror = r; });
        if (mascotImg.complete) {
            const mSize = 320;
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
            try {
                await navigator.share({ title: word, text: textToShare, files: [file] });
                return;
            } catch (shareErr) {
                console.warn("navigator.share(files) failed, trying fallback:", shareErr);
            }
        }

        if (navigator.share) {
            try {
                await navigator.share({ title: word, text: textToShare });
                return;
            } catch (shareErr) {
                console.warn("navigator.share(text) failed:", shareErr);
            }
        }

        try {
            await navigator.clipboard.writeText(textToShare);
            console.log("Copied text to clipboard as share fallback.");
        } catch (clipErr) {
            console.warn("Clipboard fallback failed:", clipErr);
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vocab-${word}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
        console.error("shareImage failed completely:", err);
        throw err;
    }
};
