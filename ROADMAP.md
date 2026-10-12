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

- **Combi Slug** — armored combi (our "Metal Slug" tank). Roof cannon, can jump, route stickers = HP.
- Mototaxi Slug — fast, light, machine gun. *(later)*
- Bus "Chosicano" Slug — heavy, slow, for the highway chase. *(later)*

## Missions

| # | Mission | Enemies | Boss / story beat |
|---|---|---|---|
| 1 | Paradero / terminal in the cono | Gang foot soldiers, bikers | Armored mototaxi of El Cobrador. He shouts that he "has contacts at the comisaría". |
| 2 | Gamarra-style market | Gangs extorting vendors | You find the **ledger** of payments to police. Boss: collection truck. |
| 3 | Cerros + riding on a moving bus | Gangs + first corrupt cops | Gang leader escapes in a **police helicopter** (reveal). |
| 4 | Comisaría | Police + gangs | Evidence room full of cupo money. Boss: the comisario. |
| 5 | Vía Expresa chase → Municipalidad | Special police, private security, gang elite | Corrupt mayor mech. Bittersweet ending. |

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

### M2 — Vertical slice (Mission 1 "for real")
- [ ] Final art direction decided (see open questions)
- [ ] Real sprites for Don Chato, gang grunt, abuelita, Combi Slug, boss
- [ ] Real backgrounds (cerros, paradero, chicha posters)
- [ ] Sound effects pass + voice lines ("¡COMBI SLUG!", "¡METRALLETA!", "¡MISIÓN CUMPLIDA!")
- [ ] Music: chicha / cumbia psicodélica track for Mission 1
- [ ] Intro cutscene (coworker's death → drivers' union assembly → hiring the mercenary)
- [ ] Knife/melee at close range

### M3 — Missions 2–3
- [ ] Market level + ledger story beat
- [ ] Moving-bus level + police helicopter reveal
- [ ] Police enemy types; mixed gang + police encounters
- [ ] Mototaxi Slug

### M4 — Missions 4–5 + ending
- [ ] Comisaría level and comisario boss
- [ ] Highway chase (Bus Slug) + Municipalidad + mayor mech
- [ ] Ending cutscene; credits

### M5 — Release
- [ ] Balance, polish, accessibility options
- [ ] Spanish / English text
- [ ] itch.io page (free; disclose AI-generated assets if any)

## Open questions (need answers)

Answered: ripped Metal Slug assets → **private testing only** (`assets/_private/`, gitignored).
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
