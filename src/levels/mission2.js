// Mission 2 — "Gamarra no se cierra" (greybox). Market street with two multi-floor galleries, a municipal
// trench (pit) and a rubble mound (slopes). Still missing (docs/LEVELS.md): market art, shield thugs, snipers,
// rescuable vendors, Mototaxi Slug, the collection-truck mid-boss and the accountant boss.
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
    |                                                                                                                          G                                h
    |                                                                                                                      ===========================================
    |                                                                                                                      :::::::::::::::::::::::::::::::::::::::::::
    |                                        H                             g                                               ::::::::::g::::::::::::::::F:::::::::::::::
    |                               ============================================                                           ===========================================
    |                               ::::::::::::::::::::::::::::::::::::::::::::                                           :::::::::::::::::::::::::::::::::::::::::::
    |                               :::::::::::::::::::::s:::::::::::::A::::::::                                           ::::::::::::::t:::::::::::::::::g::::::::::
    |                               ============================================                                           ===========================================
    |                               ::::::::::::::::::::::::::::::::::::::::::::                                           :::::::::::::::::::::::::::::::::::::::::::
    |                               ::::::::::::::g::::::::::::::t::::::::::::::                               t           :::::::g::::::::::::::s::::::::::::::::::::
    |                               ============================================                           /******\        ===========================================                       --------    ------
    |                               ::::::::::::::::::::::::::::::::::::::::::::                          /********\       :::::::::::::::::::::::::::::::::::::::::::
    |        P               g      :::::::::g:::::::::::::::s::::::::::::::::::   g                b    /**********\g     :::::::::::::::::g:::::::::::::::::::::::::    g  C   b t
    |######################################################################################   #####################################################################################################################
    |######################################################################################   #####################################################################################################################`,
  crates: [{ x: 300, stack: 1 }, { x: 322, stack: 2 }],
  decor: [
    { type: 'text', x: 240, y: 186, text: 'Los cuperos cobran a cada puesto del mercado.\nEl gremio dice que tienen un libro de cuentas...', style: { fontSize: '10px', color: '#ffe066' } },
    { type: 'controls', x: 240, y: 216 },
    { type: 'graffiti', x: 400, text: 'TODO A\nS/ 5', color: '#a81f25' },
    { type: 'sign', x: 848, y: 196, text: 'GALERÍA EL PROGRESO', bg: '#a81f25' },
    { type: 'graffiti', x: 1000, text: 'PUESTO CERRADO\nPOR AMENAZAS', color: '#1b1b22' },
    { type: 'sign', id: 'fiscal', x: 1290, y: 290, text: 'FISCALIZACIÓN\nMUNICIPAL', bg: '#2e7d32' },
    { type: 'sign', x: 1400, y: 324, text: 'OBRA: ZANJA\nINICIADA EN 2019', bg: '#c06a1e' },
    { type: 'graffiti', x: 1520, text: 'CUPO DIARIO:\nS/ 20', color: '#c0282e' },
    { type: 'sign', x: 1700, y: 282, text: 'PROHIBIDO ARROJAR\nDESMONTE', bg: '#1b1b22' },
    { type: 'sign', x: 2224, y: 146, text: 'GALERÍA NUEVA ESPERANZA', bg: '#1e5fb4' },
    { type: 'graffiti', x: 2660, text: '¡GAMARRA NO\nSE CIERRA!', color: '#1e5fb4' },
    { type: 'sign', x: 2780, y: 282, text: 'ALMACÉN\n(NO PASAR)', bg: '#1b1b22' },
  ],
  events: [
    { x: 1180, say: { who: 'fiscal', text: '¡Decomiso! Esas chompas no tienen permiso. ...¿Los de la pistola? No los vi.', ms: 3200 } },
  ],
  // No boss yet: the arena is a locked-screen ambush in waves (y: 304 = on the planks).
  arena: {
    alert: ['¡EMBOSCADA!', 'LOS CUPEROS DEL ALMACÉN'],
    waves: [
      [{ dx: 500, t: 'grunt' }, { dx: 520, t: 'grunt', skin: 'thug2' }, { dx: -20, t: 'grunt', variant: 'thrower' }],
      [{ dx: 500, t: 'biker' }, { dx: 500, t: 'grunt', hp: 3 }, { dx: 360, y: 304, t: 'grunt' }, { dx: -40, t: 'grunt', skin: 'thug2' }],
      [{ dx: 500, t: 'grunt', variant: 'thrower' }, { dx: 190, y: 304, t: 'grunt', variant: 'thrower' }, { dx: -20, t: 'grunt', hp: 3, skin: 'thug2' }, { dx: 500, t: 'biker' }],
    ],
  },
  outro: { title: '¡MISIÓN CUMPLIDA!', sub: 'EL LIBRO DE CUPOS: "Comisaría Sectorial — S/ 5,000"' },
});
