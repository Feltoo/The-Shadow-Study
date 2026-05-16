// ============================================================
// AUDIO ENGINE — Synthesized Sound Effects
// Uses Web Audio API. No external files required.
// ============================================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Helper to create an oscillator and gain node
function createOscillator(type, freq, vol) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    return { osc, gain };
}

// 1. Typewriter Clack (for Logs)
export function playTypewriter() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Short burst of white noise for the mechanical clack
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter to make it sound clacky
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
}

// 2. Success Chime (Puzzle Solved / Item Picked Up)
export function playSuccess() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const { osc, gain } = createOscillator('sine', 440, 0);
    
    const now = audioCtx.currentTime;
    osc.start(now);
    
    // Quick volume envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    // Arpeggio: A4 -> C#5 -> E5 -> A5
    osc.frequency.setValueAtTime(440, now);          // A4
    osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
    osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
    osc.frequency.setValueAtTime(880, now + 0.3);    // A5
    
    osc.stop(now + 0.5);
}

// 3. Error Buzz (Wrong Code)
export function playError() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const { osc, gain } = createOscillator('sawtooth', 150, 0);
    const now = audioCtx.currentTime;
    
    osc.start(now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    // Dissonant frequency drop
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    
    osc.stop(now + 0.3);
}

// 4. UI Click (Buttons and Tabs)
export function playClick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Short, muffled noise burst (like clicking a physical folder or pressing a tactile button)
    const bufferSize = audioCtx.sampleRate * 0.02; // 20ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    // Lowpass filter to muffle it (makes it sound like a solid thud/click rather than static)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
}

// 5. Switch Click (UV Toggle)
export function playSwitch() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const { osc, gain } = createOscillator('triangle', 200, 0);
    const now = audioCtx.currentTime;
    
    osc.start(now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    // Fast pitch drop for a "thump/click" feel
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
    
    osc.stop(now + 0.08);
}

// 6. Victory Fanfare (Escaped)
export function playVictory() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major pentatonic run
    
    notes.forEach((freq, i) => {
        const { osc, gain } = createOscillator('sine', freq, 0);
        osc.start(now + i * 0.15);
        
        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
        
        if (i === notes.length - 1) {
            // Last note rings out longer
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 2.0);
            osc.stop(now + i * 0.15 + 2.0);
        } else {
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
            osc.stop(now + i * 0.15 + 0.3);
        }
    });
}

// 7. Game Over Siren (Toxin Released)
export function playGameOver() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    
    // Create a descending, dissonant siren
    for (let i = 0; i < 3; i++) {
        const { osc, gain } = createOscillator('sawtooth', 400, 0);
        const startTime = now + i * 1.5;
        
        osc.start(startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gain.gain.linearRampToValueAtTime(0.01, startTime + 1.4);
        
        // Pitch drop
        osc.frequency.setValueAtTime(400, startTime);
        osc.frequency.exponentialRampToValueAtTime(100, startTime + 1.4);
        
        osc.stop(startTime + 1.4);
    }
}

// 8. Ambient Room Tone (Plays during the game)
let ambientOsc = null;
let ambientGain = null;

export function startAmbientHum() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (ambientOsc) return; // already playing
    
    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();
    
    ambientOsc.type = 'sine';
    ambientOsc.frequency.value = 55; // Low hum (A1)
    
    // Subtle LFO for the hum to make it pulse
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // 0.2 Hz (very slow)
    
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 5; // modulate frequency by +/- 5 Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(ambientOsc.frequency);
    lfo.start();
    
    ambientOsc.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    
    ambientGain.gain.value = 0;
    ambientGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 3); // Fade in over 3 seconds
    
    ambientOsc.start();
}

export function stopAmbientHum() {
    if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 1);
        setTimeout(() => {
            if (ambientOsc) {
                ambientOsc.stop();
                ambientOsc = null;
                ambientGain = null;
            }
        }, 1000);
    }
}
