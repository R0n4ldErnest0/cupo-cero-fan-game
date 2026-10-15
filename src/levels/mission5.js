// Mission Final — "Obra paralizada" (greybox). After the TV report, the union marches to the Municipalidad and the
// serenazgo surrounds the plaza. A) the air level: Don Tito's old police helicopter (2P: a small plane) over Lima;
// B) the plaza, where the town helps (allies = the honest cops you freed; supplies = the expediente's clues);
// C) the Municipalidad; D) the obra paralizada, where "El Jefe" waits in his mech.
MISSIONS.push({
  id: 'municipalidad',
  title: 'MISSION FINAL',
  final: true,
  subtitle: 'OBRA PARALIZADA',
  name: 'LA MUNICIPALIDAD',
  draft: true,
  // The ending (provisional: happy or bittersweet is still to decide).
  story: [
    {
      type: 'tv',
      headline: 'ALCALDE DETENIDO: "Es una persecución política", declaró desde la mesa de diálogo',
      ticker: '· Cae la red de los cupos · Comisario "Archivo" capturado en Tumbes · Transportistas levantan el paro · Gamarra abre todos sus puestos ·',
      face: 'EL ALCALDE (DETENIDO)',
    },
    { type: 'talk', who: 'PANCHO', text: 'Mañana vuelvo a manejar mi combi. Ruta 13-B. Sin cupo. Por Lucho.' },
  ],
  clues: {
    m5a: 'El alcalde firmó la obra, cobró la obra... y nunca hizo la obra.',
    m5b: 'Los serenos tienen orden de no dejar pasar a la prensa.',
    m5c: 'En la oficina del alcalde está la caja chica de los cupos de toda Lima.',
  },
  sections: [
    // A — Vuelo: the old police helicopter Don Tito knew about. Free flight while Lima scrolls by below.
    {
      area: 'VUELO',
      bg: { sky: 0xa8c0e0, hills: 0xb8a088, city: 0x9098a8 },
      flight: {
        speed: 110,
        seconds: 55,
        events: [
          { at: 2, type: 'drone', y: 80 }, { at: 3, type: 'drone', y: 140 },
          { at: 8, type: 'swarm', count: 5 }, { at: 22, type: 'swarm', count: 6 }, { at: 33, type: 'swarm', count: 7 }, { at: 46, type: 'swarm', count: 8 },
          { at: 6, type: 'polheli', y: 70 },
          { at: 10, type: 'tv', y: 40 },
          { at: 12, type: 'drone', y: 60 }, { at: 12.5, type: 'drone', y: 120 }, { at: 13, type: 'drone', y: 160 },
          { at: 17, type: 'polheli', y: 110 }, { at: 19, type: 'polheli', y: 50 },
          { at: 25, type: 'drone', y: 90 }, { at: 25.5, type: 'drone', y: 130 },
          { at: 29, type: 'polheli', y: 80 }, { at: 30, type: 'drone', y: 40 },
          { at: 35, type: 'tv', y: 50 },
          { at: 37, type: 'polheli', y: 60 }, { at: 38, type: 'polheli', y: 140 },
          { at: 43, type: 'drone', y: 70 }, { at: 43.5, type: 'drone', y: 110 }, { at: 44, type: 'drone', y: 150 },
          { at: 48, type: 'polheli', y: 100 },
        ],
      },
      decor: [
      ],
    },
    // B — La plaza: the march is surrounded by the serenazgo and the police. The town helps.
    {
      area: 'PLAZA',
      locks: [{ x: 700, waves: 2 }, { x: 1600, waves: 3 }],
      crowd: { every: 100, types: [{ t: 'sere' }, { t: 'sere' }, { t: 'cop' }, { t: 'riot' }, { t: 'grunt', hp: 2, skin: 'thug2' }] },
      width: 2600,
      town: true,
      bg: { sky: 0xd8c0a0 },
      abuelitas: [{ x: 900 }],
      prisoners: [{ x: 1500, drop: 'H', clue: 'm5b' }],
      props: [{ x: 700, type: 'patrol', drop: 'B' }, { x: 1700, type: 'patrol', drop: 'R' }, { x: 2200, type: 'barrel', drop: 'none' }],
      spawns: [
        { x: 450, t: 'sere' }, { x: 520, t: 'sere' }, { x: 640, t: 'riot' }, { x: 800, t: 'sere' }, { x: 860, t: 'motocop' },
        { x: 1000, t: 'cop' }, { x: 1100, t: 'sere' }, { x: 1180, t: 'riot' }, { x: 1300, t: 'grunt', hp: 2, skin: 'thug2' },
        { x: 1400, t: 'sere' }, { x: 1600, t: 'motocop' }, { x: 1650, t: 'riot' }, { x: 1800, t: 'sere' }, { x: 1900, t: 'cop' },
        { x: 2000, t: 'grunt', hp: 2, skin: 'thug2' }, { x: 2100, t: 'sere' }, { x: 2300, t: 'riot' }, { x: 2400, t: 'sere' },
      ],
      decor: [
        { type: 'image', key: 'vendor_fwd_stand', x: 140 }, { type: 'image', key: 'chato_fwd_stand', x: 160 },
        { type: 'image', key: 'cobradora_fwd_stand', x: 180 }, { type: 'image', key: 'press_fwd_stand', x: 200 },
        { type: 'sign', x: 170, y: 170, text: '¡EL PUEBLO NO SE VENDE!', bg: '#c0282e' },
        { type: 'sign', x: 600, y: 170, text: '¡PARO DE TRANSPORTISTAS!', bg: '#1e5fb4' },
        { type: 'sign', x: 1250, y: 160, text: '¡CUPO CERO!', bg: '#c0282e' },
        { type: 'image', key: 'vendor_fwd_stand', x: 1240 }, { type: 'image', key: 'poli_fwd_stand', x: 1260 },
        { type: 'sign', x: 2000, y: 170, text: 'MUNICIPALIDAD →', bg: '#2e7d32' },
      ],
    },
    // C — Municipalidad: offices, a balcony, the press room. Leaves through the door to the works out back.
    {
      area: 'MUNICIPALIDAD',
      locks: [{ x: 600, waves: 2 }],
      crowd: { every: 120, types: [{ t: 'sere' }, { t: 'sere' }, { t: 'cop' }, { t: 'riot' }] },
      terrain: String.raw`
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;================;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;;;;;;;;;;;f;;;;;;;;;;;;;
        |;;;;;;;;;;==============================;;;;;;;;;;;;;;;--------------------;;;;;===============;;;;;
        |;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        |;;;@;;;;;;;;;;;;;;p;;;;;;;;;;;;;;;r;;;;;;;;;;;g;;;;;;;;;;;;;;;;;;;r;;;;;;;;;;;;;;;;;;;;;;;p;;;;;;;;;
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
      doors: [{ x: 1560 }],
      prisoners: [{ x: 600, y: 176, drop: 'S', clue: 'm5c' }],
      props: [{ x: 300, type: 'lootbag', drop: 'random' }, { x: 900, type: 'box', drop: 'enemy' }, { x: 1300, type: 'lootbag', drop: 'lomo' }],
      decor: [
        { type: 'sign', x: 200, y: 100, text: 'MUNICIPALIDAD — ATENCIÓN AL VECINO\n(CERRADO)', bg: '#2e7d32' },
        { type: 'sign', x: 700, y: 110, text: 'TRANSPARENCIA: PASE NOMÁS\n(NO HAY NADA QUE VER)', bg: '#1b1b22' },
        { type: 'sign', x: 1150, y: 120, text: 'SALA DE PRENSA\n(SIN PRENSA)', bg: '#1e5fb4' },
        { type: 'sign', x: 1520, y: 150, text: 'A LA OBRA →', bg: '#e3842c' },
      ],
    },
    // D — La obra paralizada: the unfinished works behind the Municipalidad. "El Jefe" in his mech.
    {
      area: 'LA OBRA',
      width: 820,
      bg: { sky: 0xe0b890 },
      props: [{ x: 160, type: 'barrel', drop: 'B' }, { x: 260, type: 'lootbag', drop: 'R' }],
      decor: [
        { type: 'sign', x: 200, y: 150, text: 'OBRA: NUEVO PALACIO MUNICIPAL\nINICIO: 2015 · FIN: PRÓXIMAMENTE', bg: '#e3842c' },
        { type: 'graffiti', x: 520, text: 'AQUÍ IBA\nUN HOSPITAL', color: '#1e5fb4' },
      ],
      arena: { alert: ['¡ALERTA!', 'EL JEFE: EL ALCALDE'], boss: 'alcalde' },
    },
  ],
});
