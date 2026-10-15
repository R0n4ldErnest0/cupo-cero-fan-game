# Game design: missions, weapons, build order (draft)

Gangs first, then gangs + police, then the government. Like Metal Slug, every mission is split into
**sections** (areas joined by a transition: a door, a fade, getting on a vehicle) and ends with a boss.
All names are fictional placeholders.

Status: ✅ built · 🚧 greybox (playable, placeholder) · 📝 designed only · ❓ needs a decision

## Presentation rules (from playtest feedback)

- No floating sentences over the levels; area names are **physical signs** (on posts, or hanging indoors).
- Ordinary enemies talk rarely (about 1 in 4, once); bosses, clues and story moments keep their lines.
- Boss / ambush warnings flash for about a second.
- More enemies: each section has a `crowd` (extra enemies all along it, the mission's own mix); the Metropolitano
  rides have **waves** (several bikers at once from both sides + cuperos dropping on the roof); the air level has
  drone **swarms**.
- **Screen locks** (section `locks`): at some spots the screen stops and ambush waves come from both sides until
  cleared (the camera never follows a player up a jump or a respawn drop; it keeps the floor in view).
- Enemy mix: about a third of the gunners are brawlers that run in to stab; the rest keep shooting from a distance.
- End of mission: "MISSION COMPLETE!" only, the expediente only if you found a clue there, then 1–3 story lines.

## Story pages (built)

Shown after MISSION COMPLETE, before the tally (`StoryScene`; mission `story` data): the **expediente** of every
mission, then: M1 the team reacts to El Cobrador's escape; M2 the **ledger**; M3 the helicopter reveal → "vamos a
entrar" (comisaría); M4 the journalist → a **TV news page** ("EL JEFE" ES... EL ALCALDE, revealed) → the union calls a
strike and a march → Don Tito knows where an old helicopter is; M5 (**provisional ending**) the mayor arrested on TV
("es una persecución política"), each character's closing line, then the FIN screen with the freed cops, clues and
score. The ending's tone (happy or bittersweet) is still to decide.

## Story arc (decided; details to refine)

A chain across the missions, so the ending feels earned:

1. **The proof (Missions 2–4):** the **ledger** (Mission 2: the comisaría gets its share, and "EL JEFE ████" the
   most); the **clues** the honest cops give you when you free them (the "expediente", see Prisoners); in Mission 4
   the seized cupo money in the comisaría's evidence room.
2. **The trigger (end of Mission 4):** escaping the comisaría, you hand everything to a **journalist** (a prisoner
   you free in the comisaría). That night it airs: "ÚLTIMO MINUTO: El libro de los cupos"; "El Jefe" is the mayor.
3. **The reaction:** the drivers' union calls a **strike and a march to the Municipalidad**; the mayor sends the
   serenazgo and the police to break it up; the plaza is surrounded. A **retired cop** knows where an **old police
   helicopter** is (out of service, still flies): that's how you get there (Mission 5 air level).
4. **The town helps:** you crash-land in the middle of the march ("¡Es el chofer de la tele!") and the people
   **help you** (how exactly is to refine: they shouldn't turn it into a brawl of civilians; e.g. they pass you
   supplies, open the way, distract the serenazgo, block the vans). The honest cops you freed come in person.
   **How much they help depends on the expediente** (more clues = stronger proof on TV = a bigger march).
5. Shown with story pages between Missions 4 and 5 (a TV news page, the union meeting) and in-game lines.

## Overview

| # | Mission | Sections | Status |
|---|---|---|---|
| 1 | ¡Paga o ya sabes! | A Paradero → B Terminal (boss) | ✅ prototype (both sections) |
| 2 | Gamarra no se cierra | A Mercado (Mototaxi Slug) → B Azoteas → C Almacén (mid-boss) → D Oficina (boss) | 🚧 greybox (all sections) |
| 3 | La ruta | A Cerros → B Metropolitano → C Estación (on foot) → D Metropolitano 2 + terminal (boss) | 🚧 greybox (all sections) |
| 4 | Su denuncia es importante para nosotros | A Mesa de partes → B Oficinas y celdas → C Sala de evidencias (riot wall) → D La fuga (rochabus, boss) | 🚧 greybox (all sections) |
| 5 | Obra paralizada (MISSION FINAL) | A Vuelo → B Plaza (the town helps) → C Municipalidad → D La obra (the mayor) | 🚧 greybox (all sections) |

---

## Mission 1 — "¡Paga o ya sabes!" ✅

**Defined and built:** bus stop in the cono; gang gunmen, molotov throwers, bikers; Emoliente Abuelita; Combi Slug;
sleeping cop ("DENUNCIAS: VUELVA MAÑANA"); "Estado de emergencia, prorrogado por 7ma vez" banner;
boss El Cobrador de Cupos in an armored mototaxi, who escapes shouting he has contacts at the comisaría.

Sections: A Paradero (street; leave by the right edge, on foot or in the Combi Slug) → B Terminal (short run-up
and the boss).

**Missing:** real art and music; balance after human playtests.

## Mission 2 — "Gamarra no se cierra" 🚧

**Decided restructure (max 4 sections per mission):** A **Mercado** (market street + first gallery; you get the
**Mototaxi Slug** here, on the street; ends with the ambush) → B **Azoteas** (climb the second gallery on foot,
its floors are the way up, then the rooftops; no vehicle on the roofs) → C **Almacén** (Camión Recaudador) →
D **Oficina** (El Contador + the ledger). The separate Galerías section goes away. ✅ done

**Defined:**
- A **Market street:** stalls, the municipal trench ("OBRA: INICIADA EN 2019") as a pit, a rubble mound.
  Gag: "Fiscalización municipal" confiscates a vendor's sweaters and doesn't see the gunmen. ✅ greybox
- B **Galleries:** multi-floor galleries, enemies on every floor. ✅ greybox
- C **Rooftops:** jumping between buildings (gaps are a long fall; 3 tiles wide, and gaps that go up only climb
  1 tile, so they're fair on foot), water tanks and laundry lines as platforms, cupero snipers on the tanks,
  cuperos behind metal shutters, an ambush at the end. The **Mototaxi Slug** is parked up here (the combi stays
  below). ✅ greybox
- D **Almacén:** the gang's warehouse (indoor: ceiling, back wall, shelves at two heights; snipers on the high
  shelves). Mid-boss **Camión Recaudador** ✅ greybox: spits coins in arcs (they hurt in flight, just clink when
  they land), throws money bags, honks and rams across the floor (jump over it), and its roof turret (breakable)
  fires 3-shot bursts; angry under 50%.
- E **The accountant's office:** boss **"El Contador"** ✅ greybox, in a walking safe-mech with two bill-counting
  machines as breakable arms: a fan of bills, a jumping safe-stomp with a shockwave along the floor (jump it), a
  storm of boletas from the ceiling, and (angry) the safe opens and rains coins. When he falls, the ledger flies out.
- **The ledger:** a story page of **"EL LIBRO DE CUPOS"** (entries appear one by one; the "Comisaría Sectorial" and
  "EL JEFE ████" are circled in red; a censored "Regidor"), then two lines of dialogue pointing to the police and
  "el Jefe" (Mission 5). Story pages are mission data (`story`, shown by `StoryScene`). ✅

**Missing:** rescuable vendors; market and warehouse art; an indoor floor tile.

**Mototaxi Slug** (`src/entities/MototaxiSlug.js`, built on the Combi Slug): fast, jumps high, 3 hits. Fire = the
canopy machine gun, forward or up (diagonal with ↑ + direction). C = the passenger throws a grenade (15).
**↓ + C = ¡BOCINAZO!**: the horn stuns and pushes back the enemies in front ("¡Bájale, causa!"); 3 charges that
refill every 6 s. It carries over between sections like the combi.

**Gang enemies added:** cupero behind a **metal shutter** (`e`, the riot-shield behavior) and the **gang sniper**
(`u`, the police sniper's laser sight).

## Mission 3 — "La ruta" 📝

**Defined:**
- A **Cerros:** up the hill (slopes), unfinished brick houses with floors, a ravine to jump; the vertical camera
  follows. The **first police** appear: the first cop "doesn't see" the cuperos ("¿Cuperos? Yo no veo ningún
  cuperos...") until he sees you. Patrol cops, riot shields, a motorbike cop and snipers on the rooftops; the
  "módulo policial" is closed "por operativo". ✅ greybox
- B **On the roof of a Metropolitano bus** (ride mode, built as a greybox): the articulated bus rushes along the
  busway; cuperos jump on from motorbikes alongside or are already on the roof; **pedestrian bridges** pass at head
  height: crouch or lose a life (a "¡AGÁCHATE!" warning comes first); falling off the bus = run over. At the end the
  bus brakes into the station. Timeline in `src/levels/mission3.js` (`ride.events`). ✅ greybox
- C **Station:** a police helicopter comes for El Cobrador from Mission 1 (the reveal: he leans out of its door,
  "¡Te dije que tenía contactos, chofer!"). Boss: the helicopter. It hovers and drifts side to side; attacks: a
  sweeping burst from the nose gun, tear-gas canisters, lowering cops on a rope, and (angry phase, under 50%) a
  missile barrage. The nose gun and the missile pod are breakable parts. When it crashes, El Cobrador runs off
  "a la comisaría" (leads into Mission 4). ✅ greybox
- Optional helper: a Cobrador whose "¡AL FONDO HAY SITIO!" shout pushes enemies back.

**Missing:** bus/busway/station art; more ride events (cars alongside, throwers on the bridges);
real helicopter art.

**Decided:** the Metropolitano (bus roof at street level, traffic alongside) instead of the Línea 1 elevated train.

**Expansion ✅ built:** B the first ride brakes into a station → C **Estación** on foot (turnstiles, cops guarding
it) and you board the next bus through its door → D **Metropolitano 2** with **bus-to-bus transfers** (ride event
`transfer`): your bus goes "¡FUERA DE SERVICIO!" (grayed out) and the next one catches up right in front of it;
for ~4 s both drift together with a small gap ("¡SALTA! →"), then the broken one falls behind and leaves the
screen (stay on it and you lose a life); whoever stands on a bus moves with it. At the terminal the bus stops, a
platform appears around it, and the **police helicopter** attacks there (a ride section can end in an `arena`).

## Mission 4 — "Su denuncia es importante para nosotros" 🚧 greybox

**Built (greybox):** indoor tiles (`~` office floor, `;` plaster wall, `!` cell bars). A **Mesa de partes**: the
queue of complaints ("TIEMPO DE ESPERA: 3 AÑOS", "TURNO N° 4,821"), cops, snipers on the filing shelves. B
**Oficinas y celdas**: four floors; cells open as you pass and cuperos come out to fight for the police; **the
journalist** is locked in a cell upstairs (prisoner skin `press`, clue m4b). C **Sala de evidencias**: the seized cupo
money; mid-boss **the riot-shield wall** (waves of riot cops). D **La fuga**: **drive the rochabus** (water cannon:
knocks enemies back and stuns them; tear gas thrown back with C) down a street that **scrolls on its own**
(`autoscroll`), patrol cars blocking the way; boss **the Comisario "Archivo"** in his filing-cabinet mech on
office-chair wheels: ARCHIVADO stamps, complaint folders, a rolling charge, and (angry) backup and a rain of stamps;
the two drawers are breakable. After the mission: the expediente and the journalist's lines (it airs tonight).

Earlier design notes:

**Defined:**
- A **Front desk:** an infinite queue of complaints; cops shoot **"ARCHIVADO"** stamps.
- Prisoners here: **a journalist** (the key to the story arc) and denunciantes locked up for filing complaints.
- B **Offices and cells:** indoor, several floors; gang members released from the cells to help the police.
- C **Evidence room:** full of cupo money labeled "INCAUTADO". Mid-boss: riot-shield wall.
- D **Escape:** steal the **rochabus** (water-cannon truck). Boss: the corrupt Comisario (filing-cabinet mech, or in the rochabus).
- After the mission: story pages (the journalist airs the proof on TV; the union calls a strike and a march).

**Missing:** indoor tiles (walls, ceilings, doors); rochabus vehicle; mid-boss and boss. (Police enemies: built.)

**Decided:** you **drive the rochabus** (a vehicle: its water cannon pushes enemies back) on the escape; the boss is
the Comisario in a **filing-cabinet mech** ("ARCHIVADO" stamps, flying complaint folders).

## Mission 5 — "Obra paralizada" (MISSION FINAL) 🚧 greybox

**Built (greybox):** A **Vuelo** (flight mode, `flight`): 1P flies Don Tito's old police helicopter, 2P a small plane;
free movement while Lima scrolls below; machine gun + homing rockets; small police helicopters, kamikaze serenazgo
drones and a TV news helicopter that can't be shot down; lose an aircraft = lose a life and come back in a new one;
out of fuel, you crash-land at the plaza. B **Plaza** (`town: true`): the march surrounded by the **serenazgo** (new
enemy) and the police; **allies** = the honest cops you freed in the whole game (1 + one per 3, max 4; they shoot,
and pull back instead of dying), **supply crates** thrown from the balconies (more often with more clues in the
expediente), the abuelita. C **Municipalidad** (indoor; "TRANSPARENCIA: PASE NOMÁS"). D **La obra**: the mayor's
mech (promesas, concrete puddles that slow you, the wrecking ball, the scissors, the mesa de diálogo).

Earlier design notes:

**Defined (new structure):**
- A **Air level** (like the final mission of Metal Slug 3): a **retired cop** knows where an **old police
  helicopter** is hidden (out of service, still flies). 1P flies the helicopter; **2P flies a small plane**. You
  move freely around the screen while it scrolls on its own (ride mode); fire forward, bombs down (the plane:
  faster, small missiles). Police helicopters, serenazgo drones, cuperos on the rooftops, and a TV news helicopter
  that can't be shot down and only films you ("EN VIVO"). You crash-land at the plaza.
- B **Plaza: the town helps you**: the march to the Municipalidad is surrounded; the people help (supplies,
  opening the way, distracting the serenazgo; to refine: keep it from becoming a civilian brawl), the honest cops
  you freed fight with you, the abuelita comes back with her emoliente. How much help depends on the expediente.
- C **Municipalidad:** offices, a press-conference room.
- D **Final boss:** the corrupt mayor in a mech built from an **obra paralizada** (unfinished public works): a
  concrete-mixer body, scaffolding legs, a crane with a wrecking ball and giant ribbon-cutting scissors, a podium
  cockpit with a microphone, traffic cones on the shoulders, an "OBRA EN EJECUCIÓN" sign. Attacks: fresh concrete
  that slows you, the wrecking ball, the scissors, **"PROMESAS"** (speech bubbles that explode), a **"Mesa de
  diálogo"** shield that only drops when he stops talking. To be tuned by trial and error.
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

## Bosses — framework built

`src/entities/Boss.js`: a boss gives its data (hp, intro line, **phases** by health with their attacks, pause and
speed) and its attacks as methods; the base runs entrance → intro → pause → attack, switches phase (with a line and
a shake), never repeats the same attack twice in a row, and plays the death sequence. **Breakable parts**
(`addPart`) have their own hp; destroying one removes its attacks and damages the boss. **No health bar** (like the
arcade): the boss smokes more and more as it gets hurt. A boss in a middle section is a **mid-boss**: beating it
leads to the next section. A simple boss is just one phase and one or two attacks.

Built on it: El Cobrador's mototaxi (Mission 1), the Camión Recaudador (Mission 2 mid-boss), El Contador
(Mission 2) and the police helicopter (Mission 3).

## Corrupt police — built

Same green uniform as the honest cops you rescue, plus **sunglasses and a mustache**. Map markers / spawn types:

| Marker | Type | Behavior |
|---|---|---|
| `p` | **Patrullero** (`cop`) | Like the gunner (aims first) but 2 hp and **2-shot bursts**; stabs up close. "¡Colabora pe, chofer!", "¿Cuánto para el cafecito?" |
| `r` | **Antimotines** (`riot`) | Advances behind a **riot shield** that stops everything from the front (bullets, flames, laser, melee: spark + "ting"). Grenades/explosions, shots from behind or from well above get through. The shield breaks after 10 hits (heavy weapons count double). Lowers it to shoot now and then (the moment to hit him); baton swing up close with a wind-up. |
| `m` | **Motorizado** (`motocop`) | Police motorbike from the right edge: 3 shots ("¡PAPELETA!"), 3 hp, runs you over. Also jumps onto the Metropolitano (`jumper` with `cop: true`). |
| `f` | **Francotirador** (`sniper`) | Crouched on rooftops. A **red laser** follows you for 1.1 s, **locks** (blinks) for 0.4 s, then a fast shot along that line: move after the lock. 1 hp. |

Tuning: `CFG.RIOT`, `CFG.SNIPER`; behavior in `src/entities/RiotCop.js`, `Sniper.js`, `Grunt.js` (cop preset), `Biker.js`.

## Prisoners — prototype built; expediente built

Our Metal Slug POWs. For now one kind: **honest cops** who refused to collect cupos, so their corrupt colleagues
handed them to the gang (foreshadows the police reveal; ties in with El Sargento). Tied up on the floor (map marker
`T`, mission `prisoners`, or hidden in a breakable prop with `drop: 'prisoner'`). A shot or a touch frees them:
they salute, walk to you, hand over their item (set in the data, or random) and run off. The **tally** shows
"POLICÍAS HONESTOS RESCATADOS x N" (+1000 each); the count carries over sections and missions and **goes back to 0
when you die** (arcade rule).

**✅ The expediente (case file)** (mission `clues`; built for Missions 1–3, 3 clues each): each honest cop you free gives a **clue** in his line ("El comisario
recibe un sobre cada viernes..."), saved in an **EXPEDIENTE** shown as a story page after each mission (missed clues
show as "???"). The clues build the arc step by step: M1 the gang has protection, M2 who collects at the comisaría,
M3 the comisario's name, M4 the regidor and the public works, M5 the proof against the mayor. In Mission 5 the cops
you freed come to help, and the expediente sets how much the town helps. Other prisoners later: the journalist
(Mission 4), denunciantes, municipal workers.

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
2. ✅ **Sections:** a mission made of several parts with transitions (max 4 per mission)
3. ✅ **Weapons system:** letter pickups, ammo, HUD; the new weapons, Molotov and Súper granada; per-character melee
4. ✅ **Rescuable people (POWs):** honest cops (prototype); next: the expediente of clues
5. ✅ **Ride mode** (Metropolitano roof, bus-to-bus transfers, a boss at the terminal; reused by the air level). A moving-camera auto-scroll over a normal map
   (chases, the Mission 4 escape) is still to do.
6. ✅ **Police enemies** (patrol, riot shield, motorcycle cop, sniper) and ✅ the boss framework (mid-bosses, phases)
7. ✅ **Mission 2** greybox (rooftops, Mototaxi Slug, truck mid-boss, accountant boss, ledger); next: restructure to
   4 sections → **art direction test** on it
8. ✅ **Mission 3** greybox (cerros, Metropolitano + station + second ride with transfers, helicopter boss)
9. ✅ **Mission 4** greybox (indoor tiles, comisaría, rochabus, comisario)
10. ✅ **Flight mode + allies**, ✅ **Mission 5** greybox; next: the ending
11. ✅ Story pages between missions (dialogue, the ledger, the expediente, TV news) and a provisional ending
12. **Next:** human playtest of the whole game → balance; art direction; real art and music; voice lines
13. Balance, difficulty settings, release

Not needed: **Tiled** (text maps cover every mission; it only helps if a non-programmer designs levels or once
there's lots of tile art to paint). **Ladders**: Metal Slug almost never uses them; you climb by jumping between
floors and walking up stairs (slopes). They can be added later if a level needs them ❓.
