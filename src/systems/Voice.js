// Announcer voice ("HEAVY MACHINE GUN!", "¡ANTICUCHERA!", "¡MISIÓN CUMPLIDA!").
// Recorded clips listed in assets/voice/voices.json ({ "mg": "mg.ogg", ... }, see assets/voice/README.md) play
// through WebAudio. Lines without a clip (or when opened from file://) use the browser's speech synthesis as a
// placeholder: robotic, but it needs no files.
const Voice = {
  clips: {},
  started: false,

  init() {
    if (this.started || !Sfx.ctx) return;
    this.started = true;
    if (window.speechSynthesis) speechSynthesis.getVoices(); // the list loads asynchronously; start it early
    fetch('assets/voice/voices.json')
      .then((r) => (r.ok ? r.json() : {}))
      .then((list) => Object.entries(list).forEach(([id, file]) => this.load(id, `assets/voice/${file}`)))
      .catch(() => {});
  },

  load(id, url) {
    fetch(url)
      .then((r) => r.arrayBuffer())
      .then((data) => Sfx.ctx.decodeAudioData(data))
      .then((buf) => (this.clips[id] = buf))
      .catch(() => console.warn(`Voice: could not load ${url}`));
  },

  // id: clip name; text/lang: what the speech fallback says.
  say(id, text, lang = 'es') {
    if (Sfx.muted || !Sfx.ctx) return;
    const buf = this.clips[id];
    if (buf) {
      if (this.playing) try { this.playing.stop(); } catch (e) { /* already ended */ }
      const src = (this.playing = Sfx.ctx.createBufferSource());
      src.buffer = buf;
      src.connect(Sfx.sfxBus);
      src.start();
      return;
    }
    this.speak(text, lang);
  },

  speak(text, lang) {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = this.pickVoice(synth, lang);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : lang === 'en' ? 'en-US' : 'es-PE';
    u.rate = 1.1;
    u.pitch = 0.6; // deep "arcade announcer"
    u.volume = 1;
    synth.speak(u);
  },

  // Prefer Latin American Spanish voices (Peru first); any Spanish/English voice otherwise.
  pickVoice(synth, lang) {
    const all = synth.getVoices();
    const prefs = lang === 'en' ? ['en-US', 'en-GB', 'en'] : ['es-PE', 'es-419', 'es-MX', 'es-US', 'es-CO', 'es'];
    for (const p of prefs) {
      const v = all.find((x) => x.lang.replace('_', '-').startsWith(p));
      if (v) return v;
    }
    return null;
  },
};
