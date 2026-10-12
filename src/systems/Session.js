// State that outlives a single scene: credits, free play, number of players, chosen characters.
const Session = {
  credits: CFG.CREDITS.START,
  freePlay: false,
  numPlayers: 1,
  chars: ['chato', null],

  load() {
    try {
      this.freePlay = localStorage.getItem('cupocero.freePlay') === '1';
    } catch (e) { /* storage unavailable: keep default */ }
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
