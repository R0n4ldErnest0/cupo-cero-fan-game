// Synthesized sound effects + a placeholder chicha loop (WebAudio, no asset files).
// Every call is a no-op until init() runs from a user gesture (browser autoplay rules).

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = (name) => {
  const m = /^([A-G])(#?)(\d)$/.exec(name);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
  return 12 * (Number(m[3]) + 1) + base + (m[2] ? 1 : 0);
};

// 4 bars of 16th-note steps over Am - G - F - E (the classic chicha / Andalusian cadence).
const MELODY = [
  'A4 . C5 . E5 . D5 C5 B4 . A4 . C5 . . .',
  'B4 . D5 . G5 . F5 E5 D5 . B4 . G4 . . .',
  'A4 . C5 . F5 . E5 D5 C5 . A4 . F4 . A4 .',
  'G#4 . B4 . E5 . D5 . C5 . B4 . G#4 . . .',
].join(' ').split(' ').map((t) => (t === '.' ? null : NOTE(t)));
const BASS_ROOTS = [45, 43, 41, 40];
const CHORDS = [[57, 60, 64], [55, 59, 62], [53, 57, 60], [52, 56, 59]];
const STEP = 60 / 104 / 4;

const Sfx = {
  ctx: null,
  muted: false,
  music: null,

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(ctx.destination);
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.9;
    this.sfxBus.connect(this.master);
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = 0.3;
    this.musicBus.connect(this.master);
    // Surf-guitar echo for the chicha lead
    this.echo = ctx.createDelay(1);
    this.echo.delayTime.value = STEP * 1.5;
    const fb = ctx.createGain();
    fb.gain.value = 0.3;
    this.echo.connect(fb).connect(this.echo);
    this.echo.connect(this.musicBus);
    this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    Voice.init();
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
  },

  tone(type, f0, f1, dur, vol, o = {}) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = o.when ?? ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (o.vibrato) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = o.vibrato;
      lg.gain.value = f0 * 0.02;
      lfo.connect(lg).connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.05);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(o.dest || this.sfxBus);
    if (o.echo) g.connect(this.echo);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  },

  noise(dur, vol, o = {}) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = o.when ?? ctx.currentTime;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = this.noiseBuf;
    f.type = o.type || 'lowpass';
    f.frequency.setValueAtTime(o.f0 || 2000, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(o.dest || this.sfxBus);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  },

  shoot() { this.tone('square', 880, 220, 0.08, 0.1); this.noise(0.05, 0.08, { type: 'highpass', f0: 4000 }); },
  mg() { this.tone('sawtooth', 520, 140, 0.06, 0.07); this.noise(0.04, 0.1, { type: 'highpass', f0: 3000 }); },
  rocket() { this.noise(0.35, 0.12, { type: 'bandpass', f0: 1200, f1: 4000 }); this.tone('square', 300, 900, 0.2, 0.04); },
  flame() { this.noise(0.3, 0.2, { f0: 900, f1: 300 }); },
  shotgun() { this.noise(0.35, 0.45, { f0: 3000, f1: 150 }); this.tone('square', 140, 50, 0.18, 0.15); },
  rooster() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.07, 0.14].forEach((d, i) => this.tone('square', 700 + i * 120, 500, 0.06, 0.05, { when: t + d }));
  },
  kick() { this.tone('sine', 160, 60, 0.1, 0.25); this.noise(0.04, 0.1, { f0: 1200 }); },
  drone() { this.tone('sawtooth', 900, 1100, 0.12, 0.04, { vibrato: 40 }); },
  laser() { this.tone('square', 1800, 1500, 0.07, 0.03); },
  stone() { this.noise(0.08, 0.1, { type: 'bandpass', f0: 2500, f1: 1200 }); },
  knifeDraw() { this.tone('triangle', 1400, 2600, 0.1, 0.05); },
  slash() { this.noise(0.12, 0.25, { type: 'highpass', f0: 2500, f1: 6000 }); },
  whack() { this.tone('square', 200, 60, 0.08, 0.14); this.noise(0.06, 0.2, { f0: 1500 }); },
  firework() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.noise(0.3, 0.3, { f0: 2500, f1: 300 });
    for (let i = 0; i < 6; i++) this.noise(0.03, 0.12, { type: 'highpass', f0: 5000, when: t + 0.08 + i * 0.05 + Math.random() * 0.03 });
  },
  feathers() { this.noise(0.25, 0.15, { type: 'bandpass', f0: 3000, f1: 1500 }); this.tone('square', 1200, 900, 0.15, 0.04, { vibrato: 20 }); },
  enemyShot() { this.tone('square', 500, 180, 0.09, 0.06); },
  jump() { this.tone('square', 260, 520, 0.12, 0.06); },
  throw() { this.tone('triangle', 400, 900, 0.12, 0.08); },
  hit() { this.tone('sawtooth', 220, 90, 0.1, 0.12); },
  cannon() { this.noise(0.3, 0.4, { f0: 2500, f1: 200 }); this.tone('square', 180, 50, 0.2, 0.15); },
  explode(big) {
    this.noise(big ? 0.9 : 0.5, 0.5, { f0: 1800, f1: 80 });
    this.tone('sine', 120, 35, big ? 0.6 : 0.35, 0.4);
  },
  scream() { this.tone('sawtooth', 650 + Math.random() * 300, 240, 0.3, 0.05, { vibrato: 14 }); },
  playerDie() { this.tone('square', 600, 80, 0.7, 0.12, { vibrato: 10 }); },
  splash() { this.noise(0.25, 0.25, { type: 'highpass', f0: 1500, f1: 600 }); },
  rev() { this.tone('sawtooth', 60, 180, 0.7, 0.1); },
  pickup() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [660, 880, 1320].forEach((f, i) => this.tone('square', f, f, 0.08, 0.08, { when: t + i * 0.06 }));
  },
  coin() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tone('square', 988, 988, 0.07, 0.08, { when: t });
    this.tone('square', 1319, 1319, 0.25, 0.08, { when: t + 0.07 });
  },
  horn() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [0, 0.22].forEach((d) => {
      this.tone('square', 440, 440, 0.16, 0.06, { when: t + d });
      this.tone('square', 554, 554, 0.16, 0.06, { when: t + d });
    });
  },
  fanfare() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [72, 76, 79, 84, 79, 84].forEach((m, i) => this.tone('square', mtof(m), mtof(m), i === 5 ? 0.6 : 0.14, 0.08, { when: t + i * 0.13 }));
  },

  startMusic() {
    if (!this.ctx || this.music) return;
    this.music = { step: 0, next: this.ctx.currentTime + 0.1 };
    this.music.timer = setInterval(() => this._tick(), 25);
  },

  stopMusic() {
    if (!this.music) return;
    clearInterval(this.music.timer);
    this.music = null;
  },

  _tick() {
    const m = this.music;
    if (!m) return;
    while (m.next < this.ctx.currentTime + 0.12) {
      this._step(m.step, m.next);
      m.next += STEP;
      m.step = (m.step + 1) % 64;
    }
  },

  _step(step, t) {
    const bar = Math.floor(step / 16), s = step % 16;
    const dest = this.musicBus;
    // güiro: long-short-short on every beat
    if (s % 4 === 0) this.noise(0.1, 0.05, { type: 'bandpass', f0: 5000, f1: 3000, when: t, dest });
    else if (s % 4 >= 2) this.noise(0.035, 0.04, { type: 'bandpass', f0: 6000, when: t, dest });
    if (s === 0 || s === 8) this.tone('sine', 110, 40, 0.18, 0.5, { when: t, dest });
    // cumbia bass
    const root = BASS_ROOTS[bar];
    const bass = { 0: root, 6: root + 7, 8: root + 7, 12: root, 14: root + 12 }[s];
    if (bass) this.tone('triangle', mtof(bass), null, 0.22, 0.35, { when: t, dest });
    // off-beat chord "chucu"
    if (s % 4 === 2) CHORDS[bar].forEach((n) => this.tone('triangle', mtof(n), null, 0.08, 0.025, { when: t, dest }));
    const note = MELODY[step];
    if (note) this.tone('square', mtof(note), null, 0.2, 0.05, { when: t, dest, vibrato: 6, echo: true });
  },
};
