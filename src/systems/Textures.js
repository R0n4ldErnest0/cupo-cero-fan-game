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
    shades: [
      '................',
      '......kkkkk.....',
      '.....kHHyHHk....',
      '....kHHHHHHHk...',
      '....kkkkkkkkkkk.',
      '.....kYssssk....',
      '.....kYkkkkkk...',
      '.....ksMMMMSk...',
      '......kksssk....',
    ],
    helmet: [
      '................',
      '.....kkkkkk.....',
      '....kHHHHHHk....',
      '...kHHHHHHHHk...',
      '...kHkVVVVVVk...',
      '...kHkVssVVVk...',
      '...kHkVVVVVVk...',
      '....kkssssSk....',
      '......kksssk....',
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
  cobradora: { head: 'cobradora', pal: { C: '#f4f4f4', P: '#3a3d45', F: '#c0282e' } }, // the drugstore owner (white coat)
  thug: { head: 'thug', pal: { Q: '#2a2a30', X: '#c0282e', C: '#3a3d45', P: '#3a5fa0', F: '#e8e8e8' } },
  thug2: { head: 'thug', pal: { Q: '#3c6e3a', X: '#1b1b22', C: '#7a2e2e', P: '#2b2b33', F: '#e8e8e8' } },
  thug3: { head: 'thug', pal: { Q: '#c0282e', X: '#1b1b22', C: '#e8e8e8', P: '#2b2b33', F: '#c0282e' } }, // knife runner
  tombo: { head: 'shades', pal: { H: '#2f5a34', M: '#2b1d14', Y: '#d8d8d8', C: '#5f7d45', P: '#34502f', F: '#1b1b22' } }, // corrupt cop
  riot: { head: 'helmet', pal: { H: '#26332a', V: '#8fb8d8', C: '#34502f', P: '#26332a', F: '#1b1b22' } }, // antimotines
  press: { head: 'cobradora', pal: { h: '#3a2a1e', C: '#2c6fd1', P: '#3a3d45', F: '#1b1b22' } }, // the journalist (PRENSA vest)
  sere: { head: 'cop', pal: { H: '#1e3a6a', M: '#2b1d14', Y: '#f2c94c', C: '#2c4f86', P: '#1b2a4a', F: '#1b1b22' } }, // serenazgo
  poli: { head: 'cop', pal: { H: '#2f5a34', M: '#2b1d14', Y: '#d8d8d8', C: '#6b8a4f', P: '#34502f', F: '#1b1b22' } }, // honest cop (prisoner)
  vendor: { head: 'cobradora', pal: { h: '#2b1d14', C: '#f4f4f4', P: '#3a5fa0', F: '#5b3a20' } }, // street vendor
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
    this.prisoner(scene);
    this.police(scene);
    this.heli(scene);
    this.mototaxi(scene);
    this.truck(scene);
    this.contador(scene);
    this.rochabus(scene);
    this.comisario(scene);
    this.aircraft(scene);
    this.alcalde(scene);
    this.combi(scene);
    this.boss(scene);
    this.biker(scene);
    this.projectiles(scene);
    this.fx(scene);
    this.pickups(scene);
    this.breakables(scene);
    this.door(scene);
    this.ride(scene);
    this.props(scene);
    this.tiles(scene);
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

  // Police extras: the riot shield, the motorbike cop and the crouching sniper with his rifle.
  police(scene) {
    const sh = new Painter(9, 24);
    sh.rect(0, 0, 9, 24, '#1b2430').rect(1, 1, 7, 22, '#9fc4e0').rect(2, 2, 2, 18, '#d8ecf8').rect(1, 10, 7, 3, '#f4f4f4');
    sh.register(scene, 'riot_shield');

    // Motorbike cop, facing left: white-and-green police bike, rider with sunglasses.
    const pal = Object.assign({}, PAL, SKINS.tombo.pal);
    const m = new Painter(32, 24);
    m.grid([...HUMAN.HEADS.shades, ...HUMAN.TORSO.fwd], 6, 0, pal, true);
    m.rect(6, 13, 20, 5, '#f4f4f4').rect(6, 15, 20, 2, '#2e7d32').rect(14, 12, 9, 2, PAL.k).rect(24, 14, 4, 2, PAL.G);
    m.line(6, 19, 8, 9, PAL.G).rect(4, 8, 5, 1, PAL.k).rect(20, 10, 3, 2, '#2c6fd1');
    m.disc(6, 19, 4, PAL.k).disc(25, 19, 4, PAL.k).set(6, 19, PAL.g).set(25, 19, PAL.g);
    m.outline();
    m.register(scene, 'motocop');

    const sn = new Painter(28, 24);
    sn.grid([...HUMAN.HEADS.shades, ...HUMAN.TORSO.fwd.slice(0, 4), ...HUMAN.CROUCH_LEGS], 0, 7, pal);
    sn.rect(10, 14, 17, 2, PAL.k).rect(12, 13, 4, 1, PAL.G).rect(10, 16, 3, 2, '#5b3a20'); // long rifle
    sn.register(scene, 'sniper');
  },

  // Mission 3 boss: police helicopter (facing left, 100x40), its rotor, the breakable nose gun and missile pod,
  // tear-gas canisters and missiles.
  heli(scene) {
    const h = new Painter(100, 40);
    h.rect(48, 0, 4, 6, PAL.G); // rotor mast
    h.disc(30, 21, 15, '#f4f4f4').rect(30, 6, 34, 30, '#f4f4f4'); // cabin
    h.disc(22, 19, 10, '#8fd0ee').rect(22, 10, 10, 10, '#8fd0ee').set(18, 14, '#ffffff'); // windshield
    h.rect(40, 12, 14, 14, '#3b4a5a'); // side door (El Cobrador leans out here)
    h.rect(62, 14, 34, 7, '#f4f4f4').rect(90, 6, 6, 12, '#2e7d32'); // tail boom + fin
    h.disc(94, 18, 4, '#9aa0a8'); // tail rotor
    h.rect(16, 27, 48, 4, '#2e7d32').text('POLICIA', 26, 30, '#f4f4f4');
    h.rect(14, 37, 52, 2, PAL.G).rect(22, 33, 2, 4, PAL.G).rect(54, 33, 2, 4, PAL.G); // skids
    h.outline();
    h.register(scene, 'heli');
    new Painter(96, 3).rect(0, 1, 96, 1, '#2b2b33').rect(44, 0, 8, 3, PAL.G).register(scene, 'heli_rotor');
    new Painter(14, 6).rect(0, 2, 10, 2, PAL.k).rect(8, 0, 6, 6, PAL.G).outline().register(scene, 'heli_gun');
    new Painter(18, 8).rect(0, 1, 18, 6, '#5a6068').disc(2, 4, 2, '#c0282e').disc(7, 4, 2, '#c0282e').outline().register(scene, 'heli_pod');
    new Painter(6, 9).rect(1, 1, 4, 8, '#9aa0a8').rect(1, 0, 4, 1, '#5a6068').rect(1, 4, 4, 1, '#f2c94c').outline().register(scene, 'teargas');
    new Painter(12, 4).rect(0, 1, 8, 2, '#d8d8d8').rect(8, 0, 3, 4, '#c0282e').rect(0, 0, 2, 4, '#9aa0a8').register(scene, 'emissile');
  },

  // Mototaxi Slug (facing right, 48x34): canopy, driver's seat in front, passenger bench behind; its canopy gun;
  // the bocinazo sound wave; the gang's metal-shutter shield and the gang sniper.
  mototaxi(scene) {
    const m = new Painter(48, 34);
    m.rect(4, 2, 36, 4, '#d8343a').rect(4, 2, 36, 1, '#f26a6a').rect(4, 6, 36, 1, '#8a1f24'); // canopy
    m.rect(5, 7, 2, 14, PAL.G).rect(37, 7, 2, 14, PAL.G); // canopy poles
    m.rect(5, 8, 22, 10, '#3b4a5a').rect(8, 9, 6, 4, '#8fb8d8'); // passenger cabin + back window
    m.rect(3, 18, 30, 9, '#f2c94c').rect(3, 21, 30, 2, '#1e5fb4'); // body
    m.rect(33, 16, 9, 9, '#f2c94c').rect(40, 10, 2, 8, PAL.G).rect(38, 10, 6, 2, PAL.k); // front fork + handlebar
    m.disc(30, 14, 3, PAL.s).rect(28, 10, 5, 2, PAL.k); // driver's head (helmet)
    m.text('MOTO', 9, 19, '#c0282e');
    m.outline();
    m.register(scene, 'mototaxi');
    new Painter(14, 5).rect(0, 1, 11, 3, PAL.k).rect(9, 0, 5, 5, PAL.G).register(scene, 'moto_gun');
    const w = new Painter(10, 20);
    for (let y = 0; y < 20; y++) { const dx = Math.round(Math.abs(y - 9.5) * 0.35); w.set(dx, y, '#ffe066').set(dx + 1, y, '#ffffff'); }
    w.register(scene, 'honk_wave');

    const sh = new Painter(9, 24);
    sh.rect(0, 0, 9, 24, '#5a6068');
    for (let x = 1; x < 9; x += 2) sh.rect(x, 0, 1, 24, '#8d939b');
    sh.rect(0, 0, 9, 1, '#3a3d45').rect(0, 23, 9, 1, '#3a3d45').set(3, 8, '#a8743f').set(6, 15, '#a8743f');
    sh.register(scene, 'shutter_shield');

    const pal = Object.assign({}, PAL, SKINS.thug.pal);
    const sn = new Painter(28, 24);
    sn.grid([...HUMAN.HEADS.thug, ...HUMAN.TORSO.fwd.slice(0, 4), ...HUMAN.CROUCH_LEGS], 0, 7, pal);
    sn.rect(10, 14, 17, 2, PAL.k).rect(12, 13, 4, 1, PAL.G).rect(10, 16, 3, 2, '#5b3a20');
    sn.register(scene, 'sniper_thug');
  },

  // Mission 2 mid-boss: the armored collection truck (facing left, 112x54), its roof turret and the coins it spits.
  truck(scene) {
    const t = new Painter(112, 54);
    t.rect(4, 22, 26, 22, '#c0282e').rect(8, 25, 14, 10, '#8fd0ee').rect(9, 26, 3, 3, '#ffffff'); // cab + windshield
    t.rect(2, 40, 6, 4, PAL.G).disc(5, 38, 2, '#ffe066'); // bumper + headlight
    t.rect(30, 6, 80, 38, '#5a6068').rect(30, 6, 80, 3, '#7d838b'); // armored box
    for (let x = 34; x < 108; x += 8) t.rect(x, 12, 1, 28, '#4a4f56');
    t.rect(46, 16, 48, 12, '#f2c94c').text('RECAUDACION', 48, 20, '#c0282e');
    t.text('$', 98, 32, '#2e7d32').text('$', 38, 32, '#2e7d32');
    t.rect(40, 34, 8, 3, PAL.k); // coin slot
    t.rect(2, 44, 108, 4, '#3a3d45');
    t.outline();
    t.register(scene, 'truck');
    new Painter(16, 10).rect(2, 3, 12, 7, '#4a4f56').rect(0, 5, 6, 2, PAL.k).rect(5, 1, 6, 3, '#5a6068').outline().register(scene, 'truck_turret');
    new Painter(6, 6).disc(3, 3, 2, '#f2c94c').set(3, 3, '#c8a165').outline().register(scene, 'coin');
  },

  // Mission 2 boss: El Contador's mech (facing left, 80x74): a walking safe with the accountant in a glass cockpit
  // on top; the bill-counting machines (breakable arms); bills, boletas and the ledger.
  contador(scene) {
    const m = new Painter(80, 74);
    m.rect(22, 0, 36, 22, '#8fd0ee').rect(22, 0, 36, 2, '#d8eef8'); // glass cockpit
    m.disc(40, 12, 5, PAL.s).rect(35, 6, 10, 3, '#2b1d14'); // the accountant's head + combed hair
    m.rect(36, 12, 3, 2, PAL.k).rect(41, 12, 3, 2, PAL.k).rect(39, 12, 2, 1, PAL.k); // glasses
    m.rect(37, 17, 6, 5, '#f4f4f4').rect(39, 17, 2, 5, '#c0282e'); // shirt + tie
    m.rect(12, 22, 56, 36, '#5a6068').rect(12, 22, 56, 3, '#7d838b'); // the safe
    m.disc(40, 40, 9, '#3a3d45').disc(40, 40, 6, '#9aa0a8').rect(39, 31, 2, 4, PAL.k); // dial
    m.rect(58, 32, 4, 16, '#3a3d45'); // hinge
    m.text('$', 22, 28, '#f2c94c').text('$', 54, 50, '#f2c94c');
    m.rect(16, 58, 14, 12, '#3a3d45').rect(50, 58, 14, 12, '#3a3d45'); // legs
    m.rect(12, 70, 22, 4, PAL.k).rect(46, 70, 22, 4, PAL.k); // feet
    m.outline();
    m.register(scene, 'contador_mech');
    const c = new Painter(22, 16);
    c.rect(2, 3, 18, 12, '#d8d8d8').rect(2, 3, 18, 2, '#f4f4f4').rect(0, 7, 4, 3, PAL.k); // the slot faces left
    c.rect(6, 7, 10, 4, '#2e7d32').rect(7, 8, 8, 2, '#5fae5f').rect(14, 0, 2, 3, PAL.G);
    c.outline();
    c.register(scene, 'counter');
    new Painter(10, 5).rect(0, 0, 10, 5, '#5fae5f').rect(1, 1, 8, 3, '#2e7d32').set(5, 2, '#a8e0a8').register(scene, 'bill');
    new Painter(7, 9).rect(0, 0, 7, 9, '#f4f4f4').rect(1, 2, 5, 1, '#9aa0a8').rect(1, 4, 5, 1, '#9aa0a8').rect(1, 6, 3, 1, '#9aa0a8').register(scene, 'boleta');
    const b = new Painter(14, 10);
    b.rect(1, 1, 12, 8, '#7a2e2e').rect(2, 2, 10, 6, '#a84040').text('$', 5, 3, '#f2c94c').outline();
    b.register(scene, 'ledger_book');
  },

  // Mission 4 vehicle: the rochabus (water-cannon truck, facing right, 78x46), its roof cannon and the water.
  rochabus(scene) {
    const r = new Painter(78, 46);
    r.rect(2, 10, 56, 26, '#e8ecef').rect(2, 10, 56, 2, '#c8ccd0'); // armored body
    r.rect(4, 14, 30, 8, '#9aa0a8').rect(6, 16, 26, 4, '#5a6068'); // grille windows
    r.rect(2, 26, 56, 4, '#2e7d32').text('POLICIA', 12, 31, '#f4f4f4');
    r.rect(58, 16, 16, 20, '#e8ecef').rect(62, 18, 10, 8, '#8fd0ee').rect(63, 19, 3, 2, '#ffffff'); // cab + windshield
    r.rect(20, 4, 20, 6, '#5a6068').rect(22, 2, 16, 2, '#3a3d45'); // water tank on the roof
    r.rect(26, 0, 4, 2, '#c0282e').rect(30, 0, 4, 2, '#2c6fd1'); // siren
    r.rect(0, 36, 76, 4, '#3a3d45');
    r.outline();
    r.register(scene, 'rochabus');
    new Painter(18, 7).disc(4, 3, 3, '#5a6068').rect(4, 2, 13, 3, '#9aa0a8').rect(15, 1, 3, 5, '#3a3d45').outline().register(scene, 'water_cannon');
    new Painter(7, 4).rect(0, 1, 7, 2, '#8fd0ee').rect(2, 0, 3, 4, '#bfe6f8').set(5, 1, '#ffffff').register(scene, 'water');
  },

  // Mission 4 boss: the Comisario's filing-cabinet mech (facing left, 70x86) on office-chair wheels, its drawers
  // (breakable parts), the ARCHIVADO stamps and the complaint folders; the patrol car you can smash.
  comisario(scene) {
    const pal = Object.assign({}, PAL, SKINS.tombo.pal);
    const m = new Painter(70, 86);
    m.grid([...HUMAN.HEADS.shades, ...HUMAN.TORSO.fwd.slice(0, 6)], 27, 0, pal, true); // the comisario on top
    m.disc(35, 15, 6, pal.C); // belly
    m.rect(12, 14, 46, 62, '#7d838b').rect(12, 14, 46, 2, '#a9afb7'); // the cabinet
    [24, 44, 64].forEach((y) => m.rect(14, y - 8, 42, 18, '#6b7078').rect(30, y - 2, 10, 3, '#3a3d45'));
    m.rect(16, 16, 38, 6, '#f2c94c').text('ARCHIVO', 21, 17, '#1b1b22');
    m.rect(33, 76, 4, 4, PAL.k).rect(18, 80, 34, 2, PAL.k); // chair base
    [20, 35, 50].forEach((x) => m.disc(x, 83, 2, PAL.k));
    m.outline();
    m.register(scene, 'comisario_mech');
    const d = new Painter(20, 14);
    d.rect(0, 0, 20, 14, '#9aa0a8').rect(2, 2, 16, 10, '#6b7078').rect(1, 5, 3, 4, '#3a3d45').outline();
    d.register(scene, 'drawer');
    const st = new Painter(10, 8);
    st.rect(3, 0, 4, 3, '#5b3a20').rect(1, 3, 8, 5, '#c0282e').rect(2, 5, 6, 1, '#f4f4f4');
    st.register(scene, 'stamp');
    const f = new Painter(12, 9);
    f.rect(0, 1, 12, 8, '#d9b878').rect(0, 0, 5, 2, '#c8a165').rect(2, 3, 8, 1, '#8a7a5a').rect(2, 5, 6, 1, '#8a7a5a').outline();
    f.register(scene, 'folder');
    const pc = new Painter(64, 28); // patrol car (same art as the sleeping cop's car, empty)
    pc.rect(14, 4, 32, 8, '#f4f4f4').rect(17, 6, 11, 5, '#8fd0ee').rect(31, 6, 11, 5, '#8fd0ee');
    pc.rect(26, 2, 4, 2, PAL.r).rect(30, 2, 4, 2, '#2c6fd1');
    pc.rect(2, 12, 60, 10, '#f4f4f4').rect(2, 16, 60, 3, '#2e7d32').text('POLICIA', 18, 11, '#2e7d32');
    pc.disc(14, 22, 4, PAL.k).disc(50, 22, 4, PAL.k).set(14, 22, PAL.g).set(50, 22, PAL.g);
    pc.outline();
    pc.register(scene, 'prop_patrol');
  },

  // Air level: the players' aircraft (Don Tito's old police helicopter, 2P's small plane) and the flying enemies.
  aircraft(scene) {
    const h = new Painter(40, 22);
    h.rect(18, 0, 3, 4, PAL.G);
    h.disc(14, 11, 8, '#9aa0a8').rect(14, 4, 14, 14, '#9aa0a8').disc(10, 10, 5, '#8fd0ee'); // old grey body, patched
    h.rect(16, 13, 10, 2, '#2e7d32').rect(20, 6, 4, 3, '#a8743f').rect(26, 8, 12, 4, '#9aa0a8').rect(35, 4, 4, 7, '#2e7d32');
    h.rect(8, 19, 22, 2, PAL.G);
    h.outline();
    h.register(scene, 'aircraft_heli');
    const pl = new Painter(36, 16);
    pl.rect(4, 6, 26, 6, '#f2c94c').rect(14, 2, 6, 12, '#e0b030').rect(30, 7, 3, 4, PAL.G).rect(33, 4, 2, 10, '#5a6068'); // body, wing, prop
    pl.rect(0, 4, 5, 3, '#f2c94c').rect(20, 6, 6, 3, '#8fd0ee');
    pl.outline();
    pl.register(scene, 'aircraft_plane');
    const ph = new Painter(30, 16);
    ph.disc(8, 8, 6, '#f4f4f4').rect(8, 3, 12, 10, '#f4f4f4').disc(5, 7, 3, '#8fd0ee').rect(18, 6, 10, 3, '#f4f4f4').rect(26, 2, 3, 6, '#2e7d32');
    ph.rect(8, 10, 12, 2, '#2e7d32').rect(12, 0, 2, 3, PAL.G).rect(4, 14, 16, 1, PAL.G);
    ph.outline();
    ph.register(scene, 'flyer_polheli');
    const dr = new Painter(16, 9);
    dr.rect(0, 1, 6, 1, '#d8d8d8').rect(10, 1, 6, 1, '#d8d8d8').rect(3, 3, 10, 4, '#1e5fb4').set(12, 4, '#ff3a3a').rect(5, 7, 6, 2, '#3a3d45');
    dr.register(scene, 'flyer_drone');
    const tv = new Painter(34, 18);
    tv.disc(9, 9, 7, '#1e5fb4').rect(9, 3, 14, 12, '#1e5fb4').disc(5, 8, 3, '#8fd0ee').rect(22, 7, 10, 3, '#1e5fb4').rect(30, 3, 3, 7, '#f2c94c');
    tv.rect(10, 6, 12, 5, '#f4f4f4').text('TV', 12, 6, '#c0282e').rect(13, 0, 2, 3, PAL.G).rect(4, 16, 18, 1, PAL.G);
    tv.outline();
    tv.register(scene, 'flyer_tv');
    // Police tanquetas: the honest police's (white, POLICIA) and the serenazgo's (navy). One texture per direction
    // (<key>_r / <key>_l) so the lettering never reads mirrored.
    const tank = (key, body, stripe, label, ink) => {
      for (const left of [false, true]) {
        const t = new Painter(56, 30);
        const R = (x, y, w, h, c) => t.rect(left ? 56 - x - w : x, y, w, h, c);
        R(2, 20, 50, 9, '#2b2b30');
        [8, 18, 28, 38, 46].forEach((x) => t.disc(left ? 55 - x : x, 24, 4, '#5a6068').set(left ? 55 - x : x, 24, '#2b2b30'));
        R(4, 9, 46, 12, body);
        R(4, 18, 46, 2, stripe);
        R(16, 2, 22, 8, body);
        R(30, 4, 6, 4, '#8fd0ee');
        R(38, 4, 18, 3, '#3a3d45');
        R(20, 0, 4, 2, PAL.r);
        R(24, 0, 4, 2, '#2c6fd1');
        const w = label.length * 4 - 1;
        t.text(label, left ? 56 - 6 - w : 6, 11, ink);
        t.outline();
        t.register(scene, `${key}_${left ? 'l' : 'r'}`);
      }
    };
    tank('tank_ally', '#f4f4f4', '#2e7d32', 'POLICIA', '#2e7d32');
    tank('tank_enemy', '#26324a', '#c0282e', 'SERENAZGO', '#f2c94c');
    // The missile plane (facing left): a navy "patrol" plane with a missile under each wing.
    const mp = new Painter(40, 18);
    mp.rect(4, 7, 30, 6, '#26324a').rect(6, 9, 26, 2, '#f4f4f4').disc(5, 10, 3, '#26324a').rect(0, 5, 2, 10, '#5a6068'); // body, prop
    mp.rect(14, 3, 8, 14, '#1b2430').rect(8, 7, 5, 3, '#8fd0ee').rect(32, 3, 6, 6, '#26324a').rect(34, 9, 5, 2, '#1b2430'); // wing, cockpit, tail
    mp.rect(13, 15, 9, 2, '#d8d8d8').rect(12, 15, 2, 2, '#c0282e'); // missile under the wing
    mp.outline();
    mp.register(scene, 'flyer_plane');
    // A parachute canopy (orange and white panels) for the serenazgo who jump.
    const pc = new Painter(24, 16);
    pc.disc(12, 8, 11, '#e3842c').clear(0, 8, 24, 8);
    for (let x = 4; x < 20; x += 8) for (let y = 0; y < 8; y++) for (let i = 0; i < 4; i++) if (pc.get(x + i, y)) pc.set(x + i, y, '#f4f4f4');
    pc.rect(0, 7, 24, 1, '#b05a10');
    pc.line(1, 8, 9, 15, '#3a3d45').line(23, 8, 15, 15, '#3a3d45').line(12, 8, 12, 15, '#3a3d45');
    pc.register(scene, 'parachute');
  },

  // Final boss: the mayor's bulldozer, its megaphone and his attacks' sprites.
  alcalde(scene) {
    // The mayor's bulldozer (facing left, 104x74): blade in front, the mayor in his sash in the cab, "OBRA" on the side.
    const d = new Painter(104, 74);
    d.rect(16, 56, 84, 16, '#2b2b30');
    for (let x = 22; x < 98; x += 12) d.disc(x, 64, 5, '#5a6068').set(x, 64, '#2b2b30');
    d.rect(16, 56, 84, 2, '#1b1b22');
    d.rect(28, 28, 70, 28, '#f2c94c');
    for (let x = 28; x < 98; x += 8) d.rect(x, 50, 4, 6, '#1b1b22');
    d.text('OBRA', 32, 34, '#1b1b22').text('MUNI', 32, 41, '#1b1b22');
    d.rect(58, 4, 34, 24, '#3a3d45').rect(61, 7, 28, 17, '#8fd0ee');
    d.disc(74, 13, 5, PAL.s).rect(69, 7, 10, 2, '#2b1d14').set(72, 12, PAL.k).set(76, 12, PAL.k).rect(71, 16, 6, 1, '#2b1d14');
    d.rect(67, 19, 14, 5, '#2b2b33').rect(70, 19, 2, 5, '#d8343a').rect(72, 19, 2, 5, '#f4f4f4');
    d.rect(44, 10, 5, 18, '#3a3d45').rect(43, 8, 7, 3, '#1b1b22');
    d.rect(10, 44, 20, 5, '#3a3d45').rect(12, 32, 4, 14, '#3a3d45');
    for (let y = 26; y < 72; y++) {
      const x = 2 + Math.round(((y - 49) * (y - 49)) / 120);
      d.rect(x, y, 8, 1, '#9aa0a8').set(x, y, '#c9ced6');
    }
    d.outline();
    d.register(scene, 'alcalde_dozer');
    const mg = new Painter(14, 10);
    mg.rect(0, 3, 4, 4, '#3a3d45').rect(4, 2, 4, 6, '#d8d8d8').rect(8, 0, 5, 10, '#f4f4f4').rect(12, 1, 2, 8, '#c0282e').outline();
    mg.register(scene, 'megafono');
    const db = new Painter(9, 8);
    db.rect(0, 2, 9, 5, '#b0603a').rect(1, 1, 5, 1, '#c87a50').rect(2, 4, 6, 1, '#8a4a2a').rect(5, 2, 1, 5, '#d8d0c0').outline();
    db.register(scene, 'debris');
    const pr = new Painter(40, 16);
    pr.rect(1, 1, 38, 11, '#f4f4f4').rect(6, 12, 4, 3, '#f4f4f4').text('PROMESA', 6, 4, '#c0282e').outline();
    pr.register(scene, 'promesa');
    const md = new Painter(44, 20);
    md.rect(0, 4, 44, 4, '#8a5a33').rect(2, 8, 3, 12, '#5b3a20').rect(39, 8, 3, 12, '#5b3a20').rect(8, 0, 28, 4, '#f4f4f4');
    md.text('DIALOGO', 9, 0, '#1e5fb4').outline();
    md.register(scene, 'mesa_dialogo');
  },

  // Prisoner extras: tied up sitting on the floor, and saluting.
  prisoner(scene) {
    ['poli', 'press'].forEach((skin) => {
      const pal = Object.assign({}, PAL, SKINS[skin].pal);
      const head = HUMAN.HEADS[SKINS[skin].head];
      const t = new Painter(16, 24);
      t.grid([...head, ...HUMAN.TORSO.up.slice(0, 4), ...HUMAN.CROUCH_LEGS], 0, 7, pal);
      t.rect(3, 19, 10, 1, PAL.n).rect(3, 22, 10, 1, PAL.n); // rope
      t.register(scene, `${skin}_tied`);
      const s = new Painter(16, 24);
      s.grid([...head, ...HUMAN.TORSO.up, ...HUMAN.LEGS.stand], 0, 0, pal);
      s.rect(11, 3, 2, 2, PAL.s).rect(11, 5, 2, 4, pal.C).set(10, 3, PAL.s); // hand at the cap (a wave, for the press)
      s.register(scene, `${skin}_salute`);
    });
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

    this.weaponSprites(scene);
  },

  // Projectiles of the pickup weapons + melee tools (all drawn facing right).
  weaponSprites(scene) {
    // Firework rocket: red tube, gold tip, stick.
    new Painter(12, 5).rect(0, 2, 4, 1, '#c8a165').rect(4, 1, 6, 3, '#d8343a').rect(6, 1, 1, 3, '#f2c94c').rect(10, 2, 2, 1, '#f2c94c').outline()
      .register(scene, 'rocket');

    const fl = new Painter(14, 11);
    fl.disc(7, 5, 5, '#e8582a').disc(8, 5, 3, '#ff9d2e').disc(9, 5, 1, '#ffe066');
    fl.register(scene, 'flame');

    // Shotgun cone (origin at its left edge).
    const bl = new Painter(44, 30);
    for (let x = 0; x < 44; x++) {
      const h = 2 + Math.round(x * 0.32);
      bl.rect(x, 15 - h, 1, h * 2, x < 14 ? '#fff6a0' : x < 30 ? '#ffd34d' : '#ff9d2ecc');
    }
    bl.register(scene, 'blast');

    // Fighting rooster (two running frames).
    for (let f = 0; f < 2; f++) {
      const r = new Painter(16, 14);
      r.rect(1, 3, 2, 5, '#1f4a34').rect(2, 2, 2, 3, '#2b6b4a').rect(3, 1, 2, 2, '#1f4a34'); // tail
      r.disc(7, 7, 3, '#c0582a').rect(5, 6, 4, 2, '#8e3a1c'); // body + wing
      r.rect(9, 3, 2, 4, '#e08a3a').disc(11, 3, 2, '#e08a3a'); // neck + head
      r.set(11, 0, '#d8343a').set(12, 0, '#d8343a').set(10, 1, '#d8343a'); // comb
      r.rect(13, 3, 2, 1, '#f2c94c').set(11, 5, '#d8343a').set(12, 2, PAL.k);
      if (f) r.rect(5, 10, 1, 3, '#f2c94c').rect(9, 10, 1, 2, '#f2c94c').set(10, 12, '#f2c94c');
      else r.rect(6, 10, 1, 3, '#f2c94c').rect(8, 10, 1, 3, '#f2c94c');
      r.outline();
      r.register(scene, `rooster${f}`);
    }

    const ball = new Painter(9, 9);
    ball.disc(4, 4, 3, '#f4f4f4').set(4, 4, PAL.k).set(2, 2, PAL.k).set(6, 3, PAL.k).set(3, 6, PAL.k).outline();
    ball.register(scene, 'ball');

    // Delivery drone with a little box.
    const dr = new Painter(14, 9);
    dr.rect(1, 1, 4, 1, '#d8d8d8').rect(9, 1, 4, 1, '#d8d8d8').rect(3, 2, 1, 1, PAL.G).rect(10, 2, 1, 1, PAL.G);
    dr.rect(3, 3, 8, 2, '#3a3d45').rect(5, 5, 4, 3, '#d9a441').set(10, 3, '#ff3a3a');
    dr.register(scene, 'drone');

    new Painter(4, 4).rect(0, 1, 4, 2, '#8a8a8a').rect(1, 0, 2, 4, '#8a8a8a').set(1, 1, '#b0b0b0').register(scene, 'stone');
    new Painter(3, 2).rect(0, 0, 3, 1, '#ffffff').set(1, 1, '#ffffff').register(scene, 'feather');

    // Molotov fire on the ground (two flicker frames).
    for (let f = 0; f < 2; f++) {
      const p = new Painter(9, 13);
      p.disc(4, 9, 3, '#e8582a').rect(3 + f, 2, 3, 6, '#e8582a').disc(4, 9, 2, '#ff9d2e').rect(4, 5 - f, 1, 4, '#ffe066');
      p.register(scene, `fire${f}`);
    }

    // Enemy knife (chaveta), handle on the left.
    new Painter(11, 4).rect(0, 1, 3, 2, '#5b3a20').rect(3, 0, 1, 4, '#5a6068').rect(4, 1, 6, 2, '#d8dde3').set(10, 1, '#d8dde3').outline()
      .register(scene, 'knife');

    // Melee tools, handle on the left.
    new Painter(14, 7).rect(0, 3, 12, 1, '#9aa0a8').rect(11, 0, 1, 7, '#9aa0a8').rect(10, 0, 3, 1, '#5a6068').rect(10, 6, 3, 1, '#5a6068').outline()
      .register(scene, 'melee_tireiron');
    new Painter(16, 4).rect(0, 1, 4, 2, '#3a3d45').rect(4, 1, 11, 2, '#1b1b22').set(4, 0, '#1b1b22').set(4, 3, '#1b1b22').outline()
      .register(scene, 'melee_baton');
    new Painter(17, 6).rect(0, 2, 4, 2, '#5b3a20').rect(4, 1, 11, 3, '#c9ced6').rect(15, 2, 1, 2, '#c9ced6').rect(4, 1, 11, 1, '#f4f4f4').outline()
      .register(scene, 'melee_machete');
    // Fat melee: a big soup ladle.
    new Painter(16, 8).rect(0, 3, 9, 1, '#c9ced6').disc(12, 4, 3, '#c9ced6').disc(12, 3, 2, '#8a8f96').outline()
      .register(scene, 'melee_cucharon');

    // The drugstore owner's handbag (handle on the left).
    const hb = new Painter(16, 12);
    hb.line(0, 5, 6, 2, '#5b3a20').line(6, 2, 8, 5, '#5b3a20').rect(6, 5, 9, 6, '#a84040').rect(6, 5, 9, 1, '#c86060').rect(10, 7, 2, 2, '#f2c94c').outline();
    hb.register(scene, 'melee_handbag');

    const cb = new Painter(16, 12);
    cb.line(0, 6, 5, 6, '#8a5a33').disc(10, 6, 4, '#c9a86a').rect(5, 5, 2, 3, '#8a5a33').text('$', 9, 4, '#2e7d32').outline();
    cb.register(scene, 'melee_coinbag');
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
    // 20x20 crates with a double-size letter: yellow = gun, green = bombs, orange = molotov, red = super grenade.
    const box = (letter, bg, ink = PAL.r) => {
      const p = new Painter(22, 22);
      p.rect(1, 1, 20, 20, bg).rect(1, 1, 20, 2, '#ffffff99').rect(1, 19, 20, 2, '#00000033');
      p.rect(1, 1, 2, 20, '#ffffff55');
      p.text(letter, 9, 7, '#00000066', 2).text(letter, 8, 6, ink, 2);
      p.outline();
      p.register(scene, `pick_${letter}`);
    };
    Object.values(CFG.WEAPONS).forEach((w) => w.letter && box(w.letter, PAL.y));
    const TH = { bombs: '#9fd36a', molotov: '#ff9d2e', super: '#d8343a' };
    Object.entries(CFG.THROWABLES).forEach(([letter, t]) => !t.icon && box(letter, TH[t.id], t.id === 'super' ? PAL.y : PAL.r));

    // Piedras: a pile of stones (no letter) + a little hand-painted sign that floats above it.
    const st = new Painter(22, 14);
    [[5, 9, 4], [12, 9, 4], [17, 10, 3], [8, 5, 3], [14, 5, 3], [11, 2, 2]].forEach(([x, y, r], i) => {
      st.disc(x, y, r, i % 2 ? '#8a8a8a' : '#a3a3a3').set(x - 1, y - 1, '#c8c8c8');
    });
    st.rect(2, 12, 18, 1, '#6e6a62').outline();
    st.register(scene, 'pick_P');
    this.sign(scene, 'sign_P', 'PIEDRAS');
    this.food(scene);
  },

  // Floating label used by drawn pickups (Piedras, food): a little wooden sign on a stick.
  sign(scene, key, text) {
    const p = new Painter(Painter.textWidth(text) + 8, 13);
    p.rect(1, 1, p.w - 2, 8, '#c8955a').rect(1, 8, p.w - 2, 1, '#6e4a26').text(text, 4, 3, '#1b1b22');
    p.rect(Math.floor(p.w / 2), 9, 1, 3, '#6e4a26').outline();
    p.register(scene, key);
  },

  // Peruvian food (pickup kind = CFG.FOOD id) + one vendor cart per food.
  food(scene) {
    const draw = {
      pan: (p) => {
        p.rect(1, 3, 14, 3, '#e2b26a').rect(1, 6, 14, 2, '#7a3b1e').rect(1, 8, 14, 1, '#d23b6a').rect(1, 9, 14, 1, '#f2e2c0').rect(1, 10, 14, 2, '#e2b26a');
        p.set(4, 4, '#f2d29a').set(9, 4, '#f2d29a');
      },
      mote: (p) => {
        p.rect(1, 7, 14, 4, '#c96b4b').rect(3, 11, 10, 1, '#c96b4b'); // clay bowl
        [[3, 5], [6, 4], [9, 5], [12, 5], [5, 6], [8, 6], [11, 6]].forEach(([x, y]) => p.rect(x, y, 2, 2, '#f4ecd0').set(x, y, '#e8d27a'));
      },
      makis: (p) => {
        [2, 7, 12].forEach((x) => p.disc(x, 7, 2, '#1f3b2a').disc(x, 7, 1, '#f4f4f4').set(x, 7, '#ff7a4a'));
        p.rect(0, 10, 16, 2, '#8a5a33');
      },
      morada: (p) => {
        p.rect(5, 2, 7, 10, '#d8eef8').rect(6, 4, 5, 7, '#5a1a6b').rect(6, 4, 5, 1, '#8a3aa0').rect(10, 0, 1, 5, '#f2c94c');
      },
      lomo: (p) => {
        p.rect(0, 9, 16, 2, '#f4f4f4').rect(1, 11, 14, 1, '#d8d8d8'); // plate
        p.disc(4, 7, 2, '#ffffff'); // rice
        [[7, 6], [9, 7], [11, 6], [8, 8]].forEach(([x, y]) => p.rect(x, y, 2, 2, '#6b3a1e')); // beef
        p.set(10, 5, '#d8343a').set(12, 8, '#d8343a').set(7, 8, '#7a3a8a'); // tomato, onion
        [[12, 4], [13, 6], [14, 5]].forEach(([x, y]) => p.rect(x, y, 1, 3, '#f2c94c')); // fries
      },
      caldo: (p) => {
        p.set(5, 0, '#ffffffaa').set(8, 1, '#ffffffaa').set(10, 0, '#ffffffaa'); // steam
        p.rect(1, 5, 14, 5, '#f4f4f4').rect(3, 10, 10, 1, '#f4f4f4').rect(2, 5, 12, 2, '#e8b830'); // broth
        p.rect(9, 2, 2, 4, '#e8c08a').disc(10, 2, 1, '#f4e4c0'); // chicken leg
        p.set(5, 6, '#3c8f4a').set(7, 6, '#f4ecd0');
      },
      jora: (p) => {
        p.rect(3, 1, 10, 11, '#d8eef8').rect(4, 4, 8, 7, '#d9a441').rect(4, 2, 8, 2, '#f8f0d8');
      },
      emoliente: (p) => {
        p.set(6, 0, '#ffffffaa').set(9, 1, '#ffffffaa'); // steam
        p.rect(4, 3, 8, 9, '#d8eef8').rect(5, 5, 6, 6, '#8a6a2a').rect(5, 5, 6, 1, '#b8943a').rect(9, 2, 1, 4, '#3c8f4a');
      },
      pisco: (p) => {
        p.rect(6, 0, 3, 3, '#5a3a20').rect(6, 3, 3, 2, '#d8eef8').rect(4, 5, 7, 7, '#d8eef8').rect(5, 6, 5, 5, '#eef6fa');
        p.rect(4, 8, 7, 3, '#c0282e').text('P', 6, 7, '#f4f4f4');
      },
    };
    for (const [id, f] of Object.entries(CFG.FOOD)) {
      const p = new Painter(16, 13);
      draw[id](p);
      p.outline();
      p.register(scene, `pick_${id}`);
      this.sign(scene, `sign_${id}`, f.sign);

      // Vendor cart: umbrella, counter with the food's sign. The vendor stands behind it (separate sprite).
      const c = new Painter(40, 34);
      c.rect(19, 0, 2, 14, PAL.G);
      for (let y = 0; y < 6; y++) c.rect(8 - y, 2 + y, 24 + y * 2, 1, y % 2 ? '#2c6fd1' : '#f2c94c');
      c.rect(2, 16, 36, 12, '#e0d4b8').rect(2, 16, 36, 2, '#a8743f').rect(2, 26, 36, 2, '#a8743f');
      const w = Painter.textWidth(f.sign);
      if (w <= 34) c.text(f.sign, 20 - Math.floor(w / 2), 20, '#c0282e');
      c.disc(8, 30, 3, PAL.k).disc(32, 30, 3, PAL.k).set(8, 30, PAL.g).set(32, 30, PAL.g);
      c.outline();
      c.register(scene, `stall_${id}`);
    }
  },

  // Breakable gang property (CFG.PROPS), standing on the floor.
  breakables(scene) {
    const box = new Painter(20, 16);
    box.rect(0, 0, 20, 16, '#b88a52').rect(0, 0, 20, 2, '#d4a86a').rect(9, 0, 2, 16, '#c8a165').text('CUPO', 2, 6, '#5b3a20').outline();
    box.register(scene, 'prop_box');

    const bag = new Painter(16, 16);
    bag.disc(8, 10, 5, '#c9a86a').rect(6, 2, 4, 3, '#8a5a33').rect(5, 4, 6, 1, '#5b3a20').text('$', 7, 8, '#2e7d32').outline();
    bag.register(scene, 'prop_lootbag');

    const tr = new Painter(14, 20);
    tr.rect(1, 2, 12, 18, '#3c8f4a').rect(0, 0, 14, 3, '#2e6b3a').rect(3, 6, 1, 12, '#2e6b3a').rect(7, 6, 1, 12, '#2e6b3a').rect(10, 6, 1, 12, '#2e6b3a').outline();
    tr.register(scene, 'prop_trash');

    const br = new Painter(14, 20);
    br.rect(1, 0, 12, 20, '#c0282e').rect(1, 4, 12, 1, '#7a1a1e').rect(1, 15, 12, 1, '#7a1a1e').rect(3, 0, 2, 20, '#e0484e').text('!', 6, 8, PAL.y).outline();
    br.register(scene, 'prop_barrel');

    // The gang's parked motorbike (the biker's bike without its rider), facing left.
    const mo = new Painter(32, 18);
    mo.rect(6, 7, 20, 5, PAL.r).rect(14, 6, 9, 2, PAL.k).rect(24, 8, 4, 2, PAL.G);
    mo.line(6, 13, 8, 3, PAL.G).rect(4, 2, 5, 1, PAL.k);
    mo.disc(6, 13, 4, PAL.k).disc(25, 13, 4, PAL.k).set(6, 13, PAL.g).set(25, 13, PAL.g);
    mo.outline();
    mo.register(scene, 'prop_moto');

    for (let i = 0; i < 3; i++) {
      new Painter(4, 3).rect(0, 0, 4 - i, 3 - (i % 2), ['#b88a52', '#5a6068', '#8a5a33'][i]).register(scene, `debris${i}`);
    }
  },

  // Doorway to the next section: a half-raised metal shutter (22x32).
  door(scene) {
    const p = new Painter(22, 32);
    p.rect(0, 0, 22, 32, '#3a3d45').rect(2, 2, 18, 30, '#151518');
    p.rect(2, 2, 18, 12, '#7d838b');
    for (let y = 3; y < 14; y += 2) p.rect(2, y, 18, 1, '#5a6068');
    p.rect(2, 13, 18, 1, '#2b2b33').outline();
    p.register(scene, 'door');
  },

  // Ride mode: the articulated Metropolitano bus (two cars + accordion), a pedestrian bridge seen side-on
  // (deck + pillar) and lamp posts.
  ride(scene) {
    const b = new Painter(264, 50);
    const car = (x0, x1) => {
      b.rect(x0, 2, x1 - x0, 40, '#e8ecef').rect(x0, 0, x1 - x0, 3, '#9aa0a8'); // body + roof
      b.rect(x0, 30, x1 - x0, 4, '#1e5fb4').rect(x0, 34, x1 - x0, 2, '#f2a33a'); // stripes
      for (let x = x0 + 6; x < x1 - 14; x += 18) b.rect(x, 9, 14, 13, '#3b4a5a').rect(x + 1, 10, 4, 2, '#8fb8d8');
      b.rect(x0, 36, x1 - x0, 6, '#5a6068');
    };
    car(0, 124);
    car(136, 264);
    for (let x = 124; x < 136; x += 2) b.rect(x, 4, 1, 36, '#3a3d45').rect(x + 1, 4, 1, 36, '#5a6068'); // accordion
    b.rect(248, 9, 14, 20, '#8fd0ee').rect(250, 4, 12, 4, PAL.k); // windshield + route display
    b.text('EXPRESO', 180, 24, '#1e5fb4');
    [22, 100, 160, 238].forEach((x) => b.disc(x, 43, 6, PAL.k).set(x, 43, PAL.g));
    b.outline();
    b.register(scene, 'metro_bus');

    const d = new Painter(48, 18);
    d.rect(0, 6, 48, 12, '#9d9a92').rect(0, 6, 48, 2, '#c8c4b8').rect(0, 16, 48, 2, '#6e6a62');
    for (let x = 1; x < 48; x += 5) d.rect(x, 0, 1, 6, '#5a6068');
    d.rect(0, 0, 48, 1, '#5a6068').text('PASE', 16, 10, '#2e7d32');
    d.outline();
    d.register(scene, 'bridge_deck');
    new Painter(14, 72).rect(1, 0, 12, 72, '#8a877f').rect(1, 0, 3, 72, '#a5a29a').outline().register(scene, 'bridge_pillar');

    // Station turnstile (molinete) and the bus door you board through.
    const tt = new Painter(18, 22);
    tt.rect(2, 4, 4, 18, '#9aa0a8').rect(12, 4, 4, 18, '#9aa0a8').rect(6, 10, 6, 2, '#5a6068').rect(2, 2, 14, 3, '#3a3d45').set(8, 3, '#3cff6a');
    tt.outline();
    tt.register(scene, 'turnstile');

    const lp = new Painter(14, 84);
    lp.rect(6, 6, 2, 78, '#5a6068').rect(6, 4, 7, 2, '#5a6068').rect(10, 6, 4, 2, '#f2e2a0');
    lp.register(scene, 'lamppost');
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

  // Terrain tileset: one 16x16 tile per entry of TILE_IDS (src/systems/Terrain.js), left to right.
  tiles(scene) {
    const T = 16, rnd = mulberry32(11);
    const p = new Painter(T * TILE_IDS.length, T);
    const speckle = (ox, y0, n, cols) => {
      for (let i = 0; i < n; i++) p.set(ox + Math.floor(rnd() * T), y0 + Math.floor(rnd() * (T - y0)), cols[i % cols.length]);
    };
    const bricks = (ox, y0, base, mortar) => {
      p.rect(ox, y0, T, T - y0, base);
      for (let y = y0 + 3; y < T; y += 4) {
        p.rect(ox, y, T, 1, mortar);
        for (let x = (Math.floor(y / 4) % 2) * 4; x < T; x += 8) p.rect(ox + x, y - 3, 1, 3, mortar);
      }
    };
    const draw = {
      street_top: (o) => {
        p.rect(o, 0, T, 2, '#c8c4b8').rect(o, 2, T, 4, '#a9a59c').rect(o + 15, 2, 1, 4, '#8d897f');
        p.rect(o, 6, T, 2, '#6e6a62').rect(o, 8, T, 8, '#4b4b52');
        speckle(o, 9, 6, ['#56565e', '#3f3f45']);
      },
      street_lane: (o) => { p.rect(o, 0, T, T, '#4b4b52'); speckle(o, 0, 10, ['#56565e', '#3f3f45']); p.rect(o, 2, T, 2, '#e3c45a'); },
      street: (o) => { p.rect(o, 0, T, T, '#4b4b52'); speckle(o, 0, 10, ['#56565e', '#3f3f45']); },
      brick_top: (o) => { bricks(o, 0, '#a5543c', '#7c3c2a'); p.rect(o, 0, T, 3, '#9d9a92').rect(o, 3, T, 1, '#6e6a62'); },
      brick: (o) => bricks(o, 0, '#a5543c', '#7c3c2a'),
      dirt_top: (o) => { p.rect(o, 0, T, T, '#8f7258'); speckle(o, 3, 8, ['#7d6249', '#a38466']); p.rect(o, 0, T, 3, '#b89a74').rect(o, 3, T, 1, '#a38466'); },
      dirt: (o) => { p.rect(o, 0, T, T, '#8f7258'); speckle(o, 0, 12, ['#7d6249', '#a38466']); },
      slab: (o) => {
        p.rect(o, 0, T, 1, '#c8c4b8').rect(o, 1, T, 4, '#9d9a92').rect(o, 5, T, 1, '#6e6a62');
        p.set(o + 4, 3, '#7e7b74').set(o + 11, 2, '#7e7b74');
      },
      plank: (o) => {
        p.rect(o, 0, T, 4, '#a8743f').rect(o, 0, T, 1, '#c8955a').rect(o, 3, T, 1, '#6e4a26').rect(o + 7, 0, 1, 4, '#6e4a26');
        p.rect(o + 2, 4, 2, 3, '#6e4a26').rect(o + 12, 4, 2, 3, '#6e4a26');
      },
      slope_up: (o) => {
        for (let x = 0; x < T; x++) {
          const s = T - 1 - x;
          p.rect(o + x, s, 1, T - s, '#8f7258').set(o + x, s, '#b89a74');
          if (s + 1 < T) p.set(o + x, s + 1, '#a38466');
        }
      },
      slope_down: (o) => {
        for (let x = 0; x < T; x++) {
          p.rect(o + x, x, 1, T - x, '#8f7258').set(o + x, x, '#b89a74');
          if (x + 1 < T) p.set(o + x, x + 1, '#a38466');
        }
      },
      backwall: (o) => bricks(o, 0, '#5e3a30', '#4a2c24'),
      // Indoor (the comisaría): linoleum floor with a skirting line, office wall below it, plaster, cell bars.
      office_top: (o) => {
        p.rect(o, 0, T, T, '#7a7468').rect(o, 0, T, 3, '#b8a888').rect(o, 3, T, 1, '#8a7a5a');
        for (let x = 0; x < T; x += 8) p.rect(o + x, 4, 1, T - 4, '#6a645a');
      },
      office: (o) => { p.rect(o, 0, T, T, '#7a7468'); speckle(o, 0, 6, ['#6a645a', '#8a8478']); },
      plaster: (o) => {
        p.rect(o, 0, T, T, '#a8b8a0').rect(o, 12, T, 4, '#7a9070');
        speckle(o, 0, 5, ['#98a890', '#b8c8b0']);
      },
      bars: (o) => {
        p.rect(o, 0, T, T, '#3a3d45');
        for (let x = 1; x < T; x += 4) p.rect(o + x, 0, 2, T, '#9aa0a8');
        p.rect(o, 5, T, 1, '#7d838b');
      },
    };
    TILE_IDS.forEach((id, i) => draw[id](i * T));
    p.register(scene, 'tiles');
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
