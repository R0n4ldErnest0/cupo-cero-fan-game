// Mission Final — "Obra paralizada" (greybox). After the report goes out, the union marches to the Municipalidad and
// the serenazgo surrounds the plaza. The honest police fight with you all mission long (section `town`, see Town.js):
// A) the air level: Don Tito's old police helicopter (2P: a small plane) over Lima, escorted by the honest police's
// helicopter; B) the plaza: a Combi Slug, honest cops on foot and their tanqueta against the serenazgo and its tanquetas;
// supplies from the neighbors (more with more clues); C) the Municipalidad, the cops still with you; D) the obra
// paralizada: the mayor in his bulldozer, his police coming to defend him, the honest police bombing from a helicopter.
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
      ticker: '· Cae la red de los cupos · Comisario "Archivo" capturado en Tumbas · Transportistas levantan el paro · Kamarra abre todos sus puestos ·',
      face: 'EL ALCALDE (DETENIDO)',
    },
    { type: 'talk', who: 'PANCHO', text: 'Mañana vuelvo a manejar mi combi. Ruta 13-B. Sin cupo. Por Lucho.' },
    {
      type: 'text',
      title: '',
      lines: [
        'Para ti, esto fue un juego. Para mucha gente, no lo es.',
        'Seamos parte de la conversación: visibiliza, cuestiona, critica, elige responsablemente.',
        'Para que algún día, para ellos también, esto sea solo un juego.',
      ],
    },
  ],
  clues: {
    m5a: 'El alcalde firmó la obra, cobró la obra... y nunca hizo la obra.',
    m5b: 'Los serenos tienen orden de no dejar pasar a la prensa.',
    m5c: 'En la oficina del alcalde está la caja chica de los cupos de toda Pima.',
  },
  sections: [
    // A — Vuelo: the old police helicopter Don Tito knew about. Free flight while Lima scrolls by below.
    {
      area: 'VUELO',
      town: { escort: true },
      bg: { sky: 0xa8c0e0, hills: 0xb8a088, city: 0x9098a8 },
      flight: {
        speed: 110,
        seconds: 55,
        events: [
          { at: 2, type: 'drone', y: 80 }, { at: 3, type: 'drone', y: 140 },
          { at: 5, type: 'polheli', y: 70 },
          { at: 8, type: 'swarm', count: 5 },
          { at: 11, type: 'plane', y: 60 },
          { at: 12, type: 'tv', y: 40 },
          { at: 14, type: 'paras', count: 3 },
          { at: 17, type: 'polheli', y: 110 }, { at: 17.5, type: 'polheli', y: 40 },
          { at: 20, type: 'plane', y: 140 },
          { at: 22, type: 'swarm', count: 6 },
          { at: 25, type: 'paras', count: 4 },
          { at: 27, type: 'polheli', y: 80 }, { at: 28, type: 'plane', y: 30, shots: 2 },
          { at: 31, type: 'drone', y: 90 }, { at: 31.5, type: 'drone', y: 130 },
          { at: 33, type: 'swarm', count: 6 },
          { at: 35, type: 'tv', y: 50 },
          { at: 36, type: 'plane', y: 120, shots: 2 },
          { at: 38, type: 'polheli', y: 60 }, { at: 38.5, type: 'polheli', y: 140 },
          { at: 41, type: 'paras', count: 4 },
          { at: 44, type: 'swarm', count: 7 },
          { at: 46, type: 'plane', y: 70, shots: 3 },
          { at: 48, type: 'polheli', y: 100 }, { at: 48.5, type: 'polheli', y: 40 },
          { at: 51, type: 'paras', count: 3 },
        ],
      },
      decor: [
      ],
    },
    // B — La plaza: the march is surrounded by the serenazgo and the police. The town helps.
    {
      area: 'PLAZA',
      locks: [{ x: 700, waves: 2 }, { x: 1600, waves: 3 }],
      crowd: { every: 75, cluster: 0.45, types: [{ t: 'sere' }, { t: 'sere' }, { t: 'cop' }, { t: 'cop' }, { t: 'riot' }, { t: 'grunt', hp: 2, skin: 'thug2' }] },
      width: 2600,
      combi: { x: 240 },
      town: { cops: true, tanks: 1, supplies: true, intro: true },
      bg: { sky: 0xd8c0a0 },
      abuelitas: [{ x: 900 }],
      prisoners: [{ x: 1500, drop: 'H', clue: 'm5b' }],
      props: [{ x: 700, type: 'patrol', drop: 'R' }, { x: 1700, type: 'patrol', drop: 'B' }, { x: 2200, type: 'barrel', drop: 'none' }],
      spawns: [
        { x: 560, t: 'tank' }, { x: 1120, t: 'tank' }, { x: 1750, t: 'tank' }, { x: 1780, t: 'cop' }, { x: 2250, t: 'tank' },
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
      crowd: { every: 90, cluster: 0.45, types: [{ t: 'sere' }, { t: 'sere' }, { t: 'cop' }, { t: 'cop' }, { t: 'riot' }] },
      town: { cops: true, supplies: true },
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
    // D — La obra paralizada: the unfinished works behind the Municipalidad. "El Jefe" in his bulldozer; the honest
    // police's helicopter crosses now and then bombing his guards.
    {
      area: 'LA OBRA',
      town: { heli: true },
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
