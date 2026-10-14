# Roadmap — Cupo Cero (working title)

## Pitch

Metal Slug–style satire about extortion in Lima. A combi driver and a hired mercenary take on the
gangs charging "cupos", then discover the police and politicians are protecting them.
The driver ends the game as a folk hero and a fugitive ("going rogue").

## Characters

| Character | Role |
|---|---|
| **Don Chato** (placeholder name) | Playable. Combi driver who lost a coworker to the extortionists. |
| **El Sargento** (placeholder) | Playable. Retired policeman, one of the honest ones. |
| **El Mercenario** (placeholder) | Playable. Hired by the drivers' union. |
| **La Cobradora** (placeholder, 4th slot undecided) | Playable. The combi's fare collector. |
| **Emoliente Abuelita** | Rescuable helper (our "Hyakutaro"): follows you and throws boiling emoliente cups. |
| **El Cobrador de Cupos** | Mission 1 boss, rides an armored mototaxi. |
| **Corrupt Comisario** | Mission 4 boss. |
| **Corrupt Mayor** | Final boss, in a mech built from unfinished public works. |

## Vehicles

- **Combi Slug** — armored combi (our "Metal Slug" tank). Roof cannon, can jump, route stickers = HP. ✅
- Mototaxi Slug — fast, light, machine gun (Mission 2).
- Helicopter bought with a pollada (or a lent crop-duster plane) — air level (Mission 5).
- Rochabus — water-cannon truck (Mission 4).
- "Chosicano" Bus Slug — undecided (was the Mission 5 highway chase).

## Missions

Full design, weapons list and build order: `docs/LEVELS.md`.

| # | Mission | Sections | Boss / story beat |
|---|---|---|---|
| 1 | ¡Paga o ya sabes! | Paradero → Terminal | El Cobrador's armored mototaxi; "tengo contactos en la comisaría". |
| 2 | Gamarra no se cierra | Street → Galleries → Rooftops → Almacén | You find the **ledger**. Truck mid-boss, accountant boss. |
| 3 | La ruta | Cerros → Train roof → Station | A **police helicopter** rescues El Cobrador (reveal). |
| 4 | Su denuncia es importante para nosotros | Front desk → Cells → Evidence room → Escape | The comisario. |
| 5 | Obra paralizada | Air level → Plaza (the town joins you) → Municipalidad → Mayor | Mayor mech; ending. |

## Milestones

### M0 — Setup ✅
- [x] Git repo, CLAUDE.md, roadmap
- [x] Phaser vendored, no-build project structure

### M1 — Mission 1 playable prototype (current)
- [x] Player: run, jump, crouch, aim up, shoot, grenades, one-hit death, lives, respawn
- [x] Weapons: pistol (∞), machine gun pickup, grenades
- [x] Enemies: gang gunman, motorcycle extortionist
- [x] Emoliente Abuelita helper (tied up → freed → follows and throws emoliente → leaves with a gift)
- [x] Combi Slug: board/exit, drive, jump, machine gun + cannon, sticker HP, explode on 0 HP
- [x] Boss: El Cobrador's armored mototaxi with 3 attack patterns and a rage phase
- [x] HUD, title screen, game over, mission complete
- [x] Placeholder procedural art + synthesized SFX and music loop
- [ ] Playtest and tune difficulty (needs human play)

### M1.5 — Arcade structure ✅
- [x] 4 playable characters + character select (all play the same for now, like Metal Slug 1–3)
- [x] Credits: 5 lives per credit, 10 s continue countdown, change character on continue
- [x] Test helpers: key 5 inserts a coin, F2 toggles FREE PLAY (remembered)
- [x] 2 players: shared keyboard or gamepads, drop-in join mid-game
- [x] Combi Slug turret aims in 8 directions incl. down-diagonals and keeps its angle
- [x] Shoot straight down while jumping

### M1.6 — Level engine + mission flow ✅
- [x] Generic data-driven `LevelScene`; one data file per mission in `src/levels/`
- [x] Scripted events (`events`), named decor, arena as boss fight or locked-screen enemy waves
- [x] Mission flow: intro banner → outro → tally screen → next mission → placeholder ending
- [x] Lives, scores and characters carry over; game-over players can rejoin next mission
- [x] Test helpers: F3 stage select on the title, F4 finishes the current mission, `?mission=N`
- [x] Mission 2 greybox (reuses Mission 1 art; ends in an ambush instead of a boss)

### M1.7 — Terrain engine ✅
- [x] Levels drawn as text maps: solid ground, brick, dirt, one-way floors, 45° slopes, back walls, pits
- [x] Letter markers for enemies, pickups, helpers, the combi and the start
- [x] ↓ + jump drops through thin floors; falling into a pit costs a life
- [x] Camera follows vertically in tall maps; enemies keep to their floor and aim at other floors
- [x] Mission 2 greybox rebuilt with two multi-floor galleries, a trench and a rubble mound
- [ ] Optional: Tiled (or LDtk) import into the same tile grid

### M2 — Systems for the remaining missions (build order in `docs/LEVELS.md`)
- [x] Sections: missions made of several parts joined by a fade (exit by the right edge, a door, or clearing an
      ambush/mid-boss); players keep their kit and the driven Combi Slug. Mission 1 = Paradero → Terminal,
      Mission 2 = Mercado → Galerías
- [x] Weapons: letter pickups, ammo, HUD; Rocket Launcher, Anticuchera, Escopeta, Gallo de pelea, Pelota, Dron, Láser,
      Piedras; Molotov, Súper granada; per-character melee; tap-to-shoot pistol cadence
- [x] Enemy feel: slower bullets, aim before shooting, knife attack, knife runners; camera zoom 2.5 (bigger characters)
- [x] Food (Peruvian), getting fat (Metal Slug rules, emoliente = diet, cucharón melee), getting drunk (caldo cures);
      breakable gang props that drop items; vendors who toss food
- [x] Announcer voice on pickups (browser speech placeholder until clips are recorded in `assets/voice/`)
- [x] Rescuable prisoners (POWs), prototype: honest cops tied up by the gang; freed by a shot or a touch, they
      hand over an item; rescue count + bonus on the tally, reset to 0 on death (arcade rule)
- [ ] More prisoner types per mission (drivers, vendors, denunciantes, journalist...) and helpers that fight
- [ ] Auto-scroll mode (train roof, air level)
- [ ] Police enemy types; boss framework (mid-bosses, phases)

### M3 — Missions 2–3
- [ ] Mission 2 complete: rooftops, Mototaxi Slug, collection-truck mid-boss, accountant boss, ledger beat
- [ ] Art direction test on Mission 2 (decide the style before drawing everything)
- [ ] Mission 3: cerros, train roof, police helicopter reveal and boss

### M4 — Missions 4–5 + ending
- [ ] Mission 4: indoor tiles, comisaría, rochabus, comisario boss
- [ ] Air-shooter mode, ally AI
- [ ] Mission 5: air level, plaza with allies, Municipalidad, mayor mech
- [ ] Ending cutscene; credits

### M4.5 — Art, sound and story
- [ ] Real sprites, backgrounds and tiles; music per mission; voice lines ("¡METRALLETA!", "¡MISIÓN CUMPLIDA!")
- [ ] Intro cutscene (coworker's death → drivers' union assembly → hiring the mercenary) and story between missions

### M5 — Release
- [ ] Balance, polish, accessibility options
- [ ] Spanish / English text
- [ ] itch.io page (free; disclose AI-generated assets if any)
- [ ] Final name of the F weapon: keep "Pelota de fulbito" or go back to the arcade's "Drop Shot" (D, English;
      the Dron would move to C, e.g. "Chasqui") or a Spanish name like "Tiro de rebote" (T)

## Open questions (need answers)

Answered: ripped Metal Slug assets → **private testing only** (`assets/_private/`, gitignored).
Answered: weapons → see the decided list in `docs/LEVELS.md` (homing Cohetón, all optional weapons, Piedras,
Molotov as second throwable, per-character melee, Metal Slug ammo rules).
Missions are designed in `docs/LEVELS.md`.

1. **Final title.** "Cupo Cero" is a placeholder. Alternatives: "Combi Slug", "Al Fondo Hay Sitio",
   "Paga o Ya Sabes". Do we avoid "Metal Slug" in the name? (Recommended: yes, trademark.)
2. **The 4th playable character.** Placeholder is La Cobradora (fare collector). Alternatives: a market
   vendor (bodeguera), a school teacher (schools are extorted too), a mototaxista.
3. **Names.** The 4 playable characters, the abuelita, El Cobrador, the comisario, the mayor.
4. **Backstories.** The mercenary (retired soldier? foreigner?), and why the retired sergeant joins.
5. **Do characters play differently?** Identical like Metal Slug 1–3 (current), or small perks like Metal Slug 6?
6. **Art direction.** Detailed Metal Slug-like pixel art (expensive) vs. a simpler style?
   Hand-drawn, commissioned from a Peruvian artist, or AI-assisted + cleaned up in Aseprite?
7. **Music.** Commission a musician, compose ourselves (LMMS/BeepBox), or use licensed CC tracks?
8. **Other helpers.** Do we add the Cobrador ("¡AL FONDO HAY SITIO!" shout) and the ONP jubilado
   (paper "reclamo" blasts) in later missions?
9. **Ending.** Bittersweet (a new extortionist shows up next morning) or triumphant?
10. **Platform.** Browser/itch.io only, or also a desktop build?
11. **Team.** Who draws, who composes, who writes dialogue?
12. **Language.** Spanish only, or Spanish + English?
13. **How graphic?** Metal Slug-level cartoon violence only, or anything darker in cutscenes?
14. **Credits defaults.** Currently 3 starting credits and 5 lives per credit. Keep score on continue (current) or reset it?
15. **Train level.** Roof of the Línea 1 elevated train (fits the cerros of SJL) or of a Metropolitano bus?
16. **Air level.** Helicopter bought with a pollada, or a crop-duster plane lent from the provinces? Who gives it?
17. **Allies in Mission 5.** Who joins (honest police, vendors, mototaxistas, cobradores, students, rescued people)?
    Can they die? Do they only fight in the plaza or until the end?
18. **Bus Slug.** Keep the "Chosicano" bus somewhere (e.g. the Metropolitano) or drop it?
19. **Ladders.** Not planned (Metal Slug barely uses them). Do we want them anyway, e.g. in the comisaría?
