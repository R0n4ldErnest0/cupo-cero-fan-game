# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Cupo Cero** (working title) — a Metal Slug–style run-and-gun fan game that satirizes the
extortion crisis ("cobro de cupos") in Lima, Peru: gangs charging quotas to combi/bus drivers,
businesses and schools, and police/politicians colluding with them.

Pancho, a combi driver whose compadre was killed for not paying, teams up with Amaru (a mercenary hired by the
drivers' union), Don Tito (a retired honest cop) and Inés (a drugstore owner), and fights through 5 missions: gangs
first, then gangs + police, finally a corrupt mayor. Character ids in code stay chato/sargento/merc/cobradora.

See `ROADMAP.md` for the plan, level list and open decisions.

## Tone rules (important)

- **Satire punches up.** The jokes target extortionists, corrupt police and politicians.
  Drivers, cobradores, vendors, students and other victims are never the punchline.
- Goofy Metal Slug energy (exaggerated deaths, silly bosses, speech bubbles) on top of a serious theme.
- **Fictional names only.** No real politicians, officers, gangs or real victims. Caricatures are fine.
- In-game text is in **Peruvian Spanish** (limeño slang welcome: "causa", "chamba", "al fondo hay sitio").
  Exceptions, in English like the arcade: "Heavy Machine Gun" (H), "Rocket Launcher" (R) and the banners
  "MISSION 1 START!" / "MISSION FINAL START!" / "MISSION COMPLETE!" (with the announcer).
  Code, comments and docs are in English.

## Tech

- **Phaser 3.80.1**, vendored at `lib/phaser.min.js` (no CDN, works offline).
- Plain classic `<script>` tags, **no build step, no modules**. Files share globals; load order is
  defined in `index.html`. Keep it that way unless we deliberately add a bundler.
- Arcade physics. Game canvas is 960x540; the level camera uses zoom 3 (`CFG.ZOOM`), so the view is
  320x180 world "pixel" units (`CFG.VIEW_W/H`); never hardcode the view size. Keep the zoom a whole number:
  at 2.5 game pixels were 2 or 3 screen pixels and characters seemed to change size as they moved. The HUD runs in its own scene at zoom 1.
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
also works. Add `?debug` to the URL to see physics bodies, `?fps` for an FPS meter (with the worst recent frame).

Controls (solo): ←/→ move, ↑ aim up, ↓ crouch (in the air: shoot down), Z jump (↓+Z on a thin floor: drop down), X shoot, C grenade,
↓ near the Combi Slug (or Mototaxi Slug) to board, ↓+Z to exit it; in the mototaxi ↓+C is the bocinazo.
P pause, M mute, Enter start.
2 players: 1P WASD + F shoot / G jump / H grenade, 2P arrows + , shoot / . jump / / grenade; gamepads work
(A jump, X shoot, B grenade, Start). Keys are defined in `CFG.KEYS`.
Testing: **5** inserts a coin, **F2** toggles FREE PLAY (infinite credits, saved in localStorage),
**F3** on the title picks the starting mission, **F4** finishes the current mission, **F6** / **F7** drop the next weapon crate / food, **F8** skips to the next section,
`?mission=2` preselects a mission and `&section=2` a section of it.

## Layout

```
index.html            entry; script load order lives here
lib/phaser.min.js     vendored engine
src/config.js         constants (sizes, speeds, tuning)
src/systems/          Textures (procedural art), Sfx (synth audio), Voice (announcer), Session (credits), Controls (input),
                      Fx, Terrain (text-map tiles, one-way floors, slopes), Weapons (guns, melee, player projectiles),
                      Ride (sections on a moving vehicle: the Metropolitano roof), Flight (air level), Town (Mission 5 help)
src/entities/         Player, enemies (Grunt + cop preset, Biker + motocop, RiotCop, Sniper), Abuelita (helper),
                      CombiSlug (vehicle base) + MototaxiSlug, RochabusSlug, Aircraft, Flyer (flying enemies), Ally,
                      Boss (framework) + BossCobrador, BossTruck, BossContador, BossHeli, BossComisario, BossAlcalde, Pickup,
                      Breakable (gang props),
                      Vendor (food carts), Prisoner (honest cops to rescue)
src/levels/           missions.js (registry + data schema), missionN.js (one data file per mission)
src/scenes/           MenuScenes (Boot, Title, CharSelect, MissionEnd, Ending, GameOver), IntroScene (story crawl),
                      HUDScene, LevelScene,
                      StoryScene (story pages between a mission and its tally: talk, ledger, expediente, TV news)
docs/LEVELS.md        mission designs + what's missing for Missions 2–5
tools/serve.py        no-cache dev server
```

## Conventions

- One class per entity file; entities extend Phaser sprites/containers and expose `update(time, dt)`.
- Tuning numbers go in `src/config.js`, not scattered literals. Level layouts go in `src/levels/`.
- New missions: add `src/levels/missionN.js` (push onto `MISSIONS`) and a `<script>` tag in `index.html`.
  A mission is a list of `sections` (areas joined by a fade; schema in `src/levels/missions.js`).
  Terrain is a text map (key at the top of `src/systems/Terrain.js`): symbols are tiles, letters (and @ = start) are markers.
  The player jumps ~60px, so floors meant to be climbed are at most 3 tiles (48px) apart.
- Arcade physics has no slopes: `Terrain.snap` puts walkers on slope surfaces after each physics step.
  Vehicles only touch the tile under their center (plus walls 2+ tiles taller than the wheels), and tilt.
  Mission-specific logic goes in the data (`events[].run`) or a new entity, not in `LevelScene`.
- On-screen text: no floating sentences in levels; area names are physical signs (`sign` decor stands on posts or
  hangs from a ceiling); ordinary enemies rarely talk (`CFG.ENEMY.TALK_CHANCE`); warnings are short (`CFG.ALERT_MS`);
  after a mission only "MISSION COMPLETE!", then few story pages. Pickups don't print their names (the voice says it).
- Damage values: pistol 1, machine gun 1, emoliente 2, grenade 5, combi cannon 6; pickup weapons in `CFG.WEAPONS`.
- Weapons: data in `CFG.WEAPONS` / `CFG.THROWABLES` (name, crate letter = map marker, ammo, cadence), behavior in
  `Weapons.FIRE` and `Weapons.PROJECTILES`. Crate letters are Spanish initials except H and R (see docs/LEVELS.md).
- Third-party/ripped Metal Slug assets may be used only as private placeholders in `assets/_private/`
  (gitignored). Never commit or ship SNK assets.
