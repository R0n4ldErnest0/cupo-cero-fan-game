// Mission 4 — "Su denuncia es importante para nosotros" (greybox). Inside the comisaría: A) the front desk, B) offices
// and cells (cuperos get let out to help the police; the journalist is locked up here), C) the evidence room with the
// seized cupo money and a wall of riot cops; D) the escape in the stolen rochabus (the screen scrolls on its own),
// ending with the Comisario in his filing-cabinet mech.
//
// Map key: see src/systems/Terrain.js (indoor tiles: ~ office floor, ; plaster back wall, ! cell bars).
MISSIONS.push({
  id: 'comisaria',
  title: 'MISSION 4',
  subtitle: 'SU DENUNCIA ES IMPORTANTE PARA NOSOTROS',
  name: 'LA COMISARÍA',
  draft: true,
  bg: { sky: 0x505058, hills: 0x404048, city: 0x48484f },
  // Expediente: the comisario reports to a regidor; the public-works company is the mayor's.
  clues: {
    m4a: 'El comisario le pasa la plata a un regidor de la comisión de Obras.',
    m4b: 'Soy periodista. Tengo todo grabado: si salimos de aquí, esto sale esta noche en el noticiero.',
    m4c: '"Obras y Proyectos El Progreso SAC" está a nombre del cuñado del alcalde.',
  },
  sections: [
    // A — Mesa de partes: the lobby. An endless queue of complaints; cops fire ARCHIVADO stamps... and shoot.
    {
      area: 'MESA DE PARTES',
      locks: [{ x: 700, waves: 2 }],
      crowd: { every: 120, types: [{ t: 'cop' }, { t: 'cop' }, { t: 'riot' }, { t: 'grunt' }] },
      terrain: String.raw`
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;=========;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;=======;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;g;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;-------;;;;;;;;;;;;;;;===============;;;;;;;;;;;;;;;-------;;;;;;;;;;;===============;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;@;;;;;;;;;;;;;;;;p;;;;;g;;;;;;;;;;;;;;;;;;;;;r;;;;;;p;;;;;;;;;;;;;;k;;;;;;;;;;;;;;;;;;;;;;;;;r;;;;;p;;;;;;;
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
      prisoners: [{ x: 1000, drop: 'H', clue: 'm4a' }],
      props: [
        { x: 400, type: 'box', drop: 'random' }, { x: 900, type: 'lootbag', drop: 'B' }, { x: 1300, type: 'box', drop: 'enemy' },
      ],
      pickups: [{ x: 300, kind: 'E' }],
      decor: [
        { type: 'image', key: 'vendor_fwd_stand', x: 100 }, { type: 'image', key: 'chato_fwd_stand', x: 118 },
        { type: 'image', key: 'cobradora_fwd_stand', x: 136 }, { type: 'image', key: 'thug2_fwd_stand', x: 154 },
        { type: 'sign', x: 120, y: 150, text: 'COLA DE DENUNCIAS\nTIEMPO DE ESPERA: 3 AÑOS', bg: '#1b1b22' },
        { type: 'sign', x: 600, y: 96, text: 'MESA DE PARTES', bg: '#2e7d32' },
        { type: 'sign', x: 1100, y: 110, text: 'SU DENUNCIA ES IMPORTANTE\nPARA NOSOTROS', bg: '#1e5fb4' },
        { type: 'sign', x: 1500, y: 110, text: 'TURNO N° 4,821', bg: '#c0282e' },
      ],
    },
    // B — Offices and cells, several floors. The cells open as you pass: the cuperos are released to fight for the
    // police. The journalist is locked in a cell upstairs.
    {
      area: 'OFICINAS Y CELDAS',
      locks: [{ x: 900, waves: 2 }],
      crowd: { every: 130, types: [{ t: 'cop' }, { t: 'grunt', variant: 'knife' }, { t: 'riot' }] },
      terrain: String.raw`
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!!!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;!!!!!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;============================================;;;;===========================================================;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;!!!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;g;;;;;;;;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;============================================;;;;===========================================================;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;g;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;!!!!!!!!!!!;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;;;;r;;;;;;;;;;;;;;;
        |;;;;;;============================================;;;;===========================================================;;;;;;;
        |;;;;;;;;;;;;;;!!!!!!!!!;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;!!!!!!!!!;;;;;;;;;;;
        |;;;@;;;;;;;;;;!!!!!!!!!;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;r;;;;;;;;;;;;;;;;;;;;;;;k;;;;;;;;;;;;;;;;;;;!!!!!!!!!;;;p;;;;;;;
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
      prisoners: [
        { x: 520, y: 256, skin: 'press', drop: 'R', clue: 'm4b' },
        { x: 1500, y: 208, drop: 'random', clue: 'm4c' },
      ],
      props: [{ x: 700, type: 'box', drop: 'random' }, { x: 1250, type: 'lootbag', drop: 'emoliente' }],
      pickups: [{ x: 900, y: 304, kind: 'L' }],
      decor: [
        { type: 'sign', x: 290, y: 300, text: 'CELDA 1', bg: '#1b1b22' },
        { type: 'sign', x: 1040, y: 252, text: 'CELDA 2', bg: '#1b1b22' },
        { type: 'sign', x: 1440, y: 156, text: 'OFICINA DEL COMISARIO\n(NO MOLESTAR)', bg: '#2e7d32' },
      ],
      events: [
        {
          x: 260,
          run: (s) => {
            Fx.say(s, s.players[0], '¡Están soltando a los cuperos!', 1600);
            [{ x: 260, y: 352 }, { x: 300, y: 352 }].forEach((p) => s.spawnEnemy({ t: 'grunt', variant: 'knife', y: p.y }, p.x));
          },
        },
        {
          x: 980,
          run: (s) => [1000, 1060].forEach((x) => s.spawnEnemy({ t: 'grunt', y: 304 }, x)),
        },
        { x: 1620, run: (s) => [1640, 1700].forEach((x) => s.spawnEnemy({ t: 'grunt', variant: 'thrower', y: 352 }, x)) },
      ],
    },
    // C — Sala de evidencias: the seized cupo money ("INCAUTADO"). Mid-boss: a wall of riot cops.
    {
      area: 'SALA DE EVIDENCIAS',
      terrain: String.raw`
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;=====;;;;;;;;;;;;=====;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;g;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;=======;;;;;;;;;=========;;;;;;;;;-----;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;@;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;r;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
      props: [
        { x: 160, type: 'lootbag', drop: 'random' }, { x: 260, type: 'lootbag', drop: 'B' }, { x: 420, type: 'box', drop: 'none' },
        { x: 560, type: 'lootbag', drop: 'lomo' }, { x: 640, type: 'barrel', drop: 'none' },
      ],
      pickups: [{ x: 500, kind: 'R' }],
      decor: [
        { type: 'sign', x: 300, y: 100, text: 'EVIDENCIAS: CUPOS INCAUTADOS\n(SE LOS QUEDA EL COMISARIO)', bg: '#c0282e' },
      ],
      arena: {
        alert: ['¡ALERTA!', 'EL MURO ANTIMOTINES'],
        waves: [
          [{ dx: 330, t: 'riot' }, { dx: 300, t: 'riot' }, { dx: 270, t: 'riot' }, { dx: -20, t: 'cop' }],
          [{ dx: 330, t: 'riot' }, { dx: 305, t: 'riot' }, { dx: 280, t: 'riot' }, { dx: 255, t: 'riot' }, { dx: -20, t: 'riot' }],
        ],
      },
    },
    // D — La fuga: steal the rochabus and escape down the street (the screen scrolls on its own). Patrol cars block
    // the way. At the end the Comisario comes out in his filing-cabinet mech.
    {
      area: 'LA FUGA',
      crowd: { every: 110, types: [{ t: 'cop' }, { t: 'cop' }, { t: 'riot' }, { t: 'motocop' }] },
      width: 3000,
      autoscroll: 45,
      bg: { sky: 0x8090a8 },
      rochabus: { x: 120 },
      props: [
        { x: 700, type: 'patrol', drop: 'random' }, { x: 1200, type: 'patrol', drop: 'none' }, { x: 1700, type: 'patrol', drop: 'B' },
        { x: 2200, type: 'patrol', drop: 'none' }, { x: 2450, type: 'barrel', drop: 'none' },
      ],
      spawns: [
        { x: 450, t: 'cop' }, { x: 520, t: 'riot' }, { x: 640, t: 'motocop' }, { x: 900, t: 'cop' }, { x: 960, t: 'cop' },
        { x: 1100, t: 'motocop' }, { x: 1300, t: 'riot' }, { x: 1400, t: 'cop' }, { x: 1550, t: 'motocop' },
        { x: 1800, t: 'riot' }, { x: 1850, t: 'cop' }, { x: 2000, t: 'motocop' }, { x: 2300, t: 'cop' }, { x: 2350, t: 'riot' },
      ],
      decor: [
        { type: 'sign', x: 240, y: 196, text: 'ROCHABUS: ↓ SUBIR\nX AGUA · C GAS', bg: '#2e7d32' },
        { type: 'graffiti', x: 1000, text: 'LA POLICÍA\nNO ES EL PUEBLO', color: '#1e5fb4' },
        { type: 'graffiti', x: 2000, text: '¡FUERA\nCUPEROS!', color: '#c0282e' },
      ],
      arena: { alert: ['¡ALERTA!', 'EL COMISARIO'], boss: 'comisario' },
    },
  ],
  // After the mission: the journalist airs everything (the arc's trigger).
  story: [
    {
      type: 'tv',
      headline: 'EL LIBRO DE LOS CUPOS: la banda, la comisaría y "EL JEFE"',
      ticker: '· Comisario "Archivo" se da a la fuga · El libro registra pagos a la Municipalidad · "Obras y Proyectos El Progreso SAC" a nombre del cuñado del alcalde ·',
      face: '"EL JEFE" ES...',
      reveal: 'EL ALCALDE',
    },
    { type: 'talk', who: 'DIRIGENTE DEL GREMIO', text: '¡Mañana paro y marcha a la Municipalidad! (Y el alcalde ya mandó a los serenos a rodear la plaza.)' },
    { type: 'talk', who: 'DON TITO', text: 'Entonces llegamos por el aire. Sé dónde hay un helicóptero viejo... todavía vuela.' },
  ],
});
