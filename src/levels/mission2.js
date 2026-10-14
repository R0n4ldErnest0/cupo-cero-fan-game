// Mission 2 — "Gamarra no se cierra" (greybox). A) the market street (first gallery, the municipal trench, a rubble
// mound) with the Mototaxi Slug, ending in an ambush; B) up the second gallery on foot and across the rooftops;
// C) the almacén, with the collection-truck mid-boss; D) the accountant's office (boss), then the ledger.
// Still missing: market and warehouse art.
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
  outro: { title: '¡MISIÓN CUMPLIDA!', sub: '¡Encontraste el libro de cupos!' },
  // After the boss: a page of the ledger (fictional names; the censored ones point at Missions 3-5).
  story: [
    {
      type: 'ledger',
      title: 'EL LIBRO DE CUPOS',
      entries: [
        { text: 'Combis "La Veloz" (ruta 13-B)', amount: 'S/ 2,000/día' },
        { text: 'Gamarra: cada puesto', amount: 'S/ 20/día' },
        { text: 'Colegio "Los Pinitos"', amount: 'S/ 500/mes' },
        { text: 'Comisaría Sectorial (protección)', amount: 'S/ 5,000', mark: true },
        { text: 'Regidor ██████ (permisos)', amount: 'S/ 10,000' },
        { text: 'Para "EL JEFE" ████████████', amount: 'S/ 50,000', mark: true },
      ],
      footer: '— El Contador',
    },
    { type: 'talk', who: 'PANCHO', text: 'La comisaría cobra su parte... ¿y quién es "el Jefe"?' },
    { type: 'talk', who: 'AMARU', text: 'El Cobrador escapó hacia los cerros. Si alguien sabe, es él.' },
  ],
  sections: [
    // A — Market street with the first gallery, the trench and the rubble mound. The Mototaxi Slug is parked on the
    // street. Ends with an ambush in front of the second gallery (the way up to the rooftops).
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
        |        @               g      :::::::::g:::::::::::::::s::::::::::::::::::   k                b    /**********\   %%
        |######################################################################################   ############################
        |######################################################################################   ############################`,
      mototaxi: { x: 190 },
      crates: [{ x: 300, stack: 1 }, { x: 322, stack: 2 }],
      // A chichería stand next to a caldo cart (3 jora + pisco = drunk; the caldo cures it).
      vendors: [{ x: 560, food: 'makis' }, { x: 1250, food: 'jora' }, { x: 1310, food: 'caldo' }],
      // Honest cops tied up on the gallery floors (y = the floor's top) and one in a box.
      prisoners: [{ x: 1000, y: 208, drop: 'H' }, { x: 1650, drop: 'random' }],
      props: [
        { x: 700, type: 'box', drop: 'prisoner' }, { x: 735, type: 'box', drop: 'enemy' },
        { x: 1250, type: 'lootbag', drop: 'random' }, { x: 1760, type: 'barrel', drop: 'none' },
      ],
      // Greybox: weapon crates to try them out.
      pickups: [
        { x: 420, kind: 'A' }, { x: 640, kind: 'D' }, { x: 960, kind: 'E' }, { x: 1150, kind: 'M' }, { x: 1560, kind: 'G' },
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
        { type: 'sign', x: 260, y: 300, text: 'MOTOTAXI SLUG:\n↓+C ¡BOCINAZO!', bg: '#d8343a' },
        { type: 'sign', x: 1820, y: 290, text: 'GALERÍA\nNUEVA ESPERANZA', bg: '#1e5fb4' },
      ],
      events: [
        { x: 1180, say: { who: 'fiscal', text: '¡Decomiso! Esas chompas no tienen permiso. ...¿Los de la pistola? No los vi.', ms: 3200 } },
      ],
      // Ambush in front of the gallery (the camera locks at x 1488; the facade wall is at x 1840).
      arena: {
        alert: ['¡EMBOSCADA!', 'LOS CUPEROS DE LA GALERÍA'],
        waves: [
          [{ dx: 330, t: 'grunt' }, { dx: 310, t: 'grunt', skin: 'thug2' }, { dx: -20, t: 'grunt', variant: 'thrower' }, { dx: 330, t: 'grunt', variant: 'knife' }],
          [{ dx: 330, t: 'grunt', hp: 3 }, { dx: -40, t: 'grunt', skin: 'thug2' }, { dx: 320, t: 'shieldthug' }],
          [{ dx: 330, t: 'grunt', variant: 'thrower' }, { dx: -20, t: 'grunt', hp: 3, skin: 'thug2' }, { dx: 190, y: 304, t: 'gangsniper' }, { dx: 330, t: 'grunt', variant: 'knife' }],
        ],
      },
    },
    // B — Azoteas: up the second gallery on foot (the mototaxi stays on the street), then across the Gamarra
    // rooftops (gaps between buildings are a long fall). Snipers on the water tanks, cuperos behind metal shutters,
    // an ambush at the end. Rows 0-23: the street floor of the gallery is row 22; roofs between rows 13 and 17.
    {
      area: 'AZOTEAS',
      vehicles: false,
      bg: { sky: 0xffb880, hills: 0xd09070, city: 0xd8a888 },
      terrain: String.raw`
        |
        |
        |
        |
        |
        |
        |
        |::::::::::::::::
        |::::::::::::::::
        |::::::::::::::::                                                                                                                                     u
        |::::::::::::::::                                                                    t        u                                                      ===
        |::::::::::::::::                                         u                      ----------- ===                                                     :::                         ===
        |::::::::::::::::                                        ===                                 :::                                                     :::  e                      :::
        |::::::::::::::::                                        :::                   k         g   :::                  g     k                        /%%%%%%%%%%%%         g   k     :::
        |::::::::::::::::                                        :::   g   e       %%%%%%%%%%%%%%%%%%%%%%%               === ------                     /%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::::::::::::::::                  g     g       %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%               :::                   b   g   /%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |================%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%       g   T   :::        e     %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::::::::::::::::%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |:::::::::g::::::%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |================%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::::::::::::::::%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::@:::::::::k:::%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |################%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |################%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%%%%   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`,
      vendors: [{ x: 1756, food: 'pan' }],
      prisoners: [{ x: 200, y: 304, drop: 'B' }],
      props: [
        { x: 856, type: 'box', drop: 'random' }, { x: 1436, type: 'lootbag', drop: 'B' },
        { x: 1916, type: 'box', drop: 'prisoner' }, { x: 2636, type: 'barrel', drop: 'none' },
        { x: 2816, type: 'lootbag', drop: 'emoliente' },
      ],
      pickups: [{ x: 1276, kind: 'H' }, { x: 2356, kind: 'R' }, { x: 900, kind: 'S' }, { x: 1700, kind: 'L' }, { x: 2200, kind: 'P' }],
      decor: [
        { type: 'text', x: 192, y: 236, text: 'El almacén de los cuperos está al otro lado.\n¡Sube por la galería a las azoteas!', style: { fontSize: '10px', color: '#ffe066' } },
        { type: 'sign', x: 1496, y: 120, text: 'SE ALQUILA AZOTEA\n(CUPO NO INCLUIDO)', bg: '#1b1b22' },
        { type: 'sign', x: 2876, y: 150, text: 'ALMACÉN →', bg: '#1b1b22' },
      ],
      arena: {
        alert: ['¡EMBOSCADA!', 'EN LA AZOTEA'],
        waves: [
          [{ dx: 500, t: 'shieldthug', y: 224 }, { dx: 500, t: 'grunt', y: 224 }, { dx: -20, t: 'grunt', variant: 'knife', y: 224 }],
          [{ dx: 500, t: 'grunt', variant: 'thrower', y: 224 }, { dx: 500, t: 'shieldthug', y: 224 }, { dx: -20, t: 'grunt', y: 224 }],
        ],
      },
    },
    // C — Almacén: the gang's warehouse (indoor: ceiling, back wall, shelves 3 tiles apart). At the end the
    // Camión Recaudador arrives with the day's cupos (mid-boss). Rows 0-15: ceiling 0-1, floor top row 14 (y = 224).
    {
      area: 'ALMACÉN',
      bg: { sky: 0x505058, hills: 0x404048, city: 0x48484f },
      terrain: String.raw`
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |:::::::::::::::::::::::::::::::u::::::::::::::::::::::::::::::::::u:::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::=======::::::::::::::::::::::::::::========:::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |::::::::::::::::::g::::::::::::::g::::::::::::::::T:::::::::::g:::::::t:::::::::::::g:::::::::::::::::::::::::::::::::::
        |::::::::::::=========:::::===========:::::::::=========:::::=============:::::::=========::::::::====::::::::::::::====:
        |::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        |:::@::::::::::g:::::::::k:::::::::::::::e:::t:::::::::::g:k:::::::::::::::::e:::::::::::::k:::::::::::::::::::::::::::::
        |########################################################################################################################
        |########################################################################################################################`,
      crates: [{ x: 600, stack: 1 }, { x: 622, stack: 2 }, { x: 1210, stack: 1 }],
      props: [
        { x: 150, type: 'box', drop: 'random' }, { x: 175, type: 'box', drop: 'none' },
        { x: 340, type: 'barrel', drop: 'none' }, { x: 470, type: 'lootbag', drop: 'random' },
        { x: 700, type: 'box', drop: 'enemy' }, { x: 860, type: 'box', drop: 'prisoner' },
        { x: 990, type: 'barrel', drop: 'none' }, { x: 1120, type: 'lootbag', drop: 'lomo' },
        { x: 1290, type: 'box', drop: 'random' }, { x: 1440, type: 'lootbag', drop: 'B' },
      ],
      pickups: [{ x: 520, kind: 'A' }, { x: 1380, kind: 'H' }],
      decor: [
        { type: 'text', x: 192, y: 120, text: 'El almacén de los cuperos.\nAquí guardan la recaudación... y las cuentas.', style: { fontSize: '10px', color: '#ffe066' } },
        { type: 'sign', x: 420, y: 100, text: 'PROHIBIDO EL PASO\n(SALVO PARA PAGAR)', bg: '#c0282e' },
        { type: 'sign', x: 950, y: 100, text: 'RECAUDACIÓN DIARIA\nMETA: S/ 50,000', bg: '#1b1b22' },
        { type: 'sign', x: 1700, y: 100, text: 'ZONA DE CARGA', bg: '#c06a1e' },
      ],
      arena: { alert: ['¡ALERTA!', 'CAMIÓN RECAUDADOR'], boss: 'truck' },
    },
    // D — The accountant's office: a small room and the boss, El Contador in his safe mech.
    {
      area: 'OFICINA',
      bg: { sky: 0x505058, hills: 0x404048, city: 0x48484f },
      terrain: String.raw`
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |::::::::::::::::::::::::::::::::::
        |:::::-----::::::::::::::-----:::::
        |::::::::::::::::::::::::::::::::::
        |:::@::::::::::::::::::::::::::::::
        |##################################
        |##################################`,
      props: [{ x: 120, type: 'lootbag', drop: 'H' }],
      decor: [
        { type: 'sign', x: 150, y: 120, text: 'CONTABILIDAD\n"TODO CUADRA"', bg: '#1e5fb4' },
        { type: 'sign', x: 420, y: 100, text: 'CAJA FUERTE', bg: '#1b1b22' },
      ],
      arena: { alert: ['¡ALERTA!', 'EL CONTADOR'], boss: 'contador' },
    },
  ],
});
