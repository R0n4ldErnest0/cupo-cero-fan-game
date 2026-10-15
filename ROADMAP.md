# Roadmap — Cupo Cero (working title)

## Pitch

Metal Slug–style satire about extortion in Lima. A combi driver and a hired mercenary take on the
gangs charging "cupos", then discover the police and politicians are protecting them.
The driver ends the game as a folk hero and a fugitive ("going rogue").

## Characters

| Character | Role |
|---|---|
| **Pancho** | Playable. Combi driver; the extortionists killed his compadre Lucho (ruta 13-B). |
| **Don Tito** | Playable. Retired policeman, one of the honest ones; knows where the old helicopter is (Mission 5). |
| **Amaru** | Playable. Mercenary hired by the drivers' union. |
| **Inés** | Playable. Owner of a small drugstore (a PYME) extorted again and again. |
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
| 3 | La ruta | Cerros → Metropolitano roof → Station | A **police helicopter** rescues El Cobrador (reveal). |
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
- [x] Enemy feel: slower bullets, aim before shooting, knife attack, knife runners; camera zoom 3 (bigger characters,
      consistent size: whole-number zoom)
- [x] Food (Peruvian), getting fat (Metal Slug rules, emoliente = diet, cucharón melee), getting drunk (caldo cures);
      breakable gang props that drop items; vendors who toss food
- [x] Announcer voice on pickups (browser speech placeholder until clips are recorded in `assets/voice/`)
- [x] Rescuable prisoners (POWs), prototype: honest cops tied up by the gang; freed by a shot or a touch, they
      hand over an item; rescue count + bonus on the tally, reset to 0 on death (arcade rule)
- [x] Expediente: each freed honest cop with a clue tells it; a case-file page after each mission ("???" if missed)
- [ ] More prisoner types (the journalist in Mission 4, denunciantes, municipal workers)
- [x] Mission 2 restructure to 4 sections (Mototaxi Slug in the Mercado, Azoteas on foot)
- [x] Intro crawl after character select (new game from Mission 1); characters renamed
- [x] Mission 3 Metropolitano expansion: stop at a station, on foot, bus-to-bus jumps, helicopter at the terminal
- [x] Ride mode: the section happens on a moving vehicle (Metropolitano bus roof): scrolling road and backgrounds,
      a timeline of enemies jumping on and pedestrian bridges to duck under (lose a life), braking into the station.
      Mission 3 greybox = the bus ride
- [x] Police enemies: patrullero (bursts), antimotines (riot shield), motorizado, francotirador (laser sight);
      Mission 3 section A "Cerros" greybox with the first police
- [x] Boss framework: phases by health, attack picker, breakable parts, death sequence, mid-bosses; no health bar
      (the boss smokes as it gets hurt). El Cobrador rebuilt on it; police helicopter boss (Mission 3 station)

### M3 — Missions 2–3
- [x] Mission 2 rooftops (greybox) + Mototaxi Slug (machine gun, grenades, bocinazo); gang shield thug and sniper
- [x] Mission 2 almacén (greybox) + Camión Recaudador mid-boss
- [x] Mission 2 accountant boss ("El Contador") + the ledger story page (StoryScene)
- [ ] Art direction test on Mission 2 (decide the style before drawing everything)
- [ ] Mission 3: cerros, Metropolitano, station + helicopter boss (all greybox ✅); real art

### M4 — Missions 4–5 + ending
- [x] Mission 4 greybox: indoor tiles, comisaría (front desk, cells, evidence room), the journalist, the riot-shield
      wall, the rochabus escape (auto-scroll), the Comisario's filing-cabinet mech
- [x] Moving-camera auto-scroll over a normal map (section `autoscroll`)
- [x] Flight mode (air level: helicopter / plane, flying enemies), allies (freed honest cops), town supplies
- [x] Mission 5 greybox: air level, plaza where the town helps, Municipalidad, the mayor's obra-paralizada mech
- [x] Ending (provisional, story pages + an end screen with freed cops / clues / score); credits still to do
- [ ] Decide the ending's tone (happy or bittersweet) and rewrite the final pages

### M4.5 — Art, sound and story
- [ ] Real sprites, backgrounds and tiles; music per mission; voice lines ("¡METRALLETA!", "¡MISIÓN CUMPLIDA!")
- [x] Intro crawl and story pages between missions (talk, ledger, expediente, TV news) — placeholder art
- [x] Playtest feedback round 1: zoom 3 (consistent sizes), physical signs and no floating texts, less enemy
      chatter, short boss warnings, more enemies (section `crowd`) and Metropolitano waves, a lighter end of mission
      (banner + the expediente only if you found clues + 1-3 story lines)
- [x] Playtest feedback round 2: no pickup names on screen, the camera keeps the floor in view (no lift on jumps or
      respawns), screen locks with ambush waves, fewer enemies in Mission 1, slower enemy lobs, brawlers that run in
      to stab while gunners keep their distance, weaker enemies and shields, a fairer Metropolitano helicopter,
      mototaxi aims down like the combi
- [ ] Illustrated cutscenes (real art) for the intro and between missions

### M5 — Release
- [ ] Balance, polish, accessibility options
- [ ] Spanish / English text
- [ ] itch.io page (free; disclose AI-generated assets if any)
- [ ] Final name of the F weapon: keep "Pelota de fulbito" or go back to the arcade's "Drop Shot" (D, English;
      the Dron would move to C, e.g. "Chasqui") or a Spanish name like "Tiro de rebote" (T)

## Open questions (need answers)

Answered: the Mission 3 ride is on the roof of a Metropolitano bus (not the Línea 1 train).
Answered: the air level uses an old police helicopter a retired cop knows about; 2P flies a small plane.
Answered: the story arc (ledger + expediente of clues from freed honest cops → a journalist prisoner airs it on TV
→ strike and march → the town helps in Mission 5); see `docs/LEVELS.md`.
Answered: names: Pancho (driver), Don Tito (retired cop), Amaru (mercenary); the 4th is Inés, a drugstore owner.
Answered: max 4 sections per mission (Mission 2 to be restructured: Mercado with the Mototaxi Slug → Azoteas →
Almacén → Oficina).
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
17. **How the town helps in Mission 5.** Decided that they help (not a civilian brawl); the exact mechanic is to
    refine (supplies, opening the way, distractions...).
18. **Bus Slug.** Keep the "Chosicano" bus somewhere (e.g. the Metropolitano) or drop it?
19. **Ladders.** Not planned (Metal Slug barely uses them). Do we want them anyway, e.g. in the comisaría?
