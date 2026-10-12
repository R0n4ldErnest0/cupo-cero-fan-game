// Per-player input: keyboard map + optional gamepad, polled once per frame.
// read() returns held states (left, fire, ...) and this-frame presses (leftP, fireP, ...).
const PAD = { A: 0, B: 1, X: 2, Y: 3, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };
const ACTIONS = ['left', 'right', 'up', 'down', 'fire', 'jump', 'bomb', 'start'];

class Controls {
  constructor(scene, map, padIndex = null) {
    this.scene = scene;
    this.padIndex = padIndex;
    this.keys = {};
    ACTIONS.forEach((a) => (this.keys[a] = (map[a] || []).map((k) => scene.input.keyboard.addKey(k))));
    this.prev = null; // first read() primes this, so keys held from the previous scene don't fire
    // Key presses are detected by timestamp, so taps shorter than a frame still count
    // (without consuming them like JustDown would, since players can share keys).
    this.lastRead = performance.now();
  }

  pad() {
    const gp = this.scene.input.gamepad;
    if (!gp || this.padIndex === null || !gp.total) return null;
    return gp.getPad(this.padIndex) || null;
  }

  read() {
    const pad = this.pad();
    const since = this.lastRead;
    this.lastRead = performance.now();
    const tapped = (a) => this.keys[a].some((k) => k.timeDown > since);
    const key = (a) => tapped(a) || this.keys[a].some((k) => k.isDown);
    const btn = (i) => !!(pad && pad.buttons[i] && pad.buttons[i].pressed);
    const sx = pad ? pad.leftStick.x : 0, sy = pad ? pad.leftStick.y : 0;
    const cur = {
      left: key('left') || btn(PAD.LEFT) || sx < -0.5,
      right: key('right') || btn(PAD.RIGHT) || sx > 0.5,
      up: key('up') || btn(PAD.UP) || sy < -0.5,
      down: key('down') || btn(PAD.DOWN) || sy > 0.5,
      fire: key('fire') || btn(PAD.X),
      jump: key('jump') || btn(PAD.A),
      bomb: key('bomb') || btn(PAD.B) || btn(PAD.Y),
      start: key('start') || btn(PAD.START),
    };
    const prev = this.prev || cur;
    this.prev = cur;
    const out = Object.assign({}, cur);
    ACTIONS.forEach((a) => (out[a + 'P'] = (cur[a] && !prev[a]) || tapped(a)));
    return out;
  }

  static none() {
    const o = {};
    ACTIONS.forEach((a) => (o[a] = o[a + 'P'] = false));
    return o;
  }
}
