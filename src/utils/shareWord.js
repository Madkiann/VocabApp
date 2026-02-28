import FlamingoImg from '../assets/Mascot/Flamingoo.png';
import Flamingo3D from '../assets/Mascot/Flamingo3D.png';

export const shareWordToCanvas = async (wordObj, appLang, t, isDark) => {
    try {
        const textToShare = `✨ Öğrendiğim kelime: ${wordObj.word} (${wordObj.phonetic})\n` +
            `📖 Anlamı: ${appLang === 'tr' ? wordObj.trWord : wordObj.engDef}\n\n` +
            `Ferhat Hoca ile İngilizce öğreniyorum! 🎯\nhttps://ferhathocaingilizce.com`;

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        // Draw Background Gradient
        const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
        if (isDark) {
            grad.addColorStop(0, '#1e1b4b');
            grad.addColorStop(1, '#0f172a');
        } else {
            grad.addColorStop(0, '#f8fafc');
            grad.addColorStop(1, '#e0e7ff');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Decor mesh circles
        ctx.beginPath(); ctx.arc(100, 200, 400, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)'; ctx.fill();

        ctx.beginPath(); ctx.arc(900, 1600, 500, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)'; ctx.fill();

        // Draw Card Bg
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetY = 20;
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(90, 350, 900, 1200, 80);
        else ctx.rect(90, 350, 900, 1200);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 4;
        ctx.stroke();

        const cx = 540;

        // Draw Word
        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 130px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        if (wordObj.word.length > 10) ctx.font = 'bold 100px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.fillText(wordObj.word, cx, 580);

        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = 'italic 50px "Arial Unicode MS", "Segoe UI", sans-serif';
        ctx.fillText(wordObj.phonetic, cx, 680);

        ctx.beginPath();
        ctx.moveTo(340, 770);
        ctx.lineTo(740, 770);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isDark ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '5px';
        ctx.fillText((appLang === 'tr' ? "ANLAMI" : "MEANING"), cx, 860);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

        const meaning = appLang === 'tr' ? wordObj.trDef : wordObj.engDef;
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.font = 'bold 50px "Segoe UI", Roboto, sans-serif';

        let words = meaning.split(' ');
        let line = '';
        let y = 960;
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let m = ctx.measureText(testLine);
            if (m.width > 740 && i > 0) {
                ctx.fillText(line.trim(), cx, y);
                line = words[i] + ' ';
                y += 65;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), cx, y);

        y += 120;
        ctx.fillStyle = isDark ? '#fcd34d' : '#d97706';
        ctx.font = 'bold 32px "Segoe UI", Roboto, sans-serif';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '5px';
        ctx.fillText("ÖRNEK / EXAMPLE", cx, y);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

        y += 70;
        ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
        ctx.font = 'italic 45px "Segoe UI", Roboto, sans-serif';
        words = wordObj.engExample.split(' ');
        line = '';
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let m = ctx.measureText(testLine);
            if (m.width > 760 && i > 0) {
                ctx.fillText(line.trim(), cx, y);
                line = words[i] + ' ';
                y += 60;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), cx, y);

        // Load Mascot 3D
        const mascotImg = new Image();
        mascotImg.src = Flamingo3D;
        await new Promise(r => { mascotImg.onload = r; mascotImg.onerror = r; });

        if (mascotImg.complete && mascotImg.naturalWidth > 0) {
            ctx.shadowBlur = 40;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            const mSize = 380;
            ctx.drawImage(mascotImg, 680, 1220, mSize, mSize);
            ctx.shadowBlur = 0;
        }

        // Brand Footer
        ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
        ctx.font = '900 60px "Segoe UI", Roboto, sans-serif';
        ctx.fillText("Ferhat Hoca ile İngilizce", cx, 1750);

        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '500 35px "Segoe UI", Roboto, sans-serif';
        ctx.fillText("ferhathocaingilizce.com", cx, 1820);

        canvas.toBlob(async (blob) => {
            const fileName = `vocab-${wordObj.word.toLowerCase()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: wordObj.word,
                        text: textToShare,
                        files: [file]
                    });
                } catch (e) {
                    console.log("Paylaşım penceresi kapatıldı:", e.name);
                }
            } else if (navigator.share) {
                navigator.share({ title: wordObj.word, text: textToShare }).catch(() => { });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
                URL.revokeObjectURL(url);
            }
        }, 'image/png', 0.95);

    } catch (err) {
        console.error("Hata:", err);
    }
};

export const sharePhrasalToCanvas = async (wordObj, appLang, isDark) => {
    try {
        const textToShare = `🔥 Öğrendiğim Phrasal Verb: ${wordObj.word} (${wordObj.phonetic})\n` +
            `📖 Anlamı: ${appLang === 'tr' ? wordObj.trWord : wordObj.engDef}\n\n` +
            `Ferhat Hoca ile İngilizce öğreniyorum! 🎯\nhttps://ferhathocaingilizce.com`;

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
        if (isDark) {
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(1, '#1e1e24');
        } else {
            grad.addColorStop(0, '#f8fafc');
            grad.addColorStop(1, '#f1f5f9');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        ctx.beginPath(); ctx.arc(200, 300, 400, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.05)'; ctx.fill();

        ctx.beginPath(); ctx.arc(800, 1400, 500, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)'; ctx.fill();

        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetY = 20;
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(70, 250, 940, 1400, 80);
        else ctx.rect(70, 250, 940, 1400);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 4;
        ctx.stroke();

        const cx = 540;

        ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)';
        if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(400, 290, 280, 60, 30); ctx.fill();
        }
        ctx.fillStyle = isDark ? '#818cf8' : '#4f46e5';
        ctx.font = 'bold 30px "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '5px';
        ctx.fillText("PHRASAL VERB", cx, 332);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 110px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        if (wordObj.word.length > 15) ctx.font = 'bold 85px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        ctx.fillText(wordObj.word, cx, 460);

        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = 'italic 50px "Arial Unicode MS", "Segoe UI", sans-serif';
        ctx.fillText(wordObj.phonetic, cx, 540);

        ctx.beginPath(); ctx.moveTo(340, 600); ctx.lineTo(740, 600);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();

        ctx.fillStyle = isDark ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 45px "Segoe UI", Roboto, sans-serif';
        ctx.fillText((appLang === 'tr' ? wordObj.trWord : wordObj.trWord), cx, 680);

        const meaning = appLang === 'tr' ? wordObj.trDef : wordObj.engDef;
        ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
        ctx.font = '500 40px "Segoe UI", Roboto, sans-serif';
        let words = meaning.split(' '); let line = ''; let y = 760;
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let m = ctx.measureText(testLine);
            if (m.width > 800 && i > 0) {
                ctx.fillText(line.trim(), cx, y);
                line = words[i] + ' '; y += 50;
            } else { line = testLine; }
        }
        ctx.fillText(line.trim(), cx, y);

        y += 100;
        ctx.fillStyle = isDark ? '#fcd34d' : '#d97706';
        ctx.font = 'italic bold 45px "Segoe UI", Roboto, sans-serif';
        words = `"${wordObj.engExample}"`.split(' '); line = '';
        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            let m = ctx.measureText(testLine);
            if (m.width > 800 && i > 0) {
                ctx.fillText(line.trim(), cx, y);
                line = words[i] + ' '; y += 60;
            } else { line = testLine; }
        }
        ctx.fillText(line.trim(), cx, y);

        if (wordObj.details?.miniCase) {
            y += 100;
            ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.8)';
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(110, y, 860, 360, 40);
            else ctx.rect(110, y, 860, 360);
            ctx.fill();

            y += 70;
            ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
            ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'left';
            if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '3px';
            ctx.fillText("Mini Case Story", 160, y);
            if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';

            y += 60;
            ctx.fillStyle = isDark ? '#e2e8f0' : '#334155';
            ctx.font = '500 34px "Segoe UI", Roboto, sans-serif';
            words = wordObj.details.miniCase.split(' '); line = '';
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let m = ctx.measureText(testLine);
                if (m.width > 760 && i > 0) {
                    ctx.fillText(line.trim(), 160, y);
                    line = words[i] + ' '; y += 42;
                } else { line = testLine; }
            }
            ctx.fillText(line.trim(), 160, y);

            y += 30;
            ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
            ctx.font = 'italic 500 30px "Segoe UI", Roboto, sans-serif';
            words = wordObj.details.trMiniCase.split(' '); line = '';
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let m = ctx.measureText(testLine);
                if (m.width > 760 && i > 0) {
                    ctx.fillText(line.trim(), 160, y);
                    line = words[i] + ' '; y += 40;
                } else { line = testLine; }
            }
            ctx.fillText(line.trim(), 160, y);
        }

        // Mascot 3D for Phrasal
        const mascotImg3D = new Image();
        mascotImg3D.src = Flamingo3D;
        await new Promise(r => { mascotImg3D.onload = r; mascotImg3D.onerror = r; });

        if (mascotImg3D.complete && mascotImg3D.naturalWidth > 0) {
            ctx.shadowBlur = 40;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            const mSize = 420;
            ctx.drawImage(mascotImg3D, 700, 1250, mSize, mSize);
            ctx.shadowBlur = 0;
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
        ctx.font = '900 60px "Segoe UI", Roboto, sans-serif';
        ctx.fillText("Ferhat Hoca ile İngilizce", cx, 1750);

        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '500 35px "Segoe UI", Roboto, sans-serif';
        ctx.fillText("ferhathocaingilizce.com", cx, 1820);

        canvas.toBlob(async (blob) => {
            const fileName = `phrasal-${wordObj.word.toLowerCase().replace(/\s+/g, '-')}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: wordObj.word,
                        text: textToShare,
                        files: [file]
                    });
                } catch (e) {
                    console.log("Paylaşım kapandı.");
                }
            } else if (navigator.share) {
                navigator.share({ title: wordObj.word, text: textToShare }).catch(() => { });
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
                URL.revokeObjectURL(url);
            }
        }, 'image/png', 0.95);

    } catch (err) {
        console.error("Hata:", err);
    }
};
