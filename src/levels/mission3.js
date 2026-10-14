// Mission 3 — "La ruta" (greybox). For now only the ride section: on the roof of a Metropolitano bus along the
// busway, cuperos jumping on from motorbikes and pedestrian bridges to duck under. Still missing (docs/LEVELS.md):
// the cerros section before it and the station with the police helicopter boss after it.
MISSIONS.push({
  id: 'ruta',
  title: 'MISIÓN 3',
  subtitle: 'LA RUTA',
  name: 'EL METROPOLITANO',
  draft: true,
  bg: { sky: 0xc8d0d8 },
  outro: { title: '¡MISIÓN CUMPLIDA!', sub: 'En la estación espera... ¿un helicóptero de la policía?' },
  sections: [
    {
      area: 'METROPOLITANO',
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
          { at: 22, type: 'jumper', from: 'right' },
          { at: 23, type: 'jumper', from: 'left' },
          { at: 28, type: 'bridge' },
          { at: 30, type: 'grunt', x: 300 },
          { at: 31, type: 'grunt', x: 200, variant: 'knife' },
          { at: 36, type: 'jumper', from: 'right', variant: 'knife' },
          { at: 38, type: 'bridge' },
          { at: 41, type: 'jumper', from: 'left' },
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
  ],
});
