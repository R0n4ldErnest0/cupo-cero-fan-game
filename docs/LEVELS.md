# Mission design (draft)

Five missions. Gangs first, then gangs + police, then the government. Each mission has one
recurring satirical gag, a helper, a vehicle moment, a mid-boss and a boss.
All names are fictional placeholders.

---

## Mission 1 — "¡Paga o ya sabes!" (Paradero in the cono) ✅ prototype

- **Setting:** bus stop and terminal, grey Lima sky, cerros in the background, chicha posters, tangled cables.
- **Enemies:** gang gunmen, molotov throwers, extortionists on motorcycles.
- **Helper:** Emoliente Abuelita (tied up for not paying).
- **Vehicle:** Combi Slug.
- **Gag:** "Estado de emergencia — prorrogado por 7ma vez" banner; a cop asleep in his patrol car next to
  a sign "DENUNCIAS: VUELVA MAÑANA".
- **Boss:** El Cobrador de Cupos in an armored mototaxi. Escapes yelling he has contacts at the comisaría.

## Mission 2 — "Gamarra no se cierra" (Market / garment district)

- **Setting:** market streets, stalls, narrow galleries with several floors (multi-level platforms), rooftops.
- **Enemies:** gang collectors extorting vendors; shield thugs (hiding behind a stall's metal shutter);
  rooftop snipers; gang members in mototaxis.
- **Rescuable vendors** (POWs): free them and they drop items/weapons.
- **Gag:** "Fiscalización municipal" inspectors who confiscate a vendor's goods and walk right past the gang.
- **Vehicle:** **Mototaxi Slug** (fast, light, machine gun).
- **Mid-boss:** a gang "collection truck" (armored van) that spits coins and money bags.
- **Story beat:** you find **"EL LIBRO DE CUPOS"** — a ledger with payments to a "Comisaría Sectorial".
- **Boss:** the gang's accountant in a mech built from money-counting machines and safes.

## Mission 3 — "La ruta" (Cerros + riding a moving bus)

- **Part A — cerros:** stairs up the hill, unfinished houses, rebar, water tanks. Vertical climbing sections.
- **Part B — on the roof of a moving bus (auto-scroll):** enemies jump on from motorcycles and other buses;
  duck under bridges and pedestrian crossings.
- **Enemies:** gangs plus the **first police**. At first they ignore you; after the reveal they shoot.
- **Second helper (optional):** the Cobrador: his "¡AL FONDO HAY SITIO!" shout pushes enemies back.
- **Mid-boss:** a patrol car escorting gang trucks.
- **Boss / reveal:** a **police helicopter** lands and rescues the gang leader from Mission 1. You fight the helicopter.

## Mission 4 — "Su denuncia es importante para nosotros" (Comisaría)

- **Setting:** police station: front desk with an infinite queue of complaints, offices, cells, evidence room.
- **Enemies:** corrupt police (patrol, riot shields, motorcycle cops), gangs released from the cells to help them.
- **Gag:** the corrupt cops shoot "ARCHIVADO" stamps; the evidence room is full of cupo money labeled "INCAUTADO".
- **Vehicle moment:** steal the **rochabus** (water-cannon truck) or a patrol car.
- **Mid-boss:** riot squad wall.
- **Boss:** the corrupt Comisario, in a mech built from filing cabinets, or riding the rochabus.

## Mission 5 — "Obra paralizada" (Vía Expresa → Municipalidad)

- **Part A — highway chase (auto-scroll)** on the **Bus Slug** ("el Chosicano"): police motorcycles,
  armored cars, helicopters, gang trucks.
- **Part B — the Municipalidad:** serenazgo, private security, gang elite, a press conference room.
- **Final boss:** the corrupt mayor in a mech built from unfinished public works. Example attacks:
  ribbon-cutting giant scissors, podium that fires "PROMESAS" (empty speech bubbles that explode),
  a "Mesa de diálogo" shield that only drops after it finishes talking.
- **Ending** (open question): the driver is a folk hero and a fugitive. Bittersweet option:
  next morning someone new asks for the cupo.

---

## What is missing before building Missions 2–5

Technical work (in suggested order):

1. **Generic level engine.** Mission 1 is hard-coded in `Level1Scene`. Split it into a reusable `LevelScene`
   plus one data file per mission (backgrounds, platforms, spawns, decor, helpers, vehicles, boss).
2. **Level editing tool.** Use [Tiled](https://www.mapeditor.org/) maps for platforms, spawns and decor
   instead of coordinates typed by hand in `config.js`.
3. **Mission flow.** Mission intro/outro, carrying credits, lives, scores and characters between missions,
   and a debug **stage select** for testing.
4. **New mechanics.** Auto-scroll (bus ride, highway), vertical/multi-level stages (cerros, galleries),
   indoor stages (comisaría), destructible objects, scripted events (the helicopter reveal), simple cutscenes.
5. **New enemies.** Police types, serenazgo, private security, shield, sniper, vehicle enemies. Plus
   4 mid-bosses and 4 bosses.
6. **New vehicles:** Mototaxi Slug, Bus Slug, and possibly the rochabus.
7. **More weapons** (Metal Slug's H/R/F/S/L): e.g. Rockets → "Cohetón", Flame → "Anticuchera", Shotgun.
8. **Art pipeline.** A loader for real sprite sheets + animation definitions so procedural textures can be swapped
   one by one (same texture keys).
9. **Audio.** A music track per mission, voice lines ("¡METRALLETA!", "¡MISIÓN CUMPLIDA!").
10. **Story.** Short dialogue cutscenes between missions.
11. **Playtesting and balance**, difficulty settings.
