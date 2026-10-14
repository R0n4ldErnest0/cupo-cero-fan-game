// Mission 2 — "Gamarra no se cierra" (greybox). A) market street with the first multi-floor gallery, the municipal
// trench (pit) and a rubble mound (slopes), ending at the door of the second gallery; B) the second gallery and the
// almacén yard, where the cuperos ambush you; C) the rooftops, with the Mototaxi Slug. Still missing (docs/LEVELS.md):
// the almacén with the collection-truck mid-boss, the accountant boss and the ledger; market art.
//
// Map key: see src/systems/Terrain.js. Floors are 3 tiles apart (the player jumps ~3.7 tiles).
// Rows 0-23, street top at row 22 (y = 352). Column c is at x = c * 16.
MISSIONS.push({
  id: 'gamarra',
  title: 'MISIÓN 2',
  subtitle: 'GAMARRA NO SE CIERRA',
  name: 'EL MERCADO',
  draft: true,
  bg: { sky: 0xffc89a, hills: 0xd8a080, city: 0xe0b090 },
  legend: {
    h: { t: 'grunt', hp: 3, skin: 'thug2' },
  },
  outro: { title: '¡MISIÓN CUMPLIDA!', sub: 'EL LIBRO DE CUPOS: "Comisaría Sectorial — S/ 5,000"' },
  sections: [
    // A — Market street. Leaves through the door of the second gallery (on foot: the combi stays outside).
    {
      area: 'MERCADO',
      terrain: String.raw`
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |                                        H                             g                                            %%
        |                               ============================================                                        %%
        |                               ::::::::::::::::::::::::::::::::::::::::::::                                        %%
        |                               :::::::::::::::::::::s:::::::::::::W::::::::                                        %%
        |                               ============================================                                        %%
        |                               ::::::::::::::::::::::::::::::::::::::::::::                                        %%
        |                               ::::::::::::::g::::::::::::::t::::::::::::::                               t        %%
        |                               ============================================                           /******\     %%
        |                               ::::::::::::::::::::::::::::::::::::::::::::                          /********\    %%
        |        @               g      :::::::::g:::::::::::::::s::::::::::::::::::   k                b    /**********\ > %%
        |######################################################################################   ############################
        |######################################################################################   ############################`,
      crates: [{ x: 300, stack: 1 }, { x: 322, stack: 2 }],
      vendors: [{ x: 560, food: 'makis' }],
      // Honest cops tied up on the gallery floors (y = the floor's top) and one in a box.
      prisoners: [{ x: 1000, y: 208, drop: 'H' }, { x: 1650, drop: 'random' }],
      props: [
        { x: 700, type: 'box', drop: 'prisoner' }, { x: 735, type: 'box', drop: 'enemy' },
        { x: 1250, type: 'lootbag', drop: 'random' }, { x: 1760, type: 'barrel', drop: 'none' },
      ],
      // Greybox: one of every new weapon crate to try them out (the rest are in section B).
      pickups: [
        { x: 230, kind: 'R' }, { x: 420, kind: 'A' }, { x: 960, kind: 'E' }, { x: 1150, kind: 'M' }, { x: 1560, kind: 'G' },
        { x: 1640, kind: 'F' },
      ],
      decor: [
        { type: 'text', x: 192, y: 216, text: 'Los cuperos cobran a cada puesto del mercado.\nEl gremio dice que tienen un libro de cuentas...', style: { fontSize: '10px', color: '#ffe066' } },
        { type: 'controls', x: 192, y: 246 },
        { type: 'graffiti', x: 400, text: 'TODO A\nS/ 5', color: '#a81f25' },
        { type: 'sign', x: 848, y: 196, text: 'GALERÍA EL PROGRESO', bg: '#a81f25' },
        { type: 'graffiti', x: 1000, text: 'PUESTO CERRADO\nPOR AMENAZAS', color: '#1b1b22' },
        { type: 'sign', id: 'fiscal', x: 1290, y: 290, text: 'FISCALIZACIÓN\nMUNICIPAL', bg: '#2e7d32' },
        { type: 'sign', x: 1400, y: 324, text: 'OBRA: ZANJA\nINICIADA EN 2019', bg: '#c06a1e' },
        { type: 'graffiti', x: 1520, text: 'CUPO DIARIO:\nS/ 20', color: '#c0282e' },
        { type: 'sign', x: 1700, y: 282, text: 'PROHIBIDO ARROJAR\nDESMONTE', bg: '#1b1b22' },
        { type: 'sign', x: 1820, y: 290, text: 'GALERÍA\nNUEVA ESPERANZA', bg: '#1e5fb4' },
      ],
      events: [
        { x: 1180, say: { who: 'fiscal', text: '¡Decomiso! Esas chompas no tienen permiso. ...¿Los de la pistola? No los vi.', ms: 3200 } },
      ],
    },
    // B — Second gallery and the almacén yard: a chichería stand (3 jora + pisco = drunk; the caldo cures it)
    // and the locked-screen ambush on the planks (y: 304; dx past the view = runs in from the right edge).
    {
      area: 'GALERÍAS',
      terrain: String.raw`
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |          B                                h
        |      ===========================================
        |      :::::::::::::::::::::::::::::::::::::::::::
        |      ::::::::::g::::::::::::::::O:::::::::::::::
        |      ===========================================
        |      :::::::::::::::::::::::::::::::::::::::::::
        |      ::::::::::::::t:::::::::::::::::g::::::::::
        |      ===========================================
        |      :::::::::::::::::::::::::::::::::::::::::::
        |      :::::::g::::::::::::::s::::::::::::::::::::
        |      ===========================================                       --------    ------
        |      :::::::::::::::::::::::::::::::::::::::::::
        |  @   :::::::::::::::::g:::::::::::::::::::::::::    k  V   b t
        |##############################################################################################
        |##############################################################################################`,
      vendors: [{ x: 100, food: 'jora' }, { x: 160, food: 'caldo' }, { x: 678, food: 'lomo' }],
      prisoners: [{ x: 400, y: 160, drop: 'R' }, { x: 560, y: 256, drop: 'B' }],
      props: [
        { x: 230, type: 'trash', drop: 'pisco' }, { x: 280, type: 'moto', drop: 'jora' },
        { x: 908, type: 'lootbag', drop: 'emoliente' },
      ],
      pickups: [{ x: 608, kind: 'D' }, { x: 768, kind: 'L' }, { x: 858, kind: 'P' }, { x: 928, kind: 'S' }],
      decor: [
        { type: 'sign', x: 432, y: 146, text: 'GALERÍA NUEVA ESPERANZA', bg: '#1e5fb4' },
        { type: 'graffiti', x: 868, text: '¡GAMARRA NO\nSE CIERRA!', color: '#1e5fb4' },
        { type: 'sign', x: 988, y: 282, text: 'ALMACÉN\n(NO PASAR)', bg: '#1b1b22' },
      ],
      arena: {
        alert: ['¡EMBOSCADA!', 'LOS CUPEROS DEL ALMACÉN'],
        waves: [
          [{ dx: 500, t: 'grunt' }, { dx: 520, t: 'grunt', skin: 'thug2' }, { dx: -20, t: 'grunt', variant: 'thrower' }, { dx: 500, t: 'grunt', variant: 'knife' }],
          [{ dx: 500, t: 'biker' }, { dx: 500, t: 'grunt', hp: 3 }, { dx: 264, y: 304, t: 'grunt' }, { dx: -40, t: 'grunt', skin: 'thug2' }],
          [{ dx: 500, t: 'grunt', variant: 'thrower' }, { dx: 94, y: 304, t: 'grunt', variant: 'thrower' }, { dx: -20, t: 'grunt', hp: 3, skin: 'thug2' }, { dx: 500, t: 'biker' }],
        ],
      },
    },
    // C — Azoteas: across the Gamarra rooftops (gaps between buildings are a long fall). The Mototaxi Slug is
    // parked up here (the combi stays below). Snipers on the water tanks, cuperos behind metal shutters, and an
    // ambush at the end. Rows 0-23; roofs between rows 13 and 17.
    {
      area: 'AZOTEAS',
      vehicles: false,
      mototaxi: { x: 200 },
      bg: { sky: 0xffb880, hills: 0xd09070, city: 0xd8a888 },
      terrain: String.raw`
        |
        |
        |
        |
        |
        |
        |
        |
        |
        |                                                                                                                                     u
        |                                                                    t        u                                                      ===
        |                                         u                      ----------- ===                                                     :::                         ===
        |                                        ===                                 :::                                                     :::  e                      :::
        |                                        :::                   k         g   :::                  g     k                        /%%%%%%%%%%%%         g   k     :::
        |                                        :::   g   e       %%%%%%%%%%%%%%%%%%%%%%%               === ------                     /%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |   @              g     g       %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%               :::                   b   g   /%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%       g   T   :::        e     %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`,
      vendors: [{ x: 1500, food: 'pan' }],
      props: [
        { x: 600, type: 'box', drop: 'random' }, { x: 1180, type: 'lootbag', drop: 'B' },
        { x: 1660, type: 'box', drop: 'prisoner' }, { x: 2380, type: 'barrel', drop: 'none' },
        { x: 2560, type: 'lootbag', drop: 'emoliente' },
      ],
      pickups: [{ x: 1020, kind: 'H' }, { x: 2100, kind: 'R' }],
      decor: [
        { type: 'text', x: 192, y: 178, text: 'El almacén de los cuperos está al otro lado.\n¡Por las azoteas!', style: { fontSize: '10px', color: '#ffe066' } },
        { type: 'sign', x: 300, y: 222, text: 'MOTOTAXI SLUG:\n↓+C ¡BOCINAZO!', bg: '#d8343a' },
        { type: 'sign', x: 1240, y: 120, text: 'SE ALQUILA AZOTEA\n(CUPO NO INCLUIDO)', bg: '#1b1b22' },
        { type: 'sign', x: 2620, y: 150, text: 'ALMACÉN →', bg: '#1b1b22' },
      ],
      arena: {
        alert: ['¡EMBOSCADA!', 'EN LA AZOTEA'],
        waves: [
          [{ dx: 500, t: 'shieldthug', y: 224 }, { dx: 500, t: 'grunt', y: 224 }, { dx: -20, t: 'grunt', variant: 'knife', y: 224 }],
          [{ dx: 500, t: 'grunt', variant: 'thrower', y: 224 }, { dx: 500, t: 'shieldthug', y: 224 }, { dx: -20, t: 'grunt', y: 224 }],
        ],
      },
    },
  ],
});
