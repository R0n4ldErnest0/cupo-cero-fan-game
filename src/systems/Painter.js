// Tiny pixel painter used to generate all placeholder textures at boot.
// Draw with primitives or ASCII grids, then register() it as a Phaser texture.

const PAL = {
  k: '#1b1b22', // outline
  w: '#f4f4f4',
  h: '#2b1d14', // hair
  s: '#c98a5a', // skin
  S: '#9a6438', // skin shade
  g: '#9aa0a8', // metal
  G: '#5a6068', // dark metal
  n: '#c8a165', // rope / light wood
  N: '#5b3a20', // dark wood / hat
  r: '#d8343a',
  y: '#f2c94c',
};

// 3x5 pixel font for text baked into textures (signs, decals).
const FONT3X5 = {
  A: '.#.|#.#|###|#.#|#.#', B: '##.|#.#|##.|#.#|##.', C: '.##|#..|#..|#..|.##', D: '##.|#.#|#.#|#.#|##.',
  E: '###|#..|##.|#..|###', F: '###|#..|##.|#..|#..', G: '.##|#..|#.#|#.#|.##', H: '#.#|#.#|###|#.#|#.#',
  I: '###|.#.|.#.|.#.|###', J: '..#|..#|..#|#.#|.#.', K: '#.#|#.#|##.|#.#|#.#', L: '#..|#..|#..|#..|###',
  M: '#.#|###|###|#.#|#.#', N: '##.|#.#|#.#|#.#|#.#', O: '.#.|#.#|#.#|#.#|.#.', P: '##.|#.#|##.|#..|#..',
  Q: '.#.|#.#|#.#|##.|.##', R: '##.|#.#|##.|#.#|#.#', S: '.##|#..|.#.|..#|##.', T: '###|.#.|.#.|.#.|.#.',
  U: '#.#|#.#|#.#|#.#|###', V: '#.#|#.#|#.#|#.#|.#.', W: '#.#|#.#|###|###|#.#', X: '#.#|#.#|.#.|#.#|#.#',
  Y: '#.#|#.#|.#.|.#.|.#.', Z: '###|..#|.#.|#..|###',
  0: '###|#.#|#.#|#.#|###', 1: '.#.|##.|.#.|.#.|###', 2: '##.|..#|.#.|#..|###', 3: '##.|..#|.#.|..#|##.',
  4: '#.#|#.#|###|..#|..#', 5: '###|#..|##.|..#|##.', 6: '.##|#..|###|#.#|###', 7: '###|..#|.#.|.#.|.#.',
  8: '###|#.#|###|#.#|###', 9: '###|#.#|###|..#|##.',
  '-': '...|...|###|...|...', '!': '.#.|.#.|.#.|...|.#.', '.': '...|...|...|...|.#.', '/': '..#|..#|.#.|#..|#..',
  $: '.##|##.|.#.|.##|##.', '?': '##.|..#|.#.|...|.#.', "'": '.#.|.#.|...|...|...', ' ': '...|...|...|...|...',
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Painter {
  constructor(w, h, opts = {}) {
    this.w = w;
    this.h = h;
    this.wrapX = !!opts.wrapX; // for seamless tiling backgrounds
    this.px = new Array(w * h).fill(null);
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (this.wrapX) x = ((x % this.w) + this.w) % this.w;
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c;
    return this;
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.px[y * this.w + x];
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }

  clear(x, y, w, h) {
    return this.rect(x, y, w, h, null);
  }

  disc(cx, cy, r, c) {
    const r2 = r * r + r * 0.6;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r2) this.set(cx + x, cy + y, c);
    return this;
  }

  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return this;
  }

  // rows: array of strings, one char per pixel, '.' = transparent. Unknown chars render magenta.
  grid(rows, ox = 0, oy = 0, pal = PAL, flip = false) {
    const W = Math.max(...rows.map((r) => r.length));
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') continue;
        this.set(ox + (flip ? W - 1 - x : x), oy + y, pal[ch] || PAL[ch] || '#ff00ff');
      }
    });
    return this;
  }

  text(str, x, y, c) {
    let cx = x;
    for (const ch of str.toUpperCase()) {
      const g = FONT3X5[ch];
      if (g) g.split('|').forEach((row, j) => {
        for (let i = 0; i < 3; i++) if (row[i] === '#') this.set(cx + i, y + j, c);
      });
      cx += 4;
    }
    return this;
  }

  static textWidth(str) {
    return str.length * 4 - 1;
  }

  // Adds a 1px outline around every opaque shape (4-neighbourhood).
  outline(c = PAL.k) {
    const src = this.px.slice();
    const at = (x, y) => (x < 0 || y < 0 || x >= this.w || y >= this.h ? null : src[y * this.w + x]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (src[y * this.w + x]) continue;
        if (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1)) this.px[y * this.w + x] = c;
      }
    }
    return this;
  }

  static rgba(hex) {
    Painter._cache = Painter._cache || {};
    if (Painter._cache[hex]) return Painter._cache[hex];
    const h = hex.slice(1);
    const v = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    v.push(h.length >= 8 ? parseInt(h.slice(6, 8), 16) : 255);
    return (Painter._cache[hex] = v);
  }

  toCanvas() {
    const c = document.createElement('canvas');
    c.width = this.w;
    c.height = this.h;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(this.w, this.h);
    for (let i = 0; i < this.px.length; i++) {
      const col = this.px[i];
      if (col) img.data.set(Painter.rgba(col), i * 4);
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  register(scene, key) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, this.toCanvas());
    return key;
  }
}
