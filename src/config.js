// Global tuning. World units are "pixels" of the 384x216 view (camera zoom 2.5 on a 960x540 canvas).
const FONT = '"Courier New", Courier, monospace';

const CFG = {
  WIDTH: 960,
  HEIGHT: 540,
  ZOOM: 2.5,
  VIEW_W: 384, // = WIDTH / ZOOM
  VIEW_H: 216, // = HEIGHT / ZOOM
  GROUND_Y: 240,
  GRAVITY: 900,
  DEBUG: /[?&]debug/.test(location.search),

  PLAYER: { SPEED: 95, JUMP: 330, INVULN_MS: 2500, START_BOMBS: 10, CAM_LEAD: 160 },

  // Arcade-style credits. Key 5 inserts a coin, F2 toggles FREE PLAY (infinite credits).
  CREDITS: { START: 3, LIVES_PER_CREDIT: 5, CONTINUE_SECONDS: 10, MAX: 99 },

  // Placeholder names/roles — see ROADMAP open questions.
  CHARACTERS: [
    // melee = texture of the close-range weapon (tire iron, police baton, machete, coin bag)
    { id: 'chato', name: 'DON CHATO', role: 'Chofer de combi', melee: 'melee_tireiron' },
    { id: 'sargento', name: 'EL SARGENTO', role: 'Policía retirado (de los honestos)', melee: 'melee_baton' },
    { id: 'merc', name: 'EL MERCENARIO', role: 'Contratado por el gremio', melee: 'melee_machete' },
    { id: 'cobradora', name: 'LA COBRADORA', role: 'Cobradora de combi', melee: 'melee_coinbag' },
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

  // Guns (behavior in src/systems/Weapons.js). letter = what the crate shows and its map marker.
  // The announcer says `voice` (default: the name) in `lang` (default Spanish). H and R keep the arcade's English.
  // Firing: every press shoots as soon as `delay` allows (presses are never lost, so tapping faster shoots
  // faster); holding fire repeats every `hold` ms. Same pickup adds ammo, a different one replaces it.
  WEAPONS: {
    pistol: { name: 'PISTOLA', delay: 55, hold: 240, ammo: Infinity, speed: 340, damage: 1, tex: 'pbullet' },
    mg: { name: 'HEAVY MACHINE GUN', letter: 'H', lang: 'en', delay: 70, hold: 70, ammo: 150, speed: 380, damage: 1, spread: 0.07, tex: 'mgbullet' },
    rocket: { name: 'ROCKET LAUNCHER', letter: 'R', lang: 'en', delay: 260, hold: 300, ammo: 30, speed: 110, maxSpeed: 270, turn: 4, damage: 4, radius: 20 },
    flame: { name: 'ANTICUCHERA', letter: 'A', delay: 280, hold: 320, ammo: 30, speed: 230, life: 420, damage: 3 },
    shotgun: { name: 'ESCOPETA', letter: 'E', delay: 420, hold: 520, ammo: 15, speed: 260, life: 170, damage: 5 },
    rooster: { name: 'GALLO DE PELEA', letter: 'G', delay: 300, hold: 380, ammo: 20, speed: 160, life: 2600, damage: 5, radius: 18 },
    ball: { name: 'PELOTA DE FULBITO', letter: 'F', voice: 'Fulbito', delay: 200, hold: 280, ammo: 30, speed: 150, hop: 230, life: 2600, damage: 3 },
    drone: { name: 'DRON DE DELIVERY', letter: 'D', voice: 'Dron', delay: 180, hold: 260, ammo: 30, speed: 150, maxSpeed: 230, turn: 7, damage: 2 },
    laser: { name: 'PUNTERO LÁSER', letter: 'L', voice: 'Láser', delay: 80, hold: 80, ammo: 150, damage: 1, range: 480 },
  },

  // Throwable pickups (crate letter / map marker -> item). B adds a refill of the current type; M and P turn all
  // your throwables into molotovs / stones and add a refill; S is one super grenade, thrown before the others.
  // P (Piedras) is not a lettered crate: it's a drawn pile of stones with a floating sign (icon: true).
  THROWABLES: {
    B: { id: 'bombs', name: 'BOMBAS', voice: 'Bombas' },
    M: { id: 'molotov', name: 'MOLOTOV', voice: 'Molotov' },
    P: { id: 'stones', name: 'PIEDRAS', voice: 'Piedras', icon: true },
    S: { id: 'super', name: 'SÚPER GRANADA', voice: 'Súper granada' },
  },
  // Throwable types: HUD name and how many a pickup gives.
  THROW_TYPES: {
    grenade: { name: 'GRANADAS', refill: 10 },
    molotov: { name: 'MOLOTOV', refill: 10 },
    stones: { name: 'PIEDRAS', refill: 30 },
  },
  STONE: { damage: 2, vx: 250, vy: -130 },
  GRENADE: { damage: 5, radius: 34, vx: 140, vy: -210 },
  MOLOTOV: { damage: 3, radius: 18, fireMs: 1600, fireDamage: 1, fireTick: 250, fireWidth: 36 },
  SUPER_GRENADE: { damage: 30, radius: 130 },

  // Melee: when an enemy is this close in front, fire hits it instead of shooting.
  MELEE: { RANGE: 22, DAMAGE: 5, DELAY: 200 },

  // Enemy bullets are slow enough to see and jump over, like the arcade. Gunners stop and aim (AIM_MS) before
  // each shot. Any grunt stabs a player who gets within KNIFE_RANGE, after KNIFE_WINDUP ms of warning.
  ENEMY: {
    BULLET_SPEED: 95, GRUNT_SPEED: 35, BIKER_SPEED: 150, BOMB_RADIUS: 20,
    FIRST_SHOT: [1200, 2200], SHOT_GAP: [2200, 3800], AIM_MS: 400,
    KNIFE_RANGE: 20, KNIFE_REACH: 24, KNIFE_WINDUP: 350, KNIFE_COOLDOWN: 900, KNIFER_SPEED: 70,
  },

  COMBI: {
    SPEED: 115, JUMP: 300, HP: 5,
    CANNON_AMMO: 20, CANNON_DAMAGE: 6, CANNON_RADIUS: 30, CANNON_SPEED: 300,
    MG_DELAY: 90, MG_SPEED: 400, WRECK_DAMAGE: 10,
    TURRET_SPEED: 0.006, // rad/ms; the gun turns toward the held direction and keeps its angle
  },

  ABUELITA: { DURATION: 22000, THROW_DELAY: 1000, RANGE: 230, DAMAGE: 2, SPLASH: 16 },

  BOSS1: { HP: 70, RAGE_AT: 35, CHARGE_SPEED: 250, BULLET_SPEED: 100, RAGE_BULLET_SPEED: 125 },

  // Level layouts live in src/levels/missionN.js.
};
