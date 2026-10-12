# Game design: missions, weapons, build order (draft)

Gangs first, then gangs + police, then the government. Like Metal Slug, every mission is split into
**sections** (areas joined by a transition: a door, a fade, getting on a vehicle) and ends with a boss.
All names are fictional placeholders.

Status: ✅ built · 🚧 greybox (playable, placeholder) · 📝 designed only · ❓ needs a decision

## Overview

| # | Mission | Sections | Status |
|---|---|---|---|
| 1 | ¡Paga o ya sabes! | A Paradero → B Terminal (boss) | ✅ prototype |
| 2 | Gamarra no se cierra | A Market street → B Galleries (climb) → C Rooftops → D Almacén (boss) | 🚧 A+B greybox |
| 3 | La ruta | A Cerros (climb) → B Roof of the moving train ❓ → C Station (boss) | 📝 |
| 4 | Su denuncia es importante para nosotros | A Front desk → B Offices and cells → C Evidence room → D Escape (boss) | 📝 |
| 5 | Obra paralizada | A Air level ❓ → B Plaza: the town joins you → C Municipalidad → D Mayor (final boss) | 📝 |

---

## Mission 1 — "¡Paga o ya sabes!" ✅

**Defined and built:** bus stop in the cono; gang gunmen, molotov throwers, bikers; Emoliente Abuelita; Combi Slug;
sleeping cop ("DENUNCIAS: VUELVA MAÑANA"); "Estado de emergencia, prorrogado por 7ma vez" banner;
boss El Cobrador de Cupos in an armored mototaxi, who escapes shouting he has contacts at the comisaría.

**Missing:** real art and music; split into two sections (street, terminal); balance after human playtests.

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
- B **On the roof of a moving train** (Metal Slug train-level style, auto-scroll): enemies jump on from motorcycles
  and from the station platforms; duck under signs and bridges.
- C **Station:** a police helicopter lands and rescues El Cobrador from Mission 1 (the reveal). Boss: the helicopter.
- Optional helper: a Cobrador whose "¡AL FONDO HAY SITIO!" shout pushes enemies back.

**Missing:** auto-scroll mode; train and station art; police enemy types; helicopter boss.

**❓ Train or Metropolitano?** The Metropolitano is articulated buses on dedicated lanes (Vía Expresa);
the elevated train is the **Línea 1 del Metro**, which runs up to the cerros of San Juan de Lurigancho.
A train-roof level fits Línea 1 best (cerros → station → elevated track). The Metropolitano works as a bus-roof
level (lower, with traffic alongside). Pick one, or use the Metropolitano somewhere else (Mission 5).

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

## Weapons (Metal Slug → ours)

Weapons come in crates or are dropped by rescued people, shown by a letter. Ammo runs out, back to the pistol.

| Metal Slug | Ours | Behavior | Status |
|---|---|---|---|
| Handgun | **Pistola** | infinite | ✅ |
| Heavy Machine Gun (H) | **Metralleta** | fast fire | ✅ |
| Grenade | **Granada** | thrown, bounces | ✅ |
| Knife (melee) | **Llave de ruedas** (tire iron) ❓ | automatic when an enemy is very close | 📝 |
| Rocket Launcher (R) | **Cohetón** | New Year's firework rockets, splash damage | 📝 |
| Flame Shot (F) | **Anticuchera** | flames from a street grill, short range, pierces | 📝 |
| Shotgun (S) | **Escopeta** | short wide blast, strong | 📝 |
| Iron Lizard (I) — the "walking bombs" | **Gallo de pelea** | roosters run along the ground, leap at the first enemy and burst in a cloud of feathers; the rooster flies off unharmed (cartoon) | 📝 |
| Drop Shot (D) | **Pelota de fulbito** ❓ | bouncing shots | 📝 optional |
| Enemy Chaser (C) | **Dron de delivery** ❓ | homing | 📝 optional |
| Laser (L) | **Puntero láser de ambulante** ❓ | beam | 📝 optional |
| Vehicle weapons | Combi Slug ✅, Mototaxi Slug, helicopter, rochabus | | |

---

## Build order (what to develop, in order)

Systems first (each one unlocks several missions), then the missions, then art/sound, then story and polish.

1. ✅ Level engine, mission flow, terrain (text maps, floors, slopes, pits, vertical camera)
2. **Sections:** a mission made of several parts with transitions, each with its own map or mode
3. **Weapons system:** letter pickups, ammo, HUD; Cohetón, Anticuchera, Escopeta, Gallo de pelea; melee
4. **Rescuable people (POWs):** free them, they drop weapons and items (core Metal Slug loop)
5. **Auto-scroll mode** (train roof; reused by the air level)
6. **Police enemies** (patrol, riot shield, motorcycle cop, sniper) and the boss framework (mid-bosses, phases)
7. **Mission 2 complete** (rooftops, Mototaxi Slug, truck mid-boss, accountant boss) → **art direction test** on it
8. **Mission 3** (cerros, train, helicopter boss)
9. **Mission 4** (indoor tiles, comisaría, rochabus, comisario)
10. **Air-shooter mode + ally AI**, then **Mission 5** and the ending
11. Real art and music for everything, voice lines
12. Story cutscenes between missions
13. Balance, difficulty settings, release

Not needed: **Tiled** (text maps cover every mission; it only helps if a non-programmer designs levels or once
there's lots of tile art to paint). **Ladders**: Metal Slug almost never uses them; you climb by jumping between
floors and walking up stairs (slopes). They can be added later if a level needs them ❓.
