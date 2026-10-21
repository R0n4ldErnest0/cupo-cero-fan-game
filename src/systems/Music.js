// Background music: one track per mission, plus title, boss and jingles.
// A recorded file listed in assets/music/music.json ({ "m1": "m1.mp3", "boss": { "file": "boss.ogg", "vol": 1.2 } },
// see assets/music/README.md) plays looped through WebAudio; any track without a file is synthesized from SONGS.
// play() can be called before the audio starts (browser autoplay rules): the track starts once Sfx.init() runs.
const Music = {
  files: {},
  buffers: {},
  current: null, // id of the track playing (or waiting for the audio to start)
  track: null,   // { id, gain, timer | src }

  // Drum, bass and chord patterns, per 16-step bar. bass: step -> interval above the chord root.
  STYLES: {
    cumbia: { kick: [0, 8], guiro: true, bass: { 0: 0, 6: 7, 8: 7, 12: 0, 14: 12 }, stab: [2, 6, 10, 14], fill: true },
    huayno: { kick: [0, 8], snare: [4, 12], hat: 2, bass: { 0: 0, 4: 7, 8: 0, 12: 7 }, stab: [2, 6, 10, 14], fill: true },
    noir: { kick: [0, 10], snare: [8], hat: 4, bass: { 0: 0, 3: 0, 8: 0, 10: 7 }, pad: true },
    march: { kick: [0, 8], snare: [4, 12, 14, 15], hat: 2, bass: { 0: 0, 4: 0, 8: 7, 12: 0 }, pad: true, fill: true },
    boss: { kick: [0, 4, 8, 12, 14], snare: [4, 12], hat: 1, pulse: true, pad: true, fill: true },
    jingle: { kick: [0, 8], snare: [4, 12], bass: { 0: 0, 8: 7 }, stab: [0, 4, 8, 12] },
    none: { bass: { 0: 0, 8: 7 }, pad: true },
  },

  // Called by Sfx.init(), once there's an AudioContext.
  wake() {
    if (this.woken) return;
    this.woken = true;
    fetch('assets/music/music.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((list) => {
        this.files = list;
        Object.keys(list).forEach((id) => this.load(id));
      })
      .catch(() => {})
      .finally(() => {
        const id = this.current;
        this.current = null;
        if (id) this.play(id, this.wantOpts);
      });
  },

  load(id) {
    const entry = this.files[id];
    const file = typeof entry === 'string' ? entry : entry.file;
    return (this.buffers[id] = this.buffers[id] || fetch(`assets/music/${file}`)
      .then((r) => r.arrayBuffer())
      .then((data) => Sfx.ctx.decodeAudioData(data))
      .catch(() => console.warn(`Music: could not load ${file}`)));
  },

  // Start a track (no-op if it's already playing). opts.loop = false plays it once (jingles loop: false by default).
  play(id, opts = {}) {
    if (!SONGS[id] && !this.files[id]) id = 'm1';
    if (id === this.current) return;
    this.stop(0.5);
    this.current = id;
    this.wantOpts = opts;
    if (!Sfx.ctx || !this.woken) return; // starts in wake()
    const ctx = Sfx.ctx;
    const gain = ctx.createGain();
    gain.connect(Sfx.musicBus);
    const track = (this.track = { id, gain });
    if (this.files[id]) {
      const entry = this.files[id];
      gain.gain.value = (entry.vol || 1) * 1.5;
      this.load(id).then((buf) => {
        if (!buf || this.track !== track) return;
        const src = (track.src = ctx.createBufferSource());
        src.buffer = buf;
        src.loop = opts.loop ?? !(entry.once ?? (SONGS[id] && SONGS[id].once));
        src.connect(gain);
        src.onended = () => this.ended(track);
        src.start();
      });
      return;
    }
    gain.gain.value = 1;
    const song = this.compile(id);
    track.song = song;
    track.loop = opts.loop ?? !song.once;
    track.bar = 0;
    track.stepN = 0;
    track.next = ctx.currentTime + 0.1;
    Sfx.echo.delayTime.value = song.step * 1.5;
    track.timer = setInterval(() => this.tick(track), 25);
  },

  stop(fade = 0.3) {
    const tr = this.track;
    this.current = null;
    this.track = null;
    if (!tr) return;
    if (tr.timer) clearInterval(tr.timer);
    const t = Sfx.ctx.currentTime;
    tr.gain.gain.setValueAtTime(tr.gain.gain.value, t);
    tr.gain.gain.linearRampToValueAtTime(0, t + fade);
    setTimeout(() => {
      if (tr.src) try { tr.src.stop(); } catch (e) { /* already ended */ }
      tr.gain.disconnect();
    }, fade * 1000 + 100);
  },

  ended(track) {
    if (this.track !== track) return;
    this.track = null;
    this.current = null;
  },

  // Song data -> a flat list of bars ({ root, bass, chord, lead: [{ midi, len } | null x16], last }).
  compile(id) {
    if (this.compiled && this.compiled[id]) return this.compiled[id];
    const s = SONGS[id];
    const bars = [];
    s.order.split(' ').forEach((name) => {
      const part = s.parts[name];
      const chords = part.chords.split(' ');
      part.lead.forEach((line, i) => {
        const tokens = line.split(' ');
        if (tokens.length !== 16) console.warn(`Music: ${id} part ${name} bar ${i + 1} has ${tokens.length} steps`);
        const lead = tokens.map(() => null);
        tokens.forEach((tok, k) => {
          if (tok === '.' || tok === '-') return;
          let len = 1;
          while (tokens[k + len] === '-') len++;
          lead[k] = { midi: NOTE(tok), len };
        });
        bars.push(Object.assign(this.chord(chords[i % chords.length]), { lead, last: i === part.lead.length - 1 }));
      });
    });
    const song = { bars, once: s.once, lead: s.lead, style: this.STYLES[s.style], step: 60 / s.bpm / 4 };
    (this.compiled = this.compiled || {})[id] = song;
    return song;
  },

  // 'C#m' -> bass root between E2 and D#3, and a triad voiced between G3 and F#4.
  chord(name) {
    const m = /^([A-G]#?)(m?)$/.exec(name);
    const pc = NOTE(`${m[1]}4`) % 12;
    const bass = 40 + ((pc - 4 + 12) % 12);
    const base = 55 + ((pc - 7 + 12) % 12);
    return { bass, chord: [base, base + (m[2] ? 3 : 4), base + 7] };
  },

  tick(track) {
    const ctx = Sfx.ctx, song = track.song;
    // A background tab throttles timers: skip ahead instead of playing a burst of late notes.
    if (track.next < ctx.currentTime - 0.2) track.next = ctx.currentTime + 0.05;
    while (track.next < ctx.currentTime + 0.12) {
      this.step(track, song.bars[track.bar], track.stepN, track.next);
      track.next += song.step;
      if (++track.stepN === 16) {
        track.stepN = 0;
        if (++track.bar === song.bars.length) {
          if (!track.loop) {
            clearInterval(track.timer);
            setTimeout(() => this.ended(track), 1500);
            return;
          }
          track.bar = 0;
        }
      }
    }
  },

  step(track, bar, s, t) {
    const song = track.song, st = song.style, dest = track.gain, dur = song.step;
    const fill = st.fill && bar.last && s >= 12;
    if (st.kick && st.kick.includes(s)) Sfx.tone('sine', 110, 40, 0.18, 0.5, { when: t, dest });
    if (fill) Sfx.tone('sine', 260 - (s - 12) * 35, 90, 0.12, 0.3, { when: t, dest }); // timbales / tom roll
    else if (st.snare && st.snare.includes(s)) {
      Sfx.noise(0.12, 0.22, { type: 'bandpass', f0: 1800, f1: 900, when: t, dest });
      Sfx.tone('triangle', 190, 140, 0.06, 0.12, { when: t, dest });
    }
    if (st.hat && s % st.hat === 0) Sfx.noise(0.03, s % 4 === 0 ? 0.05 : 0.03, { type: 'highpass', f0: 7000, when: t, dest });
    if (st.guiro) {
      // güiro: long-short-short on every beat
      if (s % 4 === 0) Sfx.noise(0.1, 0.05, { type: 'bandpass', f0: 5000, f1: 3000, when: t, dest });
      else if (s % 4 >= 2) Sfx.noise(0.035, 0.04, { type: 'bandpass', f0: 6000, when: t, dest });
    }
    if (st.pulse) Sfx.tone('triangle', mtof(bar.bass + (s % 4 === 2 ? 12 : 0)), null, dur * 0.9, 0.3, { when: t, dest });
    else if (st.bass && st.bass[s] !== undefined) Sfx.tone('triangle', mtof(bar.bass + st.bass[s]), null, 0.22, 0.35, { when: t, dest });
    if (st.stab && st.stab.includes(s)) bar.chord.forEach((n) => Sfx.tone('triangle', mtof(n), null, 0.08, 0.025, { when: t, dest }));
    if (st.pad && s === 0) bar.chord.forEach((n) => this.note('triangle', mtof(n), dur * 16, 0.02, t, dest));
    const n = bar.lead[s];
    if (n) {
      const vol = song.lead === 'sawtooth' ? 0.035 : song.lead === 'triangle' ? 0.09 : 0.05;
      this.note(song.lead, mtof(n.midi), n.len * dur, vol, t, dest, true);
    }
  },

  // A held note (Sfx.tone fades out over its whole length), with vibrato and echo for the lead.
  note(type, f, dur, vol, t, dest, lead) {
    const ctx = Sfx.ctx;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    if (lead) {
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 6;
      lg.gain.value = f * 0.012;
      lfo.connect(lg).connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.1);
      g.connect(Sfx.echo);
    }
    const end = t + Math.max(0.06, dur * 0.95);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.linearRampToValueAtTime(vol * 0.7, Math.max(t + 0.01, end - 0.05));
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(end + 0.05);
  },
};
