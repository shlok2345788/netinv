// Highly Advanced Cinematic Audio Synthesizer for "Ariya Diary" (Aarav & Siya)
// Optimized to resolve browser audio constraints and synthesize high-fidelity romantic orchestral sounds.

class CinematicAudioEngine {
  public ctx: AudioContext | null = null;
  private pianoInterval: any = null;
  private isThemePlaying = false;
  private masterVolume = 0.7;
  
  // Nodes for ambient drone
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  public masterGain: GainNode | null = null;

  // Cinematic reverb delay nodes
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  // Initialize the audio context - must be triggered directly inside a user click thread
  public initContext() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master output volume control
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Reverb/Cinema Delay network
      this.delayNode = this.ctx.createDelay(2.0);
      this.delayNode.delayTime.setValueAtTime(0.75, this.ctx.currentTime); // 750ms reflection

      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.42, this.ctx.currentTime); // Rich feedback loop

      this.masterGain.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode);
      this.delayGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Direct unlock call from click listener
  public unlock() {
    this.initContext();
    console.log("Audio Context unlocked. Current state:", this.ctx?.state);
  }

  // 1. Atmospheric low-frequency drone (subwoofer simulation)
  public startAtmosDrone() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Create drone gain
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, now);
    this.droneGain.gain.linearRampToValueAtTime(0.45, now + 1.5); // Warm fade-in

    // Detuned low oscillators for sub-bass rumble (48Hz + 52Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(48, now);

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(52, now);

    // Filter to keep only the deep rumble
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(70, now);

    this.droneOsc1.connect(lowpass);
    this.droneOsc2.connect(lowpass);
    lowpass.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  public stopAtmosDrone() {
    if (this.droneGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      const d1 = this.droneOsc1;
      const d2 = this.droneOsc2;
      setTimeout(() => {
        try { d1?.stop(); d2?.stop(); } catch(e){}
      }, 600);
    }
  }

  // 2. Whoosh transition sound (filtered white noise sweep)
  public playWhoosh(duration: number = 2.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Create noise buffer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Sweeping bandpass filter to create the "air rush" whoosh
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(2.5, now);
    bandpass.frequency.setValueAtTime(100, now);
    bandpass.frequency.exponentialRampToValueAtTime(1600, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.55, now + duration * 0.75);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  // 3. Impact "Tudum" sound (detuned bass drop + metallic chime strike)
  public playTudum() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.stopAtmosDrone();

    // Sound Impact 1: Detuned Sub Bass Drop ("Tu-")
    this.playSubStrike(now, 0.22, 92, 0.85);
    // Sound Impact 2: Huge Sub Bass drop + Chime ("-dum")
    this.playSubStrike(now + 0.22, 0.9, 65, 1.4);
    this.playMetallicChime(now + 0.22, 1.5, 0.6);
  }

  private playSubStrike(startTime: number, duration: number, pitch: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;

    const oscSub = this.ctx.createOscillator();
    const oscTri = this.ctx.createOscillator();
    const strikeGain = this.ctx.createGain();

    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(pitch, startTime);
    oscSub.frequency.exponentialRampToValueAtTime(pitch * 0.48, startTime + duration);

    oscTri.type = 'triangle';
    oscTri.frequency.setValueAtTime(pitch * 0.48, startTime);

    strikeGain.gain.setValueAtTime(0, startTime);
    strikeGain.gain.linearRampToValueAtTime(vol * 0.8, startTime + 0.015);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscSub.connect(strikeGain);
    oscTri.connect(strikeGain);
    strikeGain.connect(this.masterGain);

    oscSub.start(startTime);
    oscSub.stop(startTime + duration);
    oscTri.start(startTime);
    oscTri.stop(startTime + duration);
  }

  private playMetallicChime(startTime: number, duration: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;

    // Metallic plucks combine high frequency square/triangle waves that are slightly detuned
    const freqs = [350, 700, 1050, 1400, 2100];
    const chimeGain = this.ctx.createGain();
    
    chimeGain.gain.setValueAtTime(0, startTime);
    chimeGain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    chimeGain.connect(this.masterGain);

    freqs.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);
      osc.connect(chimeGain);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // 4. Slow, romantic orchestral piano & string pad loop
  public startTheme() {
    if (this.isThemePlaying) return;
    this.initContext();
    this.isThemePlaying = true;

    // Notes mapped to frequencies (low octaves for strings, mid-high for piano)
    const notes = {
      C2: 65.41, G2: 98.00, C3: 130.81, E3: 164.81, G3: 196.00, B3: 246.94,
      C4: 261.63, E4: 329.63, G4: 392.00, B4: 493.88, D5: 587.33, E5: 659.25, G5: 783.99,
      A1: 55.00, E2: 82.41, A2: 110.00, C4_A: 261.63, E4_A: 329.63, A4: 440.00, B4_A: 493.88, C5: 523.25, E5_A: 659.25,
      F1: 43.65, C2_F: 65.41, F2: 87.31, A3: 220.00, C4_F: 261.63, E4_F: 329.63, G4_F: 392.00, A4_F: 440.00, C5_F: 523.25,
      G1: 49.00, D2: 73.42, G2_G: 98.00, B3_G: 246.94, D4: 293.66, G4_G: 392.00, B4_G: 493.88, D5_G: 587.33
    };

    let loopIndex = 0;

    const playLoop = () => {
      if (!this.ctx || !this.isThemePlaying) return;
      const now = this.ctx.currentTime;

      // 1. Strings Pad Synth (warm low-pass sawtooth/triangle waves, 4.5 seconds duration)
      this.playStringsPad(notes.C2, now, 4.4, 0.28);
      this.playStringsPad(notes.G2, now, 4.4, 0.22);
      
      if (loopIndex % 4 === 0) {
        // Cmaj9
        this.playPianoNote(notes.C3, now, 4.2, 0.45);
        this.playPianoNote(notes.G3, now + 0.1, 4.1, 0.3);
        this.playPianoNote(notes.B3, now + 0.2, 4.0, 0.35);
        this.playPianoNote(notes.E4, now + 0.35, 3.8, 0.3);
        this.playPianoNote(notes.G4, now + 0.5, 3.5, 0.3);
        
        // Melody line
        this.playPianoNote(notes.B4, now + 1.2, 2.5, 0.28);
        this.playPianoNote(notes.C5, now + 2.0, 1.8, 0.32);
        this.playPianoNote(notes.D5, now + 2.8, 1.5, 0.25);
      } else if (loopIndex % 4 === 1) {
        // Am9
        this.playStringsPad(notes.A1, now, 4.4, 0.3);
        this.playStringsPad(notes.E2, now, 4.4, 0.25);

        this.playPianoNote(notes.A2, now, 4.2, 0.48);
        this.playPianoNote(notes.A3, now + 0.15, 4.1, 0.35);
        this.playPianoNote(notes.C4_A, now + 0.3, 4.0, 0.3);
        this.playPianoNote(notes.E4_A, now + 0.45, 3.5, 0.3);
        this.playPianoNote(notes.B4_A, now + 0.6, 3.2, 0.38);

        // Melody highlight
        this.playPianoNote(notes.A4, now + 1.6, 2.0, 0.28);
        this.playPianoNote(notes.G4, now + 2.4, 1.5, 0.25);
      } else if (loopIndex % 4 === 2) {
        // Fmaj9
        this.playStringsPad(notes.F1, now, 4.4, 0.3);
        this.playStringsPad(notes.C2_F, now, 4.4, 0.25);

        this.playPianoNote(notes.F2, now, 4.2, 0.48);
        this.playPianoNote(notes.A3, now + 0.15, 4.1, 0.35);
        this.playPianoNote(notes.C4_F, now + 0.3, 4.0, 0.3);
        this.playPianoNote(notes.E4_F, now + 0.45, 3.6, 0.38);
        this.playPianoNote(notes.G4_F, now + 0.6, 3.4, 0.35);

        // Melody
        this.playPianoNote(notes.A4_F, now + 1.2, 2.2, 0.28);
        this.playPianoNote(notes.G4_F, now + 1.8, 1.8, 0.25);
        this.playPianoNote(notes.E4_F, now + 2.4, 1.5, 0.28);
        this.playPianoNote(notes.C4_F, now + 3.0, 1.2, 0.2);
      } else {
        // Gsus4 resolving to G
        this.playStringsPad(notes.G1, now, 4.4, 0.3);
        this.playStringsPad(notes.D2, now, 4.4, 0.25);

        this.playPianoNote(notes.G2_G, now, 4.2, 0.5);
        this.playPianoNote(notes.B3_G, now + 0.15, 4.1, 0.3);
        this.playPianoNote(notes.D4, now + 0.3, 3.8, 0.3);
        this.playPianoNote(notes.G4_G, now + 0.45, 3.5, 0.25);

        // Sus4 note (C5) resolving to B4
        this.playPianoNote(notes.C5, now + 0.8, 1.2, 0.3);
        this.playPianoNote(notes.B4_G, now + 1.8, 2.2, 0.42);
        this.playPianoNote(notes.D5_G, now + 2.5, 1.8, 0.25);
      }

      loopIndex++;
    };

    playLoop();
    this.pianoInterval = setInterval(playLoop, 4500);
  }

  // Beautiful slow piano sound (Sine fundamental + soft octaves)
  private playPianoNote(freq: number, startTime: number, duration: number, velocity: number = 0.4) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime); // Subtle octave sparkle

    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.05); // Soft attack (50ms)
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.25, startTime + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Mix fundamental & octave
    const gainH1 = this.ctx.createGain();
    gainH1.gain.setValueAtTime(0.75, startTime);
    
    const gainH2 = this.ctx.createGain();
    gainH2.gain.setValueAtTime(0.18, startTime);

    osc1.connect(gainH1).connect(noteGain);
    osc2.connect(gainH2).connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(startTime);
    osc1.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + duration);
  }

  // Cinematic Strings Pad synthesizer (Triangle wave + lowpass filter)
  private playStringsPad(freq: number, startTime: number, duration: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const padGain = this.ctx.createGain();

    // Triangle wave for smooth, warm horn/string-like textures
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // Lowpass filter to shave off high harsh harmonics
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration * 0.5);

    padGain.gain.setValueAtTime(0, startTime);
    padGain.gain.linearRampToValueAtTime(vol, startTime + 1.2); // Extremely slow attack (1.2s)
    padGain.gain.linearRampToValueAtTime(vol * 0.8, startTime + duration - 1.0); // Maintain sustain
    padGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Slow fade-out

    osc.connect(filter);
    filter.connect(padGain);
    padGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public stopTheme() {
    this.isThemePlaying = false;
    if (this.pianoInterval) {
      clearInterval(this.pianoInterval);
      this.pianoInterval = null;
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      
      setTimeout(() => {
        if (!this.isThemePlaying && this.ctx) {
          this.ctx.suspend();
        }
      }, 1600);
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }
}

export const soundEngine = new CinematicAudioEngine();
