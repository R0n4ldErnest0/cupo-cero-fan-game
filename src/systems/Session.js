// State that outlives a single scene: credits, free play, number of players, chosen characters,
// the mission a new game starts on (stage select) and the current run (players carried between missions).
const Session = {
  credits: CFG.CREDITS.START,
  freePlay: false,
  numPlayers: 1,
  chars: ['chato', null],
  startMission: 0,
  startSection: 0, // ?section=N (testing): the first mission starts in that section
  run: null,

  load() {
    try {
      this.freePlay = localStorage.getItem('cupocero.freePlay') === '1';
    } catch (e) { /* storage unavailable: keep default */ }
    if (!CFG.DEV) return;
    const m = /[?&]mission=(\d+)/.exec(location.search);
    if (m) this.startMission = Phaser.Math.Clamp(+m[1] - 1, 0, MISSIONS.length - 1);
    const sec = /[?&]section=(\d+)/.exec(location.search);
    if (sec) this.startSection = Math.max(0, +sec[1] - 1);
  },

  // A new game: players carried between missions, and the clues found for the expediente (kept all game long).
  newRun() {
    this.run = { players: null, clues: [], freed: 0 };
  },

  hasClue(id) {
    return !!(this.run && this.run.clues && this.run.clues.includes(id));
  },

  addClue(id) {
    this.run = this.run || { players: null, clues: [] };
    this.run.clues = this.run.clues || [];
    if (!this.run.clues.includes(id)) this.run.clues.push(id);
  },

  // Stage select (testing): cycles the mission a new game starts on.
  cycleStartMission() {
    this.startMission = (this.startMission + 1) % MISSIONS.length;
    this.startSection = 0;
  },

  toggleFreePlay() {
    this.freePlay = !this.freePlay;
    try {
      localStorage.setItem('cupocero.freePlay', this.freePlay ? '1' : '0');
    } catch (e) { /* ignore */ }
  },

  addCredit() {
    this.credits = Math.min(CFG.CREDITS.MAX, this.credits + 1);
  },

  canPay(n = 1) {
    return this.freePlay || this.credits >= n;
  },

  pay(n = 1) {
    if (!this.canPay(n)) return false;
    if (!this.freePlay) this.credits -= n;
    return true;
  },

  creditText() {
    return this.freePlay ? 'FREE PLAY' : `CRÉDITOS ${this.credits}`;
  },
};
