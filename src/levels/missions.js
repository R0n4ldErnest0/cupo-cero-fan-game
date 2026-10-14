// Mission registry. Each src/levels/missionN.js pushes one mission definition, in play order
// (script order in index.html). LevelScene builds everything from this data.
//
// Mission schema (x/y are world units, 1 tile = 16; y grows downward):
//   id, title, subtitle        banner shown at the start ("MISIÓN 1", "¡PAGA O YA SABES!")
//   name                       short name for the tally / stage select
//   draft                      true while the mission is a greybox (shown as BORRADOR)
//   terrain                    text map (see src/systems/Terrain.js). Without one the level is a flat street
//                              with its top at CFG.GROUND_Y = 240
//   legend { ch: def }         extra map markers, e.g. h: { t: 'grunt', hp: 3 }
//   width                      level length (default: map width)
//   arenaX                     the camera locks here; the arena spans arenaX .. width (default: width - CFG.VIEW_W)
//   start { x }                player start (or an '@' marker)
//   bg                         optional tints { sky, hills, city }
// Objects can be listed here or placed as letter markers in the map. Without a y they stand at street level.
//   combi { x }                parked Combi Slug (optional)
//   abuelitas [{ x }]          tied-up helpers
//   crates [{ x, stack }]      one-way platforms
//   props [{ x, type, drop }]  breakable gang property (CFG.PROPS: box, lootbag, trash, barrel, moto); drop: an item
//                              kind, 'random', 'enemy' (a cupero jumps out) or 'none'
//   prisoners [{ x, drop }]    tied-up honest cops (or a 'T' marker): freed by a shot or a touch, they hand over
//                              `drop` (an item kind or 'random')
//   vendors [{ x, food }]      street vendor with a cart, tosses that CFG.FOOD to a player walking by
//   pickups [{ x, kind }]      a crate letter (guns H R A E G F D L, throwables B M P S) or a food id (CFG.FOOD)
//   spawns [{ x, t, ... }]     enemies, spawned when x reaches the right screen edge.
//                              t: 'grunt' (skin, variant 'gunner' | 'thrower' | 'knife', y, hp), 'biker', and the
//                              police: 'cop' (patrullero), 'riot' (antimotines), 'motocop', 'sniper'
//   decor [{ type, ... }]      'text' | 'controls' | 'image' | 'graffiti' | 'sign' | 'copcar'; an `id`
//                              makes it addressable by events. text and sign need a y
//   events [{ x, say | message | run }]
//                              fire once when a player passes x. say: { who, text, ms },
//                              message: [title, sub, ms], run: (scene) => {}
//   arena                      { alert: [title, sub], boss: 'cobrador' } or
//                              { alert, waves: [[{ dx, t, ... }], ...] } (dx relative to arenaX; < 0 enters from the left,
//                              past the view width = runs in from the right edge)
//   outro { title, sub }       mission-complete banner
//
// Sections: a mission can instead list `sections: [{ ... }]`, areas joined by a quick fade (like Metal Slug's
// doors, holes and vehicles). Each section takes the per-area fields above (terrain, width, spawns, props,
// arena, ...) on top of the mission's (title, subtitle, outro, bg, legend). Per section:
//   area                       short name of the area (for the docs/tools; not shown in game)
//   exit { type }              how a middle section ends: 'edge' (reach the right end; default) or 'door'
//                              (walk into a '>' marker; default when the map has one). A middle section with an
//                              `arena` continues when it's cleared instead.
//   vehicles: false            the Combi Slug can't come in (indoors); a door always leaves it behind
//   ride { speed, seconds, events }  the section happens on a moving vehicle (see src/systems/Ride.js); no map needed
// Players keep lives, score, weapon, ammo, bombs and fat/drunk state between sections; the driven combi too.
const MISSIONS = [];
