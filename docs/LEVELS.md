# Game design: missions, weapons, build order (draft)

Gangs first, then gangs + police, then the government. Like Metal Slug, every mission is split into
**sections** (areas joined by a transition: a door, a fade, getting on a vehicle) and ends with a boss.
All names are fictional placeholders.

Status: ✅ built · 🚧 greybox (playable, placeholder) · 📝 designed only · ❓ needs a decision

## Overview

| # | Mission | Sections | Status |
|---|---|---|---|
| 1 | ¡Paga o ya sabes! | A Paradero → B Terminal (boss) | ✅ prototype (both sections) |
| 2 | Gamarra no se cierra | A Market street → B Galleries (climb) → C Rooftops → D Almacén (boss) | 🚧 A+B greybox (sections built) |
| 3 | La ruta | A Cerros (climb) → B Roof of the Metropolitano → C Station (boss) | 🚧 B greybox |
| 4 | Su denuncia es importante para nosotros | A Front desk → B Offices and cells → C Evidence room → D Escape (boss) | 📝 |
| 5 | Obra paralizada | A Air level ❓ → B Plaza: the town joins you → C Municipalidad → D Mayor (final boss) | 📝 |

---

## Mission 1 — "¡Paga o ya sabes!" ✅

**Defined and built:** bus stop in the cono; gang gunmen, molotov throwers, bikers; Emoliente Abuelita; Combi Slug;
sleeping cop ("DENUNCIAS: VUELVA MAÑANA"); "Estado de emergencia, prorrogado por 7ma vez" banner;
boss El Cobrador de Cupos in an armored mototaxi, who escapes shouting he has contacts at the comisaría.

Sections: A Paradero (street; leave by the right edge, on foot or in the Combi Slug) → B Terminal (short run-up
and the boss).

**Missing:** real art and music; balance after human playtests.

## Mission 2 — "Gamarra no se cierra" 🚧

**Defined:**
- A **Market street:** stalls, the municipal trench ("OBRA: INICIADA EN 2019") as a pit, a rubble mound.
  Gag: "Fiscalización municipal" confiscates a vendor's sweaters and doesn't see the gunmen. ✅ greybox
- B **Galleries:** multi-floor galleries, enemies on every floor. ✅ greybox
- C **Rooftops:** water tanks, laundry lines; get the **Mototaxi Slug**. 📝
- D **Almacén:** mid-boss collection truck that spits coins and money bags; you find **"EL LIBRO DE CUPOS"**
  (payments to a "Comisaría Sectorial"); boss: the gang's accountant in a mech of money counters and safes. 📝

**Missing:** rescuable vendors (Metal Slug POWs: free them, they drop weapons); shield thug (behind a stall's
metal shutter); rooftop sniper; Mototaxi Slug; collection truck; accountant boss; the ledger cutscene; market art.

## Mission 3 — "La ruta" 📝

**Defined:**
- A **Cerros:** stairs up the hill (slopes), unfinished houses, rebar, water tanks; climbs upward (vertical camera ✅).
  The **first police** appear: at first they ignore the gangs, later they shoot at you.
- B **On the roof of a Metropolitano bus** (ride mode, built as a greybox): the articulated bus rushes along the
  busway; cuperos jump on from motorbikes alongside or are already on the roof; **pedestrian bridges** pass at head
  height: crouch or lose a life (a "¡AGÁCHATE!" warning comes first); falling off the bus = run over. At the end the
  bus brakes into the station. Timeline in `src/levels/mission3.js` (`ride.events`). ✅ greybox
- C **Station:** a police helicopter lands and rescues El Cobrador from Mission 1 (the reveal). Boss: the helicopter.
- Optional helper: a Cobrador whose "¡AL FONDO HAY SITIO!" shout pushes enemies back.

**Missing:** sections A and C; bus/busway/station art; more ride events (cars alongside, throwers on the bridges);
police enemy types; helicopter boss.

**Decided:** the Metropolitano (bus roof at street level, traffic alongside) instead of the Línea 1 elevated train.

## Mission 4 — "Su denuncia es importante para nosotros" 📝

**Defined:**
- A **Front desk:** an infinite queue of complaints; cops shoot **"ARCHIVADO"** stamps.
- B **Offices and cells:** indoor, several floors; gang members released from the cells to help the police.
- C **Evidence room:** full of cupo money labeled "INCAUTADO". Mid-boss: riot-shield wall.
- D **Escape:** steal the **rochabus** (water-cannon truck). Boss: the corrupt Comisario (filing-cabinet mech, or in the rochabus).

**Missing:** indoor tiles (walls, ceilings, doors); police types (patrol, riot shield, motorcycle cop);
rochabus vehicle; mid-boss and boss.

## Mission 5 — "Obra paralizada" 📝

**Defined (new structure):**
- A **Air level** (like the flying sections of Metal Slug 3): the drivers and the neighborhood **bought a used
  helicopter with a pollada** (or someone from the provinces lends a crop-duster plane ❓). Auto-scrolling
  shooter over Lima: police helicopters, serenazgo drones, a TV news helicopter that only films you ("EN VIVO").
  You crash-land at the plaza.
- B **Plaza: the town joins you** (like the rebel soldiers joining in Metal Slug 3's last mission): the honest
  police who are left, vendors, mototaxistas, cobradores, students, and everyone you rescued earlier (the abuelita
  comes back) fight alongside you against serenazgo, private security and the gang elite.
- C **Municipalidad:** offices, a press-conference room.
- D **Final boss:** the corrupt mayor in a mech built from unfinished public works: ribbon-cutting giant
  scissors; a podium that fires **"PROMESAS"** (empty speech bubbles that explode); a **"Mesa de diálogo"**
  shield that only drops after it finishes talking.
- **Ending:** the driver is a folk hero and a fugitive ("goes rogue"). Tone ❓.

**Missing:** flying vehicle and air-shooter mode; ally AI; new enemies; boss; ending cutscene.
The old idea (highway chase on the "Chosicano" Bus Slug) is replaced by the air level ❓ (keep it elsewhere or drop it).

---

## Weapons (Metal Slug → ours) — built

Rules (Metal Slug's): weapons come in crates or are dropped by rescued people, shown by a letter. A weapon lasts
until its ammo runs out, then you're back to the pistol. Picking up the same weapon adds ammo; a different one
replaces it. Throwables are counted separately. You lose your weapon when you die.

**Names, letters and announcer:** Spanish, except the two arcade classics, which keep their English name, letter
and announcer line: **H** "Heavy Machine Gun!" and **R** "Rocket Launcher!". The crate letter is also the map
marker. Tuning: `CFG.WEAPONS` / `CFG.THROWABLES` in `src/config.js`; behavior: `src/systems/Weapons.js`.

**Enemies** (arcade feel): bullets are slow enough to see and jump over; gunners stop and aim for 0.4 s before each
shot, 2.2–3.8 s apart. Any grunt pulls a knife if you get right next to it (0.35 s warning, "¡!"), and knife runners
(map marker `k`) charge at you. Tuning in `CFG.ENEMY`.

**Fire rate:** every press shoots as soon as the gun allows (a slightly early press is kept, never lost), so tapping
faster shoots faster, like the arcade pistol. Holding fire repeats at a slower rate (machine gun and laser: full rate).

| Letter | Ours | Metal Slug | Behavior | Ammo |
|---|---|---|---|---|
| — | **Pistola** | Handgun | one shot per press | ∞ |
| H | **Heavy Machine Gun** | Heavy Machine Gun | fast fire while held | 150 |
| R | **Rocket Launcher** | Rocket Launcher | New Year's firework rockets that **home in** on the nearest enemy; sparkly trail, colored burst with splash | 30 |
| A | **Anticuchera** | Flame Shot | street-grill flamethrower; short range, goes through enemies; they end charred and smoking | 30 |
| E | **Escopeta** | Shotgun | wide short-range cone, hits everything in it, slow | 15 |
| G | **Gallo de pelea** | Iron Lizard | roosters run along the floor, leap at an enemy, burst in feathers (splash), fly off crowing "¡KIKIRIKÍ!" | 20 |
| F | **Pelota de fulbito** | Drop Shot | bouncing balls that hop along the floor | 30 |
| D | **Dron de delivery** | Enemy Chaser | small drones that chase enemies | 30 |
| L | **Puntero láser** | Laser | green beam that cuts through every enemy in a line, up to a wall | 150 |
| B | **Bombas** | Bomb | a refill of the current throwable (+10 grenades / molotovs, +30 stones; start: 10 grenades) | |
| M | **Molotov** | Fire Bomb (MS3) | all your throwables become molotovs (+10): they burst in flames that stay on the floor | |
| P | **Piedras** | — (ours) | throwable, not a gun: all your throwables become stones (+30). Fast, low arc, weak, lots of them. The pickup is a drawn pile of stones with a floating sign, no letter | |
| S | **Súper granada** | Super Grenade | one huge grenade that clears the screen; thrown before the others | |
| — | **Melee** | Knife | an enemy right in front: fire hits instead of shooting. Don Chato: tire iron. Sargento: police baton. Mercenario: machete. Cobradora: coin bag | |
| | Vehicle weapons | | Combi Slug ✅, Mototaxi Slug, helicopter, rochabus | |

All placeholder art and tuning; damage numbers need playtesting. Testing: **F6** drops the next crate in front of 1P;
the Mission 2 greybox has one crate of each.

## Prisoners — prototype built

Our Metal Slug POWs. For now one kind: **honest cops** who refused to collect cupos, so their corrupt colleagues
handed them to the gang (foreshadows the police reveal; ties in with El Sargento). Tied up on the floor (map marker
`T`, mission `prisoners`, or hidden in a breakable prop with `drop: 'prisoner'`). A shot or a touch frees them:
they salute, walk to you, hand over their item (set in the data, or random) and run off. The **tally** shows
"POLICÍAS HONESTOS RESCATADOS x N" (+1000 each); the count carries over sections and missions and **goes back to 0
when you die** (arcade rule). Later: other prisoners per mission (drivers, vendors, denunciantes, a journalist,
municipal workers) and some that help you fight for a moment.

## Food, fat and drunk — built

Metal Slug 2/X/3 rules, with Peruvian food (`CFG.FOOD`, `CFG.FAT`, `CFG.DRUNK`):

- **Where food comes from:** lying in the street (map markers), **gang property you shoot apart** (`props`: "CUPO"
  boxes, loot bags, trash bins, barrels and parked motorbikes that explode; they drop food/items, sometimes a cupero
  jumps out), **street vendors** who toss you food when you walk by (`vendors`; our Rumi Aikawa; never targets), and
  later the rescued prisoners.
- **Food:** pan con chicharrón, mote, makis, chicha morada, lomo saltado (very filling), caldo de gallina.
- **Fat:** eat enough in one life and you get fat ("¡BURP!"): slower, but the pistol and machine gun fire big bullets
  (2 damage), the laser is thick with an energy ball where it hits, flame/shotgun/rockets hit harder, grenades are
  bigger, stones become boulders and melee is a **cucharón**. Ends with an **emoliente** (our diet powder), after
  40 s without eating, or by dying.
- **Drunk (ours):** 3 drinks (chicha de jora, pisco) within 20 s: 8 s of stumbling, wobbly aim, swaying screen and
  hiccups. **Caldo de gallina** sobers you up.

**Announcer voice:** `src/systems/Voice.js` plays recorded clips from `assets/voice/` (see its README) and falls
back to the browser's speech synthesis until we have them. Direction: a **fictional** announcer in the style of a
chicha/cumbia show host (over-the-top tropical energy). Not a real person's voice (no cloning or imitating real
artists without their consent). ❓ Who records: a friend/actor (best), an AI voice (ElevenLabs paid plan for commercial
use; disclose on itch.io), or Piper (free, offline, more robotic).

---

## Build order (what to develop, in order)

Systems first (each one unlocks several missions), then the missions, then art/sound, then story and polish.

1. ✅ Level engine, mission flow, terrain (text maps, floors, slopes, pits, vertical camera)
2. **Sections:** a mission made of several parts with transitions, each with its own map or mode
3. **Weapons system:** letter pickups, ammo, HUD; the 9 new weapons, Molotov and Super granada; per-character melee
4. **Rescuable people (POWs):** free them, they drop weapons and items (core Metal Slug loop)
5. ✅ **Ride mode** (Metropolitano roof; reused by the air level). A moving-camera auto-scroll over a normal map
   (chases, the Mission 4 escape) is still to do.
6. **Police enemies** (patrol, riot shield, motorcycle cop, sniper) and the boss framework (mid-bosses, phases)
7. **Mission 2 complete** (rooftops, Mototaxi Slug, truck mid-boss, accountant boss) → **art direction test** on it
8. **Mission 3** (cerros, Metropolitano ✅ greybox, helicopter boss)
9. **Mission 4** (indoor tiles, comisaría, rochabus, comisario)
10. **Air-shooter mode + ally AI**, then **Mission 5** and the ending
11. Real art and music for everything, voice lines
12. Story cutscenes between missions
13. Balance, difficulty settings, release

Not needed: **Tiled** (text maps cover every mission; it only helps if a non-programmer designs levels or once
there's lots of tile art to paint). **Ladders**: Metal Slug almost never uses them; you climb by jumping between
floors and walking up stairs (slopes). They can be added later if a level needs them ❓.
