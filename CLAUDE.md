# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Cupo Cero** (working title) — a Metal Slug–style run-and-gun fan game that satirizes the
extortion crisis ("cobro de cupos") in Lima, Peru: gangs charging quotas to combi/bus drivers,
businesses and schools, and police/politicians colluding with them.

A combi driver, fed up after a coworker is killed, teams up with a mercenary hired by the drivers'
union and fights through 5 missions: gangs first, then gangs + police, finally a corrupt mayor.

See `ROADMAP.md` for the plan, level list and open decisions.

## Tone rules (important)

- **Satire punches up.** The jokes target extortionists, corrupt police and politicians.
  Drivers, cobradores, vendors, students and other victims are never the punchline.
- Goofy Metal Slug energy (exaggerated deaths, silly bosses, speech bubbles) on top of a serious theme.
- **Fictional names only.** No real politicians, officers, gangs or real victims. Caricatures are fine.
- In-game text is in **Peruvian Spanish** (limeño slang welcome: "causa", "chamba", "al fondo hay sitio").
  Exception: the arcade classics "Heavy Machine Gun" (H) and "Rocket Launcher" (R) keep their English name and announcer line.
  Code, comments and docs are in English.

## Tech

- **Phaser 3.80.1**, vendored at `lib/phaser.min.js` (no CDN, works offline).
- Plain classic `<script>` tags, **no build step, no modules**. Files share globals; load order is
  defined in `index.html`. Keep it that way unless we deliberately add a bundler.
- Arcade physics. Game canvas is 960x540; the level camera uses zoom 2.5 (`CFG.ZOOM`), so the view is
  384x216 world "pixel" units (`CFG.VIEW_W/H`); never hardcode the view size. The HUD runs in its own scene at zoom 1.
- **All placeholder art is generated in code** (`src/systems/Textures.js`): small sprites are ASCII
  pixel grids + palettes, larger ones (combi, boss, backgrounds) use Painter primitives (rect, disc, line, 3x5 text).
  Replace with real sprite sheets later by loading images under the same texture keys.
- **All sound is synthesized** with WebAudio (`src/systems/Sfx.js`), including the placeholder
  chicha-style music loop.

## Running

```
python tools/serve.py 8000   # then open http://localhost:8000
```

`tools/serve.py` disables caching so edits show up on a plain reload. Opening `index.html` directly
also works. Add `?debug` to the URL to see physics bodies.

Controls (solo): ←/→ move, ↑ aim up, ↓ crouch (in the air: shoot down), Z jump (↓+Z on a thin floor: drop down), X shoot, C grenade,
↓ near the Combi Slug to board, ↓+Z to exit it, P pause, M mute, Enter start.
2 players: 1P WASD + F shoot / G jump / H grenade, 2P arrows + , shoot / . jump / / grenade; gamepads work
(A jump, X shoot, B grenade, Start). Keys are defined in `CFG.KEYS`.
Testing: **5** inserts a coin, **F2** toggles FREE PLAY (infinite credits, saved in localStorage),
**F3** on the title picks the starting mission, **F4** finishes the current mission, **F6** / **F7** drop the next weapon crate / food,
`?mission=2` preselects a mission.

## Layout

```
index.html            entry; script load order lives here
lib/phaser.min.js     vendored engine
src/config.js         constants (sizes, speeds, tuning)
src/systems/          Textures (procedural art), Sfx (synth audio), Voice (announcer), Session (credits), Controls (input),
                      Fx, Terrain (text-map tiles, one-way floors, slopes), Weapons (guns, melee, player projectiles)
src/entities/         Player, enemies, Abuelita (helper), CombiSlug (vehicle), bosses, Pickup, Breakable (gang props),
                      Vendor (food carts)
src/levels/           missions.js (registry + data schema), missionN.js (one data file per mission)
src/scenes/           MenuScenes (Boot, Title, CharSelect, MissionEnd, Ending, GameOver), HUDScene, LevelScene
docs/LEVELS.md        mission designs + what's missing for Missions 2–5
tools/serve.py        no-cache dev server
```

## Conventions

- One class per entity file; entities extend Phaser sprites/containers and expose `update(time, dt)`.
- Tuning numbers go in `src/config.js`, not scattered literals. Level layouts go in `src/levels/`.
- New missions: add `src/levels/missionN.js` (push onto `MISSIONS`) and a `<script>` tag in `index.html`.
  Terrain is a text map (key at the top of `src/systems/Terrain.js`): symbols are tiles, letters (and @ = start) are markers.
  The player jumps ~60px, so floors meant to be climbed are at most 3 tiles (48px) apart.
- Arcade physics has no slopes: `Terrain.snap` puts walkers on slope surfaces after each physics step.
  Vehicles only touch the tile under their center (plus walls 2+ tiles taller than the wheels), and tilt.
  Mission-specific logic goes in the data (`events[].run`) or a new entity, not in `LevelScene`.
- Damage values: pistol 1, machine gun 1, emoliente 2, grenade 5, combi cannon 6; pickup weapons in `CFG.WEAPONS`.
- Weapons: data in `CFG.WEAPONS` / `CFG.THROWABLES` (name, crate letter = map marker, ammo, cadence), behavior in
  `Weapons.FIRE` and `Weapons.PROJECTILES`. Crate letters are Spanish initials except H and R (see docs/LEVELS.md).
- Third-party/ripped Metal Slug assets may be used only as private placeholders in `assets/_private/`
  (gitignored). Never commit or ship SNK assets.
