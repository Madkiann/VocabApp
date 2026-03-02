/**
 * Subtle Sound System for VocabApp
 * Uses Web Audio API to generate procedural sounds (no assets required)
 */

class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSuccess() {
        this.init();
        this.resume();
        if (!this.ctx || !this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1); // A5

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playError() {
        this.init();
        this.resume();
        if (!this.ctx || !this.enabled) return;

        // "Remind Me" Supportive Chord
        const now = this.ctx.currentTime;
        [329.63, 392.00].forEach((freq, i) => { // E4, G4 (Minor-ish soft feel)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.3);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    playClick() {
        this.init();
        this.resume();
        if (!this.ctx || !this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playMastery() {
        this.init();
        this.resume();
        if (!this.ctx || !this.enabled) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major chord)

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (i * 0.05));

            gain.gain.setValueAtTime(0, now + (i * 0.05));
            gain.gain.linearRampToValueAtTime(0.05, now + (i * 0.05) + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (i * 0.05));
            osc.stop(now + (i * 0.05) + 0.4);
        });
    }

    playCompanion() {
        this.init();
        this.resume();
        if (!this.ctx || !this.enabled) return;

        const now = this.ctx.currentTime;

        // 1. Tonal Tinkle (Success feeling)
        [880, 1108, 1318].forEach((freq, i) => { // A5, C#6, E6
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (i * 0.05));
            gain.gain.setValueAtTime(0, now + (i * 0.05));
            gain.gain.linearRampToValueAtTime(0.02, now + (i * 0.05) + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + (i * 0.05));
            osc.stop(now + 0.5);
        });

        // 2. Torch Crackle (Ambient feel)
        const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.01; // Low level white noise
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + 0.5);
    }
}

export const sounds = new SoundSystem();
