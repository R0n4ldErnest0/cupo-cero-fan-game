// Global tuning. World units are "pixels" of the 320x180 view (camera zoom 3 on a 960x540 canvas). The zoom must be
// a whole number: with 2.5 every game pixel was 2 or 3 screen pixels and characters seemed to change size.
const FONT = '"Courier New", Courier, monospace';

const CFG = {
  WIDTH: 960,
  HEIGHT: 540,
  ZOOM: 3,
  VIEW_W: 320, // = WIDTH / ZOOM
  VIEW_H: 180, // = HEIGHT / ZOOM
  GROUND_Y: 240,
  GRAVITY: 900,
  DEBUG: /[?&]debug/.test(location.search),
  // Testing shortcuts (F2-F8, ?mission=, ?section=): only with ?dev in the URL, on localhost or from a local file.
  DEV: /[?&]dev/.test(location.search) || ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:',
  ALERT_MS: 1100, // how long a boss / ambush warning stays on screen
  SHOW_FPS: /[?&](fps|debug)/.test(location.search), // FPS meter + worst frame of the last 3 s (HUD, bottom)

  PLAYER: { SPEED: 95, JUMP: 330, INVULN_MS: 2500, START_BOMBS: 10, CAM_LEAD: 135 },

  // Story intro crawl after character select (src/scenes/IntroScene.js): scroll speed.
  INTRO: { MS_PER_PX: 28 },

  // Arcade-style credits. Key 5 inserts a coin, F2 toggles FREE PLAY (infinite credits).
  CREDITS: { START: 3, LIVES_PER_CREDIT: 5, CONTINUE_SECONDS: 10, MAX: 99 },

  // Placeholder names/roles — see ROADMAP open questions.
  CHARACTERS: [
    // melee = texture of the close-range weapon (tire iron, police baton, machete, handbag).
    // ids are internal (sprite keys); names are what the game shows.
    { id: 'chato', name: 'PANCHO', role: 'Chofer de combi', melee: 'melee_tireiron' },
    { id: 'sargento', name: 'DON TITO', role: 'Policía retirado (de los honestos)', melee: 'melee_baton' },
    { id: 'merc', name: 'AMARU', role: 'Mercenario contratado por el gremio', melee: 'melee_machete' },
    { id: 'cobradora', name: 'INÉS', role: 'Dueña de una botica extorsionada', melee: 'melee_handbag' },
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

  // Food (pickup kind = id; map marker = marker). fill adds to the fullness counter: at FAT.AT you get fat.
  // drink: alcoholic (DRUNK.DRINKS of them within DRUNK.WINDOW ms makes you drunk); cures: sobers you up;
  // diet: makes you thin again (Metal Slug's diet powder).
  // sign: the label floating over the item (3x5 font, no accents).
  FOOD: {
    pan: { name: 'PAN CON CHICHARRÓN', sign: 'CHICHARRON', marker: 'O', points: 500, fill: 3 },
    mote: { name: 'MOTE', sign: 'MOTE', marker: 'U', points: 200, fill: 1 },
    makis: { name: 'MAKIS', sign: 'MAKIS', marker: 'N', points: 500, fill: 3 },
    morada: { name: 'CHICHA MORADA', sign: 'CHICHA MORADA', marker: 'Z', points: 200, fill: 1 },
    lomo: { name: 'LOMO SALTADO', sign: 'LOMO SALTADO', marker: 'Y', points: 1000, fill: 8 },
    caldo: { name: 'CALDO DE GALLINA', sign: 'CALDO', marker: 'Q', points: 500, fill: 3, cures: true },
    jora: { name: 'CHICHA DE JORA', sign: 'JORA', marker: 'J', points: 300, fill: 1, drink: true },
    pisco: { name: 'PISCO', sign: 'PISCO', marker: 'X', points: 300, fill: 0, drink: true },
    emoliente: { name: 'EMOLIENTE', sign: 'EMOLIENTE', marker: 'K', points: 200, fill: 0, diet: true },
  },
  // Fat (Metal Slug 2/X/3): eat FAT.AT worth of `fill` in one life. Slower, but pistol/machine-gun bullets are big
  // (x DAMAGE), the laser is thick (x DAMAGE) with an energy ball where it hits, flame/shotgun/rockets hit x WEAPON,
  // grenades are bigger, stones become boulders and melee is a cucharón. Ends after SLIM_MS without eating,
  // with an emoliente, or by dying.
  FAT: {
    AT: 10, SLIM_MS: 40000, SPEED: 0.7, JUMP: 0.86, SCALE_X: 1.3,
    BULLET_SCALE: 2, DAMAGE: 2, WEAPON: 1.5, GRENADE_SCALE: 1.6, GRENADE_RADIUS: 1.4, BOULDER_SCALE: 2.5, BOULDER_DAMAGE: 5,
  },
  // Drunk: you stumble, your aim wobbles and the screen sways for MS ms (caldo de gallina cures it).
  DRUNK: { DRINKS: 3, WINDOW: 20000, MS: 8000, STUMBLE: [500, 1100], STUMBLE_SPEED: 70, AIM_WOBBLE: 0.22, SWAY: 0.025 },
  // Street vendors toss their food to a player passing by (they're on our side, never targets).
  VENDOR: { RANGE: 48, TOSS: 2, COOLDOWN: 1200 },
  // Gang property you can break (mission `props`): hp, explodes (hurts enemies around), what it can drop.
  // drop in the mission data: an item kind, 'random' (RANDOM_DROPS), 'enemy' (a cupero jumps out) or 'none'.
  PROPS: {
    box: { hp: 2, score: 50 },
    lootbag: { hp: 2, score: 200 },
    trash: { hp: 3, score: 50 },
    barrel: { hp: 4, score: 100, explodes: true },
    moto: { hp: 6, score: 300, explodes: true },
    patrol: { hp: 8, score: 500, explodes: true }, // a patrol car blocking the street (Mission 4 escape)
  },
  RANDOM_DROPS: ['pan', 'mote', 'makis', 'morada', 'lomo', 'caldo', 'jora', 'pisco', 'emoliente', 'B', 'pan', 'mote', 'jora'],

  // Prisoners (Metal Slug's POWs): honest cops the gang tied up. Freed by a shot or a touch, they walk to you,
  // hand over an item (mission data; 'random' = RANDOM_DROPS) and run off. The rescue count gives BONUS points
  // each at the end of a mission, and goes back to 0 when you die (arcade rule).
  PRISONER: { BONUS: 1000, WALK: 45, GIVE_AFTER: 2500, RUN: 130 },

  // Ride mode (src/systems/Ride.js): the Metropolitano bus roof. The ride section's map is one screen wide and 14 rows
  // (224) tall; the road is at ROAD_Y, the roof at ROOF_Y. ROOFS: [x0, x1, dy] of each roof part, relative to the
  // bus (two cars and the lower accordion joint). A bridge deck passes DUCK_CLEARANCE above the roof: crouch!
  RIDE: {
    ROAD_Y: 200, ROOF_Y: 152, BUS_X: 28, BUS_W: 264, ROOFS: [[2, 124, 0], [124, 136, 4], [136, 262, 0]],
    DUCK_CLEARANCE: 15, WARN_MS: 1600, BRAKE_MS: 2500, POST_EVERY: 260,
    // Bus-to-bus transfer: the next bus catches up at TRANSFER_APPROACH px/s, then both drift left for
    // TRANSFER_TOGETHER ms with a TRANSFER_GAP px gap (jump!), then it settles into place.
    TRANSFER_GAP: 34, TRANSFER_APPROACH: 90, TRANSFER_SPEED: 22, TRANSFER_TOGETHER: 3800, TRANSFER_SETTLE: 70,
  },

  // Melee: when an enemy is this close in front, fire hits it instead of shooting.
  MELEE: { RANGE: 22, DAMAGE: 5, DELAY: 200 },

  // Enemy bullets are slow enough to see and jump over, like the arcade. Gunners stop and aim (AIM_MS) before
  // each shot. Any grunt stabs a player who gets within KNIFE_RANGE, after KNIFE_WINDUP ms of warning.
  ENEMY: {
    BULLET_SPEED: 95, GRUNT_SPEED: 35, BIKER_SPEED: 150, BOMB_RADIUS: 20,
    // Chatter: only some enemies talk (once), and few have a last word, so speech bubbles don't crowd the screen.
    TALK_CHANCE: 0.25, DEATH_LINE_CHANCE: 0.12,
    LOB_TIME: 1.3, // seconds a thrown bomb (molotov) takes to land: longer = slower, easier to dodge
    BRAWLER_CHANCE: 0.33, BRAWLER_SPEED: 55, // some gunners (and cops) walk up to stab you and shoot less
    FIRST_SHOT: [1200, 2200], SHOT_GAP: [2200, 3800], AIM_MS: 400,
    KNIFE_RANGE: 20, KNIFE_REACH: 24, KNIFE_WINDUP: 350, KNIFE_COOLDOWN: 900, KNIFER_SPEED: 70,
  },

  COMBI: {
    SPEED: 115, JUMP: 300, HP: 5,
    CANNON_AMMO: 20, CANNON_DAMAGE: 6, CANNON_RADIUS: 30, CANNON_SPEED: 300,
    MG_DELAY: 90, MG_SPEED: 400, WRECK_DAMAGE: 10,
    TURRET_SPEED: 0.006, // rad/ms; the gun turns toward the held direction and keeps its angle
    LEVEL_SHOT_HEIGHT: 16, // a vehicle's level shots leave at this height above the ground (enemies' chest)
  },

  // Mototaxi Slug (src/entities/MototaxiSlug.js): fast, high jump, few hits. Grenades thrown by the passenger;
  // ↓ + grenade = bocinazo (stuns STUN_MS and pushes back enemies within HONK_RANGE in front).
  MOTOTAXI: {
    HP: 3, SPEED: 150, JUMP: 360, MG_DELAY: 100, MG_SPEED: 400,
    GRENADES: 15, HONKS: 3, HONK_REFILL: 6000, HONK_RANGE: 96, STUN_MS: 1600,
  },

  // Rochabus (src/entities/RochabusSlug.js): the stolen water-cannon truck. Water knocks back and stuns (STUN_MS).
  ROCHABUS: {
    HP: 6, SPEED: 85, JUMP: 250, MG_SPEED: 0, GRENADES: 10,
    WATER_DELAY: 60, WATER_SPEED: 320, WATER_DAMAGE: 0.35, STUN_MS: 700, WATER_DROOP: 300, // jet gravity (px/s²)
  },

  // Flight section (Mission 5 air level, src/systems/Flight.js + entities/Aircraft.js, Flyer.js).
  AIRCRAFT: { HP: 4, ROCKETS: 12, SPEED: 130, PLANE_SPEED: 160, DELAY: 90, PLANE_DELAY: 70, FLOOR_MARGIN: 36 },
  FLYERS: {
    polheli: { hp: 6, score: 400, speed: 90, stay: 9 },
    drone: { hp: 1, score: 150, speed: 85 },
    tv: { hp: 1, score: 0, speed: 35 },
    // Missile plane: aligns with you, the warning line blinks WARN ms, then a slow missile flies straight across.
    plane: { hp: 8, score: 600, speed: 120, aimMs: 500, warn: 950, missile: 115, gap: 450 },
    // Parachuting serenazgo: falls slowly, drifts back and shoots now and then.
    para: { hp: 1, score: 200, fall: 24, drift: 16, shot: [1600, 2400] },
  },

  // The town helps in the Mission 5 plaza (src/systems/Town.js): allies = freed honest cops, supplies = clues.
  TOWN: {
    ALLY_SPEED: 70, ALLY_RANGE: 220, ALLY_SHOT_MS: 900, ALLY_HITS: 3, MAX_ALLIES: 5, FREED_PER_ALLY: 3,
    REINFORCE_MS: 4000, TANK_BACK_MS: 9000, HELI_FIRST_MS: 4000, HELI_MS: 9000,
    SUPPLY_MS: 9000, SUPPLY_MIN_MS: 3500, SUPPLY_PER_CLUE: 450, SUPPLIES: ['B', 'H', 'pan', 'mote', 'R', 'caldo', 'B'],
  },

  ABUELITA: { DURATION: 22000, THROW_DELAY: 1000, RANGE: 230, DAMAGE: 2, SPLASH: 16 },

  // Corrupt police (Mission 3 on). Patrullero = Grunt preset 'cop' (2 hp, 2-shot bursts); motocop = Biker preset.
  RIOT: { HP: 2, SHIELD: 5, SPEED: 18, SWING_RANGE: 22, SWING_WINDUP: 400, PEEK_EVERY: [2800, 4200], PEEK_MS: 900 },
  SNIPER: { AIM_MS: 1100, LOCK_MS: 380, BULLET_SPEED: 260, RELOAD: [1800, 2800] },

  // CHARGE_REV: ms he revs up in place, flashing (the warning). While charging only the low front hurts: jump over him.
  BOSS1: { HP: 70, RAGE_AT: 35, CHARGE_SPEED: 230, CHARGE_REV: 1150, BULLET_SPEED: 100, RAGE_BULLET_SPEED: 125 },
  // Mission 2 mid-boss (src/entities/BossTruck.js): the armored collection truck.
  TRUCK: { HP: 80, TURRET_HP: 14, RAM_SPEED: 230, BULLET_SPEED: 120 },
  // Mission 2 boss (src/entities/BossContador.js): the accountant's mech.
  // Stomp: crouches STOMP_WINDUP ms, jumps, hangs STOMP_HANG ms over a shadow where he'll land, falls in STOMP_FALL ms.
  CONTADOR: { HP: 110, ARM_HP: 16, WALK: 22, STOMP_HEIGHT: 90, STOMP_WINDUP: 550, STOMP_HANG: 650, STOMP_FALL: 480, BILL_SPEED: 120, BOLETA_SPEED: 60 },
  // Mission 4 boss (src/entities/BossComisario.js): the filing-cabinet mech.
  COMISARIO: { HP: 130, DRAWER_HP: 18, CHARGE_SPEED: 170, STAMP_SPEED: 125, RAIN_SPEED: 70 },
  // Final boss (src/entities/BossAlcalde.js): the mayor's bulldozer. RAM_REV ms of warning before the ram; it stops
  // RAM_GAP px short of the screen edge (a safe pocket). GUARD_MS: police come to defend him, up to MAX_GUARDS.
  ALCALDE: {
    HP: 200, PART_HP: 20, PROMISE_SPEED: 55, PROMISE_MS: 3200, DIALOGO_MS: 3000,
    RAM_REV: 1100, RAM_SPEED: 160, RAM_GAP: 34, RUBBLE_T: 1.05, GUARD_MS: 6500, MAX_GUARDS: 3,
  },
  // Police tanquetas (src/entities/PoliceTank.js), the honest police's and the serenazgo's (weaker than a Slug).
  TANK: { SPEED: 55, CATCHUP: 125, RANGE: 230, ALLY_HP: 8, ALLY_SHOT_MS: 2200, ENEMY_HP: 10, ENEMY_SHOT_MS: 2600, WARN_MS: 450, SHELL_SPEED: 115, STOP_AT: 130, SCORE: 800 },
  // The honest police's helicopter (src/entities/AllyHeli.js): bomber passes and the air-level escort.
  ALLY_HELI: { SPEED: 70, BOMBS: 3, DROP_GAP: 500, RANGE: 220, SHOT_MS: 700 },
  // Mission 3 boss (src/entities/BossHeli.js): hovers HOVER px above the floor, comes down to DROP_HOVER to lower cops.
  HELI: { HP: 90, PART_HP: 15, HOVER: 100, DROP_HOVER: 64, DRIFT: 70, BULLET_SPEED: 100, MISSILE_SPEED: 90, MAX_ENEMIES: 2 },

  // Level layouts live in src/levels/missionN.js.
};
