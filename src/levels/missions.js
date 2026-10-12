// Mission registry. Each src/levels/missionN.js pushes one mission definition, in play order
// (script order in index.html). LevelScene builds everything from this data.
//
// Mission schema (x/y are world units; the ground is at CFG.GROUND_Y = 240):
//   id, title, subtitle        banner shown at the start ("MISIÓN 1", "¡PAGA O YA SABES!")
//   name                       short name for the tally / stage select
//   draft                      true while the mission is a greybox (shown as BORRADOR)
//   width                      level length
//   arenaX                     the camera locks here; the arena spans arenaX .. width
//   bg                         optional tints { sky, hills, city }
//   combi { x }                parked Combi Slug (optional)
//   abuelitas [{ x }]          tied-up helpers
//   crates [{ x, stack }]      one-way platforms
//   pickups [{ x, kind }]      'H' machine gun, 'B' grenades, 'food'
//   spawns [{ x, t, ... }]     enemies, spawned when x reaches the right screen edge.
//                              t: 'grunt' (skin, variant, y, hp) or 'biker' (enters from the right edge)
//   decor [{ type, ... }]      'text' | 'controls' | 'image' | 'graffiti' | 'sign' | 'copcar'; an `id`
//                              makes it addressable by events
//   events [{ x, say | message | run }]
//                              fire once when a player passes x. say: { who, text, ms },
//                              message: [title, sub, ms], run: (scene) => {}
//   arena                      { alert: [title, sub], boss: 'cobrador' } or
//                              { alert, waves: [[{ dx, t, ... }], ...] } (dx relative to arenaX; < 0 enters from the left)
//   outro { title, sub }       mission-complete banner
const MISSIONS = [];
