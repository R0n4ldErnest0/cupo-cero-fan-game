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
  Code, comments and docs are in English.

## Tech

- **Phaser 3.80.1**, vendored at `lib/phaser.min.js` (no CDN, works offline).
- Plain classic `<script>` tags, **no build step, no modules**. Files share globals; load order is
  defined in `index.html`. Keep it that way unless we deliberately add a bundler.
- Arcade physics. Game canvas is 960x540; the level camera uses zoom 2, so the world is authored in
  480x270 "pixel" units. The HUD runs in its own scene at zoom 1.
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

Controls (solo): ←/→ move, ↑ aim up, ↓ crouch (in the air: shoot down), Z jump, X shoot, C grenade,
↓ near the Combi Slug to board, ↓+Z to exit it, P pause, M mute, Enter start.
2 players: 1P WASD + F shoot / G jump / H grenade, 2P arrows + , shoot / . jump / / grenade; gamepads work
(A jump, X shoot, B grenade, Start). Keys are defined in `CFG.KEYS`.
Testing: **5** inserts a coin, **F2** toggles FREE PLAY (infinite credits, saved in localStorage).

## Layout

```
index.html            entry; script load order lives here
lib/phaser.min.js     vendored engine
src/config.js         constants (sizes, speeds, tuning)
src/systems/          Textures (procedural art), Sfx (synth audio), Session (credits), Controls (input), Fx
src/entities/         Player, enemies, Abuelita (helper), CombiSlug (vehicle), bosses, projectiles
src/scenes/           MenuScenes (Boot, Title, CharSelect, GameOver), HUDScene, Level1Scene
docs/LEVELS.md        mission designs + what's missing for Missions 2–5
tools/serve.py        no-cache dev server
```

## Conventions

- One class per entity file; entities extend Phaser sprites/containers and expose `update(time, dt)`.
- Tuning numbers go in `src/config.js`, not scattered literals.
- Damage values: pistol 1, machine gun 1, emoliente 2, grenade 5, combi cannon 6.
- Third-party/ripped Metal Slug assets may be used only as private placeholders in `assets/_private/`
  (gitignored). Never commit or ship SNK assets.
