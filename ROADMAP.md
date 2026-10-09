# Roadmap — Cupo Cero (working title)

## Pitch

Metal Slug–style satire about extortion in Lima. A combi driver and a hired mercenary take on the
gangs charging "cupos", then discover the police and politicians are protecting them.
The driver ends the game as a folk hero and a fugitive ("going rogue").

## Characters

| Character | Role |
|---|---|
| **Don Chato** (placeholder name) | Combi driver, player 1. Lost a coworker to the extortionists. |
| **The Mercenary** (unnamed) | Hired by the drivers' union, player 2 / co-op. |
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
- [ ] Player: run, jump, crouch, aim up, shoot, grenades, one-hit death, lives, respawn
- [ ] Weapons: pistol (∞), machine gun pickup, grenades
- [ ] Enemies: gang gunman, motorcycle extortionist
- [ ] Emoliente Abuelita helper (tied up → freed → follows and throws emoliente → leaves with a gift)
- [ ] Combi Slug: board/exit, drive, jump, machine gun + cannon, sticker HP, explode on 0 HP
- [ ] Boss: El Cobrador's armored mototaxi with 3 attack patterns and a rage phase
- [ ] HUD, title screen, game over, mission complete
- [ ] Placeholder procedural art + synthesized SFX and music loop
- [ ] Playtest and tune difficulty

### M2 — Vertical slice (Mission 1 "for real")
- [ ] Final art direction decided (see open questions)
- [ ] Real sprites for Don Chato, gang grunt, abuelita, Combi Slug, boss
- [ ] Real backgrounds (cerros, paradero, chicha posters)
- [ ] Sound effects pass + voice lines ("¡COMBI SLUG!", "¡METRALLETA!", "¡MISIÓN CUMPLIDA!")
- [ ] Music: chicha / cumbia psicodélica track for Mission 1
- [ ] Intro cutscene (coworker's death → drivers' union assembly → hiring the mercenary)
- [ ] Gamepad support, knife/melee at close range

### M3 — Missions 2–3
- [ ] Market level + ledger story beat
- [ ] Moving-bus level + police helicopter reveal
- [ ] Police enemy types; mixed gang + police encounters
- [ ] Mototaxi Slug

### M4 — Missions 4–5 + ending
- [ ] Comisaría level and comisario boss
- [ ] Highway chase (Bus Slug) + Municipalidad + mayor mech
- [ ] Ending cutscene; credits
- [ ] Co-op (player 2 = mercenary)

### M5 — Release
- [ ] Balance, polish, accessibility options
- [ ] Spanish / English text
- [ ] itch.io page (free; disclose AI-generated assets if any)

## Open questions (need answers)

1. **Final title.** "Cupo Cero" is a placeholder. Alternatives: "Combi Slug", "Al Fondo Hay Sitio",
   "Paga o Ya Sabes". Do we avoid "Metal Slug" in the name? (Recommended: yes, trademark.)
2. **Character names.** Driver (placeholder "Don Chato"), the mercenary, the abuelita, El Cobrador,
   the comisario, the mayor.
3. **The mercenary's backstory.** Retired soldier? Foreign ex-con? A former cop who quit in disgust?
4. **Art direction.** Detailed Metal Slug-like pixel art (expensive) vs. a simpler 32–64px style?
   Hand-drawn, commissioned from a Peruvian artist, or AI-assisted + cleaned up in Aseprite?
5. **Ripped Metal Slug assets.** Private placeholders only (recommended), or ship as a free fan game
   and accept takedown risk?
6. **Music.** Commission a musician, compose ourselves (LMMS/BeepBox), or use licensed CC tracks?
7. **Other helpers.** Do we still add the Cobrador ("¡AL FONDO HAY SITIO!" shout wave) and the ONP
   jubilado (paper "reclamo" blasts) in later missions?
8. **Ending.** Bittersweet (a new extortionist shows up next morning) or triumphant?
9. **Platform.** Browser/itch.io only, or also a desktop build (e.g., via Electron/Tauri or porting to Godot)?
10. **Team.** Who draws, who composes, who writes dialogue?
11. **Language.** Spanish only, or Spanish + English?
12. **How graphic?** Metal Slug-level cartoon violence only, or anything darker in cutscenes?
