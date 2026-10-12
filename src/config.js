// Global tuning. World units are "pixels" of the 480x270 view (camera zoom 2 on a 960x540 canvas).
const FONT = '"Courier New", Courier, monospace';

const CFG = {
  WIDTH: 960,
  HEIGHT: 540,
  ZOOM: 2,
  VIEW_W: 480,
  VIEW_H: 270,
  GROUND_Y: 240,
  GRAVITY: 900,
  DEBUG: /[?&]debug/.test(location.search),

  PLAYER: { SPEED: 95, JUMP: 330, INVULN_MS: 2500, START_BOMBS: 10, CAM_LEAD: 200 },

  // Arcade-style credits. Key 5 inserts a coin, F2 toggles FREE PLAY (infinite credits).
  CREDITS: { START: 3, LIVES_PER_CREDIT: 5, CONTINUE_SECONDS: 10, MAX: 99 },

  // Placeholder names/roles — see ROADMAP open questions.
  CHARACTERS: [
    { id: 'chato', name: 'DON CHATO', role: 'Chofer de combi' },
    { id: 'sargento', name: 'EL SARGENTO', role: 'Policía retirado (de los honestos)' },
    { id: 'merc', name: 'EL MERCENARIO', role: 'Contratado por el gremio' },
    { id: 'cobradora', name: 'LA COBRADORA', role: 'Cobradora de combi' },
  ],

  // Keyboard maps. Solo accepts every layout; 2P splits the keyboard (gamepads also work: A jump, X fire, B grenade).
  KEYS: {
    solo: {
      left: ['LEFT', 'A'], right: ['RIGHT', 'D'], up: ['UP', 'W'], down: ['DOWN', 'S'],
      fire: ['X', 'J', 'F'], jump: ['Z', 'SPACE', 'K', 'G'], bomb: ['C', 'L', 'H'], start: ['ENTER', 'ONE'],
    },
    p1: { left: ['A'], right: ['D'], up: ['W'], down: ['S'], fire: ['F'], jump: ['G'], bomb: ['H'], start: ['ONE'] },
    p2: {
      left: ['LEFT'], right: ['RIGHT'], up: ['UP'], down: ['DOWN'],
      fire: ['COMMA', 'NUMPAD_ONE'], jump: ['PERIOD', 'NUMPAD_TWO'], bomb: ['FORWARD_SLASH', 'NUMPAD_THREE'], start: ['TWO'],
    },
  },

  WEAPONS: {
    pistol: { delay: 200, speed: 340, damage: 1, ammo: Infinity, tex: 'pbullet' },
    mg: { delay: 70, speed: 380, damage: 1, ammo: 150, spread: 0.07, tex: 'mgbullet' },
  },

  GRENADE: { damage: 5, radius: 34, vx: 140, vy: -210 },

  ENEMY: { BULLET_SPEED: 150, GRUNT_SPEED: 35, BIKER_SPEED: 150, BOMB_RADIUS: 20 },

  COMBI: {
    SPEED: 115, JUMP: 300, HP: 5,
    CANNON_AMMO: 20, CANNON_DAMAGE: 6, CANNON_RADIUS: 30, CANNON_SPEED: 300,
    MG_DELAY: 90, MG_SPEED: 400, WRECK_DAMAGE: 10,
    TURRET_SPEED: 0.006, // rad/ms; the gun turns toward the held direction and keeps its angle
  },

  ABUELITA: { DURATION: 22000, THROW_DELAY: 1000, RANGE: 230, DAMAGE: 2, SPLASH: 16 },

  BOSS1: { HP: 70, RAGE_AT: 35, CHARGE_SPEED: 250 },

  LEVEL1: {
    WIDTH: 3900,
    ARENA_X: 3420, // camera locks here: arena spans ARENA_X .. WIDTH
    COMBI_X: 1840,
    ABUELITA_X: 1040,
    COP_CAR_X: 2700,
    CRATES: [
      { x: 560, stack: 2 },
      { x: 1420, stack: 1 },
      { x: 2390, stack: 2 },
      { x: 2412, stack: 1 },
      { x: 2950, stack: 1 },
    ],
    PICKUPS: [
      { x: 1350, kind: 'H' },
      { x: 2620, kind: 'B' },
      { x: 3160, kind: 'food' },
      { x: 3330, kind: 'H' },
    ],
    // y = spawn height (defaults to ground). Bikers always enter from the right edge.
    SPAWNS: [
      { x: 470, t: 'grunt' },
      { x: 560, t: 'grunt', y: 190 },
      { x: 700, t: 'grunt', skin: 'thug2' },
      { x: 770, t: 'grunt', variant: 'thrower' },
      { x: 930, t: 'biker' },
      { x: 1180, t: 'grunt' },
      { x: 1230, t: 'grunt', skin: 'thug2' },
      { x: 1290, t: 'grunt', variant: 'thrower' },
      { x: 1420, t: 'grunt', y: 210 },
      { x: 1560, t: 'biker' },
      { x: 1620, t: 'grunt' },
      { x: 1680, t: 'grunt', skin: 'thug2' },
      { x: 2050, t: 'grunt' },
      { x: 2100, t: 'grunt', variant: 'thrower' },
      { x: 2150, t: 'grunt', skin: 'thug2' },
      { x: 2250, t: 'biker' },
      { x: 2330, t: 'biker' },
      { x: 2390, t: 'grunt', y: 190 },
      { x: 2460, t: 'grunt' },
      { x: 2520, t: 'grunt', variant: 'thrower' },
      { x: 2800, t: 'grunt' },
      { x: 2850, t: 'grunt', skin: 'thug2' },
      { x: 2900, t: 'biker' },
      { x: 2950, t: 'grunt', y: 210 },
      { x: 3000, t: 'grunt', variant: 'thrower' },
      { x: 3060, t: 'grunt' },
      { x: 3200, t: 'biker' },
      { x: 3250, t: 'grunt' },
      { x: 3300, t: 'grunt', skin: 'thug2', variant: 'thrower' },
    ],
  },
};
