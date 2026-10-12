// Procedural placeholder art. Every texture key used by the game is created here, so real
// sprite sheets can later replace them by loading images under the same keys.

// ---- Humanoids: head (9 rows) + torso (8) + legs (7) = 16x24, facing right ----
const HUMAN = {
  HEADS: {
    driver: [
      '................',
      '......kkkkk.....',
      '.....kHHHHHk....',
      '....kHHHHHHHk...',
      '....kkkkkkkkkkk.',
      '.....khssssk....',
      '.....khsskssk...',
      '.....kssMMMMk...',
      '......kksssk....',
    ],
    cop: [
      '................',
      '......kkkkk.....',
      '.....kHHyHHk....',
      '....kHHHHHHHk...',
      '....kkkkkkkkkkk.',
      '.....kYssssk....',
      '.....kYsskssk...',
      '.....ksMMMMSk...',
      '......kksssk....',
    ],
    merc: [
      '................',
      '......kkkkk.....',
      '.....kBBBBBk....',
      '....kBBBBBBBk...',
      '...kBkBBBBBBk...',
      '.....khsssssk...',
      '.....kkkkkkkk...',
      '.....ksssSssk...',
      '......kSSSSk....',
    ],
    cobradora: [
      '................',
      '......kkkkk.....',
      '.....khhhhhk....',
      '....khhhhhhhk...',
      '...khhhhhhhhk...',
      '..khhkssssshk...',
      '..khhksssksk....',
      '...kkkssssrk....',
      '.....kkssSk.....',
    ],
    thug: [
      '................',
      '......kkkkk.....',
      '.....kQQQQQk....',
      '....kQQQQQQQk...',
      '....kQQQQQQQk...',
      '.....ksssssk....',
      '.....ksssksk....',
      '.....kXXXXXXk...',
      '......kXXXXk....',
    ],
  },
  TORSO: {
    fwd: [
      '.....kCCCCk.....',
      '....kCCCCCCkkkk.',
      '....kCCCCssggggk',
      '....kCCCCCkkkGk.',
      '....kCCCCCk.kk..',
      '....kCCCCCk.....',
      '....kkkkkkk.....',
      '....kPPPPPk.....',
    ],
    up: [
      '.....kCCCCCCk...',
      '....kCCCCCCCk...',
      '....kCCCCCCk....',
      '....kCCCCCk.....',
      '....kCCCCCk.....',
      '....kCCCCCk.....',
      '....kkkkkkk.....',
      '....kPPPPPk.....',
    ],
  },
  // Gun held upright, overlaid at (10,4) for the aim-up frames.
  UP_GUN: ['.kk.', 'kggk', 'kggk', 'kGgk', 'kggk', 'kssk', 'kssk'],
  LEGS: {
    stand: [
      '....kPPkPPk.....',
      '....kPPkPPk.....',
      '....kPPkPPk.....',
      '....kPPkPPk.....',
      '....kPPkPPk.....',
      '...kFFFkFFFk....',
      '...kkkkkkkkk....',
    ],
    run1: [
      '....kPPPPPk.....',
      '...kPPk.kPPk....',
      '..kPPk...kPPk...',
      '..kPk.....kPk...',
      '..kPk......kPk..',
      '.kFFk......kFFk.',
      '.kkkk......kkkk.',
    ],
    run2: [
      '....kPPPPk......',
      '....kPPPPk......',
      '.....kPPk.......',
      '.....kPPk.......',
      '.....kPPk.......',
      '....kFFFFk......',
      '....kkkkkk......',
    ],
    run3: [
      '....kPPPPPk.....',
      '....kPPkPPk.....',
      '...kPPk.kPPk....',
      '..kPPk...kPk....',
      '.kPPk....kPk....',
      '.kFFk...kFFk....',
      '.kkkk...kkkk....',
    ],
    jump: [
      '....kPPPPPk.....',
      '...kPPPPPPPk....',
      '..kPPk..kPPk....',
      '..kFFk...kFFk...',
      '..kkkk...kkkk...',
      '................',
      '................',
    ],
  },
  CROUCH_LEGS: [
    '...kPPPPPPPk....',
    '..kPPPPPPPPPk...',
    '..kFFFk.kFFFFk..',
    '..kkkkk.kkkkkk..',
  ],
};

const SKINS = {
  chato: { head: 'driver', pal: { H: '#d8343a', M: '#2b1d14', C: '#7fb8e6', P: '#2c4f86', F: '#5b3a20' } },
  sargento: { head: 'cop', pal: { H: '#2f4f3a', M: '#d8d8d8', Y: '#c8c8c8', C: '#c2ad74', P: '#3f4a35', F: '#1b1b22' } },
  merc: { head: 'merc', pal: { B: '#4a6b2f', C: '#6e7b4a', P: '#5e5236', F: '#2b2b2b' } },
  cobradora: { head: 'cobradora', pal: { C: '#2aa198', P: '#2c4f86', F: '#f4f4f4' } },
  thug: { head: 'thug', pal: { Q: '#2a2a30', X: '#c0282e', C: '#3a3d45', P: '#3a5fa0', F: '#e8e8e8' } },
  thug2: { head: 'thug', pal: { Q: '#3c6e3a', X: '#1b1b22', C: '#7a2e2e', P: '#2b2b33', F: '#e8e8e8' } },
  cobrador: { head: 'driver', pal: { H: '#f4f4f4', M: '#1b1b22', C: '#e3b23c', P: '#1b1b22', F: '#f4f4f4' } },
};

const RUN_CYCLE = ['run1', 'run2', 'run3', 'run2'];

// ---- Emoliente Abuelita: 16x20 ----
const ABU_PAL = { V: '#d6457a', O: '#2f5fb3', g: '#cfcfcf' };
const ABU_BASE = [
  '......kkkk......',
  '.....kNNNNk.....',
  '...kkkNNNNkkk...',
  '....kggggggk....',
  '....kgsssssk....',
  '....kgssksSk....',
  '....kgsssssk....',
  '.....ksSSSk.....',
  '....kVVVVVVk....',
  '...kVyVyVyVVk...',
  '...kVVVVVVVVsk..',
  '...kVyVyVyVVkk..',
  '....kOOOOOOk....',
  '...kOOOOOOOOk...',
  '...kOrOrOrOOk...',
  '..kOOOOOOOOOOk..',
  '..kOrOrOrOrOOk..',
  '..kkkkkkkkkkkk..',
];
const ABU_FEET = {
  a: ['....kss..ssk....', '....kkk..kkk....'],
  b: ['.....kssssk.....', '.....kkkkkk.....'],
};
const ABU_ARM_UP = ['.kk.', 'kssk', 'kssk', '.kVk', '.kVk', '.kVk'];

const Textures = {
  build(scene) {
    this.humans(scene);
    this.abuelita(scene);
    this.combi(scene);
    this.boss(scene);
    this.biker(scene);
    this.projectiles(scene);
    this.fx(scene);
    this.pickups(scene);
    this.props(scene);
    this.backgrounds(scene);
    this.anims(scene);
  },

  humans(scene) {
    for (const [name, skin] of Object.entries(SKINS)) {
      const pal = Object.assign({}, PAL, skin.pal);
      const head = HUMAN.HEADS[skin.head];
      for (const aim of ['fwd', 'up']) {
        for (const legs of Object.keys(HUMAN.LEGS)) {
          const p = new Painter(16, 24);
          p.grid([...head, ...HUMAN.TORSO[aim], ...HUMAN.LEGS[legs]], 0, 0, pal);
          if (aim === 'up') p.grid(HUMAN.UP_GUN, 10, 4, pal);
          p.register(scene, `${name}_${aim}_${legs}`);
        }
      }
      const c = new Painter(16, 24);
      c.grid([...head, ...HUMAN.TORSO.fwd.slice(0, 4), ...HUMAN.CROUCH_LEGS], 0, 7, pal);
      c.register(scene, `${name}_crouch`);
    }
  },

  abuelita(scene) {
    const pal = Object.assign({}, PAL, ABU_PAL);
    const frame = (key, feet, armUp) => {
      const p = new Painter(16, 20);
      p.grid([...ABU_BASE, ...feet], 0, 0, pal);
      if (armUp) p.grid(ABU_ARM_UP, 11, 3, pal);
      p.register(scene, key);
    };
    frame('abu_stand', ABU_FEET.a);
    frame('abu_walk', ABU_FEET.b);
    frame('abu_throw', ABU_FEET.a, true);

    // Tied to a post with a rope.
    const t = new Painter(16, 20);
    t.rect(7, 0, 2, 20, PAL.N);
    t.grid([...ABU_BASE, ...ABU_FEET.a], 0, 0, pal);
    t.rect(2, 9, 12, 1, PAL.n).rect(2, 13, 12, 1, PAL.n);
    t.register(scene, 'abu_tied');
  },

  combi(scene) {
    // 64x34, facing right. Wheels are separate rotating images.
    const p = new Painter(64, 34);
    p.rect(6, 2, 40, 2, PAL.G);
    p.rect(8, 4, 1, 2, PAL.G).rect(44, 4, 1, 2, PAL.G);
    p.rect(2, 6, 52, 22, '#efe6d2');
    for (let y = 6; y < 28; y++) p.rect(54, y, Math.min(9, y - 5), 1, '#efe6d2'); // sloped nose
    [6, 16, 26, 36].forEach((x) => { p.rect(x, 9, 8, 7, '#8fd0ee'); p.set(x + 1, 10, '#ffffff'); });
    for (let y = 9; y < 16; y++) p.rect(48, y, Math.min(8, y - 6), 1, '#8fd0ee'); // windshield
    p.rect(46, 6, 8, 2, PAL.y); // route sign
    p.disc(31, 12, 2, PAL.s).rect(29, 9, 5, 1, PAL.r); // cobrador peeking out
    p.rect(2, 18, 60, 2, '#2c6fd1').rect(2, 20, 60, 2, PAL.r); // stripes
    p.rect(3, 23, 58, 5, '#7d838b');
    for (let x = 5; x < 60; x += 6) p.set(x, 25, '#4a4f56');
    p.rect(60, 21, 4, 5, PAL.G).rect(0, 21, 3, 5, PAL.G);
    p.disc(15, 28, 6, PAL.k).disc(49, 28, 6, PAL.k);
    p.outline();
    p.register(scene, 'combi');

    const c = new Painter(20, 8);
    c.disc(4, 4, 3, PAL.G).rect(4, 2, 13, 4, '#7d838b').rect(16, 1, 3, 6, '#4a4f56').rect(6, 3, 9, 1, '#a9afb7');
    c.outline();
    c.register(scene, 'cannon');

    const w = new Painter(13, 13);
    w.disc(6, 6, 6, PAL.k).disc(6, 6, 3, PAL.g).rect(5, 5, 3, 3, PAL.G).rect(6, 1, 1, 2, '#3a3d45');
    w.register(scene, 'wheel');
  },

  boss(scene) {
    // El Cobrador's armored mototaxi, 90x46, facing LEFT. Wheels separate.
    const p = new Painter(90, 46);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) p.rect(2 + j * 2, 25 + i * 4 + (j >> 1), 8 - j * 2, 1, '#c9ced6'); // spikes
    p.rect(10, 24, 30, 10, '#c0282e');
    p.rect(8, 28, 6, 4, PAL.G);
    p.line(14, 36, 22, 16, PAL.G).line(15, 36, 23, 16, PAL.G);
    p.rect(18, 14, 8, 2, PAL.k);
    p.disc(11, 26, 2, '#ffe066');
    p.rect(26, 21, 14, 3, PAL.k);
    p.rect(38, 12, 48, 26, '#a81f25');
    p.clear(44, 15, 36, 9); // open window, the rider shows through
    p.rect(38, 26, 48, 10, '#7d838b');
    for (let x = 41; x < 86; x += 6) p.set(x, 28, '#4a4f56').set(x, 33, '#4a4f56');
    p.text('$', 50, 29, '#2e7d32').text('$', 70, 29, '#2e7d32');
    p.rect(36, 8, 54, 4, PAL.k);
    p.rect(38, 12, 2, 3, PAL.G).rect(86, 12, 2, 3, PAL.G);
    p.rect(48, 0, 28, 8, PAL.y).text('CUPO', 54, 2, '#c0282e');
    p.rect(86, 32, 4, 3, PAL.G);
    p.rect(10, 34, 78, 4, '#3a3d45');
    p.outline();
    p.register(scene, 'boss_moto');
  },

  biker(scene) {
    // Extortionist on a motorcycle, 32x24, facing LEFT.
    const pal = Object.assign({}, PAL, SKINS.thug.pal);
    const p = new Painter(32, 24);
    p.grid([...HUMAN.HEADS.thug, ...HUMAN.TORSO.fwd], 6, 0, pal, true);
    p.rect(6, 13, 20, 5, PAL.r).rect(14, 12, 9, 2, PAL.k).rect(24, 14, 4, 2, PAL.G);
    p.line(6, 19, 8, 9, PAL.G).rect(4, 8, 5, 1, PAL.k);
    p.disc(6, 19, 4, PAL.k).disc(25, 19, 4, PAL.k);
    p.set(6, 19, PAL.g).set(25, 19, PAL.g);
    p.outline();
    p.register(scene, 'biker');
  },

  projectiles(scene) {
    new Painter(6, 3).rect(0, 0, 6, 3, '#ffd34d').rect(3, 1, 3, 1, '#ffffff').register(scene, 'pbullet');
    new Painter(8, 3).rect(0, 0, 8, 3, '#ffb000').rect(2, 1, 6, 1, '#fffbe0').register(scene, 'mgbullet');
    new Painter(5, 5).disc(2, 2, 2, '#ff5a3a').set(2, 2, '#fff0c0').register(scene, 'ebullet');

    const sh = new Painter(12, 8);
    sh.rect(1, 2, 7, 4, '#c9a23a').rect(8, 2, 3, 4, PAL.g).outline();
    sh.register(scene, 'shell');

    const gr = new Painter(8, 9);
    gr.disc(4, 5, 2, '#4b6b3a').rect(3, 1, 2, 2, PAL.g).outline();
    gr.register(scene, 'grenade');

    const mo = new Painter(7, 12);
    mo.rect(2, 5, 3, 6, '#3c8f4a').rect(3, 3, 1, 2, '#3c8f4a').rect(2, 1, 3, 2, '#ff9d2e').set(3, 0, '#ffe066').outline();
    mo.register(scene, 'molotov');

    const bag = new Painter(12, 13);
    bag.disc(6, 8, 4, '#c9a86a').rect(5, 2, 3, 2, '#8a5a33').text('$', 5, 6, '#2e7d32').outline();
    bag.register(scene, 'moneybag');

    // Emoliente cup with steam
    const cup = new Painter(8, 9);
    cup.set(2, 0, '#ffffffaa').set(4, 1, '#ffffffaa').set(5, 0, '#ffffffaa');
    cup.rect(1, 3, 6, 1, PAL.k).rect(1, 4, 6, 4, '#f4f4f4').rect(2, 4, 4, 1, '#8a4b1f').rect(2, 8, 4, 1, PAL.k);
    cup.set(0, 4, PAL.k).set(0, 5, PAL.k).set(0, 6, PAL.k).set(7, 4, PAL.k).set(7, 5, PAL.k).set(7, 6, PAL.k);
    cup.set(1, 8, PAL.k).set(6, 8, PAL.k);
    cup.register(scene, 'cup');
  },

  fx(scene) {
    for (let f = 0; f < 6; f++) {
      const rnd = mulberry32(100 + f);
      const p = new Painter(48, 48);
      const r = 5 + f * 3.4;
      if (f < 4) {
        for (let i = 0; i < 9; i++) {
          const a = rnd() * Math.PI * 2, d = r * 0.75;
          p.disc(24 + Math.cos(a) * d, 24 + Math.sin(a) * d, Math.max(2, Math.round(r * 0.4)), '#e8582a');
        }
        p.disc(24, 24, Math.round(r), '#ff9d2e');
        p.disc(24, 24, Math.round(r * 0.65), '#ffe066');
        if (f < 3) p.disc(24, 24, Math.round(r * 0.3), '#ffffff');
      } else {
        for (let i = 0; i < 10; i++) {
          const a = rnd() * Math.PI * 2, d = r * (0.5 + rnd() * 0.4);
          p.disc(24 + Math.cos(a) * d, 24 + Math.sin(a) * d - f, Math.round(r * 0.3), f === 4 ? '#6b6b6bdd' : '#8a8a8a88');
        }
      }
      p.register(scene, `boom${f}`);
    }
    for (let f = 0; f < 4; f++) {
      const p = new Painter(16, 16);
      const r = 2 + f * 2;
      p.disc(8, 8, r, f < 2 ? '#ffffffcc' : '#ffffff66');
      if (f > 1) p.disc(8, 8, r - 2, null);
      p.register(scene, `puff${f}`);
    }
    const sp = new Painter(7, 7);
    sp.rect(3, 0, 1, 7, '#fff6a0').rect(0, 3, 7, 1, '#fff6a0').set(3, 3, '#ffffff').set(2, 2, '#ffe066').set(4, 4, '#ffe066');
    sp.register(scene, 'spark');
  },

  pickups(scene) {
    const box = (key, letter, bg) => {
      const p = new Painter(14, 14);
      p.rect(1, 1, 12, 12, bg).rect(1, 1, 12, 1, '#ffffff88').text(letter, 5, 5, PAL.r).outline();
      p.register(scene, key);
    };
    box('pick_H', 'H', PAL.y);
    box('pick_B', 'B', '#9fd36a');
    const f = new Painter(16, 12);
    f.rect(1, 1, 14, 3, '#e2b26a').rect(1, 4, 14, 2, '#7a3b1e').rect(1, 6, 14, 1, '#d23b6a').rect(1, 7, 14, 1, '#f2e2c0').rect(1, 8, 14, 2, '#e2b26a');
    f.set(4, 2, '#f2d29a').set(9, 2, '#f2d29a').outline();
    f.register(scene, 'pick_food');
  },

  props(scene) {
    const crate = new Painter(22, 20);
    crate.rect(0, 0, 22, 20, '#a8743f').rect(0, 0, 22, 2, '#6e4a26').rect(0, 18, 22, 2, '#6e4a26');
    crate.rect(0, 0, 2, 20, '#6e4a26').rect(20, 0, 2, 20, '#6e4a26');
    crate.line(2, 2, 19, 17, '#6e4a26').line(19, 2, 2, 17, '#6e4a26');
    crate.register(scene, 'crate');

    // Ground tile: sidewalk + curb + asphalt
    const rnd = mulberry32(7);
    const g = new Painter(64, 30);
    g.rect(0, 0, 64, 2, '#c8c4b8').rect(0, 2, 64, 4, '#a9a59c').rect(0, 6, 64, 2, '#6e6a62').rect(0, 8, 64, 22, '#4b4b52');
    for (let x = 0; x < 64; x += 16) g.rect(x, 2, 1, 4, '#8d897f');
    for (let i = 0; i < 70; i++) g.set(Math.floor(rnd() * 64), 9 + Math.floor(rnd() * 21), rnd() < 0.5 ? '#56565e' : '#3f3f45');
    g.rect(0, 18, 32, 2, '#e3c45a');
    g.register(scene, 'ground');

    // Low brick wall for graffiti
    const wall = new Painter(120, 44);
    wall.rect(0, 0, 120, 44, '#a5543c').rect(0, 0, 120, 3, '#9d9a92');
    for (let y = 3; y < 44; y += 5) {
      wall.rect(0, y, 120, 1, '#7c3c2a');
      for (let x = (y / 5) % 2 ? 0 : 6; x < 120; x += 12) wall.rect(x, y, 1, 5, '#7c3c2a');
    }
    wall.register(scene, 'wall');

    // Bus stop sign
    const ps = new Painter(40, 64);
    ps.rect(19, 12, 2, 52, PAL.G).rect(0, 0, 40, 14, '#1e5fb4').rect(1, 1, 38, 1, '#ffffff').rect(1, 12, 38, 1, '#ffffff');
    ps.text('PARADERO', 5, 5, '#ffffff').outline();
    ps.register(scene, 'paradero');

    // "State of emergency" banner between two poles
    const b = new Painter(170, 70);
    b.rect(2, 0, 3, 70, PAL.G).rect(165, 0, 3, 70, PAL.G);
    b.rect(5, 4, 160, 20, PAL.y);
    for (let x = 5; x < 165; x += 6) b.rect(x, 4, 3, 2, PAL.k).rect(x + 3, 22, 3, 2, PAL.k);
    b.text('ESTADO DE EMERGENCIA', 85 - Painter.textWidth('ESTADO DE EMERGENCIA') / 2, 8, PAL.k);
    b.text('PRORROGADO X 7MA VEZ', 85 - Painter.textWidth('PRORROGADO X 7MA VEZ') / 2, 15, '#c0282e');
    b.outline();
    b.register(scene, 'banner');

    // Police car with a sleeping officer
    const pc = new Painter(64, 28);
    pc.rect(14, 4, 32, 8, '#f4f4f4').rect(17, 6, 11, 5, '#8fd0ee').rect(31, 6, 11, 5, '#8fd0ee');
    pc.disc(35, 9, 2, PAL.s).rect(33, 6, 5, 1, '#2e7d32'); // dozing cop, green cap
    pc.rect(26, 2, 4, 2, PAL.r).rect(30, 2, 4, 2, '#2c6fd1');
    pc.rect(2, 12, 60, 10, '#f4f4f4').rect(2, 16, 60, 3, '#2e7d32');
    pc.text('POLICIA', 18, 11, '#2e7d32');
    pc.disc(14, 22, 4, PAL.k).disc(50, 22, 4, PAL.k).set(14, 22, PAL.g).set(50, 22, PAL.g);
    pc.outline();
    pc.register(scene, 'policecar');
  },

  backgrounds(scene) {
    // Lima's grey "panza de burro" sky, dithered gradient
    const sky = new Painter(480, 270);
    const tones = ['#9da2a9', '#a6aab0', '#afb2b6', '#b8babc', '#c1c2c1', '#cacac6', '#d3d1cb', '#dcd9d0'];
    for (let y = 0; y < 270; y++) {
      const t = (y / 270) * (tones.length - 1);
      const base = Math.floor(t), frac = t - base;
      for (let x = 0; x < 480; x++) {
        const up = (x + y) % 2 === 0 && frac > 0.5;
        sky.set(x, y, tones[Math.min(tones.length - 1, base + (up ? 1 : 0))]);
      }
    }
    sky.register(scene, 'bg_sky');

    // Far cerros covered with little houses (seamless 480 tile)
    const rnd = mulberry32(42);
    const H = 150;
    const hills = new Painter(480, H, { wrapX: true });
    const TAU = Math.PI * 2;
    const h1 = (x) => 70 + 22 * Math.sin((x / 480) * TAU * 2) + 10 * Math.sin((x / 480) * TAU * 5 + 1);
    const h2 = (x) => 45 + 14 * Math.sin((x / 480) * TAU * 3 + 2) + 6 * Math.sin((x / 480) * TAU * 7);
    for (let x = 0; x < 480; x++) {
      hills.rect(x, Math.round(H - h1(x)), 1, H, '#a38466');
      hills.rect(x, Math.round(H - h2(x)), 1, H, '#8f7258');
    }
    const houseCols = ['#c96b4b', '#d9a441', '#7fa36b', '#6c8fb3', '#b5503c', '#e0d4b8', '#c58fb0'];
    for (let i = 0; i < 160; i++) {
      const x = Math.floor(rnd() * 480);
      const far = rnd() < 0.55;
      const top = H - (far ? h1(x) : h2(x)) + 2 + rnd() * (far ? 30 : 40);
      const w = 3 + Math.floor(rnd() * 5), hh = 2 + Math.floor(rnd() * 4);
      hills.rect(x, Math.round(top), w, hh, houseCols[Math.floor(rnd() * houseCols.length)]);
      hills.set(x + 1, Math.round(top) + 1, '#3b3f48');
    }
    hills.register(scene, 'bg_hills');

    // Mid city: unfinished brick buildings, rebar, water tanks, chicha posters, messy cables
    const CH = 170;
    const city = new Painter(480, CH, { wrapX: true });
    const walls = ['#c9b79c', '#b0563d', '#d4c26a', '#8fb3a6', '#c98e7a', '#a3a3a3', '#b0563d'];
    const neon = ['#ff3fa4', '#ffe600', '#3cff6a', '#ff7a00'];
    const words = [['GRAN', 'BAILE'], ['CHICHA', 'HOY'], ['SE', 'VENDE'], ['CUMBIA', 'TOTAL'], ['NO AL', 'CUPO']];
    let x = 0;
    while (x < 480) {
      const w = 36 + Math.floor(rnd() * 40), h = 50 + Math.floor(rnd() * 70);
      const col = walls[Math.floor(rnd() * walls.length)];
      const top = CH - h;
      city.rect(x, top, w, h, col);
      if (col === '#b0563d') for (let y = top + 2; y < CH; y += 3) city.rect(x, y, w, 1, '#8e4330'); // raw brick
      for (let wy = top + 6; wy < CH - 18; wy += 12) for (let wx = x + 4; wx < x + w - 6; wx += 9) city.rect(wx, wy, 4, 6, '#3b3f48');
      for (let rx = x + 2; rx < x + w - 1; rx += 5) city.rect(rx, top - 5, 1, 5, '#6b6f75'); // rebar
      if (rnd() < 0.6) { const tx = x + 4 + Math.floor(rnd() * (w - 14)); city.rect(tx, top - 8, 7, 8, '#1d1d1d').rect(tx + 1, top - 9, 5, 1, '#1d1d1d'); } // water tank
      city.rect(x + 3, CH - 16, w - 6, 16, '#6b6f75'); // shop shutter
      for (let sy = CH - 15; sy < CH; sy += 2) city.rect(x + 3, sy, w - 6, 1, '#5a5e64');
      if (rnd() < 0.8) {
        const [a, b] = words[Math.floor(rnd() * words.length)];
        const pw = Math.max(Painter.textWidth(a), Painter.textWidth(b)) + 4;
        const px = x + Math.floor((w - pw) / 2), py = CH - 34;
        city.rect(px, py, pw, 14, neon[Math.floor(rnd() * neon.length)]);
        city.text(a, px + 2, py + 1, PAL.k).text(b, px + 2, py + 7, PAL.k);
      }
      x += w;
    }
    for (let i = 0; i < 4; i++) {
      const px = i * 120 + 20;
      city.rect(px, 30, 3, CH - 30, '#6b5a48').rect(px - 6, 34, 15, 2, '#6b5a48');
    }
    for (let i = 0; i < 4; i++) {
      const x0 = i * 120 + 21, x1 = x0 + 120;
      for (let wire = 0; wire < 4; wire++) {
        const y0 = 34 + wire * 3, sag = 8 + wire * 4;
        for (let wx = x0; wx < x1; wx++) {
          const t = (wx - x0) / 120;
          city.set(wx, Math.round(y0 + sag * 4 * t * (1 - t)), '#26262c');
        }
      }
    }
    city.register(scene, 'bg_city');
  },

  anims(scene) {
    const make = (key, frames, rate) => {
      if (scene.anims.exists(key)) return;
      scene.anims.create({ key, frames: frames.map((k) => ({ key: k })), frameRate: rate });
    };
    make('boom', [0, 1, 2, 3, 4, 5].map((i) => `boom${i}`), 16);
    make('puff', [0, 1, 2, 3].map((i) => `puff${i}`), 14);
  },
};
