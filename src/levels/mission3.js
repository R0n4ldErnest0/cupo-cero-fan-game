// Mission 3 — "La ruta" (greybox). A) the cerros: climbing a hillside of unfinished houses where the corrupt police
// show up for the first time; B) the roof of a Metropolitano bus, braking into a station; C) through the station on
// foot to the next bus; D) the second ride, jumping between buses that break down, ending at the terminal where a
// police helicopter comes for El Cobrador (boss).
//
// Map key: see src/systems/Terrain.js. Rows 0-29, street top at row 27 (y = 432); the hill climbs to row 11.
MISSIONS.push({
  id: 'ruta',
  title: 'MISSION 3',
  subtitle: 'LA RUTA',
  name: 'LOS CERROS',
  draft: true,
  outro: { sub: 'El Cobrador se escapó... rumbo a la comisaría.' },
  // Expediente: the comisario and his ties to the Municipalidad.
  clues: {
    m3a: 'Al comisario le dicen "Archivo": todas las denuncias contra los cuperos terminan en su cajón.',
    m3b: 'Ese helicóptero no es para operativos: el comisario lo presta para "favores".',
    m3c: 'Cada lunes el comisario almuerza con un regidor de la Municipalidad.',
  },
  sections: [
    // A — Cerros: up the hill to the Metropolitano stop. Leaves by the right edge.
    {
      area: 'CERROS',
      markerClues: ['m3a', 'm3b'], // the two tied-up cops on the hill (T markers, left to right)
      bg: { sky: 0xd0c8c0, hills: 0xc0a080 },
      terrain: String.raw`
        |
        |
        |
        |
        |                                                            ::::::::::::::
        |                                                            ::::::::::::::                                                                  :::::::::::::
        |                                                            ::::::::::f:::                                                                  :::::::::::::
        |                                                            ==============                                                                  ::::::f::::::
        |                                                            ::::::::::::::                              :::::::::::::::                     =============
        |                                                            ::T:::::::::::                              :::::::::::::::                     :::::::::::::
        |                              :::::::::::::::               ==============                              ::::::::::::f::               p   T ::::::::::r::  p
        |                              :::::::::::::::               ::::::::::::::                              ===============           /*****************************
        |                              ::::::::::f::::             t ::::::p:r:::::          k   p   g           :::::::::::::::          /******************************
        |                              ===============          /*********************   ****************\       ::::::g::::::::         /*******************************
        |                              :::::::::::::::         /**********************   *****************\      ===============        /********************************
        |                              :::g:::::::::::        /***********************   ******************\     :::::::::::::::       /*********************************
        |                              ===============       /************************   *******************\  m ::::p::::::::::  r   /**********************************
        |                              :::::::::::::::      /*************************   ********************************************************************************
        |                            g ::::::p::::::::  t  /**************************   ********************************************************************************
        |                         /***************************************************   ********************************************************************************
        |                        /****************************************************   ********************************************************************************
        |                       /*****************************************************   ********************************************************************************
        |                      /******************************************************   ********************************************************************************
        |                     /*******************************************************   ********************************************************************************
        |                    /********************************************************   ********************************************************************************
        |                   /*********************************************************   ********************************************************************************
        |   @      g   k   /**********************************************************   ********************************************************************************
        |##################***********************************************************   ********************************************************************************
        |##################***********************************************************   ********************************************************************************
        |##################***********************************************************   ********************************************************************************`,
      vendors: [{ x: 1380, food: 'emoliente' }],
      props: [
        { x: 300, type: 'barrel', drop: 'none' }, { x: 470, type: 'box', drop: 'random' },
        { x: 1040, type: 'lootbag', drop: 'H' }, { x: 1700, type: 'box', drop: 'prisoner' },
        { x: 1960, type: 'barrel', drop: 'none' }, { x: 2300, type: 'trash', drop: 'random' },
      ],
      pickups: [{ x: 740, y: 304, kind: 'B' }, { x: 1890, y: 176, kind: 'L' }],
      decor: [
        { type: 'text', x: 192, y: 330, text: 'El Cobrador huyó cerro arriba.\nDicen que la policía lo protege...', style: { fontSize: '10px', color: '#ffe066' } },
        { type: 'sign', x: 200, y: 392, text: 'A.H. VILLA EL CUPO', bg: '#a81f25' },
        { type: 'sign', x: 600, y: 230, text: 'SE VENDE LOTE\n(CON CUPO INCLUIDO)', bg: '#1b1b22' },
        { type: 'sign', id: 'comisaria', x: 1100, y: 92, text: 'MÓDULO POLICIAL\nCERRADO POR "OPERATIVO"', bg: '#2e7d32' },
        { type: 'sign', x: 1800, y: 150, text: 'AQUÍ NO SUBE\nNI EL SERENAZGO', bg: '#c06a1e' },
        { type: 'sign', x: 2470, y: 140, text: 'PARADERO DEL\nMETROPOLITANO →', bg: '#1e5fb4' },
      ],
      events: [
        // The first police: they "don't see" the cuperos... until they see you.
        {
          x: 560,
          run: (s) => {
            const cop = s.enemies.getChildren().find((e) => e.cop && e.alive);
            if (!cop) return;
            Fx.say(s, cop, '¿Cuperos? Yo no veo ningún cuperos...', 1800);
            s.time.delayedCall(1900, () => cop.alive && Fx.say(s, cop, '¡Ah, eres tú! ¡Alto, chofer!', 1400));
          },
        },
        { x: 1100, say: { who: 'comisaria', text: '(Adentro se escucha: "...y el cupo de este mes, comisario...")', ms: 3000 } },
      ],
    },
    // B — On the roof of the Metropolitano.
    {
      area: 'METROPOLITANO',
      bg: { sky: 0xc8d0d8 },
      start: { x: 120, y: 152 },
      ride: {
        speed: 260,
        seconds: 62,
        events: [
          { at: 2, type: 'grunt', x: 290 },
          { at: 6, type: 'jumper', from: 'right' },
          { at: 10, type: 'bridge' },
          { at: 13, type: 'jumper', from: 'left', variant: 'knife' },
          { at: 15, type: 'grunt', x: 250, variant: 'thrower' },
          { at: 19, type: 'bridge' },
          { at: 22, type: 'jumper', from: 'right', cop: true },
          { at: 23, type: 'jumper', from: 'left' },
          { at: 28, type: 'bridge' },
          { at: 30, type: 'grunt', x: 300 },
          { at: 31, type: 'grunt', x: 200, variant: 'knife' },
          { at: 36, type: 'jumper', from: 'right', variant: 'knife' },
          { at: 38, type: 'bridge' },
          { at: 41, type: 'jumper', from: 'left', cop: true },
          { at: 44, type: 'grunt', x: 280, variant: 'thrower' },
          { at: 47, type: 'bridge' },
          { at: 49, type: 'jumper', from: 'right' },
          { at: 50, type: 'jumper', from: 'left', variant: 'knife' },
          { at: 55, type: 'bridge' },
          { at: 57, type: 'grunt', x: 260 },
        ],
      },
      decor: [
        { type: 'text', x: 192, y: 60, text: 'Los cuperos van a la estación.\n¡Súbete al Metropolitano!', style: { fontSize: '10px', color: '#ffe066' } },
      ],
    },
    // C — Estación: off the bus and through the station on foot (turnstiles, cops guarding it), then board the
    // next bus through its door at the end of the platform.
    {
      area: 'ESTACIÓN',
      width: 900,
      bg: { sky: 0xb8c0c8 },
      vehicles: false,
      doors: [{ x: 860 }],
      props: [
        { x: 230, type: 'lootbag', drop: 'R' },
        { x: 520, type: 'box', drop: 'B' },
      ],
      prisoners: [{ x: 160, drop: 'H', clue: 'm3c' }],
      spawns: [
        { x: 300, t: 'cop' },
        { x: 380, t: 'cop' },
        { x: 440, t: 'riot' },
        { x: 600, t: 'cop' },
        { x: 660, t: 'grunt', variant: 'knife' },
        { x: 720, t: 'riot' },
      ],
      decor: [
        { type: 'sign', x: 140, y: 150, text: 'ESTACIÓN CENTRAL', bg: '#1e5fb4' },
        { type: 'image', key: 'turnstile', x: 330 }, { type: 'image', key: 'turnstile', x: 352 }, { type: 'image', key: 'turnstile', x: 374 },
        { type: 'sign', x: 360, y: 180, text: 'PASE SU TARJETA', bg: '#1b1b22' },
        { type: 'graffiti', x: 560, text: 'EL CUPO NO\nES PASAJE', color: '#1e5fb4' },
        { type: 'sign', x: 860, y: 168, text: '¡SUBE AL\nMETROPOLITANO!', bg: '#c0282e' },
      ],
    },
    // D — Metropolitano again, now with buses breaking down: jump to the next one while it's right in front.
    // At the terminal the bus stops and the police helicopter that came for El Cobrador attacks (boss).
    {
      area: 'METROPOLITANO 2',
      bg: { sky: 0xb8c0d0 },
      start: { x: 120, y: 152 },
      ride: {
        speed: 280,
        seconds: 58,
        events: [
          { at: 2, type: 'grunt', x: 280 },
          { at: 5, type: 'jumper', from: 'right', cop: true },
          { at: 9, type: 'bridge' },
          { at: 12, type: 'transfer' },
          { at: 22, type: 'jumper', from: 'left', variant: 'knife' },
          { at: 24, type: 'grunt', x: 260, variant: 'thrower' },
          { at: 28, type: 'bridge' },
          { at: 31, type: 'jumper', from: 'right', cop: true },
          { at: 34, type: 'transfer' },
          { at: 44, type: 'jumper', from: 'left', cop: true },
          { at: 46, type: 'bridge' },
          { at: 50, type: 'grunt', x: 300 },
          { at: 52, type: 'jumper', from: 'right' },
        ],
      },
      decor: [
        { type: 'text', x: 192, y: 60, text: 'El Cobrador va a la estación terminal.\n¡Que no se escape!', style: { fontSize: '10px', color: '#ffe066' } },
      ],
      arena: { alert: ['¡ALERTA!', 'HELICÓPTERO POLICIAL'], boss: 'heli' },
    },
  ],
});
