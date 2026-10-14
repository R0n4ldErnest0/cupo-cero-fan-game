# Announcer voice clips

The game shouts the item name when you grab a crate ("HEAVY MACHINE GUN!", "¡ANTICUCHERA!"), and the
arcade lines in English like Metal Slug: "Mission 1... start!" at the start of a mission and "Mission complete!"
at the end. Until real clips exist, `src/systems/Voice.js` uses the
browser's speech synthesis (robotic, placeholder).

To use real recordings, put audio files here (`.ogg` or `.mp3`; `.wav` works too) and list them in a
`voices.json` next to this file. Any line without a clip keeps using the placeholder voice.

```json
{
  "mg": "heavy_machine_gun.ogg",
  "rocket": "rocket_launcher.ogg",
  "flame": "anticuchera.ogg",
  "shotgun": "escopeta.ogg",
  "rooster": "gallo.ogg",
  "ball": "fulbito.ogg",
  "drone": "dron.ogg",
  "laser": "laser.ogg",
  "stones": "piedras.ogg",
  "bombs": "bombas.ogg",
  "molotov": "molotov.ogg",
  "super": "super_granada.ogg",
  "start_1": "mission_1_start.ogg",
  "start_2": "mission_2_start.ogg",
  "start_3": "mission_3_start.ogg",
  "start_4": "mission_4_start.ogg",
  "start_final": "mission_final_start.ogg",
  "mission_complete": "mission_complete.ogg"
}
```

| id | Line |
|---|---|
| mg | "Heavy Machine Gun!" (English, like the arcade) |
| rocket | "Rocket Launcher!" (English, like the arcade) |
| flame | "¡Anticuchera!" |
| shotgun | "¡Escopeta!" |
| rooster | "¡Gallo de pelea!" |
| ball | "¡Fulbito!" |
| drone | "¡Dron!" |
| laser | "¡Láser!" |
| stones | "¡Piedras!" |
| bombs | "¡Bombas!" |
| molotov | "¡Molotov!" |
| super | "¡Súper granada!" |
| start_1 … start_4 | "Mission 1… start!" (English, like the arcade) |
| start_final | "Mission final… start!" |
| mission_complete | "Mission complete!" |

Recording tips: one short take per line (under ~1.5 s), deep and over the top, like an arcade
announcer. Trim the silence at the start so it plays the instant you grab the crate. Normalize
all clips to the same loudness. A little reverb/echo helps the arcade feel. Real voices must be
original recordings (never ripped from Metal Slug); AI-generated voices must be disclosed on the
itch.io page.

Note: the clips only load through the dev server (`python tools/serve.py`), not when `index.html`
is opened directly from disk; the placeholder voice is used there.
